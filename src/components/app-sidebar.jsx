// components/AppSidebar.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, ChevronLeft } from 'lucide-react';

export function AppSidebar({ items, title = 'Menu' }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-24 left-4 z-50 h-12 w-12 rounded-full bg-white shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      <div
        className={`${
          isMobile
            ? 'fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out'
            : 'w-64'
        } ${
          isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
        } flex flex-col border-r border-gray-200 bg-white`}
      >
        {isMobile && (
          <div className="flex justify-start p-4">
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
          <h1 className="text-2xl font-semibold text-blue-600">{title}</h1>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {items.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex w-full items-center rounded-r-md px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'border-l-4 border-blue-600 bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
