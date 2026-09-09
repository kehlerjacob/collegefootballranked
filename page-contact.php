<?php
/**
 * Template Name: Contact Page
 * 
 * @package Flowtrus
 */

get_header();
?>

<section class="hero hero-compact">
    <div class="container hero-content">
        <h1>Get in Touch</h1>
        <p>Let's discuss how Flowtrus can transform your conversion rates</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="grid grid-2">
            <div>
                <h2>Contact Our Team</h2>
                <p>Have questions about Flowtrus? Want to see a personalized demo? Our team is here to help.</p>

                <div class="mt-8">
                    <h3>Why Contact Us?</h3>
                    <ul>
                        <li>📞 Schedule a personalized demo</li>
                        <li>💬 Discuss your specific needs</li>
                        <li>📊 Get a custom quote</li>
                        <li>🔧 Technical support</li>
                        <li>🤝 Partnership opportunities</li>
                    </ul>
                </div>

                <div class="mt-8">
                    <h3>Contact Information</h3>
                    <p><strong>Email:</strong> <a href="mailto:hello@flowtrus.com">hello@flowtrus.com</a></p>
                    <p><strong>Phone:</strong> <a href="tel:+18005551234">(800) 555-1234</a></p>
                    <p><strong>Hours:</strong> Monday - Friday, 9am - 6pm EST</p>
                </div>

                <div class="mt-8">
                    <h3>Quick Links</h3>
                    <div class="flex-column gap-4">
                        <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-secondary">Try Interactive
                            Demo</a>
                        <a href="<?php echo esc_url(home_url('/case-studies')); ?>" class="btn btn-secondary">View Case
                            Studies</a>
                        <a href="<?php echo esc_url(home_url('/solutions')); ?>" class="btn btn-secondary">Explore
                            Solutions</a>
                    </div>
                </div>
            </div>

            <div>
                <div class="card">
                    <h3>Send Us a Message</h3>

                    <!-- Flowtrus contact form integration -->
                    <?php echo do_shortcode('[flowtrus_form id="contact-form"]'); ?>

                    <!-- Fallback contact form -->
                    <form class="mt-6" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                        <input type="hidden" name="action" value="flowtrus_contact_form">
                        <?php wp_nonce_field('flowtrus_contact_form', 'flowtrus_contact_nonce'); ?>

                        <div class="form-group">
                            <label class="form-label" for="contact_name">Name *</label>
                            <input type="text" id="contact_name" name="contact_name" class="form-input" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="contact_email">Email *</label>
                            <input type="email" id="contact_email" name="contact_email" class="form-input" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="contact_phone">Phone</label>
                            <input type="tel" id="contact_phone" name="contact_phone" class="form-input">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="contact_company">Company</label>
                            <input type="text" id="contact_company" name="contact_company" class="form-input">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="contact_interest">I'm interested in:</label>
                            <select id="contact_interest" name="contact_interest" class="form-select">
                                <option value="">Select an option</option>
                                <option value="demo">Scheduling a demo</option>
                                <option value="pricing">Getting pricing information</option>
                                <option value="support">Technical support</option>
                                <option value="partnership">Partnership opportunities</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="contact_message">Message *</label>
                            <textarea id="contact_message" name="contact_message" class="form-textarea"
                                required></textarea>
                        </div>

                        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section section-gray">
    <div class="container">
        <div class="text-center mb-12">
            <h2>Frequently Asked Questions</h2>
        </div>

        <div class="grid grid-2">
            <div class="card">
                <h4>How long does implementation take?</h4>
                <p>Most clients are up and running within 24 hours. Our simple shortcode integration means you can add
                    forms to your site in minutes.</p>
            </div>

            <div class="card">
                <h4>Do you offer a free trial?</h4>
                <p>Yes! We offer a 14-day free trial with full access to all features. No credit card required.</p>
            </div>

            <div class="card">
                <h4>Can I customize the forms?</h4>
                <p>Absolutely. You can customize colors, fonts, fields, and flows to match your brand and specific
                    needs.</p>
            </div>

            <div class="card">
                <h4>Is my data secure?</h4>
                <p>Yes. We use 256-bit SSL encryption and are SOC 2 Type II certified. Your data is protected with
                    enterprise-grade security.</p>
            </div>

            <div class="card">
                <h4>What kind of support do you offer?</h4>
                <p>We provide email and phone support during business hours, plus comprehensive documentation and video
                    tutorials.</p>
            </div>

            <div class="card">
                <h4>Can I integrate with my CRM?</h4>
                <p>Yes. Flowtrus integrates with popular CRMs like Salesforce, HubSpot, and Pipedrive, plus custom
                    webhooks for any system.</p>
            </div>
        </div>
    </div>
</section>

<?php
get_footer();
