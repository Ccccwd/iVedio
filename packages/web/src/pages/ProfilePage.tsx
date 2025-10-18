import type { Video } from '@shared/types';
import { Clock, Heart, Play, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import { getCurrentUser, mockLogin } from '../utils/auth';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface WatchHistoryItem {
  id: number;
  progress: number;
  duration: number;
  completed: boolean;
  watchedAt: string;
  video: {
    id: number;
    title: string;
    thumbnail: string;
    duration: number;
    category: string;
  };
}

interface FavoriteItem {
  id: number;
  createdAt: string;
  video: Video;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadUserData();

    // 监听收藏变化事件
    const handleFavoriteChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('ProfilePage收到favoriteChanged事件:', customEvent.detail);
      console.log('触发收藏数据刷新...');
      // 修改refreshTrigger来触发下一个useEffect
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('favoriteChanged', handleFavoriteChange);
    console.log('ProfilePage: 已注册favoriteChanged事件监听器');

    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChange);
      console.log('ProfilePage: 已移除favoriteChanged事件监听器');
    };
  }, []);

  // 当refreshTrigger改变时重新加载收藏数据
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('refreshTrigger改变，重新加载数据，触发次数:', refreshTrigger);
      loadUserData();
    }
  }, [refreshTrigger]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // 确保用户已登录
      let userData = getCurrentUser();
      if (!userData) {
        userData = await mockLogin('cwd');
      }

      if (!userData) {
        setError('请先登录');
        return;
      }

      setUserProfile(userData);

      // 加载观看历史
      console.log('正在加载观看历史，用户ID:', userData.id);
      const historyResponse = await fetch(`http://localhost:3001/api/users/history/${userData.id}`);
      const historyResult = await historyResponse.json();
      console.log('观看历史响应:', historyResult);

      if (historyResult.success) {
        setWatchHistory(historyResult.data.history || []);
      } else {
        console.warn('获取观看历史失败:', historyResult.message);
      }

      // 加载收藏列表
      console.log('正在加载收藏列表，用户ID:', userData.id);
      const favoritesResponse = await fetch(`http://localhost:3001/api/favorites/user/${userData.id}`);
      const favoritesResult = await favoritesResponse.json();
      console.log('收藏列表原始响应:', favoritesResult);

      if (favoritesResult.success) {
        // 转换数据格式以符合Video接口
        const transformedFavorites = favoritesResult.data.favorites.map((fav: any) => ({
          ...fav,
          video: {
            ...fav.video,
            id: fav.video.id.toString(), // 确保id是字符串
            views: fav.video.views || 0,
            tags: fav.video.tags ? (typeof fav.video.tags === 'string' ? JSON.parse(fav.video.tags) : fav.video.tags) : [],
            uploadDate: fav.video.uploadDate || fav.video.releaseDate || new Date().toISOString(),
            thumbnail: fav.video.thumbnail || fav.video.posterUrl || '',
            description: fav.video.description || '',
            videoUrl: fav.video.videoUrl || '',
            duration: fav.video.duration || 0,
            category: fav.video.category || '未分类'
          }
        }));
        console.log('转换后的收藏列表:', transformedFavorites);
        setFavorites(transformedFavorites);
      } else {
        console.warn('获取收藏列表失败:', favoritesResult.message);
        setFavorites([]);
      }

    } catch (error) {
      console.error('加载用户数据失败:', error);
      setError('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const formatProgress = (progress: number, duration: number) => {
    const percentage = Math.round((progress / duration) * 100);
    return `${percentage}%`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 用户信息卡片 */}
        <div className="bg-background-card rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {userProfile?.username}
              </h1>
              <p className="text-gray-400">{userProfile?.email}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <Play className="w-4 h-4 mr-1" />
                  {watchHistory.length} 个观看记录
                </span>
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {favorites.length} 个收藏
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'history'
              ? 'bg-primary text-white'
              : 'bg-background-card text-gray-400 hover:text-white'
              }`}
          >
            <Clock className="w-5 h-5 inline mr-2" />
            观看历史
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'favorites'
              ? 'bg-primary text-white'
              : 'bg-background-card text-gray-400 hover:text-white'
              }`}
          >
            <Heart className="w-5 h-5 inline mr-2" />
            我的收藏
          </button>
        </div>

        {/* 内容区域 */}
        <div className="space-y-6">
          {activeTab === 'history' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">观看历史</h2>
              {watchHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无观看记录</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {watchHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-background-card rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-800 transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={item.video.thumbnail}
                          alt={item.video.title}
                          className="w-32 h-20 object-cover rounded-md"
                        />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                          {formatDuration(item.video.duration)}
                        </div>
                        {!item.completed && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gray-600 h-1 rounded-b-md">
                            <div
                              className="bg-primary h-full rounded-b-md"
                              style={{
                                width: `${(item.progress / item.duration) * 100}%`
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">
                          {item.video.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {item.video.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            观看进度: {formatProgress(item.progress, item.duration)}
                            {item.completed && ' (已看完)'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(item.watchedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">我的收藏</h2>
              {favorites.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无收藏视频</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favorites.map((item) => (
                    <div key={item.id} className="relative">
                      <VideoCard video={item.video} />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;