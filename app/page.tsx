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
    setErr('');
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const j = await res.json();
      if (j.url) window.location.href = j.url;
      else setErr('Checkout could not start. Try again in a moment.');
    } catch (e: any) {
      setErr(e.message);
    }
    setBusy(false);
  }

  async function submit() {
    if (!email.includes('@')) {
      setErr('That email address is missing an @ symbol.');
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

  const steps = [
    { n: '1', h: 'Get your QR and listing page', p: 'Your own listing page, with a private link back to it so you can change things any time.' },
    { n: '2', h: 'Add your details', p: 'Photos, price, description and how you want buyers to contact you.' },
    { n: '3', h: 'Print and sell', p: 'Download the sign in whichever size suits, print it, and put it on your item.' },
  ];

  const reasons = [
    { h: 'Drop the price without reprinting', p: 'Change it on your phone. The sign stays where it is.' },
    { h: 'See how many people scanned it', p: 'If forty people looked and nobody called, the price is the problem, not the sign.' },
    { h: 'Stop answering the same questions', p: 'Rego, kilometres, service history, why you are selling. It is all on the page, so the people who call you have already read it.' },
    { h: 'Use it again next time', p: 'Sell the car, wipe the listing, put the same sign on whatever you are selling next.' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-5 py-10">

        <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">The sign that sells</p>

        <div className="mt-10 grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-slate-900 md:text-5xl">
              Everyone who<br />walks past<br />is a buyer.
            </h1>
            
            <button onClick={buy} disabled={busy} className="mt-10 w-full rounded bg-red-600 px-8 py-4 text-base font-bold uppercase tracking-wide text-white md:w-auto">
              {busy ? 'One moment' : 'Download your sign — $19'}
            </button>
            <p className="mt-3 text-sm text-slate-500">Six print sizes, ready to download.</p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-xs rounded-sm bg-white p-4 shadow-xl">
              <div className="bg-red-600 py-3 text-center text-2xl font-black uppercase tracking-wider text-white">For sale</div>
              <img src="/api/qr/DEMO" alt="Scan to see an example listing" className="mt-4 aspect-square w-full" />
              <p className="mt-4 text-center text-base font-bold text-slate-900">Scan this to see how it works</p>
              <a href="/s/DEMO" className="mt-2 block pb-1 text-center text-xs text-slate-500 underline">or tap here if you are on your phone</a>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="border-t-4 border-red-600 pt-4">
              <p className="text-3xl font-black text-slate-300">{s.n}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{s.h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.p}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-slate-300 pt-10">
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Why not just write it on cardboard</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {reasons.map((r) => (
              <div key={r.h}>
                <p className="font-bold text-slate-900">{r.h}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{r.p}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 rounded bg-slate-900 p-8 text-center md:p-12">
          <p className="text-2xl font-black uppercase tracking-tight text-white">Cars, caravans, boats, cabins</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">If it sits somewhere people walk past, it can have a sign.</p>
          <button onClick={buy} disabled={busy} className="mt-6 rounded bg-red-600 px-8 py-4 text-base font-bold uppercase tracking-wide text-white">
            {busy ? 'One moment' : 'Download your sign — $19'}
          </button>
          {err && <p className="mt-4 text-sm text-red-300">{err}</p>}
        </div>

        

        <p className="mt-20 pb-10 text-xs uppercase tracking-widest text-slate-400">Curbsell &nbsp;·&nbsp; <a href="/terms" className="underline">Terms</a> &nbsp;·&nbsp; <a href="/privacy" className="underline">Privacy</a></p>
      </div>
    </div>
  );
}