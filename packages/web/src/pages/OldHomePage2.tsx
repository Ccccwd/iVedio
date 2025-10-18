import type { Video } from '@shared/types'
import { ChevronLeft, ChevronRight, Play, VolumeX, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import BannerHero from '../components/BannerHero'

function HomePage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/videos')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('API响应:', result)

      if (result.success) {
        setVideos(result.data.videos || [])
      } else {
        setError(result.message || '获取视频失败')
      }
    } catch (error) {
      console.error('获取视频失败:', error)
      setError('网络错误，无法获取视频数据')
    } finally {
      setLoading(false)
    }
  }

  // 千与千寻的banner数据
  const spiritedAwayBanner = {
    id: 'spirited-away',
    title: '千与千寻',
    subtitle: 'となりのトトロ',
    description: '宫崎骏经典动画电影，讲述少女千寻误入神灵世界，为拯救父母勇敢成长的奇幻冒险。画面精美，情感细腻，适合全年龄观众。',
    posterUrl: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun.jpg',
    videoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun.mkv',
    videoId: '7', // 千与千寻的实际ID
    tags: ['动画', '奇幻', '宫崎骏', '成长', '经典'],
    duration: '2小时4分',
    rating: '9.4'
  }

  useEffect(() => {
    fetchVideos()

    // 5秒后开始播放预览视频
    const timer = setTimeout(() => {
      setShowVideo(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const BannerSection = () => (
    <section className="relative h-[70vh] min-h-[500px] bg-black rounded-lg overflow-hidden mb-8">
      {/* 背景图片或视频 */}
      <div className="absolute inset-0">
        {!showVideo ? (
          // 显示封面图片
          <div
            className="w-full h-full bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${spiritedAwayBanner.posterUrl})`
            }}
          />
        ) : (
          // 显示预览视频
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={(e) => {
              const video = e.target as HTMLVideoElement;
              // 跳转到视频的30秒位置开始播放预览
              video.currentTime = 30;
              setIsPlaying(true);
            }}
            onError={(e) => {
              console.error('Banner video error:', e);
              // 如果视频加载失败，回退到封面图片
              setShowVideo(false);
            }}
          >
            <source src={spiritedAwayBanner.videoUrl} type="video/x-matroska" />
            <source src={spiritedAwayBanner.videoUrl} type="video/mp4" />
          </video>
        )}

        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* 内容信息 */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            {/* 标题 */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 drop-shadow-2xl">
              {spiritedAwayBanner.title}
            </h1>
            <p className="text-xl text-gray-300 mb-4 font-light">
              {spiritedAwayBanner.subtitle}
            </p>

            {/* 评分和标签 */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-white font-bold">{spiritedAwayBanner.rating}</span>
              </div>
              <span className="text-gray-300">{spiritedAwayBanner.duration}</span>
              <div className="flex space-x-2">
                {spiritedAwayBanner.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-white/20 text-white text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 描述 */}
            <p className="text-gray-200 text-lg mb-8 leading-relaxed line-clamp-3">
              {spiritedAwayBanner.description}
            </p>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-4">
              <Link
                to={`/video/${spiritedAwayBanner.videoId}`}
                className="flex items-center space-x-3 bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
              >
                <Play size={24} fill="currentColor" />
                <span>立即播放</span>
              </Link>

              {/* 音量控制（仅在播放视频时显示） */}
              {showVideo && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-200"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 右下角指示器 */}
      <div className="absolute bottom-6 right-6 flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full opacity-100"></div>
        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
      </div>

      {/* 播放状态指示 */}
      {showVideo && isPlaying && (
        <div className="absolute top-6 right-6 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
          预览播放中
        </div>
      )}
    </section>
  )

  const CategorySection = ({ title, description }: { title: string, description: string }) => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 bg-background-card hover:bg-background-hover rounded-full transition">
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
          <button className="p-2 bg-background-card hover:bg-background-hover rounded-full transition">
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* 内容预留区域 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-background-card rounded-lg p-6 text-center">
            <div className="w-full h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 flex items-center justify-center">
              <Play size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm">内容即将上线</p>
          </div>
        ))}
      </div>
    </section>
  )

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-96 bg-background-card rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-background-card rounded-lg p-4 animate-pulse">
              <div className="aspect-video bg-gray-700 rounded mb-4" />
              <div className="h-4 bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-xl mb-4">{error}</p>
        <button
          onClick={fetchVideos}
          className="btn-primary"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Banner轮播区域 */}
      <BannerSection />

      {/* 现有视频内容 */}
      {videos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">最新视频</h2>
              <p className="text-gray-400">发现精彩内容</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}

      {/* 分类预留区域 */}
      <CategorySection
        title="电视剧"
        description="热播剧集，追剧必看"
      />

      <CategorySection
        title="电影"
        description="精选影片，院线大片"
      />

      <CategorySection
        title="综艺"
        description="热门综艺，娱乐无限"
      />

      <CategorySection
        title="动漫"
        description="动画世界，精彩纷呈"
      />

      <CategorySection
        title="纪录片"
        description="探索世界，增长见识"
      />

      {/* 调试信息 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-bold mb-2">调试信息</h3>
          <p className="text-gray-300">视频数量: {videos.length}</p>
          <p className="text-gray-300">加载状态: {loading ? '加载中' : '已完成'}</p>
          {error && <p className="text-red-400">错误: {error}</p>}
        </div>
      )}
    </div>
  )
}

export default HomePage