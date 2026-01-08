import { Link as RouterLink } from "react-router-dom";
import { COLORS, TYPOGRAPHY, TRANSITIONS } from "../../constants/styles";

export default function Link({ to, children, variant = "primary", ...props }) {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          color: COLORS.secondary,
          textDecoration: "none",
        };
      case "nav":
        return {
          color: COLORS.textLight,
          textDecoration: "none",
          fontWeight: TYPOGRAPHY.fontWeightMedium,
        };
      case "primary":
      default:
        return {
          color: COLORS.primary,
          textDecoration: "none",
          fontWeight: TYPOGRAPHY.fontWeightMedium,
        };
    }
  };

  const linkStyles = {
    transition: TRANSITIONS.default,
    ...getVariantStyles(),
  };

  return (
    <RouterLink to={to} style={linkStyles} {...props}>
      {children}
    </RouterLink>
  );
}
