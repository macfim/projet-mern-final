import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDERS,
  TRANSITIONS,
} from "../../constants/styles";

export default function Textarea({
  value,
  onChange,
  required = false,
  rows = 4,
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
    fontFamily: "inherit",
    resize: "vertical",
  };

  return (
    <textarea
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      placeholder={placeholder}
      style={styles}
      {...props}
    />
  );
}
