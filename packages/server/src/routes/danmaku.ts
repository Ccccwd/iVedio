import { Router } from 'express';
import { Danmaku, User } from '../models';

const router = Router();

// 获取视频弹幕
router.get('/video/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { startTime = 0, endTime } = req.query;

    const whereClause: any = {
      videoId: Number(videoId)
    };

    // 如果提供了时间范围，则筛选该时间段的弹幕
    if (endTime) {
      whereClause.time = {
        $gte: Number(startTime),
        $lte: Number(endTime)
      };
    }

    const danmakus = await Danmaku.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ],
      order: [['time', 'ASC']]
    });

    res.json({
      success: true,
      data: danmakus
    });
  } catch (error) {
    console.error('获取弹幕失败:', error);
    res.status(500).json({
      success: false,
      message: '获取弹幕失败'
    });
  }
});

// 发送弹幕
router.post('/', async (req, res) => {
  try {
    const { userId, videoId, content, time, color = '#FFFFFF', type = 'scroll', fontSize = 14 } = req.body;

    if (!userId || !videoId || !content || time === undefined) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    if (content.length > 100) {
      return res.status(400).json({
        success: false,
        message: '弹幕内容不能超过100字符'
      });
    }

    if (time < 0) {
      return res.status(400).json({
        success: false,
        message: '时间不能为负数'
      });
    }

    const danmaku = await Danmaku.create({
      userId: Number(userId),
      videoId: Number(videoId),
      content: content.trim(),
      time: Number(time),
      color,
      type,
      fontSize: Number(fontSize)
    });

    // 获取完整的弹幕信息（包含用户信息）
    const danmakuWithUser = await Danmaku.findByPk(danmaku.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });

    res.json({
      success: true,
      data: danmakuWithUser,
      message: '弹幕发送成功'
    });
  } catch (error) {
    console.error('发送弹幕失败:', error);
    res.status(500).json({
      success: false,
      message: '发送弹幕失败'
    });
  }
});

// 删除弹幕（管理员功能）
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // 在实际项目中应该从JWT token中获取

    const danmaku = await Danmaku.findByPk(id);
    if (!danmaku) {
      return res.status(404).json({
        success: false,
        message: '弹幕不存在'
      });
    }

    // 检查是否是弹幕作者（在实际项目中应该有更严格的权限验证）
    if (danmaku.userId !== Number(userId)) {
      return res.status(403).json({
        success: false,
        message: '只能删除自己的弹幕'
      });
    }

    await danmaku.destroy();

    res.json({
      success: true,
      message: '弹幕删除成功'
    });
  } catch (error) {
    console.error('删除弹幕失败:', error);
    res.status(500).json({
      success: false,
      message: '删除弹幕失败'
    });
  }
});

// 获取用户弹幕统计
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Danmaku.findAndCountAll({
      where: {
        userId: Number(userId)
      }
    });

    res.json({
      success: true,
      data: {
        total: stats.count,
        danmakus: stats.rows
      }
    });
  } catch (error) {
    console.error('获取弹幕统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取弹幕统计失败'
    });
  }
});

export default router;