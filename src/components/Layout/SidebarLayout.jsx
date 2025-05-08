"use client"

import { Outlet } from "react-router-dom"

import NavBar from "@/components/Navbar"
import { AppSidebar } from '@/components/app-sidebar.jsx';

function SidebarLayout({ title, items }) {
  return (
    <div className="flex h-screen flex-col">
      {/* Fixed navbar at the top */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white">
        <NavBar />
      </div>

      {/* Main content area with fixed sidebar and scrollable outlet */}
      <div className="flex h-full pt-16">
        {/* Sidebar - fixed position */}
        <div className="fixed left-0 top-16 bottom-0 z-40">
          <AppSidebar title={title} items={items} />
        </div>

        {/* Main content - scrollable, with margin to account for sidebar */}
        <div className="ml-[16rem] flex-1 transition-all duration-300" id="main-content">
          <main className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default SidebarLayout
