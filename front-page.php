<?php
/**
 * Template Name: Home Page
 * 
 * @package Flowtrus
 */

get_header();
?>

<!-- Hero Section -->
<?php
$showcase_enabled = get_option('flowtrus_hero_showcase_enable', '1');
$hero_slides = function_exists('flowtrus_get_hero_slides') ? flowtrus_get_hero_slides() : array();
$showcase_badge = get_option('flowtrus_hero_showcase_badge', '✨ Live Interactive Form Demo');
if (empty($showcase_badge)) {
    $showcase_badge = '✨ Live Interactive Form Demo';
}

if ($showcase_enabled === '1' && !empty($hero_slides)) :
?>
<section class="hero hero-with-showcase">
    <div class="container hero-grid">
        <!-- Left Column: Hero Text Content -->
        <div class="hero-text-col">
            <div style="margin-bottom: 20px;">
                <span class="mission-badge" style="margin-bottom: 0;">
                    <span>🎯</span> OUR MISSION & PROPRIETARY ENGINE
                </span>
            </div>
            <h1 class="hero-title">
                Engineering the Highest-Converting Booking Forms on the Internet
            </h1>
            <p class="hero-description">
                Most online booking forms are silent conversion killers—bleeding up to 70% of potential customers due to cognitive friction and clunky layouts. Our mission is to eliminate that friction completely. Through our proprietary data collection and continuous telemetry analysis, we turn everyday booking forms into predictable, high-yield revenue engines for our partners.
            </p>
            <div class="hero-cta">
                <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-accent btn-lg" style="font-weight: 700;">See Live Demo</a>
                <a href="#" class="btn btn-secondary btn-lg flowtrus-trigger" data-form-id="LhOxsSHbmRt0t6SfAeOi" style="font-weight: 700; background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); color: white;">Get Started</a>
            </div>

            <!-- Value Highlights -->
            <div class="hero-highlights">
                <div class="hero-highlight-item">
                    <span class="highlight-icon">⚡</span>
                    <span>Sub-100ms Instant Load</span>
                </div>
                <div class="hero-highlight-item">
                    <span class="highlight-icon">🔒</span>
                    <span>Zero Data Leakage</span>
                </div>
                <div class="hero-highlight-item">
                    <span class="highlight-icon">📈</span>
                    <span>+38% Avg Conversion Lift</span>
                </div>
            </div>
        </div>

        <!-- Right Column: Interactive Form Showcase Slider -->
        <div class="hero-showcase-col">
            <div class="hero-form-showcase" id="heroFormShowcase">
                <!-- Showcase Header Bar -->
                <div class="showcase-header">
                    <div class="showcase-badge-pill">
                        <span class="pulse-dot"></span>
                        <span class="badge-text"><?php echo esc_html($showcase_badge); ?></span>
                    </div>
                    <div class="showcase-nav-arrows">
                        <button type="button" class="showcase-arrow showcase-arrow-prev" aria-label="Previous form example">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button type="button" class="showcase-arrow showcase-arrow-next" aria-label="Next form example">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                    </div>
                </div>

                <!-- Showcase Tab Selector Pills -->
                <?php if (count($hero_slides) > 1) : ?>
                <div class="hero-form-tabs" role="tablist">
                    <?php foreach ($hero_slides as $index => $slide) : ?>
                        <button type="button" 
                                role="tab" 
                                class="hero-form-tab <?php echo $index === 0 ? 'active' : ''; ?>" 
                                data-slide-index="<?php echo $index; ?>"
                                aria-selected="<?php echo $index === 0 ? 'true' : 'false'; ?>">
                            <span class="tab-title"><?php echo esc_html($slide['title']); ?></span>
                            <?php if (!empty($slide['badge'])) : ?>
                                <span class="tab-badge"><?php echo esc_html($slide['badge']); ?></span>
                            <?php endif; ?>
                        </button>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>

                <!-- Showcase Form Slides -->
                <div class="hero-form-slides">
                    <?php foreach ($hero_slides as $index => $slide) : ?>
                        <div class="hero-form-slide <?php echo $index === 0 ? 'active' : ''; ?>" 
                             data-slide-index="<?php echo $index; ?>" 
                             role="tabpanel">
                            <div class="hero-form-slide-inner">
                                <?php echo do_shortcode($slide['shortcode']); ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- Showcase Footer -->
                <div class="showcase-footer">
                    <div class="showcase-indicator-dots">
                        <?php foreach ($hero_slides as $index => $slide) : ?>
                            <button type="button" 
                                    class="showcase-dot <?php echo $index === 0 ? 'active' : ''; ?>" 
                                    data-slide-index="<?php echo $index; ?>" 
                                    aria-label="Go to slide <?php echo $index + 1; ?>">
                            </button>
                        <?php endforeach; ?>
                    </div>
                    <span class="showcase-helper-hint">💡 Live preview: test typing or selecting options</span>
                </div>
            </div>
        </div>
    </div>
</section>
<?php else : ?>
<section class="hero">
    <div class="container hero-content" style="text-align: center; max-width: 960px; margin: 0 auto;">
        <div style="margin-bottom: 24px;">
            <span class="mission-badge" style="margin-bottom: 0;">
                <span>🎯</span> OUR MISSION & PROPRIETARY ENGINE
            </span>
        </div>
        <h1 style="font-size: clamp(34px, 4.5vw, 54px); font-weight: 800; line-height: 1.15; margin-bottom: 24px; letter-spacing: -0.5px;">
            Engineering the Highest-Converting Booking Forms on the Internet
        </h1>
        <p style="font-size: 18px; line-height: 1.65; max-width: 820px; margin: 0 auto 32px auto; color: rgba(255, 255, 255, 0.9);">
            Most online booking forms are silent conversion killers—bleeding up to 70% of potential customers due to cognitive friction and clunky layouts. Our mission is to eliminate that friction completely. Through our proprietary data collection and continuous telemetry analysis, we turn everyday booking forms into predictable, high-yield revenue engines for our partners.
        </p>
        <div class="hero-cta" style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-accent btn-lg" style="font-weight: 700;">See Live Demo</a>
            <a href="#" class="btn btn-secondary btn-lg flowtrus-trigger" data-form-id="LhOxsSHbmRt0t6SfAeOi" style="font-weight: 700; background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); color: white;">Get Started</a>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Features Section -->
<section class="section" style="background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);">
    <div class="container">
        <div class="text-center mb-12">
            <span
                style="display: inline-block; background: linear-gradient(135deg, var(--color-secondary), var(--color-accent)); color: white; padding: var(--spacing-2) var(--spacing-4); border-radius: var(--border-radius-lg); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-4);">🚀
                POWERFUL FEATURES</span>
            <h2 style="font-size: var(--font-size-5xl); margin-bottom: var(--spacing-4);">Everything You Need to
                Maximize Conversions</h2>
            <p class="text-gray" style="font-size: var(--font-size-lg); max-width: 700px; margin: 0 auto;">Powerful
                features designed for modern businesses that value data.</p>
        </div>

        <div class="feature-grid">
            <div class="card"
                style="border-top: 4px solid var(--color-secondary); background: linear-gradient(135deg, rgba(45, 155, 155, 0.05), rgba(255, 255, 255, 1));">
                <div class="feature-icon"
                    style="background: linear-gradient(135deg, var(--color-secondary), var(--color-accent));">📊</div>
                <h3 style="color: var(--color-secondary);">Real-Time Analytics</h3>
                <p>Track every interaction with heatmaps and step-by-step analysis. Understand exactly where prospects
                    drop off and optimize accordingly.</p>
            </div>

            <div class="card"
                style="border-top: 4px solid var(--color-primary); background: linear-gradient(135deg, rgba(26, 77, 124, 0.05), rgba(255, 255, 255, 1));">
                <div class="feature-icon"
                    style="background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));">🔒</div>
                <h3 style="color: var(--color-primary);">Enterprise Security</h3>
                <p>Bank-level encryption and compliance with industry standards. Your customer data is protected at
                    every step.</p>
            </div>

            <div class="card"
                style="border-top: 4px solid var(--color-accent); background: linear-gradient(135deg, rgba(107, 196, 125, 0.05), rgba(255, 255, 255, 1));">
                <div class="feature-icon"
                    style="background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));">⚡</div>
                <h3 style="color: var(--color-accent-dark);">Easy Integration</h3>
                <p>Add forms to your site in minutes with simple shortcodes or CSS triggers. No complex setup required.
                </p>
            </div>

            <div class="card"
                style="border-top: 4px solid var(--color-accent); background: linear-gradient(135deg, rgba(107, 196, 125, 0.05), rgba(255, 255, 255, 1));">
                <div class="feature-icon"
                    style="background: linear-gradient(135deg, var(--color-accent), var(--color-primary));">🎯</div>
                <h3 style="color: var(--color-accent-dark);">Industry-Specific</h3>
                <p>Pre-built forms optimized for modern businesses with fields and flows that convert.</p>
            </div>

            <div class="card"
                style="border-top: 4px solid var(--color-secondary); background: linear-gradient(135deg, rgba(45, 155, 155, 0.05), rgba(255, 255, 255, 1));">
                <div class="feature-icon"
                    style="background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));">📈</div>
                <h3 style="color: var(--color-secondary);">Conversion Optimization</h3>
                <p>AI-powered suggestions to improve form performance based on real user behavior data.</p>
            </div>

            <div class="card"
                style="border-top: 4px solid var(--color-primary); background: linear-gradient(135deg, rgba(26, 77, 124, 0.05), rgba(255, 255, 255, 1));">
                <div class="feature-icon"
                    style="background: linear-gradient(135deg, var(--color-primary), var(--color-accent));">🔄</div>
                <h3 style="color: var(--color-primary);">Seamless CRM Sync</h3>
                <p>Automatically send collected data to your existing sales tools and CRM systems.</p>
            </div>
        </div>
    </div>
</section>


<!-- CX Design Section -->
<section class="section"
    style="background: linear-gradient(135deg, white 0%, #f9fafb 100%); border-bottom: 1px solid var(--color-gray-100);">
    <div class="container">
        <div class="text-center mb-12">
            <span
                style="display: inline-block; background: rgba(107, 196, 125, 0.1); color: var(--color-accent-dark); padding: var(--spacing-2) var(--spacing-4); border-radius: var(--border-radius-lg); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-4);">✨
                EXPERIENCE THE DIFFERENCE</span>
            <h2 style="font-size: var(--font-size-5xl); margin-bottom: var(--spacing-4);">Designed to Delight</h2>
            <p class="text-gray" style="font-size: var(--font-size-lg); max-width: 700px; margin: 0 auto;">Build trust
                instantly with polished, professional forms that users actually enjoy filling out.</p>
        </div>

        <div class="grid grid-2" style="align-items: center; gap: var(--spacing-12);">
            <!-- Visual Side -->
            <div style="position: relative; overflow: hidden; border-radius: 12px;">
                <!-- Decorative Elements -->
                <div
                    style="position: absolute; width: 300px; height: 300px; background: radial-gradient(circle, rgba(107, 196, 125, 0.1) 0%, rgba(255,255,255,0) 70%); top: -50px; left: -50px; z-index: 0;">
                </div>

                <div style="position: relative; z-index: 1;">
                    <?php echo do_shortcode('[flowtrus-form id="ihVA2tAKvNhCdiJCUQZO"]'); ?>
                </div>
            </div>

            <!-- Content Side -->
            <div>
                <div style="margin-bottom: var(--spacing-8);">
                    <div
                        style="width: 48px; height: 48px; background: rgba(26, 77, 124, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: var(--spacing-4);">
                        🎨</div>
                    <h3 style="font-size: var(--font-size-2xl);">Professional Appearance</h3>
                    <p class="text-gray" style="margin-top: var(--spacing-2);">First impressions matter. Our forms are
                        meticulously designed with modern aesthetics, clean lines, and smooth transitions that reflect
                        the quality of your brand.</p>
                </div>

                <div style="margin-bottom: var(--spacing-8);">
                    <div
                        style="width: 48px; height: 48px; background: rgba(107, 196, 125, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: var(--spacing-4);">
                        😌</div>
                    <h3 style="font-size: var(--font-size-2xl);">Satisfying Experience</h3>
                    <p class="text-gray" style="margin-top: var(--spacing-2);">From subtle hover states to rewarding
                        progress indicators, every interaction is engineered to reduce anxiety and make submission feel
                        like an achievement.</p>
                </div>

                <div>
                    <div
                        style="width: 48px; height: 48px; background: rgba(45, 155, 155, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: var(--spacing-4);">
                        🛡️</div>
                    <h3 style="font-size: var(--font-size-2xl);">Confidence-Inspiring Confirmations</h3>
                    <p class="text-gray" style="margin-top: var(--spacing-2);">Never leave prospects in the dark. Rich, reassuring confirmations provide instant clarity, assigned team member details, and concrete timelines—giving customers complete confidence so they stop searching for competitors.
                    </p>
                </div>
            </div>
        </div>

        <!-- Competitor Lockout / Confidence Confirmation Spotlight -->
        <div class="confirmation-spotlight" style="margin-top: 60px; background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
            <!-- Top accent gradient strip -->
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, var(--color-secondary), var(--color-accent));"></div>

            <div class="grid grid-2" style="align-items: center; gap: 40px;">
                <div>
                    <span style="display: inline-block; background: rgba(45, 155, 155, 0.1); color: var(--color-secondary); padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px;">
                        🛑 STOP THE COMPETITOR SEARCH
                    </span>
                    <h3 style="font-size: 28px; font-family: var(--font-primary); font-weight: 800; color: var(--color-primary); margin-bottom: 14px; line-height: 1.25;">
                        Confirmations That Inspire Confidence & Lock Out Competitors
                    </h3>
                    <p class="text-gray" style="font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
                        When a customer sees a vague, automated <em>"Thanks, your message has been sent"</em> notice, buyer anxiety immediately sets in. Wondering if anyone actually received it, they instinctively hit the back button, return to Google, and reach out to 2 or 3 of your direct competitors.
                    </p>
                    <p class="text-gray" style="font-size: 15px; line-height: 1.6; margin-bottom: 22px;">
                        Flowtrus replaces uncertainty with <strong>instant, definitive closure</strong>. By confirming assigned specialists, exact response windows, and tangible next steps on screen, we satisfy customer urgency instantly—securing the lead before they ever consider shopping around.
                    </p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: flex; align-items: flex-start; gap: 12px;">
                            <div style="color: var(--color-accent); font-size: 18px; line-height: 1;">🛡️</div>
                            <div style="font-size: 14px; color: var(--color-gray-800); font-weight: 600;">
                                Immediate Psychological Closure: <span style="font-weight: 400; color: #64748b;">Gives prospects the certainty that their request is actively handled, ending the search.</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 12px;">
                            <div style="color: var(--color-secondary); font-size: 18px; line-height: 1;">⏱️</div>
                            <div style="font-size: 14px; color: var(--color-gray-800); font-weight: 600;">
                                Concrete Response Guarantees: <span style="font-weight: 400; color: #64748b;">Displays realistic contact windows (e.g. "Within 15 minutes") to set firm expectations.</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 12px;">
                            <div style="color: #6366f1; font-size: 18px; line-height: 1;">👤</div>
                            <div style="font-size: 14px; color: var(--color-gray-800); font-weight: 600;">
                                Named Team Assignment: <span style="font-weight: 400; color: #64748b;">Introduces the real human specialist reviewing their request to establish personal rapport.</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Visual Comparison: Generic Form vs Flowtrus Confidence Anchor -->
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <!-- Generic Vulnerable Confirmation -->
                    <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 12px; padding: 20px 22px; position: relative;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 11px; font-weight: 700; color: #e53e3e; text-transform: uppercase; letter-spacing: 0.5px;">❌ Standard Form Confirmation</span>
                            <span style="font-size: 11px; font-weight: 600; color: #e53e3e; background: rgba(229,62,62,0.1); padding: 2px 8px; border-radius: 4px;">High Competitor Risk</span>
                        </div>
                        <div style="font-size: 13.5px; color: #4a5568; font-style: italic; margin-bottom: 8px;">
                            "Thank you. Your message has been sent. We will get back to you as soon as possible."
                        </div>
                        <div style="font-size: 12px; color: #c53030; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                            <span>⚠️</span> Prospect feels ignored, opens Google, and submits inquiries to competitors.
                        </div>
                    </div>

                    <!-- Flowtrus Confidence Anchor -->
                    <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: 14px; padding: 22px; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.12); position: relative;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 11px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px;">✅ Flowtrus Confidence Anchor</span>
                            <span style="font-size: 11px; font-weight: 700; color: #15803d; background: #dcfce7; padding: 3px 10px; border-radius: 100px;">Competitor Search Stopped</span>
                        </div>
                        
                        <div style="background: white; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px 18px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                                <div style="width: 36px; height: 36px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                                    🎉
                                </div>
                                <div>
                                    <div style="font-weight: 700; color: #166534; font-size: 14px;">Booking Secured & Assigned!</div>
                                    <div style="font-size: 12px; color: #64748b;">Ref #FLW-88294 • Instant SMS Dispatched</div>
                                </div>
                            </div>
                            <div style="font-size: 13px; color: #334155; line-height: 1.5;">
                                "Hi Sarah, your request is with <strong>Marcus Vance (Lead Specialist)</strong>. Marcus is reviewing your details now and will message you within <strong>14 minutes</strong>."
                            </div>
                        </div>

                        <div style="font-size: 12px; color: #166534; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                            <span>🔒</span> Prospect has full closure, closes their browser, and waits exclusively for your call.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>



<!-- Integrations Section -->
<section class="section" style="background: white;">
    <div class="container">
        <div class="text-center mb-12">
            <span
                style="display: inline-block; background: rgba(26, 77, 124, 0.1); color: var(--color-primary); padding: var(--spacing-2) var(--spacing-4); border-radius: var(--border-radius-lg); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-4);">🔌
                CONNECT YOUR TOOLS</span>
            <h2 style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-4);">Your Data, Where You Need It
            </h2>
            <p class="text-gray" style="font-size: var(--font-size-lg); max-width: 600px; margin: 0 auto;">Leads
                instantly flow from Flowtrus into your favorite CRM or sales tools.</p>
        </div>

        <div class="logo-grid"
            style="display: flex; flex-wrap: wrap; justify-content: center; gap: var(--spacing-8); align-items: center; opacity: 0.8;">
            <!-- Simple textual representations for logos since we can't fetch images right now, styled to look like placeholders -->

            <div
                style="background: #f8fafc; padding: 20px 40px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #64748b; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <span style="color: #00a1e0; font-size: 24px;">☁️</span> Salesforce
            </div>

            <div
                style="background: #f8fafc; padding: 20px 40px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #64748b; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <span style="color: #ec483b; font-size: 24px;">🎯</span> Zoho
            </div>

            <div
                style="background: #f8fafc; padding: 20px 40px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #64748b; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <span style="color: #ff7a59; font-size: 24px;">🟧</span> HubSpot
            </div>

            <div
                style="background: #f8fafc; padding: 20px 40px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #64748b; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <span style="color: #6366f1; font-size: 24px;">📈</span> ActiveCampaign
            </div>

            <div
                style="background: #f8fafc; padding: 20px 40px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #64748b; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <span style="color: #10b981; font-size: 24px;">📧</span> Mailchimp
            </div>

            <div
                style="background: #f8fafc; padding: 20px 40px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #64748b; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <span style="color: #fca5a5; font-size: 24px;">⚡</span> Zapier
            </div>

        </div>

        <div class="text-center mt-12">
            <p class="text-xs text-gray-400 font-mono">...and 2,000+ more via webhooks</p>
        </div>
    </div>
</section>

<!-- Mission & Proprietary Data Engine Section -->
<section class="section section-mission" id="mission">
    <div class="mission-glow-1"></div>
    <div class="mission-glow-2"></div>

    <div class="container text-center">
        <div class="mission-badge">
            <span>🔬</span> PROPRIETARY CONVERSION ENGINE
        </div>
        <h2 class="mission-title">
            The Science Behind Every Booking Lift
        </h2>
        <p class="mission-subtitle">
            We don't rely on guesswork, generic themes, or static forms. Here is how our three-pillar behavioral telemetry and algorithmic analysis engine diagnoses friction and drives consistent 30% to 50%+ booking lifts for our partners.
        </p>

        <!-- 3 Core Pillars of the Proprietary Engine -->
        <div class="mission-cards-grid text-left">
            <!-- Pillar 1: Proprietary Data Collection -->
            <div class="mission-card">
                <div class="mission-card-icon-wrap" style="background: rgba(45, 155, 155, 0.15); border: 1px solid rgba(45, 155, 155, 0.3);">
                    📡
                </div>
                <h3 class="mission-card-title">1. Proprietary Telemetry Collection</h3>
                <p class="mission-card-desc">
                    Standard analytics only count pageviews and button submissions. Flowtrus collects granular, real-time micro-behavior: field dwell velocity, keystroke hesitation pauses, autocorrect friction, and abandoned inputs before the prospect ever leaves your page.
                </p>
                <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 13px; color: #74d682; font-weight: 600;">
                    ⚡ Millisecond-precision telemetry
                </div>
            </div>

            <!-- Pillar 2: Deep Analysis Engine -->
            <div class="mission-card">
                <div class="mission-card-icon-wrap" style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3);">
                    🧠
                </div>
                <h3 class="mission-card-title">2. Algorithmic Friction Diagnosis</h3>
                <p class="mission-card-desc">
                    Our analytical engine compares your booking flow against high-converting behavioral benchmarks. It pinpoints the exact question, date-picker hurdle, or pricing step where prospective clients freeze, revealing hidden conversion leaks invisible to Google Analytics.
                </p>
                <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 13px; color: #60a5fa; font-weight: 600;">
                    📊 Step-by-step funnel diagnostics
                </div>
            </div>

            <!-- Pillar 3: Achieving Partner Growth -->
            <div class="mission-card">
                <div class="mission-card-icon-wrap" style="background: rgba(107, 196, 125, 0.15); border: 1px solid rgba(107, 196, 125, 0.3);">
                    🚀
                </div>
                <h3 class="mission-card-title">3. Continuous Partner Optimization</h3>
                <p class="mission-card-desc">
                    We don't just build a form and walk away. Flowtrus acts as your dedicated CRO partner—using ongoing diagnostic data to iteratively refine copy, progressive question pacing, and mobile layouts to deliver an average 30% to 50%+ boost in completed bookings.
                </p>
                <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 13px; color: #34d399; font-weight: 600;">
                    📈 Measured ROI for every partner
                </div>
            </div>
        </div>

        <!-- Highlight Trust Bar -->
        <div class="mission-highlight-banner text-left">
            <div>
                <h4 style="color: white; font-size: 18px; font-weight: 700; margin-bottom: 6px;">Ready to see what your booking flow is leaving behind?</h4>
                <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0;">Experience our interactive form demo or schedule a white-glove CRO audit with our team.</p>
            </div>
            <div style="display: flex; gap: 14px; align-items: center;">
                <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-accent" style="padding: 12px 24px; font-weight: 700; border-radius: 8px;">Explore Interactive Demo →</a>
                <a href="#pricing" class="btn btn-secondary" style="padding: 12px 24px; font-weight: 700; border-radius: 8px; border-color: rgba(255,255,255,0.3); color: white;">View Partner Plans</a>
            </div>
        </div>
    </div>
</section>

<!-- Analytics Showcase Section -->
<section class="section">
    <div class="container">
        <div class="text-center mb-12">
            <h2>Powerful Data Analysis at Your Fingertips</h2>
            <p class="text-gray">Understand exactly how users interact with your forms and optimize for maximum
                conversions</p>
        </div>

        <div class="grid grid-2" style="align-items: center; gap: var(--spacing-12);">
            <!-- Heatmap Feature -->
            <div>
                <div class="analytics-demo">
                    <h3 style="margin-bottom: var(--spacing-6);">🔍 Field Friction Analysis</h3>
                    <div class="field-friction-card"
                        style="background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-lg); overflow: hidden; border: 1px solid var(--color-gray-200);">
                        <div
                            style="background: var(--color-gray-50); padding: var(--spacing-3) var(--spacing-4); border-bottom: 1px solid var(--color-gray-200); display: flex; justify-content: space-between; align-items: center;">
                            <span
                                style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-gray-500); text-transform: uppercase;">Field
                                Name</span>
                            <span
                                style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-gray-500); text-transform: uppercase;">Avg.
                                Time</span>
                        </div>

                        <!-- Friction Item 1: Good -->
                        <div
                            style="padding: var(--spacing-4); border-bottom: 1px solid var(--color-gray-100); display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center;">
                                <div
                                    style="width: 8px; height: 8px; background: var(--color-success); border-radius: 50%; margin-right: var(--spacing-3);">
                                </div>
                                <span style="font-weight: 500; font-size: var(--font-size-sm);">Full Name</span>
                            </div>
                            <div style="text-align: right;">
                                <span style="font-weight: 600; color: var(--color-gray-700);">2.4s</span>
                                <div
                                    style="width: 60px; height: 4px; background: var(--color-gray-200); border-radius: 2px; margin-top: 4px; overflow: hidden;">
                                    <div style="width: 20%; height: 100%; background: var(--color-success);"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Friction Item 2: Warning -->
                        <div
                            style="padding: var(--spacing-4); border-bottom: 1px solid var(--color-gray-100); display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center;">
                                <div
                                    style="width: 8px; height: 8px; background: var(--color-success); border-radius: 50%; margin-right: var(--spacing-3);">
                                </div>
                                <span style="font-weight: 500; font-size: var(--font-size-sm);">Email Address</span>
                            </div>
                            <div style="text-align: right;">
                                <span style="font-weight: 600; color: var(--color-gray-700);">3.1s</span>
                                <div
                                    style="width: 60px; height: 4px; background: var(--color-gray-200); border-radius: 2px; margin-top: 4px; overflow: hidden;">
                                    <div style="width: 30%; height: 100%; background: var(--color-success);"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Friction Item 3: High Friction -->
                        <div
                            style="padding: var(--spacing-4); background: rgba(239, 68, 68, 0.05); border-left: 3px solid var(--color-error); display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center;">
                                <div
                                    style="width: 8px; height: 8px; background: var(--color-error); border-radius: 50%; margin-right: var(--spacing-3);">
                                </div>
                                <div>
                                    <span
                                        style="font-weight: 600; font-size: var(--font-size-sm); color: var(--color-gray-900);">Project
                                        Budget</span>
                                    <span
                                        style="display: block; font-size: 10px; color: var(--color-error); font-weight: 600; margin-top: 2px;">⚠️
                                        HIGH FRICTION DETECTED</span>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <span style="font-weight: 700; color: var(--color-error);">14.2s</span>
                                <div
                                    style="width: 60px; height: 4px; background: var(--color-gray-200); border-radius: 2px; margin-top: 4px; overflow: hidden;">
                                    <div style="width: 85%; height: 100%; background: var(--color-error);"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3>Identify Bottlenecks instantly</h3>
                <p>Don't guess why users are leaving. Flowtrus tracks interaction data for every single field:</p>
                <ul style="margin-top: var(--spacing-4);">
                    <li><strong>Time-on-Field:</strong> See which questions take too long to answer.</li>
                    <li><strong>Refill Rate:</strong> Identify fields where users make mistakes and correct them.</li>
                    <li><strong>Hesitation:</strong> Track pauses before typing.</li>
                    <li><strong>Drop-off Attribution:</strong> Know exactly which field caused abandonment.</li>
                </ul>
                <a href="https://app.flowtrus.com" target="_blank" class="btn btn-primary mt-6">View Analytics Demo</a>
            </div>
        </div>

        <div class="grid grid-2" style="align-items: center; gap: var(--spacing-12); margin-top: var(--spacing-16);">
            <div>
                <h3>Form Completion Analysis</h3>
                <p>Track user progress through every step of your forms with detailed completion analytics:</p>
                <ul style="margin-top: var(--spacing-4);">
                    <li><strong>Step-by-Step Tracking:</strong> Monitor completion rates for each form step</li>
                    <li><strong>Drop-off Points:</strong> Identify exactly where users abandon forms</li>
                    <li><strong>Time Analysis:</strong> See how long users spend on each field</li>
                    <li><strong>Conversion Funnels:</strong> Visualize the entire user journey</li>
                </ul>
                <div class="mt-6">
                    <div class="stat-item" style="display: inline-block; margin-right: var(--spacing-4);">
                        <span class="stat-value" style="font-size: var(--font-size-3xl);">68%</span>
                        <span class="stat-label">Avg. Completion Rate</span>
                    </div>
                    <div class="stat-item" style="display: inline-block;">
                        <span class="stat-value" style="font-size: var(--font-size-3xl);">3:42</span>
                        <span class="stat-label">Avg. Completion Time</span>
                    </div>
                </div>
            </div>

            <!-- Step Tracker Visualization -->
            <div>
                <div class="card">
                    <h4 style="text-align: center; margin-bottom: var(--spacing-6);">Multi-Step Form Progress</h4>
                    <div class="step-tracker">
                        <div class="step completed">
                            <div class="step-circle">1</div>
                            <span
                                style="font-size: var(--font-size-sm); display: block; margin-top: var(--spacing-2);">Basic
                                Info</span>
                            <p
                                style="font-size: var(--font-size-xs); color: var(--color-accent); margin-top: var(--spacing-1);">
                                95% complete</p>
                        </div>
                        <div class="step completed">
                            <div class="step-circle">2</div>
                            <span
                                style="font-size: var(--font-size-sm); display: block; margin-top: var(--spacing-2);">Details</span>
                            <p
                                style="font-size: var(--font-size-xs); color: var(--color-accent); margin-top: var(--spacing-1);">
                                87% complete</p>
                        </div>
                        <div class="step active">
                            <div class="step-circle">3</div>
                            <span
                                style="font-size: var(--font-size-sm); display: block; margin-top: var(--spacing-2);">Preferences</span>
                            <p
                                style="font-size: var(--font-size-xs); color: var(--color-secondary); margin-top: var(--spacing-1);">
                                62% complete</p>
                        </div>
                        <div class="step">
                            <div class="step-circle">4</div>
                            <span
                                style="font-size: var(--font-size-sm); display: block; margin-top: var(--spacing-2);">Submit</span>
                            <p
                                style="font-size: var(--font-size-xs); color: var(--color-gray-500); margin-top: var(--spacing-1);">
                                45% complete</p>
                        </div>
                    </div>
                    <p class="text-gray mt-6" style="text-align: center; font-size: var(--font-size-sm);">
                        💡 <strong>Insight:</strong> Step 3 shows 25% drop-off - consider simplifying options
                    </p>
                </div>
            </div>
        </div>

        <div
            style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-8); margin-top: var(--spacing-12); align-items: center;">
            <div style="order: 2;">
                <span
                    style="color: var(--color-warning); font-weight: 600; letter-spacing: 1px; font-size: 12px; text-transform: uppercase;">Stop
                    Losing Leads</span>
                <h3 style="margin-top: 10px; margin-bottom: 20px;">Abandoned Form Recapture</h3>
                <p class="text-gray" style="margin-bottom: 20px;">Most users leave before clicking submit. Flowtrus
                    captures their data in real-time as they type.</p>
                <ul style="list-style: none; padding: 0; margin-bottom: 30px;">
                    <li style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                        <span style="color: var(--color-success);">✓</span> Capture name & email instantly
                    </li>
                    <li style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                        <span style="color: var(--color-success);">✓</span> Automated follow-up sequences
                    </li>
                    <li style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: var(--color-success);">✓</span> Recover up to 40% of lost leads
                    </li>
                </ul>
            </div>

            <div style="order: 1;">
                <!-- Recovery Visual Card -->
                <div class="card recovery-card" style="border-left: 4px solid #f59e0b; padding: 0; overflow: hidden;">
                    <div
                        style="background: #fffbeb; padding: 15px 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #fcd34d;">
                        <h4
                            style="margin: 0; display: flex; align-items: center; gap: 10px; font-size: 16px; color: #92400e;">
                            <span class="pulse-warning"
                                style="width: 10px; height: 10px; background: #f59e0b; border-radius: 50%; display: inline-block;"></span>
                            Lead Opportunity #842
                        </h4>
                        <span
                            style="background: white; color: #b45309; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: 1px solid #fcd34d;">ABANDONED
                            2m AGO</span>
                    </div>

                    <div style="padding: 25px;">
                        <!-- Status Timeline -->
                        <div style="display: flex; gap: 15px; margin-bottom: 20px; font-size: 13px;">
                            <div style="opacity: 0.5;">Step 1: Contact</div>
                            <div style="color: #f59e0b; font-weight: 700;">Step 2: Details (Drop-off)</div>
                            <div style="opacity: 0.3;">Step 3: Submit</div>
                        </div>

                        <!-- Partial Data -->
                        <div class="partial-data-list"
                            style="background: #f8fafc; border-radius: 8px; padding: 15px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                            <div
                                style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">
                                <span style="color: #64748b;">Name Input:</span>
                                <span
                                    style="font-weight: 600; color: var(--color-success); display: flex; align-items: center; gap: 5px;">Sarah
                                    Jenkins <span
                                        style="font-size: 10px; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px;">SAVED</span></span>
                            </div>
                            <div
                                style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">
                                <span style="color: #64748b;">Email Input:</span>
                                <span
                                    style="font-weight: 600; color: var(--color-success); display: flex; align-items: center; gap: 5px;">sarah.j@gm...
                                    <span
                                        style="font-size: 10px; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px;">SAVED</span></span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #64748b;">Phone Input:</span>
                                <span style="font-style: italic; color: #94a3b8;">(Not entered)</span>
                            </div>
                        </div>

                        <div class="btn btn-primary btn-full-width"
                            style="text-align: center; background: #f59e0b; border: none; width: 100%;">Recover this
                            Lead (1-Click)</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>



<!-- ROI Calculator Section -->
<section class="section section-roi"
    style="background: linear-gradient(135deg, #091726 0%, #133353 50%, #0d2238 100%); color: white; position: relative; overflow: hidden;">
    <!-- Decorative background elements -->
    <div
        style="position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; filter: blur(60px);">
    </div>
    <div
        style="position: absolute; bottom: -100px; left: -100px; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; filter: blur(60px);">
    </div>

    <div class="container" style="position: relative; z-index: 2;">
        <div class="text-center mb-12">
            <span
                style="display: inline-block; background: rgba(255, 255, 255, 0.2); color: white; padding: var(--spacing-2) var(--spacing-4); border-radius: var(--border-radius-lg); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-4); backdrop-filter: blur(10px);">💰
                ROI CALCULATOR</span>
            <h2 style="color: white; font-size: var(--font-size-4xl);">Calculate Your Potential Return</h2>
            <p
                style="color: rgba(255, 255, 255, 0.9); font-size: var(--font-size-lg); max-width: 600px; margin: 0 auto;">
                See how much revenue you could generate by optimizing your forms with Flowtrus.</p>
        </div>

        <div class="roi-calculator grid grid-2"
            style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--border-radius-xl); padding: var(--spacing-8); backdrop-filter: blur(10px); gap: var(--spacing-8);">

            <!-- Inputs -->
            <div class="roi-inputs">
                <div class="roi-input-group mb-6">
                    <div
                        style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-2); align-items: center;">
                        <label style="font-weight: 600;">Monthly Website Visitors</label>
                        <input type="number" id="input-visitors" value="5000" min="500" max="100000" step="500"
                            class="roi-number-input">
                    </div>
                    <input type="range" id="visitors" min="500" max="100000" step="500" value="5000"
                        class="flowtrus-range">
                </div>

                <div class="roi-input-group mb-6">
                    <div
                        style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-2); align-items: center;">
                        <label style="font-weight: 600;">Current Conversion Rate (%)</label>
                        <input type="number" id="input-conversion" value="2.5" min="0.1" max="10" step="0.1"
                            class="roi-number-input">
                    </div>
                    <input type="range" id="conversion" min="0.1" max="10" step="0.1" value="2.5"
                        class="flowtrus-range">
                </div>

                <div class="roi-input-group mb-6">
                    <div
                        style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-2); align-items: center;">
                        <label style="font-weight: 600;">Average Deal Value ($)</label>
                        <input type="number" id="input-deal-value" value="1200" min="100" max="50000" step="100"
                            class="roi-number-input">
                    </div>
                    <input type="range" id="deal-value" min="100" max="50000" step="100" value="1200"
                        class="flowtrus-range">
                </div>

                <!-- Industry Benchmarks -->
                <div class="roi-benchmarks"
                    style="margin-top: var(--spacing-8); padding: var(--spacing-6); background: rgba(0,0,0,0.2); border-radius: var(--border-radius-lg);">
                    <h5
                        style="color: rgba(255,255,255,0.9); margin-bottom: var(--spacing-3); font-size: var(--font-size-sm); text-transform: uppercase; letter-spacing: 0.05em;">
                        📊 Industry Benchmarks</h5>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4);">
                        <div>
                            <span
                                style="display: block; font-size: var(--font-size-xs); color: rgba(255,255,255,0.6);">Avg.
                                Conversion</span>
                            <span style="display: block; font-weight: 600; color: white;">2.35%</span>
                        </div>
                        <div>
                            <span
                                style="display: block; font-size: var(--font-size-xs); color: rgba(255,255,255,0.6);">Top
                                10% Performers</span>
                            <span style="display: block; font-weight: 600; color: var(--color-accent);">11.45%</span>
                        </div>
                    </div>
                    <p
                        style="font-size: var(--font-size-xs); color: rgba(255,255,255,0.5); margin-top: var(--spacing-3); font-style: italic;">
                        Source: WordStream Industry Analysis</p>
                </div>
            </div>

            <!-- Results -->
            <div class="roi-results"
                style="display: flex; flex-direction: column; justify-content: center; border-left: 1px solid rgba(255, 255, 255, 0.2); padding-left: var(--spacing-8);">

                <div class="mb-8 text-center sm-text-left">
                    <p
                        style="font-size: var(--font-size-sm); color: rgba(255, 255, 255, 0.8); margin-bottom: var(--spacing-1);">
                        Projected Annual Revenue Increase</p>
                    <div id="result-revenue"
                        style="font-size: 3.5rem; font-weight: 800; color: var(--color-accent); text-shadow: 0 4px 12px rgba(0,0,0,0.2); line-height: 1;">
                        $54,000</div>
                    <p
                        style="font-size: var(--font-size-xs); color: rgba(255, 255, 255, 0.6); margin-top: var(--spacing-2);">
                        Based on conservative 30% lift estimates</p>
                </div>

                <div class="grid grid-2 gap-4">
                    <div
                        style="background: rgba(0, 0, 0, 0.2); padding: var(--spacing-4); border-radius: var(--border-radius-lg);">
                        <span
                            style="display: block; font-size: var(--font-size-xs); color: rgba(255, 255, 255, 0.7);">Extra
                            Monthly Leads</span>
                        <span id="result-leads"
                            style="display: block; font-size: var(--font-size-2xl); font-weight: 700; color: white;">+38</span>
                    </div>
                    <div
                        style="background: rgba(0, 0, 0, 0.2); padding: var(--spacing-4); border-radius: var(--border-radius-lg);">
                        <span
                            style="display: block; font-size: var(--font-size-xs); color: rgba(255, 255, 255, 0.7);">Hours
                            Saved / Year</span>
                        <span id="result-time"
                            style="display: block; font-size: var(--font-size-2xl); font-weight: 700; color: white;">260h</span>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-accent btn-wide"
                        style="width: 100%;">Start Generating Results →</a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Pricing Grid Tiers Section -->
<section class="section" id="pricing" style="padding: 80px 0; background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);">
    <div class="container">
        <div class="text-center mb-12" style="text-align: center; margin-bottom: 50px;">
            <span
                style="display: inline-block; background: linear-gradient(135deg, var(--color-secondary), var(--color-accent)); color: white; padding: var(--spacing-2) var(--spacing-4); border-radius: var(--border-radius-lg); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-4);">💳 SIMPLE, TRANSPARENT PRICING</span>
            <h2 style="font-family: var(--font-title); font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 10px; font-size: var(--font-size-4xl, 36px);">White-Glove Form Optimization Plans</h2>
            <p class="text-gray" style="color: #64748b; font-size: 16px; max-width: 650px; margin: 0 auto;">We build, style, and monitor your forms for you—so you can focus on running your business.</p>
        </div>

        <div class="grid grid-3" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; align-items: stretch; margin-bottom: 30px;">
            
            <!-- Growth Plan Card -->
            <div class="card" style="background: white; border: 1px solid var(--color-border, #e2e8f0); border-top: 4px solid var(--color-secondary, #2d9b9b); border-radius: 12px; padding: 35px 30px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div>
                    <h3 style="font-family: var(--font-title); font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 10px; font-size: 20px;">Growth Plan</h3>
                    <p class="text-gray" style="color: #64748b; font-size: 13.5px; line-height: 1.4; margin-bottom: 25px;">
                        Ideal for local businesses looking to optimize their primary landing page or client intake form.
                    </p>
                    
                    <div style="margin-bottom: 25px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 20px;">
                        <span style="font-size: 38px; font-weight: 800; color: var(--color-primary, #1a4d7c); font-family: var(--font-title);">$499</span>
                        <span class="text-gray" style="color: #64748b; font-size: 13px; font-weight: 500;"> setup fee</span>
                        <div style="font-size: 20px; font-weight: 700; color: var(--color-secondary, #2d9b9b); margin-top: 6px; display: flex; align-items: baseline; gap: 4px;">
                            +$99<span style="font-size: 12px; font-weight: 500; color: #64748b;">/month optimization</span>
                        </div>
                    </div>

                    <ul style="list-style: none; padding: 0; margin: 0 0 30px 0; font-size: 13.5px; line-height: 2.2; color: #334155;">
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ 1 Custom Form Flow</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Full Brand & Color Match</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Submissions Dashboard Access</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Standard Webhook CRM Integrations</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Monthly Telemetry Analytics Report</li>
                        <li style="display: flex; align-items: center; gap: 8px; color: #94a3b8; text-decoration: line-through;">❌ Custom CSS stylesheet overrides</li>
                        <li style="display: flex; align-items: center; gap: 8px; color: #94a3b8; text-decoration: line-through;">❌ Abandoned lead recovery logs</li>
                    </ul>
                </div>
                <button class="btn btn-secondary btn-full-width flowtrus-trigger" data-form-id="service-booking" style="width: 100%; text-align: center; font-weight: 700; border-radius: 6px; padding: 12px 0; cursor: pointer;">Get Started</button>
            </div>

            <!-- Pro Plan Card (Highlighted) -->
            <div class="card" style="background: white; border: 2px solid var(--color-primary, #1a4d7c); border-top: 6px solid var(--color-primary, #1a4d7c); border-radius: 12px; padding: 35px 30px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); transform: scale(1.03); z-index: 10; position: relative;">
                <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background-color: var(--color-primary, #1a4d7c); color: white; padding: 3px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;">Most Popular</div>
                <div>
                    <h3 style="font-family: var(--font-title); font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 10px; font-size: 20px;">Pro Optimize Plan</h3>
                    <p class="text-gray" style="color: #64748b; font-size: 13.5px; line-height: 1.4; margin-bottom: 25px;">
                        Best for growing companies that want multi-step layouts, custom styling, and automated CRM syncs.
                    </p>
                    
                    <div style="margin-bottom: 25px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 20px;">
                        <span style="font-size: 38px; font-weight: 800; color: var(--color-primary, #1a4d7c); font-family: var(--font-title);">$999</span>
                        <span class="text-gray" style="color: #64748b; font-size: 13px; font-weight: 500;"> setup fee</span>
                        <div style="font-size: 20px; font-weight: 700; color: var(--color-secondary, #2d9b9b); margin-top: 6px; display: flex; align-items: baseline; gap: 4px;">
                            +$249<span style="font-size: 12px; font-weight: 500; color: #64748b;">/month optimization</span>
                        </div>
                    </div>

                    <ul style="list-style: none; padding: 0; margin: 0 0 30px 0; font-size: 13.5px; line-height: 2.2; color: #334155;">
                        <li style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--color-primary, #1a4d7c);">✔️ Up to 3 Custom Form Flows</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Lightbox Modals & Inline Embeds</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Advanced Theme Styling & Custom CSS</li>
                        <li style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--color-secondary, #2d9b9b);">✔️ Abandoned Lead Recovery Telemetry</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Automated CRM Sync (HubSpot, Salesforce)</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Priority 24h Turnaround Revisions</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Bi-weekly Analytical CRO Audits</li>
                    </ul>
                </div>
                <button class="btn btn-primary btn-full-width flowtrus-trigger" data-form-id="service-booking" style="width: 100%; text-align: center; font-weight: 700; border-radius: 6px; padding: 12px 0; cursor: pointer;">Get Started</button>
            </div>

            <!-- Enterprise Suite Card -->
            <div class="card" style="background: white; border: 1px solid var(--color-border, #e2e8f0); border-top: 4px solid var(--color-accent, #6bc47d); border-radius: 12px; padding: 35px 30px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div>
                    <h3 style="font-family: var(--font-title); font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 10px; font-size: 20px;">Enterprise Suite</h3>
                    <p class="text-gray" style="color: #64748b; font-size: 13.5px; line-height: 1.4; margin-bottom: 25px;">
                        For high-volume lead generators, digital marketing agencies, and complex database needs.
                    </p>
                    
                    <div style="margin-bottom: 25px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 20px;">
                        <span style="font-size: 34px; font-weight: 800; color: var(--color-primary, #1a4d7c); font-family: var(--font-title);">Custom</span>
                        <span class="text-gray" style="color: #64748b; font-size: 13px; font-weight: 500;"> quote setup</span>
                        <div style="font-size: 20px; font-weight: 700; color: var(--color-secondary, #2d9b9b); margin-top: 6px; display: flex; align-items: baseline; gap: 4px;">
                            Contact Us
                        </div>
                    </div>

                    <ul style="list-style: none; padding: 0; margin: 0 0 30px 0; font-size: 13.5px; line-height: 2.2; color: #334155;">
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Unlimited Custom Form Flows</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Dedicated Multi-Client Portal Access</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Custom JavaScript Validation Hooks</li>
                        <li style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--color-accent, #6bc47d);">✔️ Slack/SMS Abandoned Lead Alerts</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Dedicated CRO Account Manager</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ SLA Response Guarantees (&lt;4 Hours)</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Custom Multi-variate Conversion Tests</li>
                    </ul>
                </div>
                <button class="btn btn-secondary btn-full-width flowtrus-trigger" data-form-id="lead-capture" style="width: 100%; text-align: center; font-weight: 700; border-radius: 6px; padding: 12px 0; cursor: pointer;">Get Quote</button>
            </div>

        </div>
    </div>
</section>

<!-- Stats Section -->
<section class="section" style="background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);">
    <div class="container">
        <div class="text-center mb-12">
            <span
                style="display: inline-block; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); color: white; padding: var(--spacing-2) var(--spacing-4); border-radius: var(--border-radius-lg); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-4);">📊
                PROVEN RESULTS</span>
            <h2 style="font-size: var(--font-size-4xl);">The Numbers Speak for Themselves</h2>
        </div>

        <div class="grid grid-4">
            <div class="card"
                style="text-align: center; background: linear-gradient(135deg, rgba(107, 196, 125, 0.1), rgba(255, 255, 255, 1)); border-top: 4px solid var(--color-accent);">
                <span class="stat-value"
                    style="font-size: var(--font-size-6xl); background: linear-gradient(135deg, var(--color-accent), var(--color-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">40%</span>
                <span class="stat-label"
                    style="font-weight: var(--font-weight-semibold); color: var(--color-gray-700);">Higher Conversion
                    Rates</span>
            </div>

            <div class="card"
                style="text-align: center; background: linear-gradient(135deg, rgba(45, 155, 155, 0.1), rgba(255, 255, 255, 1)); border-top: 4px solid var(--color-secondary);">
                <span class="stat-value"
                    style="font-size: var(--font-size-6xl); background: linear-gradient(135deg, var(--color-secondary), var(--color-primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">60%</span>
                <span class="stat-label"
                    style="font-weight: var(--font-weight-semibold); color: var(--color-gray-700);">Faster Data
                    Collection</span>
            </div>

            <div class="card"
                style="text-align: center; background: linear-gradient(135deg, rgba(26, 77, 124, 0.1), rgba(255, 255, 255, 1)); border-top: 4px solid var(--color-primary);">
                <span class="stat-value"
                    style="font-size: var(--font-size-6xl); background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">99.9%</span>
                <span class="stat-label"
                    style="font-weight: var(--font-weight-semibold); color: var(--color-gray-700);">Uptime
                    Guarantee</span>
            </div>

            <div class="card"
                style="text-align: center; background: linear-gradient(135deg, rgba(107, 196, 125, 0.1), rgba(255, 255, 255, 1)); border-top: 4px solid var(--color-accent);">
                <span class="stat-value"
                    style="font-size: var(--font-size-6xl); background: linear-gradient(135deg, var(--color-accent), var(--color-primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">500+</span>
                <span class="stat-label"
                    style="font-weight: var(--font-weight-semibold); color: var(--color-gray-700);">Happy Clients</span>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="section section-primary">
    <div class="container text-center">
        <h2>Ready to Transform Your Conversion Rates?</h2>
        <p>Join hundreds of businesses already using Flowtrus to collect more data and close more deals.</p>
        <div class="hero-cta mt-8">
            <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-accent btn-lg">See Live Demo</a>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="btn btn-secondary btn-lg"
                style="background-color: white; color: var(--color-primary);">Contact Sales</a>
        </div>
    </div>
</section>

<?php
get_footer();
