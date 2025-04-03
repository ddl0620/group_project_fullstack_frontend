import { toast } from 'sonner';

export const ToastType = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
    LOADING: 'loading',
};

export const Toast = {
    // Gọi theo loại toast
    show: (type, message, description = '', options = {}) => {
        const base = { description, ...options };

        switch (type) {
            case ToastType.SUCCESS:
                return toast.success(message, base);
            case ToastType.ERROR:
                return toast.error(message, base);
            case ToastType.WARNING:
                return toast.warning(message, base);
            case ToastType.INFO:
                return toast(message, base);
            case ToastType.LOADING:
                return toast.loading(message, base);
            default:
                return toast(message, base);
        }
    },

    // Shortcut nhanh
    success: (msg, description = '') => toast.success(msg, description ? { description } : {}),
    error: (msg, description = '') => toast.error(msg, description ? { description } : {}),
    info: (msg, description = '') => toast(msg, description ? { description } : {}),
    warning: (msg, description = '') => toast.warning(msg, description ? { description } : {}),
    loading: (msg, options = {}) => toast.loading(msg, options),

    // Async toast
    promise: (promise, messages) => toast.promise(promise, messages),
};
