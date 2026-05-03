import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { SETTINGS, formatLabelId } from '../config/settings';

const yieldToBrowser = () => new Promise((r) => setTimeout(r, 0));

export const generateQrLabelsPdf = async (
  usedIds: Set<string>,
  onProgress?: (placed: number, total: number) => void,
): Promise<void> => {
  const { print } = SETTINGS;
  const { label, page } = print;

  const doc = new jsPDF({
    orientation: page.orientation,
    unit: 'mm',
    format: page.format,
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const usableWidth = pageWidth - page.marginMm * 2;
  const usableHeight = pageHeight - page.marginMm * 2;

  const cols = Math.max(1, Math.floor((usableWidth + page.gapMm) / (label.widthMm + page.gapMm)));
  const rows = Math.max(1, Math.floor((usableHeight + page.gapMm) / (label.heightMm + page.gapMm)));
  const perPage = cols * rows;

  let placed = 0;
  let idNum = print.startFrom;
  let lastId = '';

  while (placed < print.quantity) {
    const id = formatLabelId(idNum);
    idNum++;
    if (usedIds.has(id)) continue;

    const positionInPage = placed % perPage;
    if (placed > 0 && positionInPage === 0) doc.addPage();

    const col = positionInPage % cols;
    const row = Math.floor(positionInPage / cols);

    const x = page.marginMm + col * (label.widthMm + page.gapMm);
    const y = page.marginMm + row * (label.heightMm + page.gapMm);

    const qrDataUrl = await QRCode.toDataURL(id, {
      margin: 0,
      width: 256,
      errorCorrectionLevel: 'L',
      color: { dark: '#1A1B2E', light: '#FFFFFF' },
    });

    const textBlockMm = label.idFontSizePt * 0.45;
    const qrX = x + (label.widthMm - label.qrSizeMm) / 2;
    const qrY = y + (label.heightMm - label.qrSizeMm - textBlockMm) / 2;
    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, label.qrSizeMm, label.qrSizeMm, undefined, 'FAST');

    doc.setFontSize(label.idFontSizePt);
    doc.setTextColor(26, 27, 46);
    doc.text(id, x + label.widthMm / 2, qrY + label.qrSizeMm + textBlockMm, { align: 'center' });

    lastId = id;
    placed++;

    if (placed % 50 === 0) {
      onProgress?.(placed, print.quantity);
      await yieldToBrowser();
    }
  }

  onProgress?.(placed, print.quantity);
  await yieldToBrowser();

  doc.save(`${print.fileName}-${formatLabelId(print.startFrom)}-${lastId}.pdf`);
};
