<?php
/**
 * 数据库配置
 */
$db_config = [
    'host' => 'localhost',
    'dbname' => 'learning_platform',
    'username' => 'root',      // 修改为你的MySQL用户名
    'password' => '',          // 修改为你的MySQL密码
    'charset' => 'utf8mb4'
];

// 获取数据库连接
function getDB() {
    global $db_config;
    try {
        $dsn = "mysql:host={$db_config['host']};dbname={$db_config['dbname']};charset={$db_config['charset']}";
        $pdo = new PDO($dsn, $db_config['username'], $db_config['password']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        die(json_encode(['error' => '数据库连接失败: ' . $e->getMessage()]));
    }
}

// 设置响应头
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
