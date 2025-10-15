# 视频播放平台 - MVP版本

一个类似腾讯视频的视频播放平台，支持Web端和Desktop端。

##  项目特性

- **Web端**: 基于React +## 快速开始

### 前置要求
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **cnpm**（推荐，解决国内网络问题）
- **MySQL** >= 5.7 或 **腾讯云数据库**
- **腾讯云账号**（用于COS存储和CDN）

### 🔧 环境配置

#### 1. 腾讯云服务准备
在开始之前，请确保已开通以下腾讯云服务：
- **对象存储 COS** - 存储视频和图片文件
- **内容分发网络 CDN** - 加速视频播放（可选但推荐）
- **云数据库 MySQL** - 存储用户和视频元数据（可选，也可使用本地MySQL）

#### 2. API密钥获取
1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入 **访问管理** > **访问密钥** > **API密钥管理**
3. 创建密钥，记录 `SecretId` 和 `SecretKey`

#### 3. 环境变量配置
```bash
# 1. 复制环境配置文件
cd packages/server
cp .env.example .env

# 2. 编辑配置文件，填写真实的配置信息
# 包括腾讯云密钥、数据库信息、JWT密钥等
```

**📋 详细配置指南请查看：[环境配置文档](./docs/environment-setup.md)**

### 环境准备

如果npm安装缓慢，建议安装cnpm：
```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
```+ Vite构建，支持现代浏览器
- **Desktop端**: 基于Electron，支持Windows/macOS/Linux跨平台
- **视频播放**: 原生HTML5视频播放器，稳定可靠
- **响应式设计**: 完美适配桌面、平板、手机等各种屏幕
- **现代UI**: 使用Tailwind CSS设计，暗色主题，简洁美观
- **高性能**: Vite构建工具，开发热更新，生产环境快速加载

## 功能列表

### 已完成功能
- **首页视频展示**: 网格布局展示视频列表，支持缩略图预览
- **视频详情页**: 完整的视频信息展示和播放页面
- **原生视频播放**: HTML5视频播放器，支持全屏、音量控制等
- **响应式导航**: 顶部导航栏，支持Logo和搜索框
- **路由系统**: React Router实现单页应用导航
- **错误处理**: 图片加载失败自动显示占位图标
- **跨平台桌面应用**: Electron封装，支持Windows/macOS/Linux

### 开发中功能
- 搜索功能完善
- 视频分类筛选
- 播放进度记忆

### 计划功能
- 用户登录系统
- 播放历史记录
- 收藏夹功能
- 评论系统
- 视频上传管理

## 技术栈

### 前端技术
- **React 18**: 最新版本，支持并发特性
- **TypeScript**: 类型安全，提升开发体验
- **Vite**: 现代构建工具，极速热更新
- **React Router v6**: 最新路由系统
- **Tailwind CSS**: 原子化CSS框架
- **Lucide React**: 现代图标库

### 桌面端技术
- **Electron**: 跨平台桌面应用框架
- **Node.js**: 后端运行时

### 开发工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **cnpm**: 国内镜像，解决网络问题

## 项目结构

```
video-platform/
├── docs/                           # 项目文档
│   ├── architecture.md            # 系统架构设计
│   └── implementation-guide.md     # 详细实现指南
├── packages/
│   ├── web/                       # Web前端应用
│   │   ├── src/
│   │   │   ├── components/        # React组件
│   │   │   │   ├── Header.tsx     # 顶部导航
│   │   │   │   ├── Layout.tsx     # 页面布局
│   │   │   │   ├── VideoCard.tsx  # 视频卡片
│   │   │   │   └── VideoPlayer.tsx # 视频播放器
│   │   │   ├── pages/             # 页面组件
│   │   │   │   ├── HomePage.tsx   # 首页
│   │   │   │   └── DetailPage.tsx # 详情页
│   │   │   ├── styles/            # 全局样式
│   │   │   └── App.tsx            # 根组件
│   │   ├── public/                # 静态资源
│   │   └── package.json
│   ├── desktop/                   # Electron桌面应用
│   │   ├── src/main/              # 主进程代码
│   │   │   └── main.ts            # Electron入口
│   │   └── package.json
│   └── shared/                    # 共享代码和数据
│       ├── types/                 # TypeScript类型定义
│       └── mock-data/             # 模拟数据
│           └── videos.json        # 视频数据
├── scripts/                       # 自动化脚本
└── README.md                      # 项目说明
```

## 快速开始

### 前置要求
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **cnpm**（推荐，解决国内网络问题）

### 环境准备

如果npm安装缓慢，建议安装cnpm：
```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
```

### 安装与运行

#### 🚀 一键启动（推荐）
```bash
# Windows PowerShell
.\scripts\quick-start.ps1

# Linux/macOS
chmod +x scripts/quick-start.sh
./scripts/quick-start.sh
```

#### 📝 手动启动

##### 1. 🌐 Web端开发

```bash
# 1. 进入web目录
cd packages/web

# 2. 安装依赖（推荐使用cnpm）
cnpm install
# 或者使用npm
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问
# http://localhost:5173
```

##### 2. 🖥️ 后端API服务

```bash
# 1. 确保已配置环境变量 (.env 文件)

# 2. 进入server目录
cd packages/server

# 3. 安装依赖
cnpm install

# 4. 启动API服务器
npm run dev

# 5. 验证服务
# 访问: http://localhost:3001/health
```

##### 3. 💻 Desktop端开发

```bash
# 1. 确保Web端正在运行（localhost:5173）

# 2. 新开一个终端，进入desktop目录
cd packages/desktop

# 3. 安装依赖
cnpm install

# 4. 编译TypeScript代码
npm run build:main

# 5. 启动桌面应用
npm run dev
```

### 🔧 常见问题解决

#### 网络问题
如果遇到依赖安装失败，使用cnpm：
```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

#### TypeScript错误
如果VS Code报"找不到模块"错误：
1. 按 `Ctrl+Shift+P`
2. 搜索并执行：`TypeScript: Restart TS Server`

#### Electron启动失败
```bash
# 确保在正确目录
cd packages/desktop

# 重新编译
npm run build:main

# 启动应用
npm run dev
```

## 📖 文档

- [架构设计文档](./docs/architecture.md)
- [实现指南](./docs/implementation-guide.md)

## 🎬 演示内容

### 视频资源
项目使用高质量开源测试视频，均为Creative Commons授权：

1. **Big Buck Bunny** (2008)
   - 时长：10分钟
   - 分辨率：1920x1080
   - 制作：Blender基金会

2. **Elephant Dream** (2006)
   - 时长：10分钟
   - 分辨率：1920x1080
   - 制作：Orange开放电影项目

3. **Sintel** (2010)
   - 时长：14分钟
   - 分辨率：1920x1080
   - 制作：Durian开放电影项目

### 功能演示
- 视频列表展示和卡片式布局
- 点击播放和全屏功能
- 响应式设计（桌面/平板/手机）
- 错误处理和加载状态
- 跨平台桌面应用

## 开发指南

### 代码规范
- **TypeScript**: 强类型检查，减少运行时错误
- **ESLint**: 统一代码风格和质量标准
- **Prettier**: 自动代码格式化
- **组件化**: 可复用的React组件设计

### Git提交规范
```
feat: 新功能 (feature)
fix: 修复bug
docs: 文档更新
style: 代码格式调整（不影响功能）
refactor: 重构代码
test: 测试相关
chore: 构建工具、依赖更新等
```

### 开发建议
1. **组件设计**: 保持组件职责单一，便于测试和复用
2. **类型安全**: 充分利用TypeScript的类型系统
3. **性能优化**: 使用React.memo、useMemo等优化渲染
4. **错误边界**: 添加错误处理，提升用户体验

## � 详细文档

- [架构设计文档](./docs/architecture.md) - 系统整体架构和技术选型
- [实现指南](./docs/implementation-guide.md) - 详细开发步骤和最佳实践

## 问题反馈

### 常见问题
1. **网络问题**: 使用cnpm替代npm
2. **TypeScript错误**: 重启TS服务器
3. **Electron启动失败**: 检查编译和路径

### 获取帮助
- 查看文档目录下的详细指南
- 检查控制台错误信息
- 确认Node.js和npm版本


