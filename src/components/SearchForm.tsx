
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { searchByAFMAndKodPromAcrossYears } from '@/utils/dataFetching';
import { CsvData } from '@/utils/csvParser';
import { Search as SearchIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SearchFormProps {
  onResultsFound: (results: { [year: number]: CsvData[] }) => void;
}

const SearchForm = ({ onResultsFound }: SearchFormProps) => {
  const [afm, setAfm] = useState('');
  const [kodProm, setKodProm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate inputs
    if (!afm.trim()) {
      setError('Παρακαλώ εισάγετε ΑΦΜ');
      return;
    }
    
    if (!kodProm.trim()) {
      setError('Παρακαλώ εισάγετε Κωδικό Προμηθευτή');
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Search records across all years using both AFM and Kod Prom
      const results = await searchByAFMAndKodPromAcrossYears(afm.trim(), kodProm.trim());
      
      // Pass results to parent component
      onResultsFound(results);
      
      const totalResults = Object.values(results).reduce((sum, yearResults) => sum + yearResults.length, 0);
      
      if (totalResults === 0) {
        setError('Δεν βρέθηκαν αποτελέσματα με τα στοιχεία που δώσατε');
        toast({
          title: "Αποτελέσματα αναζήτησης",
          description: 'Δεν βρέθηκαν εγγραφές με τα συγκεκριμένα στοιχεία',
          variant: "destructive"
        });
      } else {
        const yearsWithResults = Object.entries(results).filter(([_, data]) => data.length > 0).length;
        toast({
          title: "Επιτυχής αναζήτηση",
          description: `Βρέθηκαν ${totalResults} εγγραφές σε ${yearsWithResults} έτη`,
          variant: "default"
        });
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Προέκυψε σφάλμα κατά την αναζήτηση');
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά την αναζήτηση στη βάση δεδομένων",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Αναζήτηση Στοιχείων</CardTitle>
        <CardDescription>
          Συμπληρώστε τα παρακάτω πεδία για να βρείτε τα στοιχεία σας από όλα τα έτη
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="afm">ΑΦΜ</Label>
            <Input
              id="afm"
              placeholder="Εισάγετε το ΑΦΜ σας"
              value={afm}
              onChange={(e) => setAfm(e.target.value)}
              maxLength={9}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="kodProm">Κωδικός Προμηθευτή</Label>
            <Input
              id="kodProm"
              placeholder="Εισάγετε τον κωδικό προμηθευτή"
              value={kodProm}
              onChange={(e) => setKodProm(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="text-sm font-medium text-destructive mt-2">
              {error}
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSearching}>
            {isSearching ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                Αναζήτηση...
              </>
            ) : (
              <>
                <SearchIcon className="w-4 h-4 mr-2" />
                Αναζήτηση
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SearchForm;
