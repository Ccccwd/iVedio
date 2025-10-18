import { Maximize, Pause, Play, Send, Settings, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import './VideoPlayer.css'

interface Danmaku {
  id: number
  content: string
  time: number
  color: string
  type: 'scroll' | 'top' | 'bottom'
  fontSize: number
  user: {
    username: string
  }
}

interface VideoPlayerProps {
  src: string
  poster?: string
  videoId?: string
  onReady?: (player: any) => void
  useNativeControls?: boolean  // 临时添加：用于测试
}

function VideoPlayer({ src, poster, videoId, onReady, useNativeControls = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const danmakuContainerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // 硬编码测试弹幕数据
  const [danmakus, setDanmakus] = useState<Danmaku[]>([
    {
      id: 1001,
      content: '111',
      time: 58.0, // 58秒
      color: '#FFFFFF',
      type: 'scroll',
      fontSize: 20,
      user: { username: '测试用户1' }
    },
    {
      id: 1002,
      content: '123',
      time: 60.0, // 60秒(1分钟)
      color: '#FFFFFF',
      type: 'scroll',
      fontSize: 20,
      user: { username: '测试用户2' }
    },
    {
      id: 1003,
      content: '111',
      time: 62.0, // 62秒
      color: '#FFFFFF',
      type: 'scroll',
      fontSize: 20,
      user: { username: '测试用户3' }
    }
  ])
  const [newDanmaku, setNewDanmaku] = useState('')
  const [danmakuSettings, setDanmakuSettings] = useState({
    enabled: true,
    opacity: 0.8,
    fontSize: 14,
    speed: 10, // 秒数，弹幕从右到左移动的时间
  })
  const [showDanmakuInput, setShowDanmakuInput] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const saveProgressTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const activeDanmakusRef = useRef<Set<number>>(new Set())
  const displayedDanmakusRef = useRef<Set<number>>(new Set()) // 记录已显示的弹幕
  const lastTimeRef = useRef(0) // 记录上一次的播放时间
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isSeekingRef = useRef(false)
  const progressLoadedRef = useRef(false)
  const retryCountRef = useRef(0)
  const maxRetries = 3
  const lastVideoIdRef = useRef<string | undefined>(undefined) // 记录上次的视频ID
  const danmakuCacheRef = useRef<Map<string, Danmaku[]>>(new Map()) // 新增：弹幕缓存

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
    if (!userData || !videoId || progressLoadedRef.current) return

    const user = JSON.parse(userData)

    try {
      const response = await fetch(`http://localhost:3001/api/videos/${videoId}/progress/${user.id}`)
      const result = await response.json()

      if (result.success && result.data.progress > 0 && videoRef.current) {
        const video = videoRef.current
        // 如果有观看进度且未看完，从上次位置开始播放
        if (!result.data.completed && result.data.progress > 30) {
          console.log('恢复观看进度:', result.data.progress, '秒')
          progressLoadedRef.current = true // 标记已加载过进度
          // 只有在视频准备好时才设置currentTime
          if (video.readyState >= 1) { // HAVE_METADATA
            setTimeout(() => {
              const targetTime = result.data.progress
              video.currentTime = targetTime
              // 重要：更新lastTimeRef为跳转目标时间，避免显示之前的所有弹幕
              lastTimeRef.current = targetTime
              console.log('已更新lastTimeRef为:', targetTime)
            }, 100) // 延迟100ms确保视频完全ready
          }
        }
      }
    } catch (error) {
      console.error('加载观看进度失败:', error)
    }
  }

  // 获取弹幕数据 - 暂时禁用,使用硬编码数据测试
  const loadDanmakus = async () => {
    console.log('⚠️ 使用硬编码弹幕数据进行测试')
    console.log('硬编码弹幕数量:', danmakus.length)
    console.log('硬编码弹幕列表:', danmakus.map(d => `${d.time}s: ${d.content}`))
    return // 直接返回,不从API加载
  }

  // 原API加载代码（已禁用）
  /*
  const loadDanmakus = async () => {
    if (!videoId) {
      console.log('没有videoId，跳过加载弹幕')
      return
    }

    console.log('开始加载弹幕，videoId:', videoId)

    // 检查缓存
    const cacheKey = `video_${videoId}`
    const cachedDanmakus = danmakuCacheRef.current.get(cacheKey)
    if (cachedDanmakus) {
      console.log('从缓存加载弹幕数据，数量:', cachedDanmakus.length)
      setDanmakus(cachedDanmakus)
      return
    }

    try {
      const url = `http://localhost:3001/api/danmakus/video/${videoId}`
      console.log('请求弹幕API:', url)
      
      const response = await fetch(url)
      const result = await response.json()
      
      console.log('弹幕API响应:', result)
      
      if (result.success) {
        // 缓存弹幕数据
        danmakuCacheRef.current.set(cacheKey, result.data)
        setDanmakus(result.data)
        console.log(`✅ 成功加载 ${result.data.length} 条弹幕`)
        
        // 打印所有弹幕的时间点
        if (result.data.length > 0) {
          console.log('弹幕时间点:', result.data.map((d: any) => `${d.time.toFixed(2)}s: ${d.content}`))
        }
      } else {
        console.error('加载弹幕失败:', result.message)
      }
    } catch (error) {
      console.error('加载弹幕异常:', error)
    }
  */

  // 发送弹幕
  const sendDanmaku = async () => {
    if (!newDanmaku.trim() || !videoId || !videoRef.current) return

    const video = videoRef.current
    const currentTime = video.currentTime
    const userData = localStorage.getItem('userData')
    const user = userData ? JSON.parse(userData) : { id: 1 }

    console.log('发送弹幕:', {
      content: newDanmaku.trim(),
      time: currentTime,
      fontSize: danmakuSettings.fontSize
    })

    try {
      const response = await fetch('http://localhost:3001/api/danmakus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          videoId: parseInt(videoId),
          content: newDanmaku.trim(),
          time: currentTime,
          color: '#FFFFFF',
          type: 'scroll',
          fontSize: danmakuSettings.fontSize
        })
      })

      const result = await response.json()
      console.log('弹幕发送响应:', result)
      
      if (result.success) {
        // 立即显示新发送的弹幕
        const newDanmakuItem = result.data
        console.log('新弹幕数据:', newDanmakuItem)
        
        setDanmakus(prev => {
          const updatedDanmakus = [...prev, newDanmakuItem]
          console.log('更新弹幕列表，总数:', updatedDanmakus.length)
          // 更新缓存
          const cacheKey = `video_${videoId}`
          danmakuCacheRef.current.set(cacheKey, updatedDanmakus)
          return updatedDanmakus
        })
        
        // 立即显示新发送的弹幕
        console.log('立即显示新弹幕:', newDanmakuItem.content)
        displayDanmaku(newDanmakuItem, true)
        setNewDanmaku('')
        setShowDanmakuInput(false)
      } else {
        console.error('发送弹幕失败:', result.message)
      }
    } catch (error) {
      console.error('发送弹幕异常:', error)
    }
  }

  // 显示弹幕
  const displayDanmaku = (danmaku: Danmaku, immediate = false) => {
    console.log('🎯 displayDanmaku 被调用:', { 
      content: danmaku.content, 
      time: danmaku.time,
      immediate, 
      enabled: danmakuSettings.enabled,
      isActive: activeDanmakusRef.current.has(danmaku.id),
      isDisplayed: displayedDanmakusRef.current.has(danmaku.id),
      containerExists: !!danmakuContainerRef.current
    })
    
    if (!danmakuSettings.enabled) {
      console.log('❌ 弹幕未启用')
      return
    }
    
    if (!danmakuContainerRef.current) {
      console.log('❌ 弹幕容器不存在')
      return
    }
    
    if (activeDanmakusRef.current.has(danmaku.id)) {
      console.log('⏸️ 弹幕正在显示中，跳过')
      return
    }

    // 只有非立即显示时才检查是否已显示过
    if (!immediate && displayedDanmakusRef.current.has(danmaku.id)) {
      console.log('⏭️ 弹幕已显示过，跳过')
      return
    }

    const container = danmakuContainerRef.current
    const video = videoRef.current
    if (!video) {
      console.log('❌ 视频元素不存在')
      return
    }

    console.log('✨ 开始显示弹幕:', danmaku.content, 'at', danmaku.time.toFixed(2) + 's')
    
    activeDanmakusRef.current.add(danmaku.id)
    if (!immediate) {
      displayedDanmakusRef.current.add(danmaku.id) // 只有非立即显示时才标记为已显示
    }

    const danmakuElement = document.createElement('div')
    danmakuElement.className = 'absolute whitespace-nowrap pointer-events-none select-none'
    danmakuElement.style.cssText = `
      color: ${danmaku.color};
      font-size: ${danmaku.fontSize}px;
      opacity: ${danmakuSettings.opacity};
      z-index: 10;
      right: 0;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
      font-weight: bold;
      transition: transform ${danmakuSettings.speed}s linear;
    `
    danmakuElement.textContent = danmaku.content

    // 随机垂直位置
    const containerHeight = container.offsetHeight
    const danmakuHeight = danmaku.fontSize + 4
    const maxTop = Math.max(0, containerHeight - danmakuHeight - 50) // 避免遮挡控制栏
    const randomTop = Math.random() * maxTop
    danmakuElement.style.top = `${randomTop}px`

    container.appendChild(danmakuElement)

    // 动画：从右到左移动
    requestAnimationFrame(() => {
      const elementWidth = danmakuElement.offsetWidth
      const containerWidth = container.offsetWidth
      danmakuElement.style.transform = `translateX(-${containerWidth + elementWidth}px)`
    })

    // 动画结束后移除元素
    setTimeout(() => {
      if (danmakuElement.parentNode) {
        danmakuElement.parentNode.removeChild(danmakuElement)
      }
      activeDanmakusRef.current.delete(danmaku.id)
    }, danmakuSettings.speed * 1000)
  }

  // 处理视频时间更新，显示对应时间的弹幕
  const handleTimeUpdate = () => {
    if (!videoRef.current) return

    const currentTime = videoRef.current.currentTime
    const lastTime = lastTimeRef.current

    // 详细日志
    if (Math.floor(currentTime) !== Math.floor(lastTime)) {
      console.log(`⏰ 时间更新: ${lastTime.toFixed(2)}s → ${currentTime.toFixed(2)}s | 弹幕开启: ${danmakuSettings.enabled} | 弹幕总数: ${danmakus.length}`)
    }

    if (!danmakuSettings.enabled) {
      lastTimeRef.current = currentTime
      return
    }

    // 检测是否是向后跳转（回退）
    const isBackward = currentTime < lastTime

    // 查找应该显示的弹幕
    danmakus.forEach(danmaku => {
      // 向前播放：显示lastTime到currentTime之间的弹幕
      // 向后跳转：由于已清空displayedDanmakusRef，所以会重新显示
      if (isBackward) {
        // 向后跳转时，显示当前时间附近的弹幕（±0.5秒窗口）
        const timeDiff = Math.abs(danmaku.time - currentTime)
        if (timeDiff < 0.5 && !displayedDanmakusRef.current.has(danmaku.id)) {
          console.log(`[回退] 显示弹幕: "${danmaku.content}" at ${danmaku.time.toFixed(2)}s (timeDiff: ${timeDiff.toFixed(2)}s)`)
          displayDanmaku(danmaku)
        }
      } else {
        // 正常播放：显示时间段内的弹幕
        if (danmaku.time >= lastTime && danmaku.time <= currentTime && !displayedDanmakusRef.current.has(danmaku.id)) {
          console.log(`✅ 显示弹幕: "${danmaku.content}" at ${danmaku.time.toFixed(2)}s (范围: ${lastTime.toFixed(2)}s - ${currentTime.toFixed(2)}s)`)
          displayDanmaku(danmaku)
        } else if (danmaku.time >= lastTime && danmaku.time <= currentTime) {
          // 调试：弹幕在范围内但已显示过
          console.log(`⏭️ 跳过已显示弹幕: "${danmaku.content}" at ${danmaku.time.toFixed(2)}s`)
        }
      }
    })

    // 更新上次时间
    lastTimeRef.current = currentTime

    // 保存观看进度（防抖）
    if (saveProgressTimeoutRef.current) {
      clearTimeout(saveProgressTimeoutRef.current)
    }
    saveProgressTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && videoId) {
        saveProgress(videoRef.current.currentTime, videoRef.current.duration)
      }
    }, 2000)
  }

  // 播放器控制函数
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().catch(err => {
        console.error('播放失败:', err)
        setError('无法播放视频')
      })
    } else {
      video.pause()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current
    if (!video) return

    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration

    // 确保新时间在有效范围内
    const clampedTime = Math.max(0, Math.min(duration - 0.1, newTime))

    try {
      video.currentTime = clampedTime
      setCurrentTime(clampedTime)
      console.log('跳转到:', clampedTime)
    } catch (err) {
      console.error('跳转失败:', err)
    }
  }

  const handleSkip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Math.max(0, Math.min(duration - 0.1, video.currentTime + seconds))
    try {
      video.currentTime = newTime
      console.log('快进/快退到:', newTime)
    } catch (err) {
      console.error('快进/快退失败:', err)
    }
  }

  const toggleFullscreen = async () => {
    const container = videoRef.current?.parentElement
    if (!container) return

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('全屏切换失败:', error)
    }
  }

  // 切换播放倍速
  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current
    if (!video) return
    
    video.playbackRate = rate
    setPlaybackRate(rate)
    setShowSpeedMenu(false)
    console.log('播放速度设置为:', rate + 'x')
  }

  // 控制栏自动隐藏
  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  // 格式化时间
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // 重置进度加载标志
    progressLoadedRef.current = false
    isSeekingRef.current = false
    lastTimeRef.current = 0
    displayedDanmakusRef.current.clear()

    // 新增：如果视频ID发生变化，重置弹幕状态
    if (lastVideoIdRef.current !== videoId) {
      console.log('视频ID发生变化，重置弹幕状态')
      lastVideoIdRef.current = videoId
      setDanmakus([]) // 清空弹幕列表
      displayedDanmakusRef.current.clear() // 清空已显示弹幕记录
      activeDanmakusRef.current.clear() // 清空活跃弹幕记录
      
      // 重新加载弹幕
      if (videoId) {
        loadDanmakus()
      }
    }

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

    const handleTimeUpdateInternal = () => {
      if (!video.duration || !videoId || isSeekingRef.current) return

      // 更新播放器状态
      setCurrentTime(video.currentTime)
      setDuration(video.duration)
      setIsPlaying(!video.paused)
      setIsMuted(video.muted)
      setVolume(video.volume)

      // 处理弹幕显示
      handleTimeUpdate()

      // 清除之前的定时器
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current)
      }

      // 延迟保存进度，避免频繁请求
      saveProgressTimeoutRef.current = setTimeout(() => {
        if (!isSeekingRef.current) {
          saveProgress(video.currentTime, video.duration)
        }
      }, 5000) // 5秒后保存
    }

    const handleError = (e: Event) => {
      console.error('Video error:', e)
      console.error('Video error details:', video.error)
      setIsLoading(false)

      // 检查是否是MKV格式
      const isMkv = src.includes('.mkv')

      if (video.error) {
        switch (video.error.code) {
          case video.error.MEDIA_ERR_ABORTED:
            setError('视频播放被中止')
            break
          case video.error.MEDIA_ERR_NETWORK:
            setError('网络错误，无法加载视频')
            break
          case video.error.MEDIA_ERR_DECODE:
            if (isMkv) {
              setError('MKV格式解码错误，建议使用支持MKV的播放器或转换为MP4格式')
            } else {
              setError('视频解码错误')
            }
            break
          case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            if (isMkv) {
              setError('MKV格式在此浏览器中不受支持，建议使用Chrome、Firefox最新版本或转换为MP4格式')
            } else {
              setError('视频格式不支持或文件损坏')
            }
            break
          default:
            setError('未知错误')
        }
      }
    }

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded:', src)
      // 在元数据加载完成后恢复观看进度
      loadProgress()
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

    const handleSeeking = () => {
      console.log('视频开始跳转...')
      isSeekingRef.current = true
      // 清空已显示弹幕记录，允许跳转后重新显示
      displayedDanmakusRef.current.clear()
    }

    const handleSeeked = () => {
      console.log('视频跳转完成')
      isSeekingRef.current = false
      // 更新lastTime为当前时间，避免显示跳转前的弹幕
      if (video) {
        lastTimeRef.current = video.currentTime
      }
    }

    // 添加事件监听器
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('timeupdate', handleTimeUpdateInternal)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('seeking', handleSeeking)
    video.addEventListener('seeked', handleSeeked)

    // 如果视频ID没有变化，且弹幕列表为空，则加载弹幕数据
    if (videoId && lastVideoIdRef.current === videoId && danmakus.length === 0) {
      loadDanmakus()
    }

    // 点击外部关闭菜单
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.speed-menu-container')) {
        setShowSpeedMenu(false)
      }
      if (!target.closest('.settings-panel-container')) {
        setShowSettings(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    // 清理函数 - 优化内存管理
    return () => {
      document.removeEventListener('click', handleClickOutside)
      
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current)
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      
      // 清理所有活跃的弹幕元素
      if (danmakuContainerRef.current) {
        const container = danmakuContainerRef.current
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }
      }
      
      // 清空活跃弹幕记录
      activeDanmakusRef.current.clear()
      
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('timeupdate', handleTimeUpdateInternal)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('seeking', handleSeeking)
      video.removeEventListener('seeked', handleSeeked)
    }
  }, [src, onReady, videoId])

  return (
    <div
      className="relative rounded-lg overflow-hidden bg-black group w-full"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      style={{ aspectRatio: '16/9', isolation: 'isolate' }}
    >
      {/* 视频元素 */}
      <video
        key={src}
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        preload="auto"
        playsInline
        webkit-playsinline="true"
        crossOrigin="anonymous"
        controls={useNativeControls}
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onSeeking={() => console.log('视频正在跳转...')}
        onSeeked={() => console.log('视频跳转完成')}
        onStalled={(e) => {
          console.warn('视频加载停滞')
          const video = e.currentTarget
          if (retryCountRef.current < maxRetries) {
            console.log('尝试重新加载...', retryCountRef.current + 1)
            retryCountRef.current++
            setTimeout(() => {
              const currentTime = video.currentTime
              video.load()
              video.currentTime = currentTime
              video.play().catch(err => console.error('重新播放失败:', err))
            }, 1000)
          }
        }}
        onWaiting={() => {
          console.log('视频缓冲中...')
          setIsLoading(true)
        }}
        onCanPlayThrough={() => {
          console.log('视频可以流畅播放')
          setIsLoading(false)
          retryCountRef.current = 0 // 重置重试计数
        }}
        onProgress={(e) => {
          const video = e.currentTarget
          if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1)
            const duration = video.duration
            if (duration > 0) {
              const bufferedPercent = (bufferedEnd / duration) * 100
              console.log('缓冲进度:', bufferedPercent.toFixed(1) + '%')
            }
          }
        }}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget
          setDuration(video.duration)
          console.log('视频元数据加载完成, 时长:', video.duration)
        }}
        controlsList={useNativeControls ? undefined : "nodownload nofullscreen noremoteplayback"}
        disablePictureInPicture={!useNativeControls}
        src={src}
      >
        您的浏览器不支持视频播放。
      </video>

      {/* 弹幕容器 */}
      <div
        ref={danmakuContainerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 10 }}
      />

      {/* 播放/暂停中央按钮 */}
      {!useNativeControls && !isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity"
          style={{ zIndex: 15 }}
        >
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-black bg-opacity-60 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all transform hover:scale-110 pointer-events-auto"
          >
            <Play className="w-10 h-10 text-white ml-1" fill="white" />
          </button>
        </div>
      )}

      {/* 控制栏 */}
      {!useNativeControls && <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-all duration-300 ${showControls || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        style={{ zIndex: 20 }}
      >

        {/* 进度条 */}
        <div className="mb-4">
          <div
            className="w-full h-1 bg-gray-600 rounded cursor-pointer hover:h-2 transition-all"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-blue-500 rounded transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* 主控制栏 */}
        <div className="flex items-center justify-between">
          {/* 左侧控制 */}
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" fill="white" />}
            </button>

            <button onClick={() => handleSkip(-10)} className="text-white hover:text-blue-400 transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>

            <button onClick={() => handleSkip(10)} className="text-white hover:text-blue-400 transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>

            {/* 音量控制 */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 h-1 bg-gray-600 rounded appearance-none cursor-pointer slider"
              />
            </div>

            {/* 时间显示 */}
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* 右侧控制 */}
          <div className="flex items-center gap-3">
            {/* 弹幕控制 */}
            <button
              onClick={() => setShowDanmakuInput(true)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              title="发送弹幕"
            >
              弹
            </button>

            <button
              onClick={() => setDanmakuSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`px-3 py-1 rounded text-sm transition-colors ${danmakuSettings.enabled
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                }`}
              title={danmakuSettings.enabled ? '关闭弹幕' : '开启弹幕'}
            >
              弹幕
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:text-blue-400 transition-colors"
              title="弹幕设置"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* 倍速按钮 */}
            <div className="relative speed-menu-container">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                title="播放速度"
              >
                {playbackRate}x
              </button>

              {/* 倍速菜单 */}
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-95 text-white rounded-lg py-2 min-w-[80px] shadow-xl border border-gray-700">
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(rate => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRateChange(rate)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                        playbackRate === rate ? 'text-blue-400 bg-gray-800' : ''
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 弹幕输入框 */}
        {showDanmakuInput && (
          <div className="mt-3 flex items-center gap-2 bg-black bg-opacity-60 rounded-lg p-2">
            <input
              type="text"
              value={newDanmaku}
              onChange={(e) => setNewDanmaku(e.target.value)}
              placeholder="输入弹幕内容..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              maxLength={100}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendDanmaku()
                } else if (e.key === 'Escape') {
                  setShowDanmakuInput(false)
                  setNewDanmaku('')
                }
              }}
              autoFocus
            />
            <button
              onClick={sendDanmaku}
              disabled={!newDanmaku.trim()}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowDanmakuInput(false)
                setNewDanmaku('')
              }}
              className="px-2 py-1 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* 弹幕设置面板 */}
        {showSettings && (
          <div className="settings-panel-container absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 text-white p-4 rounded-lg w-64 shadow-xl border border-gray-700">
            <h3 className="text-sm font-semibold mb-3">弹幕设置</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-300 mb-1">不透明度</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={danmakuSettings.opacity}
                  onChange={(e) => setDanmakuSettings(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{Math.round(danmakuSettings.opacity * 100)}%</span>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">字体大小</label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="2"
                  value={danmakuSettings.fontSize}
                  onChange={(e) => setDanmakuSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{danmakuSettings.fontSize}px</span>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">滚动速度</label>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="1"
                  value={danmakuSettings.speed}
                  onChange={(e) => setDanmakuSettings(prev => ({ ...prev, speed: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{danmakuSettings.speed}秒</span>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-3 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
            >
              关闭
            </button>
          </div>
        )}
      </div>}

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
          <div className="text-red-400 text-center p-4 max-w-md">
            <p className="text-lg mb-2">⚠️ 播放错误</p>
            <p className="text-sm mb-3">{error}</p>

            {src.includes('.mkv') && (
              <div className="bg-yellow-900/50 border border-yellow-600 rounded p-3 mb-3 text-yellow-200">
                <p className="text-xs font-medium mb-2">💡 解决方案：</p>
                <ul className="text-xs text-left space-y-1">
                  <li>• 使用最新版Chrome或Firefox浏览器</li>
                  <li>• 建议将MKV文件转换为MP4格式</li>
                  <li>• 使用VLC等专业播放器</li>
                </ul>
              </div>
            )}

            <p className="text-xs mt-2 text-gray-400 break-all">视频链接: {src}</p>
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
