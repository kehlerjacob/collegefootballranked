<?php
/**
 * The main template file
 * 
 * @package Flowtrus
 */

get_header();
?>

<div class="container">
    <div class="section">
        <?php
        if (have_posts()):
            while (have_posts()):
                the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <header class="entry-header">
                        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                        <div class="entry-meta">
                            <?php flowtrus_posted_on(); ?>
                            <?php flowtrus_posted_by(); ?>
                        </div>
                    </header>

                    <?php if (has_post_thumbnail()): ?>
                        <div class="entry-thumbnail">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('flowtrus-card'); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div class="entry-content">
                        <?php the_excerpt(); ?>
                    </div>

                    <footer class="entry-footer">
                        <a href="<?php the_permalink(); ?>" class="btn btn-secondary">Read More</a>
                    </footer>
                </article>
                <?php
            endwhile;

            the_posts_pagination();
        else:
            ?>
            <p>No content found.</p>
            <?php
        endif;
        ?>
    </div>
</div>

<?php
get_footer();
