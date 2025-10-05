# 启动Desktop端开发

Write-Host "================================" -ForegroundColor Cyan
Write-Host "启动桌面端开发环境" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$webPath = "e:\软件管理\t1\packages\web"
$desktopPath = "e:\软件管理\t1\packages\desktop"

# 检查路径
if (-not (Test-Path $webPath)) {
    Write-Host "✗ 找不到web目录: $webPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $desktopPath)) {
    Write-Host "✗ 找不到desktop目录: $desktopPath" -ForegroundColor Red
    exit 1
}

Write-Host "正在安装Desktop端依赖..." -ForegroundColor Yellow
Set-Location $desktopPath
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Desktop端依赖安装失败" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "正在启动Web端开发服务器..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd '$webPath'; npm run dev" -WindowStyle Normal

Write-Host "等待Web端服务器启动..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "正在启动Desktop应用..." -ForegroundColor Yellow
npm run dev

Write-Host ""
Write-Host "Desktop开发环境已启动!" -ForegroundColor Green