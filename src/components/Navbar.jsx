import { useState } from 'react';
import { useSelector } from 'react-redux';
import { navbarItems } from './NavbarItem.js';
import { useAuth } from '../hooks/useAuth.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, role, user } = useSelector((state) => state.user);
  const { handleSignOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const mockNotifications = [
    { id: 1, message: 'New event created' },
    { id: 2, message: 'Your profile was updated' },
    { id: 3, message: 'Reminder: Meeting at 3PM' },
  ];

  const One = ({ isMobile = false }) => {
    const filteredItems = isAuthenticated
      ? navbarItems.filter(
          (item) => item.path !== '/sign-in' && item.path !== '/sign-up'
        )
      : navbarItems;

    const ITEMS = filteredItems.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    const [isHover, setIsHover] = useState(null);

    return (
      <ul
        className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center`}
      >
        {ITEMS.map((item) => (
          <Link key={item.id} to={item.path}>
            <button
              className="relative py-2 transition-colors duration-300 hover:!text-white"
              onMouseEnter={() => setIsHover(item)}
              onMouseLeave={() => setIsHover(null)}
              style={{
                color: location.pathname === item.path ? '#FFF' : '#888888',
              }}
            >
              <div className="relative px-5 py-2">
                {item.title}
                {isHover?.id === item.id && (
                  <motion.div
                    layoutId="hover-bg"
                    className="absolute right-0 bottom-0 left-0 h-full w-full bg-white/10"
                    style={{ borderRadius: 6 }}
                  />
                )}
              </div>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="active"
                  className="absolute right-0 bottom-0 left-0 h-0.5 w-full bg-white"
                />
              )}
              {isHover?.id === item.id && (
                <motion.div
                  layoutId="hover"
                  className="absolute right-0 bottom-0 left-0 h-0.5 w-full bg-white"
                />
              )}
            </button>
          </Link>
        ))}
      </ul>
    );
  };

  return (
    <nav className="fixed z-50 w-full border-b border-neutral-800 bg-neutral-950 font-semibold shadow-sm">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-white transition-colors hover:text-white"
          >
            EventApp
          </Link>
          <div className="hidden md:block">
            <One isMobile={false} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-4">
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
                      <AvatarFallback>
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-black" align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile/edit')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:text-black"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 rounded-md border bg-white text-black shadow-md">
                  <div className="border-b p-2 text-sm font-semibold">
                    Notifications
                  </div>
                  <ul className="max-h-60 divide-y divide-gray-200 overflow-y-auto">
                    {mockNotifications.map((n) => (
                      <li key={n.id} className="p-2 text-sm hover:bg-gray-100">
                        {n.message}
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-white md:hidden"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 transform border-l border-neutral-800 bg-neutral-950 transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6">
          <One isMobile={true} />
        </div>
      </div>

      {menuOpen && (
        <div
          className="bg-opacity-30 fixed inset-0 z-40 bg-transparent backdrop-brightness-75 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}

export default NavBar;
