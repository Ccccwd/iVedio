# 视频播放软件 - 快速启动指南

## 📦 安装步骤

### 1. 安装Web端依赖

打开PowerShell,执行以下命令:

```powershell
# 进入web目录
cd "e:\软件管理\t1\packages\web"

# 安装依赖
npm install
```

### 2. 启动开发服务器

```powershell
# 启动Web端
npm run dev
```

浏览器会自动打开 http://localhost:5173

## 🎯 功能演示

### 首页
- 查看视频列表
- 按分类筛选视频
- 点击视频卡片进入详情页

### 详情页
- 播放视频
- 查看视频信息
- 浏览相关推荐视频
- 返回首页

## 📝 开发说明

### 项目结构
```
packages/web/
├── src/
│   ├── components/      # 组件
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── VideoCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── VideoGrid.tsx
│   ├── pages/          # 页面
│   │   ├── HomePage.tsx
│   │   └── DetailPage.tsx
│   ├── App.tsx         # 应用入口
│   ├── main.tsx        # React入口
│   └── index.css       # 全局样式
├── public/             # 静态资源
├── index.html          # HTML模板
├── package.json
├── vite.config.ts      # Vite配置
└── tailwind.config.js  # Tailwind配置
```

### 技术栈
- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **React Router** - 路由管理
- **Tailwind CSS** - 样式框架
- **Video.js** - 视频播放器
- **Lucide React** - 图标库

### Mock数据位置
`packages/shared/mock-data/videos.json`

## 🔧 常用命令

```powershell
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## 🎨 自定义配置

### 修改主题色
编辑 `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#FF6B00',  // 修改主色调
      }
    }
  }
}
```

### 添加视频
编辑 `packages/shared/mock-data/videos.json`,添加新的视频对象

## 🚀 部署

### 构建
```powershell
npm run build
```

构建产物在 `dist/` 目录,可部署到任何静态托管服务。

## 📱 响应式设计

支持以下断点:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔍 故障排除

### 端口被占用
修改 `vite.config.ts` 中的 `server.port`

### 视频无法播放
1. 检查网络连接
2. 确认视频URL可访问
3. 查看浏览器控制台错误信息

### 依赖安装失败
```powershell
# 清除缓存
npm cache clean --force

# 重新安装
npm install
```

## 📄 许可证
MIT
