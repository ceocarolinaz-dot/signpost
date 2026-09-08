import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { name, business, email, volume, message } = await req.json();
    if (!email || !email.includes('@')) return Response.json({ ok: false }, { status: 400 });

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    await supabase.from('business_enquiries').insert({ name, business, email, volume, message });

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Curbsell <hello@curbsell.com>',
      to: 'hello@curbsell.com',
      subject: 'Business enquiry: ' + (business || email),
      text: 'Name: ' + name + '\nBusiness: ' + business + '\nEmail: ' + email + '\nVolume: ' + volume + '\nMessage: ' + message,
    });

    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}