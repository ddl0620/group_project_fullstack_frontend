import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight, Plus, Users, Calendar, User } from 'lucide-react'
import { useSelector } from "react-redux"
import { CustomAvatar } from "@/components/shared/CustomAvatar"

export function AppSidebar({
                             items = defaultItems,
                             title = "Event Management",
                             isMobileOpen = false,
                             setIsMobileOpen = () => {},
                           }) {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState("large") // "large", "medium", "small", "tiny"
  const user = useSelector((state) => state.user.user)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)

      // Set screen size category for more granular responsive design
      if (width < 320) {
        setScreenSize("tiny")
      } else if (width < 380) {
        setScreenSize("small")
      } else if (width < 640) {
        setScreenSize("medium")
      } else {
        setScreenSize("large")
      }

      // Auto-collapse on iPad and smaller screens
      if (width < 1024) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Update main content margin when sidebar collapses/expands
  useEffect(() => {
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      if (isMobile) {
        // On mobile, add bottom padding to account for the navbar
        mainContent.style.marginLeft = "0"
        mainContent.style.paddingBottom = "5rem" // Increased padding for better spacing
      } else {
        // On desktop, adjust the left margin based on sidebar state
        mainContent.style.marginLeft = isCollapsed ? "5rem" : "16rem"
        mainContent.style.paddingBottom = "0"
      }
    }
  }, [isCollapsed, isMobile])

  // Toggle sidebar collapsed state
  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev)
  }

  // Get icon size based on screen size
  const getIconSize = () => {
    switch (screenSize) {
      case "tiny":
        return "h-5 w-5"
      case "small":
        return "h-5 w-5"
      default:
        return "h-6 w-6"
    }
  }

  // Get text size based on screen size
  const getTextSize = () => {
    switch (screenSize) {
      case "tiny":
        return "text-[9px]"
      case "small":
        return "text-[10px]"
      default:
        return "text-xs"
    }
  }

  return (
      <>
        {/* Desktop Sidebar */}
        {!isMobile && (
            <div
                className={`flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
                    isCollapsed ? "w-[5rem]" : "w-[16rem]"
                }`}
            >
              {/* Header */}
              <div className="flex h-16 items-center border-b border-gray-200 px-4 dark:border-gray-800">
                {!isCollapsed ? (
                    <div className="flex items-center">
                      <img src="/rmit.png" alt="RMIT Logo" className="h-8 w-8" />
                      <h1 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
                    </div>
                ) : (
                    <div className="mx-auto">
                      <img src="/rmit.png" alt="RMIT Logo" className="h-8 w-8" />
                    </div>
                )}
              </div>

              {/* Navigation - Scrollable area */}
              <div className="flex-1 overflow-y-auto py-2">
                <TooltipProvider delayDuration={0}>
                  <nav className="space-y-1 px-2">
                    {items.map((item) => {
                      const isActive = location.pathname === item.url
                      return (
                          <Tooltip key={item.title} delayDuration={0}>
                            <TooltipTrigger asChild>
                              <Link
                                  to={item.url}
                                  className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                      isActive
                                          ? "text-[#0071e3] dark:text-blue-400"
                                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                  }`}
                              >
                                <item.icon
                                    className={`h-5 w-5 flex-shrink-0 transition-colors ${
                                        isActive ? "text-[#0071e3] dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                                    }`}
                                />
                                {!isCollapsed && <span className="ml-3 overflow-hidden whitespace-nowrap">{item.title}</span>}
                              </Link>
                            </TooltipTrigger>
                            {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                          </Tooltip>
                      )
                    })}
                  </nav>
                </TooltipProvider>
              </div>

              <div className="mt-auto border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between p-4">
                  {!isCollapsed && (
                      <div className="flex items-center">
                        <CustomAvatar
                            _classname={"h-10 w-10"}
                            src={user?.avatar || "/placeholder.svg"}
                            alt="User"
                            fallbackText={user?.name}
                            className="h-10 w-10"
                        />
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                  )}

                  {/* Collapse Toggle Button */}
                  <Button
                      variant="ghost"
                      size="icon"
                      className={`${isCollapsed ? "mx-auto" : "ml-auto"} h-8 w-8 rounded-full`}
                      onClick={toggleCollapsed}
                      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
        )}

        {/* Mobile Bottom Navigation Bar - Always visible with enhanced shadows and effects */}
        {isMobile && (
            <div
                className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                style={{
                  boxShadow: '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -4px rgba(0, 0, 0, 0.1)',
                  backgroundImage: 'linear-gradient(to top, white, #fafafa)'
                }}
            >
              {items.map((item) => {
                const isActive = location.pathname === item.url
                // Always get just the first word for mobile
                const firstWord = item.title.split(" ")[0]

                return (
                    <Link
                        key={item.title}
                        to={item.url}
                        className={`flex flex-1 flex-col items-center justify-center h-full relative ${
                            isActive
                                ? "after:absolute after:top-0 after:left-1/4 after:right-1/4 after:h-1 after:bg-[#0071e3] after:rounded-full"
                                : ""
                        }`}
                        aria-label={item.title}
                    >
                      <div
                          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 ${
                              isActive
                                  ? "bg-blue-50 dark:bg-blue-900/20 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                          style={{
                            transform: isActive ? 'translateY(-2px)' : 'translateY(0)'
                          }}
                      >
                        <item.icon
                            className={`${getIconSize()} transition-all duration-300 ${
                                isActive ? "text-[#0071e3] dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                            }`}
                        />
                      </div>
                      <span
                          className={`mt-0.5 ${getTextSize()} font-medium text-center transition-all duration-300 ${
                              isActive ? "text-[#0071e3] dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                          }`}
                      >
                  {firstWord}
                </span>
                    </Link>
                )
              })}
            </div>
        )}
      </>
  )
}

// Default items if none are provided
const defaultItems = [
  { title: "Create New Event", url: "/create-event", icon: Plus },
  { title: "All Events", url: "/all-events", icon: Calendar },
  { title: "My Organized Events", url: "/organized-events", icon: User },
  { title: "My Joined Events", url: "/joined-events", icon: Users },
]
