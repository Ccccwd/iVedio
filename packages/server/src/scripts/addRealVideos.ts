import { Video } from '../models';

async function addRealVideos() {
  try {
    console.log('🎬 添加真实视频数据...');


    // 添加千与千寻动漫电影
    const spiritedAway = await Video.create({
      title: '千与千寻',
      description: '宫崎骏经典动画电影，讲述少女千寻误入神灵世界，为拯救父母勇敢成长的奇幻冒险。画面精美，情感细腻，适合全年龄观众。',
      videoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun.mkv',
      thumbnail: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun.jpg',
      duration: 2 * 3600 + 4 * 60 + 32, // 2小时4分32秒，单位：秒
      views: 0,
      category: '动漫',
      tags: ['动画', '奇幻', '宫崎骏', '成长', '经典'],
      releaseDate: new Date('2001-07-20'),
      quality: '1080p',
      isVip: false
    });

    console.log('✅ 千与千寻添加成功:', spiritedAway.title);
    console.log('📹 视频URL:', spiritedAway.videoUrl);
    console.log('🖼️ 缩略图URL:', spiritedAway.thumbnail);

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
