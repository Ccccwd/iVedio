const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始构建桌面应用...');

// 检查依赖
console.log('检查依赖...');
try {
  execSync('npm --version', { stdio: 'inherit' });
} catch (error) {
  console.error('npm未安装，请先安装Node.js');
  process.exit(1);
}

// 构建web应用
console.log('构建web应用...');
try {
  execSync('npm run build:web', { stdio: 'inherit' });
} catch (error) {
  console.error('Web应用构建失败:', error.message);
  process.exit(1);
}

// 构建主进程
console.log('构建主进程...');
try {
  execSync('npm run build:main', { stdio: 'inherit' });
} catch (error) {
  console.error('主进程构建失败:', error.message);
  process.exit(1);
}

console.log('桌面应用构建完成！');
console.log('运行以下命令启动应用:');
console.log('  npm run start:electron');
console.log('');
console.log('打包应用:');
console.log('  npm run pack:win    # Windows安装包');
console.log('  npm run pack:mac    # macOS安装包');
console.log('  npm run pack:linux  # Linux安装包');