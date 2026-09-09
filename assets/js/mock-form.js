document.addEventListener('DOMContentLoaded', function () {
    // --- Shared Logic ---
    function formatTime(ms) {
        return (ms / 1000).toFixed(1);
    }

    // --- Traditional Game ---
    const tradInputs = document.querySelectorAll('.game-input.real-input');
    const tradDropdown = document.getElementById('trad-input-5');
    const tradDropdownMenu = document.getElementById('trad-dropdown-menu');
    const tradDropdownText = tradDropdown.querySelector('.dropdown-text');
    const tradDropdownOptions = document.querySelectorAll('.dropdown-option');
    const tradSubmit = document.getElementById('trad-submit-btn');
    const tradOverlay = document.getElementById('trad-result-overlay');

    let tradStartTime = null;
    let tradClicks = 0; // Still track clicks as generic "interactions" or just focus?
    // Let's track "interactions" (focus + input)

    // -- Real Input Logic --
    tradInputs.forEach((input) => {
        // Track focus for stats
        input.addEventListener('focus', () => {
            if (tradClicks === 0) tradStartTime = performance.now();
            tradClicks++;
        });

        input.addEventListener('input', () => {
            if (tradClicks === 0) tradStartTime = performance.now();
            // tradClicks++; // Don't count keystrokes
            validateInput(input);
        });
    });

    function validateInput(input) {
        const val = input.value.trim();
        let isValid = false;

        if (input.type === 'email') {
            // Basic regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(val);
        } else {
            // General length check
            isValid = val.length > 2;
        }

        if (isValid) {
            input.classList.add('filled');
            input.classList.remove('invalid');
        } else {
            input.classList.remove('filled');
            // Optional: add invalid style if they've typed enough to be wrong
            if (val.length > 0 && input.type === 'email' && !val.includes('@')) {
                // Don't show error immediately, maybe only on blur? 
                // For now let's keep it simple: just don't show filled checkmark
            }
        }

        checkTradCompletion();
    }

    function checkTradCompletion() {
        // Simple, robust check: count all filled inputs
        const validTextCount = document.querySelectorAll('.real-input.filled').length;
        const dropdownFilled = tradDropdown.classList.contains('filled');

        // We expect 4 text inputs + 1 dropdown
        if (validTextCount >= 4 && dropdownFilled) {
            tradSubmit.disabled = false;
            tradSubmit.style.opacity = '1';
            tradSubmit.style.cursor = 'pointer';
            tradSubmit.classList.remove('btn-secondary');
            tradSubmit.classList.add('btn-primary');
            tradSubmit.textContent = 'Submit Form';
        } else {
            tradSubmit.disabled = true;
            tradSubmit.style.opacity = '0.5';
            tradSubmit.style.cursor = 'not-allowed';
            tradSubmit.classList.remove('btn-primary');
            tradSubmit.classList.add('btn-secondary');
            tradSubmit.textContent = 'Submit (Fill all fields)';
        }
    }

    // -- Dropdown Logic --
    tradDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        if (tradDropdown.classList.contains('filled')) return;

        tradDropdown.classList.toggle('active');
        const menu = document.getElementById('trad-dropdown-menu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';

        if (tradClicks === 0) tradStartTime = performance.now();
        tradClicks++;
    });

    tradDropdownOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.getAttribute('data-value');
            tradDropdownText.innerText = value + " Coverage";
            tradDropdownText.style.color = '#334155';

            // Mark filled FIRST
            tradDropdown.classList.remove('active');
            tradDropdown.classList.add('filled');
            document.getElementById('trad-dropdown-menu').style.display = 'none';
            tradClicks++;

            // THEN check completion
            checkTradCompletion();
        });
    });

    // Close dropdown
    document.addEventListener('click', () => {
        const menu = document.getElementById('trad-dropdown-menu');
        if (menu) menu.style.display = 'none';
        if (tradDropdown) tradDropdown.classList.remove('active');
    });

    if (tradSubmit) {
        tradSubmit.addEventListener('click', () => {
            if (tradSubmit.disabled) return;
            tradClicks++;
            const totalTime = performance.now() - tradStartTime;

            // Show Results
            document.getElementById('trad-time').textContent = formatTime(totalTime);
            document.getElementById('trad-clicks').textContent = tradClicks;
            tradOverlay.style.opacity = '1';
            tradOverlay.style.pointerEvents = 'all';

            activeInputIndex = -1; // Stop typing listener
        });
    }

    window.resetTradGame = function () {
        tradClicks = 0;
        tradStartTime = null;
        tradOverlay.style.opacity = '0';
        tradOverlay.style.pointerEvents = 'none';

        // Reset Real Inputs
        tradInputs.forEach((input) => {
            input.value = '';
            input.classList.remove('filled', 'invalid');
        });

        // Reset Dropdown
        tradDropdown.classList.remove('filled', 'active');
        tradDropdownText.innerText = 'Select...';
        tradDropdownText.style.color = '#94a3b8';
        if (tradDropdownMenu) tradDropdownMenu.style.display = 'none';

        tradSubmit.disabled = true;
        tradSubmit.style.opacity = '0.5';
        tradSubmit.style.cursor = 'not-allowed';
        tradSubmit.classList.remove('btn-primary');
        tradSubmit.classList.add('btn-secondary');
        tradSubmit.textContent = 'Submit (Fill all fields)';
    };


    // --- Flowtrus Game ---
    const flowAuto = document.getElementById('opt-auto');
    const flowHome = document.getElementById('opt-home');
    const flowSubmit = document.getElementById('mock-next-btn');
    const flowOverlay = document.getElementById('flow-result-overlay');
    const smartContact = document.getElementById('smart-contact-container');

    let flowStartTime = null;
    let flowClicks = 0;
    let flowReady = false;

    function setFlowActive(activeEl, inactiveEl) {
        activeEl.classList.add('active');
        if (inactiveEl) inactiveEl.classList.remove('active');
    }
    
    let flowSelectedOption = null;

        // Track interaction start
        const allFlowInputs = [flowName, flowEmail, flowPhone, flowZip];
        allFlowInputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (flowClicks === 0) flowStartTime = performance.now();
                flowClicks++;
            });
            input.addEventListener('input', () => {
                if (flowClicks === 0) flowStartTime = performance.now();
                checkFlowStep1();
                checkFlowStep2();
            });
        });

        // Step 1 Validation
        function checkFlowStep1() {
            const nameValid = flowName.value.trim().length > 2;
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(flowEmail.value.trim()); // Reuse regex logic
            const phoneValid = flowPhone.value.trim().length > 5;

            if (nameValid && emailValid && phoneValid) {
                flowNextBtn.disabled = false;
                flowNextBtn.classList.remove('btn-secondary');
                flowNextBtn.classList.add('btn-primary');
                flowNextBtn.style.opacity = '1';
                flowNextBtn.style.cursor = 'pointer';
            } else {
                flowNextBtn.disabled = true;
                flowNextBtn.classList.add('btn-secondary');
                flowNextBtn.classList.remove('btn-primary');
                flowNextBtn.style.opacity = '0.5';
                flowNextBtn.style.cursor = 'not-allowed';
            }
        }

        // Navigation
        flowNextBtn.addEventListener('click', () => {
            if (flowNextBtn.disabled) return;
            flowClicks++;

            // Transition
            flowStep1.style.opacity = '0';
            flowStep1.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                flowStep1.style.display = 'none';
                flowStep2.style.display = 'block';
                setTimeout(() => {
                    flowStep2.style.opacity = '1';
                    flowStep2.style.transform = 'translateX(0)';
                }, 50);
            }, 300);
        });

        flowBackBtn.addEventListener('click', () => {
            flowClicks++;
            flowStep2.style.opacity = '0';
            flowStep2.style.transform = 'translateX(20px)';
            setTimeout(() => {
                flowStep2.style.display = 'none';
                flowStep1.style.display = 'block';
                setTimeout(() => {
                    flowStep1.style.opacity = '1';
                    flowStep1.style.transform = 'translateX(0)';
                }, 50);
            }, 300);

            // Re-check step 1 just in case
            checkFlowStep1();
        });

        // Step 2 Logic
        flowOptions.forEach(option => {
            option.addEventListener('click', () => {
                if (flowClicks === 0) flowStartTime = performance.now();
                flowClicks++;

                // Toggle selection
                flowOptions.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                flowSelectedOption = option.id;

                checkFlowStep2();
            });
        });

        function checkFlowStep2() {
            const zipValid = flowZip.value.trim().length > 4;
            const optionSelected = flowSelectedOption !== null;

            if (zipValid && optionSelected) {
                flowSubmitBtn.disabled = false;
                flowSubmitBtn.classList.remove('btn-secondary');
                flowSubmitBtn.classList.add('btn-accent'); // Primary for Flowtrus
                flowSubmitBtn.style.opacity = '1';
                flowSubmitBtn.style.cursor = 'pointer';
            } else {
                flowSubmitBtn.disabled = true;
                flowSubmitBtn.classList.add('btn-secondary');
                flowSubmitBtn.classList.remove('btn-accent');
                flowSubmitBtn.style.opacity = '0.5';
                flowSubmitBtn.style.cursor = 'not-allowed';
            }
        }

        // Submit
        flowSubmitBtn.addEventListener('click', () => {
            if (flowSubmitBtn.disabled) return;
            flowClicks++;

            const totalTime = performance.now() - flowStartTime;

            document.getElementById('flow-time').textContent = formatTime(totalTime);
            document.getElementById('flow-clicks').textContent = flowClicks;

            const successView = document.getElementById('mock-success-view');
            document.getElementById('mock-interaction-view').style.opacity = '0';
            successView.style.opacity = '1';
            successView.style.pointerEvents = 'all';
        });

        window.resetFlowGame = function () {
            flowClicks = 0;
            flowStartTime = null;
            flowSelectedOption = null;

            // Clear Inputs
            allFlowInputs.forEach(input => input.value = '');
            flowOptions.forEach(o => o.classList.remove('selected'));

            // Reset Views
            const successView = document.getElementById('mock-success-view');
            successView.style.opacity = '0';
            successView.style.pointerEvents = 'none';

            document.getElementById('mock-interaction-view').style.opacity = '1';

            // Go back to Step 1
            flowStep2.style.display = 'none';
            flowStep2.style.opacity = '0';
            flowStep2.style.transform = 'translateX(20px)';

            flowStep1.style.display = 'block';
            flowStep1.style.opacity = '1';
            flowStep1.style.transform = 'translateX(0)';

            checkFlowStep1(); // Disable buttons
            checkFlowStep2();
        };
    });
