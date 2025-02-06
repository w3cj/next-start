export function getPasswordResetEmailHtml(resetLink: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #0070f3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Reset Your Password</h1>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <div class="footer">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${resetLink}</p>
          </div>
        </div>
      </body>
    </html>
  `
} 