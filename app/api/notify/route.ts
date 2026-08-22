import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || '');
    const note = String(body.note || '');
    const source = String(body.source || '');

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ceo.carolina.z@gmail.com',
      subject: 'SignPost interest: ' + email,
      text: 'Email: ' + email + '\nSelling: ' + note + '\nFrom listing: ' + source,
    });

    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}