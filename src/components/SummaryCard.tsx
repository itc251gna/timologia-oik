
import { Card, CardContent } from '@/components/ui/card';
import { Euro } from 'lucide-react';
import { CsvData } from '@/utils/csvParser';

interface SummaryCardProps {
  data: CsvData[];
  year: number;
  totalRecords?: number | null;
  showTotalRecords?: boolean;
}

const SummaryCard = ({ 
  data, 
  year, 
  totalRecords, 
  showTotalRecords = false
}: SummaryCardProps) => {
  // Calculate total values for current year
  const calculateTotalValue = (field: 'synoliki_axi' | 'plirotea_axia'): number => {
    return data.reduce((total, record) => {
      const value = record[field];
      if (!value || value === '-' || value === '') return total;
      
      // Remove commas and convert to number
      const numericValue = parseFloat(value.replace(/,/g, ''));
      return total + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalSynolikiAxi = calculateTotalValue('synoliki_axi');
  const totalPlirotea = calculateTotalValue('plirotea_axia');

  const columnsCount = showTotalRecords ? 5 : 4;

  return (
    <Card className="bg-greek-blue/5 border-greek-blue/20">
      <CardContent className="pt-6">
        <div className={`grid gap-4 text-center grid-cols-1 md:grid-cols-2 lg:grid-cols-${columnsCount}`}>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Έτος Δεδομένων</p>
            <p className="text-2xl font-bold text-greek-blue">{year}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {showTotalRecords ? 'Εμφανιζόμενες Εγγραφές' : 'Αποτελέσματα'}
            </p>
            <p className="text-2xl font-bold text-green-600">{data.length.toLocaleString('el-GR')}</p>
          </div>
          
          {showTotalRecords && totalRecords !== null && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Σύνολο Εγγραφών</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalRecords.toLocaleString('el-GR')}
              </p>
            </div>
          )}
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Euro className="h-4 w-4 text-emerald-600" />
              <p className="text-sm text-muted-foreground">Συνολική Αξία Έτους</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalSynolikiAxi)}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Euro className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-muted-foreground">Πληρωτέα Αξία Έτους</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalPlirotea)}
            </p>
          </div>
        </div>
        
        {showTotalRecords && totalRecords && totalRecords > data.length && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 text-center">
              <strong>Σημείωση:</strong> Εμφανίζονται οι πρώτες {data.length.toLocaleString('el-GR')} από {totalRecords.toLocaleString('el-GR')} εγγραφές για βέλτιστη απόδοση.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
