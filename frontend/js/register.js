document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const registerForm = document.getElementById('registerForm');
    const donorOption = document.getElementById('donorOption');
    const receiverOption = document.getElementById('receiverOption');
    const roleInput = document.getElementById('role');
    const donorFields = document.getElementById('donorFields');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const successModal = document.getElementById('successModal');
    const closeSuccessModal = document.getElementById('closeSuccessModal');
    const errorModal = document.getElementById('errorModal');
    const closeErrorModal = document.getElementById('closeErrorModal');
    const errorModalConfirm = document.getElementById('errorModalConfirm');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Check URL for role parameter
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    
    // Set initial role selection
    if (roleParam === 'donor' || roleParam === 'receiver') {
        selectRole(roleParam);
    } else {
        // Default to donor if no role specified
        selectRole('donor');
    }

    // Role selection handlers
    donorOption.addEventListener('click', () => selectRole('donor'));
    receiverOption.addEventListener('click', () => selectRole('receiver'));

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
    closeSuccessModal.addEventListener('click', hideSuccessModal);
    closeErrorModal.addEventListener('click', hideErrorModal);
    errorModalConfirm.addEventListener('click', hideErrorModal);

    function selectRole(role) {
        roleInput.value = role;
        
        // Update UI
        if (role === 'donor') {
            donorOption.classList.add('selected');
            receiverOption.classList.remove('selected');
            donorFields.classList.remove('hidden');
        } else {
            donorOption.classList.remove('selected');
            receiverOption.classList.add('selected');
            donorFields.classList.add('hidden');
        }
    }

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
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role = roleInput.value;
        const bloodGroup = role === 'donor' ? document.getElementById('bloodGroup').value : '';
        const city = role === 'donor' ? document.getElementById('city').value.trim() : '';

        // Validation
        if (!name || !email || !phone || !password || !confirmPassword || !role) {
            showErrorModal('Validation Error', 'Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            showErrorModal('Validation Error', 'Passwords do not match');
            return;
        }

        if (role === 'donor' && (!bloodGroup || !city)) {
            showErrorModal('Validation Error', 'Please fill in all donor information');
            return;
        }

        if (!document.getElementById('terms').checked) {
            showErrorModal('Validation Error', 'You must agree to the terms and conditions');
            return;
        }

        // Show loading indicator
        showLoading();

        // Prepare data for API
        const formData = {
            name,
            email,
            phone,
            password,
            role,
            blood_group: bloodGroup,
            city
        };

        // Send registration request
        fetch('../backend/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            
            if (data.success) {
                showSuccessModal();
                // Clear form
                registerForm.reset();
            } else {
                showErrorModal('Registration Failed', data.message || 'Failed to create account. Please try again.');
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Error:', error);
            showErrorModal('Network Error', 'Failed to connect to the server. Please try again later.');
        });
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }
});