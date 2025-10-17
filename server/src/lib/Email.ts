interface EmailParams {
  user: {
    email: string;
    name?: string;
  };
  url: string;
}

export const getVerificationEmailTemplate = ({ user, url }: EmailParams) => {
  const userName = user.name || 'there';
  
  return {
    subject: 'Verify your email address',
    text: `Hello ${userName},\n\nPlease verify your email by clicking this link: ${url}\n\nIf you didn't create an account, you can ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              color: #333; 
              line-height: 1.6;
            }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background: #0070f3; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              font-size: 16px;
              font-weight: bold;
            }
            .code { 
              background: #f5f5f5; 
              padding: 15px; 
              border-radius: 4px; 
              border: 1px solid #ddd; 
              word-break: break-all;
              font-family: monospace;
            }
            .footer { 
              color: #999; 
              font-size: 12px; 
              margin-top: 20px; 
            }
            .container {
              background: #ffffff;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p>Hello ${userName},</p>
            <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link in your browser:</p>
            <div class="code">${url}</div>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't create an account, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
            
            <div class="footer">
              <p>This verification link will expire in 24 hours.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
};