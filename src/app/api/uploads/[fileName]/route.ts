import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const UPLOAD_ROOT =
  process.env.UPLOAD_DIR?.trim() || path.join(process.cwd(), ".uploads");

function getContentType(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();

  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".doc") return "application/msword";
  if (ext === ".docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return "application/octet-stream";
}

function safeFileName(input: string) {
  return path.basename(input);
}

export async function GET(
  _req: Request,
  context: { params: { fileName: string } },
) {
  try {
    const rawFileName = context.params.fileName;
    const fileName = safeFileName(decodeURIComponent(rawFileName));
    const filePath = path.join(UPLOAD_ROOT, fileName);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const contentType = getContentType(fileName);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Failed to load file", { status: 500 });
  }
}
