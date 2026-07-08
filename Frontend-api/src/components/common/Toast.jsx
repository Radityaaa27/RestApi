import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

const STYLES = {
  success: "bg-alert-success-bg text-alert-success-text border-alert-success-border",
  error: "bg-alert-error-bg text-alert-error-text border-alert-error-border",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed right-2 top-2 z-50 flex flex-col gap-1">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`rounded-card border px-2 py-2 text-body shadow-card ${STYLES[t.type]}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
