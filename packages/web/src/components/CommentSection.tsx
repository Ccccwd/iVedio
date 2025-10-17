import { MessageCircle, Reply, Send, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Comment {
  id: number
  content: string
  likes: number
  createdAt: string
  user: {
    id: number
    username: string
    avatar?: string
  }
  replies?: Comment[]
}

interface CommentSectionProps {
  videoId: string
  userId?: number
}

function CommentSection({ videoId, userId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'hot'>('latest')
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

  // 获取评论列表
  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/comments/video/${videoId}?sortBy=${sortBy}`)
      const result = await response.json()
      if (result.success) {
        setComments(result.data.comments)
      }
    } catch (error) {
      console.error('获取评论失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [videoId, sortBy])

  // 发布评论
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUserId) return

    try {
      const response = await fetch('http://localhost:3001/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          videoId: parseInt(videoId),
          content: newComment.trim()
        })
      })

      const result = await response.json()
      if (result.success) {
        setNewComment('')
        fetchComments() // 重新获取评论列表
      } else {
        alert('发布评论失败: ' + result.message)
      }
    } catch (error) {
      console.error('发布评论失败:', error)
      alert('发布评论失败')
    }
  }

  // 发布回复
  const handleSubmitReply = async (parentId: number) => {
    if (!replyText.trim() || !currentUserId) return

    try {
      const response = await fetch('http://localhost:3001/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          videoId: parseInt(videoId),
          content: replyText.trim(),
          parentId
        })
      })

      const result = await response.json()
      if (result.success) {
        setReplyText('')
        setReplyingTo(null)
        fetchComments() // 重新获取评论列表
      } else {
        alert('发布回复失败: ' + result.message)
      }
    } catch (error) {
      console.error('发布回复失败:', error)
      alert('发布回复失败')
    }
  }

  // 点赞评论
  const handleLikeComment = async (commentId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/comments/${commentId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const result = await response.json()
      if (result.success) {
        fetchComments() // 重新获取评论列表
      }
    } catch (error) {
      console.error('点赞失败:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return '刚刚'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* 评论区标题和排序 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          评论区 ({comments.length})
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">排序:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'latest' | 'hot')}
            className="bg-background-card text-white px-3 py-1 rounded-lg text-sm"
          >
            <option value="latest">最新</option>
            <option value="hot">最热</option>
          </select>
        </div>
      </div>

      {/* 发布评论 */}
      {currentUserId ? (
        <div className="bg-background-card p-4 rounded-lg">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            className="w-full bg-gray-700 text-white placeholder-gray-400 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-gray-400 text-sm">
              {newComment.length}/1000
            </span>
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              发布
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-background-card p-4 rounded-lg text-center">
          <p className="text-gray-400">请先登录后再发表评论</p>
        </div>
      )}      {/* 评论列表 */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">加载中...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">还没有评论，快来抢沙发吧！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-background-card p-4 rounded-lg">
              {/* 评论主体 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {comment.user.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-white">{comment.user.username}</span>
                    <span className="text-gray-400 text-sm">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 mb-3">{comment.content}</p>

                  {/* 评论操作 */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                      <span>回复</span>
                    </button>
                  </div>

                  {/* 回复表单 */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`回复 @${comment.user.username}...`}
                        className="w-full bg-gray-700 text-white placeholder-gray-400 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        maxLength={1000}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyText.trim()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                        >
                          发布回复
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 回复列表 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3 border-l-2 border-gray-600 pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {reply.user.username[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white text-sm">{reply.user.username}</span>
                              <span className="text-gray-400 text-xs">{formatTimeAgo(reply.createdAt)}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{reply.content}</p>
                            <button
                              onClick={() => handleLikeComment(reply.id)}
                              className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors mt-2"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span className="text-xs">{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection