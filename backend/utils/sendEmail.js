const SibApiV3Sdk = require("@getbrevo/brevo");

let apiInstance = null;

const getBrevoClient = () => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("❌ BREVO_API_KEY is missing in environment variables.");
    return null;
  }

  if (!apiInstance) {
    apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      apiKey,
    );
  }
  return apiInstance;
};

/**
 * Sends transactional email via Brevo HTTPS REST API (Port 443 - zero block issues on cloud)
 * @param {Object} params
 * @param {string} params.email - Recipient email address
 * @param {string} [params.subject] - Email subject line
 * @param {string} [params.message] - HTML content of the message
 * @param {string} [params.text] - Optional plain text alternative
 * @param {string|number} [params.otp] - Optional OTP code for fallback logging
 */
const sendEmail = async ({ email, subject, message, text, otp }) => {
  if (!email) {
    console.error("❌ sendEmail aborted: Recipient email is missing.");
    return;
  }

  const client = getBrevoClient();

  if (!client) {
    if (otp) console.log(`👉 [FALLBACK OTP] for ${email}: ${otp}`);
    return;
  }

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subject || "ShopNest Verification Code";
  sendSmtpEmail.htmlContent =
    message ||
    (otp
      ? `<h2>Your ShopNest OTP is: <b>${otp}</b></h2>`
      : "<p>Verification code enclosed.</p>");
  sendSmtpEmail.textContent =
    text ||
    (otp
      ? `Your ShopNest OTP is: ${otp}`
      : message
        ? message.replace(/<[^>]*>?/gm, "")
        : "");

  // Sender email registered and verified in your Brevo account
  sendSmtpEmail.sender = {
    name: "ShopNest Support",
    email:
      process.env.BREVO_SENDER_EMAIL ||
      process.env.EMAIL_USER ||
      "viditjain44gaya@gmail.com",
  };

  sendSmtpEmail.to = [{ email: email }];

  try {
    const data = await client.sendTransacEmail(sendSmtpEmail);
    console.log(
      `✅ Email successfully sent via Brevo to ${email} (MessageId: ${data.messageId})`,
    );
    return data;
  } catch (error) {
    console.error(
      `❌ [Brevo Error] Failed to send email to ${email}:`,
      error.message,
    );
    if (otp) console.log(`👉 [FALLBACK OTP] for ${email}: ${otp}`);
  }
};

module.exports = sendEmail;
