
import { DateRange } from "react-day-picker";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter, Calendar } from 'lucide-react';
import { HeatmapFilterOptions } from '@/hooks/analytics/use-heatmap-data';

interface FilterDialogProps {
  filters: HeatmapFilterOptions;
  setFilters: (filters: HeatmapFilterOptions) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const FilterDialog = ({ 
  filters, 
  setFilters, 
  dateRange, 
  setDateRange, 
  applyFilters,
  resetFilters 
}: FilterDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Heatmap Filters</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date-range">Date Range</Label>
            <div className="flex flex-col space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="device-type">Device Type</Label>
            <Select
              value={filters.deviceType}
              onValueChange={(value) => setFilters({...filters, deviceType: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="session-id">Session ID (optional)</Label>
            <Input
              id="session-id"
              value={filters.sessionId || ''}
              onChange={(e) => setFilters({...filters, sessionId: e.target.value || undefined})}
              placeholder="Enter specific session ID"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="aggregation-type">Aggregation Type</Label>
            <Select
              value={filters.aggregationType}
              onValueChange={(value) => setFilters({
                ...filters, 
                aggregationType: value as 'density' | 'time' | 'element'
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select aggregation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="density">Density (Points)</SelectItem>
                <SelectItem value="time">Time-based</SelectItem>
                <SelectItem value="element">Element-based</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={resetFilters}>Reset</Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
