<?php
/**
 * Single Post Template
 * 
 * @package Flowtrus
 */

get_header();
?>

<?php while (have_posts()):
    the_post(); ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <section class="hero hero-mini">
            <div class="container" style="max-width: 900px;">
                <div class="case-study-meta"
                    style="justify-content: center; margin-bottom: var(--spacing-4); color: rgba(255,255,255,0.9);">
                    <?php flowtrus_posted_on(); ?>
                    <?php flowtrus_posted_by(); ?>
                </div>
                <h1 style="text-align: center; color: white;"><?php the_title(); ?></h1>
            </div>
        </section>

        <?php if (has_post_thumbnail()): ?>
            <div class="container" style="max-width: 1000px; margin-top: calc(var(--spacing-12) * -1);">
                <?php the_post_thumbnail('flowtrus-hero', array('class' => 'rounded-lg shadow-xl')); ?>
            </div>
        <?php endif; ?>

        <section class="section">
            <div class="container" style="max-width: 800px;">
                <div class="entry-content" style="font-size: var(--font-size-lg); line-height: var(--line-height-relaxed);">
                    <?php the_content(); ?>
                </div>

                <?php if (has_tag()): ?>
                    <div class="mt-8" style="padding-top: var(--spacing-6); border-top: 2px solid var(--color-gray-200);">
                        <strong>Tags:</strong> <?php the_tags('', ', ', ''); ?>
                    </div>
                <?php endif; ?>
            </div>
        </section>

        <?php
        // Author bio
        $author_bio = get_the_author_meta('description');
        if ($author_bio):
            ?>
            <section class="section section-gray">
                <div class="container" style="max-width: 800px;">
                    <div class="card">
                        <div class="flex gap-6">
                            <div>
                                <?php echo get_avatar(get_the_author_meta('ID'), 80, '', '', array('class' => 'rounded')); ?>
                            </div>
                            <div>
                                <h3>About <?php the_author(); ?></h3>
                                <p><?php echo esc_html($author_bio); ?></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <?php
        // Related posts
        $related = new WP_Query(array(
            'category__in' => wp_get_post_categories(get_the_ID()),
            'post__not_in' => array(get_the_ID()),
            'posts_per_page' => 3,
        ));

        if ($related->have_posts()):
            ?>
            <section class="section">
                <div class="container">
                    <h2 class="text-center mb-8">Related Articles</h2>
                    <div class="grid grid-3">
                        <?php while ($related->have_posts()):
                            $related->the_post(); ?>
                            <div class="card">
                                <?php if (has_post_thumbnail()): ?>
                                    <a href="<?php the_permalink(); ?>">
                                        <?php the_post_thumbnail('flowtrus-card'); ?>
                                    </a>
                                <?php endif; ?>
                                <div style="padding: var(--spacing-4);">
                                    <h4><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h4>
                                    <?php the_excerpt(); ?>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    </div>
                </div>
            </section>
            <?php
            wp_reset_postdata();
        endif;
        ?>
    </article>
<?php endwhile; ?>

<?php
get_footer();
