<?php
require_once 'db.php';
header('Content-Type: application/json');

if (!isset($_GET['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User ID required']);
    exit;
}

$user_id = $_GET['user_id'];

try {
    // Get user info
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }
    
    // Get donor info
    $stmt = $pdo->prepare("SELECT * FROM donors WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $donor = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$donor) {
        echo json_encode(['success' => false, 'message' => 'Donor profile not found']);
        exit;
    }
    
    // Get donation history (mock data - in real app you'd have a donations table)
    $donations = [
        ['date' => '2023-05-15', 'hospital' => 'City General Hospital'],
        ['date' => '2022-11-20', 'hospital' => 'Red Cross Blood Drive']
    ];
    
    echo json_encode([
        'success' => true,
        'user' => $user,
        'donor' => $donor,
        'donations' => $donions
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>