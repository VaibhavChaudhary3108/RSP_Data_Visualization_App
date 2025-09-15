# RSP Data Visualization Dashboard

A modern, interactive web application for visualizing Retail Selling Price (RSP) data of Petrol and Diesel in Metro Cities using real data from NITI Aayog.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/VaibhavChaudhary3108/RSP_Data_Visualization_App)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-00C7B7?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/VaibhavChaudhary3108/RSP_Data_Visualization_App)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

## 🚀 Live Demo

**Deployment URL:** [https://rsp-data-visualization-app.vercel.app](https://rsp-data-visualization-app.vercel.app)

**GitHub Repository:** [https://github.com/VaibhavChaudhary3108/RSP_Data_Visualization_App](https://github.com/VaibhavChaudhary3108/RSP_Data_Visualization_App)

## 📊 Dashboard Screenshot

![RSP Data Visualization Dashboard](https://drive.google.com/uc?export=view&id=1y2vA-gD0Fmsb28UhPSWYRefsXOlyNhRF)

*Interactive dashboard showing monthly RSP trends with real-time statistics and responsive design*

## ✨ Features

- **Real Data Integration**: 23,362 records from NITI Aayog dataset (2017-2025)
- **Interactive Filtering**: 3 dropdown filters for City, Fuel Type, and Year
- **Dynamic Visualization**: Monthly average RSP bar charts with smooth animations
- **Real-time Statistics**: Average, Peak, Lowest prices, and Price Variation
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic dark/light theme detection
- **Error Handling**: Comprehensive error management and graceful fallbacks

## 🛠️ Technology Stack

- **Frontend**: TypeScript, Vite, HTML5, CSS3
- **Visualization**: Apache ECharts (direct implementation)
- **Data Processing**: Custom CSV parser with validation
- **Styling**: Modern CSS with gradients, animations, and responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (included with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VaibhavChaudhary3108/RSP_Data_Visualization_App.git
   cd RSP_Data_Visualization_App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   The browser will automatically open to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📊 Data Source

- **Dataset**: Retail Selling Price (RSP) of Petrol and Diesel in Metro Cities
- **Source**: National Data and Analytics Platform, NITI Aayog
- **Records**: 23,362 data points
- **Cities**: Mumbai, Delhi, Chennai, Kolkata
- **Fuel Types**: Petrol, Diesel
- **Time Range**: 2017-2025

## 🚀 Deployment

### Vercel (One-Click Deploy)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VaibhavChaudhary3108/RSP_Data_Visualization_App)

1. Click the deploy button above
2. Connect your GitHub account
3. Deploy automatically

### Manual Deployment
1. Fork this repository
2. Connect to Vercel
3. Deploy with default settings

## 🔧 Troubleshooting

- **Port already in use**: Change port in `vite.config.ts`
- **Browser doesn't open**: Navigate to `http://localhost:3000`
- **Data not loading**: Check browser console for errors
- **yarn dev not working**: Use `npm run dev` instead

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using TypeScript, Vite, and Apache ECharts**
