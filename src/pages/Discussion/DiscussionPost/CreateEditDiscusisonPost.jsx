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
  isModalOpen: externalIsModalOpen,
  setIsModalOpen: externalSetIsModalOpen,
}) {
  const [internalIsModalOpen, setInternalIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const { createPost, updatePost } = useDiscussionPost();

  const isModalOpen =
    externalIsModalOpen !== undefined
      ? externalIsModalOpen
      : internalIsModalOpen;
  const setIsModalOpen = externalSetIsModalOpen || setInternalIsModalOpen;

  const {
    fileInputRef,
    uploadedImages,
    setUploadedImages,
    existingImageUrls,
    setExistingImageUrls,
    handleFileChange,
    handleRemoveImage,
  } = useImageUploader();

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEdit && postData && isModalOpen) {
      setPostContent(postData.content || '');
      setExistingImageUrls(
        (postData.images || []).map((url) => ({ url, type: 'url' }))
      );
      setUploadedImages([]); // Reset uploaded images in edit mode
    } else if (!isEdit) {
      setPostContent('');
      setExistingImageUrls([]);
      setUploadedImages([]);
    }
  }, [isEdit, postData, isModalOpen]);

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

      // Append existing image URLs as a JSON string
      const imageUrls = existingImageUrls.map((image) => image.url);
      if (imageUrls.length > 0) {
        formData.append('existingImages', JSON.stringify(imageUrls));
      }

      // Append new file uploads
      uploadedImages.forEach((image) => {
        if (image.file) {
          formData.append('images', image.file);
        }
      });

      if (isEdit && postData) {
        await updatePost(postData._id, formData);
      } else {
        await createPost(eventId, formData);
      }

      setPostContent('');
      setUploadedImages([]);
      setExistingImageUrls([]);
      setIsModalOpen(false);
      onSuccess();
    } catch (err) {
      console.log(err)
    }
  };

  // Default trigger button if none provided
  const defaultTrigger = (
    <Button variant="default" size="default">
      <PlusIcon className="mr-2 h-4 w-4" />
      New Discussion
    </Button>
  );

  // Combine images for preview
  const allImages = [
    ...existingImageUrls.map((img) => ({ ...img, type: 'url' })),
    ...uploadedImages.map((img) => ({ ...img, type: 'file' })),
  ];

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
            existingImageUrls={existingImageUrls}
            handleFileChange={handleFileChange}
            handleRemoveImage={handleRemoveImage}
          />

          {/* Post Preview */}
          {(postContent || allImages.length > 0) && (
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

                  {allImages.length > 0 && (
                    <div
                      className={`grid ${allImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}
                    >
                      {allImages.slice(0, 4).map((image, index) => (
                        <div
                          key={index}
                          className={`${allImages.length === 3 && index === 0 ? 'col-span-2' : ''} ${
                            allImages.length === 1 ? 'max-h-80' : 'max-h-40'
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
                      {allImages.length > 4 && (
                        <div className="relative col-span-1">
                          <img
                            src={allImages[4].url || '/placeholder.svg'}
                            alt={`Preview 4`}
                            className="h-full w-full rounded-md object-cover opacity-80"
                            onError={(e) => {
                              e.target.src = '/abstract-geometric-shapes.png';
                            }}
                          />
                          <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-md bg-black">
                            <span className="font-medium text-white">
                              +{allImages.length - 4} more
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
            disabled={!postContent.trim() && allImages.length === 0}
          >
            {isEdit ? 'Update Post' : 'Create Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
