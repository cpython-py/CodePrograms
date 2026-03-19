/**
 * 数据导出工具
 * 在浏览器控制台执行此代码，生成JSON文件供迁移脚本使用
 */

// 导出用户数据
function exportUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('=== 用户数据 ===');
    console.log(JSON.stringify({ users }, null, 2));
    
    // 创建下载链接
    downloadJSON({ users }, 'users_data.json');
    return users;
}

// 导出资料数据
function exportResources() {
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    console.log('=== 资料数据 ===');
    console.log(JSON.stringify({ resources }, null, 2));
    
    downloadJSON({ resources }, 'resources_data.json');
    return resources;
}

// 导出设置数据
function exportSettings() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    console.log('=== 设置数据 ===');
    console.log(JSON.stringify({ settings }, null, 2));
    
    downloadJSON({ settings }, 'settings_data.json');
    return settings;
}

// 导出所有数据
function exportAllData() {
    const data = {
        users: exportUsers(),
        resources: exportResources(),
        settings: exportSettings()
    };
    
    console.log('=== 全部数据 ===');
    console.log(JSON.stringify(data, null, 2));
    
    downloadJSON(data, 'all_data.json');
    console.log('数据已导出到文件，请保存到 api/ 目录');
}

// 下载JSON文件
function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// 执行导出
exportAllData();
