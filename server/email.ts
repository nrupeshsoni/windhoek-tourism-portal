import nodemailer from 'nodemailer';

// EmailIt SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.emailit.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.SMTP_USER || 'emailit',
    pass: process.env.SMTP_PASSWORD || process.env.EMAILIT_API_KEY,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Namibia Tourism Portal" <noreply@namibiatourism.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

// Email templates
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Welcome to Namibia Tourism Portal!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4a574 0%, #8b6914 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; letter-spacing: 3px; }
          .content { padding: 30px; background: #faf8f5; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .btn { display: inline-block; padding: 12px 30px; background: #d4a574; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NAMIBIA</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${name}!</h2>
            <p>Thank you for joining the Namibia Tourism Portal. You now have access to:</p>
            <ul>
              <li>72+ curated travel routes across Namibia</li>
              <li>6,900+ tourism listings and services</li>
              <li>AI-powered Safari Guide for trip planning</li>
              <li>Save favorites and create custom itineraries</li>
            </ul>
            <p>Start exploring the Land of the Brave!</p>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.SITE_URL || 'https://namibiatourism.com'}/routes" class="btn">Explore Routes</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Namibia Tourism Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Reset Your Password - Namibia Tourism Portal',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4a574 0%, #8b6914 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; letter-spacing: 3px; }
          .content { padding: 30px; background: #faf8f5; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .btn { display: inline-block; padding: 12px 30px; background: #d4a574; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NAMIBIA</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" class="btn">Reset Password</a>
            </p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p style="font-size: 12px; color: #666;">This link will expire in 1 hour.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Namibia Tourism Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendContactNotification(
  name: string,
  email: string,
  message: string
): Promise<boolean> {
  return sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@namibiatourism.com',
    subject: `New Contact Form Submission - ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #333; padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 20px; background: #f9f9f9; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div>${name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div>${message}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
