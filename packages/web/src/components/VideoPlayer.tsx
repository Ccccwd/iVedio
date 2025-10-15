import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  src: string
  poster?: string
  videoId?: string
  onReady?: (player: any) => void
}

function VideoPlayer({ src, poster, videoId, onReady }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const saveProgressTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 保存观看进度
  const saveProgress = async (currentTime: number, duration: number) => {
    const userData = localStorage.getItem('userData')
    if (!userData || !videoId) return

    const user = JSON.parse(userData)
    
    try {
      await fetch(`http://localhost:3001/api/videos/${videoId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          progress: Math.floor(currentTime),
          duration: Math.floor(duration)
        }),
      })
    } catch (error) {
      console.error('保存观看进度失败:', error)
    }
  }

  // 加载用户观看进度
  const loadProgress = async () => {
    const userData = localStorage.getItem('userData')
    if (!userData || !videoId) return

    const user = JSON.parse(userData)
    
    try {
      const response = await fetch(`http://localhost:3001/api/videos/${videoId}/progress/${user.id}`)
      const result = await response.json()
      
      if (result.success && result.data.progress > 0 && videoRef.current) {
        // 如果有观看进度且未看完，从上次位置开始播放
        if (!result.data.completed && result.data.progress > 30) { // 30秒以上才恢复进度
          videoRef.current.currentTime = result.data.progress
        }
      }
    } catch (error) {
      console.error('加载观看进度失败:', error)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadStart = () => {
      console.log('Video loading started:', src)
      setIsLoading(true)
      setError(null)
    }

    const handleCanPlay = () => {
      console.log('Video can play:', src)
      setIsLoading(false)
      if (onReady) {
        onReady(video)
      }
      // 加载用户观看进度
      loadProgress()
    }

    const handleTimeUpdate = () => {
      if (!video.duration || !videoId) return
      
      // 清除之前的定时器
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current)
      }
      
      // 延迟保存进度，避免频繁请求
      saveProgressTimeoutRef.current = setTimeout(() => {
        saveProgress(video.currentTime, video.duration)
      }, 5000) // 5秒后保存
    }

    const handleError = (e: Event) => {
      console.error('Video error:', e)
      console.error('Video error details:', video.error)
      setIsLoading(false)
      
      if (video.error) {
        switch (video.error.code) {
          case video.error.MEDIA_ERR_ABORTED:
            setError('视频播放被中止')
            break
          case video.error.MEDIA_ERR_NETWORK:
            setError('网络错误，无法加载视频')
            break
          case video.error.MEDIA_ERR_DECODE:
            setError('视频解码错误')
            break
          case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            setError('视频格式不支持或文件损坏')
            break
          default:
            setError('未知错误')
        }
      }
    }

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded:', src)
    }

    const handleLoadedData = () => {
      console.log('Video data loaded:', src)
      setIsLoading(false)
    }

    const handleEnded = () => {
      // 视频播放结束，保存完成状态
      if (video.duration && videoId) {
        saveProgress(video.duration, video.duration)
      }
    }

    // 添加事件监听器
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('loadeddata', handleLoadedData)

    // 设置视频源
    video.src = src
    video.load()

    // 清理函数
    return () => {
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current)
      }
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [src, onReady, videoId])

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="w-full h-auto"
        controls
        poster={poster}
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
        style={{ aspectRatio: '16/9' }}
      >
        {/* 添加多种格式支持 */}
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        <source src={src} type="video/ogg" />
        您的浏览器不支持视频播放。
      </video>

      {/* 加载状态 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>视频加载中...</p>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-red-400 text-center p-4">
            <p className="text-lg mb-2">⚠️ 播放错误</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2 text-gray-400">视频链接: {src}</p>
            <button 
              onClick={() => {
                setError(null)
                setIsLoading(true)
                if (videoRef.current) {
                  videoRef.current.load()
                }
              }}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              重新加载
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
