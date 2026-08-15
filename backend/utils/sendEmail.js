const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

  if (!user || !pass) {
    console.error(
      "❌ EMAIL_USER or EMAIL_PASS is missing in environment variables.",
    );
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use STARTTLS on port 587
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      family: 4, // ⚠️ CRITICAL: Forces IPv4 to resolve ENETUNREACH on Render
      connectionTimeout: 10000, // 10s timeout prevents hanging requests
    });
  }
  return transporter;
};

/**
 * Sends an email using Nodemailer.
 * @param {Object} params
 * @param {string} params.email - Recipient email address
 * @param {string} params.subject - Email subject line
 * @param {string} params.message - HTML content of the message
 * @param {string} [params.text] - Optional plain text alternative
 * @param {string|number} [params.otp] - Optional OTP code for fallback logging
 */
const sendEmail = async ({ email, subject, message, text, otp }) => {
  if (!email) {
    console.error("❌ sendEmail aborted: Recipient email is missing.");
    return;
  }

  const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const activeTransporter = getTransporter();

  if (!activeTransporter) {
    if (otp) console.log(`👉 [FALLBACK OTP] for ${email}: ${otp}`);
    return;
  }

  try {
    const mailOptions = {
      from: `"ShopNest Support" <${user}>`,
      to: email,
      subject: subject || "ShopNest Verification",
      html: message || (otp ? `<h2>Your OTP is: <b>${otp}</b></h2>` : ""),
      text:
        text ||
        (message ? message.replace(/<[^>]*>?/gm, "") : `Your OTP is: ${otp}`),
    };

    console.log(`[Email Attempt] Sending message to ${email}...`);
    const info = await activeTransporter.sendMail(mailOptions);
    console.log(
      `✅ Email successfully sent to ${email} (ID: ${info.messageId})`,
    );
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}: ${error.message}`);
    // Fallback: Always print OTP in Render logs so you are never locked out
    if (otp) console.log(`👉 [FALLBACK OTP] for ${email}: ${otp}`);
  }
};

module.exports = sendEmail;
