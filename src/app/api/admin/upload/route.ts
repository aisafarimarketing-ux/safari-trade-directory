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

function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return uploadDir;
}

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-]/g, "");
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json<UploadResponse>(
        { success: false, error: "No file uploaded." },
        { status: 400 },
      );
    }

    const uploadDir = ensureUploadDir();

    const buffer = Buffer.from(await file.arrayBuffer());

    const originalName = sanitizeFileName(file.name);
    const extension = path.extname(originalName) || "";
    const base = path.basename(originalName, extension);

    const uniqueName =
      base +
      "-" +
      Date.now().toString() +
      extension;

    const filePath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json<UploadResponse>({
      success: true,
      file: {
        url: publicUrl,
        fileName: uniqueName,
        mimeType: file.type,
        size: file.size,
      },
    });
  } catch (error) {
    return NextResponse.json<UploadResponse>(
      {
        success: false,
        error: "Upload failed.",
      },
      { status: 500 },
    );
  }
}
