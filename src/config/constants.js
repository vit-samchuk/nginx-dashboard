module.exports = {
  COOKIE_NAME: process.env.COOKIE_NAME || 'auth_token',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
  CONFIG_VALIDATION: {
    UNKNOWN: 'unknown',
    VALID: 'valid',
    INVALID: 'invalid',
  },
  BACKUP_REASON: {
    AUTO_BEFORE_UPDATE: 'auto_before_update',
    FILE_DELETED: 'file_deleted',
    EXTERNAL_CHANGE: 'external_change'
  },
  NGINX_PATH: {
    AVAILABLE: process.env.NGINX_AVAILABLE_DIR || '/etc/nginx/sites-available',
    ENABLED: process.env.NGINX_ENABLED_DIR || '/etc/nginx/sites-enabled'
  }
};