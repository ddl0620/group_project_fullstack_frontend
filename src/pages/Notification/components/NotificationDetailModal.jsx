import { format } from 'date-fns';
import { Info, AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function NotificationDetailModal({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
  onDelete,
}) {
  const [isTodaysDate, setIsTodaysDate] = useState(false);

  useEffect(() => {
    setIsTodaysDate(
      new Date(notification?.createdAt).toDateString() ===
        new Date().toDateString()
    );
  }, [notification?.createdAt]);

  if (!notification) return null;

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'INFO':
        return <Info className="h-5 w-5" />;
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5" />;
      case 'ERROR':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'INFO':
        return 'bg-blue-500 text-white';
      case 'SUCCESS':
        return 'bg-green-500 text-white';
      case 'WARNING':
        return 'bg-amber-500 text-white';
      case 'ERROR':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeName = () => {
    switch (notification.type) {
      case 'INFO':
        return 'Information';
      case 'SUCCESS':
        return 'Success';
      case 'WARNING':
        return 'Warning';
      case 'ERROR':
        return 'Error';
      default:
        return notification.type;
    }
  };

  const formattedDate = notification.createdAt
    ? format(new Date(notification.createdAt), 'PPpp')
    : 'Unknown date';

  const handleMarkAsRead = () => {
    if (onMarkAsRead && !notification.isRead) {
      onMarkAsRead(notification._id);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification._id);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge className={cn('px-2 py-1', getTypeColor())}>
              <span className="flex items-center gap-1">
                {getTypeIcon()}
                <span>{getTypeName()}</span>
              </span>
            </Badge>
            {/*{!notification.isRead && (*/}
            {/*  <Badge variant="outline" className="bg-blue-50">*/}
            {/*    New*/}
            {/*  </Badge>*/}
            {/*)}*/}

            {isTodaysDate && (
              <Badge variant="outline" className="bg-blue-50">
                New
              </Badge>
            )}
          </div>
          <DialogTitle className="mt-3 text-lg sm:mt-4 sm:text-xl">
            {notification.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 sm:text-sm">
            Received {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 max-h-[50vh] overflow-y-auto sm:mt-4 sm:max-h-[60vh]">
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-xs whitespace-pre-wrap sm:text-sm">
              {notification.content}
            </p>
          </div>

          <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-xs font-medium text-gray-500 sm:text-sm">
                Type:
              </span>
              <span className="text-xs sm:text-sm">{getTypeName()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-xs font-medium text-gray-500 sm:text-sm">
                Status:
              </span>
              <span className="text-xs sm:text-sm">
                {notification.isRead ? 'Read' : 'Unread'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-xs font-medium text-gray-500 sm:text-sm">
                Received:
              </span>
              <span className="text-xs sm:text-sm">{formattedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-xs font-medium text-gray-500 sm:text-sm">
                Notification ID:
              </span>
              <span className="font-mono text-[10px] sm:text-xs">
                {notification._id}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end sm:justify-between">
          {/*<Button variant="destructive" size="sm" onClick={handleDelete}>*/}
          {/*  <Trash2 className="mr-2 h-4 w-4" />*/}
          {/*  Delete*/}
          {/*</Button>*/}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="px-2 text-xs sm:px-3 sm:text-sm"
            >
              <X className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              Close
            </Button>
            {/*{!notification.isRead && (*/}
            {/*  <Button size="sm" onClick={handleMarkAsRead}>*/}
            {/*    <Check className="mr-2 h-4 w-4" />*/}
            {/*    Mark as read*/}
            {/*  </Button>*/}
            {/*)}*/}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
