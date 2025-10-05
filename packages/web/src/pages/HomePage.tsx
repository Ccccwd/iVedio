import { useState, useEffect } from 'react'
import VideoGrid from '../components/VideoGrid'
import type { Video } from '@shared/types'
import videosData from '@shared/mock-data/videos.json'

function HomePage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('全部')

  const categories = ['全部', '动画']

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setVideos(videosData as Video[])
      setLoading(false)
    }, 500)
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
