
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/utils/auth';
import { useToast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';
import Logo from '@/components/Logo';

const Login = () => {
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Attempt to login
    const success = login(password);
    
    if (success) {
      toast({
        title: "Επιτυχής σύνδεση",
        description: "Καλωσήρθατε στο διαχειριστικό panel.",
      });
      navigate('/admin');
    } else {
      toast({
        title: "Αποτυχία σύνδεσης",
        description: "Λανθασμένο συνθηματικό. Παρακαλώ προσπαθήστε ξανά.",
        variant: "destructive"
      });
      setIsLoggingIn(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo className="h-20 w-20" clickable={true} onClick={handleLogoClick} />
          <p className="text-muted-foreground mt-2">Σύστημα Διαχείρισης Δεδομένων</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="greek-header">Σύνδεση Διαχειριστή</CardTitle>
            <CardDescription>
              Εισάγετε το συνθηματικό διαχειριστή για να συνεχίσετε
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Συνθηματικό</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Εισάγετε το συνθηματικό σας"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-greek-blue hover:bg-greek-blue-dark" 
                disabled={isLoggingIn || !password}
              >
                {isLoggingIn ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                    Σύνδεση...
                  </>
                ) : 'Σύνδεση'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-greek-blue hover:underline">
            Επιστροφή στην αρχική σελίδα
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
