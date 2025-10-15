import { Video } from '../models';
import { cosConfig } from '../config/cos';

async function fixVideoUrls() {
  try {
    console.log('=== 修复视频URL ===');
    
    // 获取所有视频
    const videos = await Video.findAll();
    
    for (const video of videos) {
      console.log(`处理视频: ${video.title} (ID: ${video.id})`);
      console.log(`当前视频URL: ${video.videoUrl}`);
      console.log(`当前缩略图URL: ${video.thumbnail}`);
      
      // 修复视频URL - 添加.mp4扩展名
      const newVideoUrl = `https://${cosConfig.videoBucket}.cos.${cosConfig.region}.myqcloud.com/test-vedio.mp4`;
      const newThumbnailUrl = `https://${cosConfig.imageBucket}.cos.${cosConfig.region}.myqcloud.com/test-image.jpg`;
      
      await video.update({
        videoUrl: newVideoUrl,
        thumbnail: newThumbnailUrl
      });
      
      console.log(`✅ 已更新:`);
      console.log(`   新视频URL: ${newVideoUrl}`);
      console.log(`   新缩略图URL: ${newThumbnailUrl}`);
      console.log('');
    }
    
    console.log('=== URL修复完成 ===');
    
  } catch (error) {
    console.error('修复URL失败:', error);
  }
}

// 执行修复
fixVideoUrls();