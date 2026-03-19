/**
 * 数据库服务层 - MySQL API调用
 * 将localStorage替换为MySQL后端
 */

const API_BASE = 'api';

// 检查是否使用MySQL模式
const USE_MYSQL = true; // 设为false则使用localStorage

// ========== 用户相关 ==========

// 用户登录
async function apiLogin(email, password) {
    if (!USE_MYSQL) return localLogin(email, password);
    
    const response = await fetch(`${API_BASE}/users.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
    });
    return await response.json();
}

// 用户注册
async function apiRegister(name, email, password, role = 'user') {
    if (!USE_MYSQL) return localRegister(name, email, password, role);
    
    const response = await fetch(`${API_BASE}/users.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name, email, password, role })
    });
    return await response.json();
}

// 获取用户列表
async function apiGetUsers() {
    if (!USE_MYSQL) return JSON.parse(localStorage.getItem('users') || '[]');
    
    const response = await fetch(`${API_BASE}/users.php?action=list`);
    return await response.json();
}

// 获取用户资料
async function apiGetUserProfile(userId) {
    if (!USE_MYSQL) {
        return JSON.parse(localStorage.getItem(`userProfile_${userId}`) || 'null');
    }
    
    const response = await fetch(`${API_BASE}/users.php?user_id=${userId}`);
    return await response.json();
}

// 保存用户资料
async function apiSaveUserProfile(profile) {
    if (!USE_MYSQL) {
        localStorage.setItem(`userProfile_${profile.user_id}`, JSON.stringify(profile));
        return { success: true };
    }
    
    const response = await fetch(`${API_BASE}/users.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveProfile', ...profile })
    });
    return await response.json();
}

// 删除用户
async function apiDeleteUser(userId) {
    if (!USE_MYSQL) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filtered = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(filtered));
        return { success: true };
    }
    
    const response = await fetch(`${API_BASE}/users.php?user_id=${userId}`, {
        method: 'DELETE'
    });
    return await response.json();
}

// ========== 资料相关 ==========

// 获取资料列表
async function apiGetResources(options = {}) {
    if (!USE_MYSQL) return localResources;
    
    const params = new URLSearchParams();
    if (options.sort) params.append('sort', options.sort);
    if (options.category) params.append('category', options.category);
    if (options.search) params.append('search', options.search);
    
    const response = await fetch(`${API_BASE}/resources.php?${params}`);
    return await response.json();
}

// 添加资料
async function apiAddResource(resource) {
    if (!USE_MYSQL) {
        resource.id = generateId();
        resource.createdAt = new Date().toISOString();
        resource.views = 0;
        localResources.push(resource);
        saveData();
        return { success: true, id: resource.id };
    }
    
    const response = await fetch(`${API_BASE}/resources.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', ...resource })
    });
    return await response.json();
}

// 更新资料
async function apiUpdateResource(resource) {
    if (!USE_MYSQL) {
        const index = localResources.findIndex(r => r.id === resource.id);
        if (index !== -1) {
            localResources[index] = { ...localResources[index], ...resource };
            saveData();
        }
        return { success: true };
    }
    
    const response = await fetch(`${API_BASE}/resources.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', ...resource })
    });
    return await response.json();
}

// 删除资料
async function apiDeleteResource(id) {
    if (!USE_MYSQL) {
        localResources = localResources.filter(r => r.id !== id);
        saveData();
        return { success: true };
    }
    
    const response = await fetch(`${API_BASE}/resources.php?id=${id}`, {
        method: 'DELETE'
    });
    return await response.json();
}

// 增加浏览量
async function apiViewResource(id) {
    if (!USE_MYSQL) return;
    
    await fetch(`${API_BASE}/resources.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'view', id })
    });
}

// ========== 设置相关 ==========

// 获取设置
async function apiGetSettings(userId = null) {
    if (!USE_MYSQL) return JSON.parse(localStorage.getItem('settings') || '{}');
    
    const url = userId ? `${API_BASE}/settings.php?user_id=${userId}` : `${API_BASE}/settings.php`;
    const response = await fetch(url);
    return await response.json();
}

// 保存设置
async function apiSaveSettings(settings, userId = null) {
    if (!USE_MYSQL) {
        localStorage.setItem('settings', JSON.stringify(settings));
        return { success: true };
    }
    
    const response = await fetch(`${API_BASE}/settings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, user_id: userId })
    });
    return await response.json();
}

// ========== LocalStorage后备函数 ==========

function localLogin(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        user.lastLogin = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(users));
        return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }
    return { success: false, message: '登录失败' };
}

function localRegister(name, email, password, role) {
    if (users.some(u => u.email === email)) {
        return { success: false, message: '邮箱已注册' };
    }
    const newUser = { id: generateId(), name, email, password, role, createdAt: new Date().toISOString(), lastLogin: null };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, id: newUser.id };
}

// 导出数据库服务
window.DB = {
    login: apiLogin,
    register: apiRegister,
    getUsers: apiGetUsers,
    getUserProfile: apiGetUserProfile,
    saveUserProfile: apiSaveUserProfile,
    deleteUser: apiDeleteUser,
    getResources: apiGetResources,
    addResource: apiAddResource,
    updateResource: apiUpdateResource,
    deleteResource: apiDeleteResource,
    viewResource: apiViewResource,
    getSettings: apiGetSettings,
    saveSettings: apiSaveSettings,
    useMysql: () => USE_MYSQL
};
