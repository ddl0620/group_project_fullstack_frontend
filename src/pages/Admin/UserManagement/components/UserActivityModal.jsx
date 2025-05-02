'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Pagination from '../../../../components/shared/Pagination.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

export default function UserActivityModal({
  isOpen,
  setIsOpen,
  selectedUser,
  userActivity,
}) {
  // Pagination state for each tab
  const [organizedCurrentPage, setOrganizedCurrentPage] = useState(1);
  const [participatedCurrentPage, setParticipatedCurrentPage] = useState(1);
  const [postsCurrentPage, setPostsCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('organized');

  const itemsPerPage = 5;

  // Reset pagination when user changes or modal opens
  useEffect(() => {
    setOrganizedCurrentPage(1);
    setParticipatedCurrentPage(1);
    setPostsCurrentPage(1);
  }, [selectedUser, isOpen]);

  if (!selectedUser) return null;

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM d, yyyy');
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Pagination calculations for each tab
  const organizedEvents = userActivity.organizedEvents || [];
  const organizedTotalPages = Math.ceil(organizedEvents.length / itemsPerPage);
  const organizedCurrentItems = organizedEvents.slice(
    (organizedCurrentPage - 1) * itemsPerPage,
    organizedCurrentPage * itemsPerPage
  );

  const participatedEvents = userActivity.participatedEvents || [];
  const participatedTotalPages = Math.ceil(
    participatedEvents.length / itemsPerPage
  );
  const participatedCurrentItems = participatedEvents.slice(
    (participatedCurrentPage - 1) * itemsPerPage,
    participatedCurrentPage * itemsPerPage
  );

  const discussionPosts = userActivity.discussionPosts || [];
  const postsTotalPages = Math.ceil(discussionPosts.length / itemsPerPage);
  const postsCurrentItems = discussionPosts.slice(
    (postsCurrentPage - 1) * itemsPerPage,
    postsCurrentPage * itemsPerPage
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-[800px] sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle>User Activity</DialogTitle>
          <DialogDescription>
            {selectedUser
              ? `Viewing activity for ${selectedUser.name}`
              : 'User activity'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 sm:py-4">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <Avatar className="mx-auto mb-2 h-16 w-16 sm:mx-0 sm:mb-0">
              <AvatarImage
                src={selectedUser.avatar || '/placeholder.svg'}
                alt={selectedUser.name}
              />
              <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-medium">{selectedUser.name}</h3>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
          </div>

          <Tabs
            defaultValue="organized"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="organized"
                className="px-1 text-xs sm:px-3 sm:text-sm"
              >
                <Calendar className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Organized and Joined</span>
                <span className="sm:hidden">Events</span>
              </TabsTrigger>
              <TabsTrigger
                value="participated"
                className="px-1 text-xs sm:px-3 sm:text-sm"
              >
                <Users className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Participated</span>
                <span className="sm:hidden">Joined</span>
              </TabsTrigger>
              {/*<TabsTrigger*/}
              {/*  value="posts"*/}
              {/*  className="px-1 text-xs sm:px-3 sm:text-sm"*/}
              {/*>*/}
              {/*  <MessageSquare className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />*/}
              {/*  <span className="hidden sm:inline">Discussion</span>*/}
              {/*  <span className="sm:hidden">Posts</span>*/}
              {/*</TabsTrigger>*/}
            </TabsList>

            <TabsContent value="organized">
              <div className="max-h-[40vh] overflow-y-auto">
                {organizedEvents.length === 0 ? (
                  <p className="py-4 text-center text-gray-500">
                    No organized events found
                  </p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {organizedCurrentItems.map((event) => (
                      <div
                        key={event._id}
                        className="rounded-lg border p-3 sm:p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h4 className="text-sm font-medium sm:text-base">
                              {event.title}
                            </h4>
                            <p className="text-xs text-gray-500 sm:text-sm">
                              {formatDate(event.startDate)} -{' '}
                              {formatDate(event.endDate)}
                            </p>
                          </div>
                          <Badge className="mt-1 self-start text-xs sm:mt-0">
                            {event.type}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs sm:text-sm">
                          {event.description}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <Users className="mr-1 h-3 w-3" />
                          <span>{event.participants.length} participants</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {organizedEvents.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <Pagination
                    currentPage={organizedCurrentPage}
                    totalPages={organizedTotalPages}
                    onPageChange={setOrganizedCurrentPage}
                    totalItems={organizedEvents.length}
                    itemsPerPage={itemsPerPage}
                    itemName="events"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="participated">
              <div className="max-h-[40vh] overflow-y-auto">
                {participatedEvents.length === 0 ? (
                  <p className="py-4 text-center text-gray-500">
                    No participated events found
                  </p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {participatedCurrentItems.map((event) => (
                      <div
                        key={event._id}
                        className="rounded-lg border p-3 sm:p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h4 className="text-sm font-medium sm:text-base">
                              {event.title}
                            </h4>
                            <p className="text-xs text-gray-500 sm:text-sm">
                              {formatDate(event.startDate)} -{' '}
                              {formatDate(event.endDate)}
                            </p>
                          </div>
                          <Badge className="mt-1 self-start text-xs sm:mt-0">
                            {event.type}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs sm:text-sm">
                          {event.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {participatedEvents.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <Pagination
                    currentPage={participatedCurrentPage}
                    totalPages={participatedTotalPages}
                    onPageChange={setParticipatedCurrentPage}
                    totalItems={participatedEvents.length}
                    itemsPerPage={itemsPerPage}
                    itemName="events"
                  />
                </div>
              )}
            </TabsContent>

            {/*<TabsContent value="posts">*/}
            {/*  <div className="max-h-[40vh] overflow-y-auto">*/}
            {/*    {discussionPosts.length === 0 ? (*/}
            {/*      <p className="py-4 text-center text-gray-500">*/}
            {/*        No discussion posts found*/}
            {/*      </p>*/}
            {/*    ) : (*/}
            {/*      <div className="space-y-3 sm:space-y-4">*/}
            {/*        {postsCurrentItems.map((post) => (*/}
            {/*          <div*/}
            {/*            key={post._id}*/}
            {/*            className="rounded-lg border p-3 sm:p-4"*/}
            {/*          >*/}
            {/*            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">*/}
            {/*              <p className="text-xs text-gray-500 sm:text-sm">*/}
            {/*                Posted on {formatDate(post.created_at)}*/}
            {/*              </p>*/}
            {/*              <Badge*/}
            {/*                variant="outline"*/}
            {/*                className="mt-1 self-start text-xs sm:mt-0"*/}
            {/*              >*/}
            {/*                Event:{' '}*/}
            {/*                {userActivity.organizedEvents.find(*/}
            {/*                  (e) => e._id === post.event_id*/}
            {/*                )?.title || post.event_id}*/}
            {/*              </Badge>*/}
            {/*            </div>*/}
            {/*            <p className="mt-2 text-xs sm:text-sm">*/}
            {/*              {post.content}*/}
            {/*            </p>*/}
            {/*            {post.images && post.images.length > 0 && (*/}
            {/*              <div className="mt-2 flex flex-wrap gap-2">*/}
            {/*                {post.images.map((img, i) => (*/}
            {/*                  <img*/}
            {/*                    key={i}*/}
            {/*                    src={img || '/placeholder.svg'}*/}
            {/*                    alt={`Post image ${i + 1}`}*/}
            {/*                    className="h-12 w-12 rounded object-cover sm:h-16 sm:w-16"*/}
            {/*                  />*/}
            {/*                ))}*/}
            {/*              </div>*/}
            {/*            )}*/}
            {/*          </div>*/}
            {/*        ))}*/}
            {/*      </div>*/}
            {/*    )}*/}
            {/*  </div>*/}
            {/*  {discussionPosts.length > 0 && (*/}
            {/*    <div className="mt-4 border-t pt-4">*/}
            {/*      <Pagination*/}
            {/*        currentPage={postsCurrentPage}*/}
            {/*        totalPages={postsTotalPages}*/}
            {/*        onPageChange={setPostsCurrentPage}*/}
            {/*        totalItems={discussionPosts.length}*/}
            {/*        itemsPerPage={itemsPerPage}*/}
            {/*        itemName="posts"*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*</TabsContent>*/}
          </Tabs>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full sm:w-auto">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
