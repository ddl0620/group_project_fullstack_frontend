'use client';

import { Button } from '@/components/ui/button.js';
import { Reply, Send } from 'lucide-react';
import { Input } from '@/components/ui/input.js';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import {
  useImageUploader,
  ImageUploader,
} from '@/components/ImageUploader.jsx';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser.js';
import { TrashIcon } from '@heroicons/react/24/outline/index.js';
import { AlertDialogUtils } from '@/helpers/AlertDialogUtils.jsx';
import { PencilIcon } from '@heroicons/react/24/outline';
import ImageCarousel from '@/components/ImageCarousel.jsx';

const Comment = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  postId,
  depth = 0,
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [user, setUser] = useState(null);
  const { getUserById } = useUser();

  const {
    fileInputRef,
    uploadedImages,
    setUploadedImages,
    existingImageUrls,
    setExistingImageUrls,
    handleFileChange,
    handleRemoveImage,
  } = useImageUploader();

  useEffect(() => {
    const getUserCommenter = async () => {
      const response = await getUserById(comment.creator_id._id);
      const tmpUser = response.content;
      setUser(tmpUser);
    };
    getUserCommenter();
  }, [comment.creator_id._id]);

  useEffect(() => {
    if (isEditMode) {
      setExistingImageUrls(
        (comment.images || []).map((url) => ({ url, type: 'url' }))
      );
      setUploadedImages([]);
    }
  }, [isEditMode]);

  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => {
        if (image.url && image.type === 'file') {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [uploadedImages]);

  const isOwnComment = currentUserId === comment.creator_id._id;
  const maxDepth = 5;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleNestedReply = () => {
    if (replyContent.trim() === '' && uploadedImages.length === 0) return;

    onReply({
      content: replyContent,
      parent_reply_id: comment._id,
      post_id: postId,
      uploadedImages, // Send uploadedImages directly
    });

    setReplyContent('');
    setUploadedImages([]);
    setShowReplyInput(false);
  };

  const handleEditSubmit = async () => {
    if (
      editContent.trim() === '' &&
      existingImageUrls.length === 0 &&
      uploadedImages.length === 0
    )
      return;

    const confirmed = await AlertDialogUtils.info({
      title: 'Save changes?',
      description: 'You still can edit comment later',
      confirmText: 'Save',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    onEdit(comment._id, {
      content: editContent,
      existingImageUrls,
      uploadedImages,
    });

    setIsEditMode(false);
    setUploadedImages([]);
    setExistingImageUrls([]);
  };

  const handleDelete = async () => {
    const confirmed = await AlertDialogUtils.danger({
      title: 'Are you sure to delete this comment?',
      description: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    onDelete(comment._id);
  };

  if (!user) {
    return <div className="text-xs sm:text-sm">Loading user...</div>;
  }

  return (
    <div className="mt-2 sm:mt-4">
      <div className="flex gap-1 sm:gap-3">
        <CustomAvatar
          src={user?.avatar}
          fallbackText={user?.name}
          className="h-6 w-6 sm:h-8 sm:w-8"
        />

        <div className="flex-1 space-y-1 sm:space-y-2">
          <div className="bg-muted rounded-lg p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="max-w-[100px] truncate text-xs font-medium sm:max-w-none sm:text-sm">
                  {user.name}
                </span>
                <span className="text-muted-foreground text-[10px] sm:text-xs">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {isOwnComment && (
                <div className="flex gap-1">
                  <Button
                    size={'sm'}
                    onClick={() => handleDelete()}
                    variant={'ghost'}
                    className="h-6 w-6 p-0 sm:h-8 sm:w-8 sm:p-1"
                  >
                    <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    size={'sm'}
                    onClick={() => setIsEditMode(true)}
                    variant={'ghost'}
                    className="h-6 w-6 p-0 sm:h-8 sm:w-8 sm:p-1"
                  >
                    <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              )}
            </div>

            <p className="mt-1 text-xs break-words sm:text-sm">
              {comment.content}
            </p>

            {/* Display images if any */}
            {comment.images && comment.images.length > 0 && (
              <div className="mt-1 sm:mt-2">
                <div className="max-h-40 overflow-hidden sm:max-h-60">
                  <ImageCarousel images={comment.images} />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:gap-4 sm:text-xs">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-muted-foreground flex items-center gap-1"
            >
              <Reply className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Reply</span>
            </button>
          </div>

          {/* Edit input */}
          {isEditMode && (
            <div className="mt-1 space-y-1 sm:mt-2 sm:space-y-2">
              <div className="flex gap-1 sm:gap-2">
                <CustomAvatar
                  src={user?.avatar}
                  fallbackText={user?.name}
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
                <div className="flex-1">
                  <Input
                    placeholder="Edit comment..."
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="h-8 text-xs sm:h-10 sm:text-sm"
                  />
                </div>
              </div>

              <ImageUploader
                fileInputRef={fileInputRef}
                uploadedImages={uploadedImages}
                existingImageUrls={existingImageUrls}
                handleFileChange={handleFileChange}
                handleRemoveImage={handleRemoveImage}
              />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditMode(false);
                    setUploadedImages([]);
                    setExistingImageUrls([]);
                  }}
                  className="h-7 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleEditSubmit}
                  disabled={editContent.trim() === '' || (uploadedImages.length >= 0 && editContent.trim() === '')}

                  className="h-7 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
                >
                  <Send className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Reply input */}
          {showReplyInput && (
            <div className="mt-1 space-y-1 sm:mt-2 sm:space-y-2">
              <div className="flex gap-1 sm:gap-2">
                <CustomAvatar
                  src={user?.avatar}
                  fallbackText={user?.name}
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
                <div className="flex-1">
                  <Input
                    placeholder="Comment..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="h-8 text-xs sm:h-10 sm:text-sm"
                  />
                </div>
              </div>

              <ImageUploader
                fileInputRef={fileInputRef}
                uploadedImages={uploadedImages}
                existingImageUrls={existingImageUrls}
                handleFileChange={handleFileChange}
                handleRemoveImage={handleRemoveImage}
              />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowReplyInput(false);
                    setUploadedImages([]);
                    setExistingImageUrls([]);
                  }}
                  className="h-7 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleNestedReply}
                  disabled={replyContent.trim() === '' || (uploadedImages.length >= 0 && replyContent.trim() === '')}

                  className="h-7 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
                >
                  <Send className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Reply
                </Button>
              </div>
            </div>
          )}

          {/* Nested replies */}
          {comment.children &&
            comment.children.length > 0 &&
            depth < maxDepth && (
              <div
                className={`pl-1 sm:pl-3 ${depth > 0 ? 'border-l border-gray-200' : ''}`}
              >
                {comment.children.map((reply) => (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    currentUserId={currentUserId}
                    postId={postId}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}

          {/* Show "View more replies" button */}
          {comment.children &&
            comment.children.length > 0 &&
            depth >= maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 h-6 px-2 text-[10px] sm:mt-2 sm:h-8 sm:text-xs"
              >
                View more replies ({comment.children.length})
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
