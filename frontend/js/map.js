document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('user_id')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Setup back button
    document.getElementById('backBtn').addEventListener('click', function() {
        const role = localStorage.getItem('role');
        window.location.href = `${role}.html`;
    });
    
    // Initialize map
    const map = L.map('map').setView([20.5937, 78.9629], 5); // Default to India view
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Center map on user's location
                map.setView([userLat, userLng], 12);
                
                // Add user marker
                L.marker([userLat, userLng], {
                    icon: L.divIcon({
                        className: 'blood-marker',
                        html: 'You',
                        iconSize: [30, 30]
                    })
                }).addTo(map)
                .bindPopup('Your Location');
                
                // Load nearby donors
                loadDonors(map, userLat, userLng);
            },
            function(error) {
                console.error('Geolocation error:', error);
                // Default to loading all donors if location access is denied
                loadDonors(map);
            }
        );
    } else {
        // Browser doesn't support Geolocation
        console.error('Geolocation is not supported by this browser.');
        loadDonors(map);
    }
    
    // Filter functionality
    document.getElementById('applyFilters').addEventListener('click', function() {
        const bloodGroup = document.getElementById('bloodGroupFilter').value;
        const city = document.getElementById('cityFilter').value.trim();
        const radius = document.getElementById('radiusFilter').value;
        
        // Reload donors with filters
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    loadDonors(
                        map, 
                        position.coords.latitude, 
                        position.coords.longitude, 
                        bloodGroup, 
                        city, 
                        radius
                    );
                },
                function(error) {
                    loadDonors(map, null, null, bloodGroup, city);
                }
            );
        } else {
            loadDonors(map, null, null, bloodGroup, city);
        }
    });
});

function loadDonors(map, userLat = null, userLng = null, bloodGroup = 'all', city = '', radius = '10') {
    // Clear existing markers except user's location
    map.eachLayer(layer => {
        if (layer instanceof L.Marker && !layer.options.permanent) {
            map.removeLayer(layer);
        }
    });
    
    // Build API URL with filters
    let url = `../backend/map_fetch.php?blood_group=${bloodGroup}&city=${encodeURIComponent(city)}`;
    
    if (userLat && userLng) {
        url += `&lat=${userLat}&lng=${userLng}&radius=${radius}`;
    }
    
    // Show loading indicator
    const loadingControl = L.control({position: 'topright'});
    loadingControl.onAdd = function() {
        this._div = L.DomUtil.create('div', 'loading-control');
        this._div.innerHTML = '<div class="bg-white dark:bg-gray-800 p-2 rounded shadow-md">Loading donors...</div>';
        return this._div;
    };
    loadingControl.addTo(map);
    
    // Fetch donors
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.donors.length > 0) {
                data.donors.forEach(donor => {
                    const markerColor = getMarkerColor(donor.blood_group);
                    
                    const marker = L.marker([donor.latitude, donor.longitude], {
                        icon: L.divIcon({
                            className: 'blood-marker',
                            html: donor.blood_group.replace('+', '').replace('-', ''),
                            iconSize: [24, 24],
                            style: `background-color: ${markerColor}`
                        })
                    }).addTo(map);
                    
                    marker.bindPopup(`
                        <div class="space-y-2">
                            <h3 class="font-bold text-lg">${donor.name}</h3>
                            <p><span class="font-semibold">Blood Group:</span> ${donor.blood_group}</p>
                            <p><span class="font-semibold">Location:</span> ${donor.city}</p>
                            <p><span class="font-semibold">Status:</span> <span class="${donor.status === 'available' ? 'text-green-600' : 'text-red-600'}">${donor.status === 'available' ? 'Available' : 'Unavailable'}</span></p>
                            ${donor.status === 'available' ? `<button onclick="window.open('tel:${donor.phone}')" class="w-full mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition">Contact</button>` : ''}
                        </div>
                    `);
                });
                
                // If we have user location and radius, add circle
                if (userLat && userLng && radius) {
                    L.circle([userLat, userLng], {
                        color: '#e53e3e',
                        fillColor: '#feb2b2',
                        fillOpacity: 0.2,
                        radius: radius * 1000
                    }).addTo(map);
                }
            } else {
                // No donors found
                L.control({position: 'topright'})
                    .onAdd(function() {
                        this._div = L.DomUtil.create('div', 'no-donors-control');
                        this._div.innerHTML = '<div class="bg-white dark:bg-gray-800 p-2 rounded shadow-md">No donors found with current filters</div>';
                        return this._div;
                    })
                    .addTo(map);
            }
        })
        .catch(error => {
            console.error('Error loading donors:', error);
            L.control({position: 'topright'})
                .onAdd(function() {
                    this._div = L.DomUtil.create('div', 'error-control');
                    this._div.innerHTML = '<div class="bg-white dark:bg-gray-800 p-2 rounded shadow-md text-red-600">Error loading donors</div>';
                    return this._div;
                })
                .addTo(map);
        })
        .finally(() => {
            map.removeControl(loadingControl);
        });
}

function getMarkerColor(bloodGroup) {
    const baseColors = {
        'A': '#3182ce',  // blue
        'B': '#38a169',  // green
        'AB': '#805ad5', // purple
        'O': '#d69e2e'   // yellow
    };
    
    const type = bloodGroup.substring(0, bloodGroup.length - 1);
    return baseColors[type] || '#e53e3e'; // default red
}