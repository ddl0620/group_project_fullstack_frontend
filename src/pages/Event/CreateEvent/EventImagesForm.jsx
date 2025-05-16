import { Label } from '@/components/ui/label';
import { ImageIcon, Info } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';

export default function EventImagesForm({
  fileInputRef,
  uploadedImages,
  existingImageUrls,
  handleFileChange,
  handleRemoveImage,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <ImageIcon className="text-muted-foreground mr-2 h-4 w-4" />
        <Label>Event Images</Label>
      </div>

      <ImageUploader
        fileInputRef={fileInputRef}
        uploadedImages={uploadedImages}
        existingImageUrls={existingImageUrls}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
      />

      <div className="bg-muted rounded-md p-4">
        <div className="flex items-start">
          <Info className="text-muted-foreground mr-2 h-5 w-5" />
          <div className="text-muted-foreground text-sm">
            <p>Add images to make your event stand out.</p>
            <p>Recommended size: 1200 x 630 pixels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
