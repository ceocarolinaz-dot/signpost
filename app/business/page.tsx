'use client';

import { useState } from 'react';
import Logo from '../components/Logo';

export default function Business() {
  const [f, setF] = useState({ name: '', business: '', email: '', volume: '', message: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  function set(k: string, v: string) { setF({ ...f, [k]: v }); }

  async function submit() {
    if (!f.email.includes('@')) return;
    setBusy(true);
    await fetch('/api/business', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    setSent(true);
    setBusy(false);
  }

  const field = 'mt-3 w-full rounded border border-slate-300 px-3 py-2.5 text-base';

  return (
    <main className="mx-auto max-w-lg px-5 py-12">
      <Logo />
      {sent ? (
        <div className="mt-10">
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Thanks — we will be in touch</h1>
          <p className="mt-3 text-slate-700">We will get back to you about branded signs for your business.</p>
        </div>
      ) : (
        <div className="mt-10">
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Signs for your business</h1>
          <p className="mt-3 leading-relaxed text-slate-700">Dealers, brokers, agents — put a branded QR sign on every item you list. Each one opens the full listing and tells you how many people scanned it. Tell us a bit about what you sell and we will be in touch.</p>

          <input className={field} placeholder="Your name" value={f.name} onChange={(e) => set('name', e.target.value)} />
          <input className={field} placeholder="Business name" value={f.business} onChange={(e) => set('business', e.target.value)} />
          <input className={field} type="email" placeholder="Email" value={f.email} onChange={(e) => set('email', e.target.value)} />
          <input className={field} placeholder="Roughly how many items do you list? (e.g. 20 boats)" value={f.volume} onChange={(e) => set('volume', e.target.value)} />
          <textarea className={field} rows={3} placeholder="Anything else? (optional)" value={f.message} onChange={(e) => set('message', e.target.value)} />

          <button onClick={submit} disabled={busy} className="mt-4 w-full rounded bg-red-600 py-3.5 font-bold uppercase tracking-wide text-white">{busy ? 'Sending' : 'Send enquiry'}</button>
        </div>
      )}
    </main>
  );
}