import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // 检查是否是视频播放页面
  const isVideoPage = location.pathname.startsWith('/video/')

  // 当进入视频页面时自动关闭侧边栏
  useEffect(() => {
    if (isVideoPage) {
      setSidebarOpen(false)
    }
  }, [isVideoPage])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        {/* Sidebar - 在视频页面时隐藏 */}
        {!isVideoPage && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 ${!isVideoPage ? 'lg:ml-0' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
