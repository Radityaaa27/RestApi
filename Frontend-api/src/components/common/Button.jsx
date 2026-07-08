const VARIANTS = {
  primary:
    "bg-interactive text-white hover:bg-interactive-hover disabled:bg-interactive/60",
  secondary:
    "bg-surface text-secondary border border-border hover:text-primary hover:border-secondary disabled:opacity-60",
  danger: "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/60",
};

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={isLoading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-card px-3 py-2 text-body font-semibold transition-colors duration-150 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
