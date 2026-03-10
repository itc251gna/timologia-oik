
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBoxProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox = ({ searchTerm, onSearch }: SearchBoxProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Αναζήτηση..."
        value={searchTerm}
        onChange={onSearch}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBox;
