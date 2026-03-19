<?php
/**
 * 用户API
 */
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

switch ($method) {
    case 'GET':
        // 获取所有用户（管理员用）
        if (isset($_GET['action']) && $_GET['action'] === 'list') {
            $stmt = $pdo->query("SELECT id, name, email, role, created_at, last_login FROM users ORDER BY created_at DESC");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($users);
            exit;
        }
        // 获取单个用户资料
        if (isset($_GET['user_id'])) {
            $stmt = $pdo->prepare("SELECT * FROM user_profiles WHERE user_id = ?");
            $stmt->execute([$_GET['user_id']]);
            $profile = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($profile ?: ['message' => '无资料']);
            exit;
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        // 用户登录
        if (isset($data['action']) && $data['action'] === 'login') {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND password = ?");
            $stmt->execute([$data['email'], $data['password']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                // 更新最后登录时间
                $update = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
                $update->execute([$user['id']]);
                
                unset($user['password']);
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => '登录失败']);
            }
            exit;
        }
        
        // 用户注册
        if (isset($data['action']) && $data['action'] === 'register') {
            // 检查邮箱是否已存在
            $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $check->execute([$data['email']]);
            if ($check->fetch()) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => '邮箱已注册']);
                exit;
            }
            
            // 生成ID
            $id = 'user_' . time() . '_' . substr(md5($data['email']), 0, 8);
            
            // 插入用户
            $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$id, $data['name'], $data['email'], $data['password'], $data['role'] ?? 'user']);
            
            // 创建用户资料
            $profileStmt = $pdo->prepare("INSERT INTO user_profiles (user_id, name, email) VALUES (?, ?, ?)");
            $profileStmt->execute([$id, $data['name'], $data['email']]);
            
            echo json_encode(['success' => true, 'id' => $id]);
            exit;
        }
        
        // 保存用户资料
        if (isset($data['action']) && $data['action'] === 'saveProfile') {
            $stmt = $pdo->prepare("
                INSERT INTO user_profiles (user_id, name, email, phone, bio, school, grade, interest)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    name = VALUES(name), email = VALUES(email), phone = VALUES(phone),
                    bio = VALUES(bio), school = VALUES(school), grade = VALUES(grade), interest = VALUES(interest)
            ");
            $stmt->execute([
                $data['user_id'], $data['name'], $data['email'], 
                $data['phone'] ?? '', $data['bio'] ?? '', 
                $data['school'] ?? '', $data['grade'] ?? '', $data['interest'] ?? ''
            ]);
            echo json_encode(['success' => true]);
            exit;
        }
        break;
    
    case 'DELETE':
        // 删除用户
        if (isset($_GET['user_id'])) {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$_GET['user_id']]);
            echo json_encode(['success' => true]);
            exit;
        }
        break;
}

echo json_encode(['message' => '无效请求']);
