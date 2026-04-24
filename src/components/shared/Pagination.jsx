import { CaretLeft, CaretRight } from '../../icons/index';

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
  const handlePreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  }

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  }

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-secondary-300 text-secondary-600 bg-secondary-50 hover:bg-secondary-100 shadow-sm hover:-translate-x-0.5"
      >
        <CaretLeft size={18} strokeWidth={2.5} />
      </button>

      {generatePageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-secondary-400 font-bold">...</span>
        ) : (
          <button
            key={`page-${page}-${index}`}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center text-sm rounded-[10px] transition-all font-bold hover:-translate-y-0.5 ${
              currentPage === page
                ? 'bg-primary-600 text-white shadow hover:bg-primary-900'
                : 'bg-transparent text-secondary-600 hover:bg-secondary-100'
            }`}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-secondary-300 text-secondary-600 bg-secondary-50 hover:bg-secondary-100 shadow-sm hover:translate-x-0.5"
      >
        <CaretRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  )
}
