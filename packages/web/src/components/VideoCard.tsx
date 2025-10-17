import { useNavigate } from 'react-router-dom'
import { Play, Eye } from 'lucide-react'
import { useState } from 'react'
import type { Video } from '@shared/types'

interface VideoCardProps {
  video: Video
}

function VideoCard({ video }: VideoCardProps) {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number | undefined) => {
    if (!views || views === 0) {
      return '0'
    }
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
    // 尝试使用本地占位图片
    const imgElement = document.querySelector(`img[alt="${video.title}"]`) as HTMLImageElement
    if (imgElement) {
      imgElement.src = '/placeholder.svg'
    }
  }

  return (
    <div
      className="card cursor-pointer group"
      onClick={() => navigate(`/video/${video.id}`)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-800">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="animate-spin w-6 h-6 border-2 border-gray-600 border-t-gray-400 rounded-full"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400">
            <div className="text-center">
              <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">预览图加载失败</p>
            </div>
          </div>
        ) : (
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
          {formatDuration(video.duration)}
        </div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-12 h-12 text-white" fill="white" />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-medium line-clamp-2 mb-2 group-hover:text-primary transition">
          {video.title}
        </h3>
        <div className="flex items-center text-gray-400 text-sm space-x-4">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{formatViews(video.views)}</span>
          </div>
          <span>{video.category}</span>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
