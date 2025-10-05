# 视频播放软件 - 初始化脚本
# 用于快速安装和配置项目

Write-Host "================================" -ForegroundColor Cyan
Write-Host "视频播放软件 MVP - 初始化向导" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js
Write-Host "检查Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js版本: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ 未安装Node.js,请先安装Node.js (https://nodejs.org)" -ForegroundColor Red
    exit 1
}

# 检查npm
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ npm版本: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ 未安装npm" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "开始安装Web端依赖..." -ForegroundColor Yellow
Write-Host ""

# 进入web目录
$webPath = "e:\软件管理\t1\packages\web"
if (Test-Path $webPath) {
    Set-Location $webPath
    
    # 安装依赖
    Write-Host "正在安装依赖包,请稍候..." -ForegroundColor Cyan
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================" -ForegroundColor Green
        Write-Host "✓ 安装成功!" -ForegroundColor Green
        Write-Host "================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "启动开发服务器:" -ForegroundColor Yellow
        Write-Host "  cd ""$webPath""" -ForegroundColor Cyan
        Write-Host "  npm run dev" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "或者运行:" -ForegroundColor Yellow
        Write-Host "  .\scripts\start-dev.ps1" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "✗ 安装失败,请检查错误信息" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✗ 找不到web目录: $webPath" -ForegroundColor Red
    exit 1
}
