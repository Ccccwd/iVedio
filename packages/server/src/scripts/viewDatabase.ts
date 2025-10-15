import { sequelize } from '../config/database';
import { Video, User, WatchHistory, Favorite } from '../models';

async function viewDatabaseData() {
  try {
    console.log(' iVedio 数据库数据查看工具');
    console.log('================================\n');

    // 数据库连接状态
    await sequelize.authenticate();
    console.log(' 数据库连接正常\n');

    // 1. 查看所有视频
    console.log(' 视频数据:');
    const videos = await Video.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    if (videos.length === 0) {
      console.log('    没有视频数据');
    } else {
      videos.forEach((video, index) => {
        console.log(`   ${index + 1}. ID: ${video.id} | 标题: ${video.title}`);
        console.log(`      视频URL: ${video.videoUrl}`);
        console.log(`      缩略图: ${video.thumbnail}`);
        console.log(`      分类: ${video.category} | 时长: ${video.duration}秒`);
        console.log(`      观看: ${video.views}次 | VIP: ${video.isVip ? '是' : '否'}`);
        console.log('');
      });
    }

    // 2. 查看用户数据
    console.log(' 用户数据:');
    const users = await User.findAll();
    
    if (users.length === 0) {
      console.log('    没有用户数据');
    } else {
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ID: ${user.id} | 用户名: ${user.username} | 邮箱: ${user.email}`);
      });
    }
    console.log('');

    // 3. 查看观看历史
    console.log(' 观看历史:');
    const watchHistory = await WatchHistory.findAll();
    
    if (watchHistory.length === 0) {
      console.log('    没有观看历史');
    } else {
      watchHistory.forEach((history, index) => {
        console.log(`   ${index + 1}. 用户ID: ${history.userId} | 视频ID: ${history.videoId}`);
        console.log(`        进度: ${history.progress}s / ${history.duration}s | 完成: ${history.completed ? '是' : '否'}`);
      });
    }
    console.log('');

    // 4. 查看收藏
    console.log(' 收藏数据:');
    const favorites = await Favorite.findAll();
    
    if (favorites.length === 0) {
      console.log('    没有收藏数据');
    } else {
      favorites.forEach((favorite, index) => {
        console.log(`   ${index + 1}. 用户ID: ${favorite.userId} | 视频ID: ${favorite.videoId}`);
      });
    }
    console.log('');

    // 5. 统计信息
    console.log(' 统计信息:');
    console.log(`    总视频数: ${videos.length}`);
    console.log(`    总用户数: ${users.length}`);
    console.log(`    观看记录: ${watchHistory.length}`);
    console.log(`    收藏数量: ${favorites.length}`);

  } catch (error) {
    console.error(' 查看数据失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  viewDatabaseData()
    .then(() => {
      console.log('\n 数据查看完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error(' 脚本执行失败:', error);
      process.exit(1);
    });
}

export { viewDatabaseData };