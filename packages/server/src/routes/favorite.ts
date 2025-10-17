import { Router } from 'express';
import { Favorite, Video, User } from '../models';

const router = Router();

// 获取用户收藏列表
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const favorites = await Favorite.findAndCountAll({
      where: {
        userId: Number(userId)
      },
      include: [
        {
          model: Video,
          as: 'video',
          attributes: [
            'id', 'title', 'description', 'thumbnail', 'posterUrl', 
            'videoUrl', 'previewVideoUrl', 'duration', 'views', 
            'category', 'tags', 'uploadDate', 'releaseDate', 
            'director', 'actors', 'rating', 'quality', 'isVip'
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
      distinct: true
    });

    res.json({
      success: true,
      data: {
        favorites: favorites.rows,
        total: favorites.count,
        page: Number(page),
        totalPages: Math.ceil(favorites.count / Number(limit))
      }
    });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取收藏列表失败'
    });
  }
});

// 添加/取消收藏
router.post('/toggle', async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    if (!userId || !videoId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    // 检查是否已收藏
    const existingFavorite = await Favorite.findOne({
      where: {
        userId: Number(userId),
        videoId: Number(videoId)
      }
    });

    if (existingFavorite) {
      // 取消收藏
      await existingFavorite.destroy();
      res.json({
        success: true,
        data: { isFavorited: false },
        message: '取消收藏成功'
      });
    } else {
      // 添加收藏
      await Favorite.create({
        userId: Number(userId),
        videoId: Number(videoId)
      });
      res.json({
        success: true,
        data: { isFavorited: true },
        message: '收藏成功'
      });
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    res.status(500).json({
      success: false,
      message: '收藏操作失败'
    });
  }
});

// 检查是否已收藏
router.get('/check/:userId/:videoId', async (req, res) => {
  try {
    const { userId, videoId } = req.params;

    const favorite = await Favorite.findOne({
      where: {
        userId: Number(userId),
        videoId: Number(videoId)
      }
    });

    res.json({
      success: true,
      data: { isFavorited: !!favorite }
    });
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    res.status(500).json({
      success: false,
      message: '检查收藏状态失败'
    });
  }
});

// 批量删除收藏
router.delete('/batch', async (req, res) => {
  try {
    const { userId, videoIds } = req.body;

    if (!userId || !videoIds || !Array.isArray(videoIds)) {
      return res.status(400).json({
        success: false,
        message: '参数错误'
      });
    }

    await Favorite.destroy({
      where: {
        userId: Number(userId),
        videoId: videoIds.map(id => Number(id))
      }
    });

    res.json({
      success: true,
      message: '批量删除成功'
    });
  } catch (error) {
    console.error('批量删除收藏失败:', error);
    res.status(500).json({
      success: false,
      message: '批量删除收藏失败'
    });
  }
});

// 获取收藏统计
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const total = await Favorite.count({
      where: {
        userId: Number(userId)
      }
    });

    // 按分类统计
    const categoryStats = await Favorite.findAll({
      where: {
        userId: Number(userId)
      },
      include: [
        {
          model: Video,
          as: 'video',
          attributes: ['category']
        }
      ],
      attributes: [],
      group: ['video.category'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        total,
        categoryStats
      }
    });
  } catch (error) {
    console.error('获取收藏统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取收藏统计失败'
    });
  }
});

export default router;