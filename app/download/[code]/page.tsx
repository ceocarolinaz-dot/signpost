import Logo from '../../components/Logo';

export default async function Download({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const c = code.toUpperCase();

  const sizes = [
    { key: 'a3l', name: 'A3 landscape', note: 'Best for a car windscreen. Start here.' },
    { key: 'a4l', name: 'A4 landscape', note: 'Smaller windscreens, or where people walk right past.' },
    { key: 'a3p', name: 'A3 portrait', note: 'Shop windows and noticeboards.' },
    { key: 'a4p', name: 'A4 portrait', note: 'Prints on a home printer.' },
    { key: 'a2l', name: 'A2 landscape', note: 'Caravans and boats on a driveway.' },
    { key: 'a1l', name: 'A1 landscape', note: 'Large items viewed from the street.' },
  ];

  return (
    <main className="mx-auto max-w-lg px-5 py-12">
      <Logo />

      <h1 className="mt-10 text-3xl font-black uppercase tracking-tight text-slate-900">Your sign</h1>
      <p className="mt-2 text-sm text-slate-500">It points at curbsell.com/s/{c}</p>

      <div className="mt-8 space-y-3">
        {sizes.map((s) => (
          <a key={s.key} href={'/api/sign/' + c + '?size=' + s.key} className="block rounded border-2 border-slate-200 p-4">
            <span className="font-bold text-slate-900">{s.name}</span>
            <span className="mt-1 block text-sm text-slate-600">{s.note}</span>
          </a>
        ))}
      </div>

      <div className="mt-10 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-700">
        <p className="font-bold text-slate-900">Printing it</p>
        <p className="mt-2">Ask for matte lamination. Gloss reflects sunlight and the code stops scanning.</p>
        <p className="mt-2">Print at actual size. Do not let the printer scale it to fit.</p>
        <p className="mt-2">Before you put it out, scan it yourself from where a buyer would stand.</p>
      </div>

      <a href={'/s/' + c} className="mt-8 block rounded bg-slate-900 py-3.5 text-center font-bold text-white">View your listing</a>
    </main>
  );
}