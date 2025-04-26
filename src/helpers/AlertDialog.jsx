// src/utils/AlertDialogUtils.jsx
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
import { Button, buttonVariants } from '@/components/ui/button';
import { InformationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

// Hàm hiển thị AlertDialog và trả về Promise với lựa chọn của người dùng
export const showAlertDialog = ({
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmText = 'Continue',
    cancelText = 'Cancel',
    variant = 'destructive', // Màu của nút confirm (destructive, default, etc.)
    icon = <TrashIcon className="size-6 text-red-600 dark:text-red-200" />, // Icon mặc định
}) => {
    return new Promise((resolve) => {
        // Tạo một div tạm để render dialog
        const dialogContainer = document.createElement('div');
        document.body.appendChild(dialogContainer);
        const root = createRoot(dialogContainer);

        // Hàm xử lý khi người dùng nhấn nút
        const handleConfirm = () => {
            resolve(true); // Trả về true khi nhấn Confirm
            cleanup();
        };

        const handleCancel = () => {
            resolve(false); // Trả về false khi nhấn Cancel
            cleanup();
        };

        // Dọn dẹp sau khi dialog đóng
        const cleanup = () => {
            root.unmount();
            document.body.removeChild(dialogContainer);
        };

        // Render AlertDialog
        root.render(
            <AlertDialog defaultOpen={true}>
                <AlertDialogContent>
                    <AlertDialogHeader className="mb-4 items-center gap-2">
                        <div
                            aria-hidden="true"
                            className="shrink-0 rounded-full bg-red-50 p-3 dark:bg-red-900"
                        >
                            {icon}
                        </div>
                        <div className="flex flex-col gap-2 text-center">
                            <AlertDialogTitle>{title}</AlertDialogTitle>
                            <AlertDialogDescription className="text-balance">
                                {description}
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-between">
                        <AlertDialogCancel onClick={handleCancel}>
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

// Export các cấu hình mẫu (nếu cần)
export const AlertDialogUtils = {
    warning: (options = {}) =>
        showAlertDialog({
            title: 'Are you sure?',
            description: 'This action cannot be undone.',
            confirmText: 'Continue',
            cancelText: 'Cancel',
            variant: 'destructive',
            icon: (
                <TrashIcon className="size-6 text-red-600 dark:text-red-200" />
            ),
            ...options, // Ghi đè các giá trị mặc định bằng options
        }),
    info: (options = {}) =>
        showAlertDialog({
            title: 'Information',
            description: 'Here is some information for you.',
            confirmText: 'OK',
            cancelText: 'Close',
            variant: 'default',
            icon: (
                <InformationCircleIcon className="size-6 text-blue-600 dark:text-blue-200" />
            ), // Giả định có icon Info
            ...options,
        }),
};
