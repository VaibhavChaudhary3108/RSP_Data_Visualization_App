import { loadRealData, getMonthlyAverages, metroCities, availableYears, RSPDataPoint } from './data';
import { RSPChart } from './chart';

/**
 * RSPVisualizationApp - Main application controller
 * 
 * @description Centralized application state management, UI coordination,
 * and event handling. Manages data loading, chart updates, and user interactions.
 * Implements comprehensive error handling and responsive design.
 */
class RSPVisualizationApp {
  private chart: RSPChart | null = null;
  private data: RSPDataPoint[] = [];
  private citySelect!: HTMLSelectElement;
  private fuelSelect!: HTMLSelectElement;
  private yearSelect!: HTMLSelectElement;
  private isInitialized = false;
  private statsContainer!: HTMLElement;
  private loadingElement!: HTMLElement;

  /**
   * Initializes the RSP Visualization Application
   * 
   * @description Sets up DOM elements, event listeners, data loading,
   * and chart initialization. Implements error handling for graceful failures.
   * 
   * @throws {Error} When critical DOM elements are missing
   */
  constructor() {
    try {
      this.initializeElements();
      this.initializeChart();
      this.setupEventListeners();
      this.populateDropdowns();
      this.setupResizeHandler();
      this.loadData();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing RSP Visualization App:', error);
      this.showError('Failed to initialize application');
    }
  }

  private async loadData() {
    try {
      this.data = await loadRealData();
      this.hideLoading();
    } catch (error) {
      console.error('Failed to load real data:', error);
      this.hideLoading();
    }
  }

  private hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
  }

  private initializeElements() {
    try {
      this.citySelect = document.getElementById('citySelect') as HTMLSelectElement;
      this.fuelSelect = document.getElementById('fuelSelect') as HTMLSelectElement;
      this.yearSelect = document.getElementById('yearSelect') as HTMLSelectElement;
      this.statsContainer = document.getElementById('statsContainer') as HTMLElement;
      this.loadingElement = document.querySelector('.loading') as HTMLElement;

      if (!this.citySelect) {
        throw new Error('City select element not found');
      }
      if (!this.fuelSelect) {
        throw new Error('Fuel select element not found');
      }
      if (!this.yearSelect) {
        throw new Error('Year select element not found');
      }
      if (!this.statsContainer) {
        throw new Error('Stats container not found');
      }
      if (!this.loadingElement) {
        throw new Error('Loading element not found');
      }
    } catch (error) {
      console.error('Error initializing elements:', error);
      throw error;
    }
  }

  private initializeChart() {
    try {
      this.chart = new RSPChart('chartContainer');
    } catch (error) {
      console.error('Error initializing chart:', error);
      this.showError('Failed to initialize chart');
    }
  }

  private setupEventListeners() {
    try {
      this.citySelect.addEventListener('change', () => this.updateChart());
      this.fuelSelect.addEventListener('change', () => this.updateChart());
      this.yearSelect.addEventListener('change', () => this.updateChart());
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  private populateDropdowns() {
    try {
      // Populate city dropdown
      metroCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        this.citySelect.appendChild(option);
      });

      // Populate year dropdown
      availableYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year.toString();
        option.textContent = year.toString();
        this.yearSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error populating dropdowns:', error);
    }
  }

  private setupResizeHandler() {
    try {
      window.addEventListener('resize', () => {
        if (this.chart) {
          this.chart.resize();
        }
      });
    } catch (error) {
      console.error('Error setting up resize handler:', error);
    }
  }

  private updateChart() {
    try {
      if (!this.isInitialized || !this.chart) {
        return;
      }

      const selectedCity = this.citySelect.value;
      const selectedFuel = this.fuelSelect.value as 'petrol' | 'diesel';
      const selectedYear = parseInt(this.yearSelect.value);

      if (selectedCity && selectedFuel && selectedYear && !isNaN(selectedYear)) {
        const monthlyAverages = getMonthlyAverages(this.data, selectedCity, selectedFuel, selectedYear);
        this.chart.updateChart(monthlyAverages, selectedCity, selectedFuel, selectedYear);
        this.updateStatistics(monthlyAverages);
        this.showStats();
      } else {
        // Show empty state when not all selections are made
        this.chart.updateChart([], '', '', 0);
        this.hideStats();
      }
    } catch (error) {
      console.error('Error updating chart:', error);
      if (this.chart) {
        this.chart.updateChart([], '', '', 0);
      }
      this.hideStats();
    }
  }

  private updateStatistics(monthlyData: number[]) {
    try {
      const validData = monthlyData.filter(value => value > 0);
      
      if (validData.length === 0) {
        this.hideStats();
        return;
      }

      const avgPrice = validData.reduce((sum, value) => sum + value, 0) / validData.length;
      const maxPrice = Math.max(...validData);
      const minPrice = Math.min(...validData);
      const priceRange = maxPrice - minPrice;

      const avgPriceElement = document.getElementById('avgPrice');
      const maxPriceElement = document.getElementById('maxPrice');
      const minPriceElement = document.getElementById('minPrice');
      const priceRangeElement = document.getElementById('priceRange');

      if (avgPriceElement) avgPriceElement.textContent = `₹${avgPrice.toFixed(2)}`;
      if (maxPriceElement) maxPriceElement.textContent = `₹${maxPrice.toFixed(2)}`;
      if (minPriceElement) minPriceElement.textContent = `₹${minPrice.toFixed(2)}`;
      if (priceRangeElement) priceRangeElement.textContent = `₹${priceRange.toFixed(2)}`;

    } catch (error) {
      console.error('Error updating statistics:', error);
    }
  }

  private showStats() {
    if (this.statsContainer) {
      this.statsContainer.style.display = 'grid';
    }
  }

  private hideStats() {
    if (this.statsContainer) {
      this.statsContainer.style.display = 'none';
    }
  }

  private showError(message: string) {
    try {
      const chartContainer = document.getElementById('chartContainer');
      if (chartContainer) {
        chartContainer.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #ff0000;
            font-size: 18px;
            text-align: center;
            padding: 20px;
          ">
            ${message}
          </div>
        `;
      }
    } catch (error) {
      console.error('Error showing error message:', error);
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    new RSPVisualizationApp();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    // Show error message in the page
    const body = document.body;
    if (body) {
      body.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: #ff0000;
          font-size: 18px;
          text-align: center;
          padding: 20px;
        ">
          Failed to initialize application. Please refresh the page.
        </div>
      `;
    }
  }
});

