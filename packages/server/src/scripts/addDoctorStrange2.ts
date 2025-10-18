import { sequelize } from '../config/database'
import Video from '../models/Video'

async function addDoctorStrange2() {
  try {
    // 测试数据库连接
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')
    
    console.log('开始添加奇异博士2视频...')
    
    // 检查是否已存在
    const existing = await Video.findOne({ where: { id: 8 } })
    if (existing) {
      console.log('奇异博士2已存在，更新数据...')
      await existing.update({
        title: '奇异博士2：疯狂多元宇宙',
        description: '漫威超级英雄电影，奇异博士探索多元宇宙的惊险之旅。充满视觉奇观和惊人的魔法场景，带你进入前所未见的奇幻世界。',
        thumbnail: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/DoctorStrange2.png',
        videoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/DoctorStrange2.mp4',
        duration: 7560, // 2小时6分
        category: '电影',
        tags: ['漫威', '科幻', '动作', '奇幻', '超级英雄'],
        views: 1250000
      })
      console.log('✅ 奇异博士2更新成功')
    } else {
      console.log('奇异博士2不存在，创建新记录...')
      await Video.create({
        id: 8,
        title: '奇异博士2：疯狂多元宇宙',
        description: '漫威超级英雄电影，奇异博士探索多元宇宙的惊险之旅。充满视觉奇观和惊人的魔法场景，带你进入前所未见的奇幻世界。',
        thumbnail: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/DoctorStrange2.png',
        videoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/DoctorStrange2.mp4',
        duration: 7560, // 2小时6分 (126分钟)
        category: '电影',
        tags: ['漫威', '科幻', '动作', '奇幻', '超级英雄'],
        views: 1250000,
        releaseDate: new Date('2022-05-06'),
        quality: '1080P',
        isVip: false
      })
      console.log('✅ 奇异博士2添加成功')
    }
    
    // 显示当前数据库中的所有视频
    const allVideos = await Video.findAll({
      order: [['id', 'ASC']]
    })
    
    console.log('\n📊 当前数据库中的所有视频:')
    allVideos.forEach(video => {
      console.log(`  ID ${video.id}: ${video.title} (${video.category})`)
    })
    
    console.log('\n✅ 操作完成！')
    process.exit(0)
  } catch (error) {
    console.error('❌ 添加视频失败:', error)
    process.exit(1)
  }
}

addDoctorStrange2()
