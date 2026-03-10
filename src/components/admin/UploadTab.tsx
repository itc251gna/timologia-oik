
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CsvUploader from '@/components/CsvUploader';
import YearSelector from './YearSelector';
import { getMostRecentYear } from '@/utils/yearManagement';

interface UploadTabProps {
  onDataChange: () => void;
}

const UploadTab = ({ onDataChange }: UploadTabProps) => {
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  useEffect(() => {
    // Load the most recent year on component mount
    const loadMostRecentYear = async () => {
      try {
        const mostRecent = await getMostRecentYear();
        setSelectedYear(mostRecent);
      } catch (error) {
        console.error('Error loading most recent year:', error);
      }
    };
    
    loadMostRecentYear();
  }, []);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Επιλογή Έτους για Ανέβασμα</CardTitle>
          <CardDescription>
            Επιλέξτε το έτος στο οποίο θα αποθηκευτούν τα δεδομένα που θα ανεβάσετε
          </CardDescription>
        </CardHeader>
        <CardContent>
          <YearSelector 
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            label="Έτος Αποθήκευσης"
            placeholder="Επιλέξτε έτος για αποθήκευση"
          />
        </CardContent>
      </Card>

      <CsvUploader onDataChange={onDataChange} selectedYear={selectedYear} />
      
      <Card>
        <CardHeader>
          <CardTitle>Οδηγίες Ανεβάσματος</CardTitle>
          <CardDescription>
            Σημαντικές πληροφορίες για το ανέβασμα των αρχείων
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Υποστηριζόμενα Αρχεία</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Η εφαρμογή υποστηρίζει τα ακόλουθα είδη αρχείων:
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
              <li>Αρχεία CSV με διαχωριστικό το ερωτηματικό (;) και κωδικοποίηση ISO-8859-7</li>
              <li>Αρχεία XML με αντίστοιχα πεδία δεδομένων</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Βελτιωμένη Αντιστοίχιση Στηλών</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Το σύστημα χρησιμοποιεί βελτιωμένη αντιστοίχιση επικεφαλίδων:
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
              <li>Αναγνωρίζει αυτόματα επικεφαλίδες βάσει περιεχομένου</li>
              <li>Διορθώνει αυτόματα λανθασμένες αντιστοιχίσεις ημερομηνιών και αριθμών παραστατικών</li>
              <li>Υποστηρίζει διάφορες μορφές ημερομηνιών (ΗΗ.ΜΜ.ΕΕΕΕ, ΗΗ-ΜΜ-ΕΕΕΕ, κλπ)</li>
              <li>Προσαρμόζεται σε διαφορετικές δομές αρχείων XML και CSV</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Απαιτούμενα Πεδία</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Τα αρχεία πρέπει να περιέχουν τα ακόλουθα βασικά πεδία:
            </p>
            <code className="text-xs bg-muted p-2 rounded block mt-2 overflow-x-auto">
              afm (ΑΦΜ), ar_parastatikou (Αρ. Παραστατικού), im_parastatikou (Ημ. Παραστατικού), synoliki_axi (Συνολική Αξία)
            </code>
            <p className="text-sm text-muted-foreground mt-2">
              Αν κάποιες στήλες λείπουν, το σύστημα θα προσπαθήσει να τις εντοπίσει από το περιεχόμενο.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Αυτόματη Διόρθωση Δεδομένων</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Το σύστημα διαθέτει τις ακόλουθες δυνατότητες αυτόματης διόρθωσης:
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
              <li>Εντοπισμός και διόρθωση αριθμών παραστατικών και ημερομηνιών που έχουν εναλλαχθεί</li>
              <li>Αναγνώριση ποικίλων μορφών ημερομηνιών και αριθμών παραστατικών</li>
              <li>Διαχείριση κωδικοποιήσεων ISO-8859-7 για ελληνικούς χαρακτήρες</li>
              <li>Ανάλυση περιεχομένου για τον εντοπισμό στηλών χωρίς επικεφαλίδες</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Μετά το Ανέβασμα</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Μετά την επιτυχή επεξεργασία του αρχείου, μπορείτε να δείτε τα δεδομένα στην καρτέλα "Δεδομένα".
              Οι νέες εγγραφές προστίθενται στις υπάρχουσες, και οι διπλές εγγραφές παραλείπονται αυτόματα.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadTab;
