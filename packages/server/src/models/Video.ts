import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface VideoAttributes {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  previewVideoUrl?: string; // 预览视频URL（10-30秒片段）
  thumbnail: string;
  posterUrl?: string; // 海报图片URL（高分辨率）
  duration: number;
  views: number;
  category: string;
  tags: string[];
  releaseDate: Date;
  director?: string;
  actors?: string[];
  rating?: number;
  quality: string; // HD, FHD, 4K
  isVip: boolean; // 是否需要VIP观看
  createdAt?: Date;
  updatedAt?: Date;
}

interface VideoCreationAttributes extends Optional<VideoAttributes, 'id' | 'views' | 'rating' | 'createdAt' | 'updatedAt'> {}

class Video extends Model<VideoAttributes, VideoCreationAttributes> implements VideoAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public videoUrl!: string;
  public previewVideoUrl?: string;
  public thumbnail!: string;
  public posterUrl?: string;
  public duration!: number;
  public views!: number;
  public category!: string;
  public tags!: string[];
  public releaseDate!: Date;
  public director?: string;
  public actors?: string[];
  public rating?: number;
  public quality!: string;
  public isVip!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Video.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    previewVideoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '预览视频URL（10-30秒片段）'
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    posterUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '海报图片URL（高分辨率）'
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '其他',
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    director: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    actors: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 10,
      },
    },
    quality: {
      type: DataTypes.ENUM('SD', 'HD', 'FHD', '4K'),
      allowNull: false,
      defaultValue: 'HD',
    },
    isVip: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'videos',
    modelName: 'Video',
  }
);

export default Video;