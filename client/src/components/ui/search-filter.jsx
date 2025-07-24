import React, { useState, useMemo } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './dropdown-menu';
import { cn } from '../../lib/utils';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const SearchFilter = ({ 
  onSearch, 
  onFilter, 
  filters = {}, 
  activeFilters = {},
  placeholder = "Search...",
  className,
  showAdvanced = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(activeFilters);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...tempFilters };
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setTempFilters(newFilters);
  };

  const applyFilters = () => {
    onFilter?.(tempFilters);
    setShowAdvancedFilters(false);
  };

  const clearFilters = () => {
    setTempFilters({});
    setSearchTerm('');
    onFilter?.({});
    onSearch?.('');
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  const PriceRangeFilter = () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Price Range</label>
      <div className="flex space-x-2">
        <Input
          placeholder="Min"
          type="number"
          value={tempFilters.priceMin || ''}
          onChange={(e) => handleFilterChange('priceMin', e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Max"
          type="number"
          value={tempFilters.priceMax || ''}
          onChange={(e) => handleFilterChange('priceMax', e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );

  const PropertyTypeFilter = () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Property Type</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {tempFilters.propertyType || 'Select type'}
            <FunnelIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleFilterChange('propertyType', null)}>
            All Types
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {filters.propertyTypes?.map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => handleFilterChange('propertyType', type)}
            >
              {type}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const LocationFilter = () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Location</label>
      <Input
        placeholder="Enter location"
        value={tempFilters.location || ''}
        onChange={(e) => handleFilterChange('location', e.target.value)}
      />
    </div>
  );

  const AmenitiesFilter = () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Amenities</label>
      <div className="grid grid-cols-2 gap-2">
        {filters.amenities?.map((amenity) => (
          <label key={amenity} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={tempFilters.amenities?.includes(amenity) || false}
              onChange={(e) => {
                const current = tempFilters.amenities || [];
                const updated = e.target.checked
                  ? [...current, amenity]
                  : current.filter(a => a !== amenity);
                handleFilterChange('amenities', updated);
              }}
              className="rounded border-muted-foreground"
            />
            <span>{amenity}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {showAdvanced && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="gap-2"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}

        {/* Active Filter Tags */}
        {Object.entries(activeFilters).map(([key, value]) => (
          <Badge
            key={key}
            variant="secondary"
            className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => {
              const newFilters = { ...activeFilters };
              delete newFilters[key];
              onFilter?.(newFilters);
            }}
          >
            {key}: {Array.isArray(value) ? value.join(', ') : value}
            <XMarkIcon className="h-3 w-3" />
          </Badge>
        ))}

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PriceRangeFilter />
              <PropertyTypeFilter />
              <LocationFilter />
              <AmenitiesFilter />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(false)}
              >
                Cancel
              </Button>
              <Button onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { SearchFilter };