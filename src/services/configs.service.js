const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { eq, and, notInArray } = require('drizzle-orm');

const db = require('../db/db');
const { configs } = require('../db/schema');
const { CONFIG_VALIDATION, NGINX_PATH } = require('../config/constants');
const nginx = require('./nginx.service.js');

const getFileHash = (_) => crypto.createHash('sha256').update(_).digest('hex');

const isEnabled = (file) => {
  const enabledPath = path.join(NGINX_PATH.ENABLED, file);
  try {
    fs.readlinkSync(enabledPath);
    return true;
  } catch {
    return false;
  }
}

const getConfigById = (id) => {
  const config = db.select().from(configs).where(eq(configs.id, id)).get()
  if (!config) {
    const err = new Error('Config not found');
    err.status = 404;
    throw err;
  }
  return config;
}

const getConfigByPath = (path) => {
  const config = db.select().from(configs).where(eq(configs.path, path)).get()
  if (!config) {
    const err = new Error('Config not found');
    err.status = 404;
    throw err;
  }
  return config;
}

const test = async () => {
  const test = await nginx.test()
  
  if (test.success) {
    db.update(configs)
      .set({
        validation_status: CONFIG_VALIDATION.VALID,
        validation_error: null,
      })
      .where(eq(configs.enabled, true))
      .run();
    
    return test;
  }
  
  const errorPaths = Object.keys(test.errors);
  
  for (const filePath in test.errors) {
    db.update(configs)
      .set({
        validation_status: CONFIG_VALIDATION.INVALID,
        validation_error: test.errors[filePath]
      })
      .where(eq(configs.path, filePath))
      .run();
  }
  db.update(configs)
    .set({
      validation_status: CONFIG_VALIDATION.VALID,
      validation_error: null,
    })
    .where(
      and(
        eq(configs.enabled, true),
        notInArray(configs.path, errorPaths)
      )
    )
    .run();
  
  return test
}

const initSync = async () => {
  const files = fs.readdirSync(NGINX_PATH.AVAILABLE);
  
  for (const file of files) {
    const fullPath = path.join(NGINX_PATH.AVAILABLE, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const hash = getFileHash(content);
    const enabled = isEnabled(file);
    
    const existing = db.select().from(configs).where(eq(configs.path, fullPath)).get();
    
    if (!existing || existing.hash !== hash || existing.enabled !== enabled) {
      if (existing) {
        // update config record
        db.update(configs)
          .set({
            content,
            hash,
            enabled,
            validation_status: CONFIG_VALIDATION.UNKNOWN,
            last_modified: new Date(),
          })
          .where(eq(configs.id, existing.id))
          .run();
        console.log(`🔄 Updated config: ${file}`);
      } else {
        // create config record
        db.insert(configs).values({
          path: fullPath,
          content,
          hash,
          enabled,
          validation_status: CONFIG_VALIDATION.UNKNOWN,
          last_modified: new Date()
        }).run();
        console.log(`✅ Synced new config: ${file}`);
      }
    }
  }
  if (files.length) await test()
}

const list = () => db.select().from(configs).all();

// Enable nginx config
// => test
// if bad => disable back
// if ok  => update db record and reload
const enableConfig = async (id) => {
  const cfg = getConfigById(id)
  if (cfg.enabled) return cfg;
  
  await nginx.enableConfig(cfg.path, NGINX_PATH.ENABLED)
  
  const t = await test()
  
  if (!t.success) {
    await nginx.disableConfig(cfg.path, NGINX_PATH.ENABLED)
    
    return { config: getConfigById(id), errors: t.errors }
  }
  
  db.update(configs)
    .set({
      enabled: true,
      validation_status: CONFIG_VALIDATION.VALID,
      validation_error: null
    })
    .where(eq(configs.id, id))
    .run();
  
  await nginx.reload()
  
  return { config: getConfigById(id) };
}

const disableConfig = async (id) => {
  const cfg = getConfigById(id)
  if (!cfg.enabled) return cfg;
  
  const symlinkPath = path.join(NGINX_PATH.ENABLED, path.basename(cfg.path));
  await nginx.disableConfig(symlinkPath)
  await nginx.reload()
  
  db.update(configs).set({ enabled: false }).where(eq(configs.id, id)).run()
  
  return { config: { ...cfg, enabled: false } };
}

// create config. if successful, create db record
const createConfig = async (name, content) => {
  // TODO: validate content
  
  const configPath = path.join(NGINX_PATH.AVAILABLE, name);
  const hash = getFileHash(content)
  
  await nginx.createConfig(configPath, content)
  
  const res = db.insert(configs).values({
    path: configPath,
    content,
    hash,
    enabled: false,
    validation_status: CONFIG_VALIDATION.UNKNOWN,
    last_modified: new Date()
  }).run();
  
  return { config: getConfigByPath(configPath) };
}

const updateConfigContent = async (id, content) => {
  // todo validation
  
  const cfg = getConfigById(id)
  
  await nginx.editConfig(cfg.path, content)
  
  const hash = getFileHash(content)
  
  if (!cfg.enabled) {
    db.update(configs)
      .set({
        validation_status: CONFIG_VALIDATION.UNKNOWN,
        validation_error: null,
        content,
        hash,
        last_modified: new Date()
      })
      .where(eq(configs.id, id))
      .run();
    
    return { config: getConfigById(id) }
  }
  
  const t = await test()
  
  if (t.success) {
    await nginx.reload()
    
    db.update(configs)
      .set({
        validation_status: CONFIG_VALIDATION.VALID,
        validation_error: null,
        content,
        hash,
        last_modified: new Date()
      })
      .where(eq(configs.id, id))
      .run();
    
    return { config: getConfigById(id) }
  }
  
  // cfg marked as enabled but we got test error
  await disableConfig(id)
  
  db.update(configs)
    .set({
      validation_status: CONFIG_VALIDATION.INVALID,
      validation_error: t.errors[cfg.path],
      content,
      hash,
      last_modified: new Date()
    })
    .where(eq(configs.id, id))
    .run();
  
  return { config: getConfigById(id), errors: t.errors }
}

const deleteConfig = async (id) => {
  const cfg = getConfigById(id)
  
  if (!cfg.enabled) {
    await nginx.deleteConfig(cfg.path)
    db.delete(configs).where(eq(configs.id, id)).run();
    return
  }
  
  const symlinkPath = path.join(NGINX_PATH.ENABLED, path.basename(cfg.path));
  
  await nginx.deleteConfig(cfg.path, symlinkPath)
  await nginx.reload()
  db.delete(configs).where(eq(configs.id, id)).run();
  return
}

const reload = async () => {
  await nginx.reload()
}

initSync()

module.exports = {
  list,
  getConfigById,
  test,
  enableConfig,
  disableConfig,
  createConfig,
  updateConfigContent,
  deleteConfig,
  reload
};