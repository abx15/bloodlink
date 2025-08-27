document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('user_id')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load donor data
    loadDonorData();
    
    // Setup event listeners
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('toggleStatusBtn').addEventListener('click', toggleDonorStatus);
    document.getElementById('downloadQRBtn').addEventListener('click', downloadQRCode);
    
    // Load recent requests
    loadRecentRequests();
});

function loadDonorData() {
    const userId = localStorage.getItem('user_id');
    
    fetch(`../backend/donor_dashboard.php?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update profile info
                document.getElementById('donorName').textContent = data.user.name;
                document.getElementById('donorBloodGroup').textContent = data.donor.blood_group;
                document.getElementById('donorCity').textContent = data.donor.city;
                document.getElementById('donorPhone').textContent = data.donor.phone;
                
                // Update status
                const statusIndicator = document.getElementById('statusIndicator');
                const donorStatus = document.getElementById('donorStatus');
                const toggleBtn = document.getElementById('toggleStatusBtn');
                
                if (data.donor.status === 'available') {
                    statusIndicator.classList.remove('bg-gray-400');
                    statusIndicator.classList.add('bg-green-500');
                    donorStatus.textContent = 'Available';
                    toggleBtn.textContent = 'Mark as Unavailable';
                    toggleBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
                    toggleBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
                } else {
                    statusIndicator.classList.remove('bg-gray-400');
                    statusIndicator.classList.add('bg-red-500');
                    donorStatus.textContent = 'Unavailable';
                    toggleBtn.textContent = 'Mark as Available';
                    toggleBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
                    toggleBtn.classList.add('bg-red-600', 'hover:bg-red-700');
                }
                
                // Generate QR Code
                const qrData = {
                    name: data.user.name,
                    blood_group: data.donor.blood_group,
                    city: data.donor.city,
                    phone: data.donor.phone,
                    status: data.donor.status
                };
                
                const qrString = JSON.stringify(qrData);
                
                QRCode.toCanvas(document.getElementById('qrcode'), qrString, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    }
                }, function(error) {
                    if (error) console.error(error);
                });
                
                // Load donation history if any
                if (data.donations && data.donations.length > 0) {
                    const historyContainer = document.getElementById('donationHistory');
                    historyContainer.innerHTML = '';
                    
                    data.donations.forEach(donation => {
                        const donationElement = document.createElement('div');
                        donationElement.className = 'border-l-4 border-red-500 pl-4 py-2';
                        donationElement.innerHTML = `
                            <p class="text-gray-800 dark:text-white font-medium">${new Date(donation.date).toLocaleDateString()}</p>
                            <p class="text-gray-600 dark:text-gray-300 text-sm">${donation.hospital || 'Local Blood Bank'}</p>
                        `;
                        historyContainer.appendChild(donationElement);
                    });
                }
            } else {
                alert('Failed to load donor data: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load donor data');
        });
}

function toggleDonorStatus() {
    const userId = localStorage.getItem('user_id');
    const currentStatus = document.getElementById('donorStatus').textContent.toLowerCase();
    const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
    
    fetch('../backend/update_donor_status.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            status: newStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadDonorData(); // Refresh donor data
        } else {
            alert('Failed to update status: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update status');
    });
}

function loadRecentRequests() {
    const userId = localStorage.getItem('user_id');
    
    fetch(`../backend/get_requests.php?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('requestsTableBody');
            tableBody.innerHTML = '';
            
            if (data.success && data.requests.length > 0) {
                data.requests.forEach(request => {
                    const row = document.createElement('tr');
                    
                    // Status badge
                    let statusBadge = '';
                    if (request.status === 'pending') {
                        statusBadge = '<span class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">Pending</span>';
                    } else if (request.status === 'approved') {
                        statusBadge = '<span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">Approved</span>';
                    } else {
                        statusBadge = '<span class="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">Rejected</span>';
                    }
                    
                    // Action button
                    let actionButton = '';
                    if (request.status === 'approved') {
                        actionButton = `<button class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition contact-btn" data-phone="${request.contact_phone}">Contact</button>`;
                    } else {
                        actionButton = '-';
                    }
                    
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">${request.blood_group}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">${request.city}</td>
                        <td class="px-6 py-4 text-gray-800 dark:text-white">${request.message || '-'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">${statusBadge}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">${actionButton}</td>
                    `;
                    
                    tableBody.appendChild(row);
                });
                
                // Add event listeners to contact buttons
                document.querySelectorAll('.contact-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const phone = this.getAttribute('data-phone');
                        window.open(`tel:${phone}`);
                    });
                });
            } else {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No recent requests found</td>
                    </tr>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('requestsTableBody').innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Failed to load requests</td>
                </tr>
            `;
        });
}

function downloadQRCode() {
    const canvas = document.querySelector('#qrcode canvas');
    const link = document.createElement('a');
    link.download = 'bloodlink-donor-qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function logout() {
    // Clear local storage
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    
    // Redirect to login
    window.location.href = 'login.html';
}