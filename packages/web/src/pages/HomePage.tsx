import type { Video } from '@shared/types'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import BannerHero from '../components/BannerHero'
import VideoCard from '../components/VideoCard'

function HomePage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    subtitle: 'Spirited Away',
    description: '宫崎骏经典动画电影，讲述少女千寻误入神灵世界，为拯救父母勇敢成长的奇幻冒险。画面精美，情感细腻，适合全年龄观众。',
    posterUrl: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun.jpg',
    previewVideoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun-preview.mp4', // 使用预览视频
    fullVideoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun.mkv',
    videoId: '7',
    tags: ['动画', '奇幻', '宫崎骏', '成长', '经典'],
    duration: '2小时4分',
    rating: '9.4'
  }

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
        <div className="h-[70vh] min-h-[500px] bg-background-card rounded-lg animate-pulse" />
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
      {/* 使用新的BannerHero组件 */}
      <BannerHero
        video={spiritedAwayBanner}
        autoPlayDelay={4000} // 4秒后开始预览
      />

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