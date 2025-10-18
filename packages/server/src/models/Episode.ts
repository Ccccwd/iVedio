import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database'

interface EpisodeAttributes {
  id: number
  videoId: number
  episodeNumber: number
  title: string
  description?: string
  videoUrl: string
  thumbnail?: string
  duration: number
  isVip: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface EpisodeCreationAttributes extends Optional<EpisodeAttributes, 'id' | 'description' | 'thumbnail' | 'createdAt' | 'updatedAt'> {}

class Episode extends Model<EpisodeAttributes, EpisodeCreationAttributes> implements EpisodeAttributes {
  public id!: number
  public videoId!: number
  public episodeNumber!: number
  public title!: string
  public description?: string
  public videoUrl!: string
  public thumbnail?: string
  public duration!: number
  public isVip!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Episode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'videos',
        key: 'id',
      },
    },
    episodeNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '集数',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '剧集标题',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '剧集描述',
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '视频文件URL',
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '剧集缩略图',
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '时长（秒）',
    },
    isVip: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '是否需要VIP',
    },
  },
  {
    sequelize,
    tableName: 'episodes',
    timestamps: true,
  }
)

export default Episode
