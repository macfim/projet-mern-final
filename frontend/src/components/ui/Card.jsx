import { COLORS, SPACING, BORDERS, SHADOWS } from "../../constants/styles";

export default function Card({ children, ...props }) {
  const styles = {
    backgroundColor: COLORS.background,
    border: `${BORDERS.width} solid ${COLORS.border}`,
    borderRadius: BORDERS.radiusLg,
    padding: SPACING.xxxl,
    boxShadow: SHADOWS.sm,
  };

  return (
    <div style={styles} {...props}>
      {children}
    </div>
  );
}
