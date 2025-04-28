import { useState, useEffect } from 'react';
import { X, ImageIcon } from 'lucide-react';
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

  // Organize replies into a tree structure
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

    // Create a new comment
    const formData = new FormData();
    formData.append('parent_reply_id', null);
    formData.append('content', newComment);

    // Thêm file ảnh vào FormData
    uploadedImages.forEach((image) => {
      if (image.file) {
        formData.append('images', image.file);
      }
    });

    try {
      const response = await createNewReply(postId, formData);
      const newReply = {
        ...response,
        creator_id: {
          _id: currentUser._id,
        },
      };

      // Add to replies and update tree structure
      const updatedReplies = [...replies, newReply];
      setReplies(updatedReplies);
      setTreeStructure(organizeRepliesIntoTree(updatedReplies));

      // Reset form
      setNewComment('');
      setUploadedImages([]);
      setShowImageUploader(false);
    } catch (err) {
      Toast.error('Error creating comment', err);
    }
  };

  const handleReply = async (replyData) => {
    if (replyData.content.trim() === '' && uploadedImages.length === 0) return;

    const formData = new FormData();
    formData.append('parent_reply_id', replyData.parent_reply_id);
    formData.append('content', replyData.content);

    // Thêm file ảnh vào FormData
    uploadedImages.forEach((image) => {
      if (image.file) {
        formData.append('images', image.file);
      }
    });

    try {
      const response = await createNewReply(replyData.post_id, formData);
      const newReply = {
        ...response,
        creator_id: {
          _id: currentUser._id,
        },
      };

      // Add to replies and update tree structure
      const updatedReplies = [...replies, newReply];
      setReplies(updatedReplies);
      setTreeStructure(organizeRepliesIntoTree(updatedReplies));

      // Reset form
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

      // Thêm file ảnh vào FormData
      uploadedImages.forEach((image) => {
        if (image.file) {
          formData.append('images', image.file);
        }
      });

      const response = await updateReply(replyId, formData);
      const updatedReplies = replies.map((reply) => {
        if (reply._id === replyId) {
          return {
            ...reply,
            content: editData.content,
            images: response.images || [], // Dựa vào phản hồi từ backend
          };
        }
        return reply;
      });

      setReplies(updatedReplies);
      setTreeStructure(organizeRepliesIntoTree(updatedReplies));

      // Reset form
      setUploadedImages([]);
      setShowImageUploader(false);
    } catch (err) {
      Toast.error('Error editing reply', err);
    }
  };

  return (
    <div className="w-full space-y-4 px-3">
      {/* New comment input */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
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
            />
          </div>
        </div>

        {/* Image Uploader */}
        {showImageUploader && (
          <ImageUploader
            fileInputRef={fileInputRef}
            uploadedImages={uploadedImages}
            handleFileChange={handleFileChange}
            handleRemoveImage={handleRemoveImage}
          />
        )}

        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageUploader(!showImageUploader)}
          >
            <ImageIcon className="mr-1 h-4 w-4" />
            {showImageUploader ? 'Hide Image Uploader' : 'Add Image'}
          </Button>

          <Button
            onClick={handleAddComment}
            disabled={newComment.trim() === '' && uploadedImages.length === 0}
          >
            Comment
          </Button>
        </div>
      </div>

      <Separator />

      {/* Comments list */}
      <div className="space-y-4">
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
          <p className="text-muted-foreground py-4 text-center">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
