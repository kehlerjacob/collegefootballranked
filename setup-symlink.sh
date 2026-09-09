#!/bin/bash
# Flowtrus Theme Symlink Setup Script
# Run this after creating your LocalWP site

echo "🔍 Checking for LocalWP sites..."

# Check if Local Sites directory exists
if [ ! -d "$HOME/Local Sites" ]; then
    echo "❌ LocalWP not found. Please install LocalWP and create a site first."
    echo "   Download: https://localwp.com"
    exit 1
fi

# List available sites
echo ""
echo "📁 Available LocalWP sites:"
ls -1 "$HOME/Local Sites" 2>/dev/null || echo "   No sites found"

echo ""
echo "Enter your LocalWP site name (e.g., flowtrus-dev):"
read SITE_NAME

# Validate site exists
if [ ! -d "$HOME/Local Sites/$SITE_NAME" ]; then
    echo "❌ Site '$SITE_NAME' not found."
    exit 1
fi

# Define paths
THEME_SOURCE="/Users/jacobkehler/Desktop/flowtrus theme"
THEME_DEST="$HOME/Local Sites/$SITE_NAME/app/public/wp-content/themes/flowtrus"

# Check if source exists
if [ ! -d "$THEME_SOURCE" ]; then
    echo "❌ Theme source not found at: $THEME_SOURCE"
    exit 1
fi

# Remove existing theme folder if it exists
if [ -e "$THEME_DEST" ]; then
    echo "⚠️  Removing existing theme at: $THEME_DEST"
    rm -rf "$THEME_DEST"
fi

# Create symlink
echo "🔗 Creating symbolic link..."
ln -s "$THEME_SOURCE" "$THEME_DEST"

# Verify symlink
if [ -L "$THEME_DEST" ]; then
    echo "✅ Symlink created successfully!"
    echo ""
    echo "📍 Theme location: $THEME_DEST"
    echo "🔗 Links to: $THEME_SOURCE"
    echo ""
    echo "Next steps:"
    echo "1. Open LocalWP and click 'WP Admin' for your site"
    echo "2. Go to Appearance > Themes"
    echo "3. Activate the 'Flowtrus' theme"
    echo "4. Start editing files in: /Users/jacobkehler/Desktop/flowtrus theme/"
    echo "5. Changes will appear instantly in WordPress!"
else
    echo "❌ Failed to create symlink"
    exit 1
fi
