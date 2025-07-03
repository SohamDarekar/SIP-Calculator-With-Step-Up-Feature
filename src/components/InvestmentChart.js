import React, { useState } from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Paper,
  useTheme
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
  DonutLarge as DonutLargeIcon,
  BarChart as BarChartIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { formatCurrency } from '../utils/sipCalculations';

const InvestmentChart = ({ monthlyData, summary }) => {
  const [chartType, setChartType] = useState('growth');
  const theme = useTheme();

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // Prepare data for line chart (growth over time)
  const growthData = monthlyData.map(item => ({
    month: item.month,
    monthYear: item.monthYear,
    investment: item.cumulativeInvestment,
    balance: item.closingBalance,
    returns: item.closingBalance - item.cumulativeInvestment
  }));

  // Prepare data for pie chart (investment vs returns)
  const pieData = [
    { name: 'Total Investment', value: summary.totalInvestment, color: theme.palette.primary.main },
    { name: 'Total Returns', value: summary.totalReturns, color: theme.palette.success.main }
  ];

  // Prepare data for yearly breakdown
  const yearlyData = [];
  const dataByYear = {};
  
  monthlyData.forEach(item => {
    const year = Math.ceil(item.month / 12);
    if (!dataByYear[year]) {
      dataByYear[year] = {
        year: `Year ${year}`,
        investment: 0,
        returns: 0,
        balance: 0
      };
    }
    dataByYear[year].investment = item.cumulativeInvestment;
    dataByYear[year].balance = item.closingBalance;
    dataByYear[year].returns = item.closingBalance - item.cumulativeInvestment;
  });

  Object.values(dataByYear).forEach(yearData => {
    yearlyData.push(yearData);
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, backgroundColor: 'background.paper', border: 1, borderColor: 'divider' }}>
          <Typography variant="body2" fontWeight="bold">
            {chartType === 'growth' ? `Month ${label}` : label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'growth':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="investment"
                stackId="1"
                stroke={theme.palette.primary.main}
                fill={theme.palette.primary.main}
                fillOpacity={0.6}
                name="Cumulative Investment"
              />
              <Area
                type="monotone"
                dataKey="returns"
                stackId="1"
                stroke={theme.palette.success.main}
                fill={theme.palette.success.main}
                fillOpacity={0.6}
                name="Returns"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="investment"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                name="Cumulative Investment"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke={theme.palette.success.main}
                strokeWidth={2}
                name="Portfolio Value"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'distribution':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'yearly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="investment"
                fill={theme.palette.primary.main}
                name="Investment"
              />
              <Bar
                dataKey="returns"
                fill={theme.palette.success.main}
                name="Returns"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Chart Type Toggle */}
      <Box display="flex" justifyContent="center" mb={3}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            }
          }}
        >
          <ToggleButton value="growth">
            <TimelineIcon fontSize="small" />
            Growth Timeline
          </ToggleButton>
          <ToggleButton value="comparison">
            <ShowChartIcon fontSize="small" />
            Investment vs Returns
          </ToggleButton>
          <ToggleButton value="distribution">
            <DonutLargeIcon fontSize="small" />
            Portfolio Split
          </ToggleButton>
          <ToggleButton value="yearly">
            <BarChartIcon fontSize="small" />
            Yearly Analysis
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Chart Description */}
      <Box mb={2}>
        {chartType === 'growth' && (
          <Typography variant="body2" color="textSecondary" align="center">
            Cumulative growth of your investment and returns over time
          </Typography>
        )}
        {chartType === 'comparison' && (
          <Typography variant="body2" color="textSecondary" align="center">
            Comparison between total investment and portfolio value
          </Typography>
        )}
        {chartType === 'distribution' && (
          <Typography variant="body2" color="textSecondary" align="center">
            Breakdown of investment vs returns at maturity
          </Typography>
        )}
        {chartType === 'yearly' && (
          <Typography variant="body2" color="textSecondary" align="center">
            Year-wise investment and returns breakdown
          </Typography>
        )}
      </Box>

      {/* Chart */}
      <Box sx={{ width: '100%', height: 400 }}>
        {renderChart()}
      </Box>

      {/* Chart Insights */}
      <Box mt={3}>
        <Paper variant="outlined" sx={{ 
          p: 2, 
          backgroundColor: theme.palette.grey[50],
          borderLeft: `4px solid ${theme.palette.primary.main}`
        }}>
          <Box display="flex" alignItems="center" mb={1}>
            <LightbulbIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2" fontWeight="bold" color="primary">
              Chart Insights
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {chartType === 'growth' && 'The stacked area shows how your returns grow exponentially due to compounding effects over time.'}
            {chartType === 'comparison' && 'The widening gap between lines demonstrates the accelerating power of compounding investments.'}
            {chartType === 'distribution' && `Your returns constitute ${((summary.totalReturns / summary.finalCorpus) * 100).toFixed(1)}% of the final corpus, showcasing investment efficiency.`}
            {chartType === 'yearly' && 'Notice how returns accelerate in later years - this is the magic of compound interest working for you.'}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default InvestmentChart;
