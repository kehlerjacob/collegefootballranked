# Flowtrus Theme Development Workflow

## Setup (One-Time)

### Step 1: Install LocalWP
1. Download LocalWP: https://localwp.com (free)
2. Install and open LocalWP
3. Click "Create a new site"
4. Name it "Flowtrus Dev" (or similar)
5. Choose "Preferred" environment
6. Set up WordPress admin credentials
7. Click "Add Site"

### Step 2: Create Symbolic Link
Once LocalWP creates your site, run this command in Terminal:

```bash
# Find your LocalWP site path (usually in ~/Local Sites/)
# Then create the symlink:

ln -s "/Users/jacobkehler/Desktop/flowtrus theme" "$HOME/Local Sites/Flowtrus Dev/app/public/wp-content/themes/flowtrus"
```

### Step 3: Activate Theme
1. In LocalWP, click "WP Admin" to open WordPress dashboard
2. Go to Appearance > Themes
3. Activate "Flowtrus" theme
4. Set up pages and menus as described in README.md

---

## Daily Development Workflow

### 1. Edit Files on Desktop
- Open files in `/Users/jacobkehler/Desktop/flowtrus theme/` with your code editor
- Make changes to any PHP, CSS, or JS files
- Changes appear **instantly** in your local WordPress site

### 2. Test Locally
- View changes at: http://flowtrus-dev.local (or whatever LocalWP URL)
- Test all pages and functionality
- Fix any issues

### 3. Deploy to Bluehost (When Ready)

#### Option A: Manual Upload via Bluehost File Manager
1. Log into Bluehost cPanel
2. Go to File Manager
3. Navigate to `public_html/wp-content/themes/`
4. Delete old `flowtrus` folder (if exists)
5. Upload entire theme folder from Desktop
6. Extract if zipped

#### Option B: FTP Upload (Recommended)
1. Download FileZilla (free): https://filezilla-project.org
2. Connect to Bluehost:
   - Host: ftp.yourdomain.com
   - Username: [from Bluehost]
   - Password: [from Bluehost]
   - Port: 21
3. Navigate to `/public_html/wp-content/themes/`
4. Upload `flowtrus theme` folder
5. Rename to `flowtrus` (remove space)

#### Option C: Rsync via SSH (Advanced)
If Bluehost has SSH enabled:

```bash
rsync -avz --delete \
  "/Users/jacobkehler/Desktop/flowtrus theme/" \
  username@yourdomain.com:~/public_html/wp-content/themes/flowtrus/
```

---

## Quick Reference

### Local Development
- **Edit:** `/Users/jacobkehler/Desktop/flowtrus theme/`
- **View:** http://flowtrus-dev.local
- **Admin:** http://flowtrus-dev.local/wp-admin

### Production (Bluehost)
- **Location:** `public_html/wp-content/themes/flowtrus/`
- **View:** https://yourdomain.com
- **Admin:** https://yourdomain.com/wp-admin

---

## Tips

1. **Always develop locally first** - Never edit directly on Bluehost
2. **Test thoroughly** before deploying to production
3. **Keep Desktop folder as source of truth** - All edits happen here
4. **Use Git** (optional) - Version control your theme:
   ```bash
   cd "/Users/jacobkehler/Desktop/flowtrus theme"
   git init
   git add .
   git commit -m "Initial theme"
   ```

5. **Backup before deploying** - Download current Bluehost theme before uploading new version

---

## Troubleshooting

### Symlink not working?
Check if it exists:
```bash
ls -la "$HOME/Local Sites/Flowtrus Dev/app/public/wp-content/themes/"
```

Remove and recreate:
```bash
rm "$HOME/Local Sites/Flowtrus Dev/app/public/wp-content/themes/flowtrus"
ln -s "/Users/jacobkehler/Desktop/flowtrus theme" "$HOME/Local Sites/Flowtrus Dev/app/public/wp-content/themes/flowtrus"
```

### Theme not showing in WordPress?
- Make sure `style.css` has proper theme header
- Check file permissions
- Refresh WordPress themes page

### Changes not appearing?
- Clear browser cache (Cmd+Shift+R)
- Disable WordPress caching plugins
- Check if editing correct file location
