import Logo from '../components/Logo';

export default function Thanks() {
  return (
    <main className="mx-auto max-w-lg px-5 py-12">
      <Logo />

      <div className="mt-10 rounded bg-red-600 px-6 py-8 text-center">
        <p className="text-2xl font-black uppercase tracking-tight text-white">You are all set</p>
        <p className="mt-2 text-sm text-red-100">Check your email — everything is waiting there.</p>
      </div>

      <p className="mt-8 leading-relaxed text-slate-800">Two links are in your inbox. One takes you to your listing so you can add photos and details. The other downloads your sign, ready to print.</p>

      <p className="mt-4 leading-relaxed text-slate-800">Hang on to that email. The listing link is private and it is the only way back in.</p>

      <div className="mt-10 border-t border-slate-200 pt-6">
        <p className="font-bold text-slate-900">One tip before you print</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">Ask the print shop for matte lamination. Gloss reflects sunlight and the code stops scanning — it is the one thing that catches people out.</p>
      </div>

      <p className="mt-10 text-sm text-slate-500">Nothing after a few minutes? Check your spam folder.</p>
    </main>
  );
}