#!/bin/bash

# iVedio 项目快速启动脚本

echo "🚀 iVedio 视频平台启动中..."

# 检查Node.js版本
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请访问 https://nodejs.org/ 下载安装"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查是否存在环境配置文件
if [ ! -f "packages/server/.env" ]; then
    echo "⚠️  警告: 未找到环境配置文件"
    echo "请复制 packages/server/.env.example 为 .env 并填写配置"
    echo ""
    echo "快速操作："
    echo "  cd packages/server"
    echo "  cp .env.example .env"
    echo "  # 然后编辑 .env 文件填写真实配置"
    exit 1
fi

echo "✅ 环境配置文件已存在"

# 安装依赖
echo "📦 安装前端依赖..."
cd packages/web
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ 前端依赖已安装"
fi

echo "📦 安装后端依赖..."
cd ../server
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ 后端依赖已安装"
fi

cd ../..

echo ""
echo "🎉 准备完成！"
echo ""
echo "启动命令："
echo "  前端开发服务器: cd packages/web && npm run dev"
echo "  后端API服务器:  cd packages/server && npm run dev"
echo ""
echo "访问地址："
echo "  前端应用: http://localhost:5173"
echo "  API接口: http://localhost:3001"
echo "  健康检查: http://localhost:3001/health"
echo ""
echo "📚 更多信息请查看: docs/environment-setup.md"