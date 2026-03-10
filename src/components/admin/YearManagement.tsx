
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getAvailableYears, createNewYear, YearData } from '@/utils/yearManagement';
import DeleteYearDialog from './DeleteYearDialog';

const YearManagement = () => {
  const [years, setYears] = useState<YearData[]>([]);
  const [newYear, setNewYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears = async () => {
    setIsLoading(true);
    try {
      const availableYears = await getAvailableYears();
      setYears(availableYears);
    } catch (error) {
      console.error('Error loading years:', error);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά τη φόρτωση των ετών",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateYear = async () => {
    const yearNum = parseInt(newYear);
    
    if (!yearNum || yearNum < 2000 || yearNum > 2050) {
      toast({
        title: "Μη έγκυρο έτος",
        description: "Παρακαλώ εισάγετε έγκυρο έτος μεταξύ 2000-2050",
        variant: "destructive"
      });
      return;
    }

    if (years.some(y => y.year === yearNum)) {
      toast({
        title: "Το έτος υπάρχει ήδη",
        description: `Το έτος ${yearNum} έχει ήδη δημιουργηθεί`,
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      await createNewYear(yearNum);
      toast({
        title: "Επιτυχής δημιουργία",
        description: `Το έτος ${yearNum} δημιουργήθηκε επιτυχώς με τον αντίστοιχο πίνακα και RLS policies`,
        variant: "default"
      });
      
      setNewYear('');
      setDialogOpen(false);
      await loadYears(); // Reload years
    } catch (error) {
      console.error('Error creating year:', error);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά τη δημιουργία του έτους",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (year: number) => {
    if (year === 2025) {
      toast({
        title: "Δεν επιτρέπεται",
        description: "Δεν μπορείτε να διαγράψετε το κύριο έτος 2025",
        variant: "destructive"
      });
      return;
    }
    setYearToDelete(year);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    setYearToDelete(null);
    setDeleteDialogOpen(false);
    loadYears(); // Reload years after deletion
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Διαχείριση Ετών</CardTitle>
          <CardDescription>Φόρτωση...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Διαχείριση Ετών
          </CardTitle>
          <CardDescription>
            Διαχειριστείτε τα διαθέσιμα έτη, δημιουργήστε νέους πίνακες δεδομένων και διαγράψτε παλιά έτη
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <div key={year.year} className="flex items-center gap-2">
                <Badge 
                  variant={year.year === 2025 ? "default" : "secondary"}
                  className="text-sm"
                >
                  {year.year} ({year.table_name})
                </Badge>
                {year.year !== 2025 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteClick(year.year)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2Icon className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {years.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Δεν υπάρχουν διαθέσιμα έτη
            </p>
          )}
        </CardContent>
        
        <CardFooter>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <PlusIcon className="h-4 w-4 mr-2" />
                Δημιουργία Νέου Έτους
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Δημιουργία Νέου Έτους</DialogTitle>
                <DialogDescription>
                  Εισάγετε το έτος για το οποίο θέλετε να δημιουργήσετε νέο πίνακα δεδομένων.
                  Θα δημιουργηθεί αυτόματα ο αντίστοιχος πίνακας με τα απαραίτητα RLS policies στη βάση δεδομένων.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Έτος</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="π.χ. 2024"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    min="2000"
                    max="2050"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleCreateYear} disabled={isCreating}>
                  {isCreating ? 'Δημιουργία...' : 'Δημιουργία'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {yearToDelete && (
        <DeleteYearDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          year={yearToDelete}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
};

export default YearManagement;
