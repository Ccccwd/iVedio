import { sequelize } from '../config/database';
import User from '../models/User';
import Video from '../models/Video';
import WatchHistory from '../models/WatchHistory';
import Favorite from '../models/Favorite';
import { initializeModels } from '../models';

// 数据库初始化函数
export async function initializeDatabase() {
  try {
    console.log(' 正在初始化数据库...');
    
    // 初始化模型关联关系
    initializeModels();
    console.log(' 模型关联初始化完成');
    
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
    console.log(` 当前数据库中有 ${videoCount} 个视频`);
    
    // 不再自动创建示例视频数据
    // 用户可以通过管理接口或脚本手动添加真实视频
    if (videoCount === 0) {
      console.log(' 数据库中没有视频数据，请使用脚本添加真实视频');
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