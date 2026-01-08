import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDERS,
  TRANSITIONS,
} from "../../constants/styles";

export default function Button({
  variant = "primary",
  disabled = false,
  type = "button",
  onClick,
  children,
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: COLORS.background,
          color: COLORS.primary,
          border: `${BORDERS.width} solid ${COLORS.border}`,
        };
      case "danger":
        return {
          backgroundColor: COLORS.danger,
          color: COLORS.background,
        };
      case "primary":
      default:
        return {
          backgroundColor: COLORS.primary,
          color: COLORS.background,
        };
    }
  };

  const baseStyles = {
    padding: `${SPACING.md} ${SPACING.xxl}`,
    fontSize: TYPOGRAPHY.fontSizeMd,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
    border: "none",
    borderRadius: BORDERS.radius,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: TRANSITIONS.default,
    opacity: disabled ? 0.6 : 1,
    ...getVariantStyles(),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyles}
      {...props}
    >
      {children}
    </button>
  );
}
