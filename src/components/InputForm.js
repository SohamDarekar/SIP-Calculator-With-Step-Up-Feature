import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tooltip,
  IconButton,
  InputAdornment,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Refresh as RefreshIcon,
  Help as HelpIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Schedule as ScheduleIcon,
  Percent as PercentIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

const InputForm = ({ onCalculate, onReset, isCalculating }) => {
  const [formData, setFormData] = useState({
    monthlyAmount: '',
    durationYears: '',
    annualReturnRate: '',
    stepUpAmount: '',
    stepUpFrequency: 'none'
  });

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const params = {
      monthlyAmount: parseFloat(formData.monthlyAmount) || 0,
      durationYears: parseFloat(formData.durationYears) || 0,
      annualReturnRate: parseFloat(formData.annualReturnRate) || 0,
      stepUpAmount: parseFloat(formData.stepUpAmount) || 0,
      stepUpFrequency: formData.stepUpFrequency
    };

    onCalculate(params);
  };

  const handleReset = () => {
    setFormData({
      monthlyAmount: '',
      durationYears: '',
      annualReturnRate: '',
      stepUpAmount: '',
      stepUpFrequency: 'none'
    });
    onReset();
  };

  const stepUpFrequencyOptions = [
    { value: 'none', label: 'No Step-Up' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly (Every 3 months)' },
    { value: 'halfYearly', label: 'Half-Yearly (Every 6 months)' },
    { value: 'annually', label: 'Annually (Every 12 months)' }
  ];

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* Monthly SIP Amount */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Monthly SIP Amount"
            type="number"
            value={formData.monthlyAmount}
            onChange={handleInputChange('monthlyAmount')}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupeeIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="The amount you want to invest every month. This is your base SIP amount.">
                    <IconButton size="small">
                      <HelpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
            helperText="Enter your monthly investment amount (₹1,000 - ₹10,00,000)"
            inputProps={{ min: 1000, max: 10000000, step: 500 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Grid>

        {/* Investment Duration */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Investment Duration"
            type="number"
            value={formData.durationYears}
            onChange={handleInputChange('durationYears')}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ScheduleIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  Years
                  <Tooltip title="The number of years you plan to continue your SIP investments.">
                    <IconButton size="small">
                      <HelpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
            helperText="Investment period in years (1 - 50 years)"
            inputProps={{ min: 1, max: 50, step: 0.5 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Grid>

        {/* Expected Annual Return */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Expected Annual Return (CAGR)"
            type="number"
            value={formData.annualReturnRate}
            onChange={handleInputChange('annualReturnRate')}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PercentIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  %
                  <Tooltip title="Expected annual rate of return. For equity funds, typically 10-15%. For debt funds, typically 6-8%.">
                    <IconButton size="small">
                      <HelpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
            helperText="Expected annual return rate (5% - 25%)"
            inputProps={{ min: 5, max: 25, step: 0.5 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Grid>

        {/* Step-Up Amount */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Step-Up Amount (Optional)"
            type="number"
            value={formData.stepUpAmount}
            onChange={handleInputChange('stepUpAmount')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TrendingUpIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Additional amount to increase your SIP by at regular intervals. This helps counter inflation and increase wealth creation.">
                    <IconButton size="small">
                      <HelpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
            helperText="Amount to increase SIP by (optional)"
            inputProps={{ min: 0, step: 100 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Grid>

        {/* Step-Up Frequency */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Step-Up Frequency</InputLabel>
            <Select
              value={formData.stepUpFrequency}
              onChange={handleInputChange('stepUpFrequency')}
              label="Step-Up Frequency"
            >
              {stepUpFrequencyOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Info Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ 
            backgroundColor: 'linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%)', 
            height: '100%',
            border: '2px solid',
            borderColor: 'primary.light',
            borderRadius: 3
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <LightbulbIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" color="primary" fontWeight={600}>
                  Step-Up Benefits
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" lineHeight={1.6}>
                � Counter inflation effects<br/>
                📈 Increase wealth creation<br/>
                � Utilize salary increments<br/>
                🎯 Reach financial goals faster
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<CalculateIcon />}
              disabled={isCalculating}
              sx={{ 
                minWidth: 180,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, .3)',
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, .4)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                }
              }}
            >
              {isCalculating ? 'Calculating...' : 'Calculate SIP'}
            </Button>
            
            <Button
              type="button"
              variant="outlined"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              disabled={isCalculating}
              sx={{ 
                minWidth: 180,
                py: 1.5,
                borderRadius: 3,
                borderWidth: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, .2)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                }
              }}
            >
              Reset Form
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InputForm;
