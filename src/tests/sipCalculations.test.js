import { 
  calculateSIPWithStepUp, 
  validateInputs, 
  formatCurrency, 
  formatPercentage 
} from '../utils/sipCalculations';

describe('SIP Calculations', () => {
  
  // Test basic SIP calculation without step-up
  describe('Basic SIP Calculation', () => {
    test('should calculate SIP without step-up correctly', () => {
      const params = {
        monthlyAmount: 10000,
        durationYears: 10,
        annualReturnRate: 12,
        stepUpAmount: 0,
        stepUpFrequency: 'none'
      };

      const result = calculateSIPWithStepUp(params);
      
      expect(result.summary.totalInvestment).toBe(1200000); // 10000 * 12 * 10
      expect(result.summary.finalCorpus).toBeGreaterThan(result.summary.totalInvestment);
      expect(result.monthlyBreakdown).toHaveLength(120); // 10 years * 12 months
    });

    test('should calculate correct number of months', () => {
      const params = {
        monthlyAmount: 5000,
        durationYears: 5,
        annualReturnRate: 10,
        stepUpAmount: 0,
        stepUpFrequency: 'none'
      };

      const result = calculateSIPWithStepUp(params);
      expect(result.monthlyBreakdown).toHaveLength(60); // 5 years * 12 months
    });
  });

  // Test SIP calculation with step-up
  describe('SIP with Step-Up', () => {
    test('should apply annual step-up correctly', () => {
      const params = {
        monthlyAmount: 10000,
        durationYears: 3,
        annualReturnRate: 12,
        stepUpAmount: 1000,
        stepUpFrequency: 'annually'
      };

      const result = calculateSIPWithStepUp(params);
      
      // Check if step-ups are applied correctly
      const firstYearSIP = result.monthlyBreakdown[0].sipAmount;
      const secondYearSIP = result.monthlyBreakdown[12].sipAmount;
      const thirdYearSIP = result.monthlyBreakdown[24].sipAmount;
      
      expect(firstYearSIP).toBe(10000);
      expect(secondYearSIP).toBe(11000); // 10000 + 1000
      expect(thirdYearSIP).toBe(12000); // 11000 + 1000
    });

    test('should apply quarterly step-up correctly', () => {
      const params = {
        monthlyAmount: 5000,
        durationYears: 1,
        annualReturnRate: 10,
        stepUpAmount: 500,
        stepUpFrequency: 'quarterly'
      };

      const result = calculateSIPWithStepUp(params);
      
      // Check step-ups at months 4, 7, 10
      expect(result.monthlyBreakdown[0].sipAmount).toBe(5000); // Month 1
      expect(result.monthlyBreakdown[3].sipAmount).toBe(5500); // Month 4
      expect(result.monthlyBreakdown[6].sipAmount).toBe(6000); // Month 7
      expect(result.monthlyBreakdown[9].sipAmount).toBe(6500); // Month 10
    });

    test('should calculate total step-ups correctly', () => {
      const params = {
        monthlyAmount: 10000,
        durationYears: 2,
        annualReturnRate: 12,
        stepUpAmount: 1000,
        stepUpFrequency: 'annually'
      };

      const result = calculateSIPWithStepUp(params);
      
      // Should have 1 step-up in 2 years (at month 13)
      expect(result.summary.totalStepUps).toBe(1000);
    });
  });

  // Test input validation
  describe('Input Validation', () => {
    test('should validate valid inputs', () => {
      const params = {
        monthlyAmount: 10000,
        durationYears: 10,
        annualReturnRate: 12,
        stepUpAmount: 1000,
        stepUpFrequency: 'annually'
      };

      const validation = validateInputs(params);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid monthly amount', () => {
      const params = {
        monthlyAmount: 0,
        durationYears: 10,
        annualReturnRate: 12,
        stepUpAmount: 1000,
        stepUpFrequency: 'annually'
      };

      const validation = validateInputs(params);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Monthly SIP amount must be greater than 0');
    });

    test('should reject invalid duration', () => {
      const params = {
        monthlyAmount: 10000,
        durationYears: 0,
        annualReturnRate: 12,
        stepUpAmount: 1000,
        stepUpFrequency: 'annually'
      };

      const validation = validateInputs(params);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Investment duration must be greater than 0');
    });

    test('should reject invalid return rate', () => {
      const params = {
        monthlyAmount: 10000,
        durationYears: 10,
        annualReturnRate: 0,
        stepUpAmount: 1000,
        stepUpFrequency: 'annually'
      };

      const validation = validateInputs(params);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Expected annual return must be greater than 0');
    });

    test('should reject step-up amount greater than monthly amount', () => {
      const params = {
        monthlyAmount: 5000,
        durationYears: 10,
        annualReturnRate: 12,
        stepUpAmount: 6000,
        stepUpFrequency: 'annually'
      };

      const validation = validateInputs(params);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Step-up amount should not exceed monthly SIP amount');
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    test('should throw error for invalid monthly amount', () => {
      const params = {
        monthlyAmount: -1000,
        durationYears: 10,
        annualReturnRate: 12,
        stepUpAmount: 0,
        stepUpFrequency: 'none'
      };

      expect(() => calculateSIPWithStepUp(params)).toThrow('Monthly amount must be greater than 0');
    });

    test('should throw error for invalid duration', () => {
      const params = {
        monthlyAmount: 10000,
        durationYears: -5,
        annualReturnRate: 12,
        stepUpAmount: 0,
        stepUpFrequency: 'none'
      };

      expect(() => calculateSIPWithStepUp(params)).toThrow('Duration must be greater than 0');
    });

    test('should throw error for invalid return rate', () => {
      const params = {
        monthlyAmount: 10000,
        durationYears: 10,
        annualReturnRate: -12,
        stepUpAmount: 0,
        stepUpFrequency: 'none'
      };

      expect(() => calculateSIPWithStepUp(params)).toThrow('Annual return rate must be greater than 0');
    });
  });

  // Test utility functions
  describe('Utility Functions', () => {
    test('should format currency correctly', () => {
      expect(formatCurrency(100000)).toBe('₹1,00,000');
      expect(formatCurrency(1500000)).toBe('₹15,00,000');
      expect(formatCurrency(50000)).toBe('₹50,000');
    });

    test('should format percentage correctly', () => {
      expect(formatPercentage(12.5)).toBe('12.50%');
      expect(formatPercentage(8)).toBe('8.00%');
      expect(formatPercentage(15.678)).toBe('15.68%');
    });
  });

  // Test realistic scenarios
  describe('Realistic Scenarios', () => {
    test('should handle realistic long-term SIP', () => {
      const params = {
        monthlyAmount: 15000,
        durationYears: 20,
        annualReturnRate: 12,
        stepUpAmount: 1500,
        stepUpFrequency: 'annually'
      };

      const result = calculateSIPWithStepUp(params);
      
      expect(result.summary.finalCorpus).toBeGreaterThan(10000000); // Should be substantial
      expect(result.summary.cagr).toBeCloseTo(12, 1); // Should be close to expected return
      expect(result.monthlyBreakdown).toHaveLength(240); // 20 years
    });

    test('should handle short-term SIP', () => {
      const params = {
        monthlyAmount: 5000,
        durationYears: 2,
        annualReturnRate: 8,
        stepUpAmount: 0,
        stepUpFrequency: 'none'
      };

      const result = calculateSIPWithStepUp(params);
      
      expect(result.summary.totalInvestment).toBe(120000); // 5000 * 24
      expect(result.summary.finalCorpus).toBeGreaterThan(120000);
      expect(result.monthlyBreakdown).toHaveLength(24);
    });
  });
});
