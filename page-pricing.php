<?php
/**
 * Template Name: Pricing Page
 * 
 * @package Flowtrus
 */

get_header();
?>

<div class="pricing-page">
    <!-- Hero Header Banner -->
    <section class="hero hero-compact">
        <div class="container hero-content">
            <h1>Transparent, Results-Driven Pricing</h1>
            <p>Done-For-You custom form layout creation and ongoing conversion rate optimization (CRO) to maximize your website leads.</p>
        </div>
    </section>

    <!-- Pricing Grid Tiers Section -->
    <section class="section" style="padding: 80px 0;">
        <div class="container">
            <div class="text-center mb-12" style="text-align: center; margin-bottom: 50px;">
                <h2 style="font-family: var(--font-title); font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 10px; font-size: 28px;">White-Glove Form Optimization Plans</h2>
                <p class="text-gray" style="color: #64748b; font-size: 15px;">We build, style, and monitor your forms for you—so you can focus on running your business.</p>
            </div>

            <div class="grid grid-3" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; align-items: stretch; margin-bottom: 60px;">
                
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


    <!-- ROI Calculator Section -->
    <section class="section section-roi"
        style="background: linear-gradient(135deg, #091726 0%, #133353 50%, #0d2238 100%); color: white; position: relative; overflow: hidden; padding: 80px 0;">
        <!-- Decorative background elements -->
        <div
            style="position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; filter: blur(60px);">
        </div>
        <div
            style="position: absolute; bottom: -100px; left: -100px; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; filter: blur(60px);">
        </div>

        <div class="container" style="position: relative; z-index: 2;">
            <div class="text-center mb-12" style="text-align: center; margin-bottom: var(--spacing-8, 30px);">
                <span
                    style="display: inline-block; background: rgba(255, 255, 255, 0.2); color: white; padding: var(--spacing-2, 8px) var(--spacing-4, 16px); border-radius: var(--border-radius-lg, 8px); font-size: var(--font-size-sm, 14px); font-weight: var(--font-weight-semibold, 600); margin-bottom: var(--spacing-4, 16px); backdrop-filter: blur(10px);">💰
                    ROI CALCULATOR</span>
                <h2 style="color: white; font-size: var(--font-size-4xl, 36px); font-family: var(--font-title); font-weight: 700; margin-bottom: 10px;">Calculate Your Potential Return</h2>
                <p
                    style="color: rgba(255, 255, 255, 0.9); font-size: var(--font-size-lg, 18px); max-width: 600px; margin: 0 auto;">
                    See how much revenue you could generate by optimizing your forms with Flowtrus.</p>
            </div>

            <div class="roi-calculator grid grid-2"
                style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--border-radius-xl, 12px); padding: var(--spacing-8, 32px); backdrop-filter: blur(10px); gap: var(--spacing-8, 32px);">

                <!-- Inputs -->
                <div class="roi-inputs">
                    <div class="roi-input-group mb-6" style="margin-bottom: 24px;">
                        <div
                            style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-2, 8px); align-items: center;">
                            <label style="font-weight: 600;">Monthly Website Visitors</label>
                            <input type="number" id="input-visitors" value="5000" min="500" max="100000" step="500"
                                class="roi-number-input">
                        </div>
                        <input type="range" id="visitors" min="500" max="100000" step="500" value="5000"
                            class="flowtrus-range" style="width: 100%;">
                    </div>

                    <div class="roi-input-group mb-6" style="margin-bottom: 24px;">
                        <div
                            style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-2, 8px); align-items: center;">
                            <label style="font-weight: 600;">Current Conversion Rate (%)</label>
                            <input type="number" id="input-conversion" value="2.5" min="0.1" max="10" step="0.1"
                                class="roi-number-input">
                        </div>
                        <input type="range" id="conversion" min="0.1" max="10" step="0.1" value="2.5"
                            class="flowtrus-range" style="width: 100%;">
                    </div>

                    <div class="roi-input-group mb-6" style="margin-bottom: 24px;">
                        <div
                            style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-2, 8px); align-items: center;">
                            <label style="font-weight: 600;">Average Deal Value ($)</label>
                            <input type="number" id="input-deal-value" value="1200" min="100" max="50000" step="100"
                                class="roi-number-input">
                        </div>
                        <input type="range" id="deal-value" min="100" max="50000" step="100" value="1200"
                            class="flowtrus-range" style="width: 100%;">
                    </div>

                    <!-- Industry Benchmarks -->
                    <div class="roi-benchmarks"
                        style="margin-top: var(--spacing-8, 32px); padding: var(--spacing-6, 24px); background: rgba(0,0,0,0.2); border-radius: var(--border-radius-lg, 8px);">
                        <h5
                            style="color: rgba(255,255,255,0.9); margin-bottom: var(--spacing-3, 12px); font-size: var(--font-size-sm, 14px); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0; font-weight: 700;">
                            📊 Industry Benchmarks</h5>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4, 16px);">
                            <div>
                                <span
                                    style="display: block; font-size: var(--font-size-xs, 12px); color: rgba(255,255,255,0.6);">Avg.
                                    Conversion</span>
                                <span style="display: block; font-weight: 600; color: white;">2.35%</span>
                            </div>
                            <div>
                                <span
                                    style="display: block; font-size: var(--font-size-xs, 12px); color: rgba(255,255,255,0.6);">Top
                                    10% Performers</span>
                                <span style="display: block; font-weight: 600; color: var(--color-accent, #6bc47d);">11.45%</span>
                            </div>
                        </div>
                        <p
                            style="font-size: var(--font-size-xs, 12px); color: rgba(255,255,255,0.5); margin-top: var(--spacing-3, 12px); font-style: italic; margin-bottom: 0;">
                            Source: WordStream Industry Analysis</p>
                    </div>
                </div>

                <!-- Results -->
                <div class="roi-results"
                    style="display: flex; flex-direction: column; justify-content: center; border-left: 1px solid rgba(255, 255, 255, 0.2); padding-left: var(--spacing-8, 32px);">

                    <div class="mb-8 text-center sm-text-left" style="margin-bottom: 32px;">
                        <p
                            style="font-size: var(--font-size-sm, 14px); color: rgba(255, 255, 255, 0.8); margin-bottom: var(--spacing-1, 4px); margin-top: 0;">
                            Projected Annual Revenue Increase</p>
                        <div id="result-revenue"
                            style="font-size: 3.5rem; font-weight: 800; color: var(--color-accent, #6bc47d); text-shadow: 0 4px 12px rgba(0,0,0,0.2); line-height: 1;">
                            $54,000</div>
                        <p
                            style="font-size: var(--font-size-xs, 12px); color: rgba(255, 255, 255, 0.6); margin-top: var(--spacing-2, 8px); margin-bottom: 0;">
                            Based on conservative 30% lift estimates</p>
                    </div>

                    <div class="grid grid-2 gap-4" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div
                            style="background: rgba(0, 0, 0, 0.2); padding: var(--spacing-4, 16px); border-radius: var(--border-radius-lg, 8px);">
                            <span
                                style="display: block; font-size: var(--font-size-xs, 12px); color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Extra
                                Monthly Leads</span>
                            <span id="result-leads"
                                style="display: block; font-size: var(--font-size-2xl, 24px); font-weight: 700; color: white;">+38</span>
                        </div>
                        <div
                            style="background: rgba(0, 0, 0, 0.2); padding: var(--spacing-4, 16px); border-radius: var(--border-radius-lg, 8px);">
                            <span
                                style="display: block; font-size: var(--font-size-xs, 12px); color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Hours
                                Saved / Year</span>
                            <span id="result-time"
                                style="display: block; font-size: var(--font-size-2xl, 24px); font-weight: 700; color: white;">260h</span>
                        </div>
                    </div>

                    <div class="mt-8 text-center" style="margin-top: 32px;">
                        <a href="<?php echo esc_url(home_url('/contact')); ?>" class="btn btn-accent btn-wide"
                            style="width: 100%; text-decoration: none; display: block; text-align: center; padding: 12px 0; font-weight: 700; border-radius: 6px;">Start Generating Results →</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="section" style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 80px 0;">
        <div class="container" style="max-width: 800px; margin: 0 auto;">
            <h2 class="text-center mb-10" style="text-align: center; font-family: var(--font-title); font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 40px; font-size: 26px;">Frequently Asked Questions</h2>
            
            <div style="display: flex; flex-direction: column; gap: 30px;">
                <div>
                    <h4 style="font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 8px; font-size: 16px;">What does the setup fee cover?</h4>
                    <p class="text-gray" style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">
                        The setup fee covers our onboarding consultation, auditing your current form conversion rates, coding your custom multi-step structures, designing style properties that integrate cleanly with your branding guidelines, setting up metrics telemetry, and configuring webhook sync pipelines.
                    </p>
                </div>

                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0;">

                <div>
                    <h4 style="font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 8px; font-size: 16px;">What is included in the monthly optimization retainer?</h4>
                    <p class="text-gray" style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">
                        We continuously analyze field interaction metrics (focus time, drop-off hotspots, and correction counts). The monthly retainer covers this proactive CRO monitoring, access to your portal dashboard, priority turnaround on any layout/field modification requests you submit, and CRM endpoint maintenance.
                    </p>
                </div>

                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0;">

                <div>
                    <h4 style="font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 8px; font-size: 16px;">What are "Abandoned Leads" and how do you capture them?</h4>
                    <p class="text-gray" style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">
                        When visitors fill in their name or contact info in Step 1 but drop off mid-way through Step 2 or 3, we capture their entries in real-time. We sync these immediately to your dashboard log and webhooks as partial "Abandoned Leads" so your sales team can run recovery campaigns before they grow cold.
                    </p>
                </div>

                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0;">

                <div>
                    <h4 style="font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 8px; font-size: 16px;">Can I cancel the monthly optimization retainer?</h4>
                    <p class="text-gray" style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">
                        Yes. Our services are billed month-to-month, and you can cancel anytime. If you choose to cancel, your forms will remain live on the last configured layout on your site, but dashboard tracking, layout requests, and lead webhook syncing will deactivate.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Bottom Call To Action Callout Section -->
    <section class="section text-center" style="padding: 80px 0; text-align: center;">
        <div class="container" style="max-width: 600px; margin: 0 auto;">
            <h2 style="font-family: var(--font-title); font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 12px; font-size: 28px;">Ready to optimize your conversion rates?</h2>
            <p class="text-gray" style="color: #64748b; font-size: 15px; margin-bottom: 25px;">
                Let's discuss how customized, high-converting form layouts can turn more website visitors into booked clients.
            </p>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="btn btn-accent btn-lg" style="display: inline-block; padding: 14px 28px; font-weight: 700; border-radius: 6px; text-decoration: none;">Book Onboarding Call</a>
        </div>
    </section>
</div>

<?php
get_footer();
