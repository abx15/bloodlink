<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $role = $_POST['role'];
    
    try {
        // Check if email exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Email already registered']);
            exit;
        }
        
        // Insert user
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $password, $role]);
        $user_id = $pdo->lastInsertId();
        
        // If donor, add to donors table
        if ($role === 'donor') {
            $blood_group = $_POST['blood_group'];
            $city = $_POST['city'];
            $phone = $_POST['phone'];
            
            $stmt = $pdo->prepare("INSERT INTO donors (user_id, blood_group, city, phone) VALUES (?, ?, ?, ?)");
            $stmt->execute([$user_id, $blood_group, $city, $phone]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()]);
    }
}
?>