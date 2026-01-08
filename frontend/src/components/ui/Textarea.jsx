export default function Textarea({
  value,
  onChange,
  required = false,
  rows = 4,
  placeholder,
  className = "",
  ...props
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      placeholder={placeholder}
      className={`w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 resize-vertical ${className}`}
      {...props}
    />
  );
}
