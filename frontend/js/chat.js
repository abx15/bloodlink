document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('user_id')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Setup event listeners
    document.getElementById('backBtn').addEventListener('click', function() {
        const role = localStorage.getItem('role');
        window.location.href = `${role}.html`;
    });
    
    document.getElementById('chatForm').addEventListener('submit', sendMessage);
});

function sendMessage(e) {
    e.preventDefault();
    
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat('user', message);
    userInput.value = '';
    
    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    // Send to backend for AI processing
    fetch('../backend/ai_chat.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: localStorage.getItem('user_id'),
            prompt: message
        })
    })
    .then(response => response.json())
    .then(data => {
        // Remove typing indicator
        typingIndicator.remove();
        
        if (data.success) {
            addMessageToChat('ai', data.response);
        } else {
            addMessageToChat('ai', "Sorry, I'm having trouble answering that. Please try again later.");
            console.error('AI Error:', data.message);
        }
    })
    .catch(error => {
        typingIndicator.remove();
        addMessageToChat('ai', "Sorry, I'm having trouble connecting. Please check your internet and try again.");
        console.error('Network Error:', error);
    });
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start';
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="ml-auto max-w-xs md:max-w-md">
                <div class="bg-red-100 dark:bg-red-900 rounded-lg p-3">
                    <p class="text-gray-800 dark:text-white">${message}</p>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">You</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-300 font-bold">AI</div>
            <div class="ml-3 max-w-xs md:max-w-md">
                <div class="bg-gray-100 dark:bg-gray-600 rounded-lg p-3">
                    <p class="text-gray-800 dark:text-white">${message}</p>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex items-start';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-300 font-bold">AI</div>
        <div class="ml-3">
            <div class="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 w-24">
                <div class="flex space-x-1">
                    <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                    <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                    <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return typingDiv;
}