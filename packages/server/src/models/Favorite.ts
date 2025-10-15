import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface FavoriteAttributes {
  id: number;
  userId: number;
  videoId: number;
  createdAt: Date;
}

interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, 'id' | 'createdAt'> {}

class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteAttributes {
  public id!: number;
  public userId!: number;
  public videoId!: number;
  public readonly createdAt!: Date;
}

Favorite.init(
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'favorites',
    modelName: 'Favorite',
    updatedAt: false, // 收藏不需要更新时间
    indexes: [
      {
        unique: true,
        fields: ['userId', 'videoId'],
      },
    ],
  }
);

export default Favorite;