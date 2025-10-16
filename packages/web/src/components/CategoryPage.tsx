import { useState, useEffect } from 'react'
import { Play, Filter } from 'lucide-react'
import VideoCard from '../components/VideoCard'
import type { Video } from '@shared/types'

interface CategoryPageProps {
  category: string
  title: string
  description: string
}

function CategoryPage({ category, title, description }: CategoryPageProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('全部')

  const filters = ['全部', '最新', '热门', '评分最高']

  useEffect(() => {
    // 这里暂时显示空状态，等待真实内容
    setLoading(false)
  }, [category])

  const EmptyState = () => (
    <div className="text-center py-20">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
        <Play size={32} className="text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}内容即将上线</h3>
      <p className="text-gray-400 mb-6">更多精彩{description}正在准备中，敬请期待</p>
      <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
        <div className="bg-background-card p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">即将上线</h4>
          <p className="text-gray-400 text-sm">精选{title}内容</p>
        </div>
        <div className="bg-background-card p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">敬请期待</h4>
          <p className="text-gray-400 text-sm">更多{description}</p>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-background-card rounded-lg p-6 animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-700 rounded w-2/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-background-card rounded-lg p-4 animate-pulse">
              <div className="aspect-video bg-gray-700 rounded mb-4" />
              <div className="h-4 bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-300 mb-6">{description}</p>
        
        {/* 筛选器 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-gray-400">筛选:</span>
          </div>
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-background-card text-gray-300 hover:bg-background-hover'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

export default CategoryPage