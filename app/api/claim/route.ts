import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { code, email } = await req.json();
    if (!code || !email || !String(email).includes('@')) {
      return Response.json({ ok: false, error: 'Enter a valid email' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.rpc('claim_listing', { p_code: code, p_email: email });
    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
    if (!data) return Response.json({ ok: false, error: 'That sign is already registered to another email address.' }, { status: 403 });

    const origin = new URL(req.url).origin;
    const link = origin + '/edit/' + data;

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your Curbsell listing',
      text: 'Here is the link to edit your listing. Keep this email, it is the only way back in.\n\n' + link + '\n\nYour public listing is at ' + origin + '/s/' + String(code).toUpperCase(),
    });

    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}