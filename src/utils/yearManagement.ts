
import { supabase } from "@/integrations/supabase/client";

export interface YearData {
  year: number;
  table_name: string;
  is_active: boolean;
}

/**
 * Get all available years from the database
 */
export async function getAvailableYears(): Promise<YearData[]> {
  try {
    const { data, error } = await supabase.rpc('get_available_years');
    
    if (error) {
      console.error('Error fetching available years:', error);
      throw new Error(`Σφάλμα ανάκτησης ετών: ${error.message}`);
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Error in getAvailableYears:', error);
    if (error.message && !error.message.includes('Σφάλμα ανάκτησης ετών:')) {
      throw new Error(`Σφάλμα ανάκτησης ετών: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Create a new year and its corresponding table
 */
export async function createNewYear(year: number): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('create_vendor_table_for_year', {
      year_input: year
    });
    
    if (error) {
      console.error('Error creating new year:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('already exists')) {
        throw new Error(`Το έτος ${year} υπάρχει ήδη`);
      } else if (error.message?.includes('permission denied')) {
        throw new Error('Δεν έχετε δικαιώματα για αυτή την ενέργεια');
      } else {
        throw new Error(`Σφάλμα δημιουργίας έτους: ${error.message}`);
      }
    }
    
    return data || '';
  } catch (error: any) {
    console.error('Error in createNewYear:', error);
    if (error.message && !error.message.includes('Σφάλμα δημιουργίας έτους:')) {
      throw new Error(`Σφάλμα δημιουργίας έτους: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Delete a year and its corresponding table
 */
export async function deleteYear(year: number): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('delete_vendor_table_for_year', {
      year_input: year
    });
    
    if (error) {
      console.error('Error deleting year:', error);
      
      // Provide more specific error messages based on the error type
      if (error.message?.includes('does not exist')) {
        throw new Error(`Το έτος ${year} δεν υπάρχει`);
      } else if (error.message?.includes('Cannot delete the main vendors table')) {
        throw new Error(`Δεν μπορείτε να διαγράψετε το κύριο έτος ${year}`);
      } else if (error.message?.includes('permission denied')) {
        throw new Error('Δεν έχετε δικαιώματα για αυτή την ενέργεια');
      } else if (error.message?.includes('format')) {
        throw new Error('Σφάλμα στη μορφοποίηση δεδομένων - παρακαλώ επικοινωνήστε με τον διαχειριστή');
      } else {
        throw new Error(`Σφάλμα διαγραφής έτους: ${error.message}`);
      }
    }
    
    return data || '';
  } catch (error: any) {
    console.error('Error in deleteYear:', error);
    if (error.message && !error.message.includes('Σφάλμα διαγραφής έτους:')) {
      throw new Error(`Σφάλμα διαγραφής έτους: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get the most recent year
 */
export async function getMostRecentYear(): Promise<number> {
  try {
    const years = await getAvailableYears();
    if (years.length === 0) return 2025;
    return Math.max(...years.map(y => y.year));
  } catch (error: any) {
    console.error('Error getting most recent year:', error);
    return 2025;
  }
}
