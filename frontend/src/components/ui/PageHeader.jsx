import { SPACING, TYPOGRAPHY, COLORS } from "../../constants/styles";

export default function PageHeader({ title, actions }) {
  const headerStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xxxxl,
  };

  const titleStyles = {
    fontSize: TYPOGRAPHY.fontSizeXxxl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textDark,
    margin: 0,
  };

  return (
    <div style={headerStyles}>
      <h1 style={titleStyles}>{title}</h1>
      {actions && <div>{actions}</div>}
    </div>
  );
}
