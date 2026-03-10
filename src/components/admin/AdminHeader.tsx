
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Home } from 'lucide-react';
import { logout } from '@/utils/auth';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/Logo';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Αποσύνδεση",
      description: "Έχετε αποσυνδεθεί επιτυχώς.",
    });
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Logo showText={false} className="h-8 w-8 mr-2" clickable={true} onClick={handleLogoClick} />
          <h1 className="text-2xl font-bold text-greek-blue">Ενημέρωση προμηθευτών - Διαχείριση</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleHomeClick}>
            <Home className="h-4 w-4 mr-2" />
            Αρχική
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Αποσύνδεση
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
