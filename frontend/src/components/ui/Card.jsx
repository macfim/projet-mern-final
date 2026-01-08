export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-slate-300 rounded-lg p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
