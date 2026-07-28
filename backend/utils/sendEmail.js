const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
    const pass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

    if (!user || !pass) {
      console.error(
        `❌ Email sending aborted: EMAIL_USER (${user}) or EMAIL_PASS missing in .env file`,
      );
      throw new Error(
        "EMAIL_USER or EMAIL_PASS is missing in environment variables.",
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: pass, // 16-character App Password (no spaces)
      },
    });

    const mailOptions = {
      from: `"ShopNest Support" <${user}>`,
      to: email,
      subject: subject,
      html: message,
    };

    console.log(`[Email Attempt] Sending message from ${user} to ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `✅ Email successfully sent to ${email} (ID: ${info.messageId})`,
    );
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}: ${error.message}`);
    throw error; // Propagate error so authController's catch block executes!
  }
};

module.exports = sendEmail;
