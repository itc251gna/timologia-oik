
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  onXLSExport: () => void;
  disabled?: boolean;
}

const ExportButton = ({ onXLSExport, disabled = false }: ExportButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      disabled={disabled}
      onClick={onXLSExport}
    >
      <Download className="h-4 w-4 mr-2" />
      Εξαγωγή Excel
    </Button>
  );
};

export default ExportButton;
