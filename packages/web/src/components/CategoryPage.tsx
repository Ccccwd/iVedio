import type { Video } from '@shared/types'
import { Filter } from 'lucide-react'
import { useEffect, useState } from 'react'
import BannerHero from '../components/BannerHero'
import VideoCard from '../components/VideoCard'

interface CategoryPageProps {
  category: string
  title: string
  description: string
}

// 根据分类映射数据库中的分类名称
const categoryMap: Record<string, string> = {
  'anime': '动漫',
  'movie': '电影',
  'tv': '电视剧',
  'variety': '综艺',
  'kids': '少儿',
  'documentary': '纪录片',
  'sports': '体育'
}

function CategoryPage({ category, title, description }: CategoryPageProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('全部')

  const filters = ['全部', '最新', '热门', '评分最高']

  useEffect(() => {
    fetchVideos()
  }, [category])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/videos')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        // 根据分类筛选视频
        const dbCategory = categoryMap[category]
        const filteredVideos = result.data.videos.filter(
          (video: Video) => video.category === dbCategory
        )
        setVideos(filteredVideos)
      }
    } catch (error) {
      console.error('获取视频失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取海报数据
  const getBannerVideo = () => {
    if (category === 'anime' && videos.length > 0) {
      // 动漫分类 - 千与千寻
      return [{
        id: 'spirited-away',
        title: '千与千寻',
        subtitle: 'Spirited Away',
        description: '宫崎骏经典动画电影，讲述少女千寻误入神灵世界，为拯救父母勇敢成长的奇幻冒险。画面精美，情感细腻，适合全年龄观众。',
        posterUrl: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun.jpg',
        previewVideoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun-preview.mp4',
        fullVideoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun.mp4',
        videoId: '7',
        tags: ['动画', '奇幻', '宫崎骏', '成长', '经典'],
        duration: '2小时4分',
        rating: '9.4'
      }]
    } else if (category === 'movie' && videos.length > 0) {
      // 电影分类 - 奇异博士2
      return [{
        id: 'doctor-strange-2',
        title: '奇异博士2',
        subtitle: 'Doctor Strange in the Multiverse of Madness',
        description: '漫威超级英雄电影，奇异博士探索多元宇宙的惊险之旅。充满视觉奇观和惊人的魔法场景，带你进入前所未见的奇幻世界。',
        posterUrl: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/DoctorStrange2.png',
        previewVideoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/DoctorStrange2-preview.mp4',
        fullVideoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/DoctorStrange2.mp4',
        videoId: '8',
        tags: ['漫威', '科幻', '动作', '奇幻', '超级英雄'],
        duration: '2小时6分',
        rating: '8.7'
      }]
    }
    return null
  }

  const bannerVideo = getBannerVideo()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-background-card rounded-lg p-6 animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-700 rounded w-2/3" />
        </div>
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

  return (
    <div className="space-y-8">
      {/* 海报横幅 - 仅在有内容时显示 */}
      {bannerVideo && (
        <BannerHero
          videos={bannerVideo}
          autoPlayDelay={4000}
        />
      )}

      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-300 mb-6">{description}</p>

        {/* 筛选器 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-gray-400">筛选:</span>
          </div>
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm transition ${selectedFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-background-card text-gray-300 hover:bg-background-hover'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPage