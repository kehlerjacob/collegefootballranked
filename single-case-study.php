<?php
/**
 * Single Case Study Template
 * 
 * @package Flowtrus
 */

get_header();
?>

<?php while (have_posts()):
    the_post(); ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <section class="hero" style="padding: var(--spacing-16) 0;">
            <div class="container hero-content">
                <h1><?php the_title(); ?></h1>
                <?php the_excerpt(); ?>
            </div>
        </section>

        <?php if (has_post_thumbnail()): ?>
            <div class="container" style="margin-top: calc(var(--spacing-12) * -1);">
                <?php the_post_thumbnail('flowtrus-hero', array('class' => 'rounded-lg shadow-xl')); ?>
            </div>
        <?php endif; ?>

        <section class="section">
            <div class="container" style="max-width: 900px;">
                <div class="entry-content">
                    <?php the_content(); ?>
                </div>
            </div>
        </section>

        <section class="section section-primary">
            <div class="container text-center">
                <h2>Ready to Achieve Similar Results?</h2>
                <p>Let's discuss how Flowtrus can transform your conversion rates.</p>
                <div class="hero-cta mt-8">
                    <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-accent btn-lg">See Live Demo</a>
                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="btn btn-secondary btn-lg"
                        style="background-color: white; color: var(--color-primary);">Contact Sales</a>
                </div>
            </div>
        </section>
    </article>
<?php endwhile; ?>

<?php
get_footer();
