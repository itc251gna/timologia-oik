
import { CsvData } from './csvParser';
import { supabase } from "@/integrations/supabase/client";

/**
 * Get table name for a specific year
 */
function getTableNameForYear(year: number): string {
  return year === 2025 ? 'vendors' : `vendors_${year}`;
}

/**
 * Get all data from Supabase database for a specific year
 * @param year - The year to fetch data for (defaults to 2025)
 * @returns Promise with array of CsvData
 */
export async function getData(year: number = 2025): Promise<CsvData[]> {
  try {
    const tableName = getTableNameForYear(year);
    console.log(`Fetching data from table: ${tableName} for year: ${year}`);
    
    // First, count total records using type assertion
    const { count, error: countError } = await supabase
      .from(tableName as 'vendors')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error(`Error counting records in ${tableName}:`, countError);
      throw countError;
    }
    
    console.log(`Total records in ${tableName}: ${count}`);
    
    // If we have more than 1000 records, fetch in chunks
    if (count && count > 1000) {
      return await fetchAllDataInChunks(tableName, count);
    }
    
    // Fetch all data with sorting by ΑΑ using type assertion
    const { data, error } = await supabase
      .from(tableName as 'vendors')
      .select('*')
      .order('ΑΑ', { ascending: true });
    
    if (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      throw error;
    }
    
    // Sort by ΑΑ as number for correct ordering
    const sortedData = data ? [...data].sort((a, b) => {
      const aaA = a.ΑΑ ? parseInt(a.ΑΑ) : 0;
      const aaB = b.ΑΑ ? parseInt(b.ΑΑ) : 0;
      return aaA - aaB;
    }) : [];
    
    return sortedData as unknown as CsvData[] || [];
  } catch (error) {
    console.error(`Error in getData for year ${year}:`, error);
    return [];
  }
}

/**
 * Search for data based on AFM and kod_prom for a specific year
 * @param afm - AFM to search for
 * @param kod_prom - Kod_prom to search for
 * @param year - The year to search in (defaults to 2025)
 * @returns Promise with array of matching CsvData
 */
export async function searchData(afm: string, kod_prom: string, year: number = 2025): Promise<CsvData[]> {
  try {
    const tableName = getTableNameForYear(year);
    console.log(`Searching in table: ${tableName} for year: ${year}`);
    
    // Use type assertion for dynamic table access
    let { data, error } = await supabase
      .from(tableName as 'vendors')
      .select('*')
      .eq('afm', afm)
      .eq('kod_prom', kod_prom);
    
    if (error) {
      console.error(`Error searching data in ${tableName}:`, error);
      throw error;
    }
    
    return data as unknown as CsvData[] || [];
  } catch (error) {
    console.error(`Error in searchData for year ${year}:`, error);
    return [];
  }
}

/**
 * Search for data by AFM and Kod_prom across all available years
 * @param afm - AFM to search for
 * @param kod_prom - Kod_prom to search for
 * @returns Promise with object containing results grouped by year
 */
export async function searchByAFMAndKodPromAcrossYears(afm: string, kod_prom: string): Promise<{ [year: number]: CsvData[] }> {
  try {
    console.log(`Searching AFM ${afm} and Kod_prom ${kod_prom} across all years`);
    
    // First get all available years
    const { data: yearsData, error: yearsError } = await supabase
      .from('years')
      .select('year, table_name')
      .order('year', { ascending: false });
    
    if (yearsError) {
      console.error('Error fetching available years:', yearsError);
      throw yearsError;
    }
    
    const results: { [year: number]: CsvData[] } = {};
    
    // Search in each year's table
    for (const yearData of yearsData || []) {
      const { year, table_name } = yearData;
      
      try {
        console.log(`Searching AFM ${afm} and Kod_prom ${kod_prom} in year ${year} (table: ${table_name})`);
        
        const { data, error } = await supabase
          .from(table_name as 'vendors')
          .select('*')
          .eq('afm', afm)
          .eq('kod_prom', kod_prom)
          .order('ΑΑ', { ascending: true });
        
        if (error) {
          console.error(`Error searching in ${table_name}:`, error);
          results[year] = [];
        } else {
          results[year] = (data as unknown as CsvData[]) || [];
          console.log(`Found ${results[year].length} records for AFM ${afm} and Kod_prom ${kod_prom} in year ${year}`);
        }
      } catch (yearError) {
        console.error(`Error processing year ${year}:`, yearError);
        results[year] = [];
      }
    }
    
    const totalResults = Object.values(results).reduce((sum, yearResults) => sum + yearResults.length, 0);
    console.log(`Total search results for AFM ${afm} and Kod_prom ${kod_prom}: ${totalResults} records across ${Object.keys(results).length} years`);
    
    return results;
  } catch (error) {
    console.error(`Error in searchByAFMAndKodPromAcrossYears for AFM ${afm} and Kod_prom ${kod_prom}:`, error);
    return {};
  }
}

/**
 * Search for data by AFM across all available years
 * @param afm - AFM to search for
 * @returns Promise with object containing results grouped by year
 */
export async function searchByAFMAcrossYears(afm: string): Promise<{ [year: number]: CsvData[] }> {
  try {
    console.log(`Searching AFM ${afm} across all years`);
    
    // First get all available years
    const { data: yearsData, error: yearsError } = await supabase
      .from('years')
      .select('year, table_name')
      .order('year', { ascending: false });
    
    if (yearsError) {
      console.error('Error fetching available years:', yearsError);
      throw yearsError;
    }
    
    const results: { [year: number]: CsvData[] } = {};
    
    // Search in each year's table
    for (const yearData of yearsData || []) {
      const { year, table_name } = yearData;
      
      try {
        console.log(`Searching AFM ${afm} in year ${year} (table: ${table_name})`);
        
        const { data, error } = await supabase
          .from(table_name as 'vendors')
          .select('*')
          .eq('afm', afm)
          .order('ΑΑ', { ascending: true });
        
        if (error) {
          console.error(`Error searching in ${table_name}:`, error);
          results[year] = [];
        } else {
          results[year] = (data as unknown as CsvData[]) || [];
          console.log(`Found ${results[year].length} records for AFM ${afm} in year ${year}`);
        }
      } catch (yearError) {
        console.error(`Error processing year ${year}:`, yearError);
        results[year] = [];
      }
    }
    
    const totalResults = Object.values(results).reduce((sum, yearResults) => sum + yearResults.length, 0);
    console.log(`Total search results for AFM ${afm}: ${totalResults} records across ${Object.keys(results).length} years`);
    
    return results;
  } catch (error) {
    console.error(`Error in searchByAFMAcrossYears for AFM ${afm}:`, error);
    return {};
  }
}

// Helper function for chunked data fetching
async function fetchAllDataInChunks(tableName: string, totalCount: number): Promise<CsvData[]> {
  const chunkSize = 1000;
  const chunks = Math.ceil(totalCount / chunkSize);
  const allData: CsvData[] = [];
  
  console.log(`Fetching ${totalCount} records from ${tableName} in ${chunks} chunks of ${chunkSize}`);
  
  for (let i = 0; i < chunks; i++) {
    const from = i * chunkSize;
    const to = from + chunkSize - 1;
    
    console.log(`Fetching chunk ${i+1}/${chunks} (records ${from}-${to}) from ${tableName}`);
    
    try {
      // Use type assertion for dynamic table access
      const { data, error } = await supabase
        .from(tableName as 'vendors')
        .select('*')
        .range(from, to)
        .order('ΑΑ', { ascending: true });
      
      if (error) {
        console.error(`Error fetching chunk ${i+1} from ${tableName}:`, error);
        continue;
      }
      
      if (data) {
        allData.push(...(data as unknown as CsvData[]));
        console.log(`Retrieved ${data.length} records in chunk ${i+1} from ${tableName}`);
      }
    } catch (chunkError) {
      console.error(`Error processing chunk ${i+1} for ${tableName}:`, chunkError);
      continue;
    }
  }
  
  // Sort by ΑΑ
  const sortedData = [...allData].sort((a, b) => {
    const aaA = a.ΑΑ ? parseInt(a.ΑΑ) : 0;
    const aaB = b.ΑΑ ? parseInt(b.ΑΑ) : 0;
    return aaA - aaB;
  });
  
  console.log(`Total retrieved ${sortedData.length} records from ${tableName}`);
  return sortedData;
}
