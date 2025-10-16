import { Video } from '../models';

async function updatePreviewVideo() {
  try {
    console.log('🎬 更新千与千寻预览视频...');

    // 查找千与千寻视频
    const spiritedAway = await Video.findOne({
      where: { title: '千与千寻' }
    });

    if (spiritedAway) {
      // 更新预览视频URL
      await spiritedAway.update({
        previewVideoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun-preview.mp4',
        posterUrl: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun.jpg' // 使用现有缩略图作为海报
      });

      console.log('✅ 预览视频URL已更新:', spiritedAway.previewVideoUrl);
      console.log('✅ 海报URL已更新:', spiritedAway.posterUrl);
      
      // 显示更新后的视频信息
      console.log('\n📹 视频信息:');
      console.log(`标题: ${spiritedAway.title}`);
      console.log(`完整视频: ${spiritedAway.videoUrl}`);
      console.log(`预览视频: ${spiritedAway.previewVideoUrl}`);
      console.log(`缩略图: ${spiritedAway.thumbnail}`);
      console.log(`海报: ${spiritedAway.posterUrl}`);
    } else {
      console.log('❌ 未找到千与千寻视频');
    }

  } catch (error) {
    console.error('❌ 更新失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  updatePreviewVideo()
    .then(() => {
      console.log('✨ 预览视频更新完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error);
      process.exit(1);
    });
}

export { updatePreviewVideo };