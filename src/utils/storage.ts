
// Central export file for storage utilities
// Re-exports functions from more focused utility files

import { CsvData } from './csvParser';

// Export authentication functions
export { 
  StorageKeys,
  isAuthenticated, 
  login, 
  logout 
} from './auth';

// Export data fetching functions (with year support)
export {
  getData,
  searchData
} from './dataFetching';

// Export data management functions (with year support)
export {
  saveData,
  clearData
} from './dataManagement';

// Export year management functions
export {
  getAvailableYears,
  createNewYear,
  deleteYear,
  getMostRecentYear,
  type YearData
} from './yearManagement';
