import { Link as RouterLink } from "react-router-dom";

export default function Link({
  to,
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "text-slate-900 font-medium hover:text-slate-700 transition-colors",
    secondary:
      "text-slate-600 font-medium hover:text-slate-800 transition-colors",
    nav: "text-slate-400 font-medium hover:text-slate-200 transition-colors",
  };

  return (
    <RouterLink
      to={to}
      className={`no-underline ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
}
