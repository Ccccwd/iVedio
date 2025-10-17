import { Router } from 'express';
import { Comment, User } from '../models';
import { Op } from 'sequelize';

const router = Router();

// 获取视频评论
router.get('/video/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { page = 1, limit = 20, sortBy = 'latest' } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    // 根据排序方式设置排序规则
    let order: any[];
    switch (sortBy) {
      case 'latest':
        order = [['createdAt', 'DESC']];
        break;
      case 'oldest':
        order = [['createdAt', 'ASC']];
        break;
      case 'hot':
        order = [['likes', 'DESC'], ['createdAt', 'DESC']];
        break;
      default:
        order = [['createdAt', 'DESC']];
    }

    const comments = await Comment.findAndCountAll({
      where: {
        videoId: Number(videoId),
        parentId: null // 只获取主评论，不包括回复
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'avatar']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ],
      order,
      limit: Number(limit),
      offset,
      distinct: true
    });

    res.json({
      success: true,
      data: {
        comments: comments.rows,
        total: comments.count,
        page: Number(page),
        totalPages: Math.ceil(comments.count / Number(limit))
      }
    });
  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({
      success: false,
      message: '获取评论失败'
    });
  }
});

// 发布评论
router.post('/', async (req, res) => {
  try {
    const { userId, videoId, content, parentId } = req.body;

    if (!userId || !videoId || !content) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: '评论内容不能超过1000字符'
      });
    }

    const comment = await Comment.create({
      userId: Number(userId),
      videoId: Number(videoId),
      content: content.trim(),
      parentId: parentId ? Number(parentId) : null
    });

    // 获取完整的评论信息（包含用户信息）
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    res.json({
      success: true,
      data: commentWithUser,
      message: '评论发布成功'
    });
  } catch (error) {
    console.error('发布评论失败:', error);
    res.status(500).json({
      success: false,
      message: '发布评论失败'
    });
  }
});

// 点赞评论
router.put('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    comment.likes += 1;
    await comment.save();

    res.json({
      success: true,
      data: { likes: comment.likes },
      message: '点赞成功'
    });
  } catch (error) {
    console.error('点赞失败:', error);
    res.status(500).json({
      success: false,
      message: '点赞失败'
    });
  }
});

// 删除评论
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // 在实际项目中应该从JWT token中获取

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    // 检查是否是评论作者（在实际项目中应该有更严格的权限验证）
    if (comment.userId !== Number(userId)) {
      return res.status(403).json({
        success: false,
        message: '只能删除自己的评论'
      });
    }

    // 删除评论及其所有回复
    await Comment.destroy({
      where: {
        [Op.or]: [
          { id: Number(id) },
          { parentId: Number(id) }
        ]
      }
    });

    res.json({
      success: true,
      message: '评论删除成功'
    });
  } catch (error) {
    console.error('删除评论失败:', error);
    res.status(500).json({
      success: false,
      message: '删除评论失败'
    });
  }
});

export default router;