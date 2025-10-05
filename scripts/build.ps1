# 构建生产版本

Write-Host "================================" -ForegroundColor Cyan
Write-Host "构建生产版本" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$webPath = "e:\软件管理\t1\packages\web"

if (Test-Path $webPath) {
    Set-Location $webPath
    
    Write-Host "正在构建..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ 构建成功!" -ForegroundColor Green
        Write-Host "构建产物位置: $webPath\dist" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "预览构建结果:" -ForegroundColor Yellow
        Write-Host "  npm run preview" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "✗ 构建失败" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✗ 找不到web目录: $webPath" -ForegroundColor Red
    exit 1
}
