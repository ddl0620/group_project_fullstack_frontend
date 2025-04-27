import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  X,
  Pencil,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import { useUser } from '@/hooks/useUser.js';
import { useSelector } from 'react-redux';
import { CreateEditDiscussionPost } from '@/pages/Discussion/DiscussionPost/CreateEditDiscusisonPost.jsx';
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@radix-ui/react-alert-dialog';
import { AlertDialogUtils } from '@/helpers/AlertDialog.jsx';
import { Toast } from '@/helpers/toastService.js';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog.tsx';
import useDiscussionPost from '@/hooks/useDiscussionPost.js';
import { CommentSection } from '@/pages/Discussion/DiscussionReply/CommentSection.jsx';
import useDiscussionReply from '@/hooks/useDiscussionReply.js';
import { TrashIcon } from '@heroicons/react/24/outline';

export function DiscussionPost({ postData }) {
  const { getUserById } = useUser();
  const { deletePost, updatePost } = useDiscussionPost();
  const { fetchReplies } = useDiscussionReply();
  const me = useSelector((state) => state.user.user);
  const repliesByPostId = useSelector(
    (state) => state.discussionReply.repliesByPostId
  );

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(124);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [creator, setCreator] = useState({ name: 'User' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // New state for edit dialog
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Lấy replies theo postId từ repliesByPostId
  const replies = repliesByPostId[postData._id]?.replies || [];

  useEffect(() => {
    const fetchUserData = async (userId) => {
      const response = await getUserById(userId);
      const user = response.content;
      setCreator(user);
    };

    const fetchPostReplies = async () => {
      await fetchReplies(postData._id, page, limit);
    };

    fetchUserData(postData.creator_id._id);
    fetchPostReplies();
  }, [postData._id, page, limit, fetchReplies, postData.creator_id._id]);

  useEffect(() => {
    console.log(`This is replies of ${postData._id}`, replies);
  }, [replies, postData._id]);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const isMyPost = me._id === postData.creator_id._id;

  const handleUpdateDiscussion = async () => {
    try {
      console.log('Post updated:', postData);
      setIsEditDialogOpen(false); // Close the dialog on success
    } catch (error) {
      console.error('Error updating post:', error);
      Toast.error('Failed to update post', error.message);
    }
  };

  const handleDeleteDiscussion = async () => {
    try {
      const confirmed = await AlertDialogUtils.warning({
        title: 'Are you sure?',
        description: 'This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      });

      if (!confirmed) return;

      await deletePost(postData.event_id, postData._id);
      setIsDeleteDialogOpen(false); // Close the dialog on success
    } catch (error) {
      console.error('Error deleting post:', error);
      Toast.error('Failed to delete post', error.message);
    }
  };

  return (
    <div>
      <Card className="mx-auto max-w-2xl rounded-lg bg-white shadow-md sm:w-sm md:w-md lg:w-lg xl:w-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
          <CustomAvatar
            src={''}
            fallbackText={creator?.name || 'User'}
            alt={'User'}
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="font-semibold">{creator?.name || 'User'}</span>
            </div>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(postData.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
          {isMyPost && (
            <div>
              <CreateEditDiscussionPost
                eventId={postData.event_id}
                isEdit={true}
                postData={postData}
                onSuccess={handleUpdateDiscussion}
                triggerButton={
                  <Button size={'sm'} variant={'ghost'}>
                    <Pencil />
                  </Button>
                } // No trigger button, controlled by state
                isModalOpen={isEditDialogOpen}
                setIsModalOpen={setIsEditDialogOpen}
              />
              <Button
                size={'sm'}
                onClick={() => handleDeleteDiscussion()}
                variant={'ghost'}
              >
                <TrashIcon size={'sm'} />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4 pt-0">
          <p className="w-full">{postData.content}</p>
          {postData.images.length > 0 && (
            <Carousel className="mt-4 w-full">
              <CarouselContent>
                {postData.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`Post image ${index + 1}`}
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          )}
        </CardContent>
        <CardFooter className="flex flex-col p-0">
          <div className="flex w-full items-center justify-start gap-x-4 p-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                className={liked ? 'text-red-500' : ''}
              >
                <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                <span className="sr-only">Like</span>
              </Button>
              <span className="text-sm">{likeCount}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-5 w-5" />
              <span>{replies.length} comments</span>
            </Button>
          </div>
          {showComments && (
            <CommentSection postId={postData._id} initialReplies={replies} />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
