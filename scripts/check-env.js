const fs = require('fs');
const path = require('path');

// 环境配置检查脚本
console.log('🔍 iVedio 环境配置检查\n');

const envPath = path.join(__dirname, '../packages/server/.env');
const envExamplePath = path.join(__dirname, '../packages/server/.env.example');

// 检查 .env 文件是否存在
if (!fs.existsSync(envPath)) {
    console.log('❌ 错误: 未找到 .env 配置文件');
    console.log('请执行以下命令：');
    console.log('  cd packages/server');
    console.log('  cp .env.example .env');
    console.log('  # 然后编辑 .env 文件填写真实配置\n');
    process.exit(1);
}

console.log('✅ 找到环境配置文件');

// 读取 .env 文件
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n').filter(line => 
    line.trim() && !line.startsWith('#') && line.includes('=')
);

// 需要检查的必需配置项
const requiredVars = [
    'TENCENT_SECRET_ID',
    'TENCENT_SECRET_KEY', 
    'TENCENT_REGION',
    'COS_BUCKET_VIDEOS',
    'COS_BUCKET_IMAGES',
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET'
];

const envVars = {};
envLines.forEach(line => {
    const [key, value] = line.split('=');
    envVars[key.trim()] = value.trim();
});

console.log('\n📋 配置项检查:');

let hasErrors = false;

requiredVars.forEach(varName => {
    const value = envVars[varName];
    if (!value || value.includes('your_') || value.includes('here')) {
        console.log(`❌ ${varName}: 未配置或使用示例值`);
        hasErrors = true;
    } else {
        // 对敏感信息进行部分隐藏
        let displayValue = value;
        if (varName.includes('SECRET') || varName.includes('PASSWORD')) {
            displayValue = value.substring(0, 8) + '***';
        }
        console.log(`✅ ${varName}: ${displayValue}`);
    }
});

if (hasErrors) {
    console.log('\n⚠️  警告: 发现未配置的项目');
    console.log('请编辑 packages/server/.env 文件，填写正确的配置值');
    console.log('详细配置说明请查看: docs/environment-setup.md\n');
    process.exit(1);
}

console.log('\n🎉 环境配置检查通过！');
console.log('\n下一步：');
console.log('  1. 启动后端服务: cd packages/server && npm run dev');
console.log('  2. 启动前端服务: cd packages/web && npm run dev');
console.log('  3. 访问应用: http://localhost:5173\n');