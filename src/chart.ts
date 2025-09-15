import * as echarts from 'echarts';

/**
 * RSPChart - ECharts-based visualization component for RSP data
 * 
 * @description Handles chart initialization, updates, and state management.
 * Provides methods for displaying data, empty states, and error messages.
 * Implements responsive design and smooth animations.
 */
export class RSPChart {
  private chart: echarts.ECharts | null = null;
  private container: HTMLElement | null = null;

  /**
   * Creates a new RSPChart instance
   * 
   * @param containerId - HTML element ID where chart will be rendered
   * @throws {Error} When container not found or ECharts initialization fails
   */
  constructor(containerId: string) {
    try {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        throw new Error(`Chart container with id "${containerId}" not found`);
      }
      
      this.chart = echarts.init(this.container);
      if (!this.chart) {
        throw new Error('Failed to initialize ECharts');
      }
    } catch (error) {
      console.error('Error initializing chart:', error);
      throw error;
    }
  }

  /**
   * Updates the chart with new data
   * 
   * @description Renders monthly RSP data as an interactive bar chart.
   * Handles empty states, input validation, and error display.
   * 
   * @param monthlyData - Array of 12 monthly RSP values (Jan-Dec)
   * @param city - City name for chart title
   * @param fuelType - Fuel type for chart title
   * @param year - Year for chart title
   * 
   * @example
   * ```typescript
   * chart.updateChart([85, 87, 89, 91, 88, 86, 84, 82, 80, 78, 76, 74], 'Mumbai', 'petrol', 2023);
   * ```
   */
  updateChart(monthlyData: number[], city: string, fuelType: string, year: number) {
    try {
      if (!this.chart) {
        throw new Error('Chart not initialized');
      }

      // Handle empty state when no selections are made
      if (!city || !fuelType || !year || year === 0) {
        this.showEmptyState();
        return;
      }

      // Validate inputs
      if (!Array.isArray(monthlyData) || monthlyData.length !== 12) {
        throw new Error('Monthly data must be an array of 12 numbers');
      }

      if (typeof city !== 'string') {
        throw new Error('City must be a string');
      }

      if (typeof fuelType !== 'string') {
        throw new Error('Fuel type must be a string');
      }

      if (!Number.isInteger(year) || year < 2017 || year > 2025) {
        throw new Error('Year must be an integer between 2017 and 2025');
      }

      // Validate monthly data
      const validData = monthlyData.map(value => {
        if (typeof value !== 'number' || isNaN(value)) {
          return 0;
        }
        return Math.max(0, value); // Ensure non-negative values
      });

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const option = {
        title: {
          text: `Monthly Average RSP - ${city} (${fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}, ${year})`,
          left: 'center',
          top: '5%',
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2d3748',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(102, 126, 234, 0.1)'
            }
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#667eea',
          borderWidth: 1,
          borderRadius: 8,
          textStyle: {
            color: '#2d3748',
            fontSize: 14
          },
          formatter: (params: any) => {
            const data = params[0];
            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
                <div style="color: #667eea; font-size: 16px; font-weight: 600;">₹${data.value}</div>
              </div>
            `;
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: months,
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: '#e2e8f0'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e2e8f0'
            }
          },
          axisLabel: {
            fontSize: 12,
            color: '#718096',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }
        },
        yAxis: {
          type: 'value',
          name: 'RSP (₹)',
          nameLocation: 'middle',
          nameGap: 40,
          nameTextStyle: {
            color: '#718096',
            fontSize: 14,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          },
          axisLabel: {
            formatter: '₹{value}',
            fontSize: 12,
            color: '#718096',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          },
          axisLine: {
            lineStyle: {
              color: '#e2e8f0'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f7fafc',
              type: 'dashed'
            }
          }
        },
        series: [{
          name: 'Monthly RSP',
          type: 'bar',
          data: validData,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#667eea' },
                { offset: 1, color: '#764ba2' }
              ]
            },
            borderRadius: [6, 6, 0, 0],
            shadowBlur: 4,
            shadowColor: 'rgba(102, 126, 234, 0.3)'
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#5a67d8' },
                  { offset: 1, color: '#6b46c1' }
                ]
              },
              shadowBlur: 8,
              shadowColor: 'rgba(102, 126, 234, 0.5)'
            }
          },
          animationDelay: (idx: number) => idx * 80,
          animationEasing: 'elasticOut'
        }],
        animation: true,
        animationDuration: 1200,
        animationEasing: 'cubicOut' as const
      };

      this.chart.setOption(option, true);
    } catch (error) {
      console.error('Error updating chart:', error);
      this.showError('Error loading chart data');
    }
  }

  private showEmptyState() {
    if (!this.chart) return;
    
    this.chart.setOption({
      title: {
        text: 'Select City, Fuel Type, and Year to view RSP data',
        left: 'center',
        top: 'middle',
        textStyle: {
          fontSize: 18,
          color: '#666',
          fontWeight: 'normal'
        }
      },
      xAxis: {
        type: 'category',
        data: [],
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          fontSize: 12,
          color: '#666'
        }
      },
      yAxis: {
        type: 'value',
        name: 'RSP (₹)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: '₹{value}',
          fontSize: 12,
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0'
          }
        }
      },
      series: [],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    }, true); // true = notMerge, completely replace the chart
  }

  private showError(message: string) {
    if (!this.chart) return;
    
    this.chart.setOption({
      title: {
        text: message,
        left: 'center',
        top: 'middle',
        textStyle: {
          fontSize: 18,
          color: '#ff0000',
          fontWeight: 'bold'
        }
      },
      xAxis: {
        type: 'category',
        data: [],
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          fontSize: 12,
          color: '#666'
        }
      },
      yAxis: {
        type: 'value',
        name: 'RSP (₹)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: '₹{value}',
          fontSize: 12,
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0'
          }
        }
      },
      series: [],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    }, true); // true = notMerge, completely replace the chart
  }

  resize() {
    try {
      if (this.chart) {
        this.chart.resize();
      }
    } catch (error) {
      console.error('Error resizing chart:', error);
    }
  }

  dispose() {
    try {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    } catch (error) {
      console.error('Error disposing chart:', error);
    }
  }
}

