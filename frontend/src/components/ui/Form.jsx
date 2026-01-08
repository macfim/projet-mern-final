export default function Form({ onSubmit, children, className = "", ...props }) {
  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-6 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}
