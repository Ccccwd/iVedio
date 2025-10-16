import { Video } from '../models';

async function updateVideoFormat() {
  try {
    console.log('🔄 更新视频格式...');

    // 查找千与千寻视频
    const spiritedAway = await Video.findOne({
      where: { title: '千与千寻' }
    });

    if (spiritedAway) {
      // 更新为MP4格式（建议用户将MKV转换为MP4并重新上传）
      await spiritedAway.update({
        videoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun.mp4'
      });

      console.log('✅ 视频格式已更新为MP4:', spiritedAway.videoUrl);
      console.log('📝 注意：请确保在COS中上传对应的MP4文件');
    } else {
      console.log('❌ 未找到千与千寻视频');
    }

    // 查询所有视频验证
    const allVideos = await Video.findAll();
    console.log(`\n📊 数据库中共有 ${allVideos.length} 个视频:`);
    allVideos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title} - ${video.videoUrl}`);
    });

  } catch (error) {
    console.error('❌ 更新失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  updateVideoFormat()
    .then(() => {
      console.log('✨ 视频格式更新完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error);
      process.exit(1);
    });
}

export { updateVideoFormat };
