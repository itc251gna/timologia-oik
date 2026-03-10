
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getAvailableYears, getMostRecentYear, YearData } from '@/utils/yearManagement';
import { useToast } from '@/components/ui/use-toast';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  label?: string;
  placeholder?: string;
}

const YearSelector = ({ selectedYear, onYearChange, label = "Έτος", placeholder = "Επιλέξτε έτος" }: YearSelectorProps) => {
  const [availableYears, setAvailableYears] = useState<YearData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAvailableYears();
  }, []);

  const loadAvailableYears = async () => {
    try {
      setIsLoading(true);
      const years = await getAvailableYears();
      setAvailableYears(years);
      
      // If no year is selected and we have years available, select the most recent
      if (!selectedYear && years.length > 0) {
        const mostRecent = await getMostRecentYear();
        onYearChange(mostRecent);
      }
    } catch (error) {
      console.error('Error loading available years:', error);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά τη φόρτωση των ετών",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Φόρτωση..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((year) => (
            <SelectItem key={year.year} value={year.year.toString()}>
              {year.year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default YearSelector;
