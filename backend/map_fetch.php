<?php
require_once 'db.php';
header('Content-Type: application/json');

// Get filters from query parameters
$blood_group = $_GET['blood_group'] ?? 'all';
$city = $_GET['city'] ?? '';
$lat = isset($_GET['lat']) ? floatval($_GET['lat']) : null;
$lng = isset($_GET['lng']) ? floatval($_GET['lng']) : null;
$radius = isset($_GET['radius']) ? floatval($_GET['radius']) : 10; // in km

try {
    // Base query
    $query = "SELECT d.id, u.name, d.blood_group, d.city, d.phone, d.status, 
              d.latitude, d.longitude 
              FROM donors d
              JOIN users u ON d.user_id = u.id
              WHERE d.status = 'available'";
    
    // Add blood group filter if not 'all'
    if ($blood_group !== 'all') {
        $query .= " AND d.blood_group = :blood_group";
    }
    
    // Add city filter if provided
    if (!empty($city)) {
        $query .= " AND d.city LIKE :city";
    }
    
    // Prepare statement
    $stmt = $pdo->prepare($query);
    
    // Bind parameters
    if ($blood_group !== 'all') {
        $stmt->bindParam(':blood_group', $blood_group);
    }
    
    if (!empty($city)) {
        $cityParam = "%$city%";
        $stmt->bindParam(':city', $cityParam);
    }
    
    // Execute query
    $stmt->execute();
    $donors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Filter by distance if coordinates are provided
    if ($lat !== null && $lng !== null) {
        $donors = array_filter($donors, function($donor) use ($lat, $lng, $radius) {
            if ($donor['latitude'] && $donor['longitude']) {
                $distance = haversineDistance(
                    $lat, $lng, 
                    floatval($donor['latitude']), 
                    floatval($donor['longitude'])
                );
                return $distance <= $radius;
            }
            return false;
        });
    }
    
    // Re-index array after filtering
    $donors = array_values($donors);
    
    echo json_encode([
        'success' => true,
        'donors' => $donors
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

// Haversine formula to calculate distance between two points on Earth
function haversineDistance($lat1, $lon1, $lat2, $lon2) {
    $earthRadius = 6371; // in km
    
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);
    
    $a = sin($dLat / 2) * sin($dLat / 2) + 
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * 
         sin($dLon / 2) * sin($dLon / 2);
    
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    
    return $earthRadius * $c;
}
?>