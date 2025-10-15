import { sequelize } from '../config/database';
import { Video } from '../models';

async function addRealVideos() {
  try {
    console.log('🎬 添加真实视频数据...');

    // 添加你上传的测试视频 - 使用真实文件名
    const testVideo = await Video.create({
      title: 'Test Video From COS',
      description: '这是直接从腾讯云COS存储桶获取的测试视频',
      videoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/test-vedio', // 你的真实文件名
      thumbnail: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/test-image', // 你的真实文件名
      duration: 120, 
      views: 0,
      category: 'test',
      tags: ['腾讯云COS', '真实数据'],
      releaseDate: new Date(),
      quality: '1080p',
      isVip: false
    });

    console.log('✅ 测试视频添加成功:', testVideo.title);
    console.log('📹 视频URL:', testVideo.videoUrl);
    console.log('🖼️ 缩略图URL:', testVideo.thumbnail);

    // 查询所有视频验证
    const allVideos = await Video.findAll();
    console.log(`\n📊 数据库中共有 ${allVideos.length} 个视频:`);
    allVideos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title} - ${video.videoUrl}`);
    });

  } catch (error) {
    console.error('❌ 添加视频失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  addRealVideos()
    .then(() => {
      console.log('✨ 视频数据添加完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error);
      process.exit(1);
    });
}

export { addRealVideos };