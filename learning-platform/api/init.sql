-- =============================================
-- 学习平台 MySQL 数据库初始化脚本
-- =============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS learning_platform 
    DEFAULT CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE learning_platform;

-- =============================================
-- 用户表
-- =============================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY COMMENT '用户ID',
    name VARCHAR(100) NOT NULL COMMENT '用户名',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT '邮箱',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    role ENUM('admin', 'user') DEFAULT 'user' COMMENT '角色: admin管理员, user普通用户',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    last_login DATETIME NULL COMMENT '最后登录时间',
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 插入默认管理员账户
INSERT INTO users (id, name, email, password, role) 
VALUES ('admin001', '管理员', 'admin@qq.com', 'admin', 'admin');

-- =============================================
-- 用户资料表
-- =============================================
DROP TABLE IF EXISTS user_profiles;
CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL COMMENT '用户ID',
    name VARCHAR(100) COMMENT '姓名',
    email VARCHAR(255) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '电话',
    bio TEXT COMMENT '个人简介',
    school VARCHAR(100) COMMENT '学校',
    grade VARCHAR(50) COMMENT '年级',
    interest VARCHAR(255) COMMENT '兴趣爱好',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户资料表';

-- =============================================
-- 学习资料表
-- =============================================
DROP TABLE IF EXISTS resources;
CREATE TABLE resources (
    id VARCHAR(50) PRIMARY KEY COMMENT '资料ID',
    user_id VARCHAR(50) NOT NULL COMMENT '上传者ID',
    name VARCHAR(255) NOT NULL COMMENT '资料名称',
    category VARCHAR(100) COMMENT '分类',
    link VARCHAR(500) NOT NULL COMMENT '资料链接',
    extract_code VARCHAR(50) COMMENT '提取码',
    description TEXT COMMENT '描述',
    tags VARCHAR(255) COMMENT '标签',
    views INT DEFAULT 0 COMMENT '浏览量',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_category (category),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习资料表';

-- =============================================
-- 系统设置表
-- =============================================
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE COMMENT '用户ID(NULL为默认设置)',
    per_page INT DEFAULT 24 COMMENT '每页显示数量',
    sort_order VARCHAR(20) DEFAULT 'newest' COMMENT '排序方式: newest最新, oldest最早, popular最热',
    accessibility TINYINT(1) DEFAULT 0 COMMENT '无障碍模式: 0关闭, 1开启',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统设置表';

-- 插入默认设置
INSERT INTO settings (user_id, per_page, sort_order, accessibility) 
VALUES (NULL, 24, 'newest', 0);

-- =============================================
-- 迁移日志表
-- =============================================
DROP TABLE IF EXISTS migration_log;
CREATE TABLE migration_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    migration_name VARCHAR(100) COMMENT '迁移名称',
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '执行时间',
    status ENUM('success', 'failed', 'rolled_back') DEFAULT 'success' COMMENT '状态'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='迁移日志表';

-- =============================================
-- 初始化示例数据
-- =============================================
INSERT INTO resources (id, user_id, name, category, link, extract_code, description, tags, views) VALUES
('sample001', 'admin001', 'Python入门教程', 'Python', 'https://pan.baidu.com/s/example1', 'python', 'Python编程入门经典教程', 'Python,教程,入门', 156),
('sample002', 'admin001', 'JavaScript高级编程', '前端', 'https://pan.baidu.com/s/example2', 'js123', 'JavaScript核心技术进阶', 'JavaScript,前端,进阶', 243),
('sample003', 'admin001', '网络安全基础', '网络安全', 'https://pan.baidu.com/s/example3', 'sec001', '网络安全入门指南', '安全,网络,入门', 89);

-- 完成提示
SELECT '数据库初始化完成!' AS message;
