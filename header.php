<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>

    <header class="site-header">
        <div class="container header-container">
            <div class="site-logo">
                <a href="<?php echo esc_url(home_url('/')); ?>" rel="home" class="brand-text-logo">
                    <span class="brand-flow">flow</span><span class="brand-trus">trus</span>
                </a>
            </div>

            <nav class="main-navigation">
                <?php
                if (has_nav_menu('primary')) {
                    wp_nav_menu(array(
                        'theme_location' => 'primary',
                        'menu_class' => 'nav-menu',
                        'container' => false,
                        'fallback_cb' => false,
                    ));
                } else {
                    ?>
                    <ul class="nav-menu">
                        <li><a href="<?php echo esc_url(home_url('/solutions')); ?>">Solutions</a></li>
                        <li><a href="<?php echo esc_url(home_url('/demo')); ?>">Demo</a></li>
                        <li><a href="<?php echo esc_url(home_url('/#pricing')); ?>">Pricing</a></li>
                        <li><a href="<?php echo esc_url(home_url('/case-studies')); ?>">Case Studies</a></li>
                        <li><a href="<?php echo esc_url(home_url('/contact')); ?>">Contact</a></li>
                    </ul>
                    <?php
                }
                ?>

                <div class="header-buttons" style="display: inline-flex; align-items: center; margin-left: 15px;">
                    <?php echo flowtrus_get_cta_button(); ?>
                </div>
            </nav>

            <button class="mobile-menu-toggle" aria-label="Toggle Menu">
                ☰
            </button>
        </div>
    </header>

    <main id="main-content" class="site-main">