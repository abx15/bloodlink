<?php
require_once 'db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['email'] = $user['email'];
            
            // Get additional donor info if applicable
            if ($user['role'] === 'donor') {
                $stmt = $pdo->prepare("SELECT * FROM donors WHERE user_id = ?");
                $stmt->execute([$user['id']]);
                $donor_info = $stmt->fetch(PDO::FETCH_ASSOC);
                $_SESSION['donor_info'] = $donor_info;
            }
            
            echo json_encode(['success' => true, 'role' => $user['role']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Login failed: ' . $e->getMessage()]);
    }
}
?>