</main>

<footer class="site-footer">
    <div class="container">
        <div class="footer-widgets">
            <?php
            for ($i = 1; $i <= 3; $i++) {
                if (is_active_sidebar('footer-' . $i)) {
                    dynamic_sidebar('footer-' . $i);
                }
            }
            ?>
        </div>

        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.</p>
            <?php
            wp_nav_menu(array(
                'theme_location' => 'footer',
                'menu_class' => 'footer-menu',
                'container' => 'nav',
                'container_class' => 'footer-navigation',
                'fallback_cb' => false,
                'depth' => 1,
            ));
            ?>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>

</html>