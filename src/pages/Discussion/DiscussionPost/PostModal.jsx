// src/components/PostModal.jsx
import { useState, useEffect } from 'react';
import { X, Image, PlusCircle } from 'lucide-react';

const PostModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  eventId,
}) => {
  const [content, setContent] = useState(initialData.content || '');
  const [images, setImages] = useState(initialData.images || []);
  const [imageUrls, setImageUrls] = useState([]); // For now, we'll use URLs as a placeholder for image uploads

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || '');
      setImages(initialData.images || []);
    }
  }, []);

  const handleImageAdd = (e) => {
    const url = e.target.value;
    if (url) {
      setImageUrls([...imageUrls, url]);
      setImages([...images, url]); // In a real app, you'd upload the image and get a URL
      e.target.value = '';
    }
  };

  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setImageUrls(newImages);
  };

  const handleSubmit = () => {
    onSubmit({ content, images, eventId });
    setContent('');
    setImages([]);
    setImageUrls([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {initialData._id
              ? 'Edit Discussion Post'
              : 'Create New Discussion Post'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your discussion post..."
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Add Images (URLs)
          </label>
          <div className="mb-2 flex items-center">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter image URL..."
              onKeyDown={(e) => e.key === 'Enter' && handleImageAdd(e)}
            />
            <button
              onClick={(e) =>
                handleImageAdd({ target: e.currentTarget.previousSibling })
              }
              className="ml-2 text-blue-600 hover:text-blue-700"
            >
              <PlusCircle className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt="Preview"
                  className="h-16 w-16 rounded object-cover"
                />
                <button
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {initialData._id ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
