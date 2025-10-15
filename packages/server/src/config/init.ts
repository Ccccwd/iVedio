import { sequelize } from '../config/database';
import User from '../models/User';
import Video from '../models/Video';
import WatchHistory from '../models/WatchHistory';
import Favorite from '../models/Favorite';

// 数据库初始化函数
export async function initializeDatabase() {
  try {
    console.log(' 正在初始化数据库...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    console.log(' 数据库连接成功');
    
    // 同步所有模型到数据库（创建表）
    await sequelize.sync({ force: false });
    console.log(' 数据库表同步完成');
    
    // 检查是否需要创建默认数据
    await createDefaultData();
    
    console.log(' 数据库初始化完成！');
  } catch (error) {
    console.error(' 数据库初始化失败:', error);
    throw error;
  }
}

// 创建默认数据
async function createDefaultData() {
  try {
    // 检查是否已有用户数据
    const userCount = await User.count();
    if (userCount === 0) {
      console.log(' 创建默认管理员用户...');
      await User.create({
        username: 'admin',
        email: 'admin@ivedio.com',
        password: 'admin123', // 实际应用中应该加密
      });
      console.log(' 默认管理员用户创建完成');
    }
    
    // 检查是否已有视频数据
    const videoCount = await Video.count();
    if (videoCount === 0) {
      console.log(' 创建默认视频数据...');
      const defaultVideos = [
        {
          title: 'iVedio 平台介绍',
          description: '欢迎来到iVedio视频平台！这是一个基于React和Node.js构建的现代化视频播放平台。',
          thumbnail: '/placeholder.svg',
          videoUrl: 'https://example.com/sample1.mp4',
          duration: 300,
          views: 1000,
          releaseDate: new Date(),
          category: '平台介绍',
          tags: ['介绍', '平台', 'React', 'Node.js'],
          quality: 'HD',
          isVip: false
        },
        {
          title: '技术栈展示',
          description: '了解iVedio使用的技术栈：React、TypeScript、Tailwind CSS、Node.js、Express等。',
          thumbnail: '/placeholder.svg',
          videoUrl: 'https://example.com/sample2.mp4',
          duration: 450,
          views: 750,
          releaseDate: new Date(),
          category: '技术',
          tags: ['技术', 'React', 'TypeScript', 'Tailwind'],
          quality: 'FHD',
          isVip: false
        },
        {
          title: '功能演示',
          description: '展示iVedio的核心功能：视频播放、用户管理、观看历史、收藏等。',
          thumbnail: '/placeholder.svg',
          videoUrl: 'https://example.com/sample3.mp4',
          duration: 600,
          views: 1200,
          releaseDate: new Date(),
          category: '演示',
          tags: ['功能', '演示', '播放器', '用户'],
          quality: '4K',
          isVip: true
        }
      ];
      
      await Video.bulkCreate(defaultVideos);
      console.log(' 默认视频数据创建完成');
    }
  } catch (error) {
    console.error(' 创建默认数据失败:', error);
  }
}

// 数据库健康检查
export async function checkDatabaseHealth() {
  try {
    await sequelize.authenticate();
    const userCount = await User.count();
    const videoCount = await Video.count();
    
    return {
      status: 'healthy',
      connection: true,
      users: userCount,
      videos: videoCount,
      database: process.env.DB_TYPE || 'mysql'
    };
  } catch (error) {
    return {
      status: 'error',
      connection: false,
      error: error instanceof Error ? error.message : String(error),
      database: process.env.DB_TYPE || 'mysql'
    };
  }
}