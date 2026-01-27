<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Velora</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5;">Welcome to Velora, {{ $user->name }}!</h1>
        <p>Thank you for joining our platform. We are excited to have you on board.</p>
        <p>Explore thousands of products and enjoy a seamless shopping experience.</p>
        <br>
        <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Start Shopping</a>
        <br><br>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Best regards,<br>The Velora Team</p>
    </div>
</body>
</html>
