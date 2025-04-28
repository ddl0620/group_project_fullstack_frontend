import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.js';
import { Button } from '@/components/ui/button.js';
import {
  HeartIcon,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Reply,
  Send,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input.js';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser.js';
import {
  useImageUploader,
  ImageUploader,
} from '@/components/ImageUploader.jsx';
import { CreateEditDiscussionPost } from '@/pages/Discussion/DiscussionPost/CreateEditDiscusisonPost.jsx';
import { TrashIcon } from '@heroicons/react/24/outline/index.js';
import {AlertDialogUtils} from "@/helpers/AlertDialogUtils.jsx";
import {PencilIcon} from "@heroicons/react/24/outline";

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
    })

    if(!confirmed) return;

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
    })

    if(!confirmed) return;

    onDelete(comment._id);
  };

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="mt-4">
      <div className="flex gap-3">
        <CustomAvatar src={user?.avatar} fallbackText={user?.name} />

        <div className="flex-1 space-y-2">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{user.name}</span>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {isOwnComment && (
                <div>
                  {/*<DropdownMenuTrigger asChild>*/}
                  {/*  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">*/}
                  {/*    <MoreHorizontal className="h-4 w-4" />*/}
                  {/*  </Button>*/}
                  {/*</DropdownMenuTrigger>*/}
                  {/*<DropdownMenuContent align="end">*/}
                  {/*  <DropdownMenuItem onClick={() => setIsEditMode(true)}>*/}
                  {/*    Edit*/}
                  {/*  </DropdownMenuItem>*/}
                  {/*  <DropdownMenuItem*/}
                  {/*    onClick={() => setIsDeleteDialogOpen(true)}*/}
                  {/*    className="text-red-600"*/}
                  {/*  >*/}
                  {/*    Delete*/}
                  {/*  </DropdownMenuItem>*/}
                  {/*</DropdownMenuContent>*/}
                  <Button
                      size={'sm'}
                      onClick={() => handleDelete()}
                      variant={'ghost'}
                  >
                    <TrashIcon size={'sm'} />
                  </Button>
                  <Button
                      size={'sm'}
                      onClick={() => setIsEditMode(true)}
                      variant={'ghost'}
                  >
                    <PencilIcon size={'sm'} />
                  </Button>
                </div>
              )}
            </div>

            <p className="mt-1 text-sm">{comment.content}</p>

            {/* Display images if any */}
            {comment.images && comment.images.length > 0 && (
              <div className="mt-2">
                {comment.images.length === 1 ? (
                  <img
                    src={comment.images[0] || '/placeholder.svg'}
                    alt="Comment attachment"
                    className="max-h-60 rounded-md object-cover"
                    onError={(e) => {
                      e.target.src = '/colorful-abstract-flow.png';
                      e.target.alt = 'Failed to load image';
                    }}
                  />
                ) : (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {comment.images.map((image, index) => (
                        <CarouselItem key={index} className="basis-full">
                          <div className="overflow-hidden rounded-md">
                            <img
                              src={image || '/placeholder.svg'}
                              alt={`Comment attachment ${index + 1}`}
                              className="h-auto max-h-60 w-full object-cover"
                              onError={(e) => {
                                e.target.src = '/colorful-abstract-flow.png';
                                e.target.alt = 'Failed to load image';
                              }}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <HeartIcon className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
              <span>{likeCount > 0 ? likeCount : ''} Like</span>
            </button>

            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-muted-foreground flex items-center gap-1"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>
          </div>

          {/* Edit input */}
          {isEditMode && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <CustomAvatar src={user?.avatar} fallbackText={user?.name} />
                <div className="flex-1">
                  <Input
                    placeholder="Edit comment..."
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="text-sm"
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
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleEditSubmit}
                  disabled={
                    editContent.trim() === '' &&
                    existingImageUrls.length === 0 &&
                    uploadedImages.length === 0
                  }
                >
                  <Send className="mr-1 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Reply input */}
          {showReplyInput && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <CustomAvatar src={user?.avatar} fallbackText={user?.name} />
                <div className="flex-1">
                  <Input
                    placeholder="Comment..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="text-sm"
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
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleNestedReply}
                  disabled={
                    replyContent.trim() === '' && uploadedImages.length === 0
                  }
                >
                  <Send className="mr-1 h-4 w-4" />
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
                className={`pl-3 ${depth > 0 ? 'border-l border-gray-200' : ''}`}
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
              <Button variant="ghost" size="sm" className="mt-2 text-xs">
                View more replies ({comment.children.length})
              </Button>
            )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {/*<AlertDialog*/}
      {/*  open={isDeleteDialogOpen}*/}
      {/*  onOpenChange={setIsDeleteDialogOpen}*/}
      {/*>*/}
      {/*  <AlertDialogContent>*/}
      {/*    <AlertDialogHeader>*/}
      {/*      <AlertDialogTitle>Delete Comment</AlertDialogTitle>*/}
      {/*      <AlertDialogDescription>*/}
      {/*        Are you sure you want to delete this comment? This action cannot*/}
      {/*        be undone.*/}
      {/*      </AlertDialogDescription>*/}
      {/*    </AlertDialogHeader>*/}
      {/*    <AlertDialogFooter>*/}
      {/*      <AlertDialogCancel>Cancel</AlertDialogCancel>*/}
      {/*      <AlertDialogAction*/}
      {/*        onClick={handleDelete}*/}
      {/*        className="bg-red-600 hover:bg-red-700"*/}
      {/*      >*/}
      {/*        Delete*/}
      {/*      </AlertDialogAction>*/}
      {/*    </AlertDialogFooter>*/}
      {/*  </AlertDialogContent>*/}
      {/*</AlertDialog>*/}
    </div>
  );
};

export default Comment;
