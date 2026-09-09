# Flowtrus WordPress Theme

A modern, elegant WordPress theme designed for Flowtrus - conversion optimization and form solutions for businesses, agencies, and service providers.

## Theme Information

- **Theme Name:** Flowtrus
- **Version:** 1.0.0
- **Author:** Flowtrus Team
- **License:** GPL v2 or later

## Features

- ✅ Custom page templates for Home, About, Solutions, Demo, Contact, and Case Studies
- ✅ Custom post type for Case Studies
- ✅ Block Editor (Gutenberg) compatible
- ✅ Responsive design (mobile-first)
- ✅ SEO optimized (Yoast SEO integration)
- ✅ Form integration ready (shortcode and CSS trigger support)
- ✅ Analytics visualization components
- ✅ Multiple industry templates (service booking, quote estimates, SaaS onboarding, logistics, catering, home services)
- ✅ Modern color palette (Navy, Teal, Green)
- ✅ Montserrat & Inter typography

## Installation

### Method 1: Upload via WordPress Admin

1. Go to **Appearance > Themes > Add New**
2. Click **Upload Theme**
3. Choose the theme ZIP file
4. Click **Install Now**
5. Activate the theme

### Method 2: Manual Installation

1. Upload the `flowtrus-theme` folder to `/wp-content/themes/`
2. Go to **Appearance > Themes**
3. Activate the Flowtrus theme

## Setup Instructions

### 1. Configure Menus

1. Go to **Appearance > Menus**
2. Create a new menu called "Primary Menu"
3. Add pages: Home, About, Solutions, Case Studies, Blog, Contact, Demo
4. Assign to "Primary Menu" location
5. Create a "Footer Menu" with legal/secondary links

### 2. Set Up Pages

Create the following pages and assign templates:

- **Home** - Set as static front page, uses `front-page.php` automatically
- **About** - Template: About Page
- **Solutions** - Template: Solutions Page
- **Demo** - Template: Demo Page
- **Contact** - Template: Contact Page
- **Case Studies** - Template: Case Studies
- **Blog** - Set as posts page in Settings > Reading

### 3. Configure Theme Settings

1. Go to **Appearance > Customize**
2. Set your logo under **Site Identity > Logo**
3. Configure **Header CTA Button** text and URL
4. Set colors if needed (theme uses predefined brand colors)

### 4. Add Widget Content

1. Go to **Appearance > Widgets**
2. Add content to Footer Widget Area 1, 2, and 3
3. Suggested widgets:
   - Footer 1: About/Company Info
   - Footer 2: Quick Links
   - Footer 3: Contact Information

### 5. Create Case Studies

1. Go to **Case Studies > Add New**
2. Add title, content, and featured image
3. Use custom fields for metrics if needed
4. Publish case studies

## Flowtrus Form Integration

### Using Shortcodes

Add forms anywhere using shortcodes:

```
[flowtrus_form id="your-form-id"]
```

Example:
```
[flowtrus_form id="service-booking"]
```

### Using CSS Triggers

Add the `flowtrus-trigger` class to any button or link:

```html
<button class="btn btn-primary flowtrus-trigger" data-form-id="contact">
    Get Started
</button>
```

### Integration Steps

1. Replace placeholder shortcode in `functions.php` with your actual Flowtrus script
2. Update the JavaScript trigger handler in `assets/js/main.js`
3. Test form integration on Demo page

## Customization

### Colors

Edit CSS custom properties in `style.css`:

```css
:root {
  --color-primary: #1a4d7c;
  --color-secondary: #2d9b9b;
  --color-accent: #6bc47d;
}
```

### Typography

Fonts are loaded from Google Fonts in `functions.php`:
- **Headings:** Montserrat (400, 500, 600, 700, 800)
- **Body:** Inter (400, 500, 600, 700)

### Adding Custom CSS

Use **Appearance > Customize > Additional CSS** for minor tweaks.

## Required Plugins

- **Yoast SEO** (recommended) - Already integrated

## Recommended Plugins

- **Contact Form 7** - For backup contact forms
- **WP Super Cache** - For performance
- **Wordfence Security** - For security
- **UpdraftPlus** - For backups

## File Structure

```
flowtrus-theme/
├── style.css                 # Main stylesheet & theme header
├── functions.php             # Theme functions and setup
├── header.php                # Site header
├── footer.php                # Site footer
├── index.php                 # Default template
├── front-page.php            # Homepage template
├── page-about.php            # About page template
├── page-solutions.php        # Solutions page template
├── page-demo.php             # Demo page template
├── page-contact.php          # Contact page template
├── page-case-studies.php     # Case studies archive
├── archive.php               # Blog archive
├── single.php                # Single blog post
├── single-case-study.php     # Single case study
├── assets/
│   ├── js/
│   │   └── main.js          # JavaScript functionality
│   └── images/
│       ├── flowtrus-logo.png
│       └── README.md        # Image guidelines
└── README.md                # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized CSS with custom properties
- Minimal JavaScript dependencies
- Lazy loading ready
- Mobile-first responsive design

## Support

For theme support and customization:
- Email: hello@flowtrus.com
- Documentation: [Add your docs URL]

## Changelog

### Version 1.0.0
- Initial release
- All core page templates
- Case study custom post type
- Form integration framework
- Analytics visualization components
- Responsive design
- SEO optimization

## Credits

- **Design & Development:** Flowtrus Team
- **Fonts:** Google Fonts (Montserrat, Inter)
- **Icons:** Unicode emoji (can be replaced with icon font)

## License

This theme is licensed under the GPL v2 or later.
