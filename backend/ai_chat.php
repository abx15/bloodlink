<?php
require_once 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $data['user_id'] ?? null;
    $prompt = $data['prompt'] ?? '';
    
    if (!$user_id || empty($prompt)) {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit;
    }
    
    try {
        // Save the chat log
        $stmt = $pdo->prepare("INSERT INTO chat_logs (user_id, prompt) VALUES (?, ?)");
        $stmt->execute([$user_id, $prompt]);
        
        // Call Gemini AI API
        $response = getGeminiResponse($prompt);
        
        // Update chat log with response
        $chat_id = $pdo->lastInsertId();
        $stmt = $pdo->prepare("UPDATE chat_logs SET response = ? WHERE id = ?");
        $stmt->execute([$response, $chat_id]);
        
        echo json_encode(['success' => true, 'response' => $response]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

function getGeminiResponse($prompt) {
    $api_key = 'AIzaSyBWJnlvVWSnyWS59f8ORSgT2mEFaGT6DBw';
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' . $api_key;
    
    // Add context to the prompt
    $context = "You are a helpful and knowledgeable AI assistant for a blood donation platform called BloodLink. ";
    $context .= "Your role is to provide accurate information about blood donation, eligibility criteria, health tips, ";
    $context .= "and general advice related to blood donation. Be concise but informative. ";
    $context .= "If a question is outside this scope, politely decline to answer. ";
    $context .= "Current date: " . date('Y-m-d') . ". ";
    
    $full_prompt = $context . $prompt;
    
    $data = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $full_prompt]
                ]
            ]
        ],
        'safetySettings' => [
            [
                'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
                'threshold' => 'BLOCK_ONLY_HIGH'
            ]
        ],
        'generationConfig' => [
            'maxOutputTokens' => 1000,
            'temperature' => 0.7
        ]
    ];
    
    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data)
        ]
    ];
    
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    if ($result === FALSE) {
        return "I'm sorry, I'm having trouble connecting to the knowledge base. Please try again later.";
    }
    
    $response = json_decode($result, true);
    
    if (isset($response['candidates'][0]['content']['parts'][0]['text'])) {
        return $response['candidates'][0]['content']['parts'][0]['text'];
    } else {
        error_log("Gemini API Error: " . print_r($response, true));
        return "I couldn't process your request at the moment. Please try again with a different question.";
    }
}
?>