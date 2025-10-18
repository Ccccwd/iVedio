import type { Video } from '@shared/types'
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

  // Banner视频数据数组
  const bannerVideos = [
    {
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
    },
    {
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
    }
  ]

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

  // 按分类筛选视频
  const getVideosByCategory = (category: string) => {
    return videos.filter(video => video.category === category)
  }

  const animeVideos = getVideosByCategory('动漫')
  const movieVideos = getVideosByCategory('电影')
  const tvSeriesVideos = getVideosByCategory('电视剧')
  const varietyVideos = getVideosByCategory('综艺')
  const documentaryVideos = getVideosByCategory('纪录片')

  return (
    <div className="space-y-8">
      {/* 使用新的BannerHero组件 */}
      <BannerHero
        videos={bannerVideos}
        autoPlayDelay={4000} // 4秒后开始预览
      />

      {/* 动漫分类 */}
      {animeVideos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">动漫</h2>
              <p className="text-gray-400">精彩动漫作品</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {animeVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}

      {/* 电影分类 */}
      {movieVideos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">电影</h2>
              <p className="text-gray-400">精彩电影作品</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movieVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}

      {/* 电视剧分类 */}
      {tvSeriesVideos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">电视剧</h2>
              <p className="text-gray-400">精彩电视剧作品</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tvSeriesVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}

      {/* 综艺分类 */}
      {varietyVideos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">综艺</h2>
              <p className="text-gray-400">精彩综艺节目</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {varietyVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}

      {/* 纪录片分类 */}
      {documentaryVideos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">纪录片</h2>
              <p className="text-gray-400">精彩纪录片作品</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documentaryVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}

export default HomePage