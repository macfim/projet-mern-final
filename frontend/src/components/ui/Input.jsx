import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDERS,
  TRANSITIONS,
} from "../../constants/styles";

export default function Input({
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  ...props
}) {
  const styles = {
    width: "100%",
    padding: `${SPACING.md} ${SPACING.lg}`,
    fontSize: TYPOGRAPHY.fontSizeMd,
    border: `${BORDERS.width} solid ${COLORS.border}`,
    borderRadius: BORDERS.radius,
    backgroundColor: COLORS.background,
    color: COLORS.text,
    transition: TRANSITIONS.default,
    boxSizing: "border-box",
  };

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      style={styles}
      {...props}
    />
  );
}
