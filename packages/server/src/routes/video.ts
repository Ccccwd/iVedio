import { Router } from 'express';
import { Video, WatchHistory, Favorite } from '../models';

const router = Router();

// 获取所有视频（支持分页和筛选）
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      quality, 
      isVip, 
      search 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = {};

    // 筛选条件
    if (category && category !== '全部') {
      whereClause.category = category;
    }
    if (quality) {
      whereClause.quality = quality;
    }
    if (isVip !== undefined) {
      whereClause.isVip = isVip === 'true';
    }
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { director: { [Op.like]: `%${search}%` } }
      ];
    }

    const { rows: videos, count } = await Video.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    res.json({
      success: true,
      data: {
        videos,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalItems: count,
          itemsPerPage: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('获取视频列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取视频列表失败'
    });
  }
});

// 获取推荐视频
router.get('/recommended', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // 简单的推荐算法：基于观看次数和评分
    const videos = await Video.findAll({
      order: [
        ['views', 'DESC'],
        ['rating', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: Number(limit),
    });

    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('获取推荐视频失败:', error);
    res.status(500).json({
      success: false,
      message: '获取推荐视频失败'
    });
  }
});

// 获取分类列表
router.get('/categories', async (req, res) => {
  try {
    const categories = await Video.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    const categoryList = categories.map(item => item.category);

    res.json({
      success: true,
      data: ['全部', ...categoryList]
    });
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类失败'
    });
  }
});

// 获取单个视频详情
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: '视频不存在'
      });
    }

    // 增加播放次数
    await video.update({ views: video.views + 1 });

    res.json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('获取视频失败:', error);
    res.status(500).json({
      success: false,
      message: '获取视频失败'
    });
  }
});

// 记录观看进度
router.post('/:id/progress', async (req, res) => {
  try {
    const { userId, progress, duration } = req.body;
    const videoId = req.params.id;

    // 计算是否看完（观看进度超过90%视为看完）
    const completed = (progress / duration) >= 0.9;

    // 更新或创建观看记录
    await WatchHistory.upsert({
      userId,
      videoId: Number(videoId),
      progress,
      duration,
      completed,
      watchedAt: new Date()
    });

    res.json({
      success: true,
      message: '观看进度已保存'
    });
  } catch (error) {
    console.error('保存观看进度失败:', error);
    res.status(500).json({
      success: false,
      message: '保存观看进度失败'
    });
  }
});

// 获取用户观看进度
router.get('/:id/progress/:userId', async (req, res) => {
  try {
    const { id: videoId, userId } = req.params;

    const watchHistory = await WatchHistory.findOne({
      where: {
        userId: Number(userId),
        videoId: Number(videoId)
      }
    });

    res.json({
      success: true,
      data: watchHistory || { progress: 0, completed: false }
    });
  } catch (error) {
    console.error('获取观看进度失败:', error);
    res.status(500).json({
      success: false,
      message: '获取观看进度失败'
    });
  }
});

export default router;