
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Search, Download, FileSpreadsheet } from 'lucide-react';
import { searchByAFMAcrossYears } from '@/utils/dataFetching';
import { CsvData } from '@/utils/csvParser';
import DataTable from '@/components/DataTable';
import SummaryCard from '@/components/SummaryCard';
import { exportToXLS } from '@/utils/tableUtils';
import { excludedColumns } from '@/utils/columnUtils';

const AdminSearchTab = () => {
  const [afm, setAfm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ [year: number]: CsvData[] }>({});
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!afm.trim()) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ εισάγετε ΑΦΜ για αναζήτηση.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(false);
    
    try {
      console.log(`Starting AFM search for: ${afm}`);
      const results = await searchByAFMAcrossYears(afm.trim());
      setSearchResults(results);
      setHasSearched(true);
      
      const totalRecords = Object.values(results).reduce((sum, yearResults) => sum + yearResults.length, 0);
      
      toast({
        title: "Αναζήτηση ολοκληρώθηκε",
        description: `Βρέθηκαν ${totalRecords} εγγραφές για το ΑΦΜ ${afm}`,
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά την αναζήτηση.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Αναζήτηση ΑΦΜ σε όλα τα έτη
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="afm">ΑΦΜ</Label>
                <Input
                  id="afm"
                  type="text"
                  value={afm}
                  onChange={(e) => setAfm(e.target.value)}
                  placeholder="Εισάγετε ΑΦΜ..."
                  disabled={isSearching}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={isSearching || !afm.trim()}>
                  {isSearching ? "Αναζήτηση..." : "Αναζήτηση"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* SAP Instructions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Οδηγίες Εξαγωγής και Εισαγωγής από SAP προς Εφαρμογή VENDORS251.GR
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <ol className="space-y-4 list-decimal ml-6">
            <li>
              <strong>Επιλογή Προτίμησης</strong>
              <ul className="mt-2 ml-4 space-y-1 list-disc">
                <li>Μεταβείτε στο SAP και επιλέξτε Προτιμήσεις.</li>
                <li>Στις προτιμήσεις επιλέξτε την προτίμηση 2FI_ENT_DIAX2-ΔΙΑΧΕΙΡΙΣΗ.</li>
              </ul>
            </li>
            
            <li>
              <strong>Φιλτράρισμα Ενταλμάτων</strong>
              <ul className="mt-2 ml-4 space-y-1 list-disc">
                <li>Στη Διαχείριση Ενταλμάτων, ορίστε:</li>
                <ul className="ml-4 mt-1 space-y-1">
                  <li><strong>Μονάδα:</strong> 7000</li>
                  <li><strong>Έτος:</strong> το επιθυμητό έτος</li>
                </ul>
                <li>Πατήστε Εκτέλεση, ή το πλήκτρο F8, ή το εικονίδιο με το ρολόι επάνω αριστερά.</li>
              </ul>
            </li>
            
            <li>
              <strong>Εξαγωγή Δεδομένων</strong>
              <ul className="mt-2 ml-4 space-y-1 list-disc">
                <li>Πατήστε Επιλογή Διάταξης ή το πλήκτρο Ctrl + F9.</li>
                <li>Επιλέξτε webapp.</li>
                <li>Πατάμε διαγραφή φίλτρου (Ctr + Shift + F2)</li>
                <li>Στη λίστα, επιλέξτε:</li>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>Εξαγωγή</li>
                  <li>Τοπικό αρχείο</li>
                  <li>Λογιστικό φύλλο</li>
                </ul>
                <li>Συνεχίστε και αποθηκεύστε το αρχείο με όνομα το έτος για ευκολία.</li>
              </ul>
            </li>
            
            <li>
              <strong>Επεξεργασία στο Excel</strong>
              <ul className="mt-2 ml-4 space-y-1 list-disc">
                <li>Ανοίξτε το αρχείο στο Excel.</li>
                <li>Διαγράψτε τις πρώτες 6 γραμμές, μέχρι την γραμμή που ξεκινά με "Φορέας".</li>
                <li>Διαγράψτε τη δεύτερη γραμμή (αν είναι κενή).</li>
                <li>Στην πρώτη στήλη, γράψτε Α/Α και αριθμήστε με 1, 2, κ.λπ. Χρησιμοποιήστε διπλό κλικ στον σταυρό κάτω δεξιά για αυτόματη συμπλήρωση.</li>
                <li>Διαγράψτε την κενή στήλη που βρίσκεται πιο δεξιά.</li>
                <li>Διαγράψτε τη στήλη "Δικαιούχος Πληροφορίας".</li>
                <li>Βάζουμε φίλτρο στην πρώτη γραμμή (Ctr + Shift + L)</li>
                <li>Στην στήλη Ημ. Εξόφλησης επιλέγουμε τα κενά κελιά και γράφουμε σε όλα τα κενά κελιά "ΑΝΑΜΕΝΕΤΑΙ"</li>
                <li>Στην στήλη Αρ. Παραστατικού επιλέγουμε τα κενά κελιά και γράφουμε σε όλα τα κενά κελιά "ΧΩΡΙΣ"</li>
              </ul>
            </li>
            
            <li>
              <strong>Μορφοποίηση Στηλών</strong>
              <ul className="mt-2 ml-4 space-y-1 list-disc">
                <li>Από τη στήλη "Συνολική Αξία" έως "Πληρωτέα Αξία", επιλέξτε όλα τα πεδία και ορίστε μορφή Λογιστική ή Νομισματική, αν δεν δουλεύει το ένα θα δουλέψει το άλλο.</li>
                <li>Στη στήλη "Αριθμός Παραστατικού", επιλέξτε όλα τα πεδία και ορίστε μορφή Κείμενο.</li>
              </ul>
            </li>
            
            <li>
              <strong>Αποθήκευση Αρχείου</strong>
              <ul className="mt-2 ml-4 space-y-1 list-disc">
                <li>Επιλέξτε Αρχείο &gt; Αποθήκευση ως</li>
                <li>Συνεχίστε και αποθηκεύστε το αρχείο με όνομα το έτος για ευκολία και αποθηκεύεται σαν Υπολογιστικό φύλλο XML 2003 (.xml)</li>
              </ul>
            </li>
            
            <li>
              <strong>Μπαίνουμε στην διαχείριση του vendors251.gr και ανεβάζουμε το αρχείο στην σωστή χρονιά.</strong>
            </li>
          </ol>
        </CardContent>
      </Card>

      {hasSearched && (
        <>
          {getTotalRecords() > 0 ? (
            <div className="space-y-6">
              {/* Summary για όλα τα αποτελέσματα */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">ΑΦΜ</p>
                      <p className="text-2xl font-bold text-blue-600">{afm}</p>
                    </div>
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
                  </div>
                  {getTotalRecords() > 0 && (
                    <div className="mt-4 text-center">
                      <Button 
                        onClick={handleExportAll}
                        variant="outline"
                        className="flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Εξαγωγή Όλων των Ετών
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Αποτελέσματα ανά έτος */}
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
                  
                  <DataTable 
                    data={data}
                    title={`Αποτελέσματα για έτος ${year}`}
                    showFullControls={true}
                    enableDownload={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-10">
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Δεν βρέθηκαν αποτελέσματα</p>
                  <p className="text-sm">Το ΑΦΜ "{afm}" δεν βρέθηκε σε κανένα έτος.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AdminSearchTab;
