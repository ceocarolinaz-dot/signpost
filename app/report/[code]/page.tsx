'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function Report() {
  const code = String(useParams().code).toUpperCase();
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    await fetch('/api/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: code, reason: reason, email: email }) });
    setSent(true);
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-14">
      {sent ? (
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thanks for letting us know</h1>
          <p className="mt-3 text-slate-700">We will take a look at this listing.</p>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Report this listing</h1>
          <p className="mt-1 text-sm text-slate-500">Listing {code}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">Tell us what is wrong with it and we will review it.</p>

          <textarea className="mt-4 w-full rounded border border-slate-400 px-3 py-2.5" rows={5} placeholder="What is the problem?" value={reason} onChange={(e) => setReason(e.target.value)} />
          <input className="mt-2 w-full rounded border border-slate-400 px-3 py-2.5" placeholder="Your email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />

          <button onClick={submit} disabled={busy} className="mt-4 w-full rounded bg-slate-900 py-3.5 font-bold text-white">{busy ? 'Sending' : 'Send report'}</button>
        </div>
      )}
    </main>
  );
}