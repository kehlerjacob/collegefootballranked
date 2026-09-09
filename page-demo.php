<?php
/**
 * Template Name: Demo Page
 */

get_header(); ?>

<div class="demo-page">
    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>Explore Form Templates</h1>
                <p>See how Flowtrus adapts to different industries with specialized, high-converting booking and lead capture forms.</p>
            </div>
        </div>
    </section>

    <!-- Niche Grid -->
    <section class="section">
        <div class="container">
            <div class="niche-grid">

                <!-- Logistics & Transport -->
                <div class="niche-card">
                    <img src="https://placehold.co/600x400/1a4d7c/ffffff?text=Logistics+%26+Transport"
                        alt="Logistics & Transport" class="niche-image">
                    <h3>Logistics & Transport</h3>
                    <p>Complex shipping and cargo quotes made simple. Capture fleet requirements, weight, and routes.</p>
                    <button class="btn btn-primary" onclick="Flowtrus.open('logistics-quote')">View Demo</button>
                </div>

                <!-- Catering & Events -->
                <div class="niche-card">
                    <img src="https://placehold.co/600x400/e67e22/ffffff?text=Catering+%26+Events"
                        alt="Catering & Events" class="niche-image">
                    <h3>Catering & Events</h3>
                    <p>Tailored booking for hospitality. Screen for guest counts, event themes, and custom menus.</p>
                    <button class="btn btn-primary" onclick="Flowtrus.open('event-catering')">View Demo</button>
                </div>

                <!-- Contracting Services -->
                <div class="niche-card">
                    <img src="https://placehold.co/600x400/27ae60/ffffff?text=Contracting+Services"
                        alt="Contracting Services" class="niche-image">
                    <h3>Contracting Services</h3>
                    <p>Project-specific workflows. Gather material scopes, budgets, and timelines efficiently.</p>
                    <button class="btn btn-primary" onclick="Flowtrus.open('home-services')">View Demo</button>
                </div>

                <!-- Service Booking -->
                <div class="niche-card">
                    <img src="https://placehold.co/600x400/2980b9/ffffff?text=Service+Booking" alt="Service Booking"
                        class="niche-image">
                    <h3>Service Booking</h3>
                    <p>Standard booking and scheduling. Select services, staff, and choose preferred date/time.</p>
                    <button class="btn btn-primary" onclick="Flowtrus.open('service-booking')">View Demo</button>
                </div>

                <!-- SaaS Onboarding -->
                <div class="niche-card">
                    <img src="https://placehold.co/600x400/8e44ad/ffffff?text=SaaS+Onboarding" alt="SaaS Onboarding"
                        class="niche-image">
                    <h3>SaaS Onboarding</h3>
                    <p>Interactive trial registration. Capture team sizes, plan preferences, and setup parameters.</p>
                    <button class="btn btn-primary" onclick="Flowtrus.open('saas-onboarding')">View Demo</button>
                </div>

                <!-- Project Estimate -->
                <div class="niche-card">
                    <img src="https://placehold.co/600x400/c0392b/ffffff?text=Project+Estimate" alt="Project Estimate"
                        class="niche-image">
                    <h3>Project Estimate</h3>
                    <p>Detailed agency project inquiries. Capture budgets, goals, and project scopes.</p>
                    <button class="btn btn-primary" onclick="Flowtrus.open('lead-capture')">View Demo</button>
                </div>

            </div>
        </div>
    </section>

    <!-- Live Portal Analytics Demo Section -->
    <section class="section" style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 80px 0; text-align: center;">
        <div class="container" style="max-width: 720px; margin: 0 auto;">
            <div style="font-size: 40px; margin-bottom: 20px; display: inline-block;">📊</div>
            <h2 style="font-family: var(--font-title); font-weight: 700; color: #1a4d7c; margin-bottom: 15px; font-size: 28px;">Experience the Analytics Portal</h2>
            <p style="margin-bottom: 30px; font-size: 15px; color: #64748b; line-height: 1.6;">
                Every form submission, field hesitation alert, and partial drop-off shown in the interactive templates above is instantly tracked. Launch our live demo dashboard to experience how Flowtrus captures and recovers leads.
            </p>
            <a href="https://app.flowtrus.com" target="_blank" class="btn btn-accent btn-lg" style="display: inline-block; padding: 14px 28px; font-weight: 700; border-radius: 6px; text-decoration: none;">Launch Portal Demo</a>
        </div>
    </section>
</div>

<?php get_footer(); ?>