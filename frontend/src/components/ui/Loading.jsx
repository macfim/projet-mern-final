export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin-custom" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
