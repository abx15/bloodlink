<?php
require_once 'db.php';
header('Content-Type: application/json');

if (!isset($_GET['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User ID required']);
    exit;
}

$user_id = $_GET['user_id'];

try {
    // Get donor's blood group and city
    $stmt = $pdo->prepare("SELECT blood_group, city FROM donors WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $donor = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$donor) {
        echo json_encode(['success' => false, 'message' => 'Donor profile not found']);
        exit;
    }
    
    // Get matching requests
    $query = "SELECT r.id, r.blood_group, r.city, r.message, r.status, r.created_at, 
              u.name as requester_name, u.phone as contact_phone
              FROM requests r
              JOIN users u ON r.user_id = u.id
              WHERE r.blood_group = :blood_group 
              AND r.city = :city
              AND r.status = 'approved'
              ORDER BY r.created_at DESC
              LIMIT 10";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':blood_group' => $donor['blood_group'],
        ':city' => $donor['city']
    ]);
    
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'requests' => $requests
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>