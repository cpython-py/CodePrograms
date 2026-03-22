// 示例数据 - 移动端测试用
const sampleResources = [
    {
        id: 'sample001',
        name: 'Python入门教程',
        category: 'Python',
        link: 'https://pan.baidu.com/s/example1',
        extractCode: 'python',
        description: 'Python编程入门经典教程',
        tags: 'Python,教程,入门',
        views: 156,
        createdAt: new Date().toISOString()
    },
    {
        id: 'sample002',
        name: 'JavaScript高级编程',
        category: '前端',
        link: 'https://pan.baidu.com/s/example2',
        extractCode: 'js123',
        description: 'JavaScript核心技术进阶',
        tags: 'JavaScript,前端,进阶',
        views: 243,
        createdAt: new Date().toISOString()
    },
    {
        id: 'sample003',
        name: '网络安全基础',
        category: '网络安全',
        link: 'https://pan.baidu.com/s/example3',
        extractCode: 'sec001',
        description: '网络安全入门指南',
        tags: '安全,网络,入门',
        views: 89,
        createdAt: new Date().toISOString()
    }
];

// 数据存储
let resources = JSON.parse(localStorage.getItem('resources')) || sampleResources;
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: '用户',
    email: '',
    phone: '',
    bio: '',
    school: '',
    grade: '',
    interest: '',
    createdAt: new Date().toISOString()
};
let settings = JSON.parse(localStorage.getItem('settings')) || {
    perPage: 24,
    sortOrder: 'newest',
    accessibility: false
};

// 用户认证
let users = JSON.parse(localStorage.getItem('users')) || [
    {
        id: 'admin001',
        name: '管理员',
        email: 'admin@qq.com',
        password: 'admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: null
    }
];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// 验证和清理管理员账户
function validateAdminAccount() {
    const ADMIN_EMAIL = 'admin@qq.com';
    const ADMIN_PASSWORD = 'admin';
    
    // 查找所有管理员账户
    const adminAccounts = users.filter(u => u.role === 'admin');
    
    // 查找正确的管理员账户
    let correctAdmin = users.find(u => u.email === ADMIN_EMAIL && u.role === 'admin');
    
    // 如果不存在正确的管理员账户，创建它
    if (!correctAdmin) {
        correctAdmin = {
            id: 'admin001',
            name: '管理员',
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: 'admin',
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        users.push(correctAdmin);
    } else {
        // 确保密码正确
        correctAdmin.password = ADMIN_PASSWORD;
    }
    
    // 删除其他管理员账户（只保留正确的管理员账户）
    users = users.filter(u => 
        u.role !== 'admin' || 
        (u.email === ADMIN_EMAIL && u.role === 'admin')
    );
    
    // 确保只有一个管理员账户（如果重复，保留第一个）
    const remainingAdmins = users.filter(u => u.role === 'admin');
    if (remainingAdmins.length > 1) {
        // 保留正确的管理员账户，删除其他
        const correctAdminIndex = users.findIndex(u => u.email === ADMIN_EMAIL && u.role === 'admin');
        users = users.filter((u, index) => 
            u.role !== 'admin' || index === correctAdminIndex
        );
    }
    
    // 保存到本地存储
    localStorage.setItem('users', JSON.stringify(users));
}

// 初始化应用
function initApp() {
    initSampleData(); // 初始化示例数据
    validateAdminAccount(); // 确保管理员账户唯一且凭据正确
    
    // 验证当前登录用户：如果是管理员但邮箱不正确，强制注销
    if (currentUser && currentUser.role === 'admin' && currentUser.email !== 'admin@qq.com') {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showToast('管理员账户已更新，请重新登录', 'warning');
    }
    
    loadProfile();
    loadSettings();
    initAccessibility();
    updateUserUI();
    
    // 确保在渲染前数据已加载
    renderResources();
    updateStats();
    updateMyStats();
    
    // 如果未登录，自动打开登录模态框
    if (!currentUser) {
        setTimeout(() => openLoginModal(), 500);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', initApp);

// ========== 页面切换功能 ==========
function switchPage(page) {
    // 管理员页面权限检查
    const adminPages = ['manage', 'users'];
    if (adminPages.includes(page)) {
        if (!currentUser || currentUser.role !== 'admin') {
            showToast('权限不足，无法访问管理页面', 'error');
            page = 'home'; // 重定向到首页
        }
    }

    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // 显示目标页面
    document.getElementById(page + 'Page').classList.add('active');

    // 更新导航激活状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    // 页面特定初始化
    switch (page) {
        case 'home':
            renderResources();
            break;
        case 'manage':
            renderManageResources();
            break;
        case 'users':
            renderUsers();
            break;
        case 'profile':
            loadProfile();
            break;
        case 'settings':
            loadSettings();
            break;
    }

    // 移动端关闭侧边栏
    if (window.innerWidth <= 1024) {
        document.getElementById('sidebar').classList.remove('show');
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }
}

// ========== 用户认证功能 ==========
function updateUserUI() {
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userRoleDisplay = document.getElementById('userRoleDisplay');
    const userAvatar = document.getElementById('userAvatar');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const body = document.body;

    if (currentUser) {
        userNameDisplay.textContent = currentUser.name;
        userRoleDisplay.textContent = currentUser.role === 'admin' ? '管理员' : '普通用户';
        userAvatar.textContent = currentUser.role === 'admin' ? '👑' : '👤';
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        // 根据角色添加/移除admin类
        if (currentUser.role === 'admin') {
            body.classList.add('admin');
        } else {
            body.classList.remove('admin');
        }
        // 更新个人资料页面中的邮箱显示（如果匹配）
        if (currentUser.email && document.getElementById('userEmail')) {
            document.getElementById('userEmail').value = currentUser.email;
        }
    } else {
        userNameDisplay.textContent = '未登录';
        userRoleDisplay.textContent = '请登录';
        userAvatar.textContent = '👤';
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        body.classList.remove('admin');
    }
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('show');
    switchTab('login');
    document.getElementById('loginEmail').focus();
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
}

function switchTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// 登录处理
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const role = document.getElementById('loginRole').value;

    // 显示加载提示
    showToast('正在验证登录...', 'info');

    // 管理员账户硬编码验证
    if (role === 'admin') {
        // 唯一的管理员账户凭据
        const ADMIN_EMAIL = 'admin@qq.com';
        const ADMIN_PASSWORD = 'admin';
        
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // 在users数组中查找或创建管理员账户
            let adminUser = users.find(u => u.email === ADMIN_EMAIL && u.role === 'admin');
            if (!adminUser) {
                // 如果不存在，创建默认管理员账户
                adminUser = {
                    id: 'admin001',
                    name: '管理员',
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASSWORD,
                    role: 'admin',
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                };
                users.push(adminUser);
            }
            
            // 更新登录信息
            adminUser.lastLogin = new Date().toISOString();
            adminUser.password = ADMIN_PASSWORD; // 确保密码为固定值
            
            currentUser = {
                id: adminUser.id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('users', JSON.stringify(users));
            updateUserUI();
            closeLoginModal();
            showToast('管理员登录成功！');
            switchPage('manage');
            return;
        } else {
            showToast('管理员账户验证失败，邮箱或密码错误', 'error');
            return;
        }
    }
    
    // 普通用户验证 - 重新从最新users数组中查找
    users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
        currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        user.lastLogin = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(users));
        
        updateUserUI();
        closeLoginModal();
        showToast('登录成功！');
        switchPage('home');
    } else {
        showToast('登录失败，请检查邮箱、密码和角色', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
    const role = document.getElementById('registerRole').value;

    if (!name || !email || !password) {
        showToast('请填写所有必填字段', 'error');
        return;
    }
    if (password.length < 6) {
        showToast('密码长度至少6位', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showToast('两次输入的密码不一致', 'error');
        return;
    }
    // 禁止注册管理员账户
    if (role === 'admin') {
        showToast('不允许注册管理员账户，管理员账户已预定义', 'error');
        return;
    }
    // 禁止使用管理员专用邮箱
    if (email === 'admin@qq.com') {
        showToast('该邮箱为管理员专用，请使用其他邮箱', 'error');
        return;
    }
    if (users.some(u => u.email === email)) {
        showToast('该邮箱已被注册', 'error');
        return;
    }

    const newUser = {
        id: generateId(),
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showToast('注册成功！请登录');
    switchTab('login');
    // 预填充登录表单
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginRole').value = role;
}

function logout() {
    if (!confirm('确定要退出登录吗？')) return;
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserUI();
    showToast('已退出登录');
    switchPage('home');
}

// 切换侧边栏
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('show');
    if (overlay) {
        overlay.classList.toggle('show');
    }
}

// 移动端用户按钮点击处理
function handleMobileUserClick() {
    if (currentUser) {
        // 已登录，显示用户菜单
        switchPage('profile');
    } else {
        // 未登录，打开登录模态框
        openLoginModal();
    }
}

// ========== 无障碍功能 ==========
function toggleAccessibility() {
    const panel = document.getElementById('accessibilityPanel');
    panel.classList.toggle('show');
}

function initAccessibility() {
    // 恢复保存的无障碍设置
    const savedFontSize = localStorage.getItem('fontSize');
    const savedHighContrast = localStorage.getItem('highContrast');
    const savedLetterSpacing = localStorage.getItem('letterSpacing');
    const savedLineHeight = localStorage.getItem('lineHeight');

    if (savedFontSize) {
        changeFontSize(savedFontSize, false);
    }
    if (savedHighContrast === 'true') {
        document.getElementById('highContrast').checked = true;
        toggleHighContrast();
    }
    if (savedLetterSpacing) {
        document.getElementById('letterSpacing').value = savedLetterSpacing;
        changeLetterSpacing(savedLetterSpacing);
    }
    if (savedLineHeight) {
        document.getElementById('lineHeight').value = savedLineHeight;
        changeLineHeight(savedLineHeight);
    }
}

function changeFontSize(size, save = true) {
    const body = document.body;
    body.classList.remove('font-small', 'font-normal', 'font-large');
    body.classList.add('font-' + size);

    // 更新按钮状态
    document.querySelectorAll('.font-controls button').forEach(btn => {
        btn.classList.remove('active');
    });
    event?.target?.classList.add('active');

    if (save) {
        localStorage.setItem('fontSize', size);
    }
}

function toggleHighContrast() {
    const enabled = document.getElementById('highContrast').checked;
    document.body.classList.toggle('high-contrast', enabled);
    localStorage.setItem('highContrast', enabled);
}

function changeLetterSpacing(value) {
    document.body.style.letterSpacing = value + 'px';
    localStorage.setItem('letterSpacing', value);
}

function changeLineHeight(value) {
    document.body.style.lineHeight = value + '%';
    localStorage.setItem('lineHeight', value);
}

function resetAccessibility() {
    changeFontSize('normal');
    document.getElementById('highContrast').checked = false;
    toggleHighContrast();
    document.getElementById('letterSpacing').value = 0;
    changeLetterSpacing(0);
    document.getElementById('lineHeight').value = 150;
    changeLineHeight(150);

    localStorage.removeItem('fontSize');
    localStorage.removeItem('highContrast');
    localStorage.removeItem('letterSpacing');
    localStorage.removeItem('lineHeight');

    showToast('无障碍设置已重置');
}

function toggleAccessibilityMode() {
    const enabled = document.getElementById('enableAccessibility').checked;
    document.body.classList.toggle('accessibility-mode', enabled);
    settings.accessibility = enabled;
    saveSettings();
}

// ========== 个人信息功能 ==========
function loadProfile() {
    document.getElementById('userName').value = userProfile.name || '';
    document.getElementById('userEmail').value = userProfile.email || '';
    document.getElementById('userPhone').value = userProfile.phone || '';
    document.getElementById('userBio').value = userProfile.bio || '';
    document.getElementById('userSchool').value = userProfile.school || '';
    document.getElementById('userGrade').value = userProfile.grade || '';
    document.getElementById('userInterest').value = userProfile.interest || '';

    document.getElementById('profileName').textContent = userProfile.name || '用户';
    document.getElementById('profileBio').textContent = userProfile.bio || '这个人很懒，什么都没写~';
}

function saveProfile() {
    userProfile = {
        ...userProfile,
        userId: currentUser ? currentUser.id : null,
        name: document.getElementById('userName').value.trim() || '用户',
        email: document.getElementById('userEmail').value.trim(),
        phone: document.getElementById('userPhone').value.trim(),
        bio: document.getElementById('userBio').value.trim(),
        school: document.getElementById('userSchool').value.trim(),
        grade: document.getElementById('userGrade').value.trim(),
        interest: document.getElementById('userInterest').value.trim(),
        updatedAt: new Date().toISOString()
    };

    // 保存到当前用户个人资料
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // 保存到用户独立存储
    if (currentUser && currentUser.id) {
        localStorage.setItem('userProfile_' + currentUser.id, JSON.stringify(userProfile));
    }
    
    loadProfile();
    showToast('个人信息保存成功！');
}

function resetProfile() {
    if (!confirm('确定要重置个人信息吗？')) return;

    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPhone').value = '';
    document.getElementById('userBio').value = '';
    document.getElementById('userSchool').value = '';
    document.getElementById('userGrade').value = '';
    document.getElementById('userInterest').value = '';
}

function updateMyStats() {
    const myResourceCount = resources.length;
    const myViewCount = resources.reduce((sum, r) => sum + (r.views || 0), 0);
    const daysSinceCreation = Math.floor((new Date() - new Date(userProfile.createdAt)) / (1000 * 60 * 60 * 24));

    document.getElementById('myResourceCount').textContent = myResourceCount;
    document.getElementById('myViewCount').textContent = myViewCount;
    document.getElementById('myDays').textContent = daysSinceCreation;
}

// ========== 设置功能 ==========
function loadSettings() {
    document.getElementById('perPageCount').value = settings.perPage;
    document.getElementById('sortOrder').value = settings.sortOrder;
    document.getElementById('enableAccessibility').checked = settings.accessibility;
}

function saveSettings() {
    settings = {
        perPage: parseInt(document.getElementById('perPageCount').value),
        sortOrder: document.getElementById('sortOrder').value,
        accessibility: document.getElementById('enableAccessibility').checked
    };

    localStorage.setItem('settings', JSON.stringify(settings));
    showToast('设置已保存');
}

function exportData() {
    const data = {
        resources: resources,
        profile: userProfile,
        settings: settings,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `学习资料备份_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('数据导出成功！');
}

function importData() {
    document.getElementById('importFile').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            if (data.resources) {
                resources = data.resources;
                localStorage.setItem('resources', JSON.stringify(resources));
            }
            if (data.profile) {
                userProfile = data.profile;
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
            }
            if (data.settings) {
                settings = data.settings;
                localStorage.setItem('settings', JSON.stringify(settings));
            }

            loadProfile();
            loadSettings();
            renderResources();
            updateStats();
            updateMyStats();
            showToast('数据导入成功！');
        } catch (error) {
            showToast('导入失败：文件格式错误', 'error');
        }
    };
    reader.readAsText(file);
}

function clearAllData() {
    if (!confirm('确定要清空所有数据吗？此操作不可恢复！')) return;
    if (!confirm('再次确认：真的要清空所有数据吗？')) return;

    localStorage.clear();
    resources = [];
    userProfile = {
        name: '用户',
        email: '',
        phone: '',
        bio: '',
        school: '',
        grade: '',
        interest: '',
        createdAt: new Date().toISOString()
    };
    settings = {
        perPage: 24,
        sortOrder: 'newest',
        accessibility: false
    };

    loadProfile();
    loadSettings();
    renderResources();
    updateStats();
    updateMyStats();
    showToast('所有数据已清空', 'warning');
}

// ========== 用户管理功能 ==========
function renderUsers(filteredList = null) {
    const tableBody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('usersEmptyState');
    const list = filteredList || users;

    if (list.length === 0) {
        tableBody.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    tableBody.style.display = 'table-row-group';
    emptyState.style.display = 'none';

    tableBody.innerHTML = list.map(user => {
        const isCurrentUser = currentUser && currentUser.id === user.id;
        return `
            <tr>
                <td>
                    ${escapeHtml(user.name)}
                    ${isCurrentUser ? '<span style="color:#8b1a1a;">（当前）</span>' : ''}
                </td>
                <td>${escapeHtml(user.email)}</td>
                <td>
                    <span class="role-badge role-${user.role}">
                        ${user.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                </td>
                <td>${formatDate(user.createdAt, true)}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewUserDetail('${user.id}')" aria-label="查看用户详情">
                        详情
                    </button>
                    ${!isCurrentUser ? `
                    <button class="action-btn delete-btn" onclick="deleteUser('${user.id}')" aria-label="删除用户">
                        删除
                    </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

function searchUsers() {
    const query = document.getElementById('userSearchInput').value.toLowerCase().trim();
    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
    renderUsers(filtered);
}

function openAddUserModal() {
    // 暂时简单实现：使用注册表单
    openLoginModal();
    switchTab('register');
}

function deleteUser(id) {
    if (!currentUser || currentUser.role !== 'admin') {
        showToast('权限不足', 'error');
        return;
    }
    const user = users.find(u => u.id === id);
    if (!user) return;
    if (user.id === currentUser.id) {
        showToast('不能删除自己', 'error');
        return;
    }
    if (!confirm(`确定要删除用户 "${user.name}" 吗？此操作不可恢复！`)) return;
    
    // 同步删除云端用户
    syncDeleteUserToCloud(id);
    
    users = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
    showToast('用户已删除', 'warning');
}

// 查看用户详情
function viewUserDetail(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        showToast('用户不存在', 'error');
        return;
    }

    // 从localStorage获取用户个人资料
    let userProfile = null;
    const savedProfile = localStorage.getItem('userProfile_' + userId);
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
    }

    const roleText = user.role === 'admin' ? '管理员' : '普通用户';
    const lastLoginText = user.lastLogin ? formatDate(user.lastLogin, true) : '从未登录';

    const detailContent = document.getElementById('userDetailContent');
    detailContent.innerHTML = `
        <div class="user-detail-section">
            <div class="detail-header">
                <div class="avatar-large">${user.role === 'admin' ? '👑' : '👤'}</div>
                <h3>${escapeHtml(user.name)}</h3>
                <span class="role-badge role-${user.role}">${roleText}</span>
            </div>
        </div>
        <div class="detail-section">
            <h4>📧 账户信息</h4>
            <div class="detail-info">
                <p><strong>邮箱:</strong> ${escapeHtml(user.email)}</p>
                <p><strong>注册时间:</strong> ${formatDate(user.createdAt, true)}</p>
                <p><strong>最后登录:</strong> ${lastLoginText}</p>
            </div>
        </div>
        ${userProfile ? `
        <div class="detail-section">
            <h4>👤 个人资料</h4>
            <div class="detail-info">
                ${userProfile.phone ? `<p><strong>手机号:</strong> ${escapeHtml(userProfile.phone)}</p>` : ''}
                ${userProfile.bio ? `<p><strong>个人简介:</strong> ${escapeHtml(userProfile.bio)}</p>` : ''}
                ${userProfile.school ? `<p><strong>学校/机构:</strong> ${escapeHtml(userProfile.school)}</p>` : ''}
                ${userProfile.grade ? `<p><strong>年级/班级:</strong> ${escapeHtml(userProfile.grade)}</p>` : ''}
                ${userProfile.interest ? `<p><strong>学习兴趣:</strong> ${escapeHtml(userProfile.interest)}</p>` : ''}
            </div>
        </div>
        ` : ''}
        <div class="detail-section">
            <h4>📊 用户统计</h4>
            <div class="detail-info">
                <p><strong>分享资料数:</strong> ${resources.filter(r => r.creatorId === userId).length}</p>
            </div>
        </div>
    `;

    document.getElementById('userDetailModal').classList.add('show');
}

function closeUserDetailModal() {
    document.getElementById('userDetailModal').classList.remove('show');
}

// ========== 资料管理功能 ==========
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function renderResources(filteredList = null) {
    const grid = document.getElementById('resourcesGrid');
    const emptyState = document.getElementById('emptyState');
    const list = filteredList || resources;

    if (list.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    grid.innerHTML = list.map(resource => {
        let categoryDisplay = resource.category === 'other' ? '其他' : resource.category;
        let hsSubjectBadge = '';

        if (resource.category === '高中资料' && resource.hsSubject) {
            categoryDisplay = `高中资料`;
            hsSubjectBadge = `<span class="hs-subject-badge">${resource.hsSubject}</span>`;
        }

        return `
            <div class="resource-card" tabindex="0" role="article" aria-label="${escapeHtml(resource.name)}">
                <div class="card-header">
                    <div>
                        <span class="category-badge category-${resource.category}">${categoryDisplay}</span>
                        ${hsSubjectBadge}
                    </div>
                    ${currentUser && currentUser.role === 'admin' ? `
                    <div class="card-actions">
                        <button class="edit-btn" onclick="editResource('${resource.id}')" aria-label="编辑资料">✏️</button>
                        <button class="delete-btn" onclick="deleteResource('${resource.id}')" aria-label="删除资料">🗑️</button>
                    </div>
                    ` : ''}
                </div>
                <h3 class="card-title">${escapeHtml(resource.name)}</h3>
                <p class="card-desc">${escapeHtml(resource.description) || '暂无描述'}</p>
                <a href="${escapeHtml(resource.link)}" target="_blank" class="card-link" aria-label="打开百度网盘链接">
                    🔗 百度网盘
                </a>
                ${resource.extractCode ? `<span class="extract-code">提取码: ${escapeHtml(resource.extractCode)}</span>` : ''}
                ${resource.tags ? `
                    <div class="card-tags" aria-label="标签">
                        ${resource.tags.split(',').map(tag => `<span class="tag">${escapeHtml(tag.trim())}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="card-footer">
                    <span class="card-date">${formatDate(resource.createdAt)}</span>
                    <div class="card-views">
                        🔥 <span>${resource.views || 0}</span> 次
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderManageResources(filteredList = null) {
    const grid = document.getElementById('manageResourcesGrid');
    const emptyState = document.getElementById('manageEmptyState');
    const list = filteredList || resources;

    if (list.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    grid.innerHTML = list.map(resource => {
        let categoryDisplay = resource.category === 'other' ? '其他' : resource.category;
        let hsSubjectBadge = '';

        if (resource.category === '高中资料' && resource.hsSubject) {
            categoryDisplay = `高中资料`;
            hsSubjectBadge = `<span class="hs-subject-badge">${resource.hsSubject}</span>`;
        }

        return `
            <div class="resource-card" tabindex="0" role="article" aria-label="${escapeHtml(resource.name)}">
                <div class="card-header">
                    <div>
                        <span class="category-badge category-${resource.category}">${categoryDisplay}</span>
                        ${hsSubjectBadge}
                    </div>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="editResource('${resource.id}')" aria-label="编辑资料">✏️</button>
                        <button class="delete-btn" onclick="deleteResource('${resource.id}')" aria-label="删除资料">🗑️</button>
                    </div>
                </div>
                <h3 class="card-title">${escapeHtml(resource.name)}</h3>
                <p class="card-desc">${escapeHtml(resource.description) || '暂无描述'}</p>
                <a href="${escapeHtml(resource.link)}" target="_blank" class="card-link" aria-label="打开百度网盘链接">
                    🔗 百度网盘
                </a>
                ${resource.extractCode ? `<span class="extract-code">提取码: ${escapeHtml(resource.extractCode)}</span>` : ''}
                ${resource.tags ? `
                    <div class="card-tags" aria-label="标签">
                        ${resource.tags.split(',').map(tag => `<span class="tag">${escapeHtml(tag.trim())}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="card-footer">
                    <span class="card-date">${formatDate(resource.createdAt)}</span>
                    <div class="card-views">
                        🔥 <span>${resource.views || 0}</span> 次
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function searchManageResources() {
    const query = document.getElementById('manageSearchInput').value.toLowerCase().trim();
    const categoryFilter = document.getElementById('manageCategoryFilter').value;
    let filtered = resources;

    if (query) {
        filtered = filtered.filter(r =>
            r.name.toLowerCase().includes(query) ||
            (r.description && r.description.toLowerCase().includes(query)) ||
            (r.tags && r.tags.toLowerCase().includes(query))
        );
    }

    if (categoryFilter !== 'all') {
        filtered = filtered.filter(r => r.category === categoryFilter);
    }

    renderManageResources(filtered);
}

function filterManageResources() {
    searchManageResources();
}

function updateStats() {
    document.getElementById('totalCount').textContent = resources.length;
    document.getElementById('hotCount').textContent = resources.filter(r => (r.views || 0) > 10).length;
}

function toggleHSSubjects() {
    const category = document.getElementById('resourceCategory').value;
    const hsSubjectGroup = document.getElementById('hsSubjectGroup');
    const hsSubject = document.getElementById('hsSubject');

    if (category === '高中资料') {
        hsSubjectGroup.style.display = 'block';
        hsSubject.required = true;
    } else {
        hsSubjectGroup.style.display = 'none';
        hsSubject.required = false;
        hsSubject.value = '';
    }
}

function openModal(isEdit = false) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('resourceForm');

    modal.classList.add('show');
    modalTitle.textContent = isEdit ? '编辑资料' : '添加资料';

    if (!isEdit) {
        form.reset();
        document.getElementById('resourceId').value = '';
        document.getElementById('hsSubjectGroup').style.display = 'none';
        document.getElementById('hsSubject').required = false;
    }

    // 聚焦到第一个输入框
    document.getElementById('resourceName').focus();
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
}

function handleSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('resourceId').value;
    const name = document.getElementById('resourceName').value.trim();
    const category = document.getElementById('resourceCategory').value;
    const hsSubject = document.getElementById('hsSubject').value;
    const link = document.getElementById('baiduLink').value.trim();
    const extractCode = document.getElementById('extractCode').value.trim();
    const description = document.getElementById('resourceDesc').value.trim();
    const tags = document.getElementById('resourceTags').value.trim();

    if (!isValidBaiduLink(link)) {
        showToast('请输入有效的百度网盘链接', 'error');
        return;
    }

    if (category === '高中资料' && !hsSubject) {
        showToast('请选择高中学科', 'error');
        return;
    }

    if (id) {
        const index = resources.findIndex(r => r.id === id);
        if (index !== -1) {
            resources[index] = {
                ...resources[index],
                name,
                category,
                hsSubject: category === '高中资料' ? hsSubject : null,
                link,
                extractCode,
                description,
                tags,
                updatedAt: new Date().toISOString()
            };
            // 同步到云端
            syncResourceToCloud(resources[index], true);
            showToast('资料更新成功！');
        }
    } else {
        const newResource = {
            id: generateId(),
            name,
            category,
            hsSubject: category === '高中资料' ? hsSubject : null,
            link,
            extractCode,
            description,
            tags,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        resources.unshift(newResource);
        // 同步到云端
        syncResourceToCloud(newResource, false);
        showToast('资料添加成功！');
    }

    saveData();
    renderResources();
    renderManageResources();
    updateStats();
    updateMyStats();
    closeModal();
}

function editResource(id) {
    const resource = resources.find(r => r.id === id);
    if (!resource) return;

    document.getElementById('resourceId').value = resource.id;
    document.getElementById('resourceName').value = resource.name;
    document.getElementById('resourceCategory').value = resource.category;
    document.getElementById('baiduLink').value = resource.link;
    document.getElementById('extractCode').value = resource.extractCode || '';
    document.getElementById('resourceDesc').value = resource.description || '';
    document.getElementById('resourceTags').value = resource.tags || '';

    if (resource.category === '高中资料') {
        document.getElementById('hsSubject').value = resource.hsSubject || '';
        document.getElementById('hsSubjectGroup').style.display = 'block';
        document.getElementById('hsSubject').required = true;
    } else {
        document.getElementById('hsSubjectGroup').style.display = 'none';
        document.getElementById('hsSubject').required = false;
    }

    openModal(true);
}

function deleteResource(id) {
    if (!confirm('确定要删除这个资料吗？')) return;

    // 同步删除云端资料
    syncDeleteResourceToCloud(id);
    
    resources = resources.filter(r => r.id !== id);
    saveData();
    renderResources();
    renderManageResources();
    updateStats();
    updateMyStats();
    showToast('资料已删除', 'warning');
}

function viewResource(id) {
    const resource = resources.find(r => r.id === id);
    if (!resource) return;

    resource.views = (resource.views || 0) + 1;
    saveData();

    const categoryDisplay = resource.category === 'other' ? '其他' : resource.category;
    const hsSubjectInfo = resource.category === '高中资料' && resource.hsSubject
        ? `<p><strong>学科:</strong> <span class="hs-subject-badge">${resource.hsSubject}</span></p>`
        : '';

    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <div class="detail-header">
            <span class="detail-badge category-${resource.category}">${categoryDisplay}</span>
            <h3>${escapeHtml(resource.name)}</h3>
            <p style="color: #999; font-size: 0.9rem;">${formatDate(resource.createdAt)} · 浏览 ${resource.views} 次</p>
        </div>
        <div class="detail-section">
            <a href="${escapeHtml(resource.link)}" target="_blank" class="detail-link">
                🔗 打开百度网盘链接
            </a>
            ${resource.extractCode ? `
                <div class="detail-info" style="margin-top: 10px;">
                    <p><strong>提取码:</strong> <code style="font-size: 1.1rem; color: #8b1a1a; font-weight: bold;">${escapeHtml(resource.extractCode)}</code></p>
                </div>
            ` : ''}
        </div>
        ${hsSubjectInfo ? `
            <div class="detail-section">
                <h4>📚 学科信息</h4>
                <div class="detail-info">
                    ${hsSubjectInfo}
                </div>
            </div>
        ` : ''}
        ${resource.description ? `
            <div class="detail-section">
                <h4>📝 资料描述</h4>
                <p class="detail-desc">${escapeHtml(resource.description)}</p>
            </div>
        ` : ''}
        ${resource.tags ? `
            <div class="detail-section">
                <h4>🏷️ 标签</h4>
                <div class="card-tags">
                    ${resource.tags.split(',').map(tag => `<span class="tag">${escapeHtml(tag.trim())}</span>`).join('')}
                </div>
            </div>
        ` : ''}
        <div class="detail-section">
            <h4>📊 资料信息</h4>
            <div class="detail-info">
                <p><strong>创建时间:</strong> ${formatDate(resource.createdAt, true)}</p>
                <p><strong>更新时间:</strong> ${formatDate(resource.updatedAt, true)}</p>
            </div>
        </div>
    `;

    document.getElementById('detailModal').classList.add('show');
    renderResources();
    updateStats();
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

function searchResources() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const hsFilter = document.getElementById('hsFilter').value;

    let filtered = resources;

    if (query) {
        filtered = filtered.filter(r =>
            r.name.toLowerCase().includes(query) ||
            (r.description && r.description.toLowerCase().includes(query)) ||
            (r.tags && r.tags.toLowerCase().includes(query))
        );
    }

    if (categoryFilter !== 'all') {
        filtered = filtered.filter(r => r.category === categoryFilter);
    }

    if (hsFilter !== 'all') {
        filtered = filtered.filter(r => r.category === '高中资料' && r.hsSubject === hsFilter);
    }

    renderResources(filtered);
}

function filterResources() {
    searchResources();
}

function filterHSResources() {
    searchResources();
}

function saveData() {
    // 保存到本地存储
    localStorage.setItem('resources', JSON.stringify(resources));
}

// 初始化示例数据
function initSampleData() {
    const savedResources = localStorage.getItem('resources');
    if (!savedResources) {
        // 首次使用，保存示例数据
        localStorage.setItem('resources', JSON.stringify(sampleResources));
    }
}

function isValidBaiduLink(link) {
    const patterns = [
        /https?:\/\/pan\.baidu\.com\/s\//i,
        /https?:\/\/yun\.baidu\.com\/s\//i
    ];
    return patterns.some(pattern => pattern.test(link));
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr, full = false) {
    const date = new Date(dateStr);
    if (full) {
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周周`;

    return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 点击模态框外部关闭
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
});

document.getElementById('detailModal').addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') closeDetailModal();
});

document.getElementById('loginModal').addEventListener('click', (e) => {
    if (e.target.id === 'loginModal') closeLoginModal();
});

document.getElementById('userDetailModal').addEventListener('click', (e) => {
    if (e.target.id === 'userDetailModal') closeUserDetailModal();
});

// ESC键关闭模态框和面板
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeDetailModal();
        closeLoginModal();
        closeUserDetailModal();
        document.getElementById('accessibilityPanel').classList.remove('show');
    }
});

// 键盘导航支持
document.addEventListener('keydown', (e) => {
    // Alt + 1: 资料库
    if (e.altKey && e.key === '1') {
        e.preventDefault();
        switchPage('home');
    }
    // Alt + 2: 个人信息
    if (e.altKey && e.key === '2') {
        e.preventDefault();
        switchPage('profile');
    }
    // Alt + 3: 系统设置
    if (e.altKey && e.key === '3') {
        e.preventDefault();
        switchPage('settings');
    }
    // Alt + A: 无障碍模式
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        toggleAccessibility();
    }
    // Alt + M: 切换侧边栏
    if (e.altKey && e.key === 'm') {
        e.preventDefault();
        toggleSidebar();
    }
});
