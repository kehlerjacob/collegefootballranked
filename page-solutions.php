<?php
/**
 * Template Name: Solutions Page
 * 
 * @package Flowtrus
 */

get_header();
?>

<section class="hero hero-compact">
    <div class="container hero-content">
        <h1>Solutions for Modern Businesses</h1>
        <p>High-converting forms designed to maximize conversions and streamline your sales process</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="text-center mb-12">
            <h2>Comprehensive Form Solutions</h2>
            <p class="text-gray">Everything you need to capture, analyze, and convert more leads</p>
        </div>

        <div class="grid grid-2" style="align-items: center; margin-bottom: var(--spacing-16);">
            <div>
                <h3>Conversion-Optimized Forms</h3>
                <p>Streamlined multi-step forms that collect all necessary information without overwhelming prospects.
                    Our customizable templates include:</p>
                <ul>
                    <li>Service booking & scheduling</li>
                    <li>Professional service estimates</li>
                    <li>Product onboarding & signups</li>
                    <li>Lead capture & quote requests</li>
                    <li>Catering & event bookings</li>
                </ul>
                <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-primary mt-4">See Examples</a>
            </div>
            <div>
                <div class="card">
                    <div class="step-tracker">
                        <div class="step completed">
                            <div class="step-circle">1</div>
                            <span>Basic Info</span>
                        </div>
                        <div class="step completed">
                            <div class="step-circle">2</div>
                            <span>Coverage</span>
                        </div>
                        <div class="step active">
                            <div class="step-circle">3</div>
                            <span>Details</span>
                        </div>
                        <div class="step">
                            <div class="step-circle">4</div>
                            <span>Review</span>
                        </div>
                    </div>
                    <p class="text-center text-gray mt-6">Step-by-step forms reduce abandonment by 60%</p>
                </div>
            </div>
        </div>

        <div class="grid grid-2" style="align-items: center; margin-bottom: var(--spacing-16);">
            <div>
                <div class="analytics-demo">
                    <h4>Real-Time Analytics Dashboard</h4>
                    <div class="heatmap-container">
                        <p class="text-gray">📊 Heatmap visualization showing user interactions</p>
                        <p class="text-gray">🔍 Click tracking and scroll depth analysis</p>
                        <p class="text-gray">⏱️ Time spent on each form field</p>
                        <p class="text-gray">🚪 Exit point identification</p>
                    </div>
                </div>
            </div>
            <div>
                <h3>Advanced Analytics</h3>
                <p>Understand exactly how users interact with your forms:</p>
                <ul>
                    <li><strong>Heatmaps:</strong> Visual representation of where users click, hover, and scroll</li>
                    <li><strong>Step Tracking:</strong> See completion rates for each form step</li>
                    <li><strong>Drop-off Analysis:</strong> Identify exactly where users abandon forms</li>
                    <li><strong>A/B Testing:</strong> Test different form variations to optimize performance</li>
                    <li><strong>Conversion Funnels:</strong> Track the entire journey from form view to submission</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<section class="section section-gray">
    <div class="container">
        <div class="text-center mb-12">
            <h2>Key Features</h2>
        </div>

        <div class="grid grid-3">
            <div class="card">
                <div class="card-icon">⚡</div>
                <h3>Easy Integration</h3>
                <p>Add forms to any page with simple shortcodes:</p>
                <code
                    style="display: block; background: var(--color-gray-100); padding: var(--spacing-3); border-radius: var(--border-radius-sm); margin-top: var(--spacing-3);">[flowtrus_form id="auto-quote"]</code>
                <p class="mt-4">Or trigger forms with CSS classes on buttons and links.</p>
            </div>

            <div class="card">
                <div class="card-icon">🔒</div>
                <h3>Enterprise Security</h3>
                <p>Your customer data is protected with:</p>
                <ul style="text-align: left; margin-top: var(--spacing-3);">
                    <li>256-bit SSL encryption</li>
                    <li>GDPR compliance</li>
                    <li>SOC 2 Type II certified</li>
                    <li>Regular security audits</li>
                </ul>
            </div>

            <div class="card">
                <div class="card-icon">🔄</div>
                <h3>CRM Integration</h3>
                <p>Seamlessly connect with your existing tools:</p>
                <ul style="text-align: left; margin-top: var(--spacing-3);">
                    <li>Salesforce</li>
                    <li>HubSpot</li>
                    <li>Pipedrive</li>
                    <li>Custom webhooks</li>
                </ul>
            </div>

            <div class="card">
                <div class="card-icon">📱</div>
                <h3>Mobile Optimized</h3>
                <p>Perfect experience on any device. Over 60% of form submissions happen on mobile—our forms are
                    designed mobile-first.</p>
            </div>

            <div class="card">
                <div class="card-icon">🎨</div>
                <h3>Customizable Design</h3>
                <p>Match your brand perfectly with customizable colors, fonts, and layouts. No coding required.</p>
            </div>

            <div class="card">
                <div class="card-icon">📈</div>
                <h3>Smart Optimization</h3>
                <p>AI-powered suggestions help you continuously improve form performance based on real user data.</p>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="text-center mb-12">
            <h2>How It Works</h2>
        </div>

        <div class="grid grid-4">
            <div class="text-center">
                <div class="feature-icon">1️⃣</div>
                <h4>Choose Template</h4>
                <p>Select from our conversion-optimized templates</p>
            </div>

            <div class="text-center">
                <div class="feature-icon">2️⃣</div>
                <h4>Customize</h4>
                <p>Adjust fields, branding, and flow to match your needs</p>
            </div>

            <div class="text-center">
                <div class="feature-icon">3️⃣</div>
                <h4>Integrate</h4>
                <p>Add to your site with a simple shortcode or trigger class</p>
            </div>

            <div class="text-center">
                <div class="feature-icon">4️⃣</div>
                <h4>Optimize</h4>
                <p>Use analytics to continuously improve conversion rates</p>
            </div>
        </div>
    </div>
</section>

<section class="section section-primary">
    <div class="container text-center">
        <h2>Ready to See the Difference?</h2>
        <p>Experience our conversion-optimized forms in action with our interactive demo.</p>
        <div class="hero-cta mt-8">
            <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-accent btn-lg">Try Live Demo</a>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="btn btn-secondary btn-lg"
                style="background-color: white; color: var(--color-primary);">Contact Sales</a>
        </div>
    </div>
</section>

<?php
get_footer();
