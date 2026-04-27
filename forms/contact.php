<?php
header('Content-Type: application/json');

/* ─── GMAIL SMTP CONFIG ────────────────────────────────────────────────────── */
define('SMTP_HOST',     'smtp.gmail.com');
define('SMTP_PORT',     587);
define('SMTP_USER',     'girish.eaventures@gmail.com');
define('SMTP_PASS',     'lgacjceanwtnwhxu');   // 16-char App Password
define('SMTP_FROM',     'girish.eaventures@gmail.com');
define('SMTP_FROM_NAME','ASTRIDS Enquiry');
define('MAIL_TO',       'girish.eaventures@gmail.com');
/* ──────────────────────────────────────────────────────────────────────────── */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$name    = htmlspecialchars(trim($_POST['name']    ?? ''), ENT_QUOTES, 'UTF-8');
$email   = filter_var(trim($_POST['email']   ?? ''), FILTER_VALIDATE_EMAIL);
$country = htmlspecialchars(trim($_POST['country'] ?? ''), ENT_QUOTES, 'UTF-8');
$service = htmlspecialchars(trim($_POST['service'] ?? ''), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

if (!$name || !$email || !$country || !$service || !$message) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

$subject = "ASTRIDS Enquiry — {$service} ({$country})";
$body    = "
<h2>New Enquiry from ASTRIDS Website</h2>
<table>
  <tr><td><strong>Name</strong></td><td>{$name}</td></tr>
  <tr><td><strong>Email</strong></td><td>{$email}</td></tr>
  <tr><td><strong>Target Country</strong></td><td>{$country}</td></tr>
  <tr><td><strong>Service Needed</strong></td><td>{$service}</td></tr>
  <tr><td><strong>Message</strong></td><td>{$message}</td></tr>
</table>
";

/* ─── PHPMailer ────────────────────────────────────────────────────────────── */
$phpmailerPath = __DIR__ . '/../vendor/phpmailer/phpmailer/src/PHPMailer.php';

if (file_exists($phpmailerPath)) {
    require $phpmailerPath;
    require __DIR__ . '/../vendor/phpmailer/phpmailer/src/SMTP.php';
    require __DIR__ . '/../vendor/phpmailer/phpmailer/src/Exception.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;

        $mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
        $mail->addAddress(MAIL_TO);
        $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;

        $mail->send();
        echo json_encode(['status' => 'success']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Mailer error: ' . $mail->ErrorInfo]);
    }
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'PHPMailer not installed. Use EmailJS path instead.']);
}
?>
