import nodemailer from "nodemailer";
import path from "path";

const appName = "afrin";
const supportEmail = "support@afrin.io";

// SMTP Configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || ""
const SMTP_SECURE = process.env.SMTP_SECURE === "true";

const appUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const logoPath = path.join(process.cwd(), "public", "logo.png");

// Create reusable Nodemailer transporter instance
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

/**
 * Common HTML Wrapper for Email Notifications
 */
function renderEmailTemplate({
  title,
  preheader,
  contentHtml,
}: {
  title: string;
  preheader?: string;
  contentHtml: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c071e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #f3f4f6;">
  ${preheader ? `<div style="display: none; max-height: 0px; overflow: hidden;">${preheader}</div>` : ""}
  
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c071e; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #1d1438; border: 1px solid #3b0764; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding: 32px 24px 20px 24px; background: linear-gradient(180deg, #2e1065 0%, #1d1438 100%); border-bottom: 1px solid #3b0764;">
              <a href="${appUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="cid:logo@${appName}" alt="${appName} Logo" width="80" height="80" style="display: block; width: 80px; height: auto; border: 0;" />
              </a>
              <h1 style="margin: 16px 0 0 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                ${appName}
              </h1>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 32px 28px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 20px; background-color: #160e2e; border-top: 1px solid #2e1065; color: #9ca3af; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 12px 0;">
                If you have questions or need support, contact us at <a href="mailto:${supportEmail}" style="color: #d946ef; text-decoration: none;">${supportEmail}</a>
              </p>
              <p style="margin: 0; color: #6b7280;">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * General internal email dispatcher with CID logo attachment support
 */
async function sendMail({
  to,
  subject,
  html,
  preheader,
}: {
  to: string;
  subject: string;
  html: string;
  preheader?: string;
}) {

  if (process.env.NODE_ENV === "development") {
    console.log("===SMTP===");
    console.log({ subject, html });
    return { success: true, messageId: "xxxxxxxxxxxxxxxxxx" };
  }

  try {
    if (!SMTP_HOST) {
      console.log(`[SMTP Notice] SMTP_HOST not configured. Email to ${to} ("${subject}") logged to console instead.`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: `logo@${appName}`,
        },
      ],
    });

    console.log(`[SMTP Success] Email sent to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[SMTP Error] Failed to send email to ${to}:`, error);
    return { success: false, error };
  }
}

/**
 * 1. Register / Email Verification OTP Email
 */
export async function sendRegisterOtpEmail({ to, otp, userName }: { to: string; otp: string; userName?: string }) {
  const title = `Verify Your ${appName} Email`;
  const nameDisplay = userName ? `Hello <strong>${userName}</strong>,` : "Hello,";
  const contentHtml = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #ffffff;">Email Verification Code</h2>
    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #e5e7eb;">
      ${nameDisplay} thank you for creating your account with <strong>${appName}</strong>. Please use the verification code below to complete your registration:
    </p>

    <!-- OTP Display Box -->
    <div style="margin: 28px 0; text-align: center; background-color: #0c071e; border: 1px dashed #a855f7; border-radius: 12px; padding: 20px 10px;">
      <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #c084fc; font-family: monospace;">
        ${otp}
      </span>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">
        This verification code is valid for 10 minutes.
      </p>
    </div>

    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9ca3af;">
      If you did not initiate this, please safely ignore this email or contact our support team.
    </p>
  `;

  return sendMail({
    to,
    subject: `[${appName}] ${otp} is your email verification code`,
    preheader: `${otp} is your ${appName} verification code.`,
    html: renderEmailTemplate({ title, preheader: `${otp} is your verification code`, contentHtml }),
  });
}

/**
 * 2. Reset Password OTP Email
 */
export async function sendResetPasswordOtpEmail({ to, otp, userName }: { to: string; otp: string; userName?: string }) {
  const title = `Reset Your ${appName} Password`;
  const nameDisplay = userName ? `Hello <strong>${userName}</strong>,` : "Hello,";
  const contentHtml = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #ffffff;">Password Reset Request</h2>
    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #e5e7eb;">
      ${nameDisplay} we received a request to reset your password for your <strong>${appName}</strong> account. Use the code below to proceed:
    </p>

    <!-- OTP Display Box -->
    <div style="margin: 28px 0; text-align: center; background-color: #0c071e; border: 1px dashed #ec4899; border-radius: 12px; padding: 20px 10px;">
      <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #f472b6; font-family: monospace;">
        ${otp}
      </span>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">
        This OTP code expires in 10 minutes.
      </p>
    </div>

    <div style="background-color: #312e81; border-left: 4px solid #f43f5e; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 13px; color: #fda4af;">
        <strong>Security Notice:</strong> Never share this OTP with anyone. ${appName} staff will never ask for your verification code.
      </p>
    </div>

    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9ca3af;">
      If you did not request a password reset, please secure your account immediately.
    </p>
  `;

  return sendMail({
    to,
    subject: `[${appName}] ${otp} is your password reset code`,
    preheader: `Use ${otp} to reset your ${appName} password.`,
    html: renderEmailTemplate({ title, preheader: `Reset password code: ${otp}`, contentHtml }),
  });
}