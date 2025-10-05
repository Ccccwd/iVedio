import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react'
import VideoPlayer from '../components/VideoPlayer'
import VideoCard from '../components/VideoCard'
import type { Video } from '@shared/types'
import videosData from '@shared/mock-data/videos.json'

function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [video, setVideo] = useState<Video | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载视频数据
    setTimeout(() => {
      const foundVideo = (videosData as Video[]).find(v => v.id === id)
      if (foundVideo) {
        setVideo(foundVideo)
        
        // 获取相关视频(同分类,排除当前视频)
        const related = (videosData as Video[])
          .filter(v => v.category === foundVideo.category && v.id !== id)
          .slice(0, 4)
        setRelatedVideos(related)
      }
      setLoading(false)
    }, 500)
  }, [id])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatViews = (views: number) => {
    if (views >= 10000) {
      return `${(views / 10000).toFixed(1)}万`
    }
    return views.toString()
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-background-card h-12 rounded w-48 mb-6" />
        <div className="bg-background-card aspect-video rounded-lg" />
        <div className="bg-background-card h-8 rounded w-3/4" />
        <div className="bg-background-card h-24 rounded" />
      </div>
    )
  }

  if (!video) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-400 mb-4">视频不存在</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回首页</span>
      </button>

      {/* 视频播放器 */}
      <div className="max-w-6xl">
        <VideoPlayer
          src={video.videoUrl}
          poster={video.thumbnail}
        />
      </div>

      {/* 视频信息 */}
      <div className="max-w-6xl space-y-4">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-white">
          {video.title}
        </h1>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-6 text-gray-400">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>{formatViews(video.views)} 次播放</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>{formatDate(video.uploadDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5" />
            <span>{video.category}</span>
          </div>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {video.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-background-card text-gray-300 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 描述 */}
        <div className="bg-background-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">
            视频简介
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {video.description}
          </p>
        </div>
      </div>

      {/* 相关推荐 */}
      {relatedVideos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            相关推荐
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedVideos.map((relatedVideo) => (
              <VideoCard key={relatedVideo.id} video={relatedVideo} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailPage
