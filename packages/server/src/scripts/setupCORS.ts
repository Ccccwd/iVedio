import { cos, cosConfig } from '../config/cos';

async function setupCORS() {
  try {
    console.log('=== 配置COS存储桶CORS ===');

    const corsRules = [
      {
        ID: 'iVedioWebCORS',
        AllowedOrigin: ['*'], // 允许所有域名，生产环境建议限制为具体域名
        AllowedMethod: ['GET', 'HEAD'],
        AllowedHeader: ['*'],
        MaxAgeSeconds: 3600,
        ExposeHeader: ['Content-Length', 'Content-Range', 'Content-Type']
      }
    ];

    // 为视频存储桶设置CORS
    console.log(`设置视频存储桶CORS: ${cosConfig.videoBucket}`);
    await cos.putBucketCors({
      Bucket: cosConfig.videoBucket,
      Region: cosConfig.region,
      CORSRules: corsRules
    });
    console.log('✅ 视频存储桶CORS配置成功');

    // 为图片存储桶设置CORS
    console.log(`设置图片存储桶CORS: ${cosConfig.imageBucket}`);
    await cos.putBucketCors({
      Bucket: cosConfig.imageBucket,
      Region: cosConfig.region,
      CORSRules: corsRules
    });
    console.log('✅ 图片存储桶CORS配置成功');

    console.log('\n=== CORS配置完成 ===');
    console.log('现在视频应该可以在网页中正常播放了！');

  } catch (error: any) {
    console.error('CORS配置失败:', error.message);
    console.error('错误详情:', error);
  }
}

setupCORS();