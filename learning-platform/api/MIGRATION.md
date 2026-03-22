# MySQL 迁移指南

## 概述

本文档说明如何将学习平台从 localStorage 迁移到 MySQL 数据库。

## 文件结构

```
learning-platform/
├── api/
│   ├── db.php          # 数据库连接配置
│   ├── users.php       # 用户API
│   ├── resources.php   # 资料API
│   ├── settings.php    # 设置API
│   ├── migrate.php     # 数据迁移脚本
│   ├── init.sql        # 数据库初始化SQL
│   └── export_data.js  # 数据导出工具
├── js/
│   └── database.js     # 前端数据库服务层
└── ...
```

## 迁移步骤

### 步骤1: 创建数据库

在 MySQL 中执行初始化脚本：

```bash
mysql -u root -p < api/init.sql
```

或通过 phpMyAdmin 导入 `api/init.sql`。

### 步骤2: 配置数据库连接

编辑 `api/db.php`，修改数据库凭据：

```php
$db_config = [
    'host' => 'localhost',
    'dbname' => 'learning_platform',
    'username' => 'your_username',  // 修改为你的用户名
    'password' => 'your_password',  // 修改为你的密码
    'charset' => 'utf8mb4'
];
```

### 步骤3: 导出现有数据

1. 在浏览器中打开学习平台
2. 打开开发者工具 (F12)
3. 在控制台中粘贴 `api/export_data.js` 的内容并执行
4. 将下载的 JSON 文件保存到 `api/` 目录：
   - `users_data.json`
   - `resources_data.json`
   - `settings_data.json`

### 步骤4: 执行迁移

```bash
cd api
php migrate.php
```

### 步骤5: 更新前端代码

在 `js/database.js` 中确认 `USE_MYSQL = true`：

```javascript
const USE_MYSQL = true;
```

### 步骤6: 测试

启动 PHP 内置服务器：

```bash
php -S localhost:8000
```

访问 http://localhost:8000 测试功能。

---

## 回滚

如果迁移出现问题，可以回滚：

```bash
php migrate.php --rollback
```

这将删除所有数据表，但不会删除 JSON 导出文件。

---

## API 接口

### 用户接口

| 方法 | URL | 参数 | 说明 |
|------|-----|------|------|
| POST | /users.php | action=login, email, password | 用户登录 |
| POST | /users.php | action=register, name, email, password, role | 用户注册 |
| GET | /users.php?action=list | - | 获取用户列表 |
| GET | /users.php?user_id=xxx | - | 获取用户资料 |
| POST | /users.php | action=saveProfile, ... | 保存用户资料 |
| DELETE | /users.php?user_id=xxx | - | 删除用户 |

### 资料接口

| 方法 | URL | 参数 | 说明 |
|------|-----|------|------|
| GET | /resources.php | sort, category, search | 获取资料列表 |
| POST | /resources.php | action=add, ... | 添加资料 |
| POST | /resources.php | action=update, ... | 更新资料 |
| POST | /resources.php | action=view, id | 增加浏览量 |
| DELETE | /resources.php?id=xxx | - | 删除资料 |

### 设置接口

| 方法 | URL | 参数 | 说明 |
|------|-----|------|------|
| GET | /settings.php | user_id(可选) | 获取设置 |
| POST | /settings.php | per_page, sort_order, accessibility | 保存设置 |

---

## 故障排除

### 数据库连接失败

1. 检查 MySQL 服务是否启动
2. 验证 `db.php` 中的凭据
3. 确保数据库用户有权限访问 `learning_platform` 数据库

### 迁移失败

1. 检查 JSON 文件格式是否正确
2. 确保表已正确创建
3. 查看 PHP 错误日志

### API 返回 404

1. 确保 URL 重写正确
2. 检查 PHP 是否正确安装
