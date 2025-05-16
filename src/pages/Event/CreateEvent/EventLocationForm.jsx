import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

export default function EventLocationForm({ formData, handleChange }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <MapPin className="text-muted-foreground mr-2 h-4 w-4" />
          <Label htmlFor="location">Location Name</Label>
        </div>
        <Input
          id="location"
          placeholder="Example: Central Park, Conference Center"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      <div className="rounded-md border border-dashed p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <MapPin className="text-muted-foreground h-10 w-10" />
          <p className="text-muted-foreground mt-2 text-sm">
            Map integration will be added in the future
          </p>
        </div>
      </div>
    </div>
  );
}
