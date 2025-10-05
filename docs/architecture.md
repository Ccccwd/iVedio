# 视频播放软件架构设计文档

## 项目概述
一个类似腾讯视频的视频播放平台,支持Web端和Desktop端,包含首页和内容详情页功能。

## MVP 功能范围
- ✅ 首页:展示视频列表(示例数据)
- ✅ 详情页:视频播放和基本信息展示
- ✅ Web端:基于现代前端框架
- ✅ Desktop端:基于Electron
- ✅ 响应式设计
- ✅ 基本的视频播放控制

## 技术栈

### Web端
- **前端框架**: React 18
- **构建工具**: Vite
- **UI框架**: Tailwind CSS + shadcn/ui
- **路由**: React Router v6
- **视频播放器**: Video.js
- **状态管理**: React Context/Zustand
- **HTTP客户端**: Axios

### Desktop端
- **桌面框架**: Electron
- **共享代码**: 与Web端共享React组件
- **打包工具**: Electron Builder

### 后端(可选-MVP阶段使用Mock数据)
- **框架**: Node.js + Express
- **数据**: JSON文件(Mock数据)

## 项目结构

```
video-platform/
├── packages/
│   ├── web/                    # Web应用
│   │   ├── src/
│   │   │   ├── components/     # 公共组件
│   │   │   ├── pages/          # 页面组件
│   │   │   ├── hooks/          # 自定义Hooks
│   │   │   ├── utils/          # 工具函数
│   │   │   ├── assets/         # 静态资源
│   │   │   ├── styles/         # 样式文件
│   │   │   └── App.tsx         # 应用入口
│   │   ├── public/             # 公共资源
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── desktop/                # Desktop应用
│   │   ├── src/
│   │   │   ├── main/           # Electron主进程
│   │   │   └── renderer/       # 渲染进程(共享web代码)
│   │   ├── package.json
│   │   └── electron.config.js
│   │
│   └── shared/                 # 共享代码
│       ├── components/         # 共享组件
│       ├── types/              # TypeScript类型
│       ├── api/                # API调用
│       └── mock-data/          # Mock数据
│
├── docs/                       # 文档
├── package.json               # 根package.json
└── README.md
```

## MVP实现步骤

### 阶段1: 项目初始化 (1天)
1. 创建项目基础结构
2. 配置Vite + React + TypeScript
3. 安装必要依赖
4. 配置Tailwind CSS
5. 设置ESLint和Prettier

### 阶段2: Web端开发 (3-4天)

#### 2.1 准备Mock数据
- 创建视频列表JSON数据
- 准备示例视频文件或使用在线视频链接

#### 2.2 开发首页
- 页面布局(Header + 内容区)
- 视频卡片组件
- 视频列表网格展示
- 基础导航

#### 2.3 开发详情页
- 视频播放器集成(Video.js)
- 视频信息展示
- 播放控制功能
- 返回首页功能

#### 2.4 路由配置
- 配置React Router
- 首页路由: `/`
- 详情页路由: `/video/:id`

### 阶段3: Desktop端开发 (2天)

#### 3.1 Electron配置
- 创建主进程入口
- 配置窗口参数
- 集成Web端代码

#### 3.2 桌面特性
- 窗口控制(最小化、最大化、关闭)
- 原生菜单
- 快捷键支持

### 阶段4: 优化与测试 (1天)
- 响应式适配
- 性能优化
- 跨浏览器测试
- Desktop端打包测试

## 核心功能设计

### 1. 首页
**功能**:
- 顶部导航栏(Logo + 搜索框)
- 视频分类标签
- 视频卡片网格布局
- 卡片信息:封面图、标题、时长、播放量

**组件**:
- `Header`: 顶部导航
- `VideoCard`: 视频卡片
- `VideoGrid`: 视频列表容器
- `HomePage`: 首页容器

### 2. 详情页
**功能**:
- 视频播放器(支持播放/暂停、进度条、音量、全屏)
- 视频标题和描述
- 相关推荐视频

**组件**:
- `VideoPlayer`: 播放器组件
- `VideoInfo`: 视频信息
- `RelatedVideos`: 相关推荐
- `DetailPage`: 详情页容器

### 3. 视频播放器功能
- 播放/暂停
- 进度条拖动
- 音量调节
- 全屏切换
- 播放速度调节
- 快捷键支持(空格播放/暂停等)

## Mock数据结构

```typescript
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;        // 秒
  views: number;           // 播放量
  uploadDate: string;
  category: string;
  tags: string[];
}
```

## 示例视频源
MVP阶段可使用:
1. Big Buck Bunny (开源测试视频)
2. Sintel (开源测试视频)
3. 本地视频文件
4. 或使用视频托管服务

## 部署方案

### Web端
- 开发环境: `npm run dev`
- 生产构建: `npm run build`
- 部署: Vercel / Netlify / 自建服务器

### Desktop端
- 开发环境: `npm run electron:dev`
- 打包: `npm run electron:build`
- 输出: Windows (.exe) / macOS (.dmg) / Linux (.AppImage)

## 技术要点

### 1. 视频播放器选型
**Video.js** - 推荐理由:
- 开源免费
- 功能完善
- 插件丰富
- 支持多种视频格式
- 响应式设计

### 2. 性能优化
- 懒加载图片(React Lazy Load)
- 视频预加载策略
- 路由懒加载
- 代码分割

### 3. 用户体验
- 加载状态提示
- 错误处理
- 平滑过渡动画
- 键盘快捷键

## 扩展功能(后续迭代)
- 用户系统(登录/注册)
- 搜索功能
- 视频分类和筛选
- 播放历史
- 收藏功能
- 评论系统
- 弹幕功能
- 多清晰度切换
- 字幕支持
- 离线下载(Desktop)
- 真实后端API

## 开发时间估算
- MVP版本: 7-10天
- 完整版本: 30-45天

## 注意事项
1. 视频文件版权问题
2. 视频格式兼容性(建议MP4 H.264编码)
3. 浏览器兼容性(Chrome、Firefox、Safari、Edge)
4. 移动端适配
5. 视频加载性能优化
