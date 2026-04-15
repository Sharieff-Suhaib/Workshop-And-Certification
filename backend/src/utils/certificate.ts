import dotenv from 'dotenv';
dotenv.config();
import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { uploadToAzure } from './uploadToAzure';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Types ──
interface ParticipantData {
  userName: string;
  workshopTitle: string;
  dateIssued: string;
  certificateId: string;
}

// 🔥 Helper: Auto adjust font size if text is too long
function getFittingFontSize(
  text: string,
  font: PDFFont,
  maxWidth: number,
  initialSize: number
): number {
  let size = initialSize;
  while (font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 1;
    if (size < 10) break;
  }
  return size;
}

export async function generateCertificate(participantData: ParticipantData): Promise<string> {
  console.log(process.env.AZURE_STORAGE_CONNECTION_STRING);

  // 1. Load template
  const templatePath = join(__dirname, '../assets/CertificateTemplate.png');
  const templateBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.create();

  // 2. Embed image + font
  const image = await pdfDoc.embedPng(templateBytes);
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // 3. Create page same size
  const page = pdfDoc.addPage([image.width, image.height]);
  const { width, height } = page.getSize();

  page.drawImage(image, {
    x: 0,
    y: 0,
    width,
    height,
  });

  // 4. Extract data
  const { userName, workshopTitle, dateIssued, certificateId } = participantData;

  // 🔹 Define safe text width (leave margins)
  const maxWidth = width - 200;

  // =========================
  // 🔥 NAME (Centered)
  // =========================
  const nameSize = getFittingFontSize(userName, font, maxWidth, 50);
  const nameWidth = font.widthOfTextAtSize(userName, nameSize);

  page.drawText(userName, {
    x: (width - nameWidth) / 2,
    y: 760,
    size: nameSize,
    font,
    color: rgb(0, 0, 0),
  });

  // =========================
  // 🔥 WORKSHOP (Centered)
  // =========================
  const workshopSize = getFittingFontSize(workshopTitle, font, maxWidth, 40);
  const workshopWidth = font.widthOfTextAtSize(workshopTitle, workshopSize);

  page.drawText(workshopTitle, {
    x: (width - workshopWidth) / 2,
    y: 530,
    size: workshopSize,
    font,
  });

  // =========================
  // 🔥 CERTIFICATE ID (Left aligned)
  // =========================
  page.drawText(`${certificateId}`, {
    x: 350,
    y: 57,
    size: 30,
    font,
  });

  // =========================
  // 🔥 DATE (Right aligned)
  // =========================
  const dateSize = 30;

  page.drawText(`${dateIssued}`, {
    x: 1020,
    y: 57,
    size: dateSize,
    font,
  });

  // 6. Save PDF
  const pdfBytes = await pdfDoc.save();

  // 7. Upload to Azure
  const fileName = `certificate-${certificateId}.pdf`;
  const url = await uploadToAzure(Buffer.from(pdfBytes), fileName);

  console.log(`✅ Uploaded to Azure: ${url}`);

  return url;
}

// 🔥 Test data
const mockData: ParticipantData = {
  userName: 'TOM CRUISE',
  workshopTitle: 'TIME MANAGEMENT WORKSHOP',
  dateIssued: '2026-04-11',
  certificateId: 'CTF-2026-001',
};

// 🔥 Run
generateCertificate(mockData).catch((err: Error) =>
  console.error('❌ Error:', err)
);