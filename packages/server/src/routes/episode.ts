import { Router } from 'express'
import Episode from '../models/Episode'

const router = Router()

// 获取视频的所有剧集
router.get('/video/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params

    const episodes = await Episode.findAll({
      where: { videoId },
      order: [['episodeNumber', 'ASC']]
    })

    res.json({
      success: true,
      data: episodes
    })
  } catch (error) {
    console.error('获取剧集列表失败:', error)
    res.status(500).json({
      success: false,
      message: '获取剧集列表失败'
    })
  }
})

// 获取单个剧集详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const episode = await Episode.findByPk(id)

    if (!episode) {
      return res.status(404).json({
        success: false,
        message: '剧集不存在'
      })
    }

    res.json({
      success: true,
      data: episode
    })
  } catch (error) {
    console.error('获取剧集详情失败:', error)
    res.status(500).json({
      success: false,
      message: '获取剧集详情失败'
    })
  }
})

export default router
