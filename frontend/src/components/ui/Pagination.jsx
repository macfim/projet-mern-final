import Button from "./Button";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/styles";

export default function Pagination({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
}) {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);

  // Return null if pagination not needed
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

  const containerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xxl,
    marginTop: SPACING.xxxl,
    padding: `${SPACING.xxl} 0`,
  };

  const pageInfoStyles = {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
    minWidth: "100px",
    textAlign: "center",
  };

  return (
    <div style={containerStyles}>
      <Button
        variant="secondary"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      <div style={pageInfoStyles}>
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
