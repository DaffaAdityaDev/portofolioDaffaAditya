/** File the editor opens first: the Uploader type and its 3 versions. */
export const SOLID_PLAYGROUND_ACTIVE_FILE = '/uploader.ts';

export const SOLID_PLAYGROUND_HEIGHT = 440;

/**
 * The avatar form after the refactor. ProfileForm depends on the Uploader type,
 * and App picks which version to pass in.
 */
export const SOLID_PLAYGROUND_FILES: Record<string, string> = {
  '/App.tsx': `import { useState } from 'react';
import ProfileForm from './ProfileForm';
import { failingUploader, fakeUploader, fetchUploader } from './uploader';
import type { Uploader } from './uploader';

const UPLOADERS: Record<string, Uploader> = {
  fake: fakeUploader,
  failing: failingUploader,
  fetch: fetchUploader,
};

export default function App() {
  const [choice, setChoice] = useState('fake');

  return (
    <main>
      <label className="picker">
        Uploader
        <select value={choice} onChange={(e) => setChoice(e.target.value)}>
          <option value="fake">fakeUploader (succeeds)</option>
          <option value="failing">failingUploader (throws)</option>
          <option value="fetch">fetchUploader (no server here)</option>
        </select>
      </label>
      <ProfileForm upload={UPLOADERS[choice]} />
    </main>
  );
}`,
  '/uploader.ts': `export interface UploadResult {
  url: string;
}

// The only thing ProfileForm knows about uploading.
export type Uploader = (file: File) => Promise<UploadResult>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Pretends to be the server: waits 800 ms, then succeeds.
export const fakeUploader: Uploader = async (file) => {
  await wait(800);
  return { url: 'https://cdn.example.com/avatars/' + file.name };
};

// Always fails, so you can see how the form handles an error.
export const failingUploader: Uploader = async () => {
  await wait(800);
  throw new Error('Upload failed: 503');
};

// What production would use. The preview has no /api/avatar, so it fails here.
export const fetchUploader: Uploader = async (file) => {
  const body = new FormData();
  body.append('avatar', file);

  const res = await fetch('/api/avatar', { method: 'POST', body });
  if (!res.ok) throw new Error('Upload failed: ' + res.status);
  return res.json();
};`,
  '/ProfileForm.tsx': `import { useState } from 'react';
import type { FormEvent } from 'react';
import AvatarPicker from './AvatarPicker';
import type { Uploader } from './uploader';

type Status = 'idle' | 'uploading' | 'done' | 'error';

export default function ProfileForm({ upload }: { upload: Uploader }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!avatar) return;

    setStatus('uploading');
    try {
      const { url } = await upload(avatar);
      console.log('Saved', { name, age: Number(age), avatarUrl: url });
      setStatus('done');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
      <AvatarPicker onSelect={setAvatar} />
      <button type="submit" disabled={!avatar || status === 'uploading'}>
        {status === 'uploading' ? 'Uploading...' : 'Save'}
      </button>
      {status === 'done' && <p>Saved. Check the console.</p>}
      {status === 'error' && <p role="alert">Upload failed. Check the console.</p>}
    </form>
  );
}`,
  '/AvatarPicker.tsx': `import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';

export default function AvatarPicker({ onSelect }: { onSelect: (file: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  // Frees the old preview URL when a new file is picked.
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPreview(file ? URL.createObjectURL(file) : null);
    onSelect(file);
  }

  return (
    <div className="avatar">
      {preview ? <img src={preview} alt="Avatar preview" /> : <span className="empty" />}
      <input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}`,
  '/styles.css': `body {
  font-family: system-ui, sans-serif;
  padding: 16px;
}

main,
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 300px;
}

.picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
}

.avatar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar img,
.avatar .empty {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  background: #ddd;
}

input,
select,
button {
  padding: 8px;
  font: inherit;
}`,
};
