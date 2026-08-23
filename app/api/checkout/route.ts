import Stripe from 'stripe';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const origin = new URL(req.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'aud',
        unit_amount: 1900,
        product_data: { name: 'SignPost listing', description: 'QR for sale sign in six print sizes, plus your own listing page' },
      },
      quantity: 1,
    }],
    success_url: origin + '/thanks?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: origin + '/',
  });

  return Response.json({ url: session.url });
}