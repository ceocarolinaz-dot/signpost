'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [source, setSource] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setSource(p.get('from') || 'direct');
  }, []);

  async function buy() {
    setBusy(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const j = await res.json();
      if (j.url) window.location.href = j.url;
      else setErr('Could not start checkout');
    } catch (e: any) {
      setErr(e.message);
    }
    setBusy(false);
  }

  async function submit() {
    if (!email.includes('@')) {
      setErr('Enter a valid email address');
      return;
    }
    setBusy(true);
    setErr('');
    const { error } = await supabase.from('interest').insert({ email: email, note: note, source: source });
    if (error) { setErr(error.message); setBusy(false); return; }
    try { await fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, note: note, source: source }) }); } catch (e) {}
    setSent(true);
    setBusy(false);
  }

  const field = 'mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base';

  return (
    <main className="mx-auto max-w-lg px-5 py-14">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-500">SignPost</p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight">A for sale sign that does more than sit there.</h1>

      <p className="mt-6 leading-relaxed text-gray-800">Print a sign with a QR code and put it on whatever you are selling. Anyone walking past scans it and lands on a proper listing with photos, the price, a description and a button to call you.</p>

      <p className="mt-4 leading-relaxed text-gray-800">Change the price without reprinting. See how many people have scanned it. Mark it sold when it goes. Works on cars, boats, caravans, cabins, anything.</p>

      <button onClick={buy} disabled={busy} className="mt-8 w-full rounded-lg bg-black py-3.5 font-medium text-white">{busy ? 'One moment…' : 'Get your sign — $19'}</button>

      <p className="mt-3 text-center text-xs text-gray-500">Six print sizes, your own listing page, edit it any time.</p>

      <div className="mt-12 border-t border-gray-200 pt-8">
        {sent ? (
          <div>
            <p className="text-lg font-semibold">Thanks. I will be in touch.</p>
            <p className="mt-2 text-sm text-gray-600">I am testing this at the moment, so the first ones are free.</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-semibold">Not ready yet?</p>
            <p className="mt-1 text-sm text-gray-600">Leave your email and I will let you know when there is more to see.</p>

            <input className={field} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={field} placeholder="What are you selling? (optional)" value={note} onChange={(e) => setNote(e.target.value)} />

            <button onClick={submit} disabled={busy} className="mt-4 w-full rounded-lg border border-gray-400 py-3 font-medium">{busy ? 'Sending…' : 'Send'}</button>

            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
          </div>
        )}
      </div>

      <p className="mt-12 text-center text-xs text-gray-400">Mornington Peninsula</p>
    </main>
  );
}