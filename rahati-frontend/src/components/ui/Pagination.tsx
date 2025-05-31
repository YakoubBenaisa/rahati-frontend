import React from 'react';
import classNames from 'classnames';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showFirstLast = true,
  maxVisiblePages = 5,
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Calculate the range of page numbers to display
  const getPageRange = () => {
    // If total pages is less than or equal to max visible pages, show all pages
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate the start and end of the page range
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = start + maxVisiblePages - 1;

    // Adjust if end exceeds total pages
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageRange = getPageRange();

  // Button styles
  const buttonBaseClasses = "relative inline-flex items-center px-4 py-2 text-sm font-medium";
  const activeButtonClasses = "z-10 bg-[var(--color-primary-500)] text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-500)]";
  const inactiveButtonClasses = "text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] focus:z-20 focus:outline-offset-0";
  const disabledButtonClasses = "text-[var(--color-text-tertiary)] cursor-not-allowed";

  return (
    <nav className={classNames("flex items-center justify-center", className)} aria-label="Pagination">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={classNames(
          buttonBaseClasses,
          "rounded-l-md",
          currentPage === 1 ? disabledButtonClasses : inactiveButtonClasses
        )}
        aria-label="Previous page"
      >
        <span className="sr-only">Previous</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
        </svg>
      </button>

      {/* First page button */}
      {showFirstLast && currentPage > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={classNames(buttonBaseClasses, inactiveButtonClasses)}
            aria-label="Page 1"
          >
            1
          </button>
          {currentPage > 4 && (
            <span className={classNames(buttonBaseClasses, disabledButtonClasses)}>
              ...
            </span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pageRange.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={classNames(
            buttonBaseClasses,
            page === currentPage ? activeButtonClasses : inactiveButtonClasses
          )}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && (
            <span className={classNames(buttonBaseClasses, disabledButtonClasses)}>
              ...
            </span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={classNames(buttonBaseClasses, inactiveButtonClasses)}
            aria-label={`Page ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={classNames(
          buttonBaseClasses,
          "rounded-r-md",
          currentPage === totalPages ? disabledButtonClasses : inactiveButtonClasses
        )}
        aria-label="Next page"
      >
        <span className="sr-only">Next</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
