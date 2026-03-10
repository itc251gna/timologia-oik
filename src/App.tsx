
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // We can't set characterSet directly as it's read-only
    // Instead, we'll just ensure the meta tags are set properly
    
    // Ensure the page has the correct meta tags for character encoding
    const metaCharset = document.querySelector('meta[charset]');
    if (!metaCharset) {
      const meta = document.createElement('meta');
      meta.setAttribute('charset', 'UTF-8');
      document.head.appendChild(meta);
    } else {
      metaCharset.setAttribute('charset', 'UTF-8');
    }
    
    // Set content-type meta with proper UTF-8 encoding
    let metaHttpEquiv = document.querySelector('meta[http-equiv="Content-Type"]');
    if (!metaHttpEquiv) {
      metaHttpEquiv = document.createElement('meta');
      metaHttpEquiv.setAttribute('http-equiv', 'Content-Type');
      metaHttpEquiv.setAttribute('content', 'text/html; charset=UTF-8');
      document.head.appendChild(metaHttpEquiv);
    } else {
      metaHttpEquiv.setAttribute('content', 'text/html; charset=UTF-8');
    }
    
    // Add viewport meta tag for proper rendering on all devices
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement('meta');
      metaViewport.setAttribute('name', 'viewport');
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      document.head.appendChild(metaViewport);
    }
    
    // Set page title with proper encoding
    document.title = "Ενημέρωση προμηθευτών";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
