'use client';

import Logo from '../../components/Logo';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
  return new Promise((r) => canvas.toBlob((b) => r(b!), 'image/jpeg', 0.75));
}

export default function EditPage() {
  const token = String(useParams().token);

  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [status, setStatus] = useState('active');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [scanCount, setScanCount] = useState(0);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc('get_listing_by_token', { t: token });
      const row = data && data[0];
      if (row) {
        setFound(true);
        setCode(row.code || '');
        setTitle(row.title || '');
        setPrice(row.price || '');
        setDescription(row.description || '');
        setLocation(row.location || '');
        setContactName(row.contact_name || '');
        setContactPhone(row.contact_phone || '');
        setContactEmail(row.contact_email || '');
        setPhotos(row.photos || []);
        setStatus(row.status === 'unclaimed' ? 'active' : (row.status || 'active'));
        setScanCount(row.scan_count || 0);
      }
      setLoading(false);
    })();
  }, [token]);

  async function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setMsg('');
    const next = [...photos];
    try {
      for (let i = 0; i < files.length; i++) {
        const blob = await shrink(files[i]);
        const name = code + '/' + Date.now() + '-' + i + '.jpg';
        const up = await supabase.storage.from('listings').upload(name, blob, { contentType: 'image/jpeg' });
        if (up.error) throw up.error;
        next.push(supabase.storage.from('listings').getPublicUrl(name).data.publicUrl);
      }
      setPhotos(next);
      setMsg('Photos added. Remember to save.');
    } catch (err: any) {
      setMsg(err.message || 'Upload failed');
    }
    setBusy(false);
    e.target.value = '';
  }

  function removePhoto(i: number) {
    setPhotos(photos.filter((_, n) => n !== i));
  }

  function movePhoto(i: number, dir: number) {
    const j = i + dir;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
    setPhotos(next);
  }

  async function save() {
    if (!title.trim()) {
      setMsg('Give the listing a title first');
      return;
    }
    setBusy(true);
    setMsg('');
    const { error } = await supabase.rpc('update_listing', {
      t: token,
      p_title: title,
      p_price: price,
      p_description: description,
      p_location: location,
      p_contact_name: contactName,
      p_contact_phone: contactPhone,
      p_contact_email: contactEmail,
      p_photos: photos,
      p_status: status,
    });
    setMsg(error ? error.message : 'Saved');
    setBusy(false);
  }

  if (loading) return <main className="p-8 text-sm text-gray-500">Loading…</main>;
  if (!found) return <main className="p-8">That edit link is not valid.</main>;

  const field = 'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base';
  const label = 'mt-5 block text-sm font-medium text-gray-700';

  return (
    <main className="mx-auto max-w-lg px-5 py-8">
      <Logo />
      <h1 className="mt-8 text-2xl font-black uppercase tracking-tight text-slate-900">Your listing</h1>
      <p className="mt-1 text-sm text-gray-500">curbsell.com/s/{code}</p>
      <p className="mt-1 text-sm text-gray-500">{scanCount === 0 ? 'No scans yet' : scanCount === 1 ? '1 scan' : scanCount + ' scans'}</p>
      <label className={label}>Title</label>
      <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} />

      <label className={label}>Price</label>
      <input className={field} value={price} onChange={(e) => setPrice(e.target.value)} />

      <label className={label}>Location</label>
      <input className={field} value={location} onChange={(e) => setLocation(e.target.value)} />

      <label className={label}>Description</label>
      <textarea className={field} rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />

      <label className={label}>Your name</label>
      <input className={field} value={contactName} onChange={(e) => setContactName(e.target.value)} />

      <label className={label}>Phone</label>
      <input className={field} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />

      <label className={label}>Email</label>
      <input className={field} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />

      <p className="mt-8 text-sm font-medium text-gray-700">Photos</p>
      <p className="text-xs text-gray-500">The first photo is the main image.</p>

      <div className="mt-3 space-y-3">
        {photos.map((url, i) => (
          <div key={url} className="flex items-center gap-3 rounded-lg border border-gray-200 p-2">
            <img src={url} alt="" className="h-16 w-24 rounded object-cover" />
            {i === 0 && <span className="text-xs text-gray-500">Main</span>}
            <div className="ml-auto flex gap-2">
              <button onClick={() => movePhoto(i, -1)} className="rounded border border-gray-300 px-2 py-1 text-sm">Up</button>
              <button onClick={() => movePhoto(i, 1)} className="rounded border border-gray-300 px-2 py-1 text-sm">Down</button>
              <button onClick={() => removePhoto(i)} className="rounded border border-gray-300 px-2 py-1 text-sm text-red-600">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <label className="mt-4 block cursor-pointer rounded-lg border border-gray-400 py-3 text-center font-medium">
        {busy ? 'Working…' : 'Add photos'}
        <input type="file" accept="image/*" multiple disabled={busy} onChange={addPhotos} className="hidden" />
      </label>

      <label className={label}>Status</label>
      <select className={field} value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="active">Active</option>
        <option value="sold">Sold</option>
        <option value="deleted">Deleted</option>
      </select>

      <button
        onClick={save}
        disabled={busy}
        className="mt-8 w-full rounded-lg bg-black py-3.5 font-medium text-white"
      >
        {busy ? 'Saving…' : 'Save changes'}
      </button>

      {msg && <p className="mt-4 text-sm text-gray-600">{msg}</p>}

      <a href={'/s/' + code} className="mt-6 block text-center text-sm underline">View listing</a>
    </main>
  );
}