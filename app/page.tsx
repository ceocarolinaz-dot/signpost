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
    { n: '1', h: 'Pay and get your code', p: 'You get a listing page of your own and a link back to it. Nothing gets posted.' },
    { n: '2', h: 'Add your details', p: 'Photos, price, description, how you want to be contacted. A few minutes on your phone.' },
    { n: '3', h: 'Print it and put it out', p: 'Download the sign in whichever size suits, print it, and stick it on. Anyone walking past scans it.' },
  ];
</br>```

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-5 py-10">

        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">SignPost</p>

        <div className="mt-10 grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-slate-900 md:text-5xl">
              A for sale sign<br />that answers<br />questions.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              A paper sign gives someone your phone number. This one gives them the year, the kilometres, the service history and what it looks like inside — before they call you.
            </p>
            <button onClick={buy} disabled={busy} className="mt-8 w-full rounded bg-red-600 px-8 py-4 text-base font-bold uppercase tracking-wide text-white md:w-auto">
              {busy ? 'One moment' : 'Download your sign — $19'}
            </button>
            <p className="mt-3 text-sm text-slate-500">Six print sizes, ready to download. Nothing gets posted.</p>
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
            <div>
              <p className="font-bold text-slate-900">Drop the price without reprinting</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">Change it on your phone. The sign stays where it is.</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">See how many people scanned it</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">If forty people looked and nobody called, the price is the problem, not the sign.</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">Room for the whole story</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">Photos, service history, why you are selling. Things that do not fit on a windscreen card.</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">Mark it sold when it goes</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">The page says sold instead of leaving people wondering.</p>
            </div>
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

        <div className="mt-16 border-t border-slate-300 pt-10">
          {sent ? (
            <div>
              <p className="text-lg font-bold text-slate-900">Got it. I will be in touch.</p>
              <p className="mt-1 text-sm text-slate-600">Early signs are free while I am testing this.</p>
            </div>
          ) : (
            <div className="max-w-md">
              <p className="text-lg font-bold text-slate-900">Want to think about it?</p>
              <p className="mt-1 text-sm text-slate-600">Leave your email and I will let you know how it goes. Early signs are free while I am testing.</p>
              <input className="mt-4 w-full rounded border border-slate-400 bg-white px-3 py-2.5" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="mt-2 w-full rounded border border-slate-400 bg-white px-3 py-2.5" placeholder="What are you selling?" value={note} onChange={(e) => setNote(e.target.value)} />
              <button onClick={submit} disabled={busy} className="mt-3 rounded border-2 border-slate-900 px-6 py-2.5 font-bold text-slate-900">{busy ? 'Sending' : 'Send'}</button>
              {err && <p className="mt-3 text-sm text-red-700">{err}</p>}
            </div>
          )}
        </div>

        <p className="mt-20 pb-10 text-xs uppercase tracking-widest text-slate-400">SignPost — Mornington Peninsula</p>
      </div>
    </div>
  );
}