export default function Badge({
  children,
  variant = "primary",
  className = "",
}) {
  const variants = {
    primary: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-block px-4 py-1 text-xs font-medium rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
