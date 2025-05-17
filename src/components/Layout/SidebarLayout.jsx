"use client"

import { Outlet } from "react-router-dom"
import NavBar from "@/components/Navbar"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar.jsx"

function SidebarLayout({ title, items }) {
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
      <div className="flex h-screen flex-col">
        {/* Fixed navbar at the top */}
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white">
          <NavBar />
        </div>

        {/* Main content area with fixed sidebar and scrollable outlet */}
        <div className="flex h-full pt-16">
          {/* Sidebar - fixed position on desktop */}
          <div className={`${isMobile ? "" : "fixed"} left-0 top-16 bottom-0 z-40`}>
            <AppSidebar title={title} items={items} />
          </div>

          {/* Main content - scrollable, with margin only on non-mobile */}
          <div className={`flex-1 transition-all duration-300 ${isMobile ? "ml-0" : "ml-[16rem]"}`} id="main-content">
            <main className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50 pb-20">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
  )
}

export default SidebarLayout
