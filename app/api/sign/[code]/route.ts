import { PDFDocument, StandardFonts, cmyk } from 'pdf-lib';
import QRCode from 'qrcode';

const MM = 2.834645669;

const SIZES: Record<string, any> = {
  a4p: { w: 210, h: 297, land: false, margin: 15, banH: 34, banPt: 68, qr: 140, capPt: 32, subPt: 12, gap: 20 },
  a3p: { w: 297, h: 420, land: false, margin: 20, banH: 48, banPt: 96, qr: 200, capPt: 44, subPt: 16, gap: 26 },
  a4l: { w: 297, h: 210, land: true, margin: 14, banH: 30, banPt: 60, qr: 132, capPt: 30, subPt: 12, gap: 10 },
  a3l: { w: 420, h: 297, land: true, margin: 18, banH: 42, banPt: 86, qr: 190, capPt: 42, subPt: 16, gap: 14 },
  a2l: { w: 594, h: 420, land: true, margin: 25, banH: 58, banPt: 120, qr: 268, capPt: 58, subPt: 22, gap: 20 },
  a1l: { w: 841, h: 594, land: true, margin: 35, banH: 82, banPt: 170, qr: 380, capPt: 82, subPt: 30, gap: 28 },
};

export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const key = new URL(req.url).searchParams.get('size') || 'a3l';
  const s = SIZES[key];
  if (!s) return new Response('Unknown size', { status: 400 });

  const origin = new URL(req.url).origin;
  const url = origin + '/s/' + code.toUpperCase();

  const PW = s.w * MM, PH = s.h * MM;
  const doc = await PDFDocument.create();
  const page = doc.addPage([PW, PH]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);

  const RED = cmyk(0, 0.95, 0.85, 0);
  const K = cmyk(0, 0, 0, 1);
  const WHITE = cmyk(0, 0, 0, 0);
  const GREY = cmyk(0, 0, 0, 0.55);

  const m = s.margin * MM, banH = s.banH * MM;
  const banY = PH - m - banH;
  page.drawRectangle({ x: m, y: banY, width: PW - 2 * m, height: banH, color: RED });

  const label = 'FOR SALE';
  const lw = bold.widthOfTextAtSize(label, s.banPt);
  page.drawText(label, { x: (PW - lw) / 2, y: banY + banH * 0.3, size: s.banPt, font: bold, color: WHITE });

  const q = QRCode.create(url, { errorCorrectionLevel: 'L' });
  const n = q.modules.size;
  const bits = q.modules.data;
  const qrSize = s.qr * MM;
  const mod = qrSize / n;

  let qrX: number, qrY: number, textCx: number, mid = 0;
  if (s.land) {
    const top = banY - s.gap * MM;
    qrY = m + (top - m - qrSize) / 2;
    qrX = m + 8 * MM;
    const tl = qrX + qrSize;
    textCx = tl + (PW - m - tl) / 2;
    mid = qrY + qrSize / 2;
  } else {
    qrX = (PW - qrSize) / 2;
    qrY = banY - s.gap * MM - qrSize;
    textCx = PW / 2;
  }

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (bits[r * n + c]) {
        page.drawRectangle({ x: qrX + c * mod, y: qrY + (n - 1 - r) * mod, width: mod + 0.2, height: mod + 0.2, color: K });
      }
    }
  }

  const line = (t: string, y: number, size: number, font: any, color: any) => {
    const w = font.widthOfTextAtSize(t, size);
    page.drawText(t, { x: textCx - w / 2, y, size, font, color });
  };

  if (s.land) {
    line('Scan for', mid + s.capPt * 0.35, s.capPt, reg, K);
    line('full details', mid - s.capPt * 0.85, s.capPt, reg, K);
    line('POINT YOUR PHONE', mid - s.capPt * 2, s.subPt, reg, GREY);
    line('CAMERA AT THE CODE', mid - s.capPt * 2 - s.subPt * 1.4, s.subPt, reg, GREY);
  } else {
    line('Scan for full details', qrY - s.gap * MM, s.capPt, reg, K);
    line('POINT YOUR PHONE CAMERA AT THE CODE', qrY - s.gap * MM - s.capPt * 1.3, s.subPt, reg, GREY);
  }

  const bytes = await doc.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="curbsell-' + code.toUpperCase() + '-' + key + '.pdf"',
    },
  });
}