
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import FilterDialog from './FilterDialog';
import { DateRange } from "react-day-picker";
import { HeatmapFilterOptions } from '@/hooks/analytics/use-heatmap-data';
import { format } from 'date-fns';

interface HeatmapHeaderProps {
  isLoading: boolean;
  displayMode: string;
  setDisplayMode: (mode: any) => void;
  selectedPage: string;
  setSelectedPage: (page: string) => void;
  filters: HeatmapFilterOptions;
  setFilters: (filters: HeatmapFilterOptions) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const HeatmapHeader = ({
  isLoading,
  displayMode,
  setDisplayMode,
  selectedPage,
  setSelectedPage,
  filters,
  setFilters,
  dateRange,
  setDateRange,
  applyFilters,
  resetFilters
}: HeatmapHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          AI-Enhanced
        </Badge>
        <span className="text-sm text-muted-foreground">
          {isLoading ? 'Loading...' : 'Updated just now'}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <FilterDialog 
          filters={filters}
          setFilters={setFilters}
          dateRange={dateRange}
          setDateRange={setDateRange}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
        />
        
        <Select defaultValue={displayMode} onValueChange={(value) => setDisplayMode(value as any)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Data type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clicks">Clicks</SelectItem>
            <SelectItem value="hover">Hover</SelectItem>
            <SelectItem value="scrolls">Scrolls</SelectItem>
            <SelectItem value="movements">Movements</SelectItem>
            <SelectItem value="attention">Attention</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue={selectedPage} onValueChange={setSelectedPage}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="homepage">Homepage</SelectItem>
            <SelectItem value="about">About Us</SelectItem>
            <SelectItem value="pricing">Pricing</SelectItem>
            <SelectItem value="contact">Contact</SelectItem>
            <SelectItem value="dashboard">Dashboard</SelectItem>
            <SelectItem value="analytics">Analytics</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default HeatmapHeader;
