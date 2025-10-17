import { sequelize } from '../config/database';
import { Comment, Danmaku, Favorite } from '../models';

async function createNewTables() {
  try {
    console.log('开始创建新表...');

    // 强制同步新表
    await Comment.sync({ force: false });
    console.log('✅ Comment 表创建成功');

    await Danmaku.sync({ force: false });
    console.log('✅ Danmaku 表创建成功');

    // 确保 Favorite 表存在
    await Favorite.sync({ force: false });
    console.log('✅ Favorite 表检查完成');

    console.log('🎉 所有表创建完成！');

    // 检查表结构
    const [commentResults] = await sequelize.query("PRAGMA table_info(comments);");
    console.log('Comment 表结构:', commentResults);

    const [danmakuResults] = await sequelize.query("PRAGMA table_info(danmakus);");
    console.log('Danmaku 表结构:', danmakuResults);

    const [favoriteResults] = await sequelize.query("PRAGMA table_info(favorites);");
    console.log('Favorite 表结构:', favoriteResults);

  } catch (error) {
    console.error('创建表失败:', error);
  } finally {
    await sequelize.close();
  }
}

// 直接运行
createNewTables();