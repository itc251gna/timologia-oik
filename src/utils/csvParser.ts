
import { 
  columnPatterns, 
  looksLikeDate, 
  looksLikeInvoiceNumber,
  looksLikeMoney,
  columnContainsMostlyDates,
  columnContainsMostlyInvoiceNumbers
} from '@/utils/columnUtils';

export interface CsvData {
  id: string;
  ΑΑ?: string;
  foreas?: string;
  etos?: string;
  katigoria?: string;
  ar_ent?: string;
  st_ent?: string;
  kod_prom: string;
  eponymia?: string;
  afm: string;
  im_exoflisis?: string;
  ar_parastatikou?: string;
  im_parastatikou?: string;
  synoliki_axi?: string;
  foros_3?: string;
  foros_4?: string;
  foros_8?: string;
  foros_20?: string;
  synolo_kratiseon?: string;
  plirotea_axia?: string;
  dikaiouxos_plir?: string;  // Added this field to store "Δικαιούχος Πληρ." data
  [key: string]: string | undefined;
}

// Define the expected CSV headers in an array with the correct order
const CSV_HEADERS = [
  'id', 'foreas', 'etos', 'katigoria', 'ar_ent', 'st_ent', 
  'kod_prom', 'eponymia', 'afm', 'im_exoflisis', 'dikaiouxos_plir', 'ar_parastatikou', 
  'im_parastatikou', 'synoliki_axi', 'foros_3', 'foros_4', 'foros_8', 
  'foros_20', 'synolo_kratiseon', 'plirotea_axia'
];

// Updated mappings for Greek column headers to our expected headers
const HEADER_MAPPINGS: Record<string, string> = {
  // Lowercase Greek to English field mappings
  'φορέας': 'foreas',
  'έτος': 'etos',
  'κατηγ.': 'katigoria',
  'αρ. εντάλματος': 'ar_ent',
  'στ. εντάλμ': 'st_ent',
  'κωδ.προμηθευτή': 'kod_prom',
  'επωνυμία': 'eponymia',
  'α.φ.μ': 'afm',
  'ημ.εξόφλησ': 'im_exoflisis',
  'δικαιούχος πληρ.': 'dikaiouxos_plir',  
  'δικαιούχος πληρ': 'dikaiouxos_plir',
  
  // Specifically fixed these key mappings for invoice data
  'αρ. παραστατικού': 'ar_parastatikou',
  'αριθμός παραστατικού': 'ar_parastatikou',
  'αριθμόσ παραστατικού': 'ar_parastatikou',
  'αρ. παρ.': 'ar_parastatikou',
  'αριθμός παρ.': 'ar_parastatikou',
  
  'ημ/νία παραστ/κού': 'im_parastatikou',
  'ημ/νία παραστατικού': 'im_parastatikou',
  'ημερομηνία παραστατικού': 'im_parastatikou',
  'ημ/νία παρ.': 'im_parastatikou',
  'ημ. παρ.': 'im_parastatikou',
  'ημερομηνία παρ.': 'im_parastatikou',
  
  // Other field mappings
  'συνολική αξία': 'synoliki_axi',
  'συν. αξία': 'synoliki_axi',
  
  // NEW AND IMPROVED TAX MAPPINGS with multiple variations
  // Φόρος 3% variations
  'φοροσ (3%)': 'foros_3',
  'φόρος (3%)': 'foros_3',
  'φοροσ 3%': 'foros_3',
  'φόρος 3%': 'foros_3',
  'φόρος 3': 'foros_3',
  'φοροσ 3': 'foros_3',
  'φ 3%': 'foros_3',
  'φπα 3%': 'foros_3',
  '3%': 'foros_3',
  
  // Φόρος 4% variations
  'φοροσ (4%)': 'foros_4',
  'φόρος (4%)': 'foros_4',
  'φοροσ 4%': 'foros_4',
  'φόρος 4%': 'foros_4',
  'φόρος 4': 'foros_4',
  'φοροσ 4': 'foros_4',
  'φ 4%': 'foros_4',
  'φπα 4%': 'foros_4',
  '4%': 'foros_4',
  
  // Φόρος 8% variations
  'φοροσ (8%)': 'foros_8',
  'φόρος (8%)': 'foros_8',
  'φοροσ 8%': 'foros_8',
  'φόρος 8%': 'foros_8',
  'φόρος 8': 'foros_8',
  'φοροσ 8': 'foros_8',
  'φ 8%': 'foros_8',
  'φπα 8%': 'foros_8',
  '8%': 'foros_8',
  
  // Φόρος 20% variations
  'φοροσ (20%)': 'foros_20',
  'φόρος (20%)': 'foros_20',
  'φοροσ 20%': 'foros_20',
  'φόρος 20%': 'foros_20',
  'φόρος 20': 'foros_20',
  'φοροσ 20': 'foros_20',
  'φ 20%': 'foros_20',
  'φπα 20%': 'foros_20',
  '20%': 'foros_20',
  
  'σύνολο κρατήσεων': 'synolo_kratiseon',
  'πληρωτέα αξία': 'plirotea_axia'
};

// Helper function to validate and potentially swap invoice fields
function validateAndFixInvoiceFields(record: Partial<CsvData>): void {
  // Skip validation if either field is missing
  if (!record.ar_parastatikou || !record.im_parastatikou) return;
  
  const invoiceNumber = record.ar_parastatikou.trim();
  const invoiceDate = record.im_parastatikou.trim();
  
  // Detect potential swapped values based on content analysis
  const numberLooksLikeDate = looksLikeDate(invoiceNumber);
  const dateLooksLikeInvoiceNumber = looksLikeInvoiceNumber(invoiceDate);
  
  // If values appear to be swapped, swap them
  if (numberLooksLikeDate && dateLooksLikeInvoiceNumber) {
    console.log(`Swapping invoice fields: "${invoiceNumber}" ↔ "${invoiceDate}"`);
    // Swap the values
    const temp = record.ar_parastatikou;
    record.ar_parastatikou = record.im_parastatikou;
    record.im_parastatikou = temp;
  }
  // Additional check: if only invoice number looks like a date but date doesn't look like an invoice number
  else if (numberLooksLikeDate && !looksLikeInvoiceNumber(invoiceNumber)) {
    console.log(`Only invoice number "${invoiceNumber}" looks like a date, swapping anyway`);
    const temp = record.ar_parastatikou;
    record.ar_parastatikou = record.im_parastatikou;
    record.im_parastatikou = temp;
  }
}

export function filterNewRecords(newRecords: CsvData[], existingRecords: CsvData[]): CsvData[] {
  if (!existingRecords.length) {
    return newRecords;
  }
  
  // Create a Set of unique identifiers from existing records for quick lookup
  // We'll use ALL fields to make the uniqueness check more robust
  const existingKeys = new Set(
    existingRecords.map(record => 
      JSON.stringify({
        afm: record.afm,
        kod_prom: record.kod_prom,
        ar_parastatikou: record.ar_parastatikou,
        im_parastatikou: record.im_parastatikou,
        synoliki_axi: record.synoliki_axi
      })
    )
  );
  
  // Filter the new records to only include those that don't exist yet
  return newRecords.filter(record => {
    const recordKey = JSON.stringify({
      afm: record.afm,
      kod_prom: record.kod_prom,
      ar_parastatikou: record.ar_parastatikou,
      im_parastatikou: record.im_parastatikou,
      synoliki_axi: record.synoliki_axi
    });
    
    return !existingKeys.has(recordKey);
  });
}

export async function validateCSV(file: File): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    // Check file extension first
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    // If it's XML, we'll do a special validation for XML Excel format
    if (fileExt === 'xml') {
      console.log('Validating XML file...');
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          const content = e.target.result;
          
          // Check if content is empty
          if (!content.trim()) {
            console.error('XML file is empty');
            resolve(false);
            return;
          }
          
          // Check if this is an Excel XML format
          if (content.includes('xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"') ||
              content.includes('urn:schemas-microsoft-com:office:excel')) {
            console.log('Excel XML format detected');
            
            // Check for basic table structure
            if (content.includes('<Table') && content.includes('<Row') && content.includes('<Cell')) {
              console.log('XML contains table with rows and cells - valid format');
              resolve(true);
              return;
            }
          }
          
          // If we reach here for XML but can't confirm Excel format, we'll try more general XML validation
          try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(content, "text/xml");
            const parserError = xmlDoc.querySelector('parsererror');
            
            if (parserError) {
              console.error('XML parsing error:', parserError.textContent);
              resolve(false);
              return;
            }
            
            console.log('XML is well-formed, assuming it has valid data');
            resolve(true);
          } catch (error) {
            console.error('Error parsing XML:', error);
            resolve(false);
          }
        } else {
          console.error('Failed to read XML file');
          resolve(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading XML file:', error);
        resolve(false);
      };
      
      reader.readAsText(file, 'UTF-8');
      return;
    }
    
    // Original CSV validation logic
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        const content = e.target.result;
        
        // Check if content is empty
        if (!content.trim()) {
          console.error('File is empty');
          resolve(false);
          return;
        }
        
        // Detect if content looks like CSV (contains semicolons)
        if (content.includes(';')) {
          // Get first line
          const lines = content.split('\n');
          if (lines.length === 0) {
            console.error('File has no lines');
            resolve(false);
            return;
          }
          
          const firstLine = lines[0].trim();
          
          // Validate headers - split by semicolon since we're using Greek CSV format
          const headers = firstLine.split(';').map(h => h.trim().toLowerCase());
          
          console.log('File headers:', headers);
          console.log('Expected headers:', CSV_HEADERS);
          
          if (headers.length < 15) { // Require at least 15 out of 19 expected fields
            console.error(`Expected at least 15 headers, got ${headers.length}`);
            resolve(false);
            return;
          }
          
          // Check if most of the required headers are present (either direct match or via mappings)
          let foundHeaders = 0;
          
          for (const header of headers) {
            // Check direct match with our English header names
            if (CSV_HEADERS.includes(header)) {
              foundHeaders++;
              continue;
            }
            
            // Check if it matches one of our Greek mappings
            if (HEADER_MAPPINGS[header]) {
              foundHeaders++;
              continue;
            }
          }
          
          // If we found at least 70% of expected headers, consider it valid
          const requiredCount = Math.floor(CSV_HEADERS.length * 0.7);
          const isValid = foundHeaders >= requiredCount;
          
          console.log(`Found ${foundHeaders} of ${CSV_HEADERS.length} expected headers, required: ${requiredCount}`);
          console.log('Headers validation result:', isValid);
          resolve(isValid);
          return;
        }
        
        // If we get here, it's not a CSV format
        console.error('File does not appear to be CSV format');
        resolve(false);
      } else {
        console.error('Failed to read file');
        resolve(false);
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      resolve(false);
    };
    
    // For CSV files, use ISO-8859-7 encoding which is common for Greek
    reader.readAsText(file, 'ISO-8859-7');
  });
}

export function detectFileFormat(content: string): 'csv' | 'xml' | 'unknown' {
  // Trim content to avoid whitespace issues
  const trimmed = content.trim();
  
  // Check if it's Excel XML format
  if (trimmed.includes('xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"') ||
      trimmed.includes('urn:schemas-microsoft-com:office:excel')) {
    return 'xml';
  }
  
  // Check if it looks like CSV (contains semicolons or commas as separators)
  if (trimmed.includes(';') && trimmed.split('\n')[0].includes(';')) {
    return 'csv';
  }
  
  // Check if it looks like XML
  if (trimmed.startsWith('<?xml') || (trimmed.startsWith('<') && trimmed.endsWith('>'))) {
    return 'xml';
  }
  
  return 'unknown';
}

export function parseCSV(csvContent: string): CsvData[] {
  try {
    console.log('Starting CSV parsing with ISO8859-7 support...');
    console.log('CSV Content Length:', csvContent.length);
    
    // Show sample of content for debugging
    console.log('CSV Content Sample:', csvContent.substring(0, 200));
    
    // Trim and split lines, removing any empty lines
    const lines = csvContent.trim().split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 1) {
      console.error('CSV must have at least a header row');
      return [];
    }
    
    // Get headers from the first line
    const headers = lines[0].split(';').map(header => header.trim());
    
    console.log('Detected Headers:', headers);
    
    // Validate headers - make case-insensitive comparison
    const normalizedHeaders = headers.map(h => h.toLowerCase());
    const normalizedExpectedHeaders = CSV_HEADERS.map(h => h.toLowerCase());
    
    const missingHeaders = normalizedExpectedHeaders.filter(header => !normalizedHeaders.includes(header));
    if (missingHeaders.length > 0) {
      console.error('Missing required headers:', missingHeaders);
      console.log('Will try to continue anyway and match by position');
    }
    
    // If there's only a header row, return empty array
    if (lines.length < 2) {
      console.log('CSV has only a header row, no data rows');
      return [];
    }
    
    // Parse remaining lines
    const parsedRecords = lines.slice(1)
      .map((line, index) => {
        // Skip empty lines
        if (line.trim() === '') return null;
        
        const values = line.split(';').map(value => value.trim());
        
        // Print a sample row with values for debugging
        if (index === 0) {
          console.log('Sample Row Values:', values);
        }
        
        // Skip lines with not enough fields
        if (values.length < CSV_HEADERS.length) {
          console.error(`Line ${index + 2} has ${values.length} fields, expected ${CSV_HEADERS.length}:`, line);
          return null;
        }
        
        const record: Partial<CsvData> = {};
        
        // First try to match headers to values
        normalizedHeaders.forEach((header, idx) => {
          // Check if this is one of our expected headers
          let fieldName = null;
          
          // Direct match with our English header names
          if (CSV_HEADERS.includes(header)) {
            fieldName = header;
          } 
          // Check if it matches one of our Greek mappings
          else if (HEADER_MAPPINGS[header]) {
            fieldName = HEADER_MAPPINGS[header];
          }
          
          if (fieldName && idx < values.length) {
            let value = values[idx] || '';
            try {
              // Try to clean any potential encoding issues
              value = decodeURIComponent(encodeURIComponent(value));
            } catch (e) {
              // If decoding fails, keep the original value
              console.warn(`Failed to decode value: ${value}`, e);
            }
            (record as Record<string, string>)[fieldName] = value;
          }
        });
        
        // Fallback - map each value to its corresponding header position
        CSV_HEADERS.forEach((header, idx) => {
          if (!(header in record) && idx < values.length) {
            let value = values[idx] || '';
            try {
              value = decodeURIComponent(encodeURIComponent(value));
            } catch (e) {
              console.warn(`Failed to decode value: ${value}`, e);
            }
            (record as Record<string, string>)[header] = value;
          } else if (!(header in record)) {
            (record as Record<string, string>)[header] = '';
          }
        });
        
        // REMOVED: The validateAndFixInvoiceFields call that was causing problems
        // No more swapping of invoice fields
        
        return record as CsvData;
      })
      .filter((record): record is CsvData => record !== null);
    
    console.log(`Successfully parsed ${parsedRecords.length} records`);
    
    // Log a sample parsed record
    if (parsedRecords.length > 0) {
      console.log('Sample Parsed Record:', parsedRecords[0]);
    }
    
    return parsedRecords;
  } catch (error) {
    console.error('Detailed CSV Parsing Error:', error);
    return [];
  }
}

export function iso88597ToUtf8(binaryContent: string): string {
  try {
    console.log('Starting ISO-8859-7 to UTF-8 conversion...');
    console.log('Binary Content Length:', binaryContent.length);
    console.log('Binary Content Sample:', binaryContent.substring(0, 100));
    
    // Create a mapping of ISO-8859-7 codes to UTF-8 characters
    const iso88597ToUtf8Map: Record<number, string> = {
      // Greek uppercase letters
      0xB6: 'Ά', 0xB8: 'Έ', 0xB9: 'Ή', 0xBA: 'Ί', 0xBC: 'Ό', 0xBE: 'Ύ', 0xBF: 'Ώ',
      0xC1: 'Α', 0xC2: 'Β', 0xC3: 'Γ', 0xC4: 'Δ', 0xC5: 'Ε', 0xC6: 'Ζ', 0xC7: 'Η',
      0xC8: 'Θ', 0xC9: 'Ι', 0xCA: 'Κ', 0xCB: 'Λ', 0xCC: 'Μ', 0xCD: 'Ν', 0xCE: 'Ξ',
      0xCF: 'Ο', 0xD0: 'Π', 0xD1: 'Ρ', 0xD3: 'Σ', 0xD4: 'Τ', 0xD5: 'Υ', 0xD6: 'Φ',
      0xD7: 'Χ', 0xD8: 'Ψ', 0xD9: 'Ω', 0xDA: 'Ϊ', 0xDB: 'Ϋ',
      
      // Greek lowercase letters
      0xDC: 'ά', 0xDD: 'έ', 0xDE: 'ή', 0xDF: 'ί', 0xE0: 'ΰ', 0xE1: 'α', 0xE2: 'β',
      0xE3: 'γ', 0xE4: 'δ', 0xE5: 'ε', 0xE6: 'ζ', 0xE7: 'η', 0xE8: 'θ', 0xE9: 'ι',
      0xEA: 'κ', 0xEB: 'λ', 0xEC: 'μ', 0xED: 'ν', 0xEE: 'ξ', 0xEF: 'ο', 0xF0: 'π',
      0xF1: 'ρ', 0xF2: 'ς', 0xF3: 'σ', 0xF4: 'τ', 0xF5: 'υ', 0xF6: 'φ', 0xF7: 'χ',
      0xF8: 'ψ', 0xF9: 'ω', 0xFA: 'ϊ', 0xFB: 'ϋ', 0xFC: 'ό', 0xFD: 'ύ', 0xFE: 'ώ'
    };
    
    let result = '';
    
    // Try multiple approaches to handle the encoding
    
    // First attempt: Direct character by character conversion
    for (let i = 0; i < binaryContent.length; i++) {
      const charCode = binaryContent.charCodeAt(i);
      
      if (charCode >= 0xB6 && charCode <= 0xFE) {
        // This is a Greek character
        if (iso88597ToUtf8Map[charCode]) {
          result += iso88597ToUtf8Map[charCode];
        } else {
          // Fallback for unmapped Greek chars
          console.warn(`Unmapped Greek character code: ${charCode.toString(16)}`);
          result += binaryContent.charAt(i);
        }
      } else if (charCode <= 0x7F) {
        // ASCII characters remain the same
        result += binaryContent.charAt(i);
      } else {
        // For all other characters, check if it could be a Greek character
        if (charCode > 128) {
          // Try to convert from Windows-1253 encoding (also used for Greek)
          const win1253ToUtf8Map: Record<number, string> = {
            0x80: '€', 0x82: '‚', 0x83: 'ƒ', 0x84: '„', 0x85: '…', 0x86: '†',
            0x87: '‡', 0x88: '‰', 0x89: '‰', 0x8B: '‹', 
            0x91: '\'',
            0x92: '\'', 
            0x93: '"', 0x94: '"', 0x95: '•', 0x96: '–', 0x97: '—', 0x99: '™',
            0x9B: '›', 0xA0: ' ', 0xA1: '΅', 0xA2: '΄', 0xA3: '£',
            0xA4: '¤', 0xA5: '¥', 0xA6: '¦', 0xA7: '§', 0xA8: '¨',
            0xA9: '©', 0xAB: '«', 0xAC: '¬', 0xAD: '­', 0xAE: '®',
            0xAF: '―', 0xB0: '°', 0xB1: '±', 0xB2: '²', 0xB3: '³',
            0xB4: '΄', 0xB5: 'µ', 0xB6: 'Ά', 0xB7: '·', 0xB8: 'Έ',
            0xB9: 'Ή', 0xBA: 'Ί', 0xBB: '»', 0xBC: 'Ό', 0xBD: '½',
            0xBE: 'Ύ', 0xBF: 'Ώ', 0xC0: 'ΐ', 0xC1: 'Α', 0xC2: 'Β',
            0xC3: 'Γ', 0xC4: 'Δ', 0xC5: 'Ε', 0xC6: 'Ζ', 0xC7: 'Η',
            0xC8: 'Θ', 0xC9: 'Ι', 0xCA: 'Κ', 0xCB: 'Λ', 0xCC: 'Μ',
            0xCD: 'Ν', 0xCE: 'Ξ', 0xCF: 'Ο', 0xD0: 'Π', 0xD1: 'Ρ',
            0xD3: 'Σ', 0xD4: 'Τ', 0xD5: 'Υ', 0xD6: '��', 0xD7: 'Χ',
            0xD8: 'Ψ', 0xD9: 'Ω', 0xDA: 'Ϊ', 0xDB: 'Ϋ', 0xDC: 'ά',
            0xDD: 'έ', 0xDE: 'ή', 0xDF: 'ί', 0xE0: 'ΰ', 0xE1: 'α',
            0xE2: 'β', 0xE3: 'γ', 0xE4: 'δ', 0xE5: 'ε', 0xE6: 'ζ',
            0xE7: 'η', 0xE8: 'θ', 0xE9: 'ι', 0xEA: 'κ', 0xEB: 'λ',
            0xEC: 'μ', 0xED: 'ν', 0xEE: 'ξ', 0xEF: 'ο', 0xF0: 'π',
            0xF1: 'ρ', 0xF2: 'ς', 0xF3: 'σ', 0xF4: 'τ', 0xF5: 'υ',
            0xF6: 'φ', 0xF7: 'χ', 0xF8: 'ψ', 0xF9: 'ω', 0xFA: 'ϊ',
            0xFB: 'ϋ', 0xFC: 'ό', 0xFD: 'ύ', 0xFE: 'ώ', 0xFF: '£'
          };
          
          if (win1253ToUtf8Map[charCode]) {
            result += win1253ToUtf8Map[charCode];
          } else {
            // If we can't map it, just keep the original
            console.warn(`Unmapped character code: ${charCode.toString(16)}`);
            result += binaryContent.charAt(i);
          }
        } else {
          // Just keep other characters
          result += binaryContent.charAt(i);
        }
      }
    }
    
    // Second attempt: try decodeURIComponent as a fallback
    if (!/[Α-Ωα-ω]/g.test(result)) {
      console.log('No Greek characters detected after initial conversion, trying decodeURIComponent...');
      try {
        // Try to decode as if it was percent-encoded
        const decoded = decodeURIComponent(encodeURIComponent(binaryContent));
        if (/[Α-Ωα-ω]/g.test(decoded)) {
          console.log('Found Greek characters after decodeURIComponent!');
          result = decoded;
        }
      } catch (e) {
        console.warn('decodeURIComponent attempt failed', e);
      }
    }
    
    console.log('Successfully converted to UTF-8');
    console.log('Converted Text Sample:', result.substring(0, 100));
    console.log('Contains Greek characters:', /[Α-Ωα-ω]/g.test(result));
    
    return result;
  } catch (error) {
    console.error('Detailed ISO-8859-7 Conversion Error:', error);
    return binaryContent;
  }
}

export function parseXML(xmlContent: string): CsvData[] {
  // First check if this is actually CSV content
  if (xmlContent.includes(';') && xmlContent.split('\n')[0].includes(';')) {
    console.log('Content appears to be CSV though file was marked as XML');
    return parseCSV(xmlContent);
  }
  
  try {
    console.log('Starting XML parsing with dynamic column mapping...');
    console.log('XML Content Length:', xmlContent.length);
    
    // Create a DOM parser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error('XML parsing error:', parserError.textContent);
      return [];
    }

    console.log('Looking for Excel XML format...');
    
    // First check if it's Excel XML format
    const isExcelXML = xmlContent.includes('xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"') || 
                      xmlContent.includes('urn:schemas-microsoft-com:office:excel');
                      
    if (isExcelXML) {
      console.log('Excel XML format detected, parsing Excel worksheet data with intelligent column mapping...');
      
      try {
        // Improved parsing of Excel XML format
        // Find the first worksheet
        const worksheetNodes = xmlDoc.querySelectorAll('Worksheet');
        if (worksheetNodes.length === 0) {
          console.error('No worksheets found in Excel XML');
          return [];
        }
        
        // Use the first worksheet found
        const worksheet = worksheetNodes[0];
        console.log('Using worksheet:', worksheet.getAttribute('ss:Name') || 'Unnamed');
        
        // Find the data table
        const tableNode = worksheet.querySelector('Table');
        if (!tableNode) {
          console.error('No Table node found in worksheet');
          return [];
        }
        
        // Find all rows in the table
        const rows = Array.from(tableNode.querySelectorAll('Row'));
        
        if (rows.length < 2) {
          console.error('Excel XML has too few rows:', rows.length);
          return [];
        }
        
        // The first row contains headers
        const headerRow = rows[0];
        const headerCells = Array.from(headerRow.querySelectorAll('Cell'));
        
        if (headerCells.length === 0) {
          console.error('No header cells found in Excel XML');
          return [];
        }
        
        // Extract and log all headers for debugging
        const extractedHeaders = headerCells.map((cell, index) => {
          const dataNode = cell.querySelector('Data');
          const headerText = dataNode ? dataNode.textContent?.trim() : cell.textContent?.trim();
          console.log(`Header ${index}: "${headerText}"`);
          return {
            index,
            text: headerText?.toLowerCase() || ''
          };
        });
        
        console.log('Excel Header cells:', extractedHeaders);
        
        // Create header mapping table by text content using enhanced intelligent mapping
        const headerMapping: Record<number, string> = {};
        
        // Process all headers to find exact and pattern matches
        extractedHeaders.forEach((header) => {
          const { index, text } = header;
          
          // Skip empty headers
          if (!text) return;
          
          // Direct match with CSV_HEADERS
          if (CSV_HEADERS.includes(text)) {
            headerMapping[index] = text;
            console.log(`Mapped header ${index} to '${text}' (direct match)`);
            return;
          }
          
          // Match with HEADER_MAPPINGS
          if (HEADER_MAPPINGS[text]) {
            headerMapping[index] = HEADER_MAPPINGS[text];
            console.log(`Mapped header ${index} to '${HEADER_MAPPINGS[text]}' (via mapping)`);
            return;
          }
          
          // NEW: Special detection for tax percentage columns by matching patterns
          if (text.includes('φόρος') || text.includes('φοροσ')) {
            if (text.includes('3%') || text.includes('3')) {
              headerMapping[index] = 'foros_3';
              console.log(`Mapped header ${index} to 'foros_3' (tax pattern match)`);
              return;
            }
            if (text.includes('4%') || text.includes('4')) {
              headerMapping[index] = 'foros_4';
              console.log(`Mapped header ${index} to 'foros_4' (tax pattern match)`);
              return;
            }
            if (text.includes('8%') || text.includes('8')) {
              headerMapping[index] = 'foros_8';
              console.log(`Mapped header ${index} to 'foros_8' (tax pattern match)`);
              return;
            }
            if (text.includes('20%') || text.includes('20')) {
              headerMapping[index] = 'foros_20';
              console.log(`Mapped header ${index} to 'foros_20' (tax pattern match)`);
              return;
            }
          }
          
          // Pattern-based matching using the imported columnPatterns
          for (const [fieldName, patterns] of Object.entries(columnPatterns)) {
            if (Array.isArray(patterns)) {
              if (patterns.some(pattern => pattern.test(text))) {
                headerMapping[index] = fieldName;
                console.log(`Mapped header ${index} to '${fieldName}' (pattern match)`);
                return;
              }
            }
          }
          
          // Special case for "ΑΑ" (Α/Α)
          if (text === 'αα' || text === 'α/α' || text.includes('α/α')) {
            headerMapping[index] = 'ΑΑ';
            console.log(`Mapped header ${index} to 'ΑΑ' (special case)`);
            return;
          }
          
          // Unmapped header
          console.log(`Header ${index} "${text}" not mapped`);
        });
        
        // Enhanced data analysis for column inference
        const processDataToInferColumns = (rows: Element[]): Record<number, string> => {
          // Sample a few rows to analyze data types
          const sampleSize = Math.min(10, rows.length - 1);
          const sampleRows = rows.slice(1, 1 + sampleSize);
          
          // Initialize column data type analysis
          const columnDataAnalysis: Record<number, { 
            dateCount: number, 
            numberCount: number,
            invoiceNumberCount: number,
            moneyCount: number,
            samples: string[],
            // NEW: Tax pattern counts
            foros3Count: number,
            foros4Count: number,
            foros8Count: number,
            foros20Count: number
          }> = {};
          
          // Analyze sample rows
          for (const row of sampleRows) {
            const cells = Array.from(row.querySelectorAll('Cell'));
            
            cells.forEach((cell, colIndex) => {
              const dataNode = cell.querySelector('Data');
              const cellValue = dataNode ? dataNode.textContent?.trim() : cell.textContent?.trim() || '';
              
              // Initialize column analysis if not exist
              if (!columnDataAnalysis[colIndex]) {
                columnDataAnalysis[colIndex] = { 
                  dateCount: 0, 
                  numberCount: 0,
                  invoiceNumberCount: 0,
                  moneyCount: 0,
                  samples: [],
                  foros3Count: 0,
                  foros4Count: 0,
                  foros8Count: 0,
                  foros20Count: 0
                };
              }
              
              // Store sample value (up to 5 samples)
              if (columnDataAnalysis[colIndex].samples.length < 5 && cellValue) {
                columnDataAnalysis[colIndex].samples.push(cellValue);
              }
              
              // Check for date patterns
              if (looksLikeDate(cellValue)) {
                columnDataAnalysis[colIndex].dateCount++;
              }
              
              // Check for invoice number patterns
              if (looksLikeInvoiceNumber(cellValue)) {
                columnDataAnalysis[colIndex].invoiceNumberCount++;
              }
              
              // Check for money patterns
              if (looksLikeMoney(cellValue)) {
                columnDataAnalysis[colIndex].moneyCount++;
              }
              
              // Check for numeric patterns
              if (/^\d+([.,]\d+)?$/.test(cellValue)) {
                columnDataAnalysis[colIndex].numberCount++;
              }
              
              // NEW: Tax pattern detection by analyzing the cell values
              // In some XMLs, there might be no clear header but values like "24,00"
              if (cellValue && looksLikeMoney(cellValue)) {
                // For each tax percentage, check if the values in the column are consistent with what we'd expect
                // For example, if most values are around 3% of the total amount (in a nearby column)
                const numValue = parseFloat(cellValue.replace(',', '.'));
                if (numValue > 0) {
                  // Look at nearby columns for potential "synoliki_axi" (total amount) values
                  for (let totalColIndex = colIndex - 3; totalColIndex <= colIndex + 3; totalColIndex++) {
                    if (totalColIndex === colIndex) continue; // Skip self
                    
                    const totalCell = cells[totalColIndex];
                    if (!totalCell) continue;
                    
                    const totalDataNode = totalCell.querySelector('Data');
                    const totalCellValue = totalDataNode ? totalDataNode.textContent?.trim() : totalCell.textContent?.trim() || '';
                    
                    if (looksLikeMoney(totalCellValue)) {
                      const totalValue = parseFloat(totalCellValue.replace(',', '.'));
                      if (totalValue > 0) {
                        const percentage = (numValue / totalValue) * 100;
                        
                        // Check if the percentage is close to known tax rates
                        if (Math.abs(percentage - 3) < 0.5) {
                          columnDataAnalysis[colIndex].foros3Count++;
                        } else if (Math.abs(percentage - 4) < 0.5) {
                          columnDataAnalysis[colIndex].foros4Count++;
                        } else if (Math.abs(percentage - 8) < 0.5) {
                          columnDataAnalysis[colIndex].foros8Count++;
                        } else if (Math.abs(percentage - 20) < 0.5) {
                          columnDataAnalysis[colIndex].foros20Count++;
                        }
                      }
                    }
                  }
                }
              }
            });
          }
          
          // Log column analysis for debugging
          console.log('Column data analysis:', columnDataAnalysis);
          
          // Now infer column types for unmapped columns
          for (const [colIndex, analysis] of Object.entries(columnDataAnalysis)) {
            const index = Number(colIndex);
            
            // Skip already mapped columns
            if (headerMapping[index]) continue;
            
            const { dateCount, invoiceNumberCount, numberCount, moneyCount, samples,
                   foros3Count, foros4Count, foros8Count, foros20Count } = analysis;
            const sampleSize = sampleRows.length;
            
            // NEW: Check for tax column patterns
            // If there's evidence this is a tax column based on the values, map it accordingly
            if (foros3Count / sampleSize > 0.5 && !Object.values(headerMapping).includes('foros_3')) {
              headerMapping[index] = 'foros_3';
              console.log(`Inferred column ${index} as 'foros_3' based on tax percentage analysis. Samples: ${samples.join(', ')}`);
              continue;
            }
            
            if (foros4Count / sampleSize > 0.5 && !Object.values(headerMapping).includes('foros_4')) {
              headerMapping[index] = 'foros_4';
              console.log(`Inferred column ${index} as 'foros_4' based on tax percentage analysis. Samples: ${samples.join(', ')}`);
              continue;
            }
            
            if (foros8Count / sampleSize > 0.5 && !Object.values(headerMapping).includes('foros_8')) {
              headerMapping[index] = 'foros_8';
              console.log(`Inferred column ${index} as 'foros_8' based on tax percentage analysis. Samples: ${samples.join(', ')}`);
              continue;
            }
            
            if (foros20Count / sampleSize > 0.5 && !Object.values(headerMapping).includes('foros_20')) {
              headerMapping[index] = 'foros_20';
              console.log(`Inferred column ${index} as 'foros_20' based on tax percentage analysis. Samples: ${samples.join(', ')}`);
              continue;
            }
            
            // If most values look like dates, it's probably a date field
            if (dateCount / sampleSize > 0.6) {
              // Check if we already have an invoice date column
              if (!Object.values(headerMapping).includes('im_parastatikou')) {
                headerMapping[index] = 'im_parastatikou';
                console.log(`Inferred column ${index} as 'im_parastatikou' based on date patterns. Samples: ${samples.join(', ')}`);
              }
            }
            // If most values look like invoice numbers, it's probably an invoice number field
            else if (invoiceNumberCount / sampleSize > 0.6) {
              if (!Object.values(headerMapping).includes('ar_parastatikou')) {
                headerMapping[index] = 'ar_parastatikou';
                console.log(`Inferred column ${index} as 'ar_parastatikou' based on invoice number patterns. Samples: ${samples.join(', ')}`);
              }
            }
            // If most values look like money amounts
            else if (moneyCount / sampleSize > 0.6) {
              // Try to infer which money field it might be
              if (!Object.values(headerMapping).includes('synoliki_axi')) {
                headerMapping[index] = 'synoliki_axi';
                console.log(`Inferred column ${index} as 'synoliki_axi' based on money formats. Samples: ${samples.join(', ')}`);
              } else if (!Object.values(headerMapping).includes('plirotea_axia')) {
                headerMapping[index] = 'plirotea_axia';
                console.log(`Inferred column ${index} as 'plirotea_axia' based on money formats. Samples: ${samples.join(', ')}`);
              }
            }
          }
          
          return headerMapping;
        };
        
        // If we're missing essential fields, try to infer them from data
        const essentialFields = ['ar_parastatikou', 'im_parastatikou', 'synoliki_axi', 'afm'];
        const mappedFields = Object.values(headerMapping);
        
        const missingEssentials = essentialFields.filter(field => !mappedFields.includes(field));
        if (missingEssentials.length > 0) {
          console.log(`Missing essential fields: ${missingEssentials.join(', ')}. Will analyze data to infer columns.`);
          
          // Analyze data to infer columns
          processDataToInferColumns(rows);
          
          // Log the improved mapping
          console.log('Final header mapping after data analysis:', headerMapping);
        }
        
        // Process data rows
        const parsedRecords: CsvData[] = [];
        
        // Skip the first row (headers) and process the rest
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const cells = Array.from(row.querySelectorAll('Cell'));
          
          // Skip empty rows
          if (cells.length === 0) continue;
          
          const record: Partial<CsvData> = {};
          let hasData = false;
          
          // For each cell, map to the correct field
          cells.forEach((cell, index) => {
            let cellContent = '';
            const dataNode = cell.querySelector('Data');
            
            if (dataNode && dataNode.textContent) {
              cellContent = dataNode.textContent.trim();
            } else {
              cellContent = (cell.textContent || '').trim();
            }
            
            // If we have a mapping for this position
            if (headerMapping[index]) {
              const fieldName = headerMapping[index];
              (record as Record<string, string>)[fieldName] = cellContent;
              
              // Consider a row with data for essential fields to have data
              if (cellContent && (fieldName === 'afm' || fieldName === 'ΑΑ' || 
                  fieldName === 'ar_parastatikou' || fieldName === 'im_parastatikou')) {
                hasData = true;
              }
              
              // Enhanced logging for essential fields for debugging the first few rows
              if (i < 5 && (fieldName === 'ar_parastatikou' || fieldName === 'im_parastatikou' || 
                            fieldName === 'synoliki_axi' || fieldName === 'dikaiouxos_plir' ||
                            // Log tax values as well for debugging
                            fieldName === 'foros_3' || fieldName === 'foros_4' || 
                            fieldName === 'foros_8' || fieldName === 'foros_20')) {
                console.log(`Row ${i}, Field ${fieldName}: "${cellContent}" (pos: ${index})`);
              }
            }
          });
          
          // REMOVED: The validateAndFixInvoiceFields call that was causing problems
          // No more swapping of invoice fields
          
          // Only add records that have at least some data
          if (hasData) {
            // Fill in all required fields, even with empty strings
            CSV_HEADERS.forEach(header => {
              if (!(header in record)) {
                (record as Record<string, string>)[header] = '';
              }
            });
            
            // Add id if it doesn't exist
            if (!record.id) {
              record.id = `excel-xml-${i}`;
            }
            
            // Make sure ΑΑ exists (even if empty)
            if (!record.ΑΑ) {
              record.ΑΑ = i.toString();
            }
            
            // Check if required fields have values
            if (!record.afm) {
              record.afm = 'ΑΓΝΩΣΤΟ'; // provide default value for required field
            }
            
            if (!record.kod_prom) {
              record.kod_prom = 'ΑΓΝΩΣΤΟ'; // provide default value for required field
            }
            
            parsedRecords.push(record as CsvData);
          }
        }
        
        console.log(`Successfully parsed ${parsedRecords.length} records from Excel XML with dynamic column mapping`);
        
        // Log first 2 records in detail for debugging
        if (parsedRecords.length > 0) {
          console.log('First record details:');
          const firstRecord = parsedRecords[0];
          console.log({
            ΑΑ: firstRecord.ΑΑ,
            afm: firstRecord.afm,
            eponymia: firstRecord.eponymia,
            dikaiouxos_plir: firstRecord.dikaiouxos_plir,
            ar_parastatikou: firstRecord.ar_parastatikou,
            im_parastatikou: firstRecord.im_parastatikou,
            synoliki_axi: firstRecord.synoliki_axi,
            // Added tax fields in the log to verify they're being captured
            foros_3: firstRecord.foros_3,
            foros_4: firstRecord.foros_4,
            foros_8: firstRecord.foros_8,
            foros_20: firstRecord.foros_20
          });
          
          if (parsedRecords.length > 1) {
            console.log('Second record details:');
            const secondRecord = parsedRecords[1];
            console.log({
              ΑΑ: secondRecord.ΑΑ,
              afm: secondRecord.afm,
              eponymia: secondRecord.eponymia,
              dikaiouxos_plir: secondRecord.dikaiouxos_plir,
              ar_parastatikou: secondRecord.ar_parastatikou,
              im_parastatikou: secondRecord.im_parastatikou,
              synoliki_axi: secondRecord.synoliki_axi,
              // Added tax fields in the log to verify they're being captured
              foros_3: secondRecord.foros_3,
              foros_4: secondRecord.foros_4,
              foros_8: secondRecord.foros_8,
              foros_20: secondRecord.foros_20
            });
          }
        }
        
        return parsedRecords;
      } catch (error) {
        console.error('Error parsing Excel XML:', error);
        return [];
      }
    }
    
    // Fallback for non-Excel XML
    console.log('Not Excel XML format, trying generic XML parsing...');
    
    // Check for various possible tags for records
    const possibleRecordTags = ['row', 'record', 'item', 'entry', 'payment', 'transaction', 'Row'];
    let records: Element[] = [];
    
    for (const tag of possibleRecordTags) {
      const elements = xmlDoc.getElementsByTagName(tag);
      if (elements.length > 0) {
        records = Array.from(elements);
        console.log(`Found ${records.length} records with tag "${tag}"`);
        break;
      }
    }
    
    if (records.length === 0) {
      // If no records found with common tags, look for any elements with enough children
      const allElements = xmlDoc.getElementsByTagName('*');
      for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        if (el.children.length >= 10) { // Assume a valid record has multiple fields
          records.push(el);
        }
      }
      
      if (records.length === 0) {
        console.error('No records found in XML');
        return [];
      }
    }
    
    // Process each record
    const parsedRecords: CsvData[] = [];
    
    for (const record of records) {
      const data: Partial<CsvData> = {};
      let validRecord = false;
      
      // Try to match children to expected fields
      for (const header of CSV_HEADERS) {
        // First try exact tag name match
        let element = record.querySelector(header);
        
        // If not found, try case-insensitive match
        if (!element) {
          const allChildren = record.children;
          for (let i = 0; i < allChildren.length; i++) {
            const tagName = allChildren[i].tagName.toLowerCase();
            if (tagName === header.toLowerCase() || 
                (HEADER_MAPPINGS[tagName] === header)) {
              element = allChildren[i];
              break;
            }
          }
        }
        
        // If still not found, check for attributes
        if (!element) {
          const attr = record.getAttribute(header) || record.getAttribute(header.toLowerCase());
          if (attr) {
            (data as Record<string, string>)[header] = attr;
            
            // If we found AFM, consider the record valid
            if (header === 'afm' && attr.trim()) {
              validRecord = true;
            }
            continue;
          }
        }
        
        if (element) {
          const value = element.textContent?.trim() || '';
          (data as Record<string, string>)[header] = value;
          
          // If we found AFM, consider the record valid
          if (header === 'afm' && value.trim()) {
            validRecord = true;
          }
          
          // Enhanced logging for essential fields
          if (header === 'ar_parastatikou' || header === 'im_parastatikou') {
            console.log(`Found ${header} in record:`, value);
          }
        } else {
          // If required field is missing, set empty string
          (data as Record<string, string>)[header] = '';
        }
      }
      
      // Check if we have enough valid fields (at least afm and kod_prom)
      if (validRecord || (data.afm && data.kod_prom)) {
        // Add id if not exist
        if (!data.id) {
          data.id = `xml-${parsedRecords.length + 1}`;
        }
        
        // Enhanced logging for invoice number field
        console.log(`Record ${parsedRecords.length + 1} invoice number:`, data.ar_parastatikou);
        
        parsedRecords.push(data as CsvData);
      }
    }
    
    console.log(`Successfully parsed ${parsedRecords.length} records from XML`);
    
    // Log the first few records for debugging
    if (parsedRecords.length > 0) {
      console.log('First few XML records:');
      parsedRecords.slice(0, 3).forEach((record, i) => {
        console.log(`Record ${i + 1}:`, {
          ar_parastatikou: record.ar_parastatikou,
          im_parastatikou: record.im_parastatikou,
          afm: record.afm,
          eponymia: record.eponymia
        });
      });
    }
    
    return parsedRecords;
  } catch (error) {
    console.error('XML Parsing Error:', error);
    return [];
  }
}
