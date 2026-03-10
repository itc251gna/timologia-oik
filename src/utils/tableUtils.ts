
import { CsvData } from '@/utils/csvParser';
import * as XLSX from 'xlsx';
import { getColumnName } from '@/utils/columnUtils';

// Function to sort data based on field and direction
export const sortData = (
  data: CsvData[], 
  field: keyof CsvData, 
  direction: 'asc' | 'desc'
): CsvData[] => {
  // Special handling for AA field - numeric sorting
  if (field === 'ΑΑ') {
    return [...data].sort((a, b) => {
      if (a.ΑΑ && b.ΑΑ) {
        const aaA = parseInt(a.ΑΑ) || 0;
        const aaB = parseInt(b.ΑΑ) || 0;
        return direction === 'asc' ? aaA - aaB : aaB - aaA;
      }
      return 0;
    });
  } else {
    // Regular alphabetical sorting for other fields
    return [...data].sort((a, b) => {
      if (direction === 'asc') {
        return String(a[field] || '').localeCompare(String(b[field] || ''), 'el');
      } else {
        return String(b[field] || '').localeCompare(String(a[field] || ''), 'el');
      }
    });
  }
};

// Function to filter data based on search term
export const filterData = (
  data: CsvData[],
  searchTerm: string,
  excludedColumns: string[]
): CsvData[] => {
  const term = searchTerm.toLowerCase().trim();
  
  if (term === '') {
    return data;
  }
  
  return data.filter(item => 
    Object.entries(item).some(([key, value]) => 
      !excludedColumns.includes(key) && String(value).toLowerCase().includes(term)
    )
  );
};

// Function to export data to XLS
export const exportToXLS = (data: CsvData[], excludedColumns: string[]): void => {
  // Filter out excluded columns for XLS export
  const visibleData = data.map(row => {
    const newRow = {...row};
    excludedColumns.forEach(col => delete newRow[col as keyof CsvData]);
    return newRow;
  });

  if (visibleData.length === 0) return;

  // Create headers with proper Greek column names
  const headers = Object.keys(visibleData[0]).map(key => getColumnName(key));
  
  // Define monetary columns that need to be converted to numbers
  const monetaryColumns = ['synoliki_axi', 'foros_3', 'foros_4', 'foros_8', 'foros_20', 'synolo_kratiseon', 'plirotea_axia'];
  
  // Prepare data for Excel with proper formatting
  const excelData = [
    headers, // Header row
    ...visibleData.map(row => 
      Object.entries(row).map(([key, value]) => {
        // Convert monetary values to proper numbers for Excel
        if (monetaryColumns.includes(key) && value) {
          const stringValue = String(value);
          // Remove any currency symbols and replace comma with dot, handle negative values
          const cleanValue = stringValue.replace(/[€$\s]/g, '').replace(',', '.');
          const numericValue = parseFloat(cleanValue);
          
          if (!isNaN(numericValue) && isFinite(numericValue)) {
            // Fix floating point errors by rounding to 2 decimal places
            const fixedNum = Math.round(numericValue * 100) / 100;
            return fixedNum;
          }
        }
        
        // For invoice numbers, ensure they're treated as text to preserve leading zeros
        if (key === 'ar_parastatikou' && value) {
          return String(value);
        }
        
        return value;
      })
    )
  ];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Set column widths for better visibility
  const colWidths = headers.map(header => ({ wch: Math.max(header.length, 15) }));
  ws['!cols'] = colWidths;

  // Format monetary columns as currency in Excel
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  
  for (let row = 1; row <= range.e.r; row++) { // Start from row 1 (skip header)
    Object.keys(visibleData[0]).forEach((key, colIndex) => {
      if (monetaryColumns.includes(key)) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex });
        if (ws[cellAddress] && typeof ws[cellAddress].v === 'number') {
          // Set number format for currency (2 decimal places, handles negative values)
          ws[cellAddress].z = '#,##0.00_-;[Red]-#,##0.00';
        }
      }
    });
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Δεδομένα');

  // Generate and download the file
  XLSX.writeFile(wb, 'exported_data.xlsx');
};
