"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { navbarItems } from "./NavbarItem.js"
import { useAuth } from "../hooks/useAuth.js"
import { Link, useLocation, useNavigate } from "react-router-dom" // Commented out as requested
import { ChevronDown, Menu, X, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button.js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.js"
import { NotificationDropdown } from "@/components/NotificationDropdown.jsx"
import { CustomAvatar } from "@/components/shared/CustomAvatar.jsx"
// import { useLocation, useNavigate } from 'react-router-dom';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, role, user } = useSelector((state) => state.user)
  const { handleSignOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // For demo purposes without react-router
  const [currentPath, setCurrentPath] = useState("/")
  // const navigate = (path) => {
  //   console.log(`Navigating to: ${path}`)
  //   setCurrentPath(path)
  // }
  // const location = { pathname: currentPath }

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const NavItems = ({ isMobile = false }) => {
    const filteredItems = isAuthenticated
      ? navbarItems.filter((item) => item.path !== "/sign-in" && item.path !== "/sign-up")
      : navbarItems

    const ITEMS = filteredItems.map((item, index) => ({
      ...item,
      id: index + 1,
    }))
    const [hoveredItem, setHoveredItem] = useState(null)

    return (
      <ul className={`flex ${isMobile ? "flex-col space-y-2" : "flex-row"} items-center`}>
        {ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={item.path}
              onClick={(e) => {
                e.preventDefault()
                navigate(item.path)
                if (isMobile) setMenuOpen(false)
              }}
              className={`relative mx-2 flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-[#0071e3]"
                  : "text-gray-700 hover:text-[#0071e3] dark:text-gray-300 dark:hover:text-white"
              }`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.title}

              {/* Active indicator */}
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#0071e3]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Hover indicator (only show if not active) */}
              {hoveredItem === item.id && location.pathname !== item.path && (
                <motion.div
                  layoutId="hoverIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#0071e3] opacity-50"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-lg dark:bg-gray-900/80" : "bg-white dark:bg-gray-900"
      } border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and desktop navigation */}
        <div className="flex items-center space-x-8">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              navigate("/")
            }}
            className="flex items-center space-x-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0071e3] to-[#42a4ff]">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">EventApp</span>
          </a>

          <div className="hidden md:block">
            <NavItems />
          </div>
        </div>

        {/* Search, notifications, and profile */}
        <div className="flex items-center space-x-4">
          {/* Search button */}
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
            <Search className="h-4 w-4" />
          </button>

          {isAuthenticated ? (
            <>
              {/* Notification dropdown */}
              <NotificationDropdown />

              {/* User profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex h-9 items-center space-x-2 rounded-full border border-gray-200 bg-white px-2 py-2 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <CustomAvatar src={user?.avatar} alt={user?.name} fallbackText={user?.name} className="h-7 w-7" />
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
                  <div className="flex items-center space-x-2 p-2">
                    <CustomAvatar src={user?.avatar} alt={user?.name} fallbackText={user?.name} className="h-10 w-10" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name || "User"}</span>
                      <span className="text-xs text-gray-500">{user?.email || "user@example.com"}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer rounded-md" onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-md" onClick={() => navigate("/profile/edit")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-md" onClick={() => navigate("/my-events")}>
                    My Events
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-md text-red-500 focus:bg-red-50 focus:text-red-500 dark:focus:bg-red-950"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                className="rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => navigate("/sign-in")}
              >
                Sign In
              </Button>
              <Button
                className="rounded-full bg-[#0071e3] text-sm font-medium text-white hover:bg-[#0077ed]"
                onClick={() => navigate("/sign-up")}
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 md:hidden"
          >
            <Menu className="h-5 w-5" />
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-64 overflow-y-auto bg-white p-4 shadow-xl dark:bg-gray-900"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0071e3] to-[#42a4ff]">
                    <span className="text-lg font-bold text-white">E</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">EventApp</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isAuthenticated && (
                <div className="mb-6 flex items-center space-x-3 border-b border-gray-200 pb-6 dark:border-gray-700">
                  <CustomAvatar src={user?.avatar} alt={user?.name} fallbackText={user?.name} className="h-10 w-10" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.name || "User"}</p>
                    <p className="text-sm text-gray-500">{user?.email || "user@example.com"}</p>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <NavItems isMobile={true} />
              </div>

              {isAuthenticated ? (
                <div className="mt-6 space-y-2 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <a
                    href="/profile"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate("/profile")
                      setMenuOpen(false)
                    }}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Profile
                  </a>
                  <a
                    href="/profile/edit"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate("/profile/edit")
                      setMenuOpen(false)
                    }}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Settings
                  </a>
                  <a
                    href="/my-events"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate("/my-events")
                      setMenuOpen(false)
                    }}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    My Events
                  </a>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMenuOpen(false)
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-2 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => {
                      navigate("/sign-in")
                      setMenuOpen(false)
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full rounded-lg bg-[#0071e3] text-sm font-medium text-white hover:bg-[#0077ed]"
                    onClick={() => {
                      navigate("/sign-up")
                      setMenuOpen(false)
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default NavBar
