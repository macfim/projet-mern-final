export default function ErrorMessage({ message, onDismiss, className = "" }) {
  return (
    <div
      className={`bg-red-50 border border-red-300 rounded p-4 flex justify-between items-center gap-4 ${className}`}
    >
      <p className="text-red-600 text-sm m-0 flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="bg-transparent border-none text-red-600 text-xl cursor-pointer p-0 w-6 h-6 flex items-center justify-center hover:text-red-700"
        >
          ×
        </button>
      )}
    </div>
  );
}
