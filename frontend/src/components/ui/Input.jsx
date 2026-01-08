export default function Input({
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 ${className}`}
      {...props}
    />
  );
}
