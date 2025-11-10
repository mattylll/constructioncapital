<?php
// Set headers for CORS and JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate required fields
$requiredFields = ['firstName', 'lastName', 'email', 'phone', 'fundingType', 'message'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize data
$sanitizedData = [
    'firstName' => htmlspecialchars(trim($data['firstName'])),
    'lastName' => htmlspecialchars(trim($data['lastName'])),
    'email' => filter_var($data['email'], FILTER_SANITIZE_EMAIL),
    'phone' => htmlspecialchars(trim($data['phone'])),
    'company' => isset($data['company']) ? htmlspecialchars(trim($data['company'])) : '',
    'fundingType' => htmlspecialchars(trim($data['fundingType'])),
    'projectValue' => isset($data['projectValue']) ? htmlspecialchars(trim($data['projectValue'])) : '',
    'message' => htmlspecialchars(trim($data['message'])),
    'timestamp' => isset($data['timestamp']) ? $data['timestamp'] : date('c'),
    'source' => isset($data['source']) ? htmlspecialchars(trim($data['source'])) : 'website',
    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
];

// Validate email
if (!filter_var($sanitizedData['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Save to CSV file
$csvFile = 'leads.csv';
$isNewFile = !file_exists($csvFile);

// Create leads directory if it doesn't exist
if (!is_dir('leads')) {
    mkdir('leads', 0755, true);
}
$csvFile = 'leads/leads.csv';
$isNewFile = !file_exists($csvFile);

$fp = fopen($csvFile, 'a');

if ($fp === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not save lead data']);
    exit;
}

// Add headers if new file
if ($isNewFile) {
    fputcsv($fp, [
        'Timestamp',
        'First Name',
        'Last Name',
        'Email',
        'Phone',
        'Company',
        'Funding Type',
        'Project Value',
        'Message',
        'Source',
        'IP Address',
        'User Agent'
    ]);
}

// Write lead data
fputcsv($fp, [
    $sanitizedData['timestamp'],
    $sanitizedData['firstName'],
    $sanitizedData['lastName'],
    $sanitizedData['email'],
    $sanitizedData['phone'],
    $sanitizedData['company'],
    $sanitizedData['fundingType'],
    $sanitizedData['projectValue'],
    $sanitizedData['message'],
    $sanitizedData['source'],
    $sanitizedData['ip_address'],
    $sanitizedData['user_agent']
]);

fclose($fp);

// Send email notification (configure your email settings)
$sendEmail = true; // Set to false if you don't want email notifications

if ($sendEmail) {
    $to = 'matt.lenzie@construction-capital.co.uk';
    $subject = 'New Lead from Construction Capital Website';

    $emailBody = "New lead received from Construction Capital website:\n\n";
    $emailBody .= "Name: {$sanitizedData['firstName']} {$sanitizedData['lastName']}\n";
    $emailBody .= "Email: {$sanitizedData['email']}\n";
    $emailBody .= "Phone: {$sanitizedData['phone']}\n";

    if (!empty($sanitizedData['company'])) {
        $emailBody .= "Company: {$sanitizedData['company']}\n";
    }

    $emailBody .= "Funding Type: {$sanitizedData['fundingType']}\n";

    if (!empty($sanitizedData['projectValue'])) {
        $emailBody .= "Project Value: £{$sanitizedData['projectValue']}\n";
    }

    $emailBody .= "\nMessage:\n{$sanitizedData['message']}\n\n";
    $emailBody .= "---\n";
    $emailBody .= "Timestamp: {$sanitizedData['timestamp']}\n";
    $emailBody .= "IP Address: {$sanitizedData['ip_address']}\n";

    $headers = "From: noreply@construction-capital.co.uk\r\n";
    $headers .= "Reply-To: {$sanitizedData['email']}\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    @mail($to, $subject, $emailBody, $headers);
}

// Send success response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Lead received successfully'
]);
?>
