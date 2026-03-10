
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getData } from '@/utils/dataFetching';
import { clearData } from '@/utils/dataManagement';
import { isAuthenticated } from '@/utils/auth';
import { getMostRecentYear } from '@/utils/yearManagement';
import { CsvData } from '@/utils/csvParser';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, Table, CalendarIcon, Search } from 'lucide-react';

// Import our components
import AdminHeader from '@/components/admin/AdminHeader';
import AdminFooter from '@/components/admin/AdminFooter';
import UploadTab from '@/components/admin/UploadTab';
import DataTab from '@/components/admin/DataTab';
import DeleteDataDialog from '@/components/admin/DeleteDataDialog';
import YearManagement from '@/components/admin/YearManagement';
import AdminSearchTab from '@/components/admin/AdminSearchTab';

const Admin = () => {
  const [data, setData] = useState<CsvData[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Load most recent year on mount
    const loadMostRecentYear = async () => {
      try {
        const mostRecent = await getMostRecentYear();
        setSelectedYear(mostRecent);
      } catch (error) {
        console.error('Error loading most recent year:', error);
      }
    };
    
    loadMostRecentYear();
  }, [navigate]);

  useEffect(() => {
    // Refresh data when selected year changes
    if (selectedYear) {
      refreshData();
    }
  }, [selectedYear]);

  const refreshData = async () => {
    console.log(`Refreshing data from storage for year ${selectedYear}`);
    try {
      setIsRefreshing(true);
      const storedData = await getData(selectedYear);
      setData(storedData);
      setTotalRecords(storedData.length);
      setIsRefreshing(false);
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά την ανάκτηση των δεδομένων.",
        variant: "destructive"
      });
      setIsRefreshing(false);
    }
  };

  const handleRefreshData = () => {
    refreshData();
    toast({
      title: "Ενημέρωση",
      description: `Τα δεδομένα του έτους ${selectedYear} ανανεώθηκαν επιτυχώς.`,
    });
  };

  const handleDeleteData = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteSuccess = () => {
    setData([]);
    setTotalRecords(0);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If switching to the data tab, refresh the data
    if (value === "data") {
      refreshData();
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  // Formatted record count display
  const formattedRecordCount = () => {
    if (totalRecords === null) return 'Φόρτωση...';
    if (totalRecords === 0) return `Δεν υπάρχουν δεδομένα για το έτος ${selectedYear}`;
    return `${data.length} από ${totalRecords} εγγραφές (${selectedYear})`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="w-full px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="search" className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Αναζήτηση ΑΦΜ
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center">
                <UploadCloud className="h-4 w-4 mr-2" />
                Ανέβασμα Αρχείων
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center">
                <Table className="h-4 w-4 mr-2" />
                Δεδομένα
              </TabsTrigger>
              <TabsTrigger value="years" className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Διαχείριση Ετών
              </TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground">
              {formattedRecordCount()}
            </div>
          </div>

          <TabsContent value="search">
            <div className="container mx-auto">
              <AdminSearchTab />
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="container mx-auto">
              <UploadTab onDataChange={refreshData} />
            </div>
          </TabsContent>
          
          <TabsContent value="data">
            <DataTab 
              data={data}
              totalRecords={totalRecords}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              onTabChange={handleTabChange}
              onDeleteData={handleDeleteData}
              onRefreshData={handleRefreshData}
              isDeleting={isDeleting}
              isRefreshing={isRefreshing}
            />
          </TabsContent>

          <TabsContent value="years">
            <div className="container mx-auto">
              <YearManagement />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <AdminFooter />

      <DeleteDataDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
        selectedYear={selectedYear}
      />
    </div>
  );
};

export default Admin;
