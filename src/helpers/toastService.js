import { toast } from "sonner";

// Define toast types as a constant object
const ToastType = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
  LOADING: "loading",
};

// Define the ToastUtil utility
export const Toast = {
  // Generic show method
  show: (type, message, description = "", options = {}) => {
    const base = { description, ...options };

    switch (type) {
      case ToastType.SUCCESS:
        return toast.success(message, base);
      case ToastType.ERROR:
        return toast.error(message, base);
      case ToastType.WARNING:
        return toast.warning(message, base);
      case ToastType.INFO:
        return toast.info(message, base);
      case ToastType.LOADING:
        return toast.loading(message, base);
      default:
        return toast.message(message, base);
    }
  },

  // Shortcut methods
  success: (message, description = "", options = {}) => {
    return toast.success(message, { description, ...options });
  },

  error: (message, description = "", options = {}) => {
    return toast.error(message, { description, ...options });
  },

  info: (message, description = "", options = {}) => {
    return toast.info(message, { description, ...options });
  },

  warning: (message, description = "", options = {}) => {
    return toast.warning(message, { description, ...options });
  },

  loading: (message, description = "", options = {}) => {
    return toast.loading(message, { description, ...options });
  },

  // Dismiss a toast
  dismiss: (id) => {
    return toast.dismiss(id);
  },
};