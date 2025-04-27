// src/pages/components/Header.jsx
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Bell, Menu } from 'lucide-react';

const Header = ({ isMobile, setSidebarOpen, activeSection, user }) => {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 md:px-6">
      <div className="flex items-center">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-semibold text-gray-800">
          {activeSection === 'dashboard'
            ? 'Dashboard'
            : activeSection === 'events'
              ? 'My Events'
              : activeSection === 'messages'
                ? 'Messages'
                : activeSection === 'profile'
                  ? 'Profile'
                  : 'Premium Version'}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex h-auto items-center gap-2 px-3 py-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{user?.name || 'User'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
