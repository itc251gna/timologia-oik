
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import SummaryCard from '@/components/SummaryCard';
import { CsvData } from '@/utils/csvParser';
import { Download, Lock, Search, ChevronDown, Euro } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { exportToXLS } from '@/utils/tableUtils';
import { excludedColumns } from '@/utils/columnUtils';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<{ [year: number]: CsvData[] }>({});
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleResultsFound = (results: { [year: number]: CsvData[] }) => {
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleAdminLogin = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleExportYear = (year: number, data: CsvData[]) => {
    exportToXLS(data, excludedColumns);
  };

  const handleExportAll = () => {
    const allData = Object.values(searchResults).flat();
    exportToXLS(allData, excludedColumns);
  };

  const getTotalRecords = () => {
    return Object.values(searchResults).reduce((sum, yearResults) => sum + yearResults.length, 0);
  };

  const getYearsWithResults = () => {
    return Object.entries(searchResults)
      .filter(([_, data]) => data.length > 0)
      .sort(([a], [b]) => parseInt(b) - parseInt(a));
  };

  // Calculate total values across all years
  const calculateAllYearsTotals = () => {
    const allData = Object.values(searchResults).flat();
    
    const calculateTotalValue = (field: 'synoliki_axi' | 'plirotea_axia'): number => {
      return allData.reduce((total, record) => {
        const value = record[field];
        if (!value || value === '-' || value === '') return total;
        
        // Remove commas and convert to number
        const numericValue = parseFloat(value.replace(/,/g, ''));
        return total + (isNaN(numericValue) ? 0 : numericValue);
      }, 0);
    };

    return {
      totalSynolikiAxi: calculateTotalValue('synoliki_axi'),
      totalPlirotea: calculateTotalValue('plirotea_axia')
    };
  };

  const allYearsTotals = calculateAllYearsTotals();
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo clickable={true} onClick={handleLogoClick} />
          <Button variant="outline" size="sm" onClick={handleAdminLogin}>
            <Lock className="h-4 w-4 mr-2" />
            Σύνδεση Διαχειριστή
          </Button>
        </div>
      </header>

      <main className="w-full px-4 py-8">
        <div className="w-full mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold greek-header mb-3">
              Αναζήτηση Στοιχείων Προμηθευτή
            </h2>
            <p className="text-muted-foreground">
              Συμπληρώστε το ΑΦΜ και τον κωδικό προμηθευτή σας για να δείτε τα στοιχεία σας από όλα τα έτη
            </p>
          </div>

          {!hasSearched ? (
            // Initial state - centered search form
            <div className="max-w-md mx-auto">
              <SearchForm onResultsFound={handleResultsFound} />
              
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium mb-2 flex items-center">
                  <Search className="h-4 w-4 mr-2 text-greek-blue" />
                  Οδηγίες Αναζήτησης
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  <li>Εισάγετε το 9ψήφιο ΑΦΜ σας χωρίς κενά. Σε περίπτωση που το ΑΦΜ σας ξεκινάει από 0 παραλείψτε το</li>
                  <li>Ο κωδικός προμηθευτή σας έχει αποσταλεί στο email σας</li>
                  <li>Για οποιαδήποτε απορία, επικοινωνήστε με το λογιστήριο</li>
                </ul>
              </div>
            </div>
          ) : (
            // Results state - full width layout
            <div className="space-y-6">
              {/* Search form at the top */}
              <div className="max-w-md mx-auto">
                <SearchForm onResultsFound={handleResultsFound} />
              </div>
              
              {/* Results section - full width */}
              <div className="w-full">
                {getTotalRecords() > 0 ? (
                  <div className="space-y-6">
                    {/* Overall Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Σύνολο Εγγραφών</p>
                          <p className="text-2xl font-bold text-green-600">
                            {getTotalRecords().toLocaleString('el-GR')}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Έτη με Δεδομένα</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {getYearsWithResults().length}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <Euro className="h-4 w-4 text-orange-600" />
                            <p className="text-sm text-muted-foreground">Συνολική Αξία Όλων</p>
                          </div>
                          <p className="text-2xl font-bold text-orange-600">
                            {formatCurrency(allYearsTotals.totalSynolikiAxi)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <Euro className="h-4 w-4 text-purple-600" />
                            <p className="text-sm text-muted-foreground">Πληρωτέα Αξία Όλων</p>
                          </div>
                          <p className="text-2xl font-bold text-purple-600">
                            {formatCurrency(allYearsTotals.totalPlirotea)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Συνολική Εξαγωγή</p>
                          <Button 
                            onClick={handleExportAll}
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Εξαγωγή Όλων
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Results by year */}
                    {getYearsWithResults().map(([year, data]) => (
                      <div key={year} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Έτος {year}</h3>
                          <Button 
                            onClick={() => handleExportYear(parseInt(year), data)}
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Εξαγωγή {year}
                          </Button>
                        </div>
                        
                        <SummaryCard 
                          data={data} 
                          year={parseInt(year)} 
                        />
                        
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <DataTable 
                            data={data}
                            title={`Αποτελέσματα για έτος ${year}`}
                            showFullControls={false}
                            enableDownload={true}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Δεν βρέθηκαν αποτελέσματα</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                      Δεν βρέθηκαν εγγραφές που να αντιστοιχούν στα στοιχεία που εισάγατε. 
                      Παρακαλώ ελέγξτε τα στοιχεία και προσπαθήστε ξανά.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground flex items-center justify-center">
            <img 
              src="/lovable-uploads/3500a1ab-63b4-4cce-8323-b9b82f0e1fc1.png" 
              alt="Ιατρικό Λογότυπο" 
              className="h-4 w-4 mr-2"
            />
            Ενημέρωση προμηθευτών &copy; {new Date().getFullYear()} - Σύστημα Αναζήτησης Στοιχείων Προμηθευτών
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;
