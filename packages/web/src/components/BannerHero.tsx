import { Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
    videos: BannerVideo[] // 改为支持多个视频
    autoPlayDelay?: number // 自动播放延迟（毫秒），默认4000ms
}

export default function BannerHero({ videos, autoPlayDelay = 4000 }: BannerHeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)
    const [showPlayButton, setShowPlayButton] = useState(true)

    const videoRef = useRef<HTMLVideoElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const currentVideo = videos[currentIndex]

    // 切换视频
    const handleVideoSwitch = (index: number) => {
        if (index === currentIndex) return

        // 停止当前视频
        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }

        // 重置状态
        setIsVideoPlaying(false)
        setHasError(false)
        setIsVideoLoaded(false)
        setShowPlayButton(true)

        // 切换到新视频
        setCurrentIndex(index)

        // 清除旧的定时器
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }

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
    }, [autoPlayDelay, currentIndex]) // 添加currentIndex依赖

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
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isVideoPlaying && !hasError ? 'opacity-0' : 'opacity-100'
                    }`}
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${currentVideo.posterUrl})`
                }}
            />

            {/* 预览视频层 */}
            <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isVideoPlaying && !hasError ? 'opacity-100' : 'opacity-0'
                    }`}
                muted={isMuted}
                playsInline
                preload="metadata"
                loop
                onLoadedData={handleVideoLoaded}
                onError={handleVideoError}
                onLoadStart={() => console.log('开始加载预览视频:', currentVideo.previewVideoUrl)}
                onCanPlay={() => console.log('预览视频可以播放')}
            >
                {/* 根据文件扩展名设置正确的MIME类型 */}
                {currentVideo.previewVideoUrl.includes('.mp4') && (
                    <source src={currentVideo.previewVideoUrl} type="video/mp4" />
                )}
                {currentVideo.previewVideoUrl.includes('.mkv') && (
                    <source src={currentVideo.previewVideoUrl} type="video/x-matroska" />
                )}
                {currentVideo.previewVideoUrl.includes('.webm') && (
                    <source src={currentVideo.previewVideoUrl} type="video/webm" />
                )}

                {/* 通用fallback */}
                <source src={currentVideo.previewVideoUrl} type="video/mp4" />
                <source src={currentVideo.previewVideoUrl} type="video/webm" />
            </video>

            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* 内容信息层 */}
            <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-6">
                    <div className="max-w-2xl">
                        {/* 标题 */}
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 drop-shadow-2xl">
                            {currentVideo.title}
                        </h1>

                        {currentVideo.subtitle && (
                            <p className="text-xl text-gray-300 mb-4 font-light">
                                {currentVideo.subtitle}
                            </p>
                        )}

                        {/* 评分和标签 */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center space-x-2">
                                <span className="text-yellow-400 text-lg">★</span>
                                <span className="text-white font-bold">{currentVideo.rating}</span>
                            </div>
                            <span className="text-gray-300">{currentVideo.duration}</span>
                            <div className="flex space-x-2">
                                {currentVideo.tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-white/20 text-white text-xs rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 描述 */}
                        <p className="text-gray-200 text-lg mb-8 leading-relaxed line-clamp-3">
                            {currentVideo.description}
                        </p>

                        {/* 操作按钮 */}
                        <div className="flex items-center space-x-4">
                            <Link
                                to={`/video/${currentVideo.videoId}`}
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

            {/* 右下角封面切换器 */}
            <div className="absolute bottom-6 right-6 flex items-center space-x-3 z-20">
                {videos.map((video, index) => (
                    <button
                        key={video.id}
                        onClick={() => handleVideoSwitch(index)}
                        className={`relative group transition-all duration-300 rounded-lg overflow-hidden ${currentIndex === index
                                ? 'scale-110 ring-4 ring-white shadow-2xl'
                                : 'scale-100 opacity-60 hover:opacity-100 hover:scale-105'
                            }`}
                    >
                        <img
                            src={video.posterUrl}
                            alt={video.title}
                            className="w-24 h-36 object-cover"
                        />
                        {/* 遮罩层 */}
                        <div className={`absolute inset-0 bg-black transition-opacity ${currentIndex === index ? 'opacity-0' : 'opacity-30 group-hover:opacity-0'
                            }`}></div>

                        {/* 悬浮提示 */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                            {video.title}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                        </div>

                        {/* 当前选中指示器 */}
                        {currentIndex === index && (
                            <div className="absolute inset-0 border-4 border-white rounded-lg pointer-events-none"></div>
                        )}
                    </button>
                ))}
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