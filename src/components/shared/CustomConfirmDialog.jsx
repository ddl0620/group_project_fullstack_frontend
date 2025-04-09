import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export function ConfirmationAlert({
    triggerButton, // Nút hoặc element để mở dialog
    title, // Tiêu đề của dialog
    description, // Mô tả trong dialog
    onConfirm, // Hàm xử lý khi nhấn OK
    onCancel, // Hàm xử lý khi nhấn Cancel hoặc bấm ra ngoài (tùy chọn)
    confirmText = 'OK', // Văn bản cho nút OK (mặc định là "OK")
    cancelText = 'Cancel', // Văn bản cho nút Cancel (mặc định là "Cancel")
}) {
    const [open, setOpen] = useState(false); // Trạng thái mở/đóng của dialog

    // Hàm xử lý khi dialog đóng (bấm ra ngoài hoặc Cancel)
    const handleClose = () => {
        setOpen(false);
        if (onCancel) {
            onCancel(); // Gọi onCancel nếu được cung cấp
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <div onClick={() => setOpen(true)}>{triggerButton}</div>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-xl border-gray-200 bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className="rounded-xl border-gray-200 bg-gray-200 text-black hover:scale-105 hover:cursor-pointer hover:bg-gray-300"
                        onClick={handleClose} // Đóng dialog và gọi onCancel
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="rounded-xl border-gray-200 bg-red-600 text-white hover:scale-105 hover:cursor-pointer hover:bg-red-700"
                        onClick={() => {
                            onConfirm(); // Gọi hàm onConfirm
                            setOpen(false); // Đóng dialog
                        }}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
