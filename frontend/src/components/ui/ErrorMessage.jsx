import { COLORS, SPACING, TYPOGRAPHY, BORDERS } from "../../constants/styles";

export default function ErrorMessage({ message, onDismiss }) {
  const containerStyles = {
    backgroundColor: COLORS.errorBg,
    border: `${BORDERS.width} solid ${COLORS.errorBorder}`,
    borderRadius: BORDERS.radius,
    padding: SPACING.lg,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING.lg,
  };

  const messageStyles = {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizeMd,
    margin: 0,
    flex: 1,
  };

  const closeButtonStyles = {
    backgroundColor: "transparent",
    border: "none",
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizeXl,
    cursor: "pointer",
    padding: 0,
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={containerStyles}>
      <p style={messageStyles}>{message}</p>
      {onDismiss && (
        <button style={closeButtonStyles} onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  );
}
