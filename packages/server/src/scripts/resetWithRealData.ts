import { sequelize } from '../config/database';
import { Video } from '../models';

async function resetVideosWithRealData() {
  try {
    console.log('🧹 清理现有视频数据...');
    
    // 清空所有视频数据
    await Video.destroy({ where: {} });
    console.log('✅ 已清空所有旧的视频数据');

    console.log('📽️ 添加你的真实视频数据...');
    
    // 只添加你上传的真实视频
    const realVideo = await Video.create({
      title: 'Test Video',
      description: '这是从腾讯云COS存储桶获取的真实测试视频',
      videoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/test-vedio',
      thumbnail: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/test-image',
      duration: 120, // 你可以根据实际视频时长调整
      views: 0,
      category: 'test',
      tags: ['真实视频', '测试'],
      releaseDate: new Date(),
      quality: '1080p',
      isVip: false
    });

    console.log('✅ 真实视频添加成功!');
    console.log(`📹 视频标题: ${realVideo.title}`);
    console.log(`🔗 视频URL: ${realVideo.videoUrl}`);
    console.log(`🖼️ 缩略图URL: ${realVideo.thumbnail}`);

    // 验证最终结果
    const allVideos = await Video.findAll();
    console.log(`\n📊 数据库中现在共有 ${allVideos.length} 个视频:`);
    allVideos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title}`);
      console.log(`   URL: ${video.videoUrl}`);
    });

    console.log('\n🎉 数据重置完成！现在只有真实的视频数据了');

  } catch (error) {
    console.error('❌ 重置数据失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  resetVideosWithRealData()
    .then(() => {
      console.log('✨ 脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error);
      process.exit(1);
    });
}

export { resetVideosWithRealData };