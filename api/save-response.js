import multer from "multer";
import { put } from "@vercel/blob";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.oasis.opendocument.text",
      "text/plain",
      "application/rtf",
    ]);
    if (!allowed.has(file.mimetype)) {
      return cb(new Error("Unsupported file type."));
    }
    return cb(null, true);
  },
});

const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });

const uploadToBlob = async (file) => {
  if (!file) return { url: null, originalName: null };
  const ext = file.originalname.split(".").pop();
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { url } = await put(`job-applications/${safeName}`, file.buffer, {
    access: "public",
    contentType: file.mimetype,
  });
  return { url, originalName: file.originalname };
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    await runMiddleware(
      req,
      res,
      upload.fields([
        { name: "resume", maxCount: 1 },
        { name: "coverLetter", maxCount: 1 },
      ])
    );
  } catch (err) {
    return res.status(400).json({ status: "error", message: err.message || "Invalid upload." });
  }

  const { fullName, email, phone, position, motivation, expertise } = req.body;

  if (!fullName || !email || !phone || !position) {
    return res.status(400).json({ status: "error", message: "Missing required fields." });
  }

  try {
    const [resumeResult, coverLetterResult] = await Promise.all([
      uploadToBlob(req.files?.resume?.[0] ?? null),
      uploadToBlob(req.files?.coverLetter?.[0] ?? null),
    ]);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase.from("job_applications").insert({
      id: crypto.randomUUID(),
      full_name: fullName,
      email,
      phone,
      position,
      motivation: motivation || null,
      expertise: expertise || null,
      resume_url: resumeResult.url,
      resume_original_name: resumeResult.originalName,
      cover_letter_url: coverLetterResult.url,
      cover_letter_original_name: coverLetterResult.originalName,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ status: "error", message: error.message });
    }

    res.json({ status: "success", message: "Application submitted successfully!" });
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
}
