
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import YearSelector from './YearSelector';
import SummaryCard from '@/components/SummaryCard';
import { CsvData } from '@/utils/csvParser';
import { Trash2, RefreshCw, UploadCloud, FileSpreadsheet } from 'lucide-react';

interface DataTabProps {
  data: CsvData[];
  totalRecords: number | null;
  selectedYear: number;
  onYearChange: (year: number) => void;
  onTabChange: (value: string) => void;
  onDeleteData: () => void;
  onRefreshData: () => void;
  isDeleting: boolean;
  isRefreshing: boolean;
}

const DataTab = ({ 
  data, 
  totalRecords, 
  selectedYear,
  onYearChange,
  onTabChange, 
  onDeleteData,
  onRefreshData,
  isDeleting,
  isRefreshing
}: DataTabProps) => {
  
  return (
    <div className="w-full space-y-6">
      {/* Header Section with Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-greek-blue" />
            Διαχείριση Δεδομένων
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="w-full sm:w-auto">
                <YearSelector 
                  selectedYear={selectedYear}
                  onYearChange={onYearChange}
                  label="Προβολή Δεδομένων Έτους"
                  placeholder="Επιλέξτε έτος για προβολή"
                />
              </div>
              
              {/* Statistics Display */}
              <div className="flex flex-col text-sm text-muted-foreground">
                <span className="font-medium">Σύνολο Εγγραφών:</span>
                <span className="text-lg font-bold text-greek-blue">
                  {totalRecords !== null ? totalRecords.toLocaleString('el-GR') : 'Φόρτωση...'}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={onRefreshData}
                disabled={isRefreshing}
                size="sm"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Ανανέωση...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Ανανέωση
                  </>
                )}
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={onDeleteData}
                disabled={data.length === 0 || isDeleting}
                size="sm"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Διαγραφή...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Διαγραφή Όλων
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Display Section */}
      {data.length > 0 ? (
        <div className="w-full space-y-4">
          {/* Summary Card */}
          <SummaryCard 
            data={data} 
            year={selectedYear} 
            totalRecords={totalRecords}
            showTotalRecords={true}
          />

          {/* Data Table - Full Width */}
          <div className="w-full">
            <DataTable 
              data={data} 
              showFullControls={true} 
              title={`Δεδομένα ${selectedYear}`}
            />
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UploadCloud className="h-20 w-20 text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium mb-3 text-center">
              Δεν υπάρχουν δεδομένα για το έτος {selectedYear}
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
              Δεν έχουν φορτωθεί ακόμα δεδομένα για το επιλεγμένο έτος. 
              Πηγαίνετε στην καρτέλα "Ανέβασμα Αρχείων" για να ανεβάσετε ένα αρχείο CSV ή XML.
            </p>
            <Button 
              variant="default" 
              onClick={() => onTabChange("upload")}
              className="bg-greek-blue text-white hover:bg-greek-blue-dark"
              size="lg"
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Ανέβασμα Αρχείων
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataTab;
