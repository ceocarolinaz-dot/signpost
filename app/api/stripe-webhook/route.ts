import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers.get('stripe-signature') || '';
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new Response('Bad signature: ' + err.message, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || '';

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

    const { data: code, error } = await supabase.rpc('create_listing');
    if (error) return new Response('DB error', { status: 500 });

    const { data: token } = await supabase.rpc('claim_listing', { p_code: code, p_email: email });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || '';
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Curbsell <hello@send.curbsell.com>',
      to: email,
      subject: 'Your Curbsell sign is ready',
      text: 'Thanks for your order.\n\nStep 1 - add your details and photos:\n' + origin + '/edit/' + token + '\n\nStep 2 - download your sign:\n' + origin + '/download/' + code + '\n\nYour public listing will be at ' + origin + '/s/' + code + '\n\nKeep this email. The edit link is the only way back in.',
    });
  }

  return Response.json({ received: true });
}