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
      <h1 className="text-2xl font-semibold">Your sign</h1>
      <p className="mt-1 text-sm text-gray-500">Code {c}</p>

      <div className="mt-8 space-y-3">
        {sizes.map((s) => (
          <a key={s.key} href={'/api/sign/' + c + '?size=' + s.key} className="block rounded-lg border border-gray-300 p-4">
            <span className="font-medium">{s.name}</span>
            <span className="mt-1 block text-sm text-gray-600">{s.note}</span>
          </a>
        ))}
      </div>

      <div className="mt-10 border-t border-gray-200 pt-6 text-sm leading-relaxed text-gray-700">
        <p className="font-medium text-gray-900">Printing it</p>
        <p className="mt-2">Take the PDF to a print shop and ask for matte lamination. Matte matters — gloss reflects sunlight and the code stops scanning.</p>
        <p className="mt-2">Print at actual size. Do not let the printer scale it to fit, or the margins and the code will be wrong.</p>
        <p className="mt-2">Before you put it out, scan it yourself from where a buyer would stand. Check it in direct sun and through glass.</p>
      </div>

      <a href={'/s/' + c} className="mt-8 block text-center text-sm underline">View your listing</a>
    </main>
  );
}