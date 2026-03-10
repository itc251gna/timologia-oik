
import { CsvData } from './csvParser';
import { supabase } from "@/integrations/supabase/client";
import { isAuthenticated } from './auth';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get table name for a specific year
 */
function getTableNameForYear(year: number): string {
  return year === 2025 ? 'vendors' : `vendors_${year}`;
}

/**
 * Get truncate function name for a specific year
 */
function getTruncateFunctionName(year: number): string {
  return year === 2025 ? 'truncate_vendors_table' : `truncate_vendors_${year}_table`;
}

/**
 * Save data to Supabase for a specific year
 * @param data - Array of CsvData to save
 * @param year - The year to save data for (defaults to 2025)
 * @returns Promise resolving when save is complete
 */
export async function saveData(data: CsvData[], year: number = 2025): Promise<void> {
  try {
    const tableName = getTableNameForYear(year);
    console.log(`Saving data to table: ${tableName} for year: ${year}`);
    
    // Convert data to format suitable for Supabase
    const vendorRecords = data.map(item => {
      return {
        id: uuidv4(),
        ΑΑ: item.ΑΑ || '',
        afm: item.afm,
        kod_prom: item.kod_prom,
        foreas: item.foreas,
        etos: item.etos,
        katigoria: item.katigoria,
        ar_ent: item.ar_ent,
        st_ent: item.st_ent,
        eponymia: item.eponymia,
        im_exoflisis: item.im_exoflisis,
        ar_parastatikou: item.ar_parastatikou,
        im_parastatikou: item.im_parastatikou,
        synoliki_axi: item.synoliki_axi,
        foros_3: item.foros_3,
        foros_4: item.foros_4,
        foros_8: item.foros_8,
        foros_20: item.foros_20,
        synolo_kratiseon: item.synolo_kratiseon,
        plirotea_axia: item.plirotea_axia,
        dikaiouxos_plir: item.dikaiouxos_plir
      };
    });
    
    // First clear the table to avoid conflicts
    await clearDatabaseBeforeInsert(year);
    
    // For large datasets, use chunked saving
    await insertDataInChunks(vendorRecords, tableName);
    
    return;
  } catch (error) {
    console.error(`Error saving data for year ${year}:`, error);
    throw error;
  }
}

/**
 * Clear all data in the Supabase database for a specific year
 * @param year - The year to clear data for (defaults to 2025)
 * @returns Promise resolving when clear is complete
 */
export async function clearData(year: number = 2025): Promise<void> {
  try {
    const tableName = getTableNameForYear(year);
    const truncateFunctionName = getTruncateFunctionName(year);
    
    console.log(`Clearing data from table: ${tableName} for year: ${year}`);
    
    // Get total records for confirmation using type assertion
    const { count } = await supabase
      .from(tableName as 'vendors')
      .select('*', { count: 'exact', head: true });
    
    console.log(`Attempting to delete ${count} records from ${tableName}...`);
    
    // Try truncate function first for efficiency
    try {
      const { error: truncateError } = await supabase.rpc(truncateFunctionName as 'truncate_vendors_table', {});
      
      if (truncateError) {
        console.error(`Error with truncate operation for ${tableName}:`, truncateError);
        
        // Fallback to direct deletion if truncate fails
        const { error: deleteError } = await supabase
          .from(tableName as 'vendors')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (deleteError) {
          console.error(`Error clearing data from ${tableName}:`, deleteError);
          throw deleteError;
        }
      }
      
      console.log(`Successfully cleared data from ${tableName}`);
    } catch (rpcError) {
      console.error(`RPC function ${truncateFunctionName} not available, using direct deletion:`, rpcError);
      
      // Direct deletion as fallback
      const { error: deleteError } = await supabase
        .from(tableName as 'vendors')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (deleteError) {
        console.error(`Error clearing data from ${tableName}:`, deleteError);
        throw deleteError;
      }
      
      console.log(`Successfully cleared data from ${tableName} using direct deletion`);
    }
    
  } catch (error) {
    console.error(`Error in clearData for year ${year}:`, error);
    throw error;
  }
}

/**
 * Helper function to clear database before insert
 */
async function clearDatabaseBeforeInsert(year: number): Promise<void> {
  try {
    const truncateFunctionName = getTruncateFunctionName(year);
    
    console.log(`Clearing table before inserting new data for year ${year}...`);
    
    try {
      const { error: truncateError } = await supabase.rpc(truncateFunctionName as 'truncate_vendors_table', {});
      if (truncateError) {
        console.error(`Error clearing table for year ${year}:`, truncateError);
        // Continue despite error
      } else {
        console.log(`Table cleared successfully for year ${year}, adding new data...`);
      }
    } catch (truncateErr) {
      console.error(`Error calling ${truncateFunctionName}:`, truncateErr);
    }
  } catch (error) {
    console.error(`Error in clearDatabaseBeforeInsert for year ${year}:`, error);
  }
}

/**
 * Helper function to insert data in chunks
 * @param vendorRecords - Array of vendor records to insert
 * @param tableName - Name of the table to insert into
 */
async function insertDataInChunks(vendorRecords: any[], tableName: string): Promise<void> {
  const chunkSize = 100;
  let successCount = 0;
  let failedRecords: { record: any, error: any }[] = [];
  const totalCount = vendorRecords.length;
  
  console.log(`Dividing ${totalCount} records for ${tableName} into chunks of ${chunkSize}`);
  
  for (let i = 0; i < vendorRecords.length; i += chunkSize) {
    const chunk = vendorRecords.slice(i, i + chunkSize);
    const chunkNumber = Math.floor(i / chunkSize) + 1;
    const totalChunks = Math.ceil(vendorRecords.length / chunkSize);
    
    try {
      console.log(`Saving chunk ${chunkNumber}/${totalChunks} (${chunk.length} records) to ${tableName}...`);
      
      // Use type assertion for dynamic table access
      const { data: insertedData, error } = await supabase
        .from(tableName as 'vendors')
        .insert(chunk)
        .select('id, "ΑΑ"');
      
      if (error) {
        console.error(`Error saving chunk ${chunkNumber}/${totalChunks} to ${tableName}:`, error);
        
        // If failed, try with smaller chunks
        await processFailedChunk(chunk, successCount, failedRecords, tableName);
      } else {
        const addedCount = insertedData?.length || 0;
        successCount += addedCount;
        console.log(`Successfully saved chunk ${chunkNumber}/${totalChunks} to ${tableName}: ${addedCount} records (Total: ${successCount}/${totalCount})`);
      }
    } catch (chunkError) {
      console.error(`General error processing chunk ${chunkNumber} for ${tableName}:`, chunkError);
    }
    
    // Pause between chunks to avoid API overload
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Progress update
    console.log(`Progress for ${tableName}: ${Math.min(successCount, totalCount)}/${totalCount} records (${(Math.min(successCount, totalCount)/totalCount*100).toFixed(1)}%)`);
  }
  
  if (failedRecords.length > 0) {
    console.log(`Failed to save ${failedRecords.length} records to ${tableName}. First 5 failures:`);
    failedRecords.slice(0, 5).forEach(({ record, error }) => {
      console.log(`ΑΑ: ${record.ΑΑ}, AFM: ${record.afm}, Error:`, error);
    });
  }
  
  console.log(`Completion for ${tableName}! Saved ${successCount} of ${totalCount} records`);
}

/**
 * Helper function to process failed chunks with smaller batch sizes
 */
async function processFailedChunk(chunk: any[], successCount: number, failedRecords: { record: any, error: any }[], tableName: string): Promise<void> {
  console.log(`Trying with smaller chunks for ${tableName}...`);
  
  const smallerChunkSize = 10;
  
  for (let j = 0; j < chunk.length; j += smallerChunkSize) {
    const smallerChunk = chunk.slice(j, j + smallerChunkSize);
    
    try {
      // Use type assertion for dynamic table access
      const { data: smallData, error: smallError } = await supabase
        .from(tableName as 'vendors')
        .insert(smallerChunk)
        .select('id, "ΑΑ"');
      
      if (smallError) {
        console.error(`Error saving smaller chunk ${j/smallerChunkSize + 1} to ${tableName}:`, smallError);
        
        // If still fails, try individual records
        await processIndividualRecords(smallerChunk, successCount, failedRecords, tableName);
      } else {
        const addedCount = smallData?.length || 0;
        successCount += addedCount;
        console.log(`Successfully saved ${addedCount} records from smaller chunk to ${tableName}`);
      }
    } catch (smallChunkError) {
      console.error(`Error processing smaller chunk for ${tableName}:`, smallChunkError);
    }
    
    // Small pause between smaller chunks
    await new Promise(resolve => setTimeout(resolve, 25));
  }
}

/**
 * Helper function to process individual records
 */
async function processIndividualRecords(smallerChunk: any[], successCount: number, failedRecords: { record: any, error: any }[], tableName: string): Promise<void> {
  console.log(`Trying individual record saving for ${tableName}...`);
  const totalCount = smallerChunk.length;
  
  for (const record of smallerChunk) {
    try {
      // Use type assertion for dynamic table access
      const { data: singleData, error: singleError } = await supabase
        .from(tableName as 'vendors')
        .insert([record])
        .select('id, "ΑΑ"');
      
      if (singleError) {
        console.error(`Error saving record with ΑΑ=${record.ΑΑ} to ${tableName}:`, singleError);
        failedRecords.push({ record, error: singleError });
      } else {
        successCount++;
        if (successCount % 100 === 0) {
          console.log(`Progress for ${tableName}: ${successCount}/${totalCount} records (${(successCount/totalCount*100).toFixed(1)}%)`);
        }
      }
    } catch (singleRecordError) {
      console.error(`Error saving individual record to ${tableName}:`, singleRecordError);
      failedRecords.push({ record, error: singleRecordError });
    }
    
    // Small pause between records to avoid overload
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}
