document.addEventListener('DOMContentLoaded', function () {
    // Only run if the calculator elements exist
    const visitorsSlider = document.getElementById('visitors');
    if (!visitorsSlider) return;

    const conversionSlider = document.getElementById('conversion');
    const dealValueSlider = document.getElementById('deal-value');

    // New Editable Inputs
    const visitorsInput = document.getElementById('input-visitors');
    const conversionInput = document.getElementById('input-conversion');
    const dealValueInput = document.getElementById('input-deal-value');

    const resultRevenue = document.getElementById('result-revenue');
    const resultLeads = document.getElementById('result-leads');
    const resultTime = document.getElementById('result-time');

    // Formatter for currency
    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(num);
    };

    // Main calculation function
    function calculateROI() {
        // Get values from NUMBER inputs (they are the master source when editing)
        // But we sync them first if this was triggered by a slider

        const visitors = parseInt(visitorsInput.value);
        const conversionRate = parseFloat(conversionInput.value);
        const dealValue = parseInt(dealValueInput.value);

        // --- Logic ---
        // 1. Current Monthly Revenue
        const currentLeads = visitors * (conversionRate / 100);
        const currentRevenue = currentLeads * dealValue;

        // 2. Projected (30% Lift in Conversion Rate)
        const liftPercentage = 0.30;
        const newConversionRate = conversionRate * (1 + liftPercentage);
        const newLeads = visitors * (newConversionRate / 100);
        const newRevenue = newLeads * dealValue;

        // 3. Monthly Differences
        const leadsDiff = newLeads - currentLeads;
        const revenueDiff = newRevenue - currentRevenue;

        // 4. Annual Projections
        const annualRevenueIncrease = revenueDiff * 12;

        // 5. Time Savings Logic
        const timeSavedPerLead = 0.5; // Hours
        const monthlyTimeSaved = newLeads * timeSavedPerLead;
        const annualTimeSaved = monthlyTimeSaved * 12;

        // Update Results (Animated)
        resultRevenue.textContent = formatCurrency(annualRevenueIncrease);
        resultLeads.textContent = '+' + Math.round(leadsDiff * 12).toLocaleString();
        resultTime.textContent = Math.round(annualTimeSaved) + 'h';
    }

    // Sync functions
    function syncToInput(slider, input) {
        input.value = slider.value;
        calculateROI();
    }

    function syncToSlider(input, slider) {
        slider.value = input.value;
        calculateROI();
    }

    // Event Listeners - Sliders (Drag)
    visitorsSlider.addEventListener('input', () => syncToInput(visitorsSlider, visitorsInput));
    conversionSlider.addEventListener('input', () => syncToInput(conversionSlider, conversionInput));
    dealValueSlider.addEventListener('input', () => syncToInput(dealValueSlider, dealValueInput));

    // Event Listeners - Inputs (Type)
    visitorsInput.addEventListener('input', () => syncToSlider(visitorsInput, visitorsSlider));
    conversionInput.addEventListener('input', () => syncToSlider(conversionInput, conversionSlider));
    dealValueInput.addEventListener('input', () => syncToSlider(dealValueInput, dealValueSlider));

    // Initial run
    calculateROI();
});
