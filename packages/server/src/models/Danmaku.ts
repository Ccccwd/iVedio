import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface DanmakuAttributes {
  id: number;
  userId: number;
  videoId: number;
  content: string;
  time: number; // 弹幕在视频中的时间点（秒）
  color: string; // 弹幕颜色
  type: 'scroll' | 'top' | 'bottom'; // 弹幕类型：滚动、顶部、底部
  fontSize: number; // 字体大小
  createdAt: Date;
}

interface DanmakuCreationAttributes extends Optional<DanmakuAttributes, 'id' | 'color' | 'type' | 'fontSize' | 'createdAt'> {}

class Danmaku extends Model<DanmakuAttributes, DanmakuCreationAttributes> implements DanmakuAttributes {
  public id!: number;
  public userId!: number;
  public videoId!: number;
  public content!: string;
  public time!: number;
  public color!: string;
  public type!: 'scroll' | 'top' | 'bottom';
  public fontSize!: number;
  public readonly createdAt!: Date;
}

Danmaku.init(
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
    content: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100], // 弹幕长度限制
      },
    },
    time: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#FFFFFF',
      validate: {
        is: /^#[0-9A-F]{6}$/i, // 验证颜色格式
      },
    },
    type: {
      type: DataTypes.ENUM('scroll', 'top', 'bottom'),
      allowNull: false,
      defaultValue: 'scroll',
    },
    fontSize: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 14,
      validate: {
        min: 12,
        max: 24,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'danmakus',
    modelName: 'Danmaku',
    updatedAt: false, // 弹幕不需要更新时间
    indexes: [
      {
        fields: ['videoId', 'time'],
      },
      {
        fields: ['userId'],
      },
    ],
  }
);

export default Danmaku;