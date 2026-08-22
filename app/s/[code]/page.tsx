import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ListingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('status', 'active')
    .single();

  if (!listing) notFound();

  await supabase.rpc('bump_scan', { listing_code: code.toUpperCase() });

  const photos: string[] = listing.photos ?? [];
  const telHref = 'tel:' + String(listing.contact_phone || '').replace(/\s/g, '');

  return (
    <main className="mx-auto max-w-lg px-5 py-8">
      {photos[0] && (
        <img src={photos[0]} alt={listing.title} className="mb-5 w-full rounded-xl object-cover" />
      )}

      <h1 className="text-2xl font-semibold">{listing.title}</h1>
      <p className="mt-1 text-3xl font-bold">{listing.price}</p>
      {listing.location && <p className="mt-1 text-sm text-gray-500">{listing.location}</p>}

      <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-800">{listing.description}</p>

      {photos.length > 1 && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {photos.slice(1).map((url) => (
            <img key={url} src={url} alt="" className="w-full rounded-lg object-cover" />
          ))}
        </div>
      )}

      <div className="mt-10 border-t border-gray-200 pt-6">
        <p className="text-sm font-medium text-gray-500">Contact</p>
        <p className="mt-1 text-lg font-semibold">{listing.contact_name}</p>
        {listing.contact_phone && (
          <a href={telHref} className="mt-4 block rounded-lg bg-black py-3.5 text-center font-medium text-white">
            Call {listing.contact_phone}
          </a>
        )}
      </div>
        href={'/?from=' + code}
        className="mt-12 block border-t border-gray-200 pt-6 text-center text-sm text-gray-500"
      >
        Selling something yourself? Make a page like this.
      </a>
    </main>
  );
}