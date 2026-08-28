export default function Logo({ size = 'text-xl' }: { size?: string }) {
  return (
    <a href="/" className={'block font-black uppercase tracking-tight text-slate-900 ' + size}>
      Curb<span className="text-red-600">sell</span>
    </a>
  );
}