const { exec, spawn } = require('child_process');
const path = require('path');

const scripts = path.join(__dirname, '../scripts')

const executeScript = (script, args = []) => {
  const scriptPath = path.join(scripts, script);
  const command = `sudo ${scriptPath} ${args.join(' ')}`;
  
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ stdout, stderr });
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

const spawnScript = async (script, config, content) => {
  const scriptPath = path.join(scripts, script);
  
  return new Promise((resolve, reject) => {
    const child = spawn('sudo', [scriptPath, config]);
    
    child.stdin.write(content);
    child.stdin.end();
    
    let output = '';
    child.stdout.on('data', (data) => output += data.toString());
    
    child.stderr.on('data', (err) => console.error('stderr:', err.toString()));
    
    child.on('close', (code) => {
      code === 0 ?
        resolve(output.trim()) :
        reject(new Error('Script failed:\n' + output));
    });
  });
}

const parseNginxErrors = (output) => {
  const lines = output.split('\n');
  const errors = {};
  
  for (const line of lines) {
    const match = line.match(/\[(?:emerg|error|warn)\].*in (.+?):(\d+)(?::|\s)(.+)/);
    if (match) {
      const [, filePath, lineNumber, message] = match;
      const errorMsg = `${lineNumber} - ${message.trim()}`;
      if (errors[filePath]) {
        errors[filePath] += `\n${errorMsg}`;
      } else {
        errors[filePath] = errorMsg;
      }
    }
  }
  
  return errors;
};

const nginx = {
  reload: async () => executeScript('nginx-reload.sh'),
  test: async () => {
    try {
      const output = await executeScript('nginx-test.sh');
      return { success: true, output };
    } catch ({ stdout, stderr }) {
      const errors = parseNginxErrors(stderr || stdout);
      return { success: false, errors };
    }
  },
  createConfig: async (config, content) => spawnScript('nginx-create-config.sh', config, content),
  editConfig: async (config, content) => spawnScript('nginx-edit-config.sh', config, content),
  enableConfig: async (path, pathToEnabled) => executeScript('nginx-enable-site.sh', [path, pathToEnabled]),
  disableConfig: async (path) => executeScript('nginx-disable-site.sh', [path]),
  renameConfig: async (pathToAvailable, oldName, newName, pathToEnabled = null) => {
    const params = [pathToAvailable, oldName, newName, pathToEnabled].filter((a) => !!a)
    return executeScript('nginx-rename-config.sh', params)
  },
  deleteConfig: async (pathToAvailable, pathToEnabled = null) => {
    const params = [pathToAvailable, pathToEnabled].filter((a) => !!a)
    return executeScript('nginx-delete-config.sh', params)
  }
}

module.exports = nginx;