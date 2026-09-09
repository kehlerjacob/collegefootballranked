<?php
/**
 * Template Name: Case Studies
 * 
 * @package Flowtrus
 */

get_header();
?>

<section class="hero hero-compact">
    <div class="container hero-content">
        <h1>Success Stories</h1>
        <p>See how modern businesses are transforming their lead generation and booking with Flowtrus</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <?php
        $case_studies = new WP_Query(array(
            'post_type' => 'case_study',
            'posts_per_page' => -1,
        ));

        if ($case_studies->have_posts()):
            ?>
            <div class="grid case-studies-grid">
                <?php
                while ($case_studies->have_posts()):
                    $case_studies->the_post();
                    ?>
                    <div class="case-study-card">
                        <?php if (has_post_thumbnail()): ?>
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('flowtrus-card', array('class' => 'case-study-image')); ?>
                            </a>
                        <?php endif; ?>

                        <div class="case-study-content">
                            <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                            <?php the_excerpt(); ?>
                            <a href="<?php the_permalink(); ?>" class="btn btn-secondary mt-4">Read Full Story</a>
                        </div>
                    </div>
                    <?php
                endwhile;
                wp_reset_postdata();
                ?>
            </div>
            <?php
        else:
            // Placeholder case studies
            ?>
            <div class="grid case-studies-grid">
                <!-- Case Study 1 -->
                <div class="case-study-card">
                    <div class="case-study-content">
                        <div class="case-study-meta">
                            <span>Home Services</span>
                        </div>
                        <h3>Local Home Services Provider Increases Bookings by 45%</h3>
                        <p>A mid-sized California home services provider struggled with low online booking completion rates. After
                            implementing Flowtrus forms, they saw immediate improvements.</p>

                        <div class="case-study-stats">
                            <div class="stat-item">
                                <span class="stat-value">45%</span>
                                <span class="stat-label">More Bookings</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">60%</span>
                                <span class="stat-label">Less Abandonment</span>
                            </div>
                        </div>

                        <blockquote
                            style="border-left: 4px solid var(--color-accent); padding-left: var(--spacing-4); margin: var(--spacing-6) 0; font-style: italic; color: var(--color-gray-600);">
                            "Flowtrus transformed our online lead generation. The analytics showed us exactly where
                            prospects were dropping off, and we optimized accordingly."
                        </blockquote>
                    </div>
                </div>

                <!-- Case Study 2 -->
                <div class="case-study-card">
                    <div class="case-study-content">
                        <div class="case-study-meta">
                            <span>Consulting Agency</span>
                        </div>
                        <h3>B2B Consulting Agency Doubles Lead Quality with Smart Forms</h3>
                        <p>A B2B consulting agency needed better quality leads. Flowtrus's multi-step forms helped
                            pre-qualify prospects and collect detailed project scopes before the first call.</p>

                        <div class="case-study-stats">
                            <div class="stat-item">
                                <span class="stat-value">2x</span>
                                <span class="stat-label">Lead Quality</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">35%</span>
                                <span class="stat-label">Higher Close Rate</span>
                            </div>
                        </div>

                        <blockquote
                            style="border-left: 4px solid var(--color-accent); padding-left: var(--spacing-4); margin: var(--spacing-6) 0; font-style: italic; color: var(--color-gray-600);">
                            "The step-by-step forms filter out tire-kickers. We're spending time with serious prospects who
                            are ready to buy."
                        </blockquote>
                    </div>
                </div>

                <!-- Case Study 3 -->
                <div class="case-study-card">
                    <div class="case-study-content">
                        <div class="case-study-meta">
                            <span>SaaS Platform</span>
                        </div>
                        <h3>SaaS Platform Signup Funnel Reduces Friction by 55%</h3>
                        <p>A Florida-based software provider needed a better way to onboard new trial users without
                            overwhelming them with compliance and setup fields.</p>

                        <div class="case-study-stats">
                            <div class="stat-item">
                                <span class="stat-value">55%</span>
                                <span class="stat-label">Faster Completion</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">78%</span>
                                <span class="stat-label">Mobile Submissions</span>
                            </div>
                        </div>

                        <blockquote
                            style="border-left: 4px solid var(--color-accent); padding-left: var(--spacing-4); margin: var(--spacing-6) 0; font-style: italic; color: var(--color-gray-600);">
                            "Our mobile conversion rate went through the roof. Flowtrus forms work beautifully on any
                            device."
                        </blockquote>
                    </div>
                </div>

                <!-- Case Study 4 -->
                <div class="case-study-card">
                    <div class="case-study-content">
                        <div class="case-study-meta">
                            <span>Logistics & Freight</span>
                        </div>
                        <h3>National Logistics Provider Streamlines Cargo Quoting</h3>
                        <p>A national logistics provider needed to collect detailed weight, cargo, and destination details
                            without creating a tedious shipping request experience.</p>

                        <div class="case-study-stats">
                            <div class="stat-item">
                                <span class="stat-value">3x</span>
                                <span class="stat-label">More Completions</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">40%</span>
                                <span class="stat-label">Time Saved</span>
                            </div>
                        </div>

                        <blockquote
                            style="border-left: 4px solid var(--color-accent); padding-left: var(--spacing-4); margin: var(--spacing-6) 0; font-style: italic; color: var(--color-gray-600);">
                            "Breaking our complex form into logical steps made all the difference. Prospects actually
                            complete the entire process now."
                        </blockquote>
                    </div>
                </div>

                <!-- Case Study 5 -->
                <div class="case-study-card">
                    <div class="case-study-content">
                        <div class="case-study-meta">
                            <span>Financial Advisory</span>
                        </div>
                        <h3>Financial Advisory Group Achieves 70% Form Completion Rate</h3>
                        <p>A financial planning group struggled with low intake form completion rates. Flowtrus's analytics
                            helped them identify and fix friction points in their questionnaire.</p>

                        <div class="case-study-stats">
                            <div class="stat-item">
                                <span class="stat-value">70%</span>
                                <span class="stat-label">Completion Rate</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">50%</span>
                                <span class="stat-label">More Clients</span>
                            </div>
                        </div>

                        <blockquote
                            style="border-left: 4px solid var(--color-accent); padding-left: var(--spacing-4); margin: var(--spacing-6) 0; font-style: italic; color: var(--color-gray-600);">
                            "The heatmap analysis was eye-opening. We made simple changes that had massive impact on our
                            conversion rates."
                        </blockquote>
                    </div>
                </div>

                <!-- Case Study 6 -->
                <div class="case-study-card">
                    <div class="case-study-content">
                        <div class="case-study-meta">
                            <span>Healthcare Clinic</span>
                        </div>
                        <h3>Medical Practice Group Improves Online Scheduling by 65%</h3>
                        <p>A multi-location dental and medical practice group needed to simplify their patient onboarding
                            and appointment booking forms.</p>

                        <div class="case-study-stats">
                            <div class="stat-item">
                                <span class="stat-value">65%</span>
                                <span class="stat-label">More Bookings</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">4.2★</span>
                                <span class="stat-label">User Rating</span>
                            </div>
                        </div>

                        <blockquote
                            style="border-left: 4px solid var(--color-accent); padding-left: var(--spacing-4); margin: var(--spacing-6) 0; font-style: italic; color: var(--color-gray-600);">
                            "During our busiest season, Flowtrus handled the volume flawlessly. The user experience is
                            exceptional."
                        </blockquote>
                    </div>
                </div>
            </div>
            <?php
        endif;
        ?>
    </div>
</section>

<section class="section section-primary">
    <div class="container text-center">
        <h2>Ready to Write Your Success Story?</h2>
        <p>Join these successful businesses and start converting more prospects today.</p>
        <div class="hero-cta mt-8">
            <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-accent btn-lg">See Live Demo</a>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="btn btn-secondary btn-lg"
                style="background-color: white; color: var(--color-primary);">Contact Sales</a>
        </div>
    </div>
</section>

<?php
get_footer();
