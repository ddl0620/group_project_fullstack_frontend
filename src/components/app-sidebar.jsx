'use client';

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Commented out as requested
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  Calendar,
  User,
  PanelLeft,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';

// For demo purposes without react-router
// const useLocation = () => {
//   return { pathname: "/all-events" }
// }

export function AppSidebar({
  items = defaultItems,
  title = 'Event Management',
}) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state.user.user);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      // Auto-collapse on iPad and smaller screens
      if (width < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle sidebar collapsed state
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Mobile sidebar toggle
  const toggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-20 left-4 z-30 h-10 w-10 rounded-full bg-white/80 shadow-md backdrop-blur-sm"
          onClick={toggleMobileSidebar}
        >
          <PanelLeft className="h-5 w-5 text-gray-700" />
        </Button>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
          isCollapsed ? 'w-[5rem]' : 'w-[16rem]'
        } ${isMobile ? 'fixed inset-y-0 left-0 z-30 shadow-lg' : 'relative'} ${
          isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center border-b border-gray-200 px-4 dark:border-gray-800">
          {!isCollapsed ? (
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0071e3]">
                <span className="text-lg font-bold text-white">E</span>
              </div>
              <h1 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h1>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0071e3]">
                <span className="text-lg font-bold text-white">E</span>
              </div>
            </div>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation - Scrollable area */}
        <div className="flex-1 overflow-y-auto py-2">
          <TooltipProvider delayDuration={0}>
            <nav className="space-y-1 px-2">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Tooltip key={item.title} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.url}
                        className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'text-[#0071e3] dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 flex-shrink-0 transition-colors ${
                            isActive
                              ? 'text-[#0071e3] dark:text-blue-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="ml-3 overflow-hidden whitespace-nowrap">
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </nav>
          </TooltipProvider>
        </div>


        <div className="mt-auto border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-4">
            {!isCollapsed && (
              <div className="flex items-center">
                <CustomAvatar
                  _classname={'h-10 w-10'}
                  src={user?.avatar || '/placeholder.svg'}
                  alt="User"
                  fallbackText={user.name}
                  className="h-10 w-10"
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Collapse Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`${isCollapsed ? 'mx-auto' : 'ml-auto'} h-8 w-8 rounded-full`}
              onClick={toggleCollapsed}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Default items if none are provided
const defaultItems = [
  { title: 'Create New Event', url: '/create-event', icon: Plus },
  { title: 'All Events', url: '/all-events', icon: Calendar },
  { title: 'My Organized Events', url: '/organized-events', icon: User },
  { title: 'My Joined Events', url: '/joined-events', icon: Users },
];
