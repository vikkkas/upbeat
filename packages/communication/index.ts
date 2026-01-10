import { Resend } from "resend";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail?: string) {
    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail || "Upbeat <onboarding@resend.dev>";
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }

  async sendDowntimeAlert(
    email: string,
    websiteUrl: string,
    timestamp: Date
  ): Promise<void> {
    const subject = `🚨 Alert: ${websiteUrl} is DOWN`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9fafb;
            }
            .container {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .alert-box {
              background: #fef2f2;
              border-left: 4px solid #dc2626;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .website-url {
              font-size: 20px;
              font-weight: 600;
              color: #dc2626;
              margin: 15px 0;
              word-break: break-all;
            }
            .timestamp {
              color: #6b7280;
              font-size: 14px;
              margin-top: 10px;
            }
            .action-items {
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .action-items h3 {
              margin-top: 0;
              color: #1f2937;
              font-size: 16px;
            }
            .action-items ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .action-items li {
              margin: 8px 0;
              color: #4b5563;
            }
            .btn {
              display: inline-block;
              background: #10b981;
              color: white !important;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 8px;
              margin-top: 20px;
              font-weight: 600;
              text-align: center;
            }
            .footer {
              text-align: center;
              padding: 30px;
              background: #f9fafb;
              color: #6b7280;
              font-size: 13px;
              border-top: 1px solid #e5e7eb;
            }
            .logo {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚡ Upbeat</div>
              <h1>⚠️ Downtime Alert</h1>
            </div>
            <div class="content">
              <div class="alert-box">
                <p style="margin-top: 0; font-weight: 600;">Your monitored website is currently experiencing downtime:</p>
                <div class="website-url">${websiteUrl}</div>
                <div class="timestamp">🕐 Detected at: ${timestamp.toLocaleString('en-US', { 
                  dateStyle: 'full', 
                  timeStyle: 'long' 
                })}</div>
              </div>
              
              <p>We detected that your website is not responding. Our system will continue monitoring and notify you when it's back online.</p>
              
              <div class="action-items">
                <h3>🔧 What you should do:</h3>
                <ul>
                  <li>Check your server status and resource usage</li>
                  <li>Review server logs for errors or crashes</li>
                  <li>Verify DNS configuration and domain settings</li>
                  <li>Check SSL certificate validity</li>
                  <li>Contact your hosting provider if needed</li>
                </ul>
              </div>
              
              <center>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">
                  📊 View Dashboard
                </a>
              </center>
            </div>
            <div class="footer">
              <p style="margin: 5px 0;">This is an automated alert from Upbeat Monitoring Service</p>
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} Upbeat. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  async sendUptimeRestoredAlert(
    email: string,
    websiteUrl: string,
    timestamp: Date,
    downtimeDuration: string
  ): Promise<void> {
    const subject = `✅ Resolved: ${websiteUrl} is back ONLINE`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9fafb;
            }
            .container {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .success-box {
              background: #f0fdf4;
              border-left: 4px solid #10b981;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .website-url {
              font-size: 20px;
              font-weight: 600;
              color: #10b981;
              margin: 15px 0;
              word-break: break-all;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin: 12px 0;
              padding: 12px;
              background: #f9fafb;
              border-radius: 6px;
            }
            .info-label {
              font-weight: 600;
              color: #4b5563;
            }
            .info-value {
              color: #1f2937;
            }
            .btn {
              display: inline-block;
              background: #10b981;
              color: white !important;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 8px;
              margin-top: 20px;
              font-weight: 600;
            }
            .footer {
              text-align: center;
              padding: 30px;
              background: #f9fafb;
              color: #6b7280;
              font-size: 13px;
              border-top: 1px solid #e5e7eb;
            }
            .logo {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚡ Upbeat</div>
              <h1>✅ Service Restored</h1>
            </div>
            <div class="content">
              <div class="success-box">
                <p style="margin-top: 0; font-weight: 600;">🎉 Good news! Your website is back online:</p>
                <div class="website-url">${websiteUrl}</div>
              </div>
              
              <div class="info-row">
                <span class="info-label">⏰ Restored at:</span>
                <span class="info-value">${timestamp.toLocaleString('en-US', { 
                  dateStyle: 'medium', 
                  timeStyle: 'short' 
                })}</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">⏱️ Downtime duration:</span>
                <span class="info-value">${downtimeDuration}</span>
              </div>
              
              <p style="margin-top: 30px;">Your website is now responding normally. We'll continue monitoring to ensure it stays online.</p>
              
              <center>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">
                  📊 View Dashboard
                </a>
              </center>
            </div>
            <div class="footer">
              <p style="margin: 5px 0;">This is an automated alert from Upbeat Monitoring Service</p>
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} Upbeat. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }
}

// Singleton instance
let emailServiceInstance: EmailService | null = null;

export function initializeEmailService(apiKey: string, fromEmail?: string): EmailService {
  emailServiceInstance = new EmailService(apiKey, fromEmail);
  return emailServiceInstance;
}

export function getEmailService(): EmailService {
  if (!emailServiceInstance) {
    throw new Error("Email service not initialized. Call initializeEmailService first.");
  }
  return emailServiceInstance;
}

