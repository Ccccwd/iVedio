# iVedio 桌面应用

基于Electron封装的iVedio视频播放平台桌面版本。

## 功能特性

- 🎬 视频播放器（支持弹幕功能）
- 📱 响应式设计
- 🖥️ 原生桌面应用体验
- 🔄 自动更新支持
- 📦 跨平台打包

## 开发环境要求

- Node.js 16+
- npm 或 yarn

## 快速开始

### 1. 安装依赖

```bash
cd packages/desktop
npm install
```

### 2. 开发模式运行

```bash
# 确保web应用开发服务器正在运行 (端口5173)
cd ../web
npm run dev

# 新开终端，运行桌面应用
cd ../desktop
npm run dev
```

### 3. 生产构建

```bash
# 构建桌面应用
npm run build

# 运行构建后的应用
npm run start:electron
```

## 打包发布

### Windows
```bash
npm run pack:win
```

### macOS
```bash
npm run pack:mac
```

### Linux
```bash
npm run pack:linux
```

打包后的文件将在 `dist-app` 目录中。

## 项目结构

```
desktop/
├── src/main/           # 主进程代码
│   ├── main.ts         # 主进程入口
│   └── preload.ts      # 预加载脚本
├── assets/             # 应用资源
│   └── icon.svg        # 应用图标
├── scripts/           # 构建脚本
│   └── build.js        # 构建脚本
├── dist/              # 构建输出
└── package.json       # 项目配置
```

## 配置说明

### 开发环境
- 加载本地web开发服务器 (http://localhost:5173)
- 自动打开开发者工具

### 生产环境
- 加载构建后的web应用文件
- 关闭开发者工具
- 启用安全设置

## 注意事项

1. 确保web应用已正确构建
2. 生产环境需要先运行 `npm run build:web`
3. 图标文件需要转换为特定格式（ICO, ICNS, PNG）
4. 打包前请测试所有功能

## 故障排除

### 应用无法启动
- 检查Node.js版本
- 确认所有依赖已安装
- 查看控制台错误信息

### 打包失败
- 检查electron-builder配置
- 确认图标文件存在
- 查看构建日志

### 功能异常
- 检查web应用是否正常运行
- 确认API接口可访问
- 查看Electron主进程日志

## 技术栈

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **桌面**: Electron 28
- **构建**: electron-builder
- **包管理**: npm

## 许可证

MIT License