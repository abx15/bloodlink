<?php
require_once 'db.php';
require_once 'mailer.php'; // You'll need to implement this
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    
    if (empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Email is required']);
        exit;
    }

    try {
        // Check if email exists in database
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            // For security, don't reveal if email doesn't exist
            echo json_encode(['success' => true]);
            exit;
        }
        
        // Generate a unique token
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour')); // Token valid for 1 hour
        
        // Store token in database
        $stmt = $pdo->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$email, $token, $expires]);
        
        // Send email with reset link
        $resetLink = "http://yourdomain.com/frontend/reset-password.html?token=$token";
        $subject = "BloodLink - Password Reset Request";
        $body = "Click the following link to reset your password: $resetLink\n\n";
        $body .= "This link will expire in 1 hour.\n\n";
        $body .= "If you didn't request this, please ignore this email.";
        
        if (sendEmail($email, $subject, $body)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to send reset email']);
        }
        
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>