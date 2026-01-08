import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/styles";

export default function Loading({ message = "Loading..." }) {
  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.lg,
    padding: SPACING.xxxl,
  };

  const spinnerStyles = {
    width: "40px",
    height: "40px",
    border: `3px solid ${COLORS.lightBorder}`,
    borderTop: `3px solid ${COLORS.primary}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const messageStyles = {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.textLight,
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={containerStyles}>
        <div style={spinnerStyles} />
        <p style={messageStyles}>{message}</p>
      </div>
    </>
  );
}
