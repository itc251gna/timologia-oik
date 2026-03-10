
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { parseCSV, validateCSV, iso88597ToUtf8, parseXML, CsvData, detectFileFormat } from '@/utils/csvParser';
import { saveData, clearData } from '@/utils/dataManagement';
import { fixFloatingPointErrors } from '@/utils/columnUtils';
import { Upload, FileText, AlertCircle, CheckCircle, Info, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface CsvUploaderProps {
  onDataChange?: () => void;
  selectedYear: number;
}

const CsvUploader = ({ onDataChange, selectedYear }: CsvUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'csv' | 'xml' | 'unknown'>('unknown');
  const [stats, setStats] = useState<{ added: number; skipped: number; total: number }>({ added: 0, skipped: 0, total: 0 });
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [skipDuplicateCheck, setSkipDuplicateCheck] = useState(false);
  const [clearExistingData, setClearExistingData] = useState(true);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string>('');
  const { toast } = useToast();

  // Τροποποιημένη συνάρτηση για φιλτράρισμα - τώρα επιστρέφει όλες τις εγγραφές
  // και διατηρεί το αρχικό ΑΑ από το αρχείο, με διόρθωση floating point errors
  const filterNewRecords = async (newData: CsvData[]): Promise<CsvData[]> => {
    // Διόρθωση floating point errors σε όλα τα χρηματικά πεδία
    const dataWithFixedNumbers = fixFloatingPointErrors(newData);
    
    // Αποθηκεύουμε τον συνολικό αριθμό εγγραφών για ακριβή στατιστικά
    const totalRecords = dataWithFixedNumbers.length;
    
    // Ενημερώνουμε τα στατιστικά
    setStats({
      added: totalRecords, 
      skipped: 0,
      total: totalRecords
    });
    
    console.log('Συνολικός αριθμός εγγραφών:', totalRecords);
    console.log('Έλεγχος για τα πεδία ΑΑ:', dataWithFixedNumbers.slice(0, 5).map(d => d.ΑΑ));
    console.log('Διόρθωση floating point errors ολοκληρώθηκε για όλες τις χρηματικές στήλες');
    
    // Verify and fix any missing ΑΑ values
    const dataWithValidAA = dataWithFixedNumbers.map((item, index) => {
      if (!item.ΑΑ || item.ΑΑ === '') {
        return { ...item, ΑΑ: (index + 1).toString() };
      }
      return item;
    });
    
    // Επιστρέφουμε τις εγγραφές με το σωστό ΑΑ και διορθωμένα floating point errors
    return dataWithValidAA;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    // Επαναφορά της κατάστασης πριν την έναρξη επεξεργασίας
    setIsUploading(true);
    setFileName(file.name);
    setErrorDetails(null);
    setUploadStatus('processing');
    setProcessingProgress(0);
    setFileType(fileExt === 'xml' ? 'xml' : fileExt === 'csv' ? 'csv' : 'unknown');
    setCurrentStage('Έλεγχος αρχείου');
    setStats({ added: 0, skipped: 0, total: 0 });

    try {
      // Αν έχει επιλεγεί η διαγραφή όλων των υπαρχόντων δεδομένων
      if (clearExistingData) {
        setCurrentStage(`Διαγραφή προηγούμενων δεδομένων έτους ${selectedYear}`);
        await clearData(selectedYear);
        toast({
          title: "Διαγραφή δεδομένων",
          description: `Όλα τα προηγούμενα δεδομένα του έτους ${selectedYear} έχουν διαγραφεί επιτυχώς.`,
        });
      }
      
      // Έλεγχος εγκυρότητας αρχείου
      setCurrentStage('Έλεγχος μορφής αρχείου');
      const isValid = await validateCSV(file);
      setProcessingProgress(10);
      
      if (!isValid) {
        setUploadStatus('error');
        setErrorDetails('Το αρχείο δεν έχει την αναμενόμενη μορφή. Ελέγξτε αν περιέχει όλες τις απαιτούμενες στήλες.');
        toast({
          title: "Μη έγκυρο αρχείο",
          description: "Το αρχείο δεν έχει τη σωστή μορφή. Ελέγξτε τις στήλες και προσπαθήστε ξανά.",
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }

      // Ανάγνωση περιεχομένου αρχείου
      setCurrentStage('Ανάγνωση περιεχομένου αρχείου');
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          if (!e.target || typeof e.target.result !== 'string') {
            throw new Error('Δεν ήταν δυνατή η ανάγνωση του αρχείου');
          }
          
          const fileContent = e.target.result;
          const fileFormat = detectFileFormat(fileContent);
          console.log('Detected file format:', fileFormat);
          setProcessingProgress(20);
          
          // Επεξεργασία με βάση τον τύπο αρχείου
          if (fileFormat === 'csv') {
            await processCsvContent(fileContent);
          } else if (fileFormat === 'xml') {
            await processXmlContent(fileContent);
          } else {
            await processUnknownFormat(fileContent);
          }
        } catch (error) {
          console.error('Error processing file content:', error);
          setUploadStatus('error');
          setErrorDetails(`Σφάλμα κατά την επεξεργασία του αρχείου: ${error instanceof Error ? error.message : 'Άγνωστο σφάλμα'}`);
          toast({
            title: "Σφάλμα επεξεργασίας",
            description: "Προέκυψε σφάλμα κατά την επεξεργασία του αρχείου.",
            variant: "destructive"
          });
          setIsUploading(false);
        }
      };
      
      reader.onerror = handleFileReadError;
      
      // Χρήση της κατάλληλης κωδικοποίησης ανάλογα με τον τύπο αρχείου
      if (fileExt === 'xml') {
        reader.readAsText(file, 'UTF-8');
      } else {
        reader.readAsText(file, 'ISO-8859-7'); 
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus('error');
      setErrorDetails(`Προέκυψε μη αναμενόμενο σφάλμα: ${error instanceof Error ? error.message : 'Άγνωστο σφάλμα'}`);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά την επεξεργασία του αρχείου.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  const processCsvContent = async (content: string) => {
    setCurrentStage('Ανάλυση CSV περιεχομένου');
    console.log('Processing as CSV with ISO-8859-7 encoding...');
    
    // Μετατροπή ISO-8859-7 σε UTF-8
    const processedContent = iso88597ToUtf8(content);
    let parsedData = parseCSV(processedContent);
    setProcessingProgress(30);
    
    if (parsedData.length === 0) {
      console.log('ISO-8859-7 conversion didn\'t produce results, trying direct parsing...');
      parsedData = parseCSV(content);
    }
    
    if (parsedData.length === 0) {
      handleEmptyParseResult('CSV');
      return;
    }
    
    await processDataRecords(parsedData);
  };

  const processXmlContent = async (content: string) => {
    setCurrentStage('Ανάλυση XML περιεχομένου');
    console.log('Processing as XML...');
    
    // Έλεγχος για αρχείο XML Excel
    const isExcelXML = content.includes('xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"') || 
                       content.includes('urn:schemas-microsoft-com:office:excel');
    
    if (isExcelXML) {
      console.log('Detected Excel XML format');
      setCurrentStage('Ανάλυση Excel XML περιεχομένου');
      toast({
        title: "Ανίχνευση μορφής",
        description: "Ανιχνεύθηκε αρχείο Excel XML. Επεξεργασία...",
      });
    }
    
    // Τμηματική επεξεργασία για μεγάλα αρχεία XML
    try {
      setProcessingProgress(30);
      const parsedData = parseXML(content);
      setProcessingProgress(40);
      
      if (parsedData.length === 0) {
        handleEmptyParseResult('XML');
        return;
      }
      
      await processDataRecords(parsedData);
    } catch (error) {
      console.error('XML parsing error:', error);
      setUploadStatus('error');
      setErrorDetails(`Σφάλμα κατά την ανάλυση του XML: ${error instanceof Error ? error.message : 'Άγνωστο σφάλμα'}`);
      toast({
        title: "Σφάλμα ανάλυσης XML",
        description: "Προέκυψε σφάλμα κατά την ανάλυση του αρχείου XML.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  const processUnknownFormat = async (content: string) => {
    setCurrentStage('Προσπάθεια ανίχνευσης μορφής αρχείου');
    console.log('Unknown format, trying both CSV and XML parsing...');
    
    // Δοκιμή για CSV πρώτα
    const processedCsvContent = iso88597ToUtf8(content);
    let parsedData = parseCSV(processedCsvContent);
    
    // Αν δεν βρέθηκαν δεδομένα ως CSV, δοκιμή για XML
    if (parsedData.length === 0) {
      setCurrentStage('Προσπάθεια ανάλυσης ως XML');
      parsedData = parseXML(content);
    }
    
    if (parsedData.length === 0) {
      setUploadStatus('error');
      setErrorDetails('Δεν αναγνωρίστηκε η μορφή του αρχείου. Βεβαιωθείτε ότι είναι CSV με διαχωριστικό ; ή έγκυρο XML.');
      toast({
        title: "Άγνωστη μορφή",
        description: "Το περιεχόμενο του αρχείου δεν αναγνωρίστηκε ως CSV ή XML.",
        variant: "destructive"
      });
      setIsUploading(false);
      return;
    }
    
    await processDataRecords(parsedData);
  };

  const handleEmptyParseResult = (format: string) => {
    setUploadStatus('error');
    setErrorDetails(`Δεν ήταν δυνατή η ανάγνωση δεδομένων από το αρχείο ${format}. Βεβαιωθείτε ότι έχει το σωστό περιεχόμενο και μορφή.`);
    toast({
      title: "Σφάλμα ανάλυσης",
      description: `Δεν μπορέσαμε να διαβάσουμε δεδομένα από το αρχείο ${format}. Βεβαιωθείτε ότι ακολουθεί το σωστό πρότυπο.`,
      variant: "destructive"
    });
    setIsUploading(false);
  };

  const processDataRecords = async (parsedData: CsvData[]) => {
    console.log(`Επιτυχής ανάλυση ${parsedData.length} εγγραφών για έτος ${selectedYear}`);
    
    try {
      const totalRecordsInFile = parsedData.length;
      
      setCurrentStage('Προετοιμασία εγγραφών για αποθήκευση');
      const dataToSave = await filterNewRecords(parsedData);
      
      if (dataToSave.length > 0) {
        setCurrentStage(`Αποθήκευση στη βάση δεδομένων (έτος ${selectedYear})`);
        try {
          await saveData(dataToSave, selectedYear);
          
          // Get table name for verification
          const tableName = selectedYear === 2025 ? 'vendors' : `vendors_${selectedYear}`;
          const { count } = await supabase
            .from(tableName as any)
            .select('*', { count: 'exact', head: true });
          
          console.log(`Επιβεβαιωμένες εγγραφές στη βάση για έτος ${selectedYear}: ${count}`);
          
          const added = count || 0;
          const skipped = totalRecordsInFile - added;
          setStats({ 
            added, 
            skipped, 
            total: totalRecordsInFile 
          });
          
        } catch (saveError) {
          console.error('Σφάλμα κατά την αποθήκευση:', saveError);
          toast({
            title: "Προσοχή",
            description: "Παρουσιάστηκε πρόβλημα κατά την αποθήκευση. Κάποιες εγγραφές ενδέχεται να μην αποθηκεύτηκαν.",
            variant: "destructive"
          });
        }
      }
      
      setProcessingProgress(100);
      setUploadStatus('success');
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά την αποθήκευση των δεδομένων.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileReadError = (error: ProgressEvent<FileReader>) => {
    console.error('Error reading file:', error);
    setUploadStatus('error');
    setErrorDetails('Δεν ήταν δυνατή η ανάγνωση του αρχείου. Δοκιμάστε ξανά με άλλο αρχείο.');
    toast({
      title: "Σφάλμα ανάγνωσης",
      description: "Δεν ήταν δυνατή η ανάγνωση του αρχείου. Προσπαθήστε ξανά.",
      variant: "destructive"
    });
    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleClearData = () => {
    setClearDialogOpen(true);
  };

  const confirmClearData = async () => {
    try {
      await clearData(selectedYear);
      toast({
        title: "Επιτυχία",
        description: `Όλες οι εγγραφές του έτους ${selectedYear} έχουν διαγραφεί.`,
      });
      setClearDialogOpen(false);
      setUploadStatus('idle');
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά τη διαγραφή των δεδομένων.",
        variant: "destructive"
      });
    }
  };

  const toggleAdvancedOptions = () => {
    setAdvancedOptionsOpen(!advancedOptionsOpen);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ανέβασμα Αρχείου για Έτος {selectedYear}</CardTitle>
        <CardDescription>
          Επιλέξτε ή σύρετε αρχείο CSV ή XML με τα δεδομένα των προμηθευτών που θα αποθηκευτούν στο έτος {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
            } transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer h-48`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center w-full">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
                <p className="mb-2">{currentStage || 'Επεξεργασία αρχείου...'}</p>
                <Progress value={processingProgress} className="w-full max-w-xs" />
                <p className="text-xs text-muted-foreground mt-2">{processingProgress}%</p>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Σύρετε ένα αρχείο CSV ή XML εδώ, ή κάντε κλικ για να επιλέξετε
                  </p>
                  {fileName && (
                    <div className="flex items-center justify-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      {fileName}
                      {fileType && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{fileType.toUpperCase()}</span>}
                    </div>
                  )}
                </div>
              </>
            )}
            <input
              id="fileInput"
              type="file"
              accept=".csv,.xml"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleAdvancedOptions}
              className="flex items-center justify-center gap-1 w-full md:w-auto"
            >
              <Settings className="h-4 w-4" />
              {advancedOptionsOpen ? 'Απόκρυψη' : 'Προβολή'} προχωρημένων επιλογών
            </Button>
            
            {advancedOptionsOpen && (
              <div className="border rounded-md p-3 bg-muted/30 space-y-3 mt-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="skipDuplicateCheck" 
                    checked={skipDuplicateCheck} 
                    onCheckedChange={setSkipDuplicateCheck} 
                  />
                  <Label htmlFor="skipDuplicateCheck">Παράλειψη ελέγχου για διπλότυπες εγγραφές</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="clearExistingData" 
                    checked={clearExistingData} 
                    onCheckedChange={setClearExistingData} 
                  />
                  <Label htmlFor="clearExistingData">Διαγραφή όλων των υπαρχόντων δεδομένων πριν την εισαγωγή</Label>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Προσοχή: Αυτές οι επιλογές μπορεί να οδηγήσουν σε απώλεια δεδομένων ή διπλές εγγραφές.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleClearData}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Διαγραφή όλων των εγγραφών του έτους {selectedYear}
            </Button>
          </div>

          {uploadStatus === 'success' && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Επιτυχία</AlertTitle>
              <AlertDescription className="text-green-700">
                Το αρχείο ανέβηκε και αναλύθηκε με επιτυχία στο έτος {selectedYear}.
                {stats.total > 0 && (
                  <div className="mt-1">Το αρχείο περιείχε συνολικά {stats.total} εγγραφές.</div>
                )}
                {stats.added > 0 && (
                  <div className="mt-1">Προστέθηκαν {stats.added} νέες εγγραφές.</div>
                )}
                {stats.skipped > 0 && (
                  <div className="mt-1">Παραλείφθηκαν {stats.skipped} διπλές εγγραφές.</div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === 'error' && (
            <Alert className="mt-4 bg-red-50 border-red-200" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Σφάλμα</AlertTitle>
              <AlertDescription>
                Προέκυψε σφάλμα κατά την επεξεργασία του αρχείου. 
                {errorDetails && (
                  <div className="mt-2 p-2 bg-red-100 rounded-md text-sm">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{errorDetails}</span>
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        <div className="space-y-1">
          <p>Σημείωση: Υποστηρίζονται αρχεία με τις ακόλουθες στήλες:</p>
          <p className="text-gray-400 truncate max-w-full">id;foreas;etos;katigoria;ar_ent;st_ent;kod_prom;eponymia;afm;im_exoflisis;ar_parastatikou;im_parastatikou;synoliki_axi;foros_3;foros_4;foros_8;foros_20;synolo_kratiseon;plirotea_axia</p>
        </div>
      </CardFooter>

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Διαγραφή όλων των εγγραφών του έτους {selectedYear}</AlertDialogTitle>
            <AlertDialogDescription>
              Είστε βέβαιοι ότι θέλετε να διαγράψετε όλες τις εγγραφές του έτους {selectedYear}; 
              Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Άκυρο</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmClearData}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Διαγραφή
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CsvUploader;
