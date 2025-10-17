import { cos, cosConfig } from '../config/cos'

async function checkVideoInfo() {
    try {
        console.log('📹 检查视频文件信息...\n')

        const videoFiles = [
            'qianyuqianxun.mp4',
            'test-vedio.mp4'
        ]

        for (const fileName of videoFiles) {
            try {
                const result = await cos.headObject({
                    Bucket: cosConfig.videoBucket,
                    Region: cosConfig.region,
                    Key: fileName
                })

                const headers = result.headers || {}
                const sizeInMB = (parseInt(headers['content-length'] || '0') / (1024 * 1024)).toFixed(2)

                console.log(`📁 ${fileName}`)
                console.log(`   大小: ${sizeInMB} MB`)
                console.log(`   类型: ${headers['content-type'] || '未知'}`)
                console.log(`   ETag: ${headers.etag || '未知'}`)
                console.log(`   最后修改: ${headers['last-modified'] || '未知'}`)
                console.log(`   Range支持: ${headers['accept-ranges'] || '未知'}`)
                console.log('')
            } catch (error: any) {
                console.log(`❌ ${fileName}: 文件不存在或无法访问`)
                console.log('')
            }
        }

        console.log('✅ 检查完成')
    } catch (error) {
        console.error('❌ 检查失败:', error)
    }
}

checkVideoInfo()
