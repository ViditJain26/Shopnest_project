const { Resend } = require("resend");

let resendClient = null;

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("❌ RESEND_API_KEY is missing in environment variables.");
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
};

/**
 * Sends transactional email via Resend HTTPS API (Port 443 - zero block issues on cloud)
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

  const resend = getResendClient();

  if (!resend) {
    if (otp) console.log(`👉 [FALLBACK OTP] for ${email}: ${otp}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "ShopNest Support <onboarding@resend.dev>",
      to: email,
      subject: subject || "ShopNest Verification Code",
      html: message || (otp ? `<h2>Your ShopNest OTP is: <b>${otp}</b></h2>` : "<p>Verification code enclosed.</p>"),
      text: text || (otp ? `Your ShopNest OTP is: ${otp}` : message ? message.replace(/<[^>]*>?/gm, "") : ""),
    });

    if (error) {
      console.error(`❌ [Resend Error] Failed to send email to ${email}:`, error.message);
      if (otp) console.log(`👉 [FALLBACK OTP] for ${email}: ${otp}`);
      return;
    }

    console.log(`✅ Email successfully sent via Resend to ${email} (ID: ${data.id})`);
    return data;
  } catch (error) {
    console.error(`❌ [API Error] Failed to send email to ${email}:`, error.message);
    if (otp) console.log(`👉 [FALLBACK OTP] for ${email}: ${otp}`);
  }
};

module.exports = sendEmail;