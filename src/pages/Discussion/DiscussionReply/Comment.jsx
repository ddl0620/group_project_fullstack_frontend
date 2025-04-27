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
} from '@/components/ui/carousel.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import { useState } from 'react';

const Comment = ({
  comment,
  onReply,
  onDelete,
  currentUserId,
  postId,
  depth = 0,
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyImages, setReplyImages] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const isOwnComment = currentUserId === comment.creator_id._id;
  const maxDepth = 5; // Limit nesting depth for UI clarity

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setReplyImages([...replyImages, imageUrl]);
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...replyImages];
    updatedImages.splice(index, 1);
    setReplyImages(updatedImages);
  };

  const handleSubmitReply = () => {
    if (replyContent.trim() === '' && replyImages.length === 0) return;

    onReply({
      content: replyContent,
      parent_reply_id: comment._id,
      post_id: postId,
      images: replyImages,
    });

    setReplyContent('');
    setReplyImages([]);
    setShowReplyInput(false);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(false);
    onDelete(comment._id);
  };

  return (
    <div className="mt-4">
      <div className="flex gap-3">
        <CustomAvatar src={''} fallbackText={comment.creator_id._id} />

        <div className="flex-1 space-y-2">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  User {comment.creator_id._id.substring(0, 4)}
                </span>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {isOwnComment && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

          {/* Reply input */}
          {showReplyInput && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <CustomAvatar
                  src={currentUserId?.avatar}
                  fallbackText={currentUserId?.name}
                />
                <div className="flex-1">
                  <Input
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Image preview */}
              {replyImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {replyImages.map((image, index) => (
                    <div key={index} className="relative h-16 w-16">
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`Image ${index + 1}`}
                        className="h-full w-full rounded object-cover"
                        onError={(e) => {
                          e.target.src = '/colorful-abstract-flow.png';
                        }}
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="bg-opacity-70 absolute -top-1 -right-1 rounded-full bg-black p-0.5 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Image URL input */}
              {showImageInput && (
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Paste image URL..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={handleAddImage}>
                    Add
                  </Button>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="text-xs"
                >
                  <ImageIcon className="mr-1 h-4 w-4" />
                  Add Image
                </Button>

                <Button
                  size="sm"
                  onClick={handleSubmitReply}
                  disabled={
                    replyContent.trim() === '' && replyImages.length === 0
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
                    onDelete={onDelete}
                    currentUserId={currentUserId}
                    postId={postId}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}

          {/* Show "View more replies" button if we've reached max depth but there are more replies */}
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
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Comment;
