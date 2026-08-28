import Logo from '../components/Logo';

export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <Logo />
      <h1 className="mt-10 text-3xl font-black uppercase tracking-tight text-slate-900">Privacy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated 28 August 2026</p>

      <div className="mt-8 space-y-6 leading-relaxed text-slate-800">
        <div>
          <h2 className="font-bold text-slate-900">What we collect</h2>
          <p className="mt-2">Your email address, so we can send your links. Whatever you choose to put on your listing, including photos and contact details. A count of how many times your listing page has been loaded.</p>
        </div>

        <div>
          <h2 className="font-bold text-slate-900">What is public</h2>
          <p className="mt-2">Everything on your listing page is public. Your email address is not shown on your listing unless you add it yourself as a contact method.</p>
        </div>

        <div>
          <h2 className="font-bold text-slate-900">Who else is involved</h2>
          <p className="mt-2">Payments are handled by Stripe, who receive your payment details directly. We never see your card number. Emails are sent through Resend. Listings and photos are stored with Supabase. The site is hosted by Vercel.</p>
        </div>

        <div>
          <h2 className="font-bold text-slate-900">Deleting your information</h2>
          <p className="mt-2">You can delete your listing at any time from your edit link. If you want your email address removed from our records as well, email us and we will do it.</p>
        </div>

        <div>
          <h2 className="font-bold text-slate-900">What we do not do</h2>
          <p className="mt-2">We do not sell your information, and we do not send marketing emails you did not ask for.</p>
        </div>

        <div>
          <h2 className="font-bold text-slate-900">Contact</h2>
          <p className="mt-2">hello@curbsell.com</p>
        </div>
      </div>

      <a href="/" className="mt-12 block text-sm underline">Back to Curbsell</a>
    </main>
  );
}