"use client"

import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login, logout } from "./store/slices/userSlice"
import { HeroUIProvider } from "@heroui/react"
import "./App.css"
import routes from "./routes/routes.jsx"
import { Toaster } from "sonner"
import APIServices from "@/services/APIServices.js"

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
  const [isLoading, setIsLoading] = useState(true) // Add loading state

  // Kiểm tra token để tự động đăng nhập khi ứng dụng khởi động
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token && !isAuthenticated) {
      APIServices.get("/api/v1/user/me")
        .then((response) => {
          // Access the user data from the nested structure
          const user = response.data.content.user
          const role = user.role

          console.log("Rerender user: ", user)
          console.log("Rerender role: ", role)

          // Dispatch the login action with user and role
          dispatch(login({ user, role }))
        })
        .catch((error) => {
          console.error("Error fetching user data:", error)
          localStorage.removeItem("token") // Remove invalid token
          dispatch(logout()) // Ensure the state reflects the user is logged out
        })
        .finally(() => {
          setIsLoading(false) // Set loading to false after the API call completes
        })
    } else {
      setIsLoading(false) // No token or already authenticated, proceed immediately
      if (!token) {
        dispatch(logout()) // Ensure the state reflects the user is logged out if no token
      }
    }
  }, [dispatch, isAuthenticated])

  if (isLoading) {
    return <LoadingScreen /> // Show the enhanced loading component
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
