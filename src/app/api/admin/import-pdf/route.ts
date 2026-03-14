import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ParsedContact = {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
};

type ParsedRateRow = {
  season?: string;
  dates?: string;
  rackPPPN?: string;
};

type ParsedPayload = {
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
    rows?: ParsedRateRow[];
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
    reservations?: ParsedContact[];
    sales?: ParsedContact[];
    marketing?: ParsedContact[];
  };
  enquiryEmail?: string;
  enquiryWhatsApp?: string;
  enquirySubject?: string;
  quickTags?: string[];
  tradeProfileLabel?: string;
  tradeProfileSub?: string;
};

type ImportPdfResponse = {
  success: boolean;
  extractedText?: string;
  parsed?: ParsedPayload;
  warnings?: string[];
  error?: string;
};

const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024;

function cleanText(value: string): string {
  return value
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean)));
}

function normalizeSpacedWord(value: string): string {
  return value
    .replace(/\b([A-Z])\s(?=[A-Z]\b)/g, "$1")
    .replace(/\b([A-Z])\s(?=[A-Z][A-Z])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractEmails(text: string): string[] {
  const matches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return uniq(matches);
}

function extractPhones(text: string): string[] {
  const matches =
    text.match(
      /(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}[\s-]?\d{0,4}/g,
    ) || [];

  return uniq(
    matches
      .map((item) => item.trim())
      .filter((item) => item.replace(/\D/g, "").length >= 7),
  );
}

function extractUrls(text: string): string[] {
  const direct = text.match(/https?:\/\/[^\s)]+/gi) || [];
  const bareDomains =
    text.match(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)+\.[a-z]{2,}\b/gi) || [];

  return uniq([...direct, ...bareDomains]);
}

function matchBlock(text: string, startLabel: string, endLabels: string[] = []): string {
  const start = text.toLowerCase().indexOf(startLabel.toLowerCase());
  if (start === -1) return "";

  const after = text.slice(start);
  let end = after.length;

  for (const label of endLabels) {
    const idx = after.toLowerCase().indexOf(label.toLowerCase());
    if (idx > 0 && idx < end) end = idx;
  }

  return after.slice(0, end).trim();
}

function extractLineValue(block: string, label: string): string {
  const regex = new RegExp(`${label}\\s*:\\s*(.+)`, "i");
  const match = block.match(regex);
  return match?.[1]?.trim() || "";
}

function parseNyumbaniCampDetails(text: string) {
  const block = matchBlock(text, "Ny umb ani C amp", [
    "Hil a l a C amp",
    "A C T I V I T I E S",
  ]);

  if (!block) {
    return {
      rooms: "",
      location: "",
      access: "",
      style: "",
    };
  }

  const location =
    extractLineValue(block, "Location") ||
    "Ngarenanyuki 2 in Central Serengeti";

  const accessRaw = extractLineValue(block, "Nearest Airstrip");
  const access = accessRaw ? accessRaw.replace(/\s+/g, " ").trim() : "Seronera";

  const style = block.includes("Family Tented Suite")
    ? "Tented camp with family suite"
    : "Tented camp";

  const tentMatch = block.match(
    /(\d+)\s+Standard Tented Suites\s*\+\s*(\d+)\s+Family Tented Suite/i,
  );

  let rooms = "";
  if (tentMatch) {
    const standard = Number(tentMatch[1]);
    const family = Number(tentMatch[2]);
    rooms = `${standard + family} tents (${standard} standard + ${family} family)`;
  } else {
    const fallback = block.match(/Tents:\s*(.+)/i);
    rooms = fallback?.[1]?.trim() || "";
  }

  return {
    rooms,
    location,
    access,
    style,
  };
}

function parseNyumbaniFullBoardRates(text: string): ParsedRateRow[] {
  const page2 = matchBlock(text, "N Y U M B A N I\nN Y U M B A N I", [
    "HIGH SEASON SHOULDER SEASON GREEN SEASON\nG A M E P A C K A G E",
    "G A M E P A C K A G E R A T E S",
  ]);

  const compact = page2.replace(/\s+/g, " ");

  const highDates = "01 Jan - 29 Feb; 15 Jun - 31 Oct; 15 Dec - 31 Dec";
  const shoulderDates = "01 Dec - 14 Dec; 01 Jun - 14 Jun; 01 Mar - 31 Mar";
  const greenDates = "01 Apr - 31 May; 01 Nov - 30 Nov";

  const doubleMatch = compact.match(
    /Per Person Shar ing in Double \/ Twin\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)/i,
  );
  const tripleMatch = compact.match(
    /Per Person Shar ing in Tr iple\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)/i,
  );
  const singleMatch = compact.match(
    /Per Single\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)/i,
  );
  const childMatch = compact.match(
    /Child\s+\(5\s*-\s*12 y\.o\.\)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)\s+\$(\d+)/i,
  );

  const rows: ParsedRateRow[] = [];

  if (doubleMatch) {
    rows.push({
      season: "High - Double / Twin",
      dates: highDates,
      rackPPPN: `Rack $${doubleMatch[1]} / Nett $${doubleMatch[2]}`,
    });
    rows.push({
      season: "Shoulder - Double / Twin",
      dates: shoulderDates,
      rackPPPN: `Rack $${doubleMatch[3]} / Nett $${doubleMatch[4]}`,
    });
    rows.push({
      season: "Green - Double / Twin",
      dates: greenDates,
      rackPPPN: `Rack $${doubleMatch[5]} / Nett $${doubleMatch[6]}`,
    });
  }

  if (tripleMatch) {
    rows.push({
      season: "High - Triple",
      dates: highDates,
      rackPPPN: `Rack $${tripleMatch[1]} / Nett $${tripleMatch[2]}`,
    });
    rows.push({
      season: "Shoulder - Triple",
      dates: shoulderDates,
      rackPPPN: `Rack $${tripleMatch[3]} / Nett $${tripleMatch[4]}`,
    });
    rows.push({
      season: "Green - Triple",
      dates: greenDates,
      rackPPPN: `Rack $${tripleMatch[5]} / Nett $${tripleMatch[6]}`,
    });
  }

  if (singleMatch) {
    rows.push({
      season: "High - Single",
      dates: highDates,
      rackPPPN: `Rack $${singleMatch[1]} / Nett $${singleMatch[2]}`,
    });
    rows.push({
      season: "Shoulder - Single",
      dates: shoulderDates,
      rackPPPN: `Rack $${singleMatch[3]} / Nett $${singleMatch[4]}`,
    });
    rows.push({
      season: "Green - Single",
      dates: greenDates,
      rackPPPN: `Rack $${singleMatch[5]} / Nett $${singleMatch[6]}`,
    });
  }

  if (childMatch) {
    rows.push({
      season: "High - Child (5-12)",
      dates: highDates,
      rackPPPN: `Rack $${childMatch[1]} / Nett $${childMatch[2]}`,
    });
    rows.push({
      season: "Shoulder - Child (5-12)",
      dates: shoulderDates,
      rackPPPN: `Rack $${childMatch[3]} / Nett $${childMatch[4]}`,
    });
    rows.push({
      season: "Green - Child (5-12)",
      dates: greenDates,
      rackPPPN: `Rack $${childMatch[5]} / Nett $${childMatch[6]}`,
    });
  }

  return rows;
}

function parseNyumbaniInclusionsExclusions(text: string) {
  const compact = text.replace(/\s+/g, " ");

  const inclusionMatch = compact.match(
    /Inclusions:\s*(.+?)\s*Exclusions:/i,
  );
  const exclusionMatch = compact.match(
    /Exclusions:\s*(.+?)(?:Child\s*\(5\s*-\s*12 y\.o\.\)|HIGH SEASON|G A M E P A C K A G E)/i,
  );

  const included = inclusionMatch
    ? uniq(
        inclusionMatch[1]
          .split(/,|;/)
          .map((item) => item.replace(/\(.*?\)/g, "").trim()),
      )
    : [];

  const paid = exclusionMatch
    ? uniq(
        exclusionMatch[1]
          .split(/,|;/)
          .map((item) => item.trim()),
      )
    : [];

  return { included, paid };
}

function parseActivities(text: string) {
  const block = matchBlock(text, "A C T I V I T I E S & S U P P L E M E N T S F E E S", [
    "PARK FEES & CAMPING FEE",
    "PARK FEES & CAMPING FEES",
  ]);

  if (!block) {
    return {
      included: [] as string[],
      paid: [] as string[],
    };
  }

  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const freeItems: string[] = [];
  const paidItems: string[] = [];

  const candidates = [
    "Resident Rate",
    "All-inclusive Supplement",
    "Sundowner",
    "Stargazing / Spear throwing with Maasai",
    "Private Bush Dinner",
    "Private Bush Breakfast",
    "Picnic Hamper Lunch",
    "Extra Lunch",
    "Seronera / Kuro Airstrip Transfer",
    "Exclusive game drive vehicle",
    "Tour Leader Room",
    "Night Game Drive (Tarangire)",
  ];

  for (const candidate of candidates) {
    const hit = lines.find((line) =>
      line.toLowerCase().startsWith(candidate.toLowerCase()),
    );
    if (!hit) continue;

    if (/free/i.test(hit)) {
      freeItems.push(candidate);
    } else {
      paidItems.push(hit.replace(/\s{2,}/g, " ").trim());
    }
  }

  if (
    !freeItems.includes("Stargazing / Spear throwing with Maasai") &&
    block.toLowerCase().includes("free")
  ) {
    freeItems.push("Stargazing / Spear throwing with Maasai");
  }

  return {
    included: uniq(freeItems),
    paid: uniq(paidItems),
  };
}

function parsePolicies(text: string) {
  const compact = text.replace(/\s+/g, " ");

  const honeymoonMatch = compact.match(
    /HONEYMOON PACKAGE\s*•\s*Romantic candle light bush dinner\s*•\s*Romantic turn-down\s*•\s*Sparkling wine upon arrival/i,
  );

  const honeymoonPolicy = honeymoonMatch
    ? "Romantic candle light bush dinner; Romantic turn-down; Sparkling wine upon arrival"
    : "";

  const childBullets = [
    "Age 13 yr & older pay Adult Rates",
    "Age 5 to 12 yr old must share with 1-2 adult",
    "Age under 5 yr old are only permitted under special conditions",
  ];

  const childPolicy = childBullets
    .filter((item) => compact.includes(item))
    .join("\n");

  const cancellationBlock = matchBlock(text, "Cancellation Policy & Charges", [
    "Postponement / Amendment of Bookings",
  ]);

  const cancellation = cancellationBlock
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^•/.test(line))
    .map((line) => line.replace(/^•\s*/, ""))
    .join("\n");

  const importantNotes = uniq(
    [
      "*All travellers are required to pay Tanzania park fees and camping fees.",
      "*Please check the Tanzanian National Park website for fees as they are subject to change without prior notice.",
      "*Child park fees applicable for children between 05 - 15 years old",
    ].filter(
      (item) =>
        compact.includes(item.replace(/\*/g, "").trim()) || compact.includes(item),
    ),
  );

  const tradeNotes = uniq([
    compact.includes("20% deposit must be paid within 14 days")
      ? "20% deposit due within 14 days of confirmation"
      : "",
    compact.includes("remaining 80% is due 60 days prior")
      ? "Remaining 80% due 60 days before arrival"
      : "",
    compact.includes(
      "Distribution or exposure of our Net Tour Rates will lead to immediate termination",
    )
      ? "Net tour rates are confidential"
      : "",
  ]);

  return {
    childPolicy,
    honeymoonPolicy,
    cancellation,
    importantNotes,
    tradeNotes,
  };
}

function parseCompanyDetails(text: string) {
  const emails = extractEmails(text);
  const phones = extractPhones(text);
  const urls = extractUrls(text);

  const website =
    urls.find((item) => /nyumbani-collection\.com/i.test(item)) || "";
  const enquiryEmail =
    emails.find((item) => /reservations@nyumbani-collection\.com/i.test(item)) ||
    emails[0] ||
    "";
  const phone =
    phones.find((item) => /\+255/.test(item)) || phones[0] || "";

  return {
    website,
    enquiryEmail,
    phone,
  };
}

function parsePdfText(text: string): { parsed: ParsedPayload; warnings: string[] } {
  const cleaned = cleanText(text);
  const company = parseCompanyDetails(cleaned);
  const nyumbani = parseNyumbaniCampDetails(cleaned);
  const rates = parseNyumbaniFullBoardRates(cleaned);
  const incExc = parseNyumbaniInclusionsExclusions(cleaned);
  const activities = parseActivities(cleaned);
  const policies = parsePolicies(cleaned);

  const warnings: string[] = [];

  if (/Ny umb ani C amp/i.test(cleaned) && /Hil a l a C amp/i.test(cleaned)) {
    warnings.push(
      "Multi-property PDF detected. This import currently prioritizes Nyumbani Camp details.",
    );
  }

  if (rates.length === 0) {
    warnings.push("Could not confidently extract Nyumbani rate rows.");
  }

  const parsed: ParsedPayload = {
    name: "Nyumbani Camp",
    companySlug: "nyumbani-collection",
    location: nyumbani.location || "Central Serengeti",
    class: "Tented Camp",
    vibe: "Tented camp in Central Serengeti with full-board and game package rates.",
    website: company.website || "nyumbani-collection.com",
    snapshot: {
      rooms: nyumbani.rooms || "10 tents",
      location: nyumbani.location || "Ngarenanyuki 2 in Central Serengeti",
      bestFor: "Serengeti safari",
      setting: "Central Serengeti",
      style: nyumbani.style || "Tented Camp",
      access: nyumbani.access || "Seronera (40 min drive to camp)",
    },
    rates: {
      notes: [
        "Imported from Nyumbani full-board rate table",
        "Values shown as Rack / Nett",
        "Review game package rates and child rates before publishing",
      ],
      rows: rates,
    },
    experiences: {
      included: uniq([...incExc.included, ...activities.included]),
      paid: uniq([...activities.paid, ...incExc.paid]),
    },
    policies: {
      childPolicy: policies.childPolicy || undefined,
      honeymoonPolicy: policies.honeymoonPolicy || undefined,
      cancellation: policies.cancellation || undefined,
      importantNotes: policies.importantNotes,
      tradeNotes: policies.tradeNotes,
    },
    contacts: {
      sales: [
        {
          name: "Reservations",
          role: "Reservations / Sales",
          email: company.enquiryEmail || undefined,
          phone: company.phone || undefined,
          whatsapp: company.phone || undefined,
        },
      ],
    },
    enquiryEmail: company.enquiryEmail || undefined,
    enquiryWhatsApp: company.phone || undefined,
    enquirySubject: "Trade Request - Nyumbani Camp",
    quickTags: uniq([
      "Nyumbani Collection",
      "Serengeti",
      "Tented Camp",
      "Central Serengeti",
      "Full Board",
    ]),
    tradeProfileLabel: "Nyumbani Collection",
    tradeProfileSub: "Imported from PDF",
  };

  return { parsed, warnings };
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
    return cleanText(normalizeSpacedWord(result.text || ""));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown PDF parse error";

    throw new Error(
      `PDF parser failed: ${message}. Ensure pdf-parse is installed in production.`,
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
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

    if (file.size <= 0) {
      return NextResponse.json<ImportPdfResponse>(
        { success: false, error: "Uploaded PDF is empty." },
        { status: 400 },
      );
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      return NextResponse.json<ImportPdfResponse>(
        {
          success: false,
          error: "PDF is too large. Maximum size is 25MB.",
        },
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

    const { parsed, warnings } = parsePdfText(extractedText);

    return NextResponse.json<ImportPdfResponse>({
      success: true,
      extractedText,
      parsed,
      warnings: [
        ...warnings,
        "Imported values are heuristic and should be reviewed before saving.",
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
