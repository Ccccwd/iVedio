import type { Video } from '@shared/types'
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import VideoPlayer from '../components/VideoPlayer'

function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [video, setVideo] = useState<Video | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!id) {
        setError('视频ID无效')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        console.log('获取视频详情，ID:', id)

        // 获取指定视频详情
        const videoResponse = await fetch(`http://localhost:3001/api/videos/${id}`)

        if (!videoResponse.ok) {
          if (videoResponse.status === 404) {
            setError('视频不存在')
          } else {
            setError(`获取视频失败: ${videoResponse.status}`)
          }
          setLoading(false)
          return
        }

        const videoResult = await videoResponse.json()
        console.log('视频详情API响应:', videoResult)

        if (videoResult.success) {
          setVideo(videoResult.data)

          // 获取相关视频（所有视频，然后排除当前视频）
          const relatedResponse = await fetch(`http://localhost:3001/api/videos`)
          if (relatedResponse.ok) {
            const relatedResult = await relatedResponse.json()
            if (relatedResult.success) {
              // 排除当前视频
              const related = relatedResult.data.videos.filter((v: Video) => v.id.toString() !== id)
              setRelatedVideos(related.slice(0, 4))
            }
          }
        } else {
          setError(videoResult.message || '获取视频失败')
        }
      } catch (error) {
        console.error('获取视频数据失败:', error)
        setError('网络错误，无法获取视频数据')
      } finally {
        setLoading(false)
      }
    }

    fetchVideoData()
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

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-400 mb-4">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          返回首页
        </button>
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
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>返回</span>
        </button>

        {/* 面包屑导航 */}
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>首页</span>
          <span>/</span>
          <span>{video?.category}</span>
          <span>/</span>
          <span className="text-white truncate max-w-32">{video?.title}</span>
        </div>
      </div>

      {/* 视频播放器 */}
      <div className="max-w-6xl">
        <VideoPlayer
          src={video.videoUrl}
          poster={video.thumbnail}
          videoId={video.id}
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
