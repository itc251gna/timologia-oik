
import { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deleteYear } from '@/utils/yearManagement';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

interface DeleteYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year: number;
  onSuccess: () => void;
}

const DeleteYearDialog = ({ open, onOpenChange, year, onSuccess }: DeleteYearDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const { toast } = useToast();

  const confirmDeleteYear = async () => {
    if (confirmationText !== 'ΔΙΑΓΡΑΦΗ') {
      toast({
        title: "Λάθος επιβεβαίωση",
        description: "Παρακαλώ πληκτρολογήστε 'ΔΙΑΓΡΑΦΗ' για να επιβεβαιώσετε",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteYear(year);
      console.log('Delete year result:', result);
      
      toast({
        title: "Επιτυχής διαγραφή",
        description: `Το έτος ${year} διαγράφηκε επιτυχώς μαζί με όλα τα δεδομένα του.`,
      });
      
      setConfirmationText('');
      onSuccess();
    } catch (error: any) {
      console.error("Error deleting year:", error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = "Προέκυψε σφάλμα κατά τη διαγραφή του έτους.";
      
      if (error?.message?.includes('does not exist')) {
        errorMessage = `Το έτος ${year} δεν υπάρχει στη βάση δεδομένων.`;
      } else if (error?.message?.includes('Cannot delete the main vendors table')) {
        errorMessage = `Δεν μπορείτε να διαγράψετε το κύριο έτος ${year}.`;
      } else if (error?.message?.includes('permission denied') || error?.message?.includes('access denied')) {
        errorMessage = "Δεν έχετε δικαιώματα για αυτή την ενέργεια.";
      } else if (error?.message?.includes('network') || error?.message?.includes('connection')) {
        errorMessage = "Πρόβλημα σύνδεσης. Παρακαλώ ελέγξτε τη σύνδεσή σας και προσπαθήστε ξανά.";
      } else if (error?.message) {
        // If we have a specific error message, include it
        errorMessage = `Σφάλμα: ${error.message}`;
      }
      
      toast({
        title: "Σφάλμα διαγραφής",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmationText('');
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Διαγραφή Έτους {year}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Είστε βέβαιοι ότι θέλετε να διαγράψετε το έτος {year}; 
              Αυτή η ενέργεια θα διαγράψει:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Τον πίνακα vendors_{year}</li>
              <li>Όλα τα δεδομένα του έτους {year}</li>
              <li>Τη λειτουργία truncate για αυτό το έτος</li>
              <li>Την εγγραφή από τη λίστα ετών</li>
            </ul>
            <p className="text-red-600 font-medium">
              Αυτή η ενέργεια δεν μπορεί να αναιρεθεί!
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Πληκτρολογήστε <span className="font-bold">ΔΙΑΓΡΑΦΗ</span> για επιβεβαίωση:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="ΔΙΑΓΡΑΦΗ"
              disabled={isDeleting}
            />
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Άκυρο</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDeleteYear}
            disabled={isDeleting || confirmationText !== 'ΔΙΑΓΡΑΦΗ'}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeleting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Διαγραφή...
              </>
            ) : 'Διαγραφή Έτους'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteYearDialog;
