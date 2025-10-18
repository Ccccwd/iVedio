import { sequelize } from '../config/database'
import { initializeModels } from '../models'
import Episode from '../models/Episode'

async function addDoctorStrange2Episodes() {
    try {
        // 初始化模型关联
        initializeModels()

        // 测试数据库连接
        await sequelize.authenticate()
        console.log('✅ 数据库连接成功')

        // 同步Episode表
        await Episode.sync()
        console.log('✅ Episode表同步完成')

        console.log('开始添加奇异博士2的剧集...')

        const episodes = [
            {
                videoId: 8,
                episodeNumber: 1,
                title: '第1集',
                description: '奇异博士探索多元宇宙的开端，面对全新的挑战',
                videoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/DoctorStrange2-1.mp4',
                thumbnail: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/DoctorStrange2.png',
                duration: 3600, // 60分钟
                isVip: false
            },
            {
                videoId: 8,
                episodeNumber: 2,
                title: '第2集',
                description: '深入多元宇宙的疯狂冒险，惊心动魄的魔法对决',
                videoUrl: 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/DoctorStrange2-2.mp4',
                thumbnail: 'https://ivedio-image-1325747247.cos.ap-nanjing.myqcloud.com/DoctorStrange2.png',
                duration: 3960, // 66分钟
                isVip: false
            }
        ]

        // 删除已存在的剧集（如果有）
        await Episode.destroy({ where: { videoId: 8 } })
        console.log('清理旧数据完成')

        // 添加新剧集
        for (const episodeData of episodes) {
            await Episode.create(episodeData)
            console.log(`✅ 添加 ${episodeData.title} 成功`)
        }

        // 显示所有剧集
        const allEpisodes = await Episode.findAll({
            where: { videoId: 8 },
            order: [['episodeNumber', 'ASC']]
        })

        console.log('\n📊 奇异博士2的所有剧集:')
        allEpisodes.forEach(episode => {
            console.log(`  ${episode.title} - ${Math.floor(episode.duration / 60)}分钟`)
        })

        console.log('\n✅ 操作完成！')
        process.exit(0)
    } catch (error) {
        console.error('❌ 添加剧集失败:', error)
        process.exit(1)
    }
}

addDoctorStrange2Episodes()
