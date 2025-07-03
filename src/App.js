import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Alert,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  ShowChart as ShowChartIcon,
  TableChart as TableChartIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import InputForm from './components/InputForm';
import SummaryTable from './components/SummaryTable';
import MonthlyTable from './components/MonthlyTable';
import InvestmentChart from './components/InvestmentChart';

// Utils
import { calculateSIPWithStepUp, validateInputs } from './utils/sipCalculations';

// Create custom theme with modern colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#c51162',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2.125rem',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.005em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.005em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 28px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

function App() {
  const [calculationResult, setCalculationResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const handleCalculate = async (inputParams) => {
    setIsCalculating(true);
    setErrors([]);

    try {
      // Validate inputs
      const validation = validateInputs(inputParams);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setCalculationResult(null);
        return;
      }

      // Perform calculation
      const result = calculateSIPWithStepUp(inputParams);
      setCalculationResult(result);
      setErrors([]);
    } catch (error) {
      setErrors([error.message]);
      setCalculationResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setCalculationResult(null);
    setErrors([]);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 50%, #f8fafc 100%)',
            py: 3
          }}
        >
          <Container maxWidth="lg">
          {/* Header */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 3, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>            <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
              <TrendingUpIcon sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h4" component="h1">
                SIP Calculator
              </Typography>
              <AnalyticsIcon sx={{ fontSize: 40, ml: 2 }} />
            </Box>
              <Typography variant="h6" sx={{ fontWeight: 300, mb: 1 }}>
                with Step-Up Feature
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Calculate your Systematic Investment Plan returns with flexible step-up options
              </Typography>
            </Box>
            {/* Background decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                zIndex: 0
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '50%',
                zIndex: 0
              }}
            />
          </Paper>

          {/* Error Display */}
          {errors.length > 0 && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setErrors([])}
            >
              <Box>
                {errors.map((error, index) => (
                  <Typography key={index} variant="body2">
                    • {error}
                  </Typography>
                ))}
              </Box>
            </Alert>
          )}

          {/* Input Form */}
          <Paper elevation={3} sx={{ 
            p: 4, 
            mb: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Box display="flex" alignItems="center" mb={2}>
              <SettingsIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
              <Typography variant="h5" color="primary" fontWeight={600}>
                Investment Parameters
              </Typography>
            </Box>
            <Divider sx={{ 
              mb: 3, 
              background: 'linear-gradient(90deg, transparent 0%, #1976d2 20%, #42a5f5 50%, #1976d2 80%, transparent 100%)',
              height: 2,
              borderRadius: 1
            }} />
            <InputForm 
              onCalculate={handleCalculate}
              onReset={handleReset}
              isCalculating={isCalculating}
            />
          </Paper>

          {/* Results Section */}
          {calculationResult && (
            <>
              {/* Summary Table */}
              <Paper elevation={3} sx={{ 
                p: 4, 
                mb: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <AssessmentIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                  <Typography variant="h5" color="primary" fontWeight={600}>
                    Investment Summary
                  </Typography>
                </Box>
                <Divider sx={{ 
                  mb: 3, 
                  background: 'linear-gradient(90deg, transparent 0%, #1976d2 20%, #42a5f5 50%, #1976d2 80%, transparent 100%)',
                  height: 2,
                  borderRadius: 1
                }} />
                <SummaryTable data={calculationResult.summary} />
              </Paper>

              {/* Chart */}
              <Paper elevation={3} sx={{ 
                p: 4, 
                mb: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <ShowChartIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                  <Typography variant="h5" color="primary" fontWeight={600}>
                    Investment Growth Visualization
                  </Typography>
                </Box>
                <Divider sx={{ 
                  mb: 3, 
                  background: 'linear-gradient(90deg, transparent 0%, #1976d2 20%, #42a5f5 50%, #1976d2 80%, transparent 100%)',
                  height: 2,
                  borderRadius: 1
                }} />
                <InvestmentChart 
                  monthlyData={calculationResult.monthlyBreakdown}
                  summary={calculationResult.summary}
                />
              </Paper>

              {/* Monthly Breakdown Table */}
              <Paper elevation={3} sx={{ 
                p: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <TableChartIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                  <Typography variant="h5" color="primary" fontWeight={600}>
                    Monthly Investment Breakdown
                  </Typography>
                </Box>
                <Divider sx={{ 
                  mb: 3, 
                  background: 'linear-gradient(90deg, transparent 0%, #1976d2 20%, #42a5f5 50%, #1976d2 80%, transparent 100%)',
                  height: 2,
                  borderRadius: 1
                }} />
                <MonthlyTable 
                  data={calculationResult.monthlyBreakdown}
                  isMobile={isMobile}
                />
              </Paper>
            </>
          )}

        </Container>
      </Box>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
