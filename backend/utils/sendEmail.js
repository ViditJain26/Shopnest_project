const {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} = require("@getbrevo/brevo");

let apiInstance = null;

const getBrevoClient = () => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("❌ BREVO_API_KEY is missing in environment variables.");
    return null;
  }

  if (!apiInstance) {
    apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
  }
  return apiInstance;
};

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

  const sendSmtpEmail = new SendSmtpEmail();
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

  sendSmtpEmail.sender = {
    name: "ShopNest Support",
    email:
      process.env.BREVO_SENDER_EMAIL ||
      process.env.EMAIL_USER ||
      "viditjain44gaya@gmail.com",
  };

  sendSmtpEmail.to = [{ email }];

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
