import { cos, cosConfig } from '../config/cos';
import path from 'path';

export class FileManager {
  
  /**
   * 生成视频文件的存储路径
   * @param videoId 视频ID
   * @param category 视频分类 (movies, tv-series, documentaries)
   * @param quality 视频清晰度 (720p, 1080p, 4k)
   * @param year 年份 (可选)
   */
  static generateVideoPath(videoId: number, category: string, quality: string, year?: number): string {
    const yearPath = year || new Date().getFullYear();
    return `videos/${category}/${yearPath}/video_${videoId}_${quality}.mp4`;
  }

  /**
   * 生成缩略图的存储路径
   * @param videoId 视频ID
   * @param category 视频分类
   * @param type 图片类型 (thumb, poster)
   */
  static generateImagePath(videoId: number, category: string, type: 'thumb' | 'poster' = 'thumb'): string {
    return `${type}s/${category}/video_${videoId}_${type}.jpg`;
  }

  /**
   * 生成用户头像的存储路径
   * @param userId 用户ID
   */
  static generateAvatarPath(userId: number): string {
    return `avatars/user_${userId}_avatar.jpg`;
  }

  /**
   * 生成视频的完整访问URL
   * @param key COS中的文件路径
   * @param useCDN 是否使用CDN
   */
  static generateVideoUrl(key: string, useCDN: boolean = false): string {
    if (useCDN && cosConfig.cdnDomain) {
      return `https://${cosConfig.cdnDomain}/${key}`;
    }
    return `https://${cosConfig.videoBucket}.cos.${cosConfig.region}.myqcloud.com/${key}`;
  }

  /**
   * 生成图片的完整访问URL
   * @param key COS中的文件路径
   * @param useCDN 是否使用CDN
   */
  static generateImageUrl(key: string, useCDN: boolean = false): string {
    if (useCDN && cosConfig.cdnDomain) {
      return `https://${cosConfig.cdnDomain}/${key}`;
    }
    return `https://${cosConfig.imageBucket}.cos.${cosConfig.region}.myqcloud.com/${key}`;
  }

  /**
   * 上传视频文件到COS
   * @param localFilePath 本地文件路径
   * @param videoId 视频ID
   * @param category 分类
   * @param quality 清晰度
   */
  static async uploadVideo(
    localFilePath: string, 
    videoId: number, 
    category: string, 
    quality: string
  ): Promise<string> {
    const key = this.generateVideoPath(videoId, category, quality);
    
    const result = await cos.putObject({
      Bucket: cosConfig.videoBucket,
      Region: cosConfig.region,
      Key: key,
      Body: require('fs').createReadStream(localFilePath),
      ContentType: 'video/mp4'
    });

    return this.generateVideoUrl(key);
  }

  /**
   * 上传图片文件到COS
   * @param localFilePath 本地文件路径
   * @param videoId 视频ID
   * @param category 分类
   * @param type 图片类型
   */
  static async uploadImage(
    localFilePath: string, 
    videoId: number, 
    category: string, 
    type: 'thumb' | 'poster' = 'thumb'
  ): Promise<string> {
    const key = this.generateImagePath(videoId, category, type);
    
    const result = await cos.putObject({
      Bucket: cosConfig.imageBucket,
      Region: cosConfig.region,
      Key: key,
      Body: require('fs').createReadStream(localFilePath),
      ContentType: 'image/jpeg'
    });

    return this.generateImageUrl(key);
  }

  /**
   * 删除视频文件
   * @param videoUrl 视频URL
   */
  static async deleteVideo(videoUrl: string): Promise<void> {
    const key = this.extractKeyFromUrl(videoUrl);
    await cos.deleteObject({
      Bucket: cosConfig.videoBucket,
      Region: cosConfig.region,
      Key: key
    });
  }

  /**
   * 删除图片文件
   * @param imageUrl 图片URL
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    const key = this.extractKeyFromUrl(imageUrl);
    await cos.deleteObject({
      Bucket: cosConfig.imageBucket,
      Region: cosConfig.region,
      Key: key
    });
  }

  /**
   * 从URL中提取COS Key
   * @param url 完整的COS URL
   */
  private static extractKeyFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts.slice(3).join('/'); // 移除 https://bucket.cos.region.myqcloud.com 部分
  }

  /**
   * 获取文件的预签名URL（用于临时访问）
   * @param key 文件key
   * @param expires 过期时间（秒）
   * @param isVideo 是否为视频文件
   */
  static getSignedUrl(key: string, expires: number = 3600, isVideo: boolean = true): string {
    const bucket = isVideo ? cosConfig.videoBucket : cosConfig.imageBucket;
    
    return cos.getObjectUrl({
      Bucket: bucket,
      Region: cosConfig.region,
      Key: key,
      Expires: expires,
      Sign: true
    });
  }
}

export default FileManager;