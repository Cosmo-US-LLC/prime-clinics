import express from "express";
import dotenv from "dotenv";
import { SMTPClient } from "emailjs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";
import cors from "cors";
import process from "process";

dotenv.config();

// Email Setup
const client = new SMTPClient({
  user: process.env.SMTP_USER, // optigenix.help@gmail.com
  password: process.env.SMTP_PASS, // your Gmail App Password
  host: "smtp.gmail.com",
  ssl: true,
});

// Express Setup
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://138.197.29.179:4173",
      "http://localhost:3000",
      "https://application.primeclinics.ca",
      "http://142.93.158.21:5000",
      "http://142.93.158.21:4173",
    ],
    methods: "GET,POST,PUT",
    allowedHeaders: "Content-Type",
  })
);

app.use(express.json()); // allow JSON request bodies

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recordsDir = path.join(__dirname, "db");
const filesDir = path.join(recordsDir, "files");
const recordsFilePath = path.join(recordsDir, "records.json");

const ensureStorage = () => {
  fs.mkdirSync(filesDir, { recursive: true });
  fs.mkdirSync(recordsDir, { recursive: true });
};

const generateStoredFileName = (originalName) => {
  const ext = path.extname(originalName || "").toLowerCase();
  const base = path
    .basename(originalName || "file", ext)
    .replace(/[^a-z0-9_-]/gi, "_")
    .slice(0, 40);
  const stamp = Date.now();
  const id = crypto.randomUUID();
  const safeBase = base || "file";

  return `${stamp}_${id}_${safeBase}${ext}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureStorage();
    cb(null, filesDir);
  },
  filename: (req, file, cb) => {
    cb(null, generateStoredFileName(file.originalname));
  },
});

const allowedFileTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text",
  "text/plain",
  "application/rtf",
]);

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedFileTypes.has(file.mimetype)) {
      return cb(new Error("Unsupported file type."));
    }
    return cb(null, true);
  },
});

const readRecords = async (filePath = recordsFilePath) => {
  try {
    const raw = await fs.promises.readFile(filePath, "utf8");
    if (!raw.trim()) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      const fileName = path.basename(filePath);
      throw new Error(`${fileName} must contain an array.`);
    }
    return parsed;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

const writeRecords = async (records, filePath = recordsFilePath) => {
  await fs.promises.writeFile(
    filePath,
    JSON.stringify(records, null, 2),
    "utf8"
  );
};

const extractPayload = (body) => {
  const payload = body?.data ?? body;
  if (typeof payload === "string") {
    try {
      return JSON.parse(payload);
    } catch (error) {
      return {};
    }
  }
  return payload && typeof payload === "object" ? payload : {};
};

const normalizeFormKey = (value) => {
  if (!value) {
    return "";
  }
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 40);
};

const getFormRecordsFilePath = (req, res) => {
  const formKey = normalizeFormKey(req.params.formKey);
  if (!formKey) {
    res.status(400).json({ status: "error", message: "Invalid form key." });
    return null;
  }
  return path.join(recordsDir, `records-${formKey}.json`);
};

const createSaveResponseHandler = ({ getRecordsFilePath, fileFields = [] }) => {
  return (req, res) => {
    const handleSave = async () => {
      ensureStorage();

      const resolvedRecordsFilePath =
        typeof getRecordsFilePath === "function"
          ? getRecordsFilePath(req, res)
          : getRecordsFilePath;

      if (!resolvedRecordsFilePath) {
        return;
      }

      const payload = extractPayload(req.body);
      const sanitizedPayload = { ...payload };
      const fileFieldNames = fileFields.map((field) => field.name);

      for (const fieldName of fileFieldNames) {
        delete sanitizedPayload[fieldName];
      }

      const files = req.files || {};
      const filesPayload =
        fileFieldNames.length > 0
          ? fileFieldNames.reduce((acc, fieldName) => {
              const file = files[fieldName]?.[0];
              acc[fieldName] = file
                ? {
                    fileName: file.filename,
                    originalName: file.originalname,
                  }
                : null;
              return acc;
            }, {})
          : null;

      const record = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...sanitizedPayload,
        ...(filesPayload ? { files: filesPayload } : {}),
      };

      const records = await readRecords(resolvedRecordsFilePath);
      records.push(record);
      await writeRecords(records, resolvedRecordsFilePath);

      res.json({
        status: "success",
        message: "Data saved successfully!",
        recordId: record.id,
      });
    };

    if (req.is("multipart/form-data")) {
      const uploadHandler = fileFields.length
        ? upload.fields(fileFields)
        : upload.none();

      return uploadHandler(req, res, (error) => {
        if (error) {
          return res.status(400).json({
            status: "error",
            message: error.message || "Invalid upload.",
          });
        }

        handleSave().catch((err) => {
          console.error("Failed to save response:", err);
          res
            .status(500)
            .json({ status: "error", message: "Failed to save response." });
        });
      });
    }

    handleSave().catch((err) => {
      console.error("Failed to save response:", err);
      res
        .status(500)
        .json({ status: "error", message: "Failed to save response." });
    });
  };
};

/* ====================================
   📧 SEND EMAIL ROUTE
==================================== */
app.post("/api/send-mail", async (req, res) => {
  const { email, subject, messageHTML, messageText } = req.body;

  if (!email || !subject) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing fields." });
  }

  try {
    await client.sendAsync({
      from: "OptiGenix <optigenix.help@gmail.com>",
      to: email,
      subject,
      text: messageText,
      attachment: [{ data: messageHTML, alternative: true }],
    });

    res.json({ status: "success", message: "Email sent successfully!" });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).json({ status: "error", message: "Failed to send email." , error: error });
  }
});

/* ====================================
   🗂️ SAVE FORM RESPONSES (TEMP STORAGE)
==================================== */
app.post(
  "/api/save-response",
  createSaveResponseHandler({
    getRecordsFilePath: recordsFilePath,
    fileFields: [
      { name: "resume", maxCount: 1 },
      { name: "coverLetter", maxCount: 1 },
    ],
  })
);

app.post(
  "/api/save-response/:formKey",
  createSaveResponseHandler({
    getRecordsFilePath: getFormRecordsFilePath,
  })
);

/* ====================================
   🟩 SERVE VITE REACT BUILD (dist/)
==================================== */
app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

/* ====================================
   🚀 START SERVER
==================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
