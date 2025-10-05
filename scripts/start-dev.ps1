# 启动开发服务器

Write-Host "================================" -ForegroundColor Cyan
Write-Host "启动视频播放软件开发服务器" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$webPath = "e:\软件管理\t1\packages\web"

if (Test-Path $webPath) {
    Set-Location $webPath
    
    Write-Host "正在启动开发服务器..." -ForegroundColor Yellow
    Write-Host "服务器地址: http://localhost:5173" -ForegroundColor Green
    Write-Host ""
    Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Gray
    Write-Host ""
    
    npm run dev
} else {
    Write-Host "✗ 找不到web目录: $webPath" -ForegroundColor Red
    Write-Host "请先运行初始化脚本: .\scripts\init.ps1" -ForegroundColor Yellow
    exit 1
}
