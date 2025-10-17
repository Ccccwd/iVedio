import { sequelize } from '../config/database'
import { Video } from '../models'

async function updateVideoUrl() {
    try {
        await sequelize.authenticate()
        console.log('✓ 数据库连接成功')

        // 查找千与千寻视频
        const video = await Video.findOne({
            where: {
                title: '千与千寻'
            }
        })

        if (!video) {
            console.log('❌ 未找到千与千寻视频')
            return
        }

        console.log('\n当前视频信息:')
        console.log(`标题: ${video.title}`)
        console.log(`当前URL: ${video.videoUrl}`)

        // 更新URL
        const newUrl = 'https://ivedio-vedio-1325747247.cos.ap-nanjing.myqcloud.com/qianyuqianxun.mp4'
        await video.update({
            videoUrl: newUrl
        })

        console.log(`\n✓ URL已更新为: ${newUrl}`)
        console.log('✓ 更新完成！')

    } catch (error) {
        console.error('❌ 更新失败:', error)
    } finally {
        await sequelize.close()
    }
}

updateVideoUrl()
