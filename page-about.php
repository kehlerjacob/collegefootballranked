<?php
/**
 * Template Name: About Page
 * 
 * @package Flowtrus
 */

get_header();
?>

<section class="hero hero-compact">
    <div class="container hero-content">
        <h1>About Flowtrus</h1>
        <p>We're on a mission to eliminate friction in the data collection process</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="grid grid-2" style="align-items: center;">
            <div>
                <h2>Our Story</h2>
                <p>Flowtrus was born from a simple observation: businesses were losing valuable leads because their
                    forms were too complex, too long, or too generic.</p>
                <p>We saw businesses struggling with low conversion rates despite having great products. The
                    problem wasn't their offering—it was the barrier between their prospects and their sales teams.</p>
                <p>So we built Flowtrus: a platform that makes data collection effortless, secure, and optimized for
                    maximum conversions.</p>
            </div>
            <div>
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/about-team.jpg" alt="Flowtrus Team"
                    class="rounded-lg shadow-lg">
            </div>
        </div>
    </div>
</section>

<section class="section section-gray">
    <div class="container">
        <div class="text-center mb-12">
            <h2>Our Mission</h2>
            <p class="text-gray" style="max-width: 700px; margin: 0 auto;">To empower businesses with intelligent form
                solutions that reduce friction, increase conversions, and provide actionable insights into customer
                behavior.</p>
        </div>

        <div class="grid grid-3">
            <div class="card text-center">
                <div class="card-icon">🎯</div>
                <h3>Conversion-Focused</h3>
                <p>Every feature is designed with one goal: helping you convert more prospects into customers.</p>
            </div>

            <div class="card text-center">
                <div class="card-icon">🔒</div>
                <h3>Security First</h3>
                <p>We treat your customer data with the highest level of security and compliance standards.</p>
            </div>

            <div class="card text-center">
                <div class="card-icon">📊</div>
                <h3>Data-Driven</h3>
                <p>Real-time analytics and insights help you continuously improve your forms and processes.</p>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="text-center mb-12">
            <h2>Why Choose Flowtrus?</h2>
        </div>

        <div class="grid grid-2">
            <div class="card">
                <h3>Built for Any Industry</h3>
                <p>Our forms are designed to adapt to any industry, with highly customizable fields, compliance
                    controls, and optimized flows tailored to your specific booking or lead capture needs.</p>
            </div>

            <div class="card">
                <h3>Proven Results</h3>
                <p>Our clients see an average 40% increase in conversion rates and 60% faster data collection times
                    within the first month of implementation.</p>
            </div>

            <div class="card">
                <h3>Easy Integration</h3>
                <p>Get up and running in minutes with simple shortcodes or CSS class triggers. No complex development
                    work required.</p>
            </div>

            <div class="card">
                <h3>Continuous Optimization</h3>
                <p>Our analytics tools show you exactly where users struggle, allowing you to make data-driven
                    improvements that compound over time.</p>
            </div>
        </div>
    </div>
</section>

<section class="section section-primary">
    <div class="container text-center">
        <h2>Ready to Get Started?</h2>
        <p>Join the growing number of businesses transforming their lead generation with Flowtrus.</p>
        <div class="hero-cta mt-8">
            <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-accent btn-lg">See Live Demo</a>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="btn btn-secondary btn-lg"
                style="background-color: white; color: var(--color-primary);">Contact Us</a>
        </div>
    </div>
</section>

<?php
get_footer();
