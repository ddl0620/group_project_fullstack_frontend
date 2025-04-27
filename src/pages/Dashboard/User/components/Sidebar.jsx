// src/pages/components/Sidebar.jsx
import { Button } from '@/components/ui/button';
import {
  BarChart,
  ChevronLeft,
  CalendarIcon,
  MessageSquare,
  Star,
  Award,
  Menu,
} from 'lucide-react';

const Sidebar = ({
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
}) => {
  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed right-4 bottom-4 z-50 h-12 w-12 rounded-full bg-white shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      <div
        className={`${isMobile ? 'fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out' : 'w-64'} ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'} flex flex-col border-r border-gray-200 bg-white`}
      >
        {isMobile && (
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
        )}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-blue-600">Eventy</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`flex w-full items-center rounded-r-md px-4 py-3 text-sm font-medium ${activeSection === 'dashboard' ? 'border-l-4 border-blue-600 bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <BarChart className="mr-3 h-5 w-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveSection('events')}
              className={`flex w-full items-center rounded-r-md px-4 py-3 text-sm font-medium ${activeSection === 'events' ? 'border-l-4 border-blue-600 bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <CalendarIcon className="mr-3 h-5 w-5" />
              My Events
            </button>
            <button
              onClick={() => setActiveSection('discussions')}
              className={`flex w-full items-center rounded-r-md px-4 py-3 text-sm font-medium ${activeSection === 'discussions' ? 'border-l-4 border-blue-600 bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              Discussions
            </button>
            <button
              onClick={() => setActiveSection('profile')}
              className={`flex w-full items-center rounded-r-md px-4 py-3 text-sm font-medium ${activeSection === 'profile' ? 'border-l-4 border-blue-600 bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Star className="mr-3 h-5 w-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveSection('premium')}
              className={`flex w-full items-center rounded-r-md px-4 py-3 text-sm font-medium ${activeSection === 'premium' ? 'border-l-4 border-blue-600 bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Award className="mr-3 h-5 w-5" />
              Try Premium Version
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
