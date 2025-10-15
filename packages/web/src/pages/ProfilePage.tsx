import React, { useState, useEffect } from 'react';
import { User, Play, Heart, Clock, Settings } from 'lucide-react';
import VideoCard from '../components/VideoCard';

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
  video: any;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!userData.id) {
        setError('请先登录');
        return;
      }

      setUserProfile(userData);

      // 加载观看历史
      const historyResponse = await fetch(`http://localhost:3001/api/users/history/${userData.id}`);
      const historyResult = await historyResponse.json();
      
      if (historyResult.success) {
        setWatchHistory(historyResult.data.history);
      }

      // 加载收藏列表
      const favoritesResponse = await fetch(`http://localhost:3001/api/users/favorites/${userData.id}`);
      const favoritesResult = await favoritesResponse.json();
      
      if (favoritesResult.success) {
        setFavorites(favoritesResult.data.favorites);
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
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-primary text-white'
                : 'bg-background-card text-gray-400 hover:text-white'
            }`}
          >
            <Clock className="w-5 h-5 inline mr-2" />
            观看历史
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'favorites'
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