#!/bin/bash

PROJECT_DIR="$(pwd)"
USER_NAME="$(whoami)"

echo "Installing Nginx Dashboard..."

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "src/scripts" ]; then
    echo "❌ Error: Please run install.sh from the root of the project directory"
    exit 1
fi

# Make all scripts executable
chmod +x src/scripts/*.sh

# Add sudoers rules for scripts
echo "Setting up sudo permissions..."
sudo tee /etc/sudoers.d/nginx-dashboard > /dev/null << EOF
$USER_NAME ALL=(ALL) NOPASSWD: $PROJECT_DIR/src/scripts/nginx-reload.sh
$USER_NAME ALL=(ALL) NOPASSWD: $PROJECT_DIR/src/scripts/nginx-test.sh
$USER_NAME ALL=(ALL) NOPASSWD: $PROJECT_DIR/src/scripts/nginx-create-config.sh *
$USER_NAME ALL=(ALL) NOPASSWD: $PROJECT_DIR/src/scripts/nginx-edit-config.sh *
$USER_NAME ALL=(ALL) NOPASSWD: $PROJECT_DIR/src/scripts/nginx-delete-config.sh *
$USER_NAME ALL=(ALL) NOPASSWD: $PROJECT_DIR/src/scripts/nginx-rename-config.sh *
$USER_NAME ALL=(ALL) NOPASSWD: $PROJECT_DIR/src/scripts/nginx-enable-site.sh *
$USER_NAME ALL=(ALL) NOPASSWD: $PROJECT_DIR/src/scripts/nginx-disable-site.sh *
EOF

echo "✅ Installation complete!"
echo "You can now run: cd src && npm start"
