import Comment from './Comment';
import Danmaku from './Danmaku';
import Episode from './Episode';
import Favorite from './Favorite';
import User from './User';
import Video from './Video';
import WatchHistory from './WatchHistory';

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

  // 用户评论
  User.hasMany(Comment, {
    foreignKey: 'userId',
    as: 'comments'
  });

  Comment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Video.hasMany(Comment, {
    foreignKey: 'videoId',
    as: 'comments'
  });

  Comment.belongsTo(Video, {
    foreignKey: 'videoId',
    as: 'video'
  });

  // 评论回复（自关联）
  Comment.hasMany(Comment, {
    foreignKey: 'parentId',
    as: 'replies'
  });

  Comment.belongsTo(Comment, {
    foreignKey: 'parentId',
    as: 'parent'
  });

  // 用户弹幕
  User.hasMany(Danmaku, {
    foreignKey: 'userId',
    as: 'danmakus'
  });

  Danmaku.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Video.hasMany(Danmaku, {
    foreignKey: 'videoId',
    as: 'danmakus'
  });

  Danmaku.belongsTo(Video, {
    foreignKey: 'videoId',
    as: 'video'
  });

  // 视频剧集
  Video.hasMany(Episode, {
    foreignKey: 'videoId',
    as: 'episodes'
  });

  Episode.belongsTo(Video, {
    foreignKey: 'videoId',
    as: 'video'
  });
}

export { Comment, Danmaku, Episode, Favorite, User, Video, WatchHistory };
