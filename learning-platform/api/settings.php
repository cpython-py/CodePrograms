<?php
/**
 * 设置API
 */
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

switch ($method) {
    case 'GET':
        // 获取设置
        $userId = $_GET['user_id'] ?? null;
        
        if ($userId) {
            $stmt = $pdo->prepare("SELECT * FROM settings WHERE user_id = ?");
            $stmt->execute([$userId]);
        } else {
            // 获取默认设置
            $stmt = $pdo->query("SELECT * FROM settings WHERE user_id IS NULL");
        }
        
        $settings = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$settings) {
            // 返回默认设置
            $settings = [
                'per_page' => 24,
                'sort_order' => 'newest',
                'accessibility' => 0
            ];
        } else {
            unset($settings['id'], $settings['user_id']);
        }
        
        echo json_encode($settings);
        exit;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $userId = $data['user_id'] ?? null;
        
        if ($userId) {
            $stmt = $pdo->prepare("
                INSERT INTO settings (user_id, per_page, sort_order, accessibility)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    per_page = VALUES(per_page), 
                    sort_order = VALUES(sort_order), 
                    accessibility = VALUES(accessibility)
            ");
            $stmt->execute([
                $userId, 
                $data['per_page'] ?? 24, 
                $data['sort_order'] ?? 'newest', 
                $data['accessibility'] ?? 0
            ]);
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO settings (user_id, per_page, sort_order, accessibility)
                VALUES (NULL, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    per_page = VALUES(per_page), 
                    sort_order = VALUES(sort_order), 
                    accessibility = VALUES(accessibility)
            ");
            $stmt->execute([
                $data['per_page'] ?? 24, 
                $data['sort_order'] ?? 'newest', 
                $data['accessibility'] ?? 0
            ]);
        }
        
        echo json_encode(['success' => true]);
        exit;
}

echo json_encode(['message' => '无效请求']);
