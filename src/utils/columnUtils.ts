
// Map column keys to display names
export const getColumnName = (key: string): string => {
  const columnNames: Record<string, string> = {
    id: 'ID',
    ΑΑ: 'ΑΑ',
    foreas: 'Φορέας',
    etos: 'Έτος',
    katigoria: 'Κατηγορία',
    ar_ent: 'Αρ. Εντ.',
    st_ent: 'Στ. Εντ.',
    kod_prom: 'Κωδ. Προμ.',
    eponymia: 'Επωνυμία',
    afm: 'ΑΦΜ',
    im_exoflisis: 'Ημ. Εξόφλησης',
    ar_parastatikou: 'Αρ. Παραστατικού', 
    im_parastatikou: 'Ημ. Παραστατικού',
    synoliki_axi: 'Συνολική Αξία',
    foros_3: 'Φόρος 3%',
    foros_4: 'Φόρος 4%',
    foros_8: 'Φόρος 8%',
    foros_20: 'Φόρος 20%',
    synolo_kratiseon: 'Σύνολο Κρατήσεων',
    plirotea_axia: 'Πληρωτέα Αξία',
    dikaiouxos_plir: 'Δικαιούχος Πληρ.'
  };
  
  return columnNames[key] || key;
};

// Function to safely display text with proper number formatting
export const displayText = (text: string, columnKey?: string): string => {
  if (!text || typeof text !== 'string') {
    return '-';
  }
  
  if (text.trim() === '') {
    return '-';
  }
  
  // Special handling for invoice numbers - clean display like 2025
  if (columnKey === 'ar_parastatikou') {
    // If it's a pure number (integer or decimal), ensure it displays as integer
    if (/^-?\d+(\.\d*)?$/.test(text.trim())) {
      const num = parseFloat(text.trim());
      if (!isNaN(num) && isFinite(num) && num > 0) {
        // Convert to integer if it's a whole number or very close to one
        if (Math.abs(num - Math.round(num)) < 0.001) {
          return Math.round(num).toString();
        }
        // If it has trailing zeros after decimal, make it integer
        if (/\.0+$/.test(text.trim())) {
          return parseInt(text.trim()).toString();
        }
      }
    }
    // Return original text for non-numeric invoice patterns
    return text;
  }
  
  // Special handling for monetary amounts - format properly and fix floating point errors
  if (columnKey && ['synoliki_axi', 'foros_3', 'foros_4', 'foros_8', 'foros_20', 'synolo_kratiseon', 'plirotea_axia'].includes(columnKey)) {
    // Check if it's a numeric value that might have floating point errors (including negative values)
    if (/^-?\d+(\.\d+)?$/.test(text.trim())) {
      const num = parseFloat(text.trim());
      if (!isNaN(num) && isFinite(num)) {
        // Fix floating point errors by rounding to 2 decimal places
        const fixedNum = Math.round(num * 100) / 100;
        return fixedNum.toLocaleString('el-GR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
      }
    }
    
    // Fallback to original money detection logic
    if (looksLikeMoney(text)) {
      const num = parseFloat(text.replace(/[€$\s]/g, '').replace(',', '.'));
      if (!isNaN(num) && isFinite(num)) {
        // Fix floating point errors here too
        const fixedNum = Math.round(num * 100) / 100;
        return fixedNum.toLocaleString('el-GR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
      }
    }
  }
  
  return text;
};

// Helper function to fix floating point errors in monetary data during processing
export const fixFloatingPointErrors = (data: any[]): any[] => {
  const monetaryColumns = ['synoliki_axi', 'foros_3', 'foros_4', 'foros_8', 'foros_20', 'synolo_kratiseon', 'plirotea_axia'];
  
  return data.map(item => {
    const fixedItem = { ...item };
    
    monetaryColumns.forEach(column => {
      if (fixedItem[column] && typeof fixedItem[column] === 'string') {
        const text = fixedItem[column].trim();
        // Check if it's a numeric value that might have floating point errors (including negative values)
        if (/^-?\d+(\.\d+)?$/.test(text)) {
          const num = parseFloat(text);
          if (!isNaN(num) && isFinite(num)) {
            // Fix floating point errors by rounding to 2 decimal places
            const fixedNum = Math.round(num * 100) / 100;
            fixedItem[column] = fixedNum.toString();
          }
        }
      }
    });
    
    return fixedItem;
  });
};

// List of columns to exclude from display
export const excludedColumns = ['created_at', 'updated_at', 'id', 'original_id', 'dikaiouxos_plir'];

// Enhanced pattern matching for column identification
export const columnPatterns = {
  ar_parastatikou: [
    /αρ.*παρ/i,
    /αριθμ.*παρ/i,
    /invoice.*number/i,
    /αριθμ.*τιμολ/i,
    /αρ.*τιμολ/i,
    /^νουμερο/i,
    /^αριθμός$/i,
    /αρ$/i
  ],
  im_parastatikou: [
    /ημ.*παρ/i,
    /ημερ.*παρ/i,
    /date.*inv/i,
    /ημερ.*τιμολ/i,
    /^ημ/i,
    /^ημερομηνία$/i,
    /ημ$/i,
    /ημ\/νια/i
  ],
  dikaiouxos_plir: [
    /δικαιουχ/i,
    /benef/i,
    /πληρωμη/i
  ],
  afm: [
    /αφμ/i,
    /α\.?φ\.?μ/i,
    /tax/i,
    /vat/i
  ],
  synoliki_axi: [
    /συνολικ/i,
    /total/i,
    /ποσό/i,
    /amount/i,
    /αξία/i
  ],
  // Add new patterns for tax columns
  foros_3: [
    /φόρος.*3%/i,
    /φόρος.*3/i,
    /φ.*3%/i,
    /tax.*3%/i,
    /3%.*φόρος/i
  ],
  foros_4: [
    /φόρος.*4%/i,
    /φόρος.*4/i,
    /φ.*4%/i,
    /tax.*4%/i,
    /4%.*φόρος/i
  ],
  foros_8: [
    /φόρος.*8%/i,
    /φόρος.*8/i,
    /φ.*8%/i,
    /tax.*8%/i,
    /8%.*φόρος/i
  ],
  foros_20: [
    /φόρος.*20%/i,
    /φόρος.*20/i,
    /φ.*20%/i,
    /tax.*20%/i,
    /20%.*φόρος/i,
    /φπα/i
  ]
};

// Enhanced function to detect if a value looks like a date
export const looksLikeDate = (value: string): boolean => {
  if (!value) return false;
  
  const trimmed = value.trim();
  if (!trimmed) return false;
  
  const datePatterns = [
    /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}$/,  // DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
    /^\d{2,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}$/,  // YYYY/MM/DD, YYYY-MM-DD, YYYY.MM.DD
    /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2}$/,    // DD/MM/YY, DD-MM-YY, DD.MM.YY
    /^\d{1,2}\.\d{1,2}\.\d{2,4}$/                // Explicit DD.MM.YYYY format (common in Greek docs)
  ];
  
  if (datePatterns.some(pattern => pattern.test(trimmed))) {
    console.log(`Value "${trimmed}" looks like a date`);
    return true;
  }
  
  if (/\d+\s*(ιαν|φεβ|μαρ|απρ|μαι|ιουν|ιουλ|αυγ|σεπ|οκτ|νοε|δεκ)/i.test(trimmed)) {
    console.log(`Value "${trimmed}" contains Greek month abbreviation, likely a date`);
    return true;
  }
  
  if (/\d{1,2}\s+\w+\s+\d{2,4}/i.test(trimmed)) {
    console.log(`Value "${trimmed}" appears to be a date with text month`);
    return true;
  }
  
  return false;
};

// Enhanced function to detect if a value looks like an invoice number
export const looksLikeInvoiceNumber = (value: string): boolean => {
  if (!value) return false;
  
  const trimmed = value.trim();
  if (!trimmed) return false;
  
  if (looksLikeDate(trimmed)) {
    return false;
  }
  
  // Check if it's a simple integer (most common invoice format)
  if (/^-?\d+$/.test(trimmed)) {
    console.log(`Value "${trimmed}" is a numeric invoice number`);
    return true;
  }
  
  // Check if it's a decimal number that should be treated as invoice (with floating point errors)
  if (/^-?\d+\.\d+$/.test(trimmed)) {
    const num = parseFloat(trimmed);
    if (!isNaN(num) && isFinite(num) && num > 0) {
      // If it's very close to a whole number, likely an invoice with floating point errors
      if (Math.abs(num - Math.round(num)) < 0.001) {
        return true;
      }
      // If it has obvious floating point error patterns
      if (/\.(9{4,}|0{4,})/.test(trimmed)) {
        return true;
      }
      // If it ends with .0, likely an integer stored as decimal
      if (/\.0+$/.test(trimmed)) {
        return true;
      }
    }
    
    // Don't treat clear monetary amounts as invoices
    if (/[.,]\d{2}$/.test(trimmed)) {
      return false;
    }
  }
  
  const invoicePatterns = [
    /^[A-ZΑ-Ω\d]{1,5}[-\/]\d+$/,  // Format like A-12345 or T/12345
    /^[A-ZΑ-Ω]\d+$/,              // Format like T12345
    /^\d+[A-ZΑ-Ω]$/,              // Format like 12345A
    /^[Α-Ω]{1,3}-?\d+$/i,         // Greek letter(s) followed by numbers (Α-12345)
    /^\d+\s*\/\s*\d{4}$/,         // Format like 123/2023 (common invoice numbering)
    /^ΤΙΜ\.?\s*\d+$/i,            // "ΤΙΜ" followed by numbers (invoice abbreviation)
    /^[A-Z]{1,3}\d{1,5}[-\/]?\d{1,4}$/i  // Letters and numbers with optional separator
  ];
  
  for (const pattern of invoicePatterns) {
    if (pattern.test(trimmed)) {
      console.log(`Value "${trimmed}" matched invoice pattern ${pattern}`);
      return true;
    }
  }
  
  if (/^[A-ZΑ-Ω0-9\-\/]{2,15}$/i.test(trimmed) && /[A-ZΑ-Ω]/i.test(trimmed) && /\d/.test(trimmed)) {
    console.log(`Value "${trimmed}" contains both letters and numbers, likely an invoice number`);
    return true;
  }
  
  return false;
};

// Function to check if a value looks like money/numeric amount
export const looksLikeMoney = (value: string): boolean => {
  if (!value) return false;
  
  const trimmed = value.trim();
  
  const normalized = trimmed.replace(/[€$\s]/g, '');
  
  const moneyPatterns = [
    /^-?\d+[,.]\d{2}$/,               // -1234,56 or -1234.56
    /^-?\d{1,3}(?:\.\d{3})*[,]\d{2}$/, // -1.234,56 (European format)
    /^-?\d+[,.]\d{1,2}$/              // More flexible: -1234,5 or -1234.5
  ];
  
  for (const pattern of moneyPatterns) {
    if (pattern.test(normalized)) {
      return true;
    }
  }
  
  if (/^-?\d+$/.test(normalized) && /[€$]/.test(trimmed)) {
    return true;
  }
  
  return false;
};

// Function to check if a column contains mostly date values
export const columnContainsMostlyDates = (values: string[]): boolean => {
  if (!values.length) return false;
  
  const dateCount = values.filter(v => looksLikeDate(v)).length;
  return dateCount / values.length > 0.5; // More than 50% look like dates
};

// Function to check if a column contains mostly invoice numbers
export const columnContainsMostlyInvoiceNumbers = (values: string[]): boolean => {
  if (!values.length) return false;
  
  const invoiceCount = values.filter(v => looksLikeInvoiceNumber(v)).length;
  return invoiceCount / values.length > 0.5; // More than 50% look like invoice numbers
};
