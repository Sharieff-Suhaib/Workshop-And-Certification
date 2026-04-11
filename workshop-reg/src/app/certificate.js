import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔥 Helper: Auto adjust font size if text is too long
function getFittingFontSize(text, font, maxWidth, initialSize) {
  let size = initialSize;
  while (font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 1;
    if (size < 10) break;
  }
  return size;
}

async function generateCertificate(participantData) {
  // 1. Load template
  const templatePath = join(__dirname, 'CertificateTemplate.png');
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
    width: width,
    height: height,
  });

  // 4. Extract data
  const { userName, workshopTitle, dateIssued, certificateId } = participantData;

  // 🔹 Define safe text width (leave margins)
  const maxWidth = width - 200;

  // =========================
  // 🔥 NAME (Centered)
  // =========================
  let nameSize = getFittingFontSize(userName, font, maxWidth, 50);
  const nameWidth = font.widthOfTextAtSize(userName, nameSize);

  page.drawText(userName, {
    x: (width - nameWidth) / 2,
    y: 760,
    size: nameSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  // =========================
  // 🔥 WORKSHOP (Centered)
  // =========================
  let workshopSize = getFittingFontSize(workshopTitle, font, maxWidth, 40);
  const workshopWidth = font.widthOfTextAtSize(workshopTitle, workshopSize);

  page.drawText(workshopTitle, {
    x: (width - workshopWidth) / 2,
    y: 530,
    size: workshopSize,
    font: font,
  });

  // =========================
  // 🔥 CERTIFICATE ID (Left aligned)
  // =========================
  page.drawText(`${certificateId}`, {
    x: 350,
    y: 57,
    size: 30,
    font: font,
  });

  // =========================
  // 🔥 DATE (Right aligned)
  // =========================
  const dateSize = 30;
  const dateWidth = font.widthOfTextAtSize(dateIssued, dateSize);

  page.drawText(`${dateIssued}`, {
    x: 1020,
    y: 57,
    size: dateSize,
    font: font,
  });

  // 6. Save PDF
  const pdfBytes = await pdfDoc.save();

  // 7. Write file
  const outputPath = join(__dirname, 'final_certificate.pdf');
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`✅ Success! Certificate saved at: ${outputPath}`);

  return pdfBytes;
}

// 🔥 Test data
const mockData = {
  userName: "LEONARDO DA VINCI",
  workshopTitle: "TIME MANAGEMENT WORKSHOP",
  dateIssued: "2026-04-11",
  certificateId: "CTF-2026-001"
};

// 🔥 Run
generateCertificate(mockData).catch(err =>
  console.error("❌ Error:", err)
);