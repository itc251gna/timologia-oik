
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
import { clearData } from '@/utils/dataManagement';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

interface DeleteDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  selectedYear: number;
}

const DeleteDataDialog = ({ open, onOpenChange, onSuccess, selectedYear }: DeleteDataDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const confirmDeleteData = async () => {
    setIsDeleting(true);
    try {
      await clearData(selectedYear);
      toast({
        title: "Επιτυχία",
        description: `Όλα τα δεδομένα του έτους ${selectedYear} έχουν διαγραφεί.`,
      });
      onSuccess();
    } catch (error) {
      console.error("Error clearing data:", error);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά τη διαγραφή των δεδομένων. Παρακαλώ προσπαθήστε ξανά.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Διαγραφή Δεδομένων {selectedYear}</AlertDialogTitle>
          <AlertDialogDescription>
            Είστε βέβαιοι ότι θέλετε να διαγράψετε όλα τα δεδομένα του έτους {selectedYear}; 
            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Άκυρο</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDeleteData}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeleting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Διαγραφή...
              </>
            ) : 'Διαγραφή'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDataDialog;
