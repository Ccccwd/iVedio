import { FileManager } from '../utils/FileManager';
import Video from '../models/Video';

// 示例：添加新电影
async function addNewMovie() {
  const videoId = 123;
  const category = 'movies';
  const quality = '1080p';
  
  // 1. 上传视频文件
  const videoUrl = await FileManager.uploadVideo(
    '/path/to/local/movie.mp4',
    videoId,
    category,
    quality
  );
  
  // 2. 上传缩略图
  const thumbnailUrl = await FileManager.uploadImage(
    '/path/to/local/thumbnail.jpg',
    videoId,
    category,
    'thumb'
  );
  
  // 3. 上传海报
  const posterUrl = await FileManager.uploadImage(
    '/path/to/local/poster.jpg',
    videoId,
    category,
    'poster'
  );
  
  // 4. 保存到数据库
  const video = await Video.create({
    title: '精彩电影',
    description: '这是一部精彩的电影',
    videoUrl: videoUrl,        // https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/videos/movies/2025/video_123_1080p.mp4
    thumbnail: thumbnailUrl,   // https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/thumbs/movies/video_123_thumb.jpg
    duration: 7200,
    category: category,
    tags: ['动作', '冒险'],
    releaseDate: new Date(),
    quality: quality,
    isVip: false
  });
}

// 示例：批量处理不同清晰度
async function addMovieWithMultipleQualities() {
  const videoId = 124;
  const category = 'movies';
  const qualities = ['720p', '1080p', '4k'];
  
  const videoUrls: Record<string, string> = {};
  
  for (const quality of qualities) {
    const videoUrl = await FileManager.uploadVideo(
      `/path/to/movie_${quality}.mp4`,
      videoId,
      category,
      quality
    );
    videoUrls[quality] = videoUrl;
  }
  
  // 保存主要版本到数据库（如1080p）
  await Video.create({
    title: '高清电影',
    description: '支持多种清晰度的高清电影',
    videoUrl: videoUrls['1080p'],
    thumbnail: await FileManager.uploadImage('/path/to/thumbnail.jpg', videoId, category, 'thumb'),
    duration: 7200,
    category: category,
    tags: ['高清', '多清晰度'],
    releaseDate: new Date(),
    quality: '1080p',
    isVip: false
  });
}