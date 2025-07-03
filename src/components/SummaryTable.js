import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme
} from '@mui/material';
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  TrendingUp as TrendingUpIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  ShowChart as ShowChartIcon,
  MonetizationOn as MonetizationOnIcon,
  Analytics as AnalyticsIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { formatCurrency, formatPercentage } from '../utils/sipCalculations';

const SummaryTable = ({ data }) => {
  const theme = useTheme();

  const summaryItems = [
    {
      title: 'Total Investment',
      value: formatCurrency(data.totalInvestment),
      icon: <CurrencyRupeeIcon />,
      color: theme.palette.primary.main,
      description: 'Total amount invested over the period'
    },
    {
      title: 'Step-Up Contributions',
      value: formatCurrency(data.totalStepUps),
      icon: <TrendingUpIcon />,
      color: theme.palette.info.main,
      description: 'Additional amount from step-ups'
    },
    {
      title: 'Final Corpus',
      value: formatCurrency(data.finalCorpus),
      icon: <AccountBalanceWalletIcon />,
      color: theme.palette.success.main,
      description: 'Total maturity value',
      highlight: true
    },
    {
      title: 'Total Returns',
      value: formatCurrency(data.totalReturns),
      icon: <MonetizationOnIcon />,
      color: theme.palette.secondary.main,
      description: 'Total profit earned'
    },
    {
      title: 'Absolute Return',
      value: formatPercentage(data.absoluteReturn),
      icon: <AnalyticsIcon />,
      color: theme.palette.warning.main,
      description: 'Total return percentage'
    },
    {
      title: 'CAGR',
      value: formatPercentage(data.cagr),
      icon: <ShowChartIcon />,
      color: theme.palette.success.main,
      description: 'Compound Annual Growth Rate'
    }
  ];

  return (
    <Grid container spacing={3}>
      {summaryItems.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card 
            elevation={item.highlight ? 4 : 2}
            sx={{ 
              height: '100%',
              border: item.highlight ? `2px solid ${item.color}` : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: item.highlight 
                ? `linear-gradient(135deg, ${item.color}15, ${item.color}05)` 
                : 'white',
              '&:hover': {
                elevation: 6,
                transform: 'translateY(-6px) scale(1.02)',
                boxShadow: `0 12px 35px rgba(0,0,0,0.15)`,
                '& .icon-container': {
                  transform: 'scale(1.1) rotate(5deg)',
                }
              }
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Box 
                  className="icon-container"
                  sx={{ 
                    color: 'white',
                    mr: 2,
                    p: 1.5,
                    borderRadius: '12px',
                    backgroundColor: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 8px ${item.color}40`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {React.cloneElement(item.icon, { fontSize: 'medium' })}
                </Box>
                <Typography variant="h6" component="div" color="textPrimary" fontWeight={600}>
                  {item.title}
                </Typography>
              </Box>
              
              <Typography 
                variant={item.highlight ? "h4" : "h5"} 
                component="div" 
                color={item.color}
                fontWeight="bold"
                gutterBottom
              >
                {item.value}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                {item.description}
              </Typography>

              {item.highlight && (
                <Box mt={2}>
                  <Chip 
                    label="Maturity Amount" 
                    color="success" 
                    variant="outlined"
                    size="small"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Additional Insights */}
      <Grid item xs={12}>
        <Card 
          variant="outlined" 
          sx={{ 
            backgroundColor: theme.palette.grey[50],
            mt: 2
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Investment Insights
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Wealth Multiplier:</strong> {(data.finalCorpus / data.totalInvestment).toFixed(2)}x
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Returns vs Investment:</strong> {formatPercentage((data.totalReturns / data.totalInvestment) * 100)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Power of Compounding:</strong> High returns due to long-term investing
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryTable;
