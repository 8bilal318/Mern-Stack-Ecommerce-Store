// Email setup check:  node scripts/test-mail.js
import "dotenv/config";
import { verifyMail, isMailConfigured } from "../helpers/mailer.js";

if (!isMailConfigured()) {
  console.log("Email settings missing in .env (BREVO_API_KEY, or SMTP_HOST + SMTP_USER + SMTP_PASS)");
  process.exit(1);
}

verifyMail()
  .then(() => console.log("Email OK - ready to send"))
  .catch((e) => console.log("Email FAIL:", e.message));