import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  CloudDownload as CloudDownloadIcon,
  TrendingUp as TrendingUpIcon,
  FileDownload as FileDownloadIcon,
  TableView as TableViewIcon
} from '@mui/icons-material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { formatCurrency } from '../utils/sipCalculations';

const MonthlyTable = ({ data, isMobile }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToCSV = () => {
    const headers = [
      'Month',
      'Month-Year',
      'SIP Amount',
      'Step-Up Applied',
      'Cumulative Investment',
      'Interest Earned',
      'Closing Balance'
    ];

    const csvData = data.map(row => [
      row.month,
      row.monthYear,
      row.sipAmount,
      row.stepUpApplied,
      row.cumulativeInvestment,
      row.interestEarned.toFixed(2),
      row.closingBalance.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `SIP_Monthly_Breakdown_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(row => ({
        'Month': row.month,
        'Month-Year': row.monthYear,
        'SIP Amount': row.sipAmount,
        'Step-Up Applied': row.stepUpApplied,
        'Cumulative Investment': row.cumulativeInvestment,
        'Interest Earned': parseFloat(row.interestEarned.toFixed(2)),
        'Closing Balance': parseFloat(row.closingBalance.toFixed(2))
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Breakdown');

    XLSX.writeFile(workbook, `SIP_Monthly_Breakdown_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Get data for current page
  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = [
    { id: 'month', label: 'Month', minWidth: 80, align: 'center' },
    { id: 'monthYear', label: 'Month-Year', minWidth: 120 },
    { id: 'sipAmount', label: 'SIP Amount', minWidth: 120, format: formatCurrency },
    { id: 'stepUpApplied', label: 'Step-Up', minWidth: 100, format: formatCurrency },
    { id: 'cumulativeInvestment', label: 'Cumulative Investment', minWidth: 150, format: formatCurrency },
    { id: 'interestEarned', label: 'Interest Earned', minWidth: 140, format: (value) => formatCurrency(value) },
    { id: 'closingBalance', label: 'Closing Balance', minWidth: 150, format: formatCurrency }
  ];

  if (isMobile) {
    return (
      <Box>
        {/* Export Buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="textSecondary">
            {data.length} months of investment data
          </Typography>
          <Box>
            <Button
              size="small"
              startIcon={<FileDownloadIcon />}
              onClick={exportToCSV}
              sx={{ mr: 1 }}
              variant="outlined"
            >
              CSV
            </Button>
            <Button
              size="small"
              startIcon={<CloudDownloadIcon />}
              onClick={exportToExcel}
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Excel
            </Button>
          </Box>
        </Box>

        {/* Mobile Card View */}
        {paginatedData.map((row, index) => (
          <Paper
            key={row.month}
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: row.stepUpApplied > 0 ? theme.palette.success.light + '10' : 'white'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" color="primary">
                Month {row.month}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {row.monthYear}
              </Typography>
            </Box>
            
            {row.stepUpApplied > 0 && (
              <Box mb={1}>
                <Chip
                  icon={<TrendingUpIcon />}
                  label={`Step-Up: ${formatCurrency(row.stepUpApplied)}`}
                  color="success"
                  size="small"
                />
              </Box>
            )}

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
              <Typography variant="body2">
                <strong>SIP Amount:</strong><br />
                {formatCurrency(row.sipAmount)}
              </Typography>
              <Typography variant="body2">
                <strong>Interest Earned:</strong><br />
                {formatCurrency(row.interestEarned)}
              </Typography>
              <Typography variant="body2">
                <strong>Total Invested:</strong><br />
                {formatCurrency(row.cumulativeInvestment)}
              </Typography>
              <Typography variant="body2">
                <strong>Balance:</strong><br />
                <span style={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
                  {formatCurrency(row.closingBalance)}
                </span>
              </Typography>
            </Box>
          </Paper>
        ))}

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Export Options */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <TableViewIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1">
            Monthly Investment Breakdown ({data.length} months)
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Export as CSV">
            <IconButton onClick={exportToCSV} color="primary">
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            size="small"
            startIcon={<CloudDownloadIcon />}
            onClick={exportToExcel}
            sx={{ ml: 1, borderRadius: 2 }}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* Desktop Table View */}
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'right'}
                  style={{ 
                    minWidth: column.minWidth,
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow 
                hover 
                key={row.month}
                sx={{
                  backgroundColor: row.stepUpApplied > 0 ? theme.palette.success.light + '20' : 'inherit'
                }}
              >
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="bold">
                    {row.month}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.monthYear}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatCurrency(row.sipAmount)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {row.stepUpApplied > 0 ? (
                    <Chip
                      label={formatCurrency(row.stepUpApplied)}
                      color="success"
                      size="small"
                      icon={<TrendingUpIcon />}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatCurrency(row.cumulativeInvestment)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="success.main">
                    {formatCurrency(row.interestEarned)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {formatCurrency(row.closingBalance)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[12, 24, 50, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default MonthlyTable;
