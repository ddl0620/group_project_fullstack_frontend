import { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Comment from '@/pages/Discussion/DiscussionReply/Comment.jsx';
import { useSelector } from 'react-redux';
import useDiscussionReply from '@/hooks/useDiscussionReply.js';
import { Toast } from '@/helpers/toastService.js';
import {
  useImageUploader,
  ImageUploader,
} from '@/components/ImageUploader.jsx';

// Function to organize replies into a tree structure
const organizeRepliesIntoTree = (replies) => {
  const replyMap = new Map();
  replies.forEach((reply) => {
    replyMap.set(reply._id, { ...reply, children: [] });
  });

  const rootReplies = [];

  replies.forEach((reply) => {
    const replyWithChildren = replyMap.get(reply._id);

    if (reply.parent_reply_id === null) {
      rootReplies.push(replyWithChildren);
    } else {
      const parentReply = replyMap.get(reply.parent_reply_id);
      if (parentReply) {
        parentReply.children.push(replyWithChildren);
      }
    }
  });
  return rootReplies;
};

// Main Comment Section Component
export function CommentSection({ postId, initialReplies = [] }) {
  const [replies, setReplies] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [treeStructure, setTreeStructure] = useState([]);
  const currentUser = useSelector((state) => state.user.user);
  const { createNewReply, deleteReply, updateReply } = useDiscussionReply();

  const {
    fileInputRef,
    uploadedImages,
    setUploadedImages,
    existingImageUrls,
    setExistingImageUrls,
    handleFileChange,
    handleRemoveImage,
  } = useImageUploader();

  // Initialize with provided replies
  useEffect(() => {
    if (initialReplies.length > 0) {
      setReplies(initialReplies);
      const tree = organizeRepliesIntoTree(initialReplies);
      setTreeStructure(tree);
    }
  }, [initialReplies]);

  // Cleanup object URLs for uploaded images to prevent memory leaks
  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => {
        if (image.url) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [uploadedImages]);

  const handleAddComment = async () => {
    if (newComment.trim() === '' && uploadedImages.length === 0) return;

    const formData = new FormData();
    formData.append('content', newComment);
    formData.append('parent_reply_id', 'null');

    uploadedImages.forEach((image) => {
      if (image.file) {
        formData.append('images', image.file);
      }
    });

    const formDataEntries = Object.fromEntries(formData.entries());
    console.log('FormData add comment sent:', formDataEntries);

    try {
      const response = await createNewReply(postId, formData);
      if (!response) {
        Toast.error('Failed to create reply');
      }
      const newReply = {
        ...response,
        creator_id: {
          _id: currentUser._id,
        },
      };

      const updatedReplies = [...replies, newReply];
      setReplies(updatedReplies);
      setTreeStructure(organizeRepliesIntoTree(updatedReplies));

      setNewComment('');
      setUploadedImages([]);
      setShowImageUploader(false);
    } catch (err) {
      Toast.error('Error creating comment', err);
    }
  };

  const handleReply = async (replyData) => {
    if (
      replyData.content.trim() === '' &&
      replyData.uploadedImages.length === 0
    )
      return;

    if (
      !replyData.parent_reply_id ||
      !/^[0-9a-fA-F]{24}$/.test(replyData.parent_reply_id)
    ) {
      Toast.error('Invalid parent reply ID');
      return;
    }

    const formData = new FormData();
    formData.append('content', replyData.content);
    formData.append('parent_reply_id', replyData.parent_reply_id);

    replyData.uploadedImages.forEach((image) => {
      if (image.file) {
        formData.append('images', image.file);
      }
    });

    const formDataEntries = Object.fromEntries(formData.entries());
    console.log('FormData add reply sent:', formDataEntries);

    try {
      const response = await createNewReply(replyData.post_id, formData);
      const newReply = {
        ...response,
        creator_id: {
          _id: currentUser._id,
        },
      };

      const updatedReplies = [...replies, newReply];
      setReplies(updatedReplies);
      setTreeStructure(organizeRepliesIntoTree(updatedReplies));

      setUploadedImages([]);
      setShowImageUploader(false);
    } catch (err) {
      Toast.error('Error creating reply', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteReply(postId, commentId);
      const updatedReplies = replies.filter((reply) => reply._id !== commentId);
      setReplies(updatedReplies);
      setTreeStructure(organizeRepliesIntoTree(updatedReplies));
    } catch (err) {
      Toast.error('Error deleting reply', err);
    }
  };

  const handleEditComment = async (replyId, editData) => {
    try {
      const formData = new FormData();
      formData.append('content', editData.content);

      const imageUrls = editData.existingImageUrls.map((image) => image.url);
      if (imageUrls.length > 0) {
        formData.append('existingImages', JSON.stringify(imageUrls));
      }

      editData.uploadedImages.forEach((image) => {
        if (image.file) {
          formData.append('images', image.file);
        }
      });

      const formDataEntries = Object.fromEntries(formData.entries());
      console.log('FormData edit comment sent:', formDataEntries);

      const response = await updateReply(replyId, formData);
      const updatedReplies = replies.map((reply) => {
        if (reply._id === replyId) {
          return {
            ...reply,
            content: editData.content,
            images: response.images || [],
          };
        }
        return reply;
      });

      setReplies(updatedReplies);
      setTreeStructure(organizeRepliesIntoTree(updatedReplies));

      setUploadedImages([]);
      setExistingImageUrls([]);
      setShowImageUploader(false);
    } catch (err) {
      console.error('Error editing comment:', err);
      Toast.error('Error editing reply', err.message || 'Unknown error');
    }
  };

  return (
    <div className="w-full space-y-2 px-2 sm:space-y-4 sm:px-3">
      <div className="space-y-2 sm:space-y-3">
        <div className="flex gap-2 sm:gap-3">
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
            <AvatarImage
              src={currentUser.avatar || '/placeholder.svg'}
              alt={currentUser.name}
            />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="h-8 text-xs sm:h-10 sm:text-sm"
            />
          </div>
        </div>

        {showImageUploader && (
          <ImageUploader
            fileInputRef={fileInputRef}
            uploadedImages={uploadedImages}
            existingImageUrls={existingImageUrls}
            handleFileChange={handleFileChange}
            handleRemoveImage={handleRemoveImage}
          />
        )}

        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageUploader(!showImageUploader)}
            className="h-7 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
          >
            <ImageIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            {showImageUploader ? 'Hide Images' : 'Add Image'}
          </Button>

          <Button
            onClick={handleAddComment}
            disabled={newComment.trim() === '' || (uploadedImages.length >= 0 && newComment.trim() === '')}
            size="sm"
            className="h-7 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
          >
            Comment
          </Button>
        </div>
      </div>

      <Separator className="my-1 sm:my-2" />

      <div className="space-y-2 sm:space-y-4">
        {treeStructure.length > 0 ? (
          treeStructure.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onReply={handleReply}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              currentUserId={currentUser._id}
              postId={postId}
            />
          ))
        ) : (
          <p className="text-muted-foreground py-2 text-center text-xs sm:py-4 sm:text-sm">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
