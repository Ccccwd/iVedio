import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  src: string
  poster?: string
  onReady?: (player: any) => void
}

function VideoPlayer({ src, poster, onReady }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

    // 添加事件监听器
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('loadeddata', handleLoadedData)

    // 设置视频源
    video.src = src
    video.load()

    // 清理函数
    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [src, onReady])

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
