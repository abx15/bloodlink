document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const errorModal = document.getElementById('errorModal');
    const closeModal = document.getElementById('closeModal');
    const modalConfirm = document.getElementById('modalConfirm');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Change icon
        const icon = this.querySelector('svg');
        if (type === 'password') {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />';
        } else {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />';
        }
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    });

    // Modal controls
    closeModal.addEventListener('click', hideModal);
    modalConfirm.addEventListener('click', hideModal);

    function showModal(title, message) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        errorModal.classList.remove('hidden');
    }

    function hideModal() {
        errorModal.classList.add('hidden');
    }

    function showLoading() {
        loadingOverlay.classList.remove('hidden');
    }

    function hideLoading() {
        loadingOverlay.classList.add('hidden');
    }

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Basic validation
        if (!email || !password) {
            showModal('Validation Error', 'Please fill in all fields');
            return;
        }

        // Show loading indicator
        showLoading();

        // Send login request
        fetch('../backend/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            
            if (data.success) {
                // Store user data in localStorage
                localStorage.setItem('user_id', data.user_id || '');
                localStorage.setItem('role', data.role || '');
                localStorage.setItem('name', data.name || '');
                localStorage.setItem('email', email);

                // Redirect based on role
                if (data.role === 'donor') {
                    window.location.href = 'donor.html';
                } else if (data.role === 'receiver') {
                    window.location.href = 'receiver.html';
                } else if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                showModal('Login Failed', data.message || 'Invalid email or password');
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Error:', error);
            showModal('Network Error', 'Failed to connect to the server. Please try again later.');
        });
    });

    // Check if there's a success message from registration
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('registered')) {
        showModal('Registration Successful', 'Your account has been created. Please log in to continue.');
    }
});