# iVedio 项目快速启动脚本 (Windows PowerShell)

Write-Host "🚀 iVedio 视频平台启动中..." -ForegroundColor Green

# 检查Node.js版本
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 错误: 未安装 Node.js" -ForegroundColor Red
    Write-Host "请访问 https://nodejs.org/ 下载安装" -ForegroundColor Yellow
    exit 1
}

# 检查是否存在环境配置文件
if (-not (Test-Path "packages/server/.env")) {
    Write-Host "⚠️  警告: 未找到环境配置文件" -ForegroundColor Yellow
    Write-Host "请复制 packages/server/.env.example 为 .env 并填写配置" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "快速操作：" -ForegroundColor Cyan
    Write-Host "  cd packages/server" -ForegroundColor White
    Write-Host "  Copy-Item .env.example .env" -ForegroundColor White
    Write-Host "  # 然后编辑 .env 文件填写真实配置" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ 环境配置文件已存在" -ForegroundColor Green

# 安装依赖
Write-Host "📦 安装前端依赖..." -ForegroundColor Blue
Set-Location "packages/web"
if (-not (Test-Path "node_modules")) {
    npm install
} else {
    Write-Host "✅ 前端依赖已安装" -ForegroundColor Green
}

Write-Host "📦 安装后端依赖..." -ForegroundColor Blue
Set-Location "../server"
if (-not (Test-Path "node_modules")) {
    npm install
} else {
    Write-Host "✅ 后端依赖已安装" -ForegroundColor Green
}

Set-Location "../.."

Write-Host ""
Write-Host "🎉 准备完成！" -ForegroundColor Green
Write-Host ""
Write-Host "启动命令：" -ForegroundColor Cyan
Write-Host "  前端开发服务器: cd packages/web; npm run dev" -ForegroundColor White
Write-Host "  后端API服务器:  cd packages/server; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "访问地址：" -ForegroundColor Cyan
Write-Host "  前端应用: http://localhost:5173" -ForegroundColor White
Write-Host "  API接口: http://localhost:3001" -ForegroundColor White
Write-Host "  健康检查: http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "📚 更多信息请查看: docs/environment-setup.md" -ForegroundColor Gray