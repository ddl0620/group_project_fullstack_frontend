import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { navbarItems } from './NavbarItem.js';
import { useAuth } from '../hooks/useAuth.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { NotificationDropdown } from '@/components/NotificationDropdown.jsx';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, role, user } = useSelector((state) => state.user);
  const { handleSignOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Track scroll position to add background blur
  useEffect(() => {
    const handleScroll = () => {
      // setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavItems = ({ isMobile = false }) => {
    // Filter navbar items based on authentication status and user role
    const filteredItems = navbarItems.filter((item) => {
      // If unauthenticated, only show items with 'unauthenticated' role
      if (!isAuthenticated) {
        return item.roles.includes('unauthenticated');
      }
      // If authenticated, show items that match the user's role
      return item.roles.includes(role);
    });

    const ITEMS = filteredItems.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    const [hoveredItem, setHoveredItem] = useState(null);

    return (
      <ul
        className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-row'} items-center`}
      >
        {ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
                if (isMobile) setMenuOpen(false);
              }}
              className={`relative mx-2 flex items-center px-2 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
                location.pathname === item.path
                  ? 'text-[#0071e3]'
                  : 'text-gray-700 hover:text-[#0071e3] dark:text-gray-300 dark:hover:text-white'
              }`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.title}

              {/* Active indicator */}
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-[#0071e3]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Hover indicator (only show if not active) */}
              {hoveredItem === item.id && location.pathname !== item.path && (
                <motion.div
                  layoutId="hoverIndicator"
                  className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-[#0071e3] opacity-50"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg dark:bg-gray-900/80'
          : 'bg-white dark:bg-gray-900'
      } border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-2 sm:h-16 sm:px-4 lg:px-8">
        {/* Logo and desktop navigation */}
        <div className="flex items-center space-x-4 sm:space-x-8">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="flex items-center space-x-1 sm:space-x-2"
          >
            <img
              src="/rmit.png"
              alt="Eventify Logo"
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
            <span className="max-w-[120px] truncate text-xs font-semibold text-gray-900 sm:max-w-none sm:text-sm dark:text-white">
              RMIT × Eventify
            </span>
          </a>

          <div className="hidden md:block">
            <NavItems />
          </div>
        </div>

        {/* Search, notifications, and profile */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          {isAuthenticated ? (
            <>
              {/* Notification dropdown */}
              <NotificationDropdown />

              {/* User profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-7 items-center justify-between space-x-1 rounded-full border border-gray-200 bg-white px-1 py-0 hover:bg-gray-100 sm:h-9 sm:space-x-2 sm:px-2 sm:py-5 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <CustomAvatar
                      src={user?.avatar}
                      alt={user?.name}
                      fallbackText={user?.name}
                      _classname="h-5 w-5 sm:h-7 sm:w-7"
                    />
                    <ChevronDown className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl p-1 sm:w-56"
                >
                  <div className="flex items-center space-x-2 p-2">
                    <CustomAvatar
                      src={user?.avatar}
                      alt={user?.name}
                      fallbackText={user?.name}
                      className="h-8 w-8 sm:h-10 sm:w-10"
                    />
                    <div className="flex flex-col">
                      <span className="max-w-[120px] truncate text-xs font-medium sm:max-w-[180px] sm:text-sm">
                        {user?.name || 'User'}
                      </span>
                      <span className="max-w-[120px] truncate text-[10px] text-gray-500 sm:max-w-[180px] sm:text-xs">
                        {user?.email || 'user@example.com'}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-md py-1.5 text-xs sm:text-sm"
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer rounded-md py-1.5 text-xs sm:text-sm"
                    onClick={() => navigate('/profile/edit')}
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-md py-1.5 text-xs text-red-500 focus:bg-red-50 focus:text-red-500 sm:text-sm dark:focus:bg-red-950"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="ghost"
                className="h-7 rounded-full px-2 text-xs font-medium text-gray-700 hover:bg-gray-100 sm:h-9 sm:px-4 sm:text-sm dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => navigate('/sign-in')}
              >
                Sign In
              </Button>
              <Button
                className="h-7 rounded-full bg-[#0071e3] px-2 text-xs font-medium text-white hover:bg-[#0077ed] sm:h-9 sm:px-4 sm:text-sm"
                onClick={() => navigate('/sign-up')}
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 sm:h-9 sm:w-9 md:hidden dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-[250px] overflow-y-auto bg-white p-3 shadow-xl sm:w-64 sm:p-4 dark:bg-gray-900"
            >
              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <div className="flex items-center space-x-2">
                  <img
                    src="/rmit.png"
                    alt="Eventify Logo"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  />
                  <span className="text-sm font-semibold text-gray-900 sm:text-lg dark:text-white">
                    RMIT × Eventify
                  </span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {isAuthenticated && (
                <div className="mb-4 flex items-center space-x-2 border-b border-gray-200 pb-4 sm:mb-6 sm:space-x-3 sm:pb-6 dark:border-gray-700">
                  <CustomAvatar
                    src={user?.avatar}
                    alt={user?.name}
                    fallbackText={user?.name}
                    className="h-8 w-8 sm:h-10 sm:w-10"
                  />
                  <div>
                    <p className="max-w-[150px] truncate text-xs font-medium text-gray-900 sm:max-w-none sm:text-sm dark:text-white">
                      {user?.name || 'User'}
                    </p>
                    <p className="max-w-[150px] truncate text-[10px] text-gray-500 sm:max-w-none sm:text-sm">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <NavItems isMobile={true} />
              </div>

              {/* Mobile-only sign in/up buttons for unauthenticated users */}
              {!isAuthenticated ? (
                <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <Button
                    variant="outline"
                    className="w-full justify-center rounded-full text-xs sm:text-sm"
                    onClick={() => {
                      navigate('/sign-in');
                      setMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full justify-center rounded-full bg-[#0071e3] text-xs text-white hover:bg-[#0077ed] sm:text-sm"
                    onClick={() => {
                      navigate('/sign-up');
                      setMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <div className={'mt-6 space-y-2 border-t border-gray-200 pt-4'}>
                  <Button
                    variant="outline"
                    className="w-full justify-center rounded-full bg-red-600 text-xs text-white hover:bg-red-700 hover:text-white sm:text-sm"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default NavBar;
