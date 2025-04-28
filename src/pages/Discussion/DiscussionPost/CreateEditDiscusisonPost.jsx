import { useState, useEffect } from 'react';
import { PlusIcon, FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';
import { Textarea } from '@/components/ui/textarea.js';
import { Card, CardContent } from '@/components/ui/card.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import { formatDistanceToNow } from 'date-fns';
import useDiscussionPost from '@/hooks/useDiscussionPost.js';
import { useImageUploader } from '@/components/ImageUploader.jsx';
import { ImageUploader } from '@/components/ImageUploader.jsx';
import { Toast } from '@/helpers/toastService.js';

export function CreateEditDiscussionPost({
                                           eventId,
                                           isEdit = false,
                                           postData = null,
                                           onSuccess = () => {},
                                           triggerButton = null,
                                           isModalOpen: externalIsModalOpen, // Controlled by parent
                                           setIsModalOpen: externalSetIsModalOpen, // Controlled by parent
                                         }) {
  const [internalIsModalOpen, setInternalIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const { createPost, updatePost } = useDiscussionPost();

  // Determine which open state to use (external or internal)
  const isModalOpen =
      externalIsModalOpen !== undefined
          ? externalIsModalOpen
          : internalIsModalOpen;
  const setIsModalOpen = externalSetIsModalOpen || setInternalIsModalOpen;

  const {
    fileInputRef,
    uploadedImages,
    setUploadedImages,
    handleFileChange,
    handleRemoveImage,
  } = useImageUploader();

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEdit && postData && isModalOpen) {
      setPostContent(postData.content || '');
      setUploadedImages([]); // Reset uploaded images in edit mode
    }
  }, [isEdit, postData, isModalOpen]);

  // Reset form when modal closes (only for create mode)
  useEffect(() => {
    if (!isModalOpen && !isEdit) {
      setPostContent('');
      setUploadedImages([]);
    }
  }, [isModalOpen, isEdit]);

  // Cleanup object URLs for uploaded images to prevent memory leaks
  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => {
        if (image.url && image.type === 'file') {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [uploadedImages]);

  // Handle post submission (create or update)
  const handleSubmitPost = async () => {
    try {
      const formData = new FormData();
      formData.append('content', postContent);

      // Thêm file ảnh vào FormData
      uploadedImages.forEach((image) => {
        if (image.file) {
          formData.append('images', image.file);
          // console.log("Image.file: ", image.file);
        }
      });

      console.log(formData.get('images'));

      if (isEdit && postData) {
        await updatePost(postData._id, formData);
      } else {
        await createPost(eventId, formData);
      }

      // Reset form and close modal
      setPostContent('');
      setUploadedImages([]);
      setIsModalOpen(false);

      // Notify parent component of success
      // onSuccess();
    } catch (err) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} post:`, err);
      Toast.error(
          `Failed to ${isEdit ? 'update' : 'create'} post`,
          err.message
      );
    }
  };

  // Default trigger button if none provided
  const defaultTrigger = (
      <Button variant="default" size="default">
        <PlusIcon className="mr-2 h-4 w-4" />
        New Discussion
      </Button>
  );

  return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>{triggerButton || defaultTrigger}</DialogTrigger>
        <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col">
          <DialogHeader>
            <DialogTitle className="font-bold">
              {isEdit ? 'Edit Discussion' : 'New Discussion'}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                  ? 'Update your post'
                  : 'Create a new post to share with others.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-6 overflow-y-auto pr-1">
            {/* Post Content */}
            <div className="space-y-2">
              <Label htmlFor="postContent">What's on your mind?</Label>
              <Textarea
                  id="postContent"
                  placeholder="Share your thoughts..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[120px]"
              />
            </div>

            {/* Image Uploader */}
            <ImageUploader
                fileInputRef={fileInputRef}
                uploadedImages={uploadedImages}
                handleFileChange={handleFileChange}
                handleRemoveImage={handleRemoveImage}
            />

            {/* Post Preview */}
            {(postContent || uploadedImages.length > 0) && (
                <div className="space-y-2">
                  <Label>Post Preview</Label>
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/diverse-group-city.png" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">You</div>
                          <div className="text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(), { addSuffix: true })}
                          </div>
                        </div>
                      </div>

                      {postContent && <p className="mb-3">{postContent}</p>}

                      {uploadedImages.length > 0 && (
                          <div
                              className={`grid ${uploadedImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}
                          >
                            {uploadedImages.slice(0, 4).map((image, index) => (
                                <div
                                    key={index}
                                    className={`${uploadedImages.length === 3 && index === 0 ? 'col-span-2' : ''} ${
                                        uploadedImages.length === 1
                                            ? 'max-h-80'
                                            : 'max-h-40'
                                    } overflow-hidden rounded-md`}
                                >
                                  <img
                                      src={image.url || '/placeholder.svg'}
                                      alt={`Preview ${index}`}
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        e.target.src = '/abstract-geometric-shapes.png';
                                      }}
                                  />
                                </div>
                            ))}
                            {uploadedImages.length > 4 && (
                                <div className="relative col-span-1">
                                  <img
                                      src={uploadedImages[4].url || '/placeholder.svg'}
                                      alt={`Preview 4`}
                                      className="h-full w-full rounded-md object-cover opacity-80"
                                      onError={(e) => {
                                        e.target.src = '/abstract-geometric-shapes.png';
                                      }}
                                  />
                                  <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-md bg-black">
                            <span className="font-medium text-white">
                              +{uploadedImages.length - 4} more
                            </span>
                                  </div>
                                </div>
                            )}
                          </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex-shrink-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
                onClick={handleSubmitPost}
                disabled={!postContent.trim() && uploadedImages.length === 0}
            >
              {isEdit ? 'Update Post' : 'Create Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}