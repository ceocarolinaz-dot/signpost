import QRCode from 'qrcode';

export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const origin = new URL(req.url).origin;
  const url = origin + '/s/' + code.toUpperCase();

  const svg = await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'L',
    margin: 1,
    color: { dark: '#111111', light: '#ffffff' },
  });

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
  });
}