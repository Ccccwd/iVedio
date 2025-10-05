# 视频播放软件 MVP 实现指南

## 快速开始步骤

### 步骤1: 项目初始化

#### 1.1 创建Web端项目
```bash
# 使用Vite创建React + TypeScript项目
npm create vite@latest packages/web -- --template react-ts
cd packages/web
npm install
```

#### 1.2 安装核心依赖
```bash
# Web端依赖
npm install react-router-dom video.js @videojs/themes
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react # 图标库
npm install axios zustand
```

#### 1.3 配置Tailwind CSS
```bash
npx tailwindcss init -p
```

### 步骤2: 创建Mock数据

创建 `packages/shared/mock-data/videos.json`:
```json
[
  {
    "id": "1",
    "title": "Big Buck Bunny - 开源动画短片",
    "description": "这是一部由Blender Foundation制作的开源动画短片...",
    "thumbnail": "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
    "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "duration": 596,
    "views": 1250000,
    "uploadDate": "2024-01-15",
    "category": "动画",
    "tags": ["动画", "短片", "开源"]
  }
]
```

### 步骤3: 创建核心组件

#### 3.1 视频卡片组件 (`VideoCard.tsx`)
```typescript
interface VideoCardProps {
  video: Video;
  onClick: () => void;
}
```

#### 3.2 视频播放器组件 (`VideoPlayer.tsx`)
集成Video.js,支持基本播放控制

#### 3.3 页面组件
- `HomePage.tsx` - 首页
- `DetailPage.tsx` - 详情页

### 步骤4: 配置路由

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 步骤5: Electron集成(Desktop端)

#### 5.1 安装Electron依赖
```bash
npm install -D electron electron-builder concurrently wait-on
```

#### 5.2 创建主进程文件
`packages/desktop/src/main/main.ts`

#### 5.3 配置package.json脚本
```json
{
  "scripts": {
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "npm run build && electron-builder"
  }
}
```

## 详细开发流程

### 第一天: 搭建基础框架

**任务清单**:
- [x] 创建项目目录结构
- [x] 初始化Vite + React项目
- [x] 配置Tailwind CSS
- [x] 创建基础布局组件
- [x] 配置路由

**产出**:
- 可运行的Web应用骨架
- 路由导航正常工作

### 第二天: 首页开发

**任务清单**:
- [x] 创建Header组件
- [x] 创建VideoCard组件
- [x] 实现视频网格布局
- [x] 加载Mock数据
- [x] 实现点击跳转详情页

**产出**:
- 完整的首页UI
- 视频列表展示
- 导航功能

### 第三天: 详情页 - 播放器集成

**任务清单**:
- [x] 集成Video.js播放器
- [x] 配置播放器样式
- [x] 实现播放控制
- [x] 处理视频加载状态
- [x] 错误处理

**产出**:
- 可播放视频的详情页
- 基本播放控制功能

### 第四天: 详情页 - 信息展示

**任务清单**:
- [x] 视频信息组件
- [x] 相关推荐列表
- [x] 返回首页功能
- [x] 响应式适配

**产出**:
- 完整的详情页
- 良好的用户体验

### 第五天: Desktop端开发

**任务清单**:
- [x] 配置Electron
- [x] 创建主进程
- [x] 集成Web端代码
- [x] 测试桌面应用

**产出**:
- 可运行的Desktop应用

### 第六-七天: 优化与测试

**任务清单**:
- [x] UI细节优化
- [x] 性能优化
- [x] 浏览器兼容性测试
- [x] Desktop打包测试
- [x] 文档完善

**产出**:
- 稳定的MVP版本
- 使用文档

## 关键代码示例

### Video.js 播放器初始化

```typescript
import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export const VideoPlayer = ({ src, poster }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        poster: poster,
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.src({ src, type: 'video/mp4' });
    }
  }, [src]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};
```

### 响应式视频网格布局

```typescript
export const VideoGrid = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};
```

## 测试视频资源

### 免费测试视频链接
1. **Big Buck Bunny** (596秒)
   ```
   http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
   ```

2. **Elephant Dream** (653秒)
   ```
   http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4
   ```

3. **Sintel** (888秒)
   ```
   http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4
   ```

## 常见问题解决

### 1. Video.js样式问题
确保正确导入CSS:
```typescript
import 'video.js/dist/video-js.css';
```

### 2. CORS跨域问题
开发时可能遇到,使用公共CDN视频或配置代理

### 3. Electron打包问题
确保electron-builder配置正确

### 4. 视频不播放
检查视频格式(推荐MP4 H.264编码)

## 运行命令

### Web端
```bash
# 开发
cd packages/web
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

### Desktop端
```bash
# 开发
cd packages/desktop
npm run electron:dev

# 打包
npm run electron:build
```

## 项目交付物

1. ✅ Web应用源码
2. ✅ Desktop应用源码
3. ✅ Mock数据文件
4. ✅ 使用文档
5. ✅ 架构设计文档
6. ✅ 可运行的Demo

## 下一步优化方向

1. **功能增强**
   - 搜索功能
   - 视频分类筛选
   - 播放历史记录
   - 收藏功能

2. **性能优化**
   - 图片懒加载
   - 虚拟滚动
   - CDN加速
   - 缓存策略

3. **用户体验**
   - 加载动画
   - 错误提示优化
   - 快捷键支持
   - 深色模式

4. **技术升级**
   - 接入真实后端API
   - 用户认证系统
   - 数据持久化
   - 视频上传功能
