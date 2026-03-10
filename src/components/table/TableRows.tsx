
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CsvData } from '@/utils/csvParser';
import { displayText } from '@/utils/columnUtils';
import { excludedColumns } from '@/utils/columnUtils';
import { getOrderedColumnKeys } from '@/utils/columnOrder';

interface TableRowsProps {
  data: CsvData[];
}

const TableRows = ({ data }: TableRowsProps) => {
  if (!data.length) return <TableBody></TableBody>;
  
  // Get columns in the standard order
  const orderedKeys = getOrderedColumnKeys(data)
    .filter(key => !excludedColumns.includes(key));

  return (
    <TableBody>
      {data.map((row, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-muted/50">
          {orderedKeys.map((key, colIndex) => (
            <TableCell 
              key={colIndex} 
              className={`whitespace-nowrap ${key === 'ΑΑ' ? 'font-medium' : ''}`}
            >
              {displayText(String(row[key as keyof CsvData] || ''), key)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TableRows;
