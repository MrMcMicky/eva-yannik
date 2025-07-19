#!/bin/bash

# Eva & Yannik Website Deployment Script

echo "🚀 Deploying Eva & Yannik Website..."

# Pull latest changes from git
echo "📦 Pulling latest changes from git..."
git pull origin main

# Choose version to deploy
echo ""
echo "Available versions:"
echo "1) 3.5.3 Stable"
echo "2) 3.5.4 Beta"
echo ""
read -p "Which version to deploy? (1 or 2): " version_choice

case $version_choice in
    1)
        VERSION="3.5.3 Stable"
        ;;
    2)
        VERSION="3.5.4 Beta"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

# Update symlink
echo "🔗 Updating symlink to $VERSION..."
rm -f current
ln -s "$VERSION" current

# Test nginx configuration
echo "🔍 Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    echo "✅ Deployment complete!"
    echo "🌐 Website is live at: https://eva-yannik.assistent.my.id"
else
    echo "❌ Nginx configuration test failed. Please fix the configuration."
    exit 1
fi