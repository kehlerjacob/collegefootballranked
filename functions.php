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
        '1.0.2',
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
        'class' => ''
    ), $atts);

    $form_id = !empty($atts['id']) ? esc_attr($atts['id']) : (!empty($atts['key']) ? esc_attr($atts['key']) : '');
    $client_attr = !empty($atts['client_id']) ? ' data-client-id="' . esc_attr($atts['client_id']) . '"' : '';
    $extra_class = !empty($atts['class']) ? ' ' . esc_attr($atts['class']) : '';

    if (!empty($form_id)) {
        return '<div class="flowtrus-form-embed flowtrus-inline-wrapper' . $extra_class . '" data-form-id="' . $form_id . '"' . $client_attr . '></div>';
    }

    return '<div class="flowtrus-form-embed flowtrus-inline-wrapper' . $extra_class . '"' . $client_attr . '></div>';
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
 * Register Flowtrus Admin Settings Page under Settings > Flowtrus Scripts
 */
function flowtrus_register_admin_settings()
{
    add_options_page(
        __('Flowtrus Custom Scripts', 'flowtrus'),
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
});

/**
 * Render Admin Settings Page
 */
function flowtrus_render_admin_settings_page()
{
    if (!current_user_can('manage_options')) {
        return;
    }
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <p>Add custom tracking scripts, Flowtrus embed scripts, or third-party tags to your website.</p>
        
        <form method="post" action="options.php">
            <?php
            settings_fields('flowtrus_scripts_group');
            do_settings_sections('flowtrus_scripts_group');
            ?>
            
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">
                        <label for="flowtrus_head_scripts"><strong>Header Scripts (<code>&lt;head&gt;</code>)</strong></label>
                    </th>
                    <td>
                        <textarea name="flowtrus_head_scripts" id="flowtrus_head_scripts" rows="10" class="large-text code" style="font-family: monospace; font-size: 13px;" placeholder="&lt;script src=&quot;https://app.flowtrus.com/...&quot;&gt;&lt;/script&gt;"><?php echo esc_textarea(get_option('flowtrus_head_scripts', get_theme_mod('flowtrus_head_scripts', ''))); ?></textarea>
                        <p class="description">Paste your Flowtrus tracking or form script snippet here. It will be output inside the <code>&lt;head&gt;</code> tag on every page.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="flowtrus_footer_scripts"><strong>Footer Scripts (before <code>&lt;/body&gt;</code>)</strong></label>
                    </th>
                    <td>
                        <textarea name="flowtrus_footer_scripts" id="flowtrus_footer_scripts" rows="8" class="large-text code" style="font-family: monospace; font-size: 13px;" placeholder="&lt;!-- Optional footer scripts --&gt;"><?php echo esc_textarea(get_option('flowtrus_footer_scripts', get_theme_mod('flowtrus_footer_scripts', ''))); ?></textarea>
                        <p class="description">Scripts entered here will be output right before the closing <code>&lt;/body&gt;</code> tag on every page.</p>
                    </td>
                </tr>
            </table>
            
            <?php submit_button('Save Changes'); ?>
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

