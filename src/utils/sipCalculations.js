/**
 * SIP Calculator with Step-Up Feature
 * Pure functions for calculating SIP returns with step-up investments
 */

/**
 * Calculate SIP with step-up feature
 * @param {Object} params - Investment parameters
 * @param {number} params.monthlyAmount - Initial monthly SIP amount
 * @param {number} params.durationYears - Investment duration in years
 * @param {number} params.annualReturnRate - Expected annual return rate (%)
 * @param {number} params.stepUpAmount - Step-up amount (optional)
 * @param {string} params.stepUpFrequency - Step-up frequency ('monthly', 'quarterly', 'halfYearly', 'annually', 'none')
 * @returns {Object} Calculation results with summary and monthly breakdown
 */
export const calculateSIPWithStepUp = (params) => {
  const {
    monthlyAmount,
    durationYears,
    annualReturnRate,
    stepUpAmount = 0,
    stepUpFrequency = 'none'
  } = params;

  // Input validation
  if (!monthlyAmount || monthlyAmount <= 0) {
    throw new Error('Monthly amount must be greater than 0');
  }
  if (!durationYears || durationYears <= 0) {
    throw new Error('Duration must be greater than 0');
  }
  if (!annualReturnRate || annualReturnRate <= 0) {
    throw new Error('Annual return rate must be greater than 0');
  }

  const totalMonths = durationYears * 12;
  const monthlyReturnRate = annualReturnRate / 12 / 100;
  
  let currentSIPAmount = monthlyAmount;
  let totalInvestment = 0;
  let totalStepUps = 0;
  let finalCorpus = 0;
  
  const monthlyBreakdown = [];
  const stepUpFrequencyMonths = getStepUpFrequencyInMonths(stepUpFrequency);

  for (let month = 1; month <= totalMonths; month++) {
    // Check if step-up should be applied
    const isStepUpMonth = stepUpFrequency !== 'none' && 
                         stepUpAmount > 0 && 
                         month > 1 && 
                         (month - 1) % stepUpFrequencyMonths === 0;

    if (isStepUpMonth) {
      currentSIPAmount += stepUpAmount;
      totalStepUps += stepUpAmount;
    }

    // Calculate investment and returns for this month
    const previousBalance = finalCorpus;
    const investmentThisMonth = currentSIPAmount;
    const interestEarned = previousBalance * monthlyReturnRate;
    
    totalInvestment += investmentThisMonth;
    finalCorpus = previousBalance + investmentThisMonth + interestEarned;

    // Store monthly data
    monthlyBreakdown.push({
      month,
      monthYear: getMonthYear(month),
      sipAmount: investmentThisMonth,
      stepUpApplied: isStepUpMonth ? stepUpAmount : 0,
      cumulativeInvestment: totalInvestment,
      interestEarned,
      closingBalance: finalCorpus
    });
  }

  const totalReturns = finalCorpus - totalInvestment;
  const absoluteReturn = ((finalCorpus - totalInvestment) / totalInvestment) * 100;
  
  // Calculate CAGR (Compound Annual Growth Rate)
  const cagr = (Math.pow(finalCorpus / totalInvestment, 1 / durationYears) - 1) * 100;

  return {
    summary: {
      totalInvestment: Math.round(totalInvestment),
      totalStepUps: Math.round(totalStepUps),
      finalCorpus: Math.round(finalCorpus),
      totalReturns: Math.round(totalReturns),
      absoluteReturn: Math.round(absoluteReturn * 100) / 100,
      cagr: Math.round(cagr * 100) / 100
    },
    monthlyBreakdown
  };
};

/**
 * Get step-up frequency in months
 * @param {string} frequency - Step-up frequency
 * @returns {number} Number of months
 */
const getStepUpFrequencyInMonths = (frequency) => {
  const frequencyMap = {
    'monthly': 1,
    'quarterly': 3,
    'halfYearly': 6,
    'annually': 12,
    'none': 0
  };
  return frequencyMap[frequency] || 0;
};

/**
 * Get month-year string for display
 * @param {number} monthNumber - Month number (1-based)
 * @returns {string} Month-Year string
 */
const getMonthYear = (monthNumber) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const targetDate = new Date(startDate.getFullYear(), startDate.getMonth() + monthNumber - 1, 1);
  
  return targetDate.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage for display
 * @param {number} percentage - Percentage to format
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (percentage) => {
  return `${percentage.toFixed(2)}%`;
};

/**
 * Validate input parameters
 * @param {Object} params - Input parameters
 * @returns {Object} Validation result with errors array
 */
export const validateInputs = (params) => {
  const errors = [];
  const {
    monthlyAmount,
    durationYears,
    annualReturnRate,
    stepUpAmount
  } = params;

  if (!monthlyAmount || monthlyAmount <= 0) {
    errors.push('Monthly SIP amount must be greater than 0');
  }
  if (monthlyAmount > 10000000) {
    errors.push('Monthly SIP amount seems too high (max: ₹1 Crore)');
  }
  
  if (!durationYears || durationYears <= 0) {
    errors.push('Investment duration must be greater than 0');
  }
  if (durationYears > 50) {
    errors.push('Investment duration seems too long (max: 50 years)');
  }
  
  if (!annualReturnRate || annualReturnRate <= 0) {
    errors.push('Expected annual return must be greater than 0');
  }
  if (annualReturnRate > 50) {
    errors.push('Expected annual return seems too high (max: 50%)');
  }
  
  if (stepUpAmount && stepUpAmount < 0) {
    errors.push('Step-up amount cannot be negative');
  }
  if (stepUpAmount && stepUpAmount > monthlyAmount) {
    errors.push('Step-up amount should not exceed monthly SIP amount');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
