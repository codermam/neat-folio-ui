import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, Calendar, DollarSign } from 'lucide-react';
import { TransactionFilters, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/budget';

interface FiltersBarProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onClearFilters: () => void;
}

export function FiltersBar({ filters, onFiltersChange, onClearFilters }: FiltersBarProps) {
  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  const updateFilter = (key: keyof TransactionFilters, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  return (
    <Card className="transition-spring hover-lift border-0 shadow-xl overflow-hidden animate-fade-in-up stagger-1">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Filter className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">🔍 Filter Transactions</h3>
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="outline"
              onClick={onClearFilters}
              className="ml-auto hover:bg-destructive/10 hover:text-destructive transition-spring"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Description
            </Label>
            <Input
              placeholder="Search transactions..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="transition-smooth focus:shadow-glow"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <Select value={filters.category || ''} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger className="transition-smooth focus:shadow-glow">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${cat.color}`}></span>
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Start */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              From Date
            </Label>
            <Input
              type="date"
              value={filters.dateStart || ''}
              onChange={(e) => updateFilter('dateStart', e.target.value)}
              className="transition-smooth focus:shadow-glow"
            />
          </div>

          {/* Date Range End */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              To Date
            </Label>
            <Input
              type="date"
              value={filters.dateEnd || ''}
              onChange={(e) => updateFilter('dateEnd', e.target.value)}
              className="transition-smooth focus:shadow-glow"
            />
          </div>

          {/* Amount Range Min */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Min Amount
            </Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={filters.amountMin || ''}
              onChange={(e) => updateFilter('amountMin', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="transition-smooth focus:shadow-glow"
            />
          </div>

          {/* Amount Range Max */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Max Amount
            </Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="No limit"
              value={filters.amountMax || ''}
              onChange={(e) => updateFilter('amountMax', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="transition-smooth focus:shadow-glow"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-primary font-medium">
              🎯 Active filters applied - showing filtered results
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}