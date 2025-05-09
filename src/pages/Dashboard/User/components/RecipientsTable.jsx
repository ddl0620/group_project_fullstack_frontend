"use client"
// src/pages/components/RecipientsTable.jsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronDown, MoreHorizontal, Search, Plus, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge.js';

const RecipientsTable = ({ activeTab, setActiveTab, recipientsData }) => {
  console.log("Recipients Data in Component:", recipientsData) // Kiểm tra dữ liệu được truyền vào component
  return (
    <Card className="mb-6">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base font-medium">
          Recipients List{' '}
          <span className="text-xs font-normal text-gray-500">
            ({recipientsData.length} Recipients)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4 w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="accepted"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              onClick={() => setActiveTab('accepted')}
            >
              Accepted
            </TabsTrigger>
            <TabsTrigger
              value="declined"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              onClick={() => setActiveTab('declined')}
            >
              Declined
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </TabsTrigger>
          </TabsList>

          <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search recipients by name or email"
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm md:w-[400px]"
              />
            </div>
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Send New Invitation
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    <div className="flex items-center">
                      NAME <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="whitespace-nowrap">EMAIL</TableHead>
                  <TableHead className="whitespace-nowrap">
                    RSVP STATUS
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    RESPONDED AT
                  </TableHead>
                  <TableHead className="whitespace-nowrap">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipientsData
                  .filter((recipient) => {
                    if (activeTab === 'overview') return true;
                    return recipient.rsvp.toLowerCase() === activeTab;
                  })
                  .map((recipient) => (
                    <TableRow key={recipient.id}>
                      <TableCell className="py-2">
                        <div className="flex items-center">
                          <Avatar className="mr-3 h-8 w-8">
                            <AvatarImage
                              src={recipient.avatar}
                              alt={recipient.name}
                            />
                            <AvatarFallback>
                              {recipient.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{recipient.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-sm">{recipient.email}</TableCell>
                      <TableCell className="py-2">
                        <Badge
                          variant={
                            recipient.rsvp === 'Accepted'
                              ? 'success'
                              : recipient.rsvp === 'Declined'
                                ? 'destructive'
                                : 'warning'
                          }
                          className={
                            recipient.rsvp === 'Declined'
                              ? 'text-white bg-red-600 !h-8 !px-3 !text-sm !leading-8'
                              : recipient.rsvp === 'Accepted'
                                ? 'text-white bg-green-600 !h-8 !px-3 !text-sm !leading-8'
                                : 'text-gray-800 bg-yellow-300 !h-8 !px-3 !text-sm !leading-8'
                          }
                        >
                          {recipient.rsvp}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-sm">{recipient.respondedAt}</TableCell>
                      <TableCell className="py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="link"
              className="text-blue-500 hover:text-blue-600"
            >
              See All Recipients
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export function RecentRecipients({ fullTable = false, data = [] }) {
  console.log("Recipients Data in Component:", data); // Kiểm tra dữ liệu được truyền vào component
}

export default RecipientsTable;