import { COLORS, SPACING, TYPOGRAPHY, BORDERS } from "../../constants/styles";

export default function Badge({ children, variant = "primary" }) {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: COLORS.lightGray,
          color: COLORS.secondary,
        };
      case "info":
        return {
          backgroundColor: COLORS.blueBg,
          color: COLORS.blue,
        };
      case "primary":
      default:
        return {
          backgroundColor: COLORS.primary,
          color: COLORS.background,
        };
    }
  };

  const badgeStyles = {
    display: "inline-block",
    padding: `${SPACING.xs} ${SPACING.lg}`,
    fontSize: TYPOGRAPHY.fontSizeXs,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
    borderRadius: BORDERS.radiusRound,
    ...getVariantStyles(),
  };

  return <span style={badgeStyles}>{children}</span>;
}
