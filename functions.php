<?php
/**
 * Flowtrus Theme Functions
 * 
 * @package Flowtrus
 * @version 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function flowtrus_setup()
{
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails
    add_theme_support('post-thumbnails');
    set_post_thumbnail_size(1200, 675, true);

    // Add custom image sizes
    add_image_size('flowtrus-hero', 1920, 1080, true);
    add_image_size('flowtrus-card', 600, 400, true);
    add_image_size('flowtrus-thumbnail', 400, 300, true);

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'flowtrus'),
        'footer' => __('Footer Menu', 'flowtrus'),
    ));

    // Switch default core markup to output valid HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));

    // Add theme support for selective refresh for widgets
    add_theme_support('customize-selective-refresh-widgets');

    // Add support for custom logo
    add_theme_support('custom-logo', array(
        'height' => 100,
        'width' => 400,
        'flex-height' => true,
        'flex-width' => true,
    ));

    // Add support for Block Styles
    add_theme_support('wp-block-styles');

    // Add support for full and wide align images
    add_theme_support('align-wide');

    // Add support for editor styles
    add_theme_support('editor-styles');

    // Add support for responsive embedded content
    add_theme_support('responsive-embeds');
}
add_action('after_setup_theme', 'flowtrus_setup');

/**
 * Enqueue Scripts and Styles
 */
function flowtrus_scripts()
{
    // Google Fonts
    wp_enqueue_style(
        'flowtrus-fonts',
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap',
        array(),
        null
    );

    // Main stylesheet - use filemtime for cache busting during development
    wp_enqueue_style('flowtrus-style', get_stylesheet_uri(), array(), filemtime(get_template_directory() . '/style.css'));

    // Main JavaScript
    wp_enqueue_script(
        'flowtrus-main',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        filemtime(get_template_directory() . '/assets/js/main.js'),
        true
    );

    // ROI Calculator & Mock Form (Front Page & Pricing Page)
    if (is_front_page() || is_page_template('page-pricing.php')) {
        wp_enqueue_script(
            'flowtrus-roi-calc',
            get_template_directory_uri() . '/assets/js/roi-calculator.js',
            array(),
            '1.0.1',
            true
        );

        wp_enqueue_script(
            'mock-form',
            get_template_directory_uri() . '/assets/js/mock-form.js',
            array(),
            '1.0.1',
            true
        );
    }

    // Swiper CSS
    wp_enqueue_style(
        'swiper-css',
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
        array(),
        '11.0.0'
    );

    // Carousel custom CSS
    wp_enqueue_style(
        'flowtrus-carousel-css',
        get_template_directory_uri() . '/assets/css/carousel.css',
        array('swiper-css'),
        filemtime(get_template_directory() . '/assets/css/carousel.css')
    );

    // Swiper JavaScript
    wp_enqueue_script(
        'swiper-js',
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
        array(),
        '11.0.0',
        true
    );

    // Carousel initialization
    wp_enqueue_script(
        'flowtrus-carousel',
        get_template_directory_uri() . '/assets/js/carousel.js',
        array('swiper-js'),
        filemtime(get_template_directory() . '/assets/js/carousel.js'),
        true
    );

    // Flowtrus SDK - Only load on demo page
    if (is_page_template('page-demo.php')) {
        wp_enqueue_style(
            'flowtrus-modal-css',
            get_template_directory_uri() . '/assets/css/flowtrus-modal.css',
            array(),
            filemtime(get_template_directory() . '/assets/css/flowtrus-modal.css')
        );

        wp_enqueue_script(
            'flowtrus-sdk',
            get_template_directory_uri() . '/assets/js/flowtrus-sdk.js',
            array('jquery'),
            '1.0.3',
            true
        );

        // Localize script to pass AJAX URL
        wp_localize_script('flowtrus-sdk', 'flowtrusData', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'restUrl' => get_rest_url(null, 'flowtrus/v1'),
            'nonce' => wp_create_nonce('flowtrus_nonce')
        ));
    }

    // Comment reply script
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'flowtrus_scripts');

/**
 * Register Widget Areas
 */
function flowtrus_widgets_init()
{
    // Sidebar
    register_sidebar(array(
        'name' => __('Sidebar', 'flowtrus'),
        'id' => 'sidebar-1',
        'description' => __('Add widgets here to appear in your sidebar.', 'flowtrus'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget' => '</section>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));

    // Footer Widget Areas
    for ($i = 1; $i <= 3; $i++) {
        register_sidebar(array(
            'name' => sprintf(__('Footer Widget Area %d', 'flowtrus'), $i),
            'id' => 'footer-' . $i,
            'description' => sprintf(__('Footer widget area %d', 'flowtrus'), $i),
            'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
            'after_widget' => '</div>',
            'before_title' => '<h3 class="widget-title">',
            'after_title' => '</h3>',
        ));
    }
}
add_action('widgets_init', 'flowtrus_widgets_init');

/**
 * Register Custom Post Type: Case Studies
 */
function flowtrus_register_case_studies()
{
    $labels = array(
        'name' => _x('Case Studies', 'Post Type General Name', 'flowtrus'),
        'singular_name' => _x('Case Study', 'Post Type Singular Name', 'flowtrus'),
        'menu_name' => __('Case Studies', 'flowtrus'),
        'name_admin_bar' => __('Case Study', 'flowtrus'),
        'archives' => __('Case Study Archives', 'flowtrus'),
        'attributes' => __('Case Study Attributes', 'flowtrus'),
        'parent_item_colon' => __('Parent Case Study:', 'flowtrus'),
        'all_items' => __('All Case Studies', 'flowtrus'),
        'add_new_item' => __('Add New Case Study', 'flowtrus'),
        'add_new' => __('Add New', 'flowtrus'),
        'new_item' => __('New Case Study', 'flowtrus'),
        'edit_item' => __('Edit Case Study', 'flowtrus'),
        'update_item' => __('Update Case Study', 'flowtrus'),
        'view_item' => __('View Case Study', 'flowtrus'),
        'view_items' => __('View Case Studies', 'flowtrus'),
        'search_items' => __('Search Case Study', 'flowtrus'),
        'not_found' => __('Not found', 'flowtrus'),
        'not_found_in_trash' => __('Not found in Trash', 'flowtrus'),
    );

    $args = array(
        'label' => __('Case Study', 'flowtrus'),
        'description' => __('Customer case studies and success stories', 'flowtrus'),
        'labels' => $labels,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'taxonomies' => array('category', 'post_tag'),
        'hierarchical' => false,
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-chart-line',
        'show_in_admin_bar' => true,
        'show_in_nav_menus' => true,
        'can_export' => true,
        'has_archive' => true,
        'exclude_from_search' => false,
        'publicly_queryable' => true,
        'capability_type' => 'post',
        'show_in_rest' => true,
    );

    register_post_type('case_study', $args);
}
add_action('init', 'flowtrus_register_case_studies');

/**
 * Custom Excerpt Length
 */
function flowtrus_excerpt_length($length)
{
    return 30;
}
add_filter('excerpt_length', 'flowtrus_excerpt_length');

/**
 * Custom Excerpt More
 */
function flowtrus_excerpt_more($more)
{
    return '...';
}
add_filter('excerpt_more', 'flowtrus_excerpt_more');

/**
 * Add Custom Body Classes
 */
function flowtrus_body_classes($classes)
{
    // Add class if sidebar is active
    if (!is_active_sidebar('sidebar-1')) {
        $classes[] = 'no-sidebar';
    }

    // Add page slug to body class
    if (is_page()) {
        global $post;
        $classes[] = 'page-' . $post->post_name;
    }

    return $classes;
}
add_filter('body_class', 'flowtrus_body_classes');

/**
 * Yoast SEO Breadcrumbs Support
 */
function flowtrus_yoast_breadcrumbs()
{
    if (function_exists('yoast_breadcrumb')) {
        yoast_breadcrumb('<div class="breadcrumbs container">', '</div>');
    }
}

/**
 * Custom Template Tags
 */

// Display post meta information
function flowtrus_posted_on()
{
    $time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';

    $time_string = sprintf(
        $time_string,
        esc_attr(get_the_date('c')),
        esc_html(get_the_date())
    );

    echo '<span class="posted-on">' . $time_string . '</span>';
}

// Display post author
function flowtrus_posted_by()
{
    echo '<span class="byline"> by <a href="' . esc_url(get_author_posts_url(get_the_author_meta('ID'))) . '">' . esc_html(get_the_author()) . '</a></span>';
}

/**
 * Flowtrus Form Shortcode Integration Helper
 * 
 * Usage:
 *   Inline Form: [flowtrus_form id="form_123"]
 *   Modal Trigger: [flowtrus_button id="form_123" text="Book Now" class="btn btn-primary"]
 */
function flowtrus_form_shortcode($atts)
{
    $atts = shortcode_atts(array(
        'id' => '',
        'type' => 'default',
        'key' => '',
        'client_id' => '',
        'class' => '',
        'style' => '',
        'container_style' => ''
    ), $atts);

    $form_id = !empty($atts['id']) ? esc_attr($atts['id']) : (!empty($atts['key']) ? esc_attr($atts['key']) : '');
    $client_attr = !empty($atts['client_id']) ? ' data-client-id="' . esc_attr($atts['client_id']) . '"' : '';
    $extra_class = !empty($atts['class']) ? ' ' . esc_attr($atts['class']) : '';
    
    $container_style = !empty($atts['style']) ? esc_attr($atts['style']) : (!empty($atts['container_style']) ? esc_attr($atts['container_style']) : '');
    $style_attr = !empty($container_style) ? ' data-container-style="' . $container_style . '"' : '';

    if (!empty($form_id)) {
        return '<div class="flowtrus-form-embed flowtrus-inline-wrapper' . $extra_class . '" data-form-id="' . $form_id . '"' . $client_attr . $style_attr . '></div>';
    }

    return '<div class="flowtrus-form-embed flowtrus-inline-wrapper' . $extra_class . '"' . $client_attr . $style_attr . '></div>';
}
add_shortcode('flowtrus_form', 'flowtrus_form_shortcode');
add_shortcode('flowtrus-form', 'flowtrus_form_shortcode');
add_shortcode('flowtrus', 'flowtrus_form_shortcode');

function flowtrus_button_shortcode($atts, $content = null)
{
    $atts = shortcode_atts(array(
        'id' => '',
        'form_id' => '',
        'text' => 'Get Started',
        'class' => 'btn btn-primary',
        'client_id' => ''
    ), $atts);

    $form_id = !empty($atts['id']) ? esc_attr($atts['id']) : (!empty($atts['form_id']) ? esc_attr($atts['form_id']) : '');
    $button_text = !empty($content) ? esc_html($content) : esc_html($atts['text']);
    $class = esc_attr($atts['class']);
    $client_attr = !empty($atts['client_id']) ? ' data-client-id="' . esc_attr($atts['client_id']) . '"' : '';
    $form_attr = !empty($form_id) ? ' data-form-id="' . $form_id . '"' : '';

    return '<button type="button" class="flowtrus-trigger ' . $class . '"' . $form_attr . $client_attr . '>' . $button_text . '</button>';
}
add_shortcode('flowtrus_button', 'flowtrus_button_shortcode');
add_shortcode('flowtrus-button', 'flowtrus_button_shortcode');
add_shortcode('flowtrus_trigger', 'flowtrus_button_shortcode');

/**
 * Customizer Additions
 */
function flowtrus_customize_register($wp_customize)
{
    // Add CTA Button Section
    $wp_customize->add_section('flowtrus_cta', array(
        'title' => __('Header CTA Button', 'flowtrus'),
        'priority' => 30,
    ));

    // CTA Button Text
    $wp_customize->add_setting('flowtrus_cta_text', array(
        'default' => 'Get Started',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('flowtrus_cta_text', array(
        'label' => __('CTA Button Text', 'flowtrus'),
        'section' => 'flowtrus_cta',
        'type' => 'text',
    ));

    // CTA Button URL
    $wp_customize->add_setting('flowtrus_cta_url', array(
        'default' => '#',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control('flowtrus_cta_url', array(
        'label' => __('CTA Button URL', 'flowtrus'),
        'section' => 'flowtrus_cta',
        'type' => 'url',
    ));

    // Custom Scripts Section (Head & Footer)
    $wp_customize->add_section('flowtrus_custom_scripts', array(
        'title' => __('Custom Scripts & Integrations', 'flowtrus'),
        'description' => __('Add Flowtrus form/tracking scripts, header code, or custom snippets.', 'flowtrus'),
        'priority' => 35,
    ));

    // Head Scripts Setting (<head>)
    $wp_customize->add_setting('flowtrus_head_scripts', array(
        'default' => '',
        'type' => 'option',
        'capability' => 'edit_theme_options',
        'sanitize_callback' => 'flowtrus_sanitize_raw_code',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('flowtrus_head_scripts', array(
        'label' => __('Header Scripts (<head>)', 'flowtrus'),
        'description' => __('Scripts and HTML entered here will be output directly in the <head> tag across the site.', 'flowtrus'),
        'section' => 'flowtrus_custom_scripts',
        'type' => 'textarea',
    ));

    // Footer Scripts Setting (before </body>)
    $wp_customize->add_setting('flowtrus_footer_scripts', array(
        'default' => '',
        'type' => 'option',
        'capability' => 'edit_theme_options',
        'sanitize_callback' => 'flowtrus_sanitize_raw_code',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('flowtrus_footer_scripts', array(
        'label' => __('Footer Scripts (before </body>)', 'flowtrus'),
        'description' => __('Scripts and HTML entered here will be output right before the closing </body> tag.', 'flowtrus'),
        'section' => 'flowtrus_custom_scripts',
        'type' => 'textarea',
    ));

    // Hero Form Showcase Section
    $wp_customize->add_section('flowtrus_hero_showcase_section', array(
        'title' => __('Hero Form Showcase Slider', 'flowtrus'),
        'description' => __('Configure live interactive form shortcodes to display in a tabbed slider in the homepage hero section.', 'flowtrus'),
        'priority' => 36,
    ));

    // Enable Showcase
    $wp_customize->add_setting('flowtrus_hero_showcase_enable', array(
        'default' => '1',
        'type' => 'option',
        'capability' => 'edit_theme_options',
        'sanitize_callback' => 'sanitize_text_field',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('flowtrus_hero_showcase_enable', array(
        'label' => __('Enable Hero Form Slider', 'flowtrus'),
        'description' => __('Displays an interactive form showcase slider to the right of the hero text on the homepage.', 'flowtrus'),
        'section' => 'flowtrus_hero_showcase_section',
        'type' => 'checkbox',
    ));

    // Showcase Badge
    $wp_customize->add_setting('flowtrus_hero_showcase_badge', array(
        'default' => '✨ Live Interactive Form Demo',
        'type' => 'option',
        'capability' => 'edit_theme_options',
        'sanitize_callback' => 'sanitize_text_field',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('flowtrus_hero_showcase_badge', array(
        'label' => __('Showcase Card Top Badge', 'flowtrus'),
        'section' => 'flowtrus_hero_showcase_section',
        'type' => 'text',
    ));

    // Showcase Slides Raw
    $wp_customize->add_setting('flowtrus_hero_slides_raw', array(
        'default' => '',
        'type' => 'option',
        'capability' => 'edit_theme_options',
        'sanitize_callback' => 'flowtrus_sanitize_raw_code',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('flowtrus_hero_slides_raw', array(
        'label' => __('Form Slides (One per line: Title | Shortcode | Tag)', 'flowtrus'),
        'description' => __('Format: Title | [flowtrus_form id="..."] | Tag' . "\n" . 'Example:' . "\n" . 'Home Services | [flowtrus_form id="LhOxsSHbmRt0t6SfAeOi"] | 3-Step Flow' . "\n" . 'Roofing Quote | [flowtrus_form id="service-booking"] | Instant Booking'),
        'section' => 'flowtrus_hero_showcase_section',
        'type' => 'textarea',
    ));
}
add_action('customize_register', 'flowtrus_customize_register');

/**
 * Sanitize callback for custom script fields
 */
function flowtrus_sanitize_raw_code($content)
{
    if (current_user_can('unfiltered_html')) {
        return $content;
    }
    return wp_kses_post($content);
}

/**
 * Helper function to retrieve Hero Form Showcase Slides
 */
function flowtrus_get_hero_slides()
{
    $raw_slides = get_option('flowtrus_hero_slides_raw', '');
    $slides = array();

    if (!empty($raw_slides)) {
        $lines = explode("\n", str_replace("\r", "", $raw_slides));
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            
            $parts = array_map('trim', explode('|', $line));
            $title = !empty($parts[0]) ? $parts[0] : 'Example Form';
            $shortcode_or_id = !empty($parts[1]) ? $parts[1] : '';
            $badge = !empty($parts[2]) ? $parts[2] : '';

            if (!empty($shortcode_or_id)) {
                if (strpos($shortcode_or_id, '[') === false) {
                    $shortcode = '[flowtrus_form id="' . esc_attr($shortcode_or_id) . '"]';
                } else {
                    $shortcode = $shortcode_or_id;
                }

                $slides[] = array(
                    'title' => $title,
                    'shortcode' => $shortcode,
                    'badge' => $badge
                );
            }
        }
    }

    // Check individual slide settings if raw is empty
    if (empty($slides)) {
        for ($i = 1; $i <= 5; $i++) {
            $title = get_option("flowtrus_hero_slide_{$i}_title", '');
            $code = get_option("flowtrus_hero_slide_{$i}_code", '');
            $badge = get_option("flowtrus_hero_slide_{$i}_badge", '');

            if (!empty($code)) {
                if (strpos($code, '[') === false) {
                    $shortcode = '[flowtrus_form id="' . esc_attr($code) . '"]';
                } else {
                    $shortcode = $code;
                }
                $slides[] = array(
                    'title' => !empty($title) ? $title : "Form {$i}",
                    'shortcode' => $shortcode,
                    'badge' => $badge
                );
            }
        }
    }

    // Default fallback examples if nothing is configured
    if (empty($slides)) {
        $slides = array(
            array(
                'title' => 'Home Services',
                'shortcode' => '[flowtrus_form id="LhOxsSHbmRt0t6SfAeOi"]',
                'badge' => '3-Step Flow'
            ),
            array(
                'title' => 'HVAC & Roofing',
                'shortcode' => '[flowtrus_form id="service-booking"]',
                'badge' => 'Instant Booking'
            ),
            array(
                'title' => 'Project Intake',
                'shortcode' => '[flowtrus_form id="lead-capture"]',
                'badge' => 'B2B Lead Gen'
            )
        );
    }

    return $slides;
}

/**
 * Register Flowtrus Admin Settings Page under Settings > Flowtrus Scripts
 */
function flowtrus_register_admin_settings()
{
    add_options_page(
        __('Flowtrus Custom Scripts & Hero Forms', 'flowtrus'),
        __('Flowtrus Scripts', 'flowtrus'),
        'manage_options',
        'flowtrus-scripts',
        'flowtrus_render_admin_settings_page'
    );
}
add_action('admin_menu', 'flowtrus_register_admin_settings');

add_action('admin_init', function () {
    register_setting('flowtrus_scripts_group', 'flowtrus_head_scripts', array(
        'type' => 'string',
        'sanitize_callback' => 'flowtrus_sanitize_raw_code',
        'default' => '',
    ));
    register_setting('flowtrus_scripts_group', 'flowtrus_footer_scripts', array(
        'type' => 'string',
        'sanitize_callback' => 'flowtrus_sanitize_raw_code',
        'default' => '',
    ));
    register_setting('flowtrus_scripts_group', 'flowtrus_hero_showcase_enable', array(
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '1',
    ));
    register_setting('flowtrus_scripts_group', 'flowtrus_hero_showcase_badge', array(
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '✨ Live Interactive Form Demo',
    ));
    register_setting('flowtrus_scripts_group', 'flowtrus_hero_slides_raw', array(
        'type' => 'string',
        'sanitize_callback' => 'flowtrus_sanitize_raw_code',
        'default' => '',
    ));

    for ($i = 1; $i <= 5; $i++) {
        register_setting('flowtrus_scripts_group', "flowtrus_hero_slide_{$i}_title", array('type' => 'string', 'sanitize_callback' => 'sanitize_text_field', 'default' => ''));
        register_setting('flowtrus_scripts_group', "flowtrus_hero_slide_{$i}_code", array('type' => 'string', 'sanitize_callback' => 'flowtrus_sanitize_raw_code', 'default' => ''));
        register_setting('flowtrus_scripts_group', "flowtrus_hero_slide_{$i}_badge", array('type' => 'string', 'sanitize_callback' => 'sanitize_text_field', 'default' => ''));
    }
});

/**
 * Render Admin Settings Page
 */
function flowtrus_render_admin_settings_page()
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $showcase_enabled = get_option('flowtrus_hero_showcase_enable', '1');
    $showcase_badge = get_option('flowtrus_hero_showcase_badge', '✨ Live Interactive Form Demo');
    $slides_raw = get_option('flowtrus_hero_slides_raw', '');
    ?>
    <div class="wrap" style="max-width: 1000px;">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <p style="font-size: 14px; color: #475569;">Configure your Flowtrus tracking scripts and hero section interactive form showcase slider.</p>
        
        <form method="post" action="options.php">
            <?php
            settings_fields('flowtrus_scripts_group');
            do_settings_sections('flowtrus_scripts_group');
            ?>

            <!-- SECTION 1: HERO FORM SHOWCASE SLIDER -->
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 24px; margin-top: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 20px;">🎠</span>
                    <h2 style="margin: 0; font-size: 18px; color: #0f172a;">Hero Form Showcase Slider</h2>
                </div>
                <p style="color: #64748b; font-size: 13px; margin-top: 0; margin-bottom: 20px;">
                    Display live interactive form shortcodes in a tabbed slider alongside your hero headline on the homepage.
                </p>

                <table class="form-table" role="presentation" style="margin-top: 0;">
                    <tr>
                        <th scope="row" style="width: 220px;">
                            <label for="flowtrus_hero_showcase_enable"><strong>Enable Hero Showcase</strong></label>
                        </th>
                        <td>
                            <label style="display: inline-flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;">
                                <input type="checkbox" name="flowtrus_hero_showcase_enable" id="flowtrus_hero_showcase_enable" value="1" <?php checked('1', $showcase_enabled); ?> />
                                Enable 2-column interactive form slider in homepage hero
                            </label>
                            <p class="description">When unchecked, the homepage hero will revert to the standard centered text layout.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="flowtrus_hero_showcase_badge"><strong>Showcase Top Badge</strong></label>
                        </th>
                        <td>
                            <input type="text" name="flowtrus_hero_showcase_badge" id="flowtrus_hero_showcase_badge" value="<?php echo esc_attr($showcase_badge); ?>" class="regular-text" placeholder="✨ Live Interactive Form Demo" />
                            <p class="description">Label displayed at the top header of the form showcase frame.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="flowtrus_hero_slides_raw"><strong>Showcase Form Slides</strong><br><span style="font-size: 11px; font-weight: normal; color: #64748b;">(Quick Multi-Line Format)</span></label>
                        </th>
                        <td>
                            <textarea name="flowtrus_hero_slides_raw" id="flowtrus_hero_slides_raw" rows="6" class="large-text code" style="font-family: monospace; font-size: 13px;" placeholder="Home Services | [flowtrus_form id=&quot;LhOxsSHbmRt0t6SfAeOi&quot;] | 3-Step Flow&#10;HVAC &amp; Roofing | [flowtrus_form id=&quot;service-booking&quot;] | Instant Booking&#10;Project Intake | [flowtrus_form id=&quot;lead-capture&quot;] | B2B Lead Gen"><?php echo esc_textarea($slides_raw); ?></textarea>
                            <p class="description">
                                Enter one slide per line in format: <code>Tab Title | Shortcode or Form ID | Optional Category Tag</code><br>
                                <em>Leave blank to use the individual slide fields below or default examples.</em>
                            </p>
                        </td>
                    </tr>
                </table>

                <h3 style="font-size: 14px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; margin: 20px 0 10px 0; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    Or Configure Individual Form Slides:
                </h3>

                <table class="widefat striped" style="margin-top: 10px; border-radius: 6px; overflow: hidden;">
                    <thead>
                        <tr>
                            <th style="width: 50px; font-weight: 700;">Slide</th>
                            <th style="font-weight: 700;">Tab Label / Title</th>
                            <th style="font-weight: 700;">Form Shortcode or Form ID</th>
                            <th style="font-weight: 700;">Category Badge (e.g. 3-Step Flow)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php for ($i = 1; $i <= 4; $i++): 
                            $t = get_option("flowtrus_hero_slide_{$i}_title", '');
                            $c = get_option("flowtrus_hero_slide_{$i}_code", '');
                            $b = get_option("flowtrus_hero_slide_{$i}_badge", '');
                        ?>
                        <tr>
                            <td style="font-weight: 700; vertical-align: middle;">#<?php echo $i; ?></td>
                            <td>
                                <input type="text" name="flowtrus_hero_slide_<?php echo $i; ?>_title" value="<?php echo esc_attr($t); ?>" placeholder="e.g. Home Services" style="width: 100%;" />
                            </td>
                            <td>
                                <input type="text" name="flowtrus_hero_slide_<?php echo $i; ?>_code" value="<?php echo esc_attr($c); ?>" placeholder="[flowtrus_form id=&quot;...&quot;] or Form ID" style="width: 100%; font-family: monospace;" />
                            </td>
                            <td>
                                <input type="text" name="flowtrus_hero_slide_<?php echo $i; ?>_badge" value="<?php echo esc_attr($b); ?>" placeholder="e.g. Instant Quote" style="width: 100%;" />
                            </td>
                        </tr>
                        <?php endfor; ?>
                    </tbody>
                </table>
            </div>

            <!-- SECTION 2: TRACKING SCRIPTS -->
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 24px; margin-top: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 20px;">⚡</span>
                    <h2 style="margin: 0; font-size: 18px; color: #0f172a;">Global Tracking & Embed Scripts</h2>
                </div>
                <p style="color: #64748b; font-size: 13px; margin-top: 0; margin-bottom: 20px;">
                    Paste your Flowtrus SDK script tag or third-party tags to load across all pages.
                </p>

                <table class="form-table" role="presentation" style="margin-top: 0;">
                    <tr>
                        <th scope="row" style="width: 220px;">
                            <label for="flowtrus_head_scripts"><strong>Header Scripts (<code>&lt;head&gt;</code>)</strong></label>
                        </th>
                        <td>
                            <textarea name="flowtrus_head_scripts" id="flowtrus_head_scripts" rows="8" class="large-text code" style="font-family: monospace; font-size: 13px;" placeholder="&lt;script src=&quot;https://app.flowtrus.com/...&quot; data-client-id=&quot;acme&quot;&gt;&lt;/script&gt;"><?php echo esc_textarea(get_option('flowtrus_head_scripts', get_theme_mod('flowtrus_head_scripts', ''))); ?></textarea>
                            <p class="description">Paste your Flowtrus tracking or form script snippet here. It will be output inside the <code>&lt;head&gt;</code> tag on every page.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="flowtrus_footer_scripts"><strong>Footer Scripts (before <code>&lt;/body&gt;</code>)</strong></label>
                        </th>
                        <td>
                            <textarea name="flowtrus_footer_scripts" id="flowtrus_footer_scripts" rows="6" class="large-text code" style="font-family: monospace; font-size: 13px;" placeholder="&lt;!-- Optional footer scripts --&gt;"><?php echo esc_textarea(get_option('flowtrus_footer_scripts', get_theme_mod('flowtrus_footer_scripts', ''))); ?></textarea>
                            <p class="description">Scripts entered here will be output right before the closing <code>&lt;/body&gt;</code> tag on every page.</p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-top: 24px;">
                <?php submit_button('Save All Settings', 'primary', 'submit', false, array('style' => 'font-size: 15px; padding: 6px 24px; height: auto;')); ?>
            </div>
        </form>
    </div>
    <?php
}

/**
 * Output Custom Head Scripts in <head>
 */
function flowtrus_output_head_scripts()
{
    $head_scripts = get_option('flowtrus_head_scripts');
    if (empty($head_scripts)) {
        $head_scripts = get_theme_mod('flowtrus_head_scripts', '');
    }
    if (!empty($head_scripts)) {
        echo "\n<!-- Flowtrus Custom Header Scripts -->\n";
        echo $head_scripts . "\n<!-- /Flowtrus Custom Header Scripts -->\n\n";
    }
}
add_action('wp_head', 'flowtrus_output_head_scripts', 99);

/**
 * Output Custom Footer Scripts before </body>
 */
function flowtrus_output_footer_scripts()
{
    $footer_scripts = get_option('flowtrus_footer_scripts');
    if (empty($footer_scripts)) {
        $footer_scripts = get_theme_mod('flowtrus_footer_scripts', '');
    }
    if (!empty($footer_scripts)) {
        echo "\n<!-- Flowtrus Custom Footer Scripts -->\n";
        echo $footer_scripts . "\n<!-- /Flowtrus Custom Footer Scripts -->\n\n";
    }
}
add_action('wp_footer', 'flowtrus_output_footer_scripts', 99);

/**
 * Helper function to get CTA button
 */
function flowtrus_get_cta_button()
{
    $cta_text = get_theme_mod('flowtrus_cta_text', 'Get Started');
    $cta_url = get_theme_mod('flowtrus_cta_url', '#');

    return '<a href="' . esc_url($cta_url) . '" class="btn btn-primary">' . esc_html($cta_text) . '</a>';
}

