import { SPACING } from "../../constants/styles";

export default function Form({ onSubmit, children, ...props }) {
  const styles = {
    display: "flex",
    flexDirection: "column",
    gap: SPACING.xxl,
  };

  return (
    <form onSubmit={onSubmit} style={styles} {...props}>
      {children}
    </form>
  );
}
