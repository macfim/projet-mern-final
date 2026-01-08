export default function Container({
  children,
  maxWidth = "800px",
  padding = "48px",
  className = "",
}) {
  return (
    <div style={{ maxWidth, margin: "0 auto", padding }} className={className}>
      {children}
    </div>
  );
}
