/**
 * Sends transactional email via Brevo HTTPS REST API
 * (Zero SDK imports, 100% reliable across all Node versions)
 */
const sendEmail = async ({ email, subject, message, text, otp }) => {
  if (!email) {
    console.error("❌ sendEmail aborted: Recipient email is missing.");
    return;
  }

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL ||
    process.env.EMAIL_USER ||
    "viditjain44gaya@gmail.com";

  if (!apiKey) {
    console.error("❌ BREVO_API_KEY is missing in environment variables.");
    if (otp) console.log(`👉 [FALLBACK OTP] for ${email}: ${otp}`);
    return;
  }

  const payload = {
    sender: {
      name: "ShopNest Support",
      email: senderEmail,
    },
    to: [
      {
        email: email,
      },
    ],
    subject: subject || "ShopNest Verification Code",
    htmlContent:
      message ||
      (otp
        ? `<h2>Your ShopNest OTP is: <b>${otp}</b></h2>`
        : "<p>Verification code enclosed.</p>"),
    textContent:
      text ||
      (otp
        ? `Your ShopNest OTP is: ${otp}`
        : message
          ? message.replace(/<[^>]*>?/gm, "")
          : ""),
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        `❌ [Brevo API Error] (${response.status}):`,
        data.message || JSON.stringify(data),
      );
      if (otp) console.log(`👉 [FALLBACK OTP] for ${email}: ${otp}`);
      return;
    }

    console.log(
      `✅ [Brevo Success] Email delivered to ${email} (MessageId: ${data.messageId})`,
    );
    return data;
  } catch (error) {
    console.error(
      `❌ [Network Error] Failed to send email to ${email}:`,
      error.message,
    );
    if (otp) console.log(`👉 [FALLBACK OTP] for ${email}: ${otp}`);
  }
};

module.exports = sendEmail;
