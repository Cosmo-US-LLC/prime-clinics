import { SMTPClient } from "emailjs";

const ALLOWED_ORIGINS = [
  "https://prime-clinics-website-eight.vercel.app",
  "https://prime-clinics-chi.vercel.app",
  "https://prime-clinics-omega.vercel.app",
  "https://prime-clinics-website.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(503).json({ status: "skipped", message: "Email not configured." });
  }

  const { email, subject, messageHTML, messageText } = req.body;

  if (!email || !subject) {
    return res.status(400).json({ status: "error", message: "Missing fields." });
  }

  const client = new SMTPClient({
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
    host: "smtp.gmail.com",
    ssl: true,
  });

  try {
    await client.sendAsync({
      from: `Prime Clinics <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      text: messageText,
      attachment: [{ data: messageHTML, alternative: true }],
    });

    res.json({ status: "success", message: "Email sent successfully!" });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).json({ status: "error", message: "Failed to send email." });
  }
}
