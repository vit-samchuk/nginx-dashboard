const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { eq, and } = require('drizzle-orm');
const db = require('../db/db');
const { configs } = require('../db/schema');
const { CONFIG_VALIDATION, NGINX_PATH } = require('../config/constants');

function getFileHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function isEnabled(file) {
  const enabledPath = path.join(NGINX_PATH.ENABLED, file);
  try {
    fs.readlinkSync(enabledPath);
    return true;
  } catch {
    return false;
  }
}


async function initSync() {
  const files = fs.readdirSync(NGINX_PATH.AVAILABLE);

  for (const file of files) {
    const fullPath = path.join(NGINX_PATH.AVAILABLE, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const hash = getFileHash(content);
    const enabled = isEnabled(file);

    const existing = db.select().from(configs).where(eq(configs.path, fullPath)).get();

    if (!existing || existing.hash !== hash || existing.enable !== enabled) {
      if (existing) {
        // update config record
        db.update(configs)
          .set({
            content,
            hash,
            enabled,
            validation_status: CONFIG_VALIDATION.UNKNOWN,
            last_modified: Date.now(),
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
          last_modified: Date.now()
        }).run();
        console.log(`✅ Synced new config: ${file}`);
      }
    }
  }
}

const list = () => db.select().from(configs).all()

initSync()
module.exports = {
  list,
};
