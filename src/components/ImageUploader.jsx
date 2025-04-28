import { useRef, useState } from 'react';
import { Label } from '@/components/ui/label.js';
import { FileIcon, ImageIcon, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.js';
import { Input } from '@/components/ui/input.js';

// Custom hook to manage image uploading logic
export const useImageUploader = () => {
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: 'file',
    }));

    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const handleRemoveImage = (index, type) => {
    if (type === 'file') {
      const newUploadedImages = [...uploadedImages];
      URL.revokeObjectURL(newUploadedImages[index].url);
      newUploadedImages.splice(index, 1);
      setUploadedImages(newUploadedImages);
    } else if (type === 'url') {
      const newImageUrls = [...existingImageUrls];
      newImageUrls.splice(index, 1);
      setExistingImageUrls(newImageUrls);
    }
  };

  return {
    fileInputRef,
    uploadedImages,
    setUploadedImages,
    existingImageUrls,
    setExistingImageUrls,
    handleFileChange,
    handleRemoveImage,
  };
};

export const ImageUploader = ({
  fileInputRef,
  uploadedImages,
  existingImageUrls,
  handleFileChange,
  handleRemoveImage,
}) => {
  return (
    <div className="space-y-2">
      <Label>Add Images</Label>
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div
              className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed border-gray-200 p-6 transition-colors hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileIcon className="h-12 w-12" />
              <span className="text-sm font-medium text-gray-500">
                Drag and drop images or click to browse
              </span>
              <span className="text-xs text-gray-500">
                Select multiple images (up to 10)
              </span>
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Combined Images Preview (Existing URLs and Uploaded Files) */}
        {(uploadedImages.length > 0 || existingImageUrls.length > 0) && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {/* Existing Image URLs */}
            {existingImageUrls.map((image, index) => (
              <div key={`url-${index}`} className="group relative">
                <img
                  src={image.url || '/placeholder.svg'}
                  alt={`Existing ${index}`}
                  className="h-24 w-full rounded-md object-cover"
                  onError={(e) => {
                    e.target.src = '/abstract-geometric-shapes.png';
                    e.target.alt = 'Invalid image URL';
                  }}
                />
                <button
                  className="bg-opacity-50 absolute top-1 right-1 rounded-full bg-black p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemoveImage(index, 'url')}
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="bg-opacity-50 absolute bottom-1 left-1 max-w-[90%] truncate rounded bg-black px-1 text-xs text-white">
                  Existing Image
                </span>
              </div>
            ))}
            {/* Uploaded Images */}
            {uploadedImages.map((image, index) => (
              <div key={`file-${index}`} className="group relative">
                <img
                  src={image.url || '/placeholder.svg'}
                  alt={`Uploaded ${index}`}
                  className="h-24 w-full rounded-md object-cover"
                />
                <button
                  className="bg-opacity-50 absolute top-1 right-1 rounded-full bg-black p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemoveImage(index, 'file')}
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="bg-opacity-50 absolute bottom-1 left-1 max-w-[90%] truncate rounded bg-black px-1 text-xs text-white">
                  {image.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
