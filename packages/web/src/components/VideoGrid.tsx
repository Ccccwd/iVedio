import type { Video } from '@shared/types'
import VideoCard from './VideoCard'

interface VideoGridProps {
  videos: Video[]
  loading?: boolean
}

function VideoGrid({ videos, loading }: VideoGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-background-card aspect-video rounded-lg mb-3" />
            <div className="bg-background-card h-4 rounded mb-2" />
            <div className="bg-background-card h-3 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-xl">暂无视频内容</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

export default VideoGrid
