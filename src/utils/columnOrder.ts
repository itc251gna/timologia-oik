
// Define the standard column order for consistent display
export const standardColumnOrder = [
  'ΑΑ',
  'foreas',
  'etos', 
  'katigoria',
  'ar_ent',
  'st_ent',
  'kod_prom',
  'eponymia',
  'afm',
  'im_exoflisis',
  'ar_parastatikou',
  'im_parastatikou',
  'synoliki_axi',
  'foros_3',
  'foros_4', 
  'foros_8',
  'foros_20',
  'synolo_kratiseon',
  'plirotea_axia'
];

// Function to reorder data keys according to standard order
export const reorderDataKeys = (data: any[]): any[] => {
  if (!data || data.length === 0) return data;
  
  return data.map(row => {
    const reorderedRow: any = {};
    
    // First add columns in standard order
    standardColumnOrder.forEach(key => {
      if (row.hasOwnProperty(key)) {
        reorderedRow[key] = row[key];
      }
    });
    
    // Then add any remaining columns that aren't in standard order
    Object.keys(row).forEach(key => {
      if (!standardColumnOrder.includes(key) && !reorderedRow.hasOwnProperty(key)) {
        reorderedRow[key] = row[key];
      }
    });
    
    return reorderedRow;
  });
};

// Function to get ordered column keys from data
export const getOrderedColumnKeys = (data: any[]): string[] => {
  if (!data || data.length === 0) return [];
  
  const firstRow = data[0];
  const availableKeys = Object.keys(firstRow);
  const orderedKeys: string[] = [];
  
  // Add standard columns that exist in the data
  standardColumnOrder.forEach(key => {
    if (availableKeys.includes(key)) {
      orderedKeys.push(key);
    }
  });
  
  // Add any remaining columns
  availableKeys.forEach(key => {
    if (!orderedKeys.includes(key)) {
      orderedKeys.push(key);
    }
  });
  
  return orderedKeys;
};
