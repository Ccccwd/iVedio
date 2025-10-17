import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import { initializeModels } from './models';
import { initializeDatabase, checkDatabaseHealth } from './config/init';
import authRoutes from './routes/auth';
import videoRoutes from './routes/video';
import userRoutes from './routes/user';
import commentRoutes from './routes/comment';
import danmakuRoutes from './routes/danmaku';
import favoriteRoutes from './routes/favorite';
import { errorHandler } from './middleware/errorHandler';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/danmakus', danmakuRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/danmakus', danmakuRoutes);
app.use('/api/favorites', favoriteRoutes);

// 健康检查
app.get('/health', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'iVedio API Server',
    database: dbHealth,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 错误处理中间件
app.use(errorHandler);

// 数据库连接和启动服务器
async function startServer() {
  try {
    console.log('🚀 启动 iVedio API 服务器...');
    
    // 初始化模型
    initializeModels();
    
    // 初始化数据库（包含连接测试、表创建、默认数据）
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🎉 iVedio API 服务器已启动！`);
      console.log(`📱 服务地址: http://localhost:${PORT}`);
      console.log(`� 健康检查: http://localhost:${PORT}/health`);
      console.log(`🗃️  数据库类型: ${process.env.DB_TYPE || 'mysql'}`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

startServer();

export default app;