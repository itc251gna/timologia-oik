
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Search, Shield } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Logo className="h-32 w-32" />
      <div className="mt-8 text-center">
        <h1 className="text-3xl font-bold text-greek-blue">Ενημέρωση προμηθευτών</h1>
        <p className="text-muted-foreground mt-2 mb-8">
          Αναζητήστε πληροφορίες σχετικά με εξοφλήσεις προμηθευτών ή συνδεθείτε στο διαχειριστικό panel
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/search')}
            className="bg-greek-blue hover:bg-greek-blue-dark flex gap-2 items-center"
            size="lg"
          >
            <Search className="h-4 w-4" />
            Αναζήτηση
          </Button>
          
          <Button 
            onClick={() => navigate('/login')}
            variant="outline"
            className="border-greek-blue text-greek-blue hover:bg-greek-blue/5 flex gap-2 items-center"
            size="lg"
          >
            <Shield className="h-4 w-4" />
            Διαχείριση
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
