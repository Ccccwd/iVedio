import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Tv, 
  Film, 
  Mic, 
  Zap, 
  Baby, 
  FileText, 
  Trophy,
  ChevronRight 
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  id: string
  name: string
  icon: React.ComponentType<any>
  path: string
}

const navigationItems: NavItem[] = [
  { id: 'home', name: '首页', icon: Home, path: '/' },
  { id: 'tv-series', name: '电视剧', icon: Tv, path: '/tv-series' },
  { id: 'movies', name: '电影', icon: Film, path: '/movies' },
  { id: 'variety', name: '综艺', icon: Mic, path: '/variety' },
  { id: 'anime', name: '动漫', icon: Zap, path: '/anime' },
  { id: 'kids', name: '少儿', icon: Baby, path: '/kids' },
  { id: 'documentary', name: '纪录片', icon: FileText, path: '/documentary' },
  { id: 'sports', name: '体育', icon: Trophy, path: '/sports' }
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <>
      {/* 遮罩层 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* 侧边栏 */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-background-secondary z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        border-r border-border
      `}>
        <div className="flex flex-col h-full">
          {/* Logo区域 */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">iV</span>
              </div>
              <span className="text-xl font-bold text-white">iVedio</span>
            </Link>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 py-6">
            <ul className="space-y-2 px-4">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                const isHovered = hoveredItem === item.id

                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center justify-between px-4 py-3 rounded-lg
                        transition-all duration-200 group
                        ${isActive 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'text-gray-300 hover:bg-background-card hover:text-white'
                        }
                      `}
                      onClick={onClose}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={20} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {(isActive || isHovered) && (
                        <ChevronRight size={16} className="opacity-70" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}