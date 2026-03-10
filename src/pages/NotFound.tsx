
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-greek-blue">404</h1>
        <p className="text-xl text-gray-600 mb-6">Η σελίδα δεν βρέθηκε</p>
        <p className="text-muted-foreground mb-8">
          Η σελίδα που προσπαθείτε να επισκεφθείτε δεν υπάρχει ή έχει μετακινηθεί.
        </p>
        <Button asChild className="bg-greek-blue hover:bg-greek-blue-dark">
          <a href="/">
            <Home className="h-4 w-4 mr-2" />
            Επιστροφή στην αρχική
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
