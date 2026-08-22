'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function ClaimPage() {
  const code = String(useParams().code).toUpperCase();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  async function submit() {
    setBusy(true);
    setErr('');
    const res = await fetch('/api/claim', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: code, email: email }) });
    const j = await res.json();
    if (j.ok) setSent(true);
    else setErr(j.error || 'Something went wrong');
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-14">
      {sent ? (
        <div>
          <h1 className="text-2xl font-semibold">Check your email</h1>
          <p className="mt-3 leading-relaxed text-gray-700">We have sent a link to {email}. Open it to set up your listing. Keep that email, it is the only way back in.</p>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-semibold">Set up this sign</h1>
          <p className="mt-1 text-sm text-gray-500">Sign {code}</p>
          <p className="mt-4 leading-relaxed text-gray-700">Enter your email and we will send you a link to add your photos, price and details.</p>

          <input className="mt-6 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

          <button onClick={submit} disabled={busy} className="mt-4 w-full rounded-lg bg-black py-3.5 font-medium text-white">{busy ? 'Sending…' : 'Send me the link'}</button>

          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        </div>
      )}
    </main>
  );
}