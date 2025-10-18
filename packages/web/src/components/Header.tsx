import { LogOut, Menu, Play, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

interface UserData {
  id: number;
  username: string;
  email: string;
}

interface HeaderProps {
  onMenuClick: () => void
}

function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // 检查本地存储中的登录状态
    const token = localStorage.getItem('authToken')
    const storedUserData = localStorage.getItem('userData')

    if (token && storedUserData) {
      setIsLoggedIn(true)
      setUserData(JSON.parse(storedUserData))
    }
  }, [])

  const handleAuthSuccess = (authData: any) => {
    setIsLoggedIn(true)
    setUserData(authData.user)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setIsLoggedIn(false)
    setUserData(null)
    setShowUserMenu(false)
    // 可选：重定向到首页
    window.location.href = '/'
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background-card border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-300 hover:text-white transition"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <Play className="w-8 h-8 text-primary" fill="currentColor" />
              <span className="text-xl font-bold text-white">iVedio</span>
            </Link>

            {/* Search */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center bg-background-hover rounded-full px-4 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索视频..."
                    className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-48"
                  />
                </form>
              </div>

              {/* User Menu */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
                  >
                    <User className="w-6 h-6" />
                    <span className="hidden md:inline">{userData?.username}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-background-card border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 inline mr-2" />
                        个人中心
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-primary"
                >
                  登录
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}

export default Header
