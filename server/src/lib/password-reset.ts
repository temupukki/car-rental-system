interface PasswordResetParams {
  user: {
    email: string;
    name?: string;
  };
  url: string;
}

export const getPasswordResetEmailTemplate = ({ user, url }: PasswordResetParams) => {
  const userName = user.name || 'there';
  
  return {
    subject: 'Reset Your ExamMaster Password',
    text: `Hello ${userName}, we received a request to reset your password. Click the link to reset your password: ${url}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">🎓 ExamMaster</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We received a request to reset your password for your ExamMaster account.</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${url}" style="display: inline-block; padding: 12px 30px; background: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p>Or copy and paste this link in your browser:</p>
          <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd; word-break: break-all; font-family: monospace;">
            ${url}
          </div>
          
          <p style="margin-top: 20px;"><strong>This link will expire in 1 hour.</strong></p>
          
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
          <p style="color: #666; font-size: 12px;">
            Need help? Contact our support team.<br>
            The ExamMaster Team
          </p>
        </div>
      </div>
    `
  };
};