/**
 * Flowtrus SDK - Embeddable Form System
 * Version: 2.0.0 Inline + Modal Support
 */

(function (window) {
    'use strict';

    // Main Flowtrus object
    const Flowtrus = {
        config: {},
        forms: {},
        currentForm: null,
        currentStep: 0,
        formData: {},
        activeContainer: null, // Track the active DOM container (modal or inline div)

        /**
         * Initialize Flowtrus SDK
         * @param {Object} config - Configuration options
         */
        init: function (config) {
            this.config = {
                clientId: config.clientId || '', // Added clientId
                apiKey: config.apiKey || '',
                firebaseConfig: config.firebaseConfig || null,
                theme: config.theme || {
                    primaryColor: '#1a4d7c',
                    accentColor: '#6bc47d'
                },
                forms: config.forms || {},
                debug: true // Force debug for now
            };

            // Initialize Firebase if config provided (SaaS Mode)
            if (this.config.firebaseConfig && window.firebase) {
                if (!firebase.apps.length) {
                    firebase.initializeApp(this.config.firebaseConfig);
                    console.log('🔥 Firebase Initialized inside SDK');
                }
                this.db = firebase.firestore();
            }

            // Capture Attribution
            this.captureAttribution();

            // Store forms
            this.forms = this.config.forms;

            // Set up button triggers for modals
            // Wait for DOM to be sure
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupTriggers());
            } else {
                this.setupTriggers();
            }

            // Initialize Inline Forms
            this.initInline();

            console.log('✅ Flowtrus SDK initialized (Live Data Mode)', this.config);
        },

        /**
         * Initialize inline forms embedded in the page
         */
        initInline: function () {
            const inlineForms = document.querySelectorAll('[data-flowtrus-inline]');
            inlineForms.forEach(container => {
                const formId = container.getAttribute('data-form-id');
                if (formId) {
                    // Mark as active container for this context
                    container.classList.add('flowtrus-form-container');
                    container.dataset.step = 0;

                    // Mark global active for initial render (hacky but works for single inline)
                    this.activeContainer = container;

                    this.forms[formId] = this.forms[formId] || { id: formId }; // Placeholder

                    // Fetch real config if needed
                    this.fetchFormConfig(formId).then(config => {
                        this.forms[formId] = config;
                        this.currentForm = config;
                        this.currentStep = 0;

                        // Render into this container
                        container.innerHTML = this.getFormHTML(config);
                        this.setupFormListeners(container);

                        // Track View
                        this.analytics.track('form_view', { formId: formId });
                    });
                }
            });
        },

        /**
         * Helper to fetch config
         */
        fetchFormConfig: async function (formId) {
            console.log(`Fetching config for form: ${formId}`);

            // 1. Try Firebase (Real Data)
            if (this.db) {
                try {
                    const doc = await this.db.collection('forms').doc(formId).get();
                    if (doc.exists) {
                        console.log('📄 Form found in Firestore:', doc.data());
                        return { id: doc.id, ...doc.data() };
                    } else {
                        console.warn('Form ID not found in database:', formId);
                        // Fallthrough to error or try mock
                    }
                } catch (error) {
                    console.error('Error fetching from Firestore:', error);
                }
            }

            // 2. Fallback / Mock (if DB fails or not configured)
            return new Promise((resolve, reject) => {
                // Simulation fallback only if DB fails
                console.warn("Falling back to simulated form data.");
                resolve({
                    id: formId,
                    title: "Fallback Demo Form",
                    description: "Could not load real form. Loading fallback.",
                    steps: [
                        {
                            id: "step1",
                            title: "Contact Info",
                            fields: [
                                { id: "f1", type: "text", name: "full_name", label: "Full Name", required: true },
                            ]
                        }
                    ]
                });
            });
        },

        /**
         * Capture UTM parameters and Referrer
         */
        captureAttribution: function () {
            const params = new URLSearchParams(window.location.search);
            this.attribution = {
                utm_source: params.get('utm_source') || '',
                utm_medium: params.get('utm_medium') || '',
                utm_campaign: params.get('utm_campaign') || '',
                utm_term: params.get('utm_term') || '',
                utm_content: params.get('utm_content') || '',
                referrer: document.referrer || ''
            };

            // Session ID management (Per Page Load / Visit)
            // This ensures every refresh counts as a potential new conversion journey (matching 'Total Views')
            let sessionId = 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            this.sessionId = sessionId;

            console.log('🆔 New Session Started:', this.sessionId);
        },

        // --- Analytics System ---
        analytics: {
            track: function (eventName, properties = {}) {
                // Determine context
                const sdk = window.Flowtrus;

                // DEBUG: Prove track is called
                // alert('DEBUG: Tracking ' + eventName);

                const formId = properties.formId || (sdk.currentForm ? sdk.currentForm.id : null);

                // If event is form_view or sdk_initialized, formId might not be set yet, allow it.
                if (!formId && eventName !== 'form_view' && eventName !== 'sdk_initialized') {
                    if (sdk.config.debug) console.warn('[Analytics] Skipped event (No Form ID):', eventName);
                    return;
                }

                // Payload
                const eventData = {
                    event: eventName,
                    formId: formId,
                    sessionId: sdk.sessionId,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    attribution: sdk.attribution, // Attach source info
                    ...properties
                };

                // 1. Debug Log
                if (sdk.config.debug) {
                    console.log(`📊 [Analytics] ${eventName}`, eventData);
                }

                // 2. Write to Firestore (if Live)
                if (sdk.db) {
                    console.log(`🔥 [Analytics] Attempting to write to: forms/${formId}/analytics_events`);
                    // Structure: forms/{formId}/analytics_events/{autoId}
                    sdk.db.collection('forms').doc(formId).collection('analytics_events').add(eventData)
                        .then(() => {
                            console.log('✅ [Analytics] Event saved successfully!');
                            // alert('Analytics Event Saved: ' + eventName);
                        })
                        .catch(err => {
                            console.error('❌ [Analytics] Write Failed. Check Permissions?', err);
                            alert('Analytics Error: ' + err.message);
                        });
                } else {
                    console.warn('⚠️ [Analytics] SDK.db is not initialized.');
                    alert('DEBUG: Analytics Failed - No Database Connection.\nReason: ' + (window.firebase ? 'Config missing?' : 'Firebase Script not loaded?'));

                    if (!window.firebase) console.error('Firebase SDK not found on window.');
                    if (!sdk.config.firebaseConfig) console.error('Firebase Config missing.');
                }
            }
        },
        setupTriggers: function () {
            const self = this;
            document.addEventListener('click', function (e) {
                let trigger = e.target.closest('[data-flowtrus-trigger]');
                if (!trigger) trigger = e.target.closest('.flowtrus-trigger');

                if (trigger) {
                    e.preventDefault();
                    // Check all possible attribute variations to be robust
                    const formId = trigger.getAttribute('data-flowtrus-trigger') ||
                        trigger.getAttribute('data-form') ||
                        trigger.getAttribute('data-form-id');

                    if (formId) {
                        self.openForm(formId);
                    } else {
                        console.error('Flowtrus Trigger clicked, but no Form ID found on element:', trigger);
                    }
                }
            });
        },

        /**
         * Open a form modal
         * @param {string} formId - ID of the form to open
         */
        openForm: async function (formId) {
            console.log('Flowtrus.open called for:', formId);
            if (this.isOpening) return;
            this.isOpening = true;

            // Remove existing overlay
            const existingOverlay = document.getElementById('flowtrus-overlay');
            if (existingOverlay) existingOverlay.remove();

            // Ensure config exists
            if (!this.forms[formId]) {
                try {
                    const btn = document.querySelector(`[data-flowtrus-trigger="${formId}"]`);
                    if (btn) btn.textContent = 'Loading...';

                    this.forms[formId] = await this.fetchFormConfig(formId);

                    if (btn) btn.textContent = 'Get Started'; // Reset (ideal would be original text)

                } catch (error) {
                    alert('Error loading form: ' + error.message);
                    this.isOpening = false;
                    return;
                }
            }

            const form = this.forms[formId];
            this.currentForm = form;
            this.currentStep = 0;
            this.formData = {};
            this.formSubmitted = false;

            // Start Timer IMMEDIATELY for Modals
            this.startTime = Date.now(); // Fallback legacy
            // We'll set the dataset.startTime in renderModal or right after activeContainer is set
            if (this.activeContainer) {
                this.activeContainer.dataset.startTime = Date.now();
            }

            this.renderModal();
            this.isOpening = false;

            this.analytics.track('form_opened', { formId: formId, formTitle: form.title });
            this.analytics.track('form_view', { formId: formId, formTitle: form.title });
        },

        /**
         * Render the modal overlay and form
         */
        renderModal: function () {
            // Style setup
            const styleConfig = this.currentForm.style || {};
            const primary = this.currentForm.style?.primaryColor || '#1a4d7c';
            const accent = this.currentForm.style?.accentColor || '#6bc47d';
            const radius = this.currentForm.style?.borderRadius !== undefined ? this.currentForm.style.borderRadius : 8;

            // CSS Variables for dynamic theming
            // We use the same color for 'dark' variants for simplicity, or rely on CSS opacity tricks
            const cssVars = `
                --flowtrus-primary: ${primary};
                --flowtrus-primary-dark: ${primary}; 
                --flowtrus-accent: ${accent};
                --flowtrus-accent-dark: ${accent};
                --flowtrus-radius: ${radius}px;
            `;

            // Create modal wrapper
            const overlay = document.createElement('div');
            overlay.id = 'flowtrus-overlay';
            overlay.className = 'flowtrus-overlay';

            // Inner HTML
            const modalContent = `
                <style>
                    #flowtrus-overlay .flowtrus-modal { border-radius: var(--flowtrus-radius); overflow: hidden; }
                    #flowtrus-overlay .flowtrus-input, 
                    #flowtrus-overlay .flowtrus-select, 
                    #flowtrus-overlay .flowtrus-textarea,
                    #flowtrus-overlay .flowtrus-btn,
                    #flowtrus-overlay .flowtrus-option-card,
                    #flowtrus-overlay .flowtrus-icon-card,
                    #flowtrus-overlay .flowtrus-radio-card,
                    #flowtrus-overlay .flowtrus-checkbox-card,
                    #flowtrus-overlay .flowtrus-progress-bar {
                        border-radius: var(--flowtrus-radius);
                    }
                </style>
                <div class="flowtrus-modal" style="${cssVars}">
                    <button class="flowtrus-close" onclick="Flowtrus.closeModal()">&times;</button>
                    <div class="flowtrus-content-wrapper">
                        ${this.getFormHTML(this.currentForm)}
                    </div>
                </div>
            `;

            overlay.innerHTML = modalContent;
            document.body.appendChild(overlay);

            // Set Active Context
            this.activeContainer = overlay.querySelector('.flowtrus-content-wrapper');
            // State Tracking for Modal
            this.activeContainer.dataset.formId = this.currentForm.id;
            this.activeContainer.dataset.step = 0;

            // Listeners
            this.setupFormListeners(this.activeContainer);

            // Animate
            setTimeout(() => overlay.classList.add('active'), 10);
        },

        /**
         * Generate HTML for the Form Layout (Header + Progress + Body)
         * Reusable for both Modal and Inline
         */
        getFormHTML: function (form) {
            return `
                <div class="flowtrus-header">
                    <h2>${form.title}</h2>
                    ${form.description ? `<p>${form.description}</p>` : ''}
                </div>
                <div class="flowtrus-progress">
                    <div class="flowtrus-progress-bar">
                        <div class="flowtrus-progress-fill" style="width: ${this.getProgress()}%"></div>
                    </div>
                    <span class="flowtrus-progress-text">Step ${this.currentStep + 1} of ${form.steps.length}</span>
                </div>
                <div class="flowtrus-step-container">
                    ${this.renderStepHTML()}
                </div>
            `;
        },

        /**
         * Calculate progress percentage
         */
        getProgress: function () {
            if (!this.currentForm) return 0;
            return ((this.currentStep + 1) / this.currentForm.steps.length) * 100;
        },

        /**
         * Render HTML for current step
         */
        renderStepHTML: function () {
            const step = this.currentForm.steps[this.currentStep];

            // Track View
            // (Using setTimeout to ensure analytics is ready and not blocking render)
            setTimeout(() => {
                this.analytics.track('step_viewed', {
                    formId: this.currentForm.id,
                    step: this.currentStep,
                    stepTitle: step.title
                });
            }, 0);

            let html = `
                <div class="flowtrus-step" data-step-id="${step.id}" data-load-time="${Date.now()}">
                    <h3>${step.title}</h3>
                    <form class="flowtrus-fields" onsubmit="return false;">
            `;

            if (step.fields) {
                step.fields.forEach(field => {
                    html += this.renderField(field);
                });
            }

            html += `
                    </form>
                    <div class="flowtrus-actions">
                        ${this.currentStep > 0 ? `<button type="button" class="flowtrus-btn flowtrus-btn-secondary" onclick="Flowtrus.previousStep(this)">Back</button>` : ''}
                        ${this.currentStep < this.currentForm.steps.length - 1
                    ? `<button type="button" class="flowtrus-btn flowtrus-btn-primary" onclick="Flowtrus.nextStep(this)">Next</button>`
                    : `<button type="button" class="flowtrus-btn flowtrus-btn-primary" onclick="Flowtrus.submitForm(this)">Submit</button>`
                }
                    </div>
                </div>
            `;
            return html;
        },

        /**
         * Render a single field
         */
        renderField: function (field) {
            const requiredMark = field.required ? ' <span class="required">*</span>' : '';
            let fieldHtml = `<div class="flowtrus-field-group">`;

            if (field.label && field.type !== 'icon_select') {
                fieldHtml += `<label class="flowtrus-label">${field.label}${requiredMark}</label>`;
            }

            if (field.type === 'select') {
                fieldHtml += `<select name="${field.name}" class="flowtrus-select" ${field.required ? 'required' : ''}>
                   <option value="">Select...</option>
                   ${(field.options || []).map(opt => `<option value="${opt}">${opt}</option>`).join('')}
               </select>`;

            } else if (field.type === 'radio') {
                fieldHtml += `<div class="flowtrus-option-group">`;
                (field.options || []).forEach(opt => {
                    fieldHtml += `
                        <label class="flowtrus-radio">
                            <input type="radio" name="${field.name}" value="${opt}" ${field.required ? 'required' : ''}>
                            <span>${opt}</span>
                        </label>
                    `;
                });
                fieldHtml += `</div>`;

            } else if (field.type === 'checkbox') {
                fieldHtml += `<div class="flowtrus-option-group">`;
                (field.options || []).forEach(opt => {
                    fieldHtml += `
                        <label class="flowtrus-checkbox">
                            <input type="checkbox" name="${field.name}[]" value="${opt}">
                            <span>${opt}</span>
                        </label>
                    `;
                });
                fieldHtml += `</div>`;

            } else if (field.type === 'icon_counter') {
                const step = field.step || 1;
                const min = 0;
                const max = field.maxVal || 99;
                const icon = field.icon || 'hash';

                fieldHtml += `
                    <div class="flowtrus-counter-wrapper">
                        <button type="button" class="flowtrus-counter-btn" onclick="Flowtrus.updateCounter(this, -${step}, ${min}, ${max})">-</button>
                        <input type="text" class="flowtrus-counter-input" name="${field.name}" value="0" readonly>
                        <button type="button" class="flowtrus-counter-btn" onclick="Flowtrus.updateCounter(this, ${step}, ${min}, ${max})">+</button>
                        <i data-lucide="${icon}" style="margin-left:5px; color:#64748b;"></i>
                    </div>
                `;

            } else if (field.type === 'serviceArea') {
                // Rich State List Picker (Multi-Select)
                fieldHtml += `
                    <div class="flowtrus-state-picker-wrapper">
                         <!-- Search/Filter -->
                         <div class="flowtrus-state-search flowtrus-input-group">
                             <input type="text" placeholder="Search states..." onkeyup="Flowtrus.filterStates(this)">
                             <button type="button" style="pointer-events:none;"><i data-lucide="search" style="width:16px; height:16px;"></i></button>
                         </div>

                         <!-- Scrollable List -->
                         <div class="flowtrus-state-list">
                            ${Flowtrus.usStates.map(s => `
                                <div class="flowtrus-state-item" data-code="${s.code}" onclick="Flowtrus.selectState(this, '${field.name}', '${s.code}')">
                                    <div class="flowtrus-state-icon">
                                        <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="20" cy="20" r="20" fill="#f1f5f9" class="bg-circle"/>
                                            <text x="50%" y="50%" dy=".35em" text-anchor="middle" font-size="14" font-weight="bold" fill="#475569" class="state-text">${s.code}</text>
                                        </svg>
                                    </div>
                                    <span>${s.name}</span>
                                    <i data-lucide="check" class="check-icon" style="margin-left:auto; opacity:0; width:16px; height:16px;"></i>
                                </div>
                            `).join('')}
                         </div>
                         
                         <!-- Hidden Actual Input -->
                         <input type="hidden" name="${field.name}" required>
                    </div>
                `;

            } else if (field.type === 'icon_select') {
                // Parse options: "Auto | car-front", "Home | house"
                const cols = field.columns || 2;
                fieldHtml += `<label class="flowtrus-label" style="margin-bottom:15px; display:block;">${field.label}${requiredMark}</label>`;
                fieldHtml += `<div class="flowtrus-icon-card-grid" style="grid-template-columns: repeat(${cols}, 1fr);">`;

                // Hidden input to store value
                fieldHtml += `<input type="hidden" name="${field.name}" required>`;

                const options = field.options || [];

                options.forEach(opt => {
                    let [label, icon] = opt.split('|').map(s => s.trim());
                    if (!icon) icon = 'circle'; // Fallback

                    fieldHtml += `
                        <div class="flowtrus-icon-card" onclick="Flowtrus.selectIconOption(this, '${field.name}', '${label}')">
                            <i data-lucide="${icon}"></i>
                            <span>${label}</span>
                        </div>
                    `;
                });
                fieldHtml += `</div>`;

            } else {
                // Generic fallback
                const inputType = (field.type === 'zip' || field.type === 'number') ? 'text' : field.type;
                fieldHtml += `<input type="${inputType}" name="${field.name}" class="flowtrus-input" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>`;
            }

            fieldHtml += `</div>`;
            return fieldHtml;
        },

        /**
         * Set up listeners for the active form
         * @param {HTMLElement} container - The container context
         */
        setupFormListeners: function (container) {
            const self = this;

            // Close on backdrop click (if modal)
            const overlay = document.getElementById('flowtrus-overlay');
            if (overlay) {
                overlay.onclick = (e) => {
                    if (e.target === overlay) Flowtrus.closeModal();
                };
            }

            // Init Icons
            if (window.lucide) window.lucide.createIcons();

            // --- Engagement Tracking (Event Delegation) ---

            // Lazy Timer Initialization (Important for Inline Forms)
            // Starts the "Form Timer" only when the user actually interacts
            const startTimerHandler = function (e) {
                // If start time is not set on the container, set it now
                if (!container.dataset.startTime) {
                    container.dataset.startTime = Date.now();
                    // self.analytics.track('form_started', { formId: container.dataset.formId }); // Optional: explicit start event
                }
            };
            container.addEventListener('focusin', startTimerHandler);
            container.addEventListener('click', startTimerHandler);

            // Track Focus
            container.addEventListener('focusin', function (e) {
                if (e.target.matches('input, select, textarea, button.flowtrus-icon-card')) {
                    const fieldName = e.target.name || e.target.closest('[data-code]')?.dataset.code || 'unknown';

                    // Derive Context
                    const formContainer = e.target.closest('.flowtrus-form-container') || e.target.closest('.flowtrus-content-wrapper');
                    const formId = formContainer ? formContainer.dataset.formId : (self.currentForm?.id || 'unknown');
                    const step = formContainer ? parseInt(formContainer.dataset.step || 0) : self.currentStep;

                    self.analytics.track('field_focused', {
                        formId: formId,
                        step: step,
                        field: fieldName
                    });
                }
            });

            // Track Change / Completion
            container.addEventListener('change', function (e) {
                if (e.target.matches('input, select, textarea')) {
                    // Derive Context
                    const formContainer = e.target.closest('.flowtrus-form-container') || e.target.closest('.flowtrus-content-wrapper');
                    const formId = formContainer ? formContainer.dataset.formId : (self.currentForm?.id || 'unknown');
                    const step = formContainer ? parseInt(formContainer.dataset.step || 0) : self.currentStep;

                    self.analytics.track('field_completed', {
                        formId: formId,
                        step: step,
                        field: e.target.name,
                        value: e.target.value,
                        value_length: e.target.value.length
                    });
                }
            });
            // Track Field Duration (Time spent on field)
            container.addEventListener('focusin', function (e) {
                if (e.target.matches('input, select, textarea')) {
                    e.target.dataset.startTime = Date.now();
                }
            });

            container.addEventListener('focusout', function (e) {
                if (e.target.matches('input, select, textarea') && e.target.dataset.startTime) {
                    const duration = Date.now() - parseInt(e.target.dataset.startTime);

                    // Derive Context
                    const formContainer = e.target.closest('.flowtrus-form-container') || e.target.closest('.flowtrus-content-wrapper');
                    const formId = formContainer ? formContainer.dataset.formId : (self.currentForm?.id || 'unknown');
                    const step = formContainer ? parseInt(formContainer.dataset.step || 0) : self.currentStep;

                    // Track Interaction
                    self.analytics.track('field_interaction', {
                        field: e.target.name,
                        value: e.target.value,
                        duration_ms: duration,
                        step: step,
                        formId: formId
                    });

                    // Cleanup
                    delete e.target.dataset.startTime;
                }
            });

            // Track Friction (Corrections/Backspaces)
            container.addEventListener('input', function (e) {
                if (e.target.matches('input, textarea')) {
                    // 1. Instant Engagement Tracking (First Keystroke)
                    if (!e.target.dataset.hasTyped) {
                        const formContainer = e.target.closest('.flowtrus-form-container') || e.target.closest('.flowtrus-content-wrapper');
                        const formId = formContainer ? formContainer.dataset.formId : (self.currentForm?.id || 'unknown');

                        self.analytics.track('field_interaction', {
                            field: e.target.name,
                            action: 'typing_started',
                            step: self.currentStep,
                            formId: formId
                        });
                        e.target.dataset.hasTyped = "true";
                    }

                    // 2. Friction Tracking
                    const prevLen = parseInt(e.target.dataset.len || 0);
                    const currLen = e.target.value.length;

                    if (currLen < prevLen) {
                        if (!e.target.dataset.frictionRecorded) {
                            // Derive Context
                            const formContainer = e.target.closest('.flowtrus-form-container') || e.target.closest('.flowtrus-content-wrapper');
                            const formId = formContainer ? formContainer.dataset.formId : (self.currentForm?.id || 'unknown');

                            self.analytics.track('field_friction', {
                                field: e.target.name,
                                type: 'backspace/correction',
                                formId: formId
                            });
                            e.target.dataset.frictionRecorded = "true";
                            setTimeout(() => { delete e.target.dataset.frictionRecorded; }, 2000);
                        }
                    }
                    e.target.dataset.len = currLen;
                }
            });
        },

        // --- Helper Methods ---

        filterStates: function (input) {
            const filter = input.value.toUpperCase();
            const list = input.closest('.flowtrus-state-picker-wrapper').querySelector('.flowtrus-state-list');
            const items = list.querySelectorAll('.flowtrus-state-item');

            items.forEach(item => {
                const txt = item.innerText || item.textContent;
                if (txt.toUpperCase().indexOf(filter) > -1) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        },

        selectState: function (item, fieldName, value) {
            // Multi-Select Toggle Logic
            const isSelected = item.classList.toggle('selected');

            // Sync Value (Comma separated)
            const wrapper = item.closest('.flowtrus-state-picker-wrapper');
            const hidden = wrapper.querySelector(`input[name="${fieldName}"]`);

            let currentVals = hidden.value ? hidden.value.split(',') : [];

            if (isSelected) {
                if (!currentVals.includes(value)) currentVals.push(value);
            } else {
                currentVals = currentVals.filter(v => v !== value);
            }

            hidden.value = currentVals.join(',');

            if (hidden.value.length > 0) {
                hidden.classList.remove('error');
            }

            // Track Interaction (Click-based)
            const formContainer = item.closest('.flowtrus-form-container') || item.closest('.flowtrus-content-wrapper');
            const formId = formContainer ? formContainer.dataset.formId : (this.currentForm?.id || 'unknown');
            const stepEl = item.closest('.flowtrus-step');
            const stepLoadTime = stepEl ? parseInt(stepEl.dataset.loadTime || 0) : 0;
            const duration = stepLoadTime ? (Date.now() - stepLoadTime) : 0;

            this.analytics.track('field_interaction', {
                field: fieldName,
                duration_ms: duration,
                step: this.currentStep,
                formId: formId
            });
        },

        selectIconOption: function (card, fieldName, value) {
            // Deselect siblings
            const grid = card.closest('.flowtrus-icon-card-grid');
            grid.querySelectorAll('.flowtrus-icon-card').forEach(c => c.classList.remove('selected'));

            // Select this
            card.classList.add('selected');

            // Update hidden input
            const input = grid.querySelector(`input[name="${fieldName}"]`);
            input.value = value;
            input.classList.remove('error');

            // Track Interaction (Click-based)
            const formContainer = card.closest('.flowtrus-form-container') || card.closest('.flowtrus-content-wrapper');
            const formId = formContainer ? formContainer.dataset.formId : (this.currentForm?.id || 'unknown');
            const stepEl = card.closest('.flowtrus-step');
            const stepLoadTime = stepEl ? parseInt(stepEl.dataset.loadTime || 0) : 0;
            const duration = stepLoadTime ? (Date.now() - stepLoadTime) : 0;

            this.analytics.track('field_interaction', {
                field: fieldName,
                duration_ms: duration, // "Time to Decision"
                step: this.currentStep,
                formId: formId
            });
        },

        updateCounter: function (btn, change, min, max) {
            const wrapper = btn.parentElement;
            const input = wrapper.querySelector('input');
            let val = parseInt(input.value) || 0;
            val += change;

            if (val < min) val = min;
            if (max && val > max) val = max;

            input.value = val;

            // Track Interaction
            const formContainer = btn.closest('.flowtrus-form-container') || btn.closest('.flowtrus-content-wrapper');
            const formId = formContainer ? formContainer.dataset.formId : (this.currentForm?.id || 'unknown');

            this.analytics.track('field_interaction', {
                field: input.name,
                action: change > 0 ? 'increment' : 'decrement',
                value: val,
                step: this.currentStep,
                formId: formId
            });
        },

        // Data: US States
        usStates: [
            { name: 'Alabama', code: 'AL' }, { name: 'Alaska', code: 'AK' }, { name: 'Arizona', code: 'AZ' },
            { name: 'Arkansas', code: 'AR' }, { name: 'California', code: 'CA' }, { name: 'Colorado', code: 'CO' },
            { name: 'Connecticut', code: 'CT' }, { name: 'Delaware', code: 'DE' }, { name: 'Florida', code: 'FL' },
            { name: 'Georgia', code: 'GA' }, { name: 'Hawaii', code: 'HI' }, { name: 'Idaho', code: 'ID' },
            { name: 'Illinois', code: 'IL' }, { name: 'Indiana', code: 'IN' }, { name: 'Iowa', code: 'IA' },
            { name: 'Kansas', code: 'KS' }, { name: 'Kentucky', code: 'KY' }, { name: 'Louisiana', code: 'LA' },
            { name: 'Maine', code: 'ME' }, { name: 'Maryland', code: 'MD' }, { name: 'Massachusetts', code: 'MA' },
            { name: 'Michigan', code: 'MI' }, { name: 'Minnesota', code: 'MN' }, { name: 'Mississippi', code: 'MS' },
            { name: 'Missouri', code: 'MO' }, { name: 'Montana', code: 'MT' }, { name: 'Nebraska', code: 'NE' },
            { name: 'Nevada', code: 'NV' }, { name: 'New Hampshire', code: 'NH' }, { name: 'New Jersey', code: 'NJ' },
            { name: 'New Mexico', code: 'NM' }, { name: 'New York', code: 'NY' }, { name: 'North Carolina', code: 'NC' },
            { name: 'North Dakota', code: 'ND' }, { name: 'Ohio', code: 'OH' }, { name: 'Oklahoma', code: 'OK' },
            { name: 'Oregon', code: 'OR' }, { name: 'Pennsylvania', code: 'PA' }, { name: 'Rhode Island', code: 'RI' },
            { name: 'South Carolina', code: 'SC' }, { name: 'South Dakota', code: 'SD' }, { name: 'Tennessee', code: 'TN' },
            { name: 'Texas', code: 'TX' }, { name: 'Utah', code: 'UT' }, { name: 'Vermont', code: 'VT' },
            { name: 'Virginia', code: 'VA' }, { name: 'Washington', code: 'WA' }, { name: 'West Virginia', code: 'WV' },
            { name: 'Wisconsin', code: 'WI' }, { name: 'Wyoming', code: 'WY' }
        ],

        closeModal: function () {
            // Track Abandonment/Drop
            if (!this.formSubmitted && this.currentStep < (this.currentForm?.steps?.length || 0)) {
                this.analytics.track('form_abandoned', {
                    formId: this.currentForm?.id,
                    lastStep: this.currentStep
                });
            }

            const overlay = document.getElementById('flowtrus-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                setTimeout(() => overlay.remove(), 300);
            }
        },

        nextStep: function (btn) {
            // Context Switch for Inline Forms
            if (btn) {
                const container = btn.closest('.flowtrus-form-container') || btn.closest('.flowtrus-content-wrapper');
                if (container) {
                    this.activeContainer = container;
                    const formId = container.dataset.formId;
                    if (formId && this.forms[formId]) {
                        this.currentForm = this.forms[formId];
                        this.currentStep = parseInt(container.dataset.step || 0);
                    }
                }
            }

            console.log("Next step triggered. Step:", this.currentStep, "Container:", this.activeContainer);
            if (this.validateCurrentStep()) {
                this.saveStepData();
                const currentStepObj = this.currentForm.steps[this.currentStep];
                this.analytics.track('step_complete', {
                    formId: this.currentForm.id,
                    step: this.currentStep,
                    stepTitle: currentStepObj.title
                });
                this.currentStep++;

                // Update Step Attribute
                if (this.activeContainer) {
                    this.activeContainer.dataset.step = this.currentStep;
                }

                this.updateActiveContainer();
            } else {
                console.warn("Validation failed for step", this.currentStep);
            }
        },

        previousStep: function (btn) {
            // Context Switch
            if (btn) {
                const container = btn.closest('.flowtrus-form-container') || btn.closest('.flowtrus-content-wrapper');
                if (container) {
                    this.activeContainer = container;
                    const formId = container.dataset.formId;
                    if (formId && this.forms[formId]) {
                        this.currentForm = this.forms[formId];
                        this.currentStep = parseInt(container.dataset.step || 0);
                    }
                }
            }

            this.currentStep--;
            // Update Step Attribute
            if (this.activeContainer) {
                this.activeContainer.dataset.step = this.currentStep;
            }
            this.updateActiveContainer();
        },

        updateActiveContainer: function () {
            if (!this.activeContainer) return;

            // DOM Updates
            const container = this.activeContainer;

            // Update Progress
            const fill = container.querySelector('.flowtrus-progress-fill');
            const text = container.querySelector('.flowtrus-progress-text');
            if (fill) fill.style.width = this.getProgress() + '%';
            if (text) text.textContent = `Step ${this.currentStep + 1} of ${this.currentForm.steps.length} `;

            // Update Body
            const stepContainer = container.querySelector('.flowtrus-step-container');
            if (stepContainer) {
                stepContainer.innerHTML = this.renderStepHTML();
                if (window.lucide) window.lucide.createIcons();
            }
        },

        validateCurrentStep: function () {
            if (!this.activeContainer) return false;
            let valid = true;

            const inputs = this.activeContainer.querySelectorAll('input[required], select[required]');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    // For hidden inputs (like icon select), shake the container
                    if (input.type === 'hidden') {
                        const grid = input.parentElement.querySelector('.flowtrus-icon-card-grid');
                        if (grid) grid.classList.add('error'); // CSS might need to handle this
                    } else {
                        input.classList.add('error');
                    }
                } else {
                    if (input.type !== 'hidden') input.classList.remove('error');
                }
            });
            return valid;
        },

        saveStepData: function () {
            if (!this.activeContainer) return;
            const inputs = this.activeContainer.querySelectorAll('input, select');
            inputs.forEach(input => {
                this.formData[input.name] = input.value;
            });
        },

        submitForm: function (btn) {
            // Context Switch (Strict)
            // CRITICAL: We accept 'btn' to identify the EXACT form instance.
            // This prevents "Cross-Talk" where clicking Submit on Form B might use Form A's context/timer
            // if the user had previously interacted with Form A.
            if (btn) {
                const container = btn.closest('.flowtrus-form-container') || btn.closest('.flowtrus-content-wrapper');
                if (container) {
                    this.activeContainer = container;
                    const formId = container.dataset.formId;
                    if (formId && this.forms[formId]) {
                        this.currentForm = this.forms[formId];
                        // Don't override formData blindly - usually context switch implies focus change
                        // But for submit, we just want to ensure we're submitting THIS form
                    }
                }
            }

            if (this.validateCurrentStep()) {
                this.saveStepData();
                console.log('Form Submitted:', this.formData);

                // Track Submission
                // Get Start Time from Container (Context-Aware)
                let startTime = this.activeContainer ? parseInt(this.activeContainer.dataset.startTime) : 0;

                // Fallback to global or now
                if (!startTime) startTime = this.startTime || Date.now();

                const totalTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);

                this.analytics.track('form_submit', {
                    formId: this.currentForm?.id,
                    formData: this.formData,
                    totalTime: totalTimeSeconds
                });

                // RESET SESSION AFTER SUBMIT
                // This ensures if they refresh or fill it again, it counts as a new "Engagement" cycle.
                localStorage.removeItem('flowtrus_session_id');
                this.captureAttribution(); // Regenerates a new ID immediately

                // Show Success
                if (!this.activeContainer) return;

                const conf = this.currentForm.confirmation || {};
                const confirmTitle = conf.title || 'Thank You!';
                const confirmMessage = conf.message || 'We will be in touch shortly.';

                const showAgent = conf.showAgentCard !== false; // Default true
                const agentName = conf.agentName || 'Assigned to Agent';
                const agentStatus = conf.agentStatus || 'Review in progress';

                const btnText = conf.buttonText || 'Done';
                const btnLink = conf.buttonLink || '';
                const btnAction = btnLink ? `window.location.href='${btnLink}'` : `Flowtrus.closeModal()`;

                // Agent Card HTML
                const agentHtml = showAgent ? `
                        <div class="flowtrus-recipient-card flowtrus-recipient-simple">
                            <div class="flowtrus-avatar-simple"></div>
                            <div class="flowtrus-recipient-text">
                                <span class="flowtrus-recipient-name">${agentName}</span>
                                <span style="font-size:13px; color:#64748b;">${agentStatus}</span>
                            </div>
                        </div>` : '';

                // Rich Success HTML matching flowtrus-modal.css
                this.activeContainer.innerHTML = `
                    <div class="flowtrus-success">
                        <div class="flowtrus-success-icon-wrapper">
                            <svg class="flowtrus-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle class="flowtrus-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                                <path class="flowtrus-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                        <h3>${confirmTitle}</h3>
                        <p>${confirmMessage}</p>
                        
                        ${agentHtml}

                        <div style="margin-top:30px;">
                            <button class="flowtrus-btn flowtrus-btn-primary flowtrus-btn-wide" onclick="${btnAction}">${btnText}</button>
                        </div>
                        
                        <div class="flowtrus-security-footer">
                            <i data-lucide="lock" style="width:12px; height:12px;"></i>
                            <span>256-bit Secure Encryption</span>
                        </div>
                    </div>
                `;

                // Re-init icons for the new content
                if (window.lucide) window.lucide.createIcons();

                // Re-init icons for success screen
                if (window.lucide) window.lucide.createIcons();
            } else {
                console.warn("Validation failed on submit");
            }
        },


    };

    window.Flowtrus = Flowtrus;

})(window);
