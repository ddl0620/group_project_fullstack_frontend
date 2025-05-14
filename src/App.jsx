"use client"

import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { HeroUIProvider } from "@heroui/react"
import "./App.css"
import routes from "./routes/routes.jsx"
import { Toaster } from "sonner"
import { useUser } from "@/hooks/useUser.js"
import { IsNotReleased, LoadingScreen } from '@/components/shared/LoadingScreen.jsx';
const isRelease = import.meta.env.VITE_IS_RELEASE;

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

  if(isRelease === "false" || !isRelease) {
    return <IsNotReleased />
  }


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