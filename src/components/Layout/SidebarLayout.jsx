"use client"

import { Outlet } from "react-router-dom"
import NavBar from "@/components/Navbar"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PanelLeft } from 'lucide-react'
import { AppSidebar } from '@/components/app-sidebar.jsx';

function SidebarLayout({ title, items }) {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const toggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Fixed navbar at the top */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white">
        <NavBar />
      </div>

      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-5 left-3 z-30 h-10 w-10 rounded-full bg-white/80 shadow-md backdrop-blur-sm"
          onClick={toggleMobileSidebar}
        >
          <PanelLeft className="h-5 w-5 text-gray-700" />
        </Button>
      )}

      {/* Main content area with fixed sidebar and scrollable outlet */}
      <div className="flex h-full pt-16">
        {/* Sidebar - fixed position, only visible on non-mobile or when toggled */}
        <div className={`${isMobile ? "" : "fixed"} left-0 top-16 bottom-0 z-40`}>
          <AppSidebar
            title={title}
            items={items}
            isMobileOpen={sidebarOpen}
            setIsMobileOpen={setSidebarOpen}
          />
        </div>

        {/* Main content - scrollable, with margin only on non-mobile */}
        <div className={`flex-1 transition-all duration-300 ${isMobile ? "ml-0" : "ml-[16rem]"}`} id="main-content">
          <main className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default SidebarLayout
