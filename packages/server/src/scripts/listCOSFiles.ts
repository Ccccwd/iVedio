import { cos, cosConfig } from '../config/cos';

async function listCOSFiles() {
  try {
    console.log('=== COS 存储桶文件列表 ===');
    console.log(`视频存储桶: ${cosConfig.videoBucket}`);
    console.log(`图片存储桶: ${cosConfig.imageBucket}`);
    console.log(`区域: ${cosConfig.region}`);
    console.log('');

    // 列出视频存储桶文件
    console.log('📹 视频存储桶文件:');
    try {
      const videoResult = await cos.getBucket({
        Bucket: cosConfig.videoBucket,
        Region: cosConfig.region,
        MaxKeys: 100
      });

      if (videoResult.Contents && videoResult.Contents.length > 0) {
        videoResult.Contents.forEach((item, index) => {
          console.log(`${index + 1}. ${item.Key} (大小: ${(parseInt(item.Size) / 1024 / 1024).toFixed(2)}MB)`);
        });
      } else {
        console.log('   视频存储桶为空');
      }
    } catch (error: any) {
      console.error('   获取视频存储桶失败:', error.message);
    }

    console.log('');

    // 列出图片存储桶文件
    console.log('🖼️  图片存储桶文件:');
    try {
      const imageResult = await cos.getBucket({
        Bucket: cosConfig.imageBucket,
        Region: cosConfig.region,
        MaxKeys: 100
      });

      if (imageResult.Contents && imageResult.Contents.length > 0) {
        imageResult.Contents.forEach((item, index) => {
          console.log(`${index + 1}. ${item.Key} (大小: ${(parseInt(item.Size) / 1024).toFixed(2)}KB)`);
        });
      } else {
        console.log('   图片存储桶为空');
      }
    } catch (error: any) {
      console.error('   获取图片存储桶失败:', error.message);
    }

  } catch (error) {
    console.error('COS 操作失败:', error);
  }
}

// 执行列表查看
listCOSFiles().then(() => {
  console.log('\n=== 文件列表查看完成 ===');
});