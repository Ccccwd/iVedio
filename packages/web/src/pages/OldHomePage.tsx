import { useState, useEffect } from 'react'
import VideoGrid from '../components/VideoGrid'
import type { Video } from '@shared/types'

function HomePage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [error, setError] = useState<string | null>(null)

  const categories = ['全部', '动画', 'test', 'movies']

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 从后端API获取视频数据
        const response = await fetch('http://localhost:3001/api/videos')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          setVideos(result.data.videos || [])
        } else {
          throw new Error(result.message || '获取视频失败')
        }
      } catch (error) {
        console.error('获取视频数据失败:', error)
        setError(error instanceof Error ? error.message : '获取视频数据失败')
        
        // 如果API失败，降级使用mock数据
        try {
          const mockData = await import('@shared/mock-data/videos.json')
          setVideos(mockData.default as Video[])
        } catch (mockError) {
          console.error('加载mock数据也失败:', mockError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const filteredVideos = selectedCategory === '全部'
    ? videos
    : videos.filter(video => video.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">精选视频</h1>
        <p className="text-gray-400">发现优质内容</p>
        {/* 调试信息 */}
        <p className="text-sm text-gray-500 mt-2">
          数据源: API (共 {videos.length} 个视频)
        </p>
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-2 rounded mt-2">
            错误: {error}
          </div>
        )}
      </div>

      {/* 分类标签 */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-background-card text-gray-300 hover:bg-background-hover'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 视频网格 */}
      <VideoGrid videos={filteredVideos} loading={loading} />

      {/* 加载更多 */}
      {!loading && filteredVideos.length > 0 && (
        <div className="text-center py-8">
          <button className="btn-secondary">
            加载更多
          </button>
        </div>
      )}
    </div>
  )
}

export default HomePage
