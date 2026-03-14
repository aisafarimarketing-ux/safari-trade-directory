import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ImportPdfResponse = {
  success: boolean;
  extractedText?: string;
  parsed?: {
    name?: string;
    companySlug?: string;
    location?: string;
    class?: string;
    vibe?: string;
    website?: string;
    mapLink?: string;
    snapshot?: {
      rooms?: string;
      location?: string;
      bestFor?: string;
      setting?: string;
      style?: string;
      access?: string;
    };
    rates?: {
      notes?: string[];
      rows?: Array<{
        season?: string;
        dates?: string;
        rackPPPN?: string;
      }>;
    };
    experiences?: {
      included?: string[];
      paid?: string[];
    };
    policies?: {
      childPolicy?: string;
      honeymoonPolicy?: string;
      cancellation?: string;
      importantNotes?: string[];
      tradeNotes?: string[];
    };
    contacts?: {
      reservations?: Array<{
        name?: string;
        role?: string;
        email?: string;
        phone?: string;
        whatsapp?: string;
      }>;
      sales?: Array<{
        name?: string;
        role?: string;
        email?: string;
        phone?: string;
        whatsapp?: string;
      }>;
      marketing?: Array<{
        name?: string;
        role?: string;
        email?: string;
        phone?: string;
        whatsapp?: string;
      }>;
    };
    enquiryEmail?: string;
    enquiryWhatsApp?: string;
    enquirySubject?: string;
    quickTags?: string[];
    tradeProfileLabel?: string;
    tradeProfileSub?: string;
  };
  warnings?: string[];
  error?: string;
};

function cleanText(value: string): string {
  return value
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniq(values: string[]): string[] {
  return Array.from(
    new Set(values.map((item) => item.trim()).filter(Boolean)),
  );
}

function matchLineValue(text: string, labels: string[]): string {
  const lines = text.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();

    for (const label of labels) {
      const regex = new RegExp(`^${label}\\s*[:\\-]\\s*(.+)$`, "i");
      const match = line.match(regex);
      if (match?.[1]) {
        return match[1].trim();
      }
    }
  }

  return "";
}

function extractEmails(text: string): string[] {
  const matches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return uniq(matches);
}

function extractPhones(text: string): string[] {
  const matches =
    text.match(/(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}[\s-]?\d{0,4}/g) ||
    [];

  return uniq(
    matches
      .map((item) => item.trim())
      .filter((item) => item.replace(/\D/g, "").length >= 7),
  );
}

function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s)]+/gi) || [];
  return uniq(matches);
}

function extractLikelyPropertyName(text: string): string {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return "";

  const explicit =
    matchLineValue(text, ["property", "camp", "lodge", "name", "property name"]) ||
    "";

  if (explicit) return explicit;

  for (const line of lines.slice(0, 8)) {
    if (
      line.length >= 4 &&
      line.length <= 80 &&
      !/fact sheet|rate sheet|rack rates|tariff|quotation|sto|trade/i.test(line)
    ) {
      return line;
    }
  }

  return lines[0] || "";
}

function extractRoomCount(text: string): string {
  const direct = matchLineValue(text, ["rooms", "tents", "suites", "keys"]);
  if (direct) return direct;

  const match = text.match(/\b(\d{1,3})\s+(?:rooms|tents|suites|keys)\b/i);
  return match?.[1] || "";
}

function extractRates(text: string): Array<{
  season?: string;
  dates?: string;
  rackPPPN?: string;
}> {
  const lines = text.split("\n").map((line) => line.trim());
  const rows: Array<{ season?: string; dates?: string; rackPPPN?: string }> = [];

  for (const line of lines) {
    const moneyMatch = line.match(
      /\$ ?\d+(?:[.,]\d+)?|usd ?\d+(?:[.,]\d+)?|\d+(?:[.,]\d+)? ?usd/i,
    );

    if (!moneyMatch) continue;

    const seasonMatch = line.match(
      /\b(high|peak|shoulder|green|low|mid|festive)\b/i,
    );

    const dateMatch = line.match(
      /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b(?:\s*[-–]\s*\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b)?/i,
    );

    rows.push({
      season: seasonMatch?.[0] || "",
      dates: dateMatch?.[0] || "",
      rackPPPN: moneyMatch[0].replace(/\s+/g, " ").trim(),
    });
  }

  return rows.slice(0, 12);
}

function extractBulletSection(text: string, headings: string[]): string[] {
  const lines = text.split("\n");
  const startIndexes: number[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim().toLowerCase();
    if (headings.some((heading) => line === heading.toLowerCase())) {
      startIndexes.push(i);
    }
  }

  for (const startIndex of startIndexes) {
    const items: string[] = [];

    for (let i = startIndex + 1; i < lines.length; i += 1) {
      const line = lines[i].trim();

      if (!line) {
        if (items.length > 0) break;
        continue;
      }

      if (/^[A-Z][A-Za-z ]{2,30}$/.test(line) && items.length > 0) {
        break;
      }

      const bulletMatch = line.match(/^(?:[-•*]|–)\s*(.+)$/);
      if (bulletMatch?.[1]) {
        items.push(bulletMatch[1].trim());
      } else if (items.length > 0) {
        break;
      }
    }

    if (items.length > 0) return uniq(items);
  }

  return [];
}

function parsePdfText(text: string) {
  const cleaned = cleanText(text);

  const emails = extractEmails(cleaned);
  const phones = extractPhones(cleaned);
  const urls = extractUrls(cleaned);

  const propertyName = extractLikelyPropertyName(cleaned);
  const location =
    matchLineValue(cleaned, ["location", "region", "area", "destination"]) || "";
  const propertyClass =
    matchLineValue(cleaned, ["type", "camp type", "class", "category"]) || "";
  const bestFor =
    matchLineValue(cleaned, ["best for", "ideal for"]) || "";
  const setting =
    matchLineValue(cleaned, ["setting"]) || "";
  const style =
    matchLineValue(cleaned, ["style"]) || "";
  const access =
    matchLineValue(cleaned, ["access", "airstrip", "getting there"]) || "";
  const website =
    urls.find((item) => !/drive\.google|dropbox|wetransfer/i.test(item)) || "";
  const mapLink = urls.find((item) => /google\.com\/maps|maps\./i.test(item)) || "";
  const roomCount = extractRoomCount(cleaned);

  const included = extractBulletSection(cleaned, [
    "included",
    "inclusions",
    "includes",
  ]);

  const paid = extractBulletSection(cleaned, [
    "excluded",
    "exclusions",
    "additional activities",
    "paid activities",
    "supplements",
  ]);

  const importantNotes = extractBulletSection(cleaned, [
    "important notes",
    "notes",
  ]);

  const rates = extractRates(cleaned);

  const quickTags = uniq(
    [propertyClass, bestFor, style, location].filter(Boolean),
  ).slice(0, 6);

  const contacts =
    emails.length > 0 || phones.length > 0
      ? {
          sales: [
            {
              name: "",
              role: "Sales",
              email: emails[0] || "",
              phone: phones[0] || "",
              whatsapp: phones[0] || "",
            },
          ],
        }
      : undefined;

  return {
    name: propertyName || undefined,
    companySlug: propertyName ? slugify(propertyName) : undefined,
    location: location || undefined,
    class: propertyClass || undefined,
    vibe: "",
    website: website || undefined,
    mapLink: mapLink || undefined,
    snapshot: {
      rooms: roomCount || undefined,
      location: location || undefined,
      bestFor: bestFor || undefined,
      setting: setting || undefined,
      style: style || undefined,
      access: access || undefined,
    },
    rates: {
      notes: [
        "Imported from PDF",
        "Please review before publishing",
      ],
      rows: rates,
    },
    experiences: {
      included,
      paid,
    },
    policies: {
      importantNotes,
    },
    contacts,
    enquiryEmail: emails[0] || undefined,
    enquiryWhatsApp: phones[0] || undefined,
    enquirySubject: propertyName
      ? `Trade Request - ${propertyName}`
      : "Trade Request",
    quickTags,
    tradeProfileLabel: "",
    tradeProfileSub: "Imported from PDF",
  };
}

async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const dynamicImporter = new Function(
      "m",
      "return import(m)",
    ) as (moduleName: string) => Promise<unknown>;

    const imported = (await dynamicImporter("pdf-parse")) as {
      default?: (buffer: Buffer) => Promise<{ text?: string }>;
    };

    const pdfParse =
      typeof imported.default === "function" ? imported.default : null;

    if (!pdfParse) {
      throw new Error("pdf-parse is not available.");
    }

    const result = await pdfParse(buffer);
    return cleanText(result.text || "");
  } catch (error) {
    throw new Error(
      "PDF parser not available yet. Install pdf-parse to enable PDF text extraction.",
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json<ImportPdfResponse>(
        { success: false, error: "No PDF uploaded." },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json<ImportPdfResponse>(
        { success: false, error: "Only PDF files are supported." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extractedText = await extractTextFromPdfBuffer(buffer);

    if (!extractedText) {
      return NextResponse.json<ImportPdfResponse>(
        {
          success: false,
          error: "Could not extract readable text from this PDF.",
        },
        { status: 422 },
      );
    }

    const parsed = parsePdfText(extractedText);

    return NextResponse.json<ImportPdfResponse>({
      success: true,
      extractedText,
      parsed,
      warnings: [
        "Imported values are heuristic and should be reviewed before saving.",
        "Complex PDF layouts may need manual correction.",
      ],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PDF import failed.";

    return NextResponse.json<ImportPdfResponse>(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
