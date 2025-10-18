import { sequelize } from '../config/database'
import { Danmaku, User, Video, initializeModels } from '../models'

async function checkDanmakus() {
  try {
    await sequelize.authenticate()
    console.log('✓ 数据库连接成功\n')

    // 初始化模型关联
    initializeModels()

    // 查询所有弹幕
    const danmakus = await Danmaku.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        },
        {
          model: Video,
          as: 'video',
          attributes: ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    console.log(`📊 弹幕总数: ${danmakus.length}\n`)

    if (danmakus.length === 0) {
      console.log('❌ 数据库中没有弹幕记录')
    } else {
      console.log('弹幕列表:')
      console.log('='.repeat(80))
      
      danmakus.forEach((danmaku, index) => {
        const danmakuData = danmaku.toJSON() as any
        console.log(`\n${index + 1}. ID: ${danmaku.id}`)
        console.log(`   视频: ${danmakuData.video?.title || '未知'} (ID: ${danmaku.videoId})`)
        console.log(`   用户: ${danmakuData.user?.username || '未知'} (ID: ${danmaku.userId})`)
        console.log(`   内容: ${danmaku.content}`)
        console.log(`   时间: ${danmaku.time.toFixed(2)}秒`)
        console.log(`   颜色: ${danmaku.color}`)
        console.log(`   类型: ${danmaku.type}`)
        console.log(`   字号: ${danmaku.fontSize}px`)
        console.log(`   发送时间: ${danmaku.createdAt}`)
      })
      
      console.log('\n' + '='.repeat(80))
      
      // 按视频统计
      const videoStats = danmakus.reduce((acc: any, danmaku) => {
        const danmakuData = danmaku.toJSON() as any
        const videoId = danmaku.videoId
        if (!acc[videoId]) {
          acc[videoId] = {
            videoTitle: danmakuData.video?.title || '未知',
            count: 0
          }
        }
        acc[videoId].count++
        return acc
      }, {})
      
      console.log('\n📊 按视频统计:')
      Object.entries(videoStats).forEach(([videoId, stats]: [string, any]) => {
        console.log(`   视频ID ${videoId} (${stats.videoTitle}): ${stats.count} 条弹幕`)
      })
    }

    console.log('\n✓ 检查完成')
  } catch (error) {
    console.error('❌ 检查失败:', error)
  } finally {
    await sequelize.close()
  }
}

checkDanmakus()
