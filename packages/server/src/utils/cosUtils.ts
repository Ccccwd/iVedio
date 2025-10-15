import { cos, cosConfig } from '../config/cos';

/**
 * 生成COS文件的签名URL
 * @param bucket 存储桶名称
 * @param key 文件路径
 * @param expires 过期时间(秒)，默认1小时
 * @returns 签名URL
 */
export function getSignedUrl(bucket: string, key: string, expires: number = 3600): string {
  try {
    const url = cos.getObjectUrl({
      Bucket: bucket,
      Region: cosConfig.region,
      Key: key,
      Sign: true,
      Expires: expires
    });
    
    return url;
  } catch (error) {
    console.error('生成签名URL失败:', error);
    throw error;
  }
}

/**
 * 为视频生成签名URL
 * @param videoKey 视频文件路径
 * @param expires 过期时间，默认4小时
 * @returns 签名URL
 */
export function getVideoSignedUrl(videoKey: string, expires: number = 14400): string {
  return getSignedUrl(cosConfig.videoBucket, videoKey, expires);
}

/**
 * 为图片生成签名URL
 * @param imageKey 图片文件路径
 * @param expires 过期时间，默认1小时
 * @returns 签名URL
 */
export function getImageSignedUrl(imageKey: string, expires: number = 3600): string {
  return getSignedUrl(cosConfig.imageBucket, imageKey, expires);
}

/**
 * 批量为视频对象生成签名URL
 * @param videos 视频对象数组
 * @returns 包含签名URL的视频对象数组
 */
export function addSignedUrlsToVideos(videos: any[]): any[] {
  return videos.map(video => {
    const videoData = video.toJSON ? video.toJSON() : video;
    
    return {
      ...videoData,
      videoUrl: videoData.videoUrl ? getVideoSignedUrl(videoData.videoUrl.split('/').pop()) : null,
      thumbnailUrl: videoData.thumbnailUrl ? getImageSignedUrl(videoData.thumbnailUrl.split('/').pop()) : null,
      posterUrl: videoData.posterUrl ? getImageSignedUrl(videoData.posterUrl.split('/').pop()) : null
    };
  });
}