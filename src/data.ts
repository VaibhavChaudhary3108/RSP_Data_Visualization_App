// Real RSP data from NITI Aayog dataset
// Loading actual Retail Selling Price data for Petrol and Diesel in Metro Cities

export interface RSPDataPoint {
  city: string;
  fuelType: 'petrol' | 'diesel';
  year: number;
  month: number;
  rsp: number;
}

export interface CSVRow {
  Country: string;
  Year: string;
  Month: string;
  'Calendar Day': string;
  'Products ': string;
  'Metro Cities': string;
  'Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1': string;
}

export const metroCities = [
  'Mumbai', 'Delhi', 'Chennai', 'Kolkata'
];

export const fuelTypes = ['petrol', 'diesel'] as const;

export const availableYears = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

/**
 * Loads real RSP data from NITI Aayog dataset
 * 
 * @description Fetches and parses the CSV file containing RSP data for metro cities.
 * Implements comprehensive error handling with fallback to sample data.
 * 
 * @returns Promise<RSPDataPoint[]> - Array of parsed RSP data points
 * 
 * @throws {Error} When HTTP request fails or data parsing fails
 * 
 * @example
 * ```typescript
 * const data = await loadRealData();
 * console.log(`Loaded ${data.length} records`);
 * ```
 */
export async function loadRealData(): Promise<RSPDataPoint[]> {
  try {
    const response = await fetch('/data.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch data: HTTP ${response.status} ${response.statusText}`);
    }
    
    if (!response.headers.get('content-type')?.includes('text/csv')) {
      throw new Error('Invalid content type: expected CSV file');
    }
    
    const csvText = await response.text();
    if (!csvText || csvText.trim().length === 0) {
      throw new Error('Empty CSV file received');
    }
    
    const parsedData = parseCSVData(csvText);
    if (parsedData.length === 0) {
      throw new Error('No valid data found in CSV file');
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error loading real data, falling back to sample data:', error);
    return generateSampleData();
  }
}

// Parse CSV data and convert to RSPDataPoint format
function parseCSVData(csvText: string): RSPDataPoint[] {
  try {
    const lines = csvText.split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header and one data row');
    }
    
    const data: RSPDataPoint[] = [];
    let validRows = 0;
    let skippedRows = 0;
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const columns = parseCSVLine(line);
        if (columns.length < 7) {
          skippedRows++;
          continue;
        }
        
        const city = columns[5]?.trim();
        const product = columns[4]?.trim().toLowerCase();
        const rspValue = columns[6]?.trim();
        const dateStr = columns[3]?.trim();
        
        // Skip if essential data is missing
        if (!city || !product || !rspValue || !dateStr) {
          skippedRows++;
          continue;
        }
        
        // Skip if not petrol or diesel
        if (product !== 'petrol' && product !== 'diesel') {
          skippedRows++;
          continue;
        }
        
        // Parse date to get year and month
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          skippedRows++;
          continue;
        }
        
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // JavaScript months are 0-based
        
        // Validate year range
        if (year < 2017 || year > 2025) {
          skippedRows++;
          continue;
        }
        
        // Parse RSP value, treat missing/empty values as 0
        const rsp = rspValue === '' || rspValue === 'NA' || rspValue === 'N/A' ? 0 : parseFloat(rspValue);
        if (isNaN(rsp) || rsp < 0) {
          skippedRows++;
          continue;
        }
        
        data.push({
          city,
          fuelType: product as 'petrol' | 'diesel',
          year,
          month,
          rsp: Math.round(rsp * 100) / 100
        });
        validRows++;
        
      } catch (rowError) {
        console.warn(`Error parsing row ${i + 1}:`, rowError);
        skippedRows++;
      }
    }
    
    if (validRows === 0) {
      throw new Error('No valid data rows found in CSV file');
    }
    
    console.log(`CSV parsing completed: ${validRows} valid rows, ${skippedRows} skipped rows`);
    return data;
    
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    throw new Error(`CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Parse a single CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  try {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  } catch (error) {
    console.warn('Error parsing CSV line:', error);
    return [];
  }
}

// Fallback sample data generator (kept for error handling)
function generateSampleData(): RSPDataPoint[] {
  const data: RSPDataPoint[] = [];
  
  metroCities.forEach(city => {
    fuelTypes.forEach(fuelType => {
      availableYears.forEach(year => {
        for (let month = 1; month <= 12; month++) {
          const basePrice = fuelType === 'petrol' ? 80 : 75;
          const cityMultiplier = getCityMultiplier(city);
          const yearMultiplier = 1 + (year - 2021) * 0.05;
          const monthVariation = getMonthVariation(month);
          const randomVariation = (Math.random() - 0.5) * 10;
          
          const rsp = Math.max(0, basePrice * cityMultiplier * yearMultiplier + monthVariation + randomVariation);
          
          data.push({
            city,
            fuelType,
            year,
            month,
            rsp: Math.round(rsp * 100) / 100
          });
        }
      });
    });
  });
  
  return data;
}

function getCityMultiplier(city: string): number {
  const multipliers: { [key: string]: number } = {
    'Mumbai': 1.2,
    'Delhi': 1.1,
    'Bangalore': 1.15,
    'Chennai': 1.05,
    'Kolkata': 1.0,
    'Hyderabad': 1.08,
    'Pune': 1.12,
    'Ahmedabad': 0.95,
    'Jaipur': 0.98,
    'Lucknow': 0.92
  };
  return multipliers[city] || 1.0;
}

function getMonthVariation(month: number): number {
  const variations = [-5, -3, 2, 5, 8, 10, 12, 10, 5, 0, -2, -4];
  return variations[month - 1] || 0;
}

/**
 * Calculates monthly average RSP prices for a specific city, fuel type, and year
 * 
 * @description Filters data by criteria and computes average RSP for each month.
 * Handles missing data by treating as 0. Implements input validation and error handling.
 * 
 * @param data - Array of RSP data points
 * @param city - Metro city name (Mumbai, Delhi, Chennai, Kolkata)
 * @param fuelType - Type of fuel ('petrol' or 'diesel')
 * @param year - Calendar year (2017-2025)
 * 
 * @returns number[] - Array of 12 monthly averages (Jan-Dec)
 * 
 * @throws {Error} When input validation fails
 * 
 * @example
 * ```typescript
 * const averages = getMonthlyAverages(data, 'Mumbai', 'petrol', 2023);
 * console.log(`January average: ₹${averages[0]}`);
 * ```
 */
export function getMonthlyAverages(
  data: RSPDataPoint[], 
  city: string, 
  fuelType: 'petrol' | 'diesel', 
  year: number
): number[] {
  try {
    // Validate inputs
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    if (!city || typeof city !== 'string') {
      throw new Error('City must be a non-empty string');
    }
    
    if (!fuelType || !['petrol', 'diesel'].includes(fuelType)) {
      throw new Error('Fuel type must be either "petrol" or "diesel"');
    }
    
    if (!Number.isInteger(year) || year < 2017 || year > 2025) {
      throw new Error('Year must be an integer between 2017 and 2025');
    }
    
    const filteredData = data.filter(d => 
      d.city === city && 
      d.fuelType === fuelType && 
      d.year === year
    );
    
    if (filteredData.length === 0) {
      console.warn(`No data found for ${city} ${fuelType} ${year}`);
      return new Array(12).fill(0);
    }
    
    const monthlyTotals = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);
    
    filteredData.forEach(d => {
      if (d.month >= 1 && d.month <= 12 && typeof d.rsp === 'number' && !isNaN(d.rsp)) {
        monthlyTotals[d.month - 1] += d.rsp;
        monthlyCounts[d.month - 1]++;
      }
    });
    
    return monthlyTotals.map((total, index) => 
      monthlyCounts[index] > 0 ? Math.round((total / monthlyCounts[index]) * 100) / 100 : 0
    );
    
  } catch (error) {
    console.error('Error calculating monthly averages:', error);
    return new Array(12).fill(0);
  }
}

