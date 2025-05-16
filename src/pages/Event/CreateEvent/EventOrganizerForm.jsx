import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export default function EventOrganizerForm({
  formData,
  handleChange,
  users = [],
}) {
  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <User className="text-muted-foreground mr-2 h-4 w-4" />
        <Label>Event Organizer</Label>
      </div>

      <Select
        value={formData.organizer?._id || ''}
        onValueChange={(value) => {
          const selectedUser = users.find((user) => user._id === value) || null;
          handleChange('organizer', selectedUser);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an organizer" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user._id} value={user._id}>
              <div className="flex items-center">
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage
                    src={user.avatar || '/placeholder.svg'}
                    alt={user.name}
                  />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {formData.organizer && (
        <div className="bg-muted rounded-md p-4">
          <div className="flex items-center">
            <Avatar className="mr-3 h-10 w-10">
              <AvatarImage
                src={formData.organizer.avatar || '/placeholder.svg'}
                alt={formData.organizer.name}
              />
              <AvatarFallback>
                {getInitials(formData.organizer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{formData.organizer.name}</p>
              <p className="text-muted-foreground text-sm">
                {formData.organizer.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
