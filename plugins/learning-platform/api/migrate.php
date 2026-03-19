<?php
/**
 * 数据迁移脚本 - 从localStorage迁移到MySQL
 * 
 * 使用方法: php migrate.php
 * 回滚: php migrate.php --rollback
 */

require_once 'db.php';

$rollback = in_array('--rollback', $argv);

// 创建数据库和表
function initDatabase($pdo) {
    echo "=== 初始化数据库 ===\n";
    
    // 创建表
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'user') DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME NULL,
            INDEX idx_email (email),
            INDEX idx_role (role)
        ) ENGINE=InnoDB
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_profiles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(50) UNIQUE NOT NULL,
            name VARCHAR(100),
            email VARCHAR(255),
            phone VARCHAR(20),
            bio TEXT,
            school VARCHAR(100),
            grade VARCHAR(50),
            interest VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS resources (
            id VARCHAR(50) PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            link VARCHAR(500) NOT NULL,
            extract_code VARCHAR(50),
            description TEXT,
            tags VARCHAR(255),
            views INT DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_category (category),
            INDEX idx_user (user_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(50) UNIQUE,
            per_page INT DEFAULT 24,
            sort_order VARCHAR(20) DEFAULT 'newest',
            accessibility TINYINT(1) DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB
    ");
    
    // 创建迁移记录表
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS migration_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            migration_name VARCHAR(100),
            executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status ENUM('success', 'failed', 'rolled_back') DEFAULT 'success'
        ) ENGINE=InnoDB
    ");
    
    echo "数据库表创建完成\n\n";
}

// 迁移用户数据
function migrateUsers($pdo) {
    echo "=== 迁移用户数据 ===\n";
    
    // 尝试从localStorage JSON文件读取
    $usersFile = __DIR__ . '/../users_data.json';
    
    if (file_exists($usersFile)) {
        $users = json_decode(file_get_contents($usersFile), true);
    } else {
        echo "提示: users_data.json 不存在，请在浏览器控制台执行以下代码导出用户数据:\n";
        echo "console.log(JSON.stringify({users: JSON.parse(localStorage.getItem('users') || '[]')}));\n";
        echo "然后保存为 api/users_data.json\n\n";
        
        // 使用默认管理员账户
        $users = [[
            'id' => 'admin001',
            'name' => '管理员',
            'email' => 'admin@qq.com',
            'password' => 'admin',
            'role' => 'admin',
            'createdAt' => date('Y-m-d H:i:s'),
            'lastLogin' => null
        ]];
    }
    
    $count = 0;
    foreach ($users as $user) {
        $stmt = $pdo->prepare("
            INSERT IGNORE INTO users (id, name, email, password, role, created_at, last_login)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $result = $stmt->execute([
            $user['id'],
            $user['name'],
            $user['email'],
            $user['password'],
            $user['role'] ?? 'user',
            $user['createdAt'] ?? date('Y-m-d H:i:s'),
            $user['lastLogin']
        ]);
        
        if ($result) $count++;
        
        // 同时创建用户资料
        $profileStmt = $pdo->prepare("
            INSERT IGNORE INTO user_profiles (user_id, name, email)
            VALUES (?, ?, ?)
        ");
        $profileStmt->execute([$user['id'], $user['name'], $user['email']]);
    }
    
    echo "迁移用户: {$count} 条\n\n";
    return $count;
}

// 迁移资料数据
function migrateResources($pdo) {
    echo "=== 迁移资料数据 ===\n";
    
    $resourcesFile = __DIR__ . '/../resources_data.json';
    
    if (file_exists($resourcesFile)) {
        $data = json_decode(file_get_contents($resourcesFile), true);
        $resources = $data['resources'] ?? $data;
    } else {
        echo "提示: resources_data.json 不存在，请在浏览器控制台执行以下代码导出资料数据:\n";
        echo "console.log(JSON.stringify({resources: JSON.parse(localStorage.getItem('resources') || '[]')}));\n";
        echo "然后保存为 api/resources_data.json\n\n";
        
        $resources = [];
    }
    
    $count = 0;
    foreach ($resources as $resource) {
        // 确定用户ID
        $userId = $resource['user_id'] ?? $resource['author_id'] ?? 'admin001';
        
        $stmt = $pdo->prepare("
            INSERT IGNORE INTO resources (id, user_id, name, category, link, extract_code, description, tags, views, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $result = $stmt->execute([
            $resource['id'],
            $userId,
            $resource['name'],
            $resource['category'] ?? '',
            $resource['link'],
            $resource['extractCode'] ?? '',
            $resource['description'] ?? '',
            $resource['tags'] ?? '',
            $resource['views'] ?? 0,
            $resource['createdAt'] ?? date('Y-m-d H:i:s')
        ]);
        
        if ($result) $count++;
    }
    
    echo "迁移资料: {$count} 条\n\n";
    return $count;
}

// 迁移设置数据
function migrateSettings($pdo) {
    echo "=== 迁移设置数据 ===\n";
    
    $settingsFile = __DIR__ . '/../settings_data.json';
    
    if (file_exists($settingsFile)) {
        $data = json_decode(file_get_contents($settingsFile), true);
        $settings = $data['settings'] ?? $data;
    } else {
        $settings = [
            'perPage' => 24,
            'sortOrder' => 'newest',
            'accessibility' => false
        ];
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO settings (user_id, per_page, sort_order, accessibility)
        VALUES (NULL, ?, ?, ?)
        ON DUPLICATE KEY UPDATE per_page = VALUES(per_page), sort_order = VALUES(sort_order), accessibility = VALUES(accessibility)
    ");
    
    $stmt->execute([
        $settings['perPage'] ?? 24,
        $settings['sortOrder'] ?? 'newest',
        isset($settings['accessibility']) ? ($settings['accessibility'] ? 1 : 0) : 0
    ]);
    
    echo "迁移设置完成\n\n";
}

// 回滚操作
function rollback($pdo) {
    echo "=== 执行回滚 ===\n";
    
    $pdo->exec("DROP TABLE IF EXISTS settings");
    $pdo->exec("DROP TABLE IF EXISTS resources");
    $pdo->exec("DROP TABLE IF EXISTS user_profiles");
    $pdo->exec("DROP TABLE IF EXISTS users");
    
    // 记录回滚
    $stmt = $pdo->prepare("INSERT INTO migration_log (migration_name, status) VALUES (?, 'rolled_back')");
    $stmt->execute(['initial_migration']);
    
    echo "回滚完成，所有数据表已删除\n\n";
}

// 主程序
try {
    $pdo = getDB();
    
    if ($rollback) {
        rollback($pdo);
        echo "✅ 回滚成功!\n";
        exit(0);
    }
    
    // 初始化数据库
    initDatabase($pdo);
    
    // 执行迁移
    $userCount = migrateUsers($pdo);
    $resourceCount = migrateResources($pdo);
    migrateSettings($pdo);
    
    // 记录迁移
    $stmt = $pdo->prepare("INSERT INTO migration_log (migration_name, status) VALUES (?, 'success')");
    $stmt->execute(['initial_migration']);
    
    echo "=== 迁移完成 ===\n";
    echo "用户: {$userCount} 条\n";
    echo "资料: {$resourceCount} 条\n";
    echo "\n✅ 迁移成功!\n";
    
} catch (Exception $e) {
    echo "❌ 迁移失败: " . $e->getMessage() . "\n";
    exit(1);
}
