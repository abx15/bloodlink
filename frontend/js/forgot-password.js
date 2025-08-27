document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const resetForm = document.getElementById('resetForm');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const successModal = document.getElementById('successModal');
    const closeSuccessModal = document.getElementById('closeSuccessModal');
    const successModalConfirm = document.getElementById('successModalConfirm');
    const errorModal = document.getElementById('errorModal');
    const closeErrorModal = document.getElementById('closeErrorModal');
    const errorModalConfirm = document.getElementById('errorModalConfirm');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }

    // Dark mode toggle
    darkModeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    });

    // Modal controls
    closeSuccessModal.addEventListener('click', hideSuccessModal);
    successModalConfirm.addEventListener('click', hideSuccessModal);
    closeErrorModal.addEventListener('click', hideErrorModal);
    errorModalConfirm.addEventListener('click', hideErrorModal);

    function showSuccessModal() {
        successModal.classList.remove('hidden');
    }

    function hideSuccessModal() {
        successModal.classList.add('hidden');
    }

    function showErrorModal(title, message) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        errorModal.classList.remove('hidden');
    }

    function hideErrorModal() {
        errorModal.classList.add('hidden');
    }

    function showLoading() {
        loadingOverlay.classList.remove('hidden');
    }

    function hideLoading() {
        loadingOverlay.classList.add('hidden');
    }

    // Form submission
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();

        // Basic validation
        if (!email) {
            showErrorModal('Validation Error', 'Please enter your email address');
            return;
        }

        // Show loading indicator
        showLoading();

        // Send password reset request
        fetch('../backend/forgot-password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}`
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            
            if (data.success) {
                showSuccessModal();
            } else {
                showErrorModal('Request Failed', data.message || 'Failed to send reset link. Please try again.');
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Error:', error);
            showErrorModal('Network Error', 'Failed to connect to the server. Please try again later.');
        });
    });

    // Check if there's a message from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
        showErrorModal('Error', urlParams.get('error'));
    }
});