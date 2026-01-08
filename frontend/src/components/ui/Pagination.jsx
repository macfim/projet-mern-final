import Button from "./Button";

export default function Pagination({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  className = "",
}) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      className={`flex items-center justify-center gap-6 mt-12 py-6 ${className}`}
    >
      <Button
        variant="secondary"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      <div className="text-sm text-slate-900 font-medium min-w-[100px] text-center">
        Page {currentPage} of {totalPages}
      </div>

      <Button
        variant="secondary"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
