'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const maxW = 1600;
  const scale = Math.min(1, maxW / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.75);
  });
}

export default function UploadPage() {
  const params = useParams();
  const code = String(params.code).toUpperCase();

  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setBusy(true);
    setError('');
    setDone(0);
    setTotal(files.length);

    const urls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const blob = await shrink(files[i]);
        const name = code + '/' + Date.now() + '-' + i + '.jpg';

        const up = await supabase.storage
          .from('listings')
          .upload(name, blob, { contentType: 'image/jpeg' });

        if (up.error) throw up.error;

        const pub = supabase.storage.from('listings').getPublicUrl(name);
        urls.push(pub.data.publicUrl);
        setDone(i + 1);
      }

      const rpc = await supabase.rpc('add_photos', {
        listing_code: code,
        urls: urls,
      });
      if (rpc.error) throw rpc.error;
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    }

    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-10">
      <h1 className="text-2xl font-semibold">Add photos</h1>
      <p className="mt-1 text-sm text-gray-500">Listing {code}</p>

      <label className="mt-8 block cursor-pointer rounded-lg bg-black py-3.5 text-center font-medium text-white">
        {busy ? 'Uploading…' : 'Choose photos'}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={handleFiles}
          className="hidden"
        />
      </label>

      {total > 0 && (
        <p className="mt-4 text-sm text-gray-600">
          {done} of {total} uploaded
        </p>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!busy && done > 0 && done === total && (
        <a href={'/s/' + code} className="mt-6 block text-center text-sm underline">
          View listing
        </a>
      )}
    </main>
  );
}