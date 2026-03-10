
import { useState, useEffect } from 'react';
import { Table, TableCaption } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CsvData } from '@/utils/csvParser';
import { sortData, filterData, exportToXLS } from '@/utils/tableUtils';
import { excludedColumns } from '@/utils/columnUtils';
import { reorderDataKeys } from '@/utils/columnOrder';
import TableHeader from '@/components/table/TableHeader';
import TableRows from '@/components/table/TableRows';
import SearchBox from '@/components/table/SearchBox';
import ExportButton from '@/components/table/ExportButton';

interface DataTableProps {
  data: CsvData[];
  showFullControls?: boolean;
  title?: string;
  enableDownload?: boolean;
}

const DataTable = ({ 
  data, 
  showFullControls = false, 
  title = "Αποτελέσματα",
  enableDownload = false
}: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<CsvData[]>([]);
  const [sortField, setSortField] = useState<keyof CsvData | null>('ΑΑ');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // Reorder data keys to ensure consistent column order
    const reorderedData = reorderDataKeys(data);
    
    // Initialize sorted data
    const sorted = sortData(reorderedData, sortField as keyof CsvData, sortDirection);
    setFilteredData(sorted);
  }, [data, sortDirection]);

  useEffect(() => {
    // Ensure UTF-8 encoding
    const metaCharset = document.createElement('meta');
    metaCharset.setAttribute('charset', 'UTF-8');
    document.head.appendChild(metaCharset);
    
    return () => {
      document.head.removeChild(metaCharset);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    // Reorder data keys before filtering
    const reorderedData = reorderDataKeys(data);
    
    // Filter the data based on search term
    let filtered = filterData(reorderedData, term, excludedColumns);
    
    // Sort the filtered data
    filtered = sortData(filtered, sortField as keyof CsvData, sortDirection);
    
    setFilteredData(filtered);
  };

  const handleSort = (field: keyof CsvData) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    // Sort the data based on the field and direction
    const sorted = sortData(filteredData, field, newDirection);
    setFilteredData(sorted);
  };

  const handleExportXLS = () => {
    exportToXLS(filteredData, excludedColumns);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title} ({filteredData.length})</span>
          {(showFullControls || enableDownload) && (
            <ExportButton 
              onXLSExport={handleExportXLS}
              disabled={filteredData.length === 0}
            />
          )}
        </CardTitle>
        {showFullControls && (
          <SearchBox searchTerm={searchTerm} onSearch={handleSearch} />
        )}
      </CardHeader>
      <CardContent>
        {filteredData.length > 0 ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-[600px] overflow-auto">
              <table className="w-full">
                <TableHeader 
                  data={filteredData}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableRows data={filteredData} />
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Δεν βρέθηκαν αποτελέσματα
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;
