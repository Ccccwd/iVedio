import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface WatchHistoryAttributes {
  id: number;
  userId: number;
  videoId: number;
  watchedAt: Date;
  progress: number; // 观看进度（秒）
  duration: number; // 视频总时长（秒）
  completed: boolean; // 是否看完
}

interface WatchHistoryCreationAttributes extends Optional<WatchHistoryAttributes, 'id' | 'completed'> {}

class WatchHistory extends Model<WatchHistoryAttributes, WatchHistoryCreationAttributes> implements WatchHistoryAttributes {
  public id!: number;
  public userId!: number;
  public videoId!: number;
  public watchedAt!: Date;
  public progress!: number;
  public duration!: number;
  public completed!: boolean;
}

WatchHistory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    videoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'videos',
        key: 'id',
      },
    },
    watchedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'watch_history',
    modelName: 'WatchHistory',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'videoId'],
      },
    ],
  }
);

export default WatchHistory;