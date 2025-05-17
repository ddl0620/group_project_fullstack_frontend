import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card.tsx';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import { useUser } from '@/hooks/useUser.js';
import { useSelector } from 'react-redux';
import { CreateEditDiscussionPost } from '@/pages/Discussion/DiscussionPost/CreateEditDiscusisonPost.jsx';
import { AlertDialogUtils } from '@/helpers/AlertDialog.jsx';
import { Toast } from '@/helpers/toastService.js';
import useDiscussionPost from '@/hooks/useDiscussionPost.js';
import { CommentSection } from '@/pages/Discussion/DiscussionReply/CommentSection.jsx';
import useDiscussionReply from '@/hooks/useDiscussionReply.js';
import { TrashIcon } from '@heroicons/react/24/outline';
import ImageCarousel from '@/components/ImageCarousel.jsx';

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
      const response = await getUserById(userId || me._id);
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
      <Card className="mx-auto w-full max-w-2xl rounded-lg bg-white shadow-md">
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-2 sm:gap-4 sm:p-4">
          <CustomAvatar
            src={creator.avatar}
            fallbackText={creator?.name || 'User'}
            alt={'User'}
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="truncate text-sm font-semibold sm:text-base">
                {creator?.name || 'User'}
              </span>
            </div>
            <span className="text-muted-foreground text-[10px] sm:text-xs">
              {formatDistanceToNow(new Date(postData.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
          {isMyPost && (
            <div className="flex gap-1">
              <CreateEditDiscussionPost
                eventId={postData.event_id}
                isEdit={true}
                postData={postData}
                onSuccess={handleUpdateDiscussion}
                triggerButton={
                  <Button
                    size={'sm'}
                    variant={'ghost'}
                    className="h-7 w-7 p-0 sm:h-8 sm:w-8 sm:p-1"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                }
                isModalOpen={isEditDialogOpen}
                setIsModalOpen={setIsEditDialogOpen}
              />
              <Button
                size={'sm'}
                onClick={() => handleDeleteDiscussion()}
                variant={'ghost'}
                className="h-7 w-7 p-0 sm:h-8 sm:w-8 sm:p-1"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex w-full flex-col items-start justify-center p-2 pt-0 sm:p-4 sm:pt-0">
          <p className="w-full text-xs sm:text-base">{postData.content}</p>

          {postData.images && postData.images.length > 0 ? (
            <div className="mt-2 w-full">
              <ImageCarousel images={postData.images} />
            </div>
          ) : (
            // Add a min-height div to maintain consistent card size when no images
            <div className="mt-2 min-h-[1rem] w-full"></div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col p-0">
          <div className="flex w-full items-center justify-start gap-x-2 p-2 sm:gap-x-4 sm:p-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex h-7 items-center gap-1 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
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
