import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  X,
  SlidersHorizontal,
  Unlock,
  LockIcon,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Event types based on the provided enum
const EVENT_TYPES = [
  'SOCIAL',
  'EDUCATION',
  'BUSINESS',
  'ENTERTAINMENT',
  'OTHER',
];

export default function EventFilters({
  searchTerm,
  setSearchTerm,
  visibilityFilter,
  setVisibilityFilter,
  selectedTypes,
  setSelectedTypes,
  sortBy,
  setSortBy,
  clearFilters,
  showVisibilityFilter = true,
}) {
  const [activeFilters, setActiveFilters] = useState(0);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (visibilityFilter !== 'all') count++;
    if (selectedTypes.length > 0) count++;
    if (sortBy !== 'newest') count++;
    setActiveFilters(count);
  }, [visibilityFilter, selectedTypes, sortBy]);

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <>
      {/* Search and Filter Bar */}
      <div className="mb-4 flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm sm:mb-8 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          {/*<Search className="absolute top-1/2 left-2 sm:left-3 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />*/}
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 px-3 py-2 pl-7 text-xs sm:h-10 sm:pl-9 sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-8 gap-1 px-3 py-1 text-xs sm:h-10 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="xs:inline hidden">
                  {sortBy === 'newest' && 'Newest'}
                  {sortBy === 'oldest' && 'Oldest'}
                  {sortBy === 'upcoming' && 'Upcoming'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 sm:w-48">
              <DropdownMenuLabel className="text-xs sm:text-sm">
                Sort Events
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortBy('newest')}
                className="text-xs sm:text-sm"
              >
                <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('oldest')}
                className="text-xs sm:text-sm"
              >
                <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('upcoming')}
                className="text-xs sm:text-sm"
              >
                <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Upcoming Events
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="h-8 gap-1 px-3 py-1 text-xs sm:hidden sm:h-10 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="xs:inline hidden">Filters</span>
                {activeFilters > 0 && (
                  <Badge className="ml-1 h-4 w-4 rounded-full p-0 text-[10px] sm:h-5 sm:w-5 sm:text-xs">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[280px] p-4 sm:w-[400px] sm:p-6">
              <SheetHeader>
                <SheetTitle className="text-base sm:text-lg">
                  Filter Events
                </SheetTitle>
                <SheetDescription className="text-xs sm:text-sm">
                  Apply filters to find the perfect events for you
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 flex flex-col gap-4 sm:mt-6 sm:gap-6">
                {/* Visibility Filter */}
                {showVisibilityFilter && (
                  <>
                    <div>
                      <h3 className="mb-2 text-xs font-medium sm:text-sm">
                        Event Visibility
                      </h3>
                      <RadioGroup
                        value={visibilityFilter}
                        onValueChange={setVisibilityFilter}
                        className="space-y-1 sm:space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="mobile-all" />
                          <Label
                            htmlFor="mobile-all"
                            className="text-xs sm:text-sm"
                          >
                            All Events
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="mobile-public" />
                          <Label
                            htmlFor="mobile-public"
                            className="text-xs sm:text-sm"
                          >
                            Public Events
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="mobile-private" />
                          <Label
                            htmlFor="mobile-private"
                            className="text-xs sm:text-sm"
                          >
                            Private Events
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Event Types Filter */}
                <div>
                  <h3 className="mb-2 text-xs font-medium sm:text-sm">
                    Event Types
                  </h3>
                  <div className="flex max-h-[180px] flex-col gap-1 overflow-y-auto sm:gap-2">
                    {EVENT_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => handleTypeToggle(type)}
                          className="h-3 w-3 sm:h-4 sm:w-4"
                        />
                        <Label
                          htmlFor={`mobile-type-${type}`}
                          className="text-xs sm:text-sm"
                        >
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter className="mt-4 flex-row justify-between gap-2 sm:mt-6">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-8 flex-1 text-xs sm:h-10 sm:text-sm"
                >
                  Clear Filters
                </Button>
                <SheetClose asChild>
                  <Button className="h-8 flex-1 text-xs sm:h-10 sm:text-sm">
                    Apply Filters
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Desktop Filter Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="hidden h-8 gap-1 px-3 py-1 text-xs sm:flex sm:h-10 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
              >
                <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                Filters
                {activeFilters > 0 && (
                  <Badge className="ml-1 h-4 w-4 rounded-full p-0 text-[10px] sm:h-5 sm:w-5 sm:text-xs">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[250px] sm:w-[300px]">
              <DropdownMenuLabel className="text-xs sm:text-sm">
                Filter Events
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="p-3 sm:p-4">
                {/* Visibility Filter */}
                {showVisibilityFilter && (
                  <>
                    <h4 className="mb-2 text-xs font-medium sm:text-sm">
                      Event Visibility
                    </h4>
                    <div className="mb-3 flex flex-wrap gap-1 sm:mb-4 sm:gap-2">
                      <Badge
                        variant={
                          visibilityFilter === 'all' ? 'default' : 'outline'
                        }
                        className="h-5 cursor-pointer text-[10px] sm:h-6 sm:text-xs"
                        onClick={() => setVisibilityFilter('all')}
                      >
                        All
                      </Badge>
                      <Badge
                        variant={
                          visibilityFilter === 'public' ? 'default' : 'outline'
                        }
                        className="h-5 cursor-pointer text-[10px] sm:h-6 sm:text-xs"
                        onClick={() => setVisibilityFilter('public')}
                      >
                        <Unlock className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        Public
                      </Badge>
                      <Badge
                        variant={
                          visibilityFilter === 'private' ? 'default' : 'outline'
                        }
                        className="h-5 cursor-pointer text-[10px] sm:h-6 sm:text-xs"
                        onClick={() => setVisibilityFilter('private')}
                      >
                        <LockIcon className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        Private
                      </Badge>
                    </div>
                  </>
                )}

                {/* Event Types Filter */}
                <h4 className="mb-2 text-xs font-medium sm:text-sm">
                  Event Types
                </h4>
                <div className="mb-2 flex max-h-[120px] flex-wrap gap-1 overflow-y-auto sm:max-h-[150px] sm:gap-2">
                  {EVENT_TYPES.map((type) => (
                    <Badge
                      key={type}
                      variant={
                        selectedTypes.includes(type) ? 'default' : 'outline'
                      }
                      className="h-5 cursor-pointer text-[10px] sm:h-6 sm:text-xs"
                      onClick={() => handleTypeToggle(type)}
                    >
                      {selectedTypes.includes(type) && (
                        <Tag className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      )}
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="justify-center text-xs font-medium text-red-500 focus:text-red-500 sm:text-sm"
                onClick={clearFilters}
              >
                <X className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                Clear All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1 px-1 py-1 sm:mb-4 sm:gap-2 sm:px-0 sm:py-0">
          <span className="text-xs font-medium text-gray-500 sm:text-sm">
            Active filters:
          </span>

          {visibilityFilter !== 'all' && showVisibilityFilter && (
            <Badge
              variant="secondary"
              className="h-5 gap-1 px-2 py-0.5 text-[10px] sm:h-6 sm:text-xs"
            >
              {visibilityFilter === 'public' ? (
                <>
                  <Unlock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  Public Events
                </>
              ) : (
                <>
                  <LockIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  Private Events
                </>
              )}
              <X
                className="ml-1 h-2.5 w-2.5 cursor-pointer sm:h-3 sm:w-3"
                onClick={() => setVisibilityFilter('all')}
              />
            </Badge>
          )}

          {selectedTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="h-5 gap-1 px-2 py-0.5 text-[10px] sm:h-6 sm:text-xs"
            >
              <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {type.charAt(0) + type.slice(1).toLowerCase()}
              <X
                className="ml-1 h-2.5 w-2.5 cursor-pointer sm:h-3 sm:w-3"
                onClick={() => handleTypeToggle(type)}
              />
            </Badge>
          ))}

          {activeFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-5 gap-1 px-1 text-[10px] font-medium text-gray-500 sm:h-7 sm:px-2 sm:text-xs"
            >
              <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              Clear all
            </Button>
          )}
        </div>
      )}
    </>
  );
}
