let investmentChart;

function calculateSIP() {
    // Get user input values
    let monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value);
    const annualRate = parseFloat(document.getElementById('annualRate').value);
    const years = parseInt(document.getElementById('years').value);
    const stepUpPercentage = parseFloat(document.getElementById('stepUpPercentage').value) || 0;
    const stepUpFrequency = document.getElementById('stepUpFrequency').value;

    // Validate input
    const errorMessage = document.getElementById('errorMessage');
    if (isNaN(monthlyInvestment) || isNaN(annualRate) || isNaN(years) || monthlyInvestment <= 0 || annualRate <= 0 || years <= 0) {
        errorMessage.textContent = "Please enter valid values.";
        errorMessage.classList.remove('hidden');
        return;
    }
    errorMessage.classList.add('hidden');

    // Calculate SIP
    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;
    let totalAmount = 0;
    let totalInvested = 0;

    for (let i = 0; i < months; i++) {
        if (stepUpFrequency !== 'none' && i > 0) {
            const frequencyInMonths = stepUpFrequency === 'quarterly' ? 3 : stepUpFrequency === 'halfYearly' ? 6 : 12;
            if (i % frequencyInMonths === 0) {
                monthlyInvestment += monthlyInvestment * (stepUpPercentage / 100);
            }
        }
        // Calculate the total invested amount
        totalInvested += monthlyInvestment;
        // Calculate the total accumulated amount with interest
        totalAmount = totalAmount * (1 + monthlyRate) + monthlyInvestment;
    }

    // Calculate returns
    const totalReturns = totalAmount - totalInvested;

    // Display the final amount
    document.getElementById('result').textContent = totalAmount.toFixed(2);

    // Show the chart container and update the chart
    document.getElementById('investmentChart').classList.remove('hidden');
    updateChart(totalInvested, totalReturns);
}

function updateChart(totalInvested, totalReturns) {
    const ctx = document.getElementById('investmentChart').getContext('2d');

    if (investmentChart) {
        investmentChart.destroy();
    }

    investmentChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Invested Amount', 'Returns'],
            datasets: [{
                data: [totalInvested, totalReturns],
                backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ₹${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}
