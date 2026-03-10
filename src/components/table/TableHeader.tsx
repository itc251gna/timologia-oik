
import { CsvData } from '@/utils/csvParser';
import { getColumnName, excludedColumns } from '@/utils/columnUtils';
import { getOrderedColumnKeys } from '@/utils/columnOrder';

interface TableHeaderProps {
  data: CsvData[];
  sortField: keyof CsvData | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof CsvData) => void;
}

const TableHeader = ({ data, sortField, sortDirection, onSort }: TableHeaderProps) => {
  if (!data.length) return null;
  
  // Get columns in the standard order
  const orderedKeys = getOrderedColumnKeys(data)
    .filter(key => !excludedColumns.includes(key));
  
  return (
    <thead className="sticky top-0 bg-white z-30 shadow-sm border-b-2 border-gray-200">
      <tr className="bg-gray-50">
        {orderedKeys.map((key) => (
          <th 
            key={key} 
            className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap border-b border-gray-200"
            onClick={() => onSort(key as keyof CsvData)}
          >
            <div className="flex items-center">
              {getColumnName(key)}
              {sortField === key && (
                <span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
