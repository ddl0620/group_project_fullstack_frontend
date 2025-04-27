// src/components/DiscussionHeader.jsx
import { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  MessageSquare,
  Trash2,
  PlusIcon,
  FileIcon,
} from 'lucide-react';
import PostModal from '../DiscussionPost/PostModal.jsx';
import { useDiscussionPost } from '@/hooks/useDiscussionPost.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Card, CardContent, CardFooter } from '@/components/ui/card.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';

const DiscussionHeader = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createPost } = useDiscussionPost();

  const handleCreatePost = async (postData) => {
    try {
      await createPost(event.id, postData);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          <div className="mt-2 flex flex-wrap gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-1 h-4 w-4" />
              {new Date(event.startDate).toLocaleDateString()} -
              {new Date(event.endDate).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="mr-1 h-4 w-4" />
              {event.location}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="mr-1 h-4 w-4" />
              {event.participants.length} attendees
            </div>
          </div>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" size="md">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className={'text-black'}>
            <DialogHeader>
              <DialogTitle className={'font-bold'}>New Discussion</DialogTitle>
              <DialogDescription>
                Create a new thread for this event.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className={'space-y-2'}>
                <Label htmlFor="examId">Your tile of discussion</Label>
                <Input
                  id="examId"
                  placeholder="Nhập mã đề thi (ví dụ: EXAM1)"
                />
              </div>
              <div className={'space-y-2'}>
                <Label htmlFor="examId">
                  What is the topic of your discussion?
                </Label>
                <Textarea
                  id="examId"
                  // value={createFormData.examId}
                  // onChange={e =>
                  //     setCreateFormData({
                  //         ...createFormData,
                  //         examId: e.target.value,
                  //     })
                  // }
                  placeholder="Nhập mã đề thi (ví dụ: EXAM1)"
                />
              </div>
              <div className={'space-y-2'}>
                <Label htmlFor="questionsFile">Upload your image</Label>
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-dashed border-gray-200 p-6">
                      <FileIcon className="h-12 w-12" />
                      <span className="text-sm font-medium text-gray-500">
                        Drag and drop a image or click to browse
                      </span>
                      <span className="text-xs text-gray-500">Up to 2MB</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <Label htmlFor="file" className="text-sm font-medium">
                        Choose a image
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        placeholder="File"
                        accept="image"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DiscussionHeader;
