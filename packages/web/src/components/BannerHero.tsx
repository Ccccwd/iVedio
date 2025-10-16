import { useState, useEffect, useRef } from 'react'
import { Play, Volume2, VolumeX } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BannerVideo {
  id: string
  title: string
  subtitle?: string
  description: string
  posterUrl: string
  previewVideoUrl: string
  fullVideoUrl: string
  videoId: string
  tags: string[]
  duration: string
  rating: string
}

interface BannerHeroProps {
  video: BannerVideo
  autoPlayDelay?: number // 自动播放延迟（毫秒），默认4000ms
}

export default function BannerHero({ video, autoPlayDelay = 4000 }: BannerHeroProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 预加载视频资源
    if (videoRef.current) {
      videoRef.current.load()
    }

    // 设置自动播放定时器
    timeoutRef.current = setTimeout(() => {
      handleStartPreview()
    }, autoPlayDelay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [autoPlayDelay])

  const handleStartPreview = async () => {
    if (!videoRef.current || hasError) return

    try {
      setIsVideoPlaying(true)
      setShowPlayButton(false)
      
      // 跳转到预览开始位置（假设从30秒开始）
      videoRef.current.currentTime = 30
      
      await videoRef.current.play()
      console.log('预览视频开始播放')
    } catch (error) {
      console.error('预览视频播放失败:', error)
      handleVideoError()
    }
  }

  const handleVideoError = () => {
    console.error('视频加载或播放出错，回退到海报显示')
    setHasError(true)
    setIsVideoPlaying(false)
    setShowPlayButton(true)
  }

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
    console.log('预览视频资源加载完成')
  }

  const handleRetry = () => {
    setHasError(false)
    setIsVideoPlaying(false)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  return (
    <section className="relative h-[70vh] min-h-[500px] bg-black rounded-lg overflow-hidden mb-8">
      {/* 海报背景层 */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          isVideoPlaying && !hasError ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${video.posterUrl})` 
        }}
      />

      {/* 预览视频层 */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isVideoPlaying && !hasError ? 'opacity-100' : 'opacity-0'
        }`}
        muted={isMuted}
        playsInline
        preload="metadata"
        loop
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
        onLoadStart={() => console.log('开始加载预览视频:', video.previewVideoUrl)}
        onCanPlay={() => console.log('预览视频可以播放')}
      >
        {/* 根据文件扩展名设置正确的MIME类型 */}
        {video.previewVideoUrl.includes('.mp4') && (
          <source src={video.previewVideoUrl} type="video/mp4" />
        )}
        {video.previewVideoUrl.includes('.mkv') && (
          <source src={video.previewVideoUrl} type="video/x-matroska" />
        )}
        {video.previewVideoUrl.includes('.webm') && (
          <source src={video.previewVideoUrl} type="video/webm" />
        )}
        
        {/* 通用fallback */}
        <source src={video.previewVideoUrl} type="video/mp4" />
        <source src={video.previewVideoUrl} type="video/webm" />
      </video>

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/* 内容信息层 */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            {/* 标题 */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 drop-shadow-2xl">
              {video.title}
            </h1>
            
            {video.subtitle && (
              <p className="text-xl text-gray-300 mb-4 font-light">
                {video.subtitle}
              </p>
            )}

            {/* 评分和标签 */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-white font-bold">{video.rating}</span>
              </div>
              <span className="text-gray-300">{video.duration}</span>
              <div className="flex space-x-2">
                {video.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-white/20 text-white text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 描述 */}
            <p className="text-gray-200 text-lg mb-8 leading-relaxed line-clamp-3">
              {video.description}
            </p>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-4">
              <Link
                to={`/video/${video.videoId}`}
                className="flex items-center space-x-3 bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
              >
                <Play size={24} fill="currentColor" />
                <span>立即播放</span>
              </Link>

              {/* 音量控制（仅在播放预览时显示） */}
              {isVideoPlaying && !hasError && (
                <button
                  onClick={toggleMute}
                  className="p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-200"
                  title={isMuted ? '取消静音' : '静音'}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              )}

              {/* 重试按钮（仅在出错时显示） */}
              {hasError && (
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-red-600/80 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200"
                >
                  重试预览
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 状态指示器 */}
      <div className="absolute bottom-6 right-6 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          !isVideoPlaying ? 'bg-white' : 'bg-white/40'
        }`}></div>
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isVideoPlaying && !hasError ? 'bg-white' : 'bg-white/40'
        }`}></div>
        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
      </div>

      {/* 错误提示 */}
      {hasError && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-yellow-600/90 text-white px-4 py-2 rounded-lg text-sm">
          预览视频加载失败，显示海报
        </div>
      )}

      {/* 移动端触摸提示 */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center md:hidden">
          <button
            onClick={handleStartPreview}
            className="bg-black/50 text-white p-4 rounded-full hover:bg-black/70 transition-all duration-200"
          >
            <Play size={32} fill="currentColor" />
          </button>
        </div>
      )}
    </section>
  )
}