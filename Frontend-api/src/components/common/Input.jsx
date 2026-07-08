export default function Input({ label, id, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-caption font-medium text-secondary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-card border bg-surface px-2 py-2 text-body text-primary outline-none transition-colors duration-150 focus:border-interactive ${
          error ? "border-danger" : "border-border-input"
        } ${className}`}
        {...props}
      />
      {/* Laravel 422 validation message rendered directly underneath the field */}
      {error && <p className="text-caption text-danger">{error}</p>}
    </div>
  );
}
