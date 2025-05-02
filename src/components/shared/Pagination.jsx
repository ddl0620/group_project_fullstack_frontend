'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button.js';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showItemCount = true,
  itemName = 'items',
}) {
  // Calculate the range of items being displayed
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Function to determine which page numbers to show
  const getPageNumbers = () => {
    // On mobile, show fewer page numbers
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
      return Array.from({ length: maxVisiblePages }, (_, i) => i + 1);
    }

    if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
      return Array.from(
        { length: maxVisiblePages },
        (_, i) => totalPages - maxVisiblePages + i + 1
      );
    }

    return Array.from(
      { length: maxVisiblePages },
      (_, i) => currentPage - Math.floor(maxVisiblePages / 2) + i
    );
  };

  return (
    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      {showItemCount && totalItems > 0 && (
        <div className="text-xs text-gray-700 sm:text-sm">
          Showing <span className="font-medium">{indexOfFirstItem}</span> to{' '}
          <span className="font-medium">{indexOfLastItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> {itemName}
        </div>
      )}

      <div className="flex justify-center space-x-1 sm:justify-end sm:space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 sm:h-9 sm:w-9"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {getPageNumbers().map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? 'default' : 'outline'}
            size="sm"
            className="h-8 w-8 p-0 sm:h-9 sm:w-9 sm:px-3"
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 sm:h-9 sm:w-9"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}
