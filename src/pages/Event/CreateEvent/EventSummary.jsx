import { Card, CardContent } from '@/components/ui/card';

export default function EventSummary({
  formData,
  uploadedImages,
  existingImageUrls = [],
}) {
  const totalImages = uploadedImages.length + existingImageUrls.length;

  return (
    <Card className="mt-6 border-dashed">
      <CardContent className="pt-6">
        <h3 className="mb-4 text-lg font-medium">Event Summary</h3>

        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Event Name
            </p>
            <p>{formData.title || 'Not provided'}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Description
            </p>
            <p className="line-clamp-2">
              {formData.description || 'Not provided'}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Category
            </p>
            <p>{formData.category || 'Not provided'}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Date Range
            </p>
            <p>
              {formData.dateRange.from.toLocaleDateString()} -{' '}
              {formData.dateRange.to.toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Location
            </p>
            <p>{formData.location || 'Not provided'}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Organizer
            </p>
            <p>
              {formData.organizer ? formData.organizer.name : 'Not assigned'}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Settings
            </p>
            <p>{formData.isPublic ? 'Public event' : 'Private event'}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-medium">Images</p>
            <p>{totalImages} images selected</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
