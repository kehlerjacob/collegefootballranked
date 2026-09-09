<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">

    <!-- Flowtrus SDK -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet"
        href="<?php echo get_template_directory_uri(); ?>/assets/css/flowtrus-modal.css?ver=<?php echo time(); ?>">
    <!-- Firebase SDK (Modular equivalent via compat/CDN for simple integration) -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

    <script src="<?php echo get_template_directory_uri(); ?>/assets/js/flowtrus-sdk.js?ver=<?php echo time(); ?>" defer></script>
    <script>
        window.Flowtrus = window.Flowtrus || {};
        window.addEventListener('DOMContentLoaded', function() {
            if (window.Flowtrus.init) {
                window.Flowtrus.init({
                    clientId: "sKukPrhlzn7NmwXj0l0g",
                    apiKey: "pk_lw3p5bc0m4tvcalmfbxld",
                    firebaseConfig: {
                        apiKey: "AIzaSyBd0qTyPbCb6hIvbB-oOmnaOcywfo9l9N8",
                        authDomain: "flowtrus-d51f8.firebaseapp.com",
                        projectId: "flowtrus-d51f8",
                        storageBucket: "flowtrus-d51f8.firebasestorage.app",
                        messagingSenderId: "470678590204",
                        appId: "1:470678590204:web:2d9dd5df85ee7e70d97d79",
                        measurementId: "G-SCXSR0RY8F"
                    }
                });
            }
        });
    </script>

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