import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

type UploadResponse = {
  success: boolean;
  file?: {
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
  };
  error?: string;
};

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const UPLOAD_ROOT =
  process.env.UPLOAD_DIR?.trim() || path.join(process.cwd(), ".uploads");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_ROOT)) {
    fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
  }

  return UPLOAD_ROOT;
}

function sanitizeFileName(name: string) {
  const cleaned = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "");

  return cleaned || `file-${Date.now()}`;
}

function getSafeExtension(fileName: string, mimeType: string) {
  const fromName = path.extname(fileName).toLowerCase();

  if (fromName) return fromName;

  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/gif") return ".gif";
  if (mimeType === "application/pdf") return ".pdf";
  if (mimeType === "application/msword") return ".doc";
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return ".docx";
  }

  return "";
}

function isAllowedMimeType(mimeType: string) {
  return [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ].includes(mimeType);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json<UploadResponse>(
        { success: false, error: "No file uploaded." },
        { status: 400 },
      );
    }

    if (file.size <= 0) {
      return NextResponse.json<UploadResponse>(
        { success: false, error: "Uploaded file is empty." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json<UploadResponse>(
        {
          success: false,
          error: "File is too large. Maximum size is 25MB.",
        },
        { status: 400 },
      );
    }

    if (!isAllowedMimeType(file.type)) {
      return NextResponse.json<UploadResponse>(
        {
          success: false,
          error: `Unsupported file type: ${file.type || "unknown"}.`,
        },
        { status: 400 },
      );
    }

    const uploadDir = ensureUploadDir();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sanitizedOriginalName = sanitizeFileName(file.name || "upload");
    const originalExtension = path.extname(sanitizedOriginalName);
    const safeExtension = getSafeExtension(sanitizedOriginalName, file.type);
    const extension = originalExtension || safeExtension;
    const baseName = path.basename(
      sanitizedOriginalName,
      originalExtension || safeExtension,
    );

    const uniqueName = `${baseName || "file"}-${Date.now()}${extension}`;
    const filePath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json<UploadResponse>({
      success: true,
      file: {
        url: `/api/uploads/${encodeURIComponent(uniqueName)}`,
        fileName: uniqueName,
        mimeType: file.type,
        size: file.size,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown upload error";

    return NextResponse.json<UploadResponse>(
      {
        success: false,
        error: `Upload failed: ${message}`,
      },
      { status: 500 },
    );
  }
}
