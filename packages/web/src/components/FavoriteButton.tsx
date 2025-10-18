import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

interface FavoriteButtonProps {
  videoId: string
  userId?: number
  className?: string
  onFavoriteChange?: (isFavorited: boolean) => void
}

function FavoriteButton({ videoId, userId, className = '', onFavoriteChange }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  // 获取当前用户ID
  useEffect(() => {
    if (userId) {
      setCurrentUserId(userId)
    } else {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const user = JSON.parse(userData)
        setCurrentUserId(user.id)
      }
    }
  }, [userId])

  // 检查收藏状态
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!currentUserId) return

      try {
        const response = await fetch(`http://localhost:3001/api/favorites/check/${currentUserId}/${videoId}`)
        const result = await response.json()
        if (result.success) {
          setIsFavorited(result.data.isFavorited)
        }
      } catch (error) {
        console.error('检查收藏状态失败:', error)
      }
    }

    checkFavoriteStatus()
  }, [videoId, currentUserId])

  // 切换收藏状态
  const handleToggleFavorite = async () => {
    if (loading || !currentUserId) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          videoId: parseInt(videoId)
        })
      })

      const result = await response.json()
      console.log('收藏操作结果:', result)

      if (result.success) {
        const newFavoritedState = result.data.isFavorited
        console.log('更新收藏状态:', newFavoritedState)
        setIsFavorited(newFavoritedState)

        // 通知父组件或外部回调函数
        if (onFavoriteChange) {
          onFavoriteChange(newFavoritedState)
        }

        // 触发自定义事件，用于全局通知
        const event = new CustomEvent('favoriteChanged', {
          detail: { videoId: parseInt(videoId), isFavorited: newFavoritedState, timestamp: Date.now() }
        })
        console.log('发送favoriteChanged事件，数据:', { videoId: parseInt(videoId), isFavorited: newFavoritedState })
        window.dispatchEvent(event)
      } else {
        console.error('收藏操作失败:', result.message)
      }
    } catch (error) {
      console.error('收藏操作失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`flex flex-col items-center justify-center space-y-1 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 ${isFavorited
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        } ${className}`}
    >
      <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
      <span className="text-sm">
        {loading ? '处理中...' : isFavorited ? '已收藏' : '收藏'}
      </span>
    </button>
  )
}

export default FavoriteButton