import { PDFDocument, StandardFonts, cmyk } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';
import { readFileSync } from 'fs';
import path from 'path';

const MM = 2.834645669;

const SIZES: Record<string, any> = {
  a4p: { w: 210, h: 297, land: false, margin: 14, banH: 34, banPt: 60, qr: 150 },
  a3p: { w: 297, h: 420, land: false, margin: 18, banH: 48, banPt: 86, qr: 210 },
  a4l: { w: 297, h: 210, land: true, margin: 12, banH: 30, banPt: 50, qr: 118 },
  a3l: { w: 420, h: 297, land: true, margin: 16, banH: 44, banPt: 74, qr: 168 },
  a2l: { w: 594, h: 420, land: true, margin: 22, banH: 64, banPt: 108, qr: 235 },
  a1l: { w: 841, h: 594, land: true, margin: 32, banH: 92, banPt: 154, qr: 340 },
};

export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const key = new URL(req.url).searchParams.get('size') || 'a2l';
  const s = SIZES[key];
  if (!s) return new Response('Unknown size', { status: 400 });

  const origin = new URL(req.url).origin;
  const url = origin + '/s/' + code.toUpperCase();

  const PW = s.w * MM, PH = s.h * MM;
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const fontPath = path.join(process.cwd(), 'app/fonts/ArchivoBlack-Regular.ttf');
  const archivo = await doc.embedFont(readFileSync(fontPath));
  const reg = await doc.embedFont(StandardFonts.Helvetica);

  const page = doc.addPage([PW, PH]);
  const RED = cmyk(0, 0.95, 0.85, 0);
  const K = cmyk(0, 0, 0, 1);
  const WHITE = cmyk(0, 0, 0, 0);

  const m = s.margin * MM, banH = s.banH * MM;
  const banY = PH - m - banH;
  page.drawRectangle({ x: m, y: banY, width: PW - 2 * m, height: banH, color: RED });

  const label = 'FOR SALE';
  const lw = archivo.widthOfTextAtSize(label, s.banPt);
  page.drawText(label, { x: (PW - lw) / 2, y: banY + banH * 0.31, size: s.banPt, font: archivo, color: WHITE });

  const q = QRCode.create(url, { errorCorrectionLevel: 'L' });
  const n = q.modules.size;
  const bits = q.modules.data;
  const qrSize = s.qr * MM;
  const mod = qrSize / n;

  const qrGap = Math.max(6 * MM, banH * 0.25);
  const qrX = (PW - qrSize) / 2;
  const qrY = banY - qrGap - qrSize;

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (bits[r * n + c]) {
        page.drawRectangle({ x: qrX + c * mod, y: qrY + (n - 1 - r) * mod, width: mod + 0.2, height: mod + 0.2, color: K });
      }
    }
  }

  const capPt = Math.min(s.banPt * 0.42, 46);
  const subPt = capPt * 0.42;
  const capY = qrY - (qrSize * 0.08) - capPt;
  const footY = capY - capPt * 0.9;

  const ctr = (t: string, y: number, size: number, font: any, color: any) => {
    const w = font.widthOfTextAtSize(t, size);
    page.drawText(t, { x: (PW - w) / 2, y, size, font, color });
  };

  ctr('Scan for full details', capY, capPt, reg, K);
  ctr('curbsell.com', footY, subPt * 1.4, archivo, RED);

  const bytes = await doc.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="curbsell-' + code.toUpperCase() + '-' + key + '.pdf"',
    },
  });
}