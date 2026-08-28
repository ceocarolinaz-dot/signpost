import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { code, reason, email } = await req.json();
    if (!code) return Response.json({ ok: false }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.from('reports').insert({ code: code, reason: reason, reporter_email: email });

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Curbsell <hello@curbsell.com>',
      to: 'ceo.carolina.z@gmail.com',
      subject: 'Listing reported: ' + code,
      text: 'Listing: ' + code + '\nReason: ' + reason + '\nFrom: ' + email + '\n\nView: https://www.curbsell.com/s/' + code,
    });

    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}