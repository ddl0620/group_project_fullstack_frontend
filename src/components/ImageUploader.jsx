import {useRef, useState} from 'react';
import { Label } from '@/components/ui/label.js';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.js';
import { FileIcon, ImageIcon, Link, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.js';
import { Input } from '@/components/ui/input.js';
import { Button } from '@/components/ui/button.js';

// Custom hook to manage image uploading logic
export const useImageUploader = () => {
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const handleAddImageUrl = () => {
    if (!currentImageUrl.trim()) return;

    setImageUrls([...imageUrls, { url: currentImageUrl, type: 'url' }]);
    setCurrentImageUrl('');
  };

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
    } else {
      const newImageUrls = [...imageUrls];
      newImageUrls.splice(index, 1);
      setImageUrls(newImageUrls);
    }
  };

  const allImages = [
    ...uploadedImages.map((img) => ({ ...img, type: 'file' })),
    ...imageUrls.map((img) => ({ ...img, type: 'url' })),
  ];

  return {
    setUploadedImages,
    setImageUrls,
    fileInputRef,
    uploadedImages,
    imageUrls,
    currentImageUrl,
    setCurrentImageUrl,
    handleAddImageUrl,
    handleFileChange,
    handleRemoveImage,
    allImages,
  };
};

export const ImageUploader = ({
  fileInputRef,
  uploadedImages,
  imageUrls,
  currentImageUrl,
  setCurrentImageUrl,
  handleAddImageUrl,
  handleFileChange,
  handleRemoveImage,
}) => {
  return (
    <div className="space-y-2">
      <Label>Add Images</Label>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <ImageIcon className="mr-2 h-4 w-4" />
            Upload Images
          </TabsTrigger>
          <TabsTrigger value="url">
            <Link className="mr-2 h-4 w-4" />
            Previous Images
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
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

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {uploadedImages.map((image, index) => (
                <div key={index} className="group relative">
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
        </TabsContent>

        {/* URL Tab */}
        {/*<TabsContent value="url" className="space-y-4">*/}
        {/*  /!* URL Images Preview *!/*/}
        {/*  {imageUrls.length > 0 && (*/}
        {/*    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">*/}
        {/*      {imageUrls.map((image, index) => (*/}
        {/*        <div key={index} className="group relative">*/}
        {/*          <img*/}
        {/*            src={image.url || '/placeholder.svg'}*/}
        {/*            alt={`URL ${index}`}*/}
        {/*            className="h-24 w-full rounded-md object-cover"*/}
        {/*            onError={(e) => {*/}
        {/*              e.target.src = '/abstract-geometric-shapes.png';*/}
        {/*              e.target.alt = 'Invalid image URL';*/}
        {/*            }}*/}
        {/*          />*/}
        {/*          <button*/}
        {/*            className="bg-opacity-50 absolute top-1 right-1 rounded-full bg-black p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"*/}
        {/*            onClick={() => handleRemoveImage(index, 'url')}*/}
        {/*          >*/}
        {/*            <X className="h-4 w-4" />*/}
        {/*          </button>*/}
        {/*          <span className="bg-opacity-50 absolute bottom-1 left-1 max-w-[90%] truncate rounded bg-black px-1 text-xs text-white">*/}
        {/*            URL*/}
        {/*          </span>*/}
        {/*        </div>*/}
        {/*      ))}*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*</TabsContent>*/}
      </Tabs>
    </div>
  );
};