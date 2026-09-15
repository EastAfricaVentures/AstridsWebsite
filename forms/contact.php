<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$company = trim($_POST['company'] ?? '');
$product = trim($_POST['product'] ?? '');
$country = trim($_POST['country'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $company === '' || $product === '' || $country === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

$subject = sprintf('New enquiry from %s', preg_replace('/[^A-Za-z0-9 ]/', '', $company));
$body = "Name: {$name}\nCompany: {$company}\nProduct: {$product}\nCountry: {$country}\n\nMessage:\n{$message}";
$headers = "From: website@eastafricaventures.com\r\nReply-To: info@eastafricaventures.com\r\nContent-Type: text/plain; charset=UTF-8\r\n";

if (mail('info@eastafricaventures.com', $subject, $body, $headers)) {
    echo json_encode(['status' => 'success']);
    exit;
}

http_response_code(500);
echo json_encode(['status' => 'error', 'message' => 'Unable to send enquiry. Please call us directly.']);
?>
