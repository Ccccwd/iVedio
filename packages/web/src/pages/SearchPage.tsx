import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Video } from '@shared/types';
import VideoCard from '../components/VideoCard';

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 从URL参数中获取搜索关键词
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      fetchSearchResults(query);
    } else {
      setVideos([]);
      setLoading(false);
    }
  }, [location.search]);

  const fetchSearchResults = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/videos?search=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setVideos(result.data.videos || []);
      } else {
        setError(result.message || '搜索失败');
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setError('网络错误，无法获取搜索结果');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 搜索框 */}
      <div className="bg-background-card rounded-lg p-6">
        <form onSubmit={handleSearch} className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索视频..."
              className="w-full bg-background-hover border border-gray-700 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="btn-primary px-6 py-3"
          >
            搜索
          </button>
        </form>
      </div>

      {/* 搜索结果 */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-400">搜索中...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => fetchSearchResults(searchQuery)}
            className="mt-4 btn-primary"
          >
            重试
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              搜索结果 {searchQuery && `: "${searchQuery}"`}
            </h2>
            <p className="text-gray-400">
              找到 {videos.length} 个视频
            </p>
          </div>

          {videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">没有找到相关的视频</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchPage;