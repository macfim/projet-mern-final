import { SPACING } from "../../constants/styles";

export default function Container({
  children,
  maxWidth = "800px",
  padding = SPACING.xxxl,
}) {
  const containerStyles = {
    maxWidth,
    margin: "0 auto",
    padding,
  };

  return <div style={containerStyles}>{children}</div>;
}
