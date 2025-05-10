"use client"

import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { HeroUIProvider } from "@heroui/react"
import "./App.css"
import routes from "./routes/routes.jsx"
import { Toaster } from "sonner"
import { useUser } from "@/hooks/useUser.js"

// Loading component with animation
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 w-16 h-16 border-4 border-t-[#3b82f6] rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-[#1f2937]">Loading application...</p>
        <p className="mt-1 text-sm text-[#6b7280]">Please wait while we set things up</p>
      </div>
    </div>
  )
}

// Hàm để render các tuyến đường phân cấp
const renderRoutes = (routeList) =>
  routeList.map((route, index) => (
    <Route key={index} path={route.path} element={route.element}>
      {route.children && renderRoutes(route.children)}
    </Route>
  ))

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(true)
  const { handleGetMe } = useUser()

  // Kiểm tra trạng thái đăng nhập bằng API
  useEffect(() => {
    if (!isAuthenticated) {
      handleGetMe(setIsLoading);
    } else {
      setIsLoading(false)
    }
  }, [dispatch, isAuthenticated, handleGetMe])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <HeroUIProvider>
      <BrowserRouter>
        <Routes>{renderRoutes(routes)}</Routes>
        <Toaster position="bottom-left" theme="light" richColors={true} closeButton={false} duration={3000} />
      </BrowserRouter>
    </HeroUIProvider>
  )
}

export default App