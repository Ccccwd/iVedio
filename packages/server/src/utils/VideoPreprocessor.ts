import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs/promises'
import path from 'path'
import { cos, cosConfig } from '../config/cos'

interface PreviewOptions {
    startTime: number // 开始时间（秒）
    duration: number // 持续时间（秒），建议10-30秒
    quality?: string // 输出质量：'high' | 'medium' | 'low'
    width?: number // 输出宽度
    height?: number // 输出高度
}

interface VideoPreprocessResult {
    success: boolean
    previewPath?: string
    previewUrl?: string
    error?: string
}

export class VideoPreprocessor {
    private readonly tempDir: string
    private readonly outputDir: string

    constructor(tempDir = './temp', outputDir = './output') {
        this.tempDir = tempDir
        this.outputDir = outputDir
    }

    /**
     * 生成视频预览片段
     * @param inputVideoPath 输入视频文件路径
     * @param outputFileName 输出文件名（不含扩展名）
     * @param options 预览选项
     */
    async generatePreview(
        inputVideoPath: string,
        outputFileName: string,
        options: PreviewOptions
    ): Promise<VideoPreprocessResult> {
        try {
            // 确保输出目录存在
            await this.ensureDirectories()

            const outputPath = path.join(this.outputDir, `${outputFileName}_preview.mp4`)

            // 获取质量配置
            const qualityConfig = this.getQualityConfig(options.quality || 'medium')

            return new Promise((resolve) => {
                ffmpeg(inputVideoPath)
                    .seekInput(options.startTime) // 跳转到指定开始时间
                    .duration(options.duration) // 设置持续时间
                    .videoCodec('libx264') // 使用H.264编码
                    .audioCodec('aac') // 使用AAC音频编码
                    .size(options.width && options.height ? `${options.width}x${options.height}` : '1280x720') // 设置分辨率
                    .videoBitrate(qualityConfig.videoBitrate)
                    .audioBitrate(qualityConfig.audioBitrate)
                    .fps(30) // 设置帧率
                    .addOptions([
                        '-preset fast', // 编码预设，fast平衡质量和速度
                        '-movflags +faststart', // 优化网络播放
                        '-pix_fmt yuv420p' // 确保兼容性
                    ])
                    .on('start', (commandLine) => {
                        console.log('🎬 开始生成预览片段:', commandLine)
                    })
                    .on('progress', (progress) => {
                        console.log(`📈 处理进度: ${Math.round(progress.percent || 0)}%`)
                    })
                    .on('end', () => {
                        console.log('✅ 预览片段生成完成:', outputPath)
                        resolve({
                            success: true,
                            previewPath: outputPath
                        })
                    })
                    .on('error', (err) => {
                        console.error('❌ 预览片段生成失败:', err.message)
                        resolve({
                            success: false,
                            error: err.message
                        })
                    })
                    .save(outputPath)
            })
        } catch (error) {
            console.error('❌ 预处理失败:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }

    /**
     * 上传预览视频到COS
     * @param localFilePath 本地文件路径
     * @param cosKey COS对象键名
     */
    async uploadToCOS(localFilePath: string, cosKey: string): Promise<VideoPreprocessResult> {
        try {
            console.log('☁️ 开始上传预览视频到COS...')

            const result = await cos.putObject({
                Bucket: cosConfig.videoBucket,
                Region: cosConfig.region,
                Key: cosKey,
                Body: await fs.readFile(localFilePath),
                ContentType: 'video/mp4'
            })

            const previewUrl = `https://${cosConfig.videoBucket}.cos.${cosConfig.region}.myqcloud.com/${cosKey}`

            console.log('✅ 预览视频上传成功:', previewUrl)

            // 清理本地临时文件
            await fs.unlink(localFilePath).catch(console.warn)

            return {
                success: true,
                previewUrl
            }
        } catch (error) {
            console.error('❌ COS上传失败:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Upload failed'
            }
        }
    }

    /**
     * 完整的预览生成流程：生成 -> 上传 -> 清理
     * @param inputVideoPath 输入视频路径
     * @param outputFileName 输出文件名
     * @param cosKey COS对象键名
     * @param options 预览选项
     */
    async processAndUpload(
        inputVideoPath: string,
        outputFileName: string,
        cosKey: string,
        options: PreviewOptions
    ): Promise<VideoPreprocessResult> {
        // 第一步：生成预览片段
        const generateResult = await this.generatePreview(inputVideoPath, outputFileName, options)

        if (!generateResult.success || !generateResult.previewPath) {
            return generateResult
        }

        // 第二步：上传到COS
        const uploadResult = await this.uploadToCOS(generateResult.previewPath, cosKey)

        return uploadResult
    }

    /**
     * 获取质量配置
     */
    private getQualityConfig(quality: string) {
        const configs = {
            high: { videoBitrate: '2000k', audioBitrate: '128k' },
            medium: { videoBitrate: '1000k', audioBitrate: '96k' },
            low: { videoBitrate: '500k', audioBitrate: '64k' }
        }
        return configs[quality as keyof typeof configs] || configs.medium
    }

    /**
     * 确保必要的目录存在
     */
    private async ensureDirectories() {
        try {
            await fs.mkdir(this.tempDir, { recursive: true })
            await fs.mkdir(this.outputDir, { recursive: true })
        } catch (error) {
            console.warn('目录创建警告:', error)
        }
    }

    /**
     * 获取视频信息
     * @param videoPath 视频文件路径
     */
    async getVideoInfo(videoPath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(metadata)
                }
            })
        })
    }
}

// 导出默认实例
export const videoPreprocessor = new VideoPreprocessor()

// 快捷方法：为千与千寻生成预览
export async function generateSpiritedAwayPreview() {
    const preprocessor = new VideoPreprocessor()

    // 假设源视频已经存在于某个路径
    const inputVideo = './videos/qianyuqianxun.mkv' // 需要替换为实际路径

    const result = await preprocessor.processAndUpload(
        inputVideo,
        'qianyuqianxun',
        'qianyuqianxun_preview.mp4',
        {
            startTime: 30, // 从30秒开始
            duration: 20, // 20秒预览
            quality: 'medium',
            width: 1280,
            height: 720
        }
    )

    console.log('千与千寻预览生成结果:', result)
    return result
}