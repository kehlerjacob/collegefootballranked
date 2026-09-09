<?php
/**
 * Blog Archive Template
 * 
 * @package Flowtrus
 */

get_header();
?>

<section class="hero" style="padding: var(--spacing-12) 0;">
    <div class="container hero-content">
        <h1><?php
        if (is_category()) {
            single_cat_title();
        } elseif (is_tag()) {
            single_tag_title();
        } elseif (is_author()) {
            the_author();
        } elseif (is_day()) {
            echo get_the_date();
        } elseif (is_month()) {
            echo get_the_date('F Y');
        } elseif (is_year()) {
            echo get_the_date('Y');
        } else {
            echo 'Blog';
        }
        ?></h1>
        <?php
        if (is_category() || is_tag()) {
            the_archive_description('<p>', '</p>');
        } else {
            echo '<p>Insights on conversion optimization, form design, and digital marketing</p>';
        }
        ?>
    </div>
</section>

<section class="section">
    <div class="container">
        <?php if (have_posts()): ?>
            <div class="grid grid-3">
                <?php while (have_posts()):
                    the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class('card'); ?>>
                        <?php if (has_post_thumbnail()): ?>
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('flowtrus-card'); ?>
                            </a>
                        <?php endif; ?>

                        <div style="padding: var(--spacing-6);">
                            <div class="case-study-meta" style="margin-bottom: var(--spacing-3);">
                                <?php flowtrus_posted_on(); ?>
                                <span><?php echo get_the_category_list(', '); ?></span>
                            </div>

                            <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>

                            <?php the_excerpt(); ?>

                            <a href="<?php the_permalink(); ?>" class="btn btn-secondary mt-4">Read More</a>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <div class="mt-12">
                <?php
                the_posts_pagination(array(
                    'mid_size' => 2,
                    'prev_text' => '← Previous',
                    'next_text' => 'Next →',
                ));
                ?>
            </div>
        <?php else: ?>
            <div class="text-center">
                <h2>No posts found</h2>
                <p>Check back soon for insights on conversion optimization and form design.</p>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php
get_footer();
