# SIP Calculator with Step-Up Feature

A modern, responsive SIP (Systematic Investment Plan) calculator built with React and Material-UI that supports step-up investments for enhanced wealth creation.

## 🚀 Features

- **Modern React UI** with Material-UI components
- **Responsive Design** for desktop and mobile devices
- **SIP Calculations** with step-up feature support
- **Interactive Charts** showing investment growth
- **Monthly Breakdown** with detailed analysis
- **Export Options** (CSV and Excel)
- **Input Validation** with helpful error messages
- **Unit Tests** for calculation accuracy

## 📱 Demo

The application provides:
1. Input form with validation and tooltips
2. Summary cards showing key metrics
3. Interactive charts (4 different types)
4. Detailed monthly breakdown table
5. Export functionality for data analysis

## 🛠️ Installation and Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   Opens the app at `http://localhost:3000`

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📊 How SIP with Step-Up Works

### Basic SIP
Invest a fixed amount regularly in mutual funds. The power of compounding helps your money grow over time.

### Step-Up SIP
Increase your investment amount at regular intervals to:
- Counter inflation effects
- Utilize salary increments
- Accelerate wealth creation
- Build investment discipline

## 🧪 Example Calculations

### Scenario 1: Basic SIP
- **Monthly**: ₹10,000
- **Duration**: 10 years
- **Return**: 12% annually
- **Result**: ~₹23 lakhs

### Scenario 2: SIP with Step-Up
- **Monthly**: ₹10,000
- **Duration**: 10 years  
- **Return**: 12% annually
- **Step-Up**: ₹1,000 annually
- **Result**: ~₹27 lakhs (**₹4+ lakhs additional!**)

## 📁 Project Structure

```
src/
├── components/
│   ├── InputForm.js         # Input form with validation
│   ├── SummaryTable.js      # Summary display cards
│   ├── MonthlyTable.js      # Monthly breakdown table
│   ├── InvestmentChart.js   # Interactive charts
│   └── ErrorBoundary.js     # Error handling
├── utils/
│   └── sipCalculations.js   # Core calculation logic
├── tests/
│   └── sipCalculations.test.js # Unit tests
└── App.js                   # Main application
```

## 🎯 Key Features

### Smart Input Validation
- Real-time validation with helpful error messages
- Input constraints to prevent unrealistic values
- Tooltips explaining each field

### Flexible Step-Up Options
- Monthly, quarterly, half-yearly, or annual frequency
- Visual indication of step-up months
- Clear breakdown of additional contributions

### Interactive Visualizations
- Growth over time (Area chart)
- Investment vs returns (Line chart)
- Portfolio distribution (Pie chart)
- Yearly breakdown (Bar chart)

### Export Capabilities
- CSV and Excel export functionality
- Professional formatting for analysis
- All calculation data included

## 🧮 Technology Stack

- **Frontend**: React 18, Material-UI v5
- **Charts**: Recharts library
- **Export**: file-saver, xlsx
- **Testing**: Jest, React Testing Library
- **Build**: Create React App

## 📈 Step-Up Benefits

| Feature | Basic SIP | Step-Up SIP |
|---------|-----------|-------------|
| Inflation Counter | ❌ | ✅ |
| Salary Increment Utilization | ❌ | ✅ |
| Faster Goal Achievement | ❌ | ✅ |
| Wealth Acceleration | ❌ | ✅ |

## 🎨 UI/UX Highlights

- **Material Design** principles
- **Responsive** layout for all devices
- **Interactive** tooltips and help text
- **Error boundaries** for graceful error handling
- **Loading states** and user feedback
- **Accessibility** compliant

## 🔧 Development

### Available Scripts
- `npm start` - Development server
- `npm test` - Run test suite
- `npm run build` - Production build
- `npm run eject` - Eject from CRA (not recommended)

### Testing
Comprehensive test suite covering:
- ✅ SIP calculations (all scenarios)
- ✅ Step-up calculations (all frequencies)
- ✅ Input validation
- ✅ Error handling
- ✅ Edge cases

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

---

**Happy Investing! 📈💰**


