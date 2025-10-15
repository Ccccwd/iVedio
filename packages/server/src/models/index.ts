import User from './User';
import Video from './Video';
import WatchHistory from './WatchHistory';
import Favorite from './Favorite';

// 定义模型关系
export function initializeModels() {
  // 用户观看历史
  User.hasMany(WatchHistory, {
    foreignKey: 'userId',
    as: 'watchHistory'
  });

  WatchHistory.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Video.hasMany(WatchHistory, {
    foreignKey: 'videoId',
    as: 'watchHistory'
  });

  WatchHistory.belongsTo(Video, {
    foreignKey: 'videoId',
    as: 'video'
  });

  // 用户收藏
  User.hasMany(Favorite, {
    foreignKey: 'userId',
    as: 'favorites'
  });

  Favorite.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Video.hasMany(Favorite, {
    foreignKey: 'videoId',
    as: 'favorites'
  });

  Favorite.belongsTo(Video, {
    foreignKey: 'videoId',
    as: 'video'
  });

  // 多对多关系：用户收藏的视频
  User.belongsToMany(Video, {
    through: Favorite,
    foreignKey: 'userId',
    otherKey: 'videoId',
    as: 'favoriteVideos'
  });

  Video.belongsToMany(User, {
    through: Favorite,
    foreignKey: 'videoId',
    otherKey: 'userId',
    as: 'favoritedByUsers'
  });
}

export { User, Video, WatchHistory, Favorite };