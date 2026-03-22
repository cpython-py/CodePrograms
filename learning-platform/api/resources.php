<?php
/**
 * 资料API
 */
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

switch ($method) {
    case 'GET':
        // 获取资料列表
        $sort = $_GET['sort'] ?? 'newest';
        $category = $_GET['category'] ?? '';
        $search = $_GET['search'] ?? '';
        
        $sql = "SELECT r.*, u.name as author_name FROM resources r LEFT JOIN users u ON r.user_id = u.id WHERE 1=1";
        $params = [];
        
        if ($category) {
            $sql .= " AND r.category = ?";
            $params[] = $category;
        }
        
        if ($search) {
            $sql .= " AND (r.name LIKE ? OR r.description LIKE ? OR r.tags LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        switch ($sort) {
            case 'oldest':
                $sql .= " ORDER BY r.created_at ASC";
                break;
            case 'popular':
                $sql .= " ORDER BY r.views DESC";
                break;
            default:
                $sql .= " ORDER BY r.created_at DESC";
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $resources = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resources);
        exit;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        // 添加资料
        if (isset($data['action']) && $data['action'] === 'add') {
            $id = 'res_' . time() . '_' . substr(md5(uniqid()), 0, 8);
            
            $stmt = $pdo->prepare("
                INSERT INTO resources (id, user_id, name, category, link, extract_code, description, tags)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $id, $data['user_id'], $data['name'], $data['category'],
                $data['link'], $data['extractCode'] ?? '', 
                $data['description'] ?? '', $data['tags'] ?? ''
            ]);
            
            echo json_encode(['success' => true, 'id' => $id]);
            exit;
        }
        
        // 更新资料
        if (isset($data['action']) && $data['action'] === 'update') {
            $stmt = $pdo->prepare("
                UPDATE resources SET name = ?, category = ?, link = ?, 
                extract_code = ?, description = ?, tags = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $data['name'], $data['category'], $data['link'],
                $data['extractCode'], $data['description'], $data['tags'], $data['id']
            ]);
            echo json_encode(['success' => true]);
            exit;
        }
        
        // 增加浏览量
        if (isset($data['action']) && $data['action'] === 'view') {
            $stmt = $pdo->prepare("UPDATE resources SET views = views + 1 WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(['success' => true]);
            exit;
        }
        break;

    case 'DELETE':
        // 删除资料
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("DELETE FROM resources WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(['success' => true]);
            exit;
        }
        break;
}

echo json_encode(['message' => '无效请求']);
