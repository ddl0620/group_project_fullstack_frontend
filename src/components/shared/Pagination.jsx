"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button.js"

export default function Pagination({
                                     currentPage,
                                     totalPages,
                                     onPageChange,
                                     totalItems,
                                     itemsPerPage,
                                     showItemCount = true,
                                     itemName = "items",
                                   }) {
  // Calculate the range of items being displayed
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Function to determine which page numbers to show - simplified to show max 3 pages
  const getPageNumbers = () => {
    // Always show at most 3 page numbers to prevent overflow
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage === 1) {
      return [1, 2, 3]
    }

    if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages]
    }

    return [currentPage - 1, currentPage, currentPage + 1]
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Item count info */}
      {showItemCount && totalItems > 0 && (
        <div className="text-sm text-gray-500 mb-4 text-center">
          Showing {indexOfFirstItem}-{indexOfLastItem} of {totalItems} {itemName}
        </div>
      )}

      {/* Pagination controls */}
      <div className="inline-flex items-center justify-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex mx-2">
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 mx-1"
              onClick={() => onPageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {pageNum}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
