import type { Video } from '@shared/types'
import { ArrowLeft, Calendar, Eye, MessageCircle, Share2, Tag, ThumbsUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CommentSection from '../components/CommentSection'
import FavoriteButton from '../components/FavoriteButton'
import VideoCard from '../components/VideoCard'
import VideoPlayer from '../components/VideoPlayer'
import { getCurrentUser, mockLogin } from '../utils/auth'

function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [video, setVideo] = useState<Video | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const commentsRef = useRef<HTMLDivElement>(null)

  // 确保用户已登录
  useEffect(() => {
    const ensureUserLogin = async () => {
      let user = getCurrentUser()
      if (!user) {
        // 如果没有登录用户，使用默认用户进行模拟登录
        user = await mockLogin('cwd')
        setCurrentUser(user)
      }
    }

    ensureUserLogin()
  }, [])

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

  // 滚动到评论区
  const handleScrollToComments = () => {
    setIsMinimized(true) // 最小化视频播放器
    commentsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

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

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 左侧：视频播放器和信息 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 视频播放器 */}
          <div className={`transition-all duration-300 ${isMinimized ? 'fixed top-4 right-4 w-80 h-48 z-50 shadow-2xl rounded-lg overflow-hidden' : 'w-full'}`}>
            <VideoPlayer
              src={video.videoUrl}
              poster={video.thumbnail}
              videoId={video.id}
            />
            {isMinimized && (
              <button
                onClick={() => setIsMinimized(false)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-75"
              >
                ✕
              </button>
            )}
          </div>

          {/* 视频信息 */}
          <div className="space-y-4">
            {/* 标题 */}
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              {video.title}
            </h1>

            {/* 元信息和操作按钮 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{formatViews(video.views)} 次播放</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(video.uploadDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>{video.category}</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>点赞</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>分享</span>
                </button>
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
        </div>

        {/* 右侧：操作面板 */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {/* 收藏按钮 */}
            <div className="bg-background-card p-4 rounded-lg">
              <FavoriteButton
                videoId={video.id}
                userId={currentUser?.id}
                className="w-full"
              />
            </div>

            {/* 评论导航 */}
            <div className="bg-background-card p-4 rounded-lg">
              <button
                onClick={handleScrollToComments}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>查看评论</span>
              </button>
            </div>

            {/* 视频统计 */}
            <div className="bg-background-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">视频数据</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">播放量：</span>
                  <span className="text-white">{formatViews(video.views)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">时长：</span>
                  <span className="text-white">{formatDuration(video.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">分辨率：</span>
                  <span className="text-white">1080P</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 评论区 */}
      <div ref={commentsRef}>
        <CommentSection
          videoId={video.id}
          userId={currentUser?.id}
        />
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
