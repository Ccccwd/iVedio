import { sequelize } from '../config/database';
import { QueryInterface } from 'sequelize';

async function addNewVideoFields() {
  try {
    console.log('🔧 开始添加视频表新字段...');
    
    const queryInterface: QueryInterface = sequelize.getQueryInterface();
    
    // 检查字段是否已存在
    const tableDescription = await queryInterface.describeTable('videos');
    console.log('当前视频表字段:', Object.keys(tableDescription));
    
    // 添加 previewVideoUrl 字段
    if (!tableDescription.previewVideoUrl) {
      await queryInterface.addColumn('videos', 'previewVideoUrl', {
        type: 'VARCHAR(512)',
        allowNull: true,
        comment: '预览视频URL（10-30秒片段）'
      });
      console.log('✅ 已添加 previewVideoUrl 字段');
    } else {
      console.log('⚠️ previewVideoUrl 字段已存在');
    }
    
    // 添加 posterUrl 字段
    if (!tableDescription.posterUrl) {
      await queryInterface.addColumn('videos', 'posterUrl', {
        type: 'VARCHAR(512)',
        allowNull: true,
        comment: '海报图片URL（高分辨率）'
      });
      console.log('✅ 已添加 posterUrl 字段');
    } else {
      console.log('⚠️ posterUrl 字段已存在');
    }
    
    console.log('🎉 视频表字段添加完成！');
    
    // 重新检查表结构
    const updatedTableDescription = await queryInterface.describeTable('videos');
    console.log('更新后的字段:', Object.keys(updatedTableDescription));
    
  } catch (error) {
    console.error('❌ 添加字段失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  addNewVideoFields()
    .then(() => {
      console.log('✨ 数据库字段添加完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error);
      process.exit(1);
    });
}

export { addNewVideoFields };