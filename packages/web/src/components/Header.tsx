import { Link } from 'react-router-dom'
import { Play, Search } from 'lucide-react'

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background-card border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <Play className="w-8 h-8 text-primary" fill="currentColor" />
            <span className="text-xl font-bold text-white">iVedio</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition">
              首页
            </Link>
            <a href="#" className="text-gray-300 hover:text-white transition">
              分类
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition">
              我的
            </a>
          </nav>

          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center bg-background-hover rounded-full px-4 py-2">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="搜索视频..."
                className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-48"
              />
            </div>
            <button className="btn-primary">
              登录
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
