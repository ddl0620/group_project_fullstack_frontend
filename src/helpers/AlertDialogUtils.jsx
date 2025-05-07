import { createRoot } from 'react-dom/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Info, MessageCircleWarningIcon, Skull } from 'lucide-react';

/**
 * Cấu hình mặc định theo từng loại Alert
 */
const defaultConfigs = {
  warning: {
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
    confirmText: 'Continue',
    cancelText: 'Cancel',
    variant: 'destructive',
    icon: (
      <MessageCircleWarningIcon className="size-6 text-red-600 dark:text-red-200" />
    ),
  },
  info: {
    title: 'Information',
    description: 'Here is some information for you.',
    confirmText: 'OK',
    cancelText: 'Close',
    variant: 'default',
    icon: <Info className="size-6 text-blue-600 dark:text-blue-200" />,
  },
  danger: {
    title: 'Are you sure?',
    description: 'This action is irreversible.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
    icon: <Skull className="size-6 text-red-600 dark:text-red-200" />,
  },
};

/**
 * Hiển thị alert dialog với config đã merge
 * @param {Object} config - Cấu hình của AlertDialog
 * @returns {Promise<boolean>} - true nếu Confirm, false nếu Cancel
 */
export const showAlertDialog = (config = {}) => {
  const { title, description, confirmText, cancelText, variant, icon } = {
    ...defaultConfigs.info, // fallback mặc định nếu không có loại
    ...config,
  };

  return new Promise((resolve) => {
    const dialogContainer = document.createElement('div');
    document.body.appendChild(dialogContainer);
    const root = createRoot(dialogContainer);

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(dialogContainer);
    };

    const handleConfirm = () => {
      resolve(true);
      cleanup();
    };

    const handleCancel = () => {
      resolve(false);
      cleanup();
    };

    root.render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogContent>
          <AlertDialogHeader className="mb-4 items-center gap-2 text-black">
            {icon && (
              <div
                aria-hidden="true"
                className="shrink-0 rounded-full bg-red-50 p-3 dark:bg-red-900"
              >
                {icon}
              </div>
            )}
            <div className="flex flex-col gap-2 text-center">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription className="text-balance">
                {description}
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center gap-2">
            <AlertDialogCancel className="text-black" onClick={handleCancel}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={buttonVariants({ variant })}
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  });
};

/**
 * Gọi AlertDialog với tên loại xác định: warning, info, danger, hoặc custom
 */
export const AlertDialogUtils = {
  /**
   * Dùng loại warning
   */
  warning: (options = {}) =>
    showAlertDialog({ ...defaultConfigs.warning, ...options }),

  /**
   * Dùng loại info
   */
  info: (options = {}) =>
    showAlertDialog({ ...defaultConfigs.info, ...options }),

  /**
   * Dùng loại danger
   */
  danger: (options = {}) =>
    showAlertDialog({ ...defaultConfigs.danger, ...options }),

  /**
   * Dùng custom
   */
  custom: (options = {}) => showAlertDialog({ ...options }),
};
