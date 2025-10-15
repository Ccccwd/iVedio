import { Router } from 'express';
import { User, WatchHistory, Favorite, Video } from '../models';

const router = Router();

// 获取用户信息
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
});

// 获取用户观看历史
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);

    const { rows: history, count } = await WatchHistory.findAndCountAll({
      where: { userId: Number(userId) },
      include: [{
        model: Video,
        as: 'video',
        attributes: ['id', 'title', 'thumbnail', 'duration', 'category']
      }],
      order: [['watchedAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        history,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalItems: count,
          itemsPerPage: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('获取观看历史失败:', error);
    res.status(500).json({
      success: false,
      message: '获取观看历史失败'
    });
  }
});

// 获取用户收藏列表
router.get('/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);

    const { rows: favorites, count } = await Favorite.findAndCountAll({
      where: { userId: Number(userId) },
      include: [{
        model: Video,
        as: 'video'
      }],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        favorites,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalItems: count,
          itemsPerPage: Number(limit)
        }
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

// 添加收藏
router.post('/favorites', async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    // 检查是否已收藏
    const existingFavorite = await Favorite.findOne({
      where: { userId, videoId }
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: '已经收藏过此视频'
      });
    }

    // 添加收藏
    const favorite = await Favorite.create({
      userId,
      videoId
    });

    res.status(201).json({
      success: true,
      message: '收藏成功',
      data: favorite
    });
  } catch (error) {
    console.error('收藏失败:', error);
    res.status(500).json({
      success: false,
      message: '收藏失败'
    });
  }
});

// 取消收藏
router.delete('/favorites', async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    const result = await Favorite.destroy({
      where: { userId, videoId }
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: '收藏记录不存在'
      });
    }

    res.json({
      success: true,
      message: '取消收藏成功'
    });
  } catch (error) {
    console.error('取消收藏失败:', error);
    res.status(500).json({
      success: false,
      message: '取消收藏失败'
    });
  }
});

// 检查视频是否已收藏
router.get('/favorites/check/:userId/:videoId', async (req, res) => {
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
      data: {
        isFavorited: !!favorite
      }
    });
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    res.status(500).json({
      success: false,
      message: '检查收藏状态失败'
    });
  }
});

export default router;