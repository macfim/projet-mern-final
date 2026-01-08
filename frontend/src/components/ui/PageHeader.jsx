export default function PageHeader({ title, actions, className = "" }) {
  return (
    <div className={`flex justify-between items-center mb-16 ${className}`}>
      <h1 className="text-4xl font-bold text-slate-900 m-0">{title}</h1>
      {actions && <div>{actions}</div>}
    </div>
  );
}
