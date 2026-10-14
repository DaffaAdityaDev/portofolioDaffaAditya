import React from 'react';
import Callout from '../../components/Callout';
import CodeBlock from '../../components/CodeBlock';
import Reveal from '../../components/Reveal';
import { lazyOnView } from '../../components/LazyOnView';
import BlogTable from '../../components/BlogTable';

// Every widget sits below the first screen: its HTML is in the static page, its JS loads on scroll.
const SolidPlayground = lazyOnView(() => import('./widgets/playground/components/SolidPlayground'));
const ChangeRipple = lazyOnView(() => import('./widgets/changeRipple/components/ChangeRipple'));

export default function SolidPrinciples() {
  return (
    <div className="blog-content-static">
      <p>You open a component you wrote 6 months ago to change one small thing. The change touches 4 files, and a test that has nothing to do with it breaks. The code works. It is just hard to change.</p>

      <p>SOLID is a set of 5 rules about where code should live, so that a change stays small. The rules were written for classes in object-oriented code, but they map well onto React: components, hooks, props types and services.</p>

      <p>This post takes one feature, a profile form with an avatar upload, and refactors it once per principle. You get:</p>
      <ul>
        <li><strong>Before and after code</strong> for each principle, in TypeScript.</li>
        <li><strong>A live editor</strong> where you edit <code>uploader.ts</code>, press Save, and read the result in the console. The form's code never changes.</li>
        <li><strong>A widget that counts</strong> which files a change touches in each version.</li>
        <li><strong>A short list</strong> of cases where SOLID is not worth the extra files.</li>
      </ul>

      <p>I learned these rules by reopening my own old projects. The starting code below is the kind I found there.</p>

      <Reveal>
        <h2>Where SOLID comes from</h2>

        <p>Robert C. Martin described 4 of these principles in his 2000 paper <em>Design Principles and Design Patterns</em>, and the Single Responsibility Principle in his 2002 book <em>Agile Software Development, Principles, Patterns, and Practices</em>. Around 2004, Michael Feathers arranged them into the acronym SOLID, and the name stuck. 2 of the ideas are older: the Open/Closed Principle comes from Bertrand Meyer's 1988 book <em>Object-Oriented Software Construction</em>, and the Liskov Substitution Principle from a 1987 talk by Barbara Liskov.</p>

        <p>Here is how the terms map:</p>

        <BlogTable>
          <thead>
            <tr>
              <th>The rules say</th>
              <th>In React and TypeScript, read</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Class or module</td>
              <td>A component, a hook, or a plain service file</td>
            </tr>
            <tr>
              <td>Interface</td>
              <td>A props type, or a function type such as <code>(file: File) =&gt; Promise&lt;UploadResult&gt;</code></td>
            </tr>
            <tr>
              <td>Subclass</td>
              <td>A component or function that claims to fit an existing type</td>
            </tr>
            <tr>
              <td>Depends on</td>
              <td>Imports, or calls directly</td>
            </tr>
          </tbody>
        </BlogTable>
      </Reveal>

      <Reveal>
        <h2>The running example</h2>

        <p>Here is the starting point: a profile form with a name, an age and an avatar picture. One component holds all of it. It works, and it is how most of these forms start.</p>

        <CodeBlock language="tsx" title="components/ProfileForm.tsx" highlight="9,12-21,29-33,45-46">
{`import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Profile } from '../types';

export default function ProfileForm({ onSave }: { onSave: (profile: Profile) => void }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');

  // Frees the old preview URL when a new file is picked, and the last one on unmount.
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAvatar(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!avatar) return;

    setStatus('uploading');
    try {
      const body = new FormData();
      body.append('avatar', avatar);
      const res = await fetch('/api/avatar', { method: 'POST', body });
      if (!res.ok) throw new Error('Upload failed: ' + res.status);
      const { url } = await res.json();
      onSave({ name, age: Number(age), avatarUrl: url });
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
      {preview && <img src={preview} alt="Avatar preview" />}
      <input type="file" accept="image/*" onChange={handleFile} />
      <button type="submit" disabled={!avatar || status === 'uploading'}>Save</button>
      {status === 'error' && <p role="alert">Upload failed.</p>}
    </form>
  );
}`}
        </CodeBlock>

        <p>The highlighted lines are not about the form. Some pick a file and show a preview. Others talk to the server. Nothing here is a bug. The trouble shows up only when you need to change it, and every section below changes this code.</p>
      </Reveal>

      <Reveal>
        <h2>S: Single Responsibility</h2>

        <p><strong>The rule:</strong> a module should have one reason to change. That is Martin's own wording, and it is more useful than "do one thing". A responsibility is a kind of change, and usually a person who asks for it.</p>

        <p>The form above has 3 reasons to change:</p>
        <ul>
          <li>A designer moves the fields around. That is the <strong>layout</strong>.</li>
          <li>Product wants a camera option, or a crop step. That is <strong>picking the file</strong>.</li>
          <li>The backend moves the endpoint, or adds auth headers. That is the <strong>upload request</strong>.</li>
        </ul>

        <p>Each of those edits lands in the same file, next to code it should not be able to break. So split it into 3 pieces, one per reason.</p>

        <h3>After: one reason to change each</h3>

        <p>The network code moves to a plain function. It knows nothing about React:</p>

        <CodeBlock language="ts" title="services/uploadAvatar.ts">
{`export interface UploadResult {
  url: string;
}

export async function uploadAvatar(file: File): Promise<UploadResult> {
  const body = new FormData();
  body.append('avatar', file);

  const res = await fetch('/api/avatar', { method: 'POST', body });
  if (!res.ok) throw new Error('Upload failed: ' + res.status);
  return res.json();
}`}
        </CodeBlock>

        <p>Picking and previewing move to their own component. It hands the file up through <code>onSelect</code> and does not care what happens to it next:</p>

        <CodeBlock language="tsx" title="components/AvatarPicker.tsx">
{`import { useEffect, useState } from 'react';
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
    <div>
      {preview && <img src={preview} alt="Avatar preview" />}
      <input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}`}
        </CodeBlock>

        <p>What is left in the form is layout and submit. The added lines are the only new code:</p>

        <CodeBlock language="tsx" title="components/ProfileForm.tsx" added="3-4,19,31">
{`import { useState } from 'react';
import type { FormEvent } from 'react';
import AvatarPicker from './AvatarPicker';
import { uploadAvatar } from '../services/uploadAvatar';
import type { Profile } from '../types';

export default function ProfileForm({ onSave }: { onSave: (profile: Profile) => void }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!avatar) return;

    setStatus('uploading');
    try {
      const { url } = await uploadAvatar(avatar);
      onSave({ name, age: Number(age), avatarUrl: url });
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
      <AvatarPicker onSelect={setAvatar} />
      <button type="submit" disabled={!avatar || status === 'uploading'}>Save</button>
      {status === 'error' && <p role="alert">Upload failed.</p>}
    </form>
  );
}`}
        </CodeBlock>

        <p><strong>What it buys you:</strong> the backend change goes into <code>uploadAvatar.ts</code> without opening a component, and a layout change cannot break the upload. You can run the finished version of this form in the <a href="#try-the-uploader">Dependency Inversion section</a>.</p>
      </Reveal>

      <Reveal>
        <h2>O: Open/Closed</h2>

        <p><strong>The rule:</strong> code should be open for extension and closed for modification. In plain words: you add a new case by adding code, not by editing code that already works and is already tested.</p>

        <p>Product asks for a camera option, then for "import from a URL". The easy path is a <code>source</code> prop and a growing chain of <code>if</code> checks:</p>

        <CodeBlock language="tsx" title="components/AvatarPicker.tsx" highlight="5,13-17">
{`import { CameraCapture } from './CameraCapture';
import { FilePicker } from './FilePicker';
import { UrlImport } from './UrlImport';

type Source = 'file' | 'camera' | 'url';

interface AvatarPickerProps {
  source: Source;
  onSelect: (file: File | null) => void;
}

export default function AvatarPicker({ source, onSelect }: AvatarPickerProps) {
  if (source === 'camera') {
    return <CameraCapture onCapture={onSelect} />;
  } else if (source === 'url') {
    return <UrlImport onImport={onSelect} />;
  }
  return <FilePicker onSelect={onSelect} />;
}`}
        </CodeBlock>

        <p>Every new source edits this file, its union type and its tests. The fix is to describe what any source looks like, and let the picker render whatever list it gets:</p>

        <CodeBlock language="ts" title="sources/types.ts">
{`import type { ComponentType } from 'react';

export interface AvatarSource {
  id: string;
  label: string;
  // Renders the UI for this source and reports the picked file.
  Picker: ComponentType<{ onSelect: (file: File | null) => void }>;
}`}
        </CodeBlock>

        <CodeBlock language="tsx" title="components/AvatarPicker.tsx" highlight="20">
{`import { useState } from 'react';
import type { AvatarSource } from '../sources/types';

interface AvatarPickerProps {
  sources: AvatarSource[];
  onSelect: (file: File | null) => void;
}

export default function AvatarPicker({ sources, onSelect }: AvatarPickerProps) {
  const [activeId, setActiveId] = useState(sources[0].id);
  const active = sources.find((source) => source.id === activeId) ?? sources[0];

  return (
    <div>
      {sources.map((source) => (
        <button key={source.id} type="button" onClick={() => setActiveId(source.id)}>
          {source.label}
        </button>
      ))}
      <active.Picker onSelect={onSelect} />
    </div>
  );
}`}
        </CodeBlock>

        <p>Now Gravatar, the avatar service tied to an email address, is a new file. <code>fetchGravatarFile</code> is a small helper, also new, that downloads the picture and wraps it in a <code>File</code>. If the download fails, the picker reports no file:</p>

        <CodeBlock language="tsx" title="sources/gravatar.tsx">
{`import { useState } from 'react';
import { fetchGravatarFile } from './fetchGravatarFile';
import type { AvatarSource } from './types';

function GravatarPicker({ onSelect }: { onSelect: (file: File | null) => void }) {
  const [email, setEmail] = useState('');

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button type="button" onClick={() => fetchGravatarFile(email).then(onSelect, () => onSelect(null))}>
        Use my Gravatar
      </button>
    </div>
  );
}

export const gravatarSource: AvatarSource = { id: 'gravatar', label: 'Gravatar', Picker: GravatarPicker };`}
        </CodeBlock>

        <p>The only edit to existing code is in the list of sources: 1 import and 1 entry.</p>

        <CodeBlock language="ts" title="sources/index.ts" added="3" highlight="7">
{`import { cameraSource } from './camera';
import { fileSource } from './file';
import { gravatarSource } from './gravatar';
import { urlSource } from './url';
import type { AvatarSource } from './types';

export const AVATAR_SOURCES: AvatarSource[] = [fileSource, cameraSource, urlSource, gravatarSource];`}
        </CodeBlock>

        <p><strong>What it buys you:</strong> <code>AvatarPicker</code> and its tests never change again when a source is added, and a bug in the new source stays in the new file.</p>
      </Reveal>

      <Reveal>
        <h2>L: Liskov Substitution</h2>

        <p><strong>The rule:</strong> if code works with a type, it must keep working with anything that claims to be that type. For a component, the props type is the claim. If your component says it takes the props of an <code>&lt;input&gt;</code>, it has to behave like one for every one of them.</p>

        <p>Here is a custom input that breaks the claim in 3 ways:</p>

        <CodeBlock language="tsx" title="components/TextInput.tsx" highlight="3-4,7,11-12">
{`import type { InputHTMLAttributes } from 'react';

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange: (value: string) => void;
};

export function TextInput({ onChange, disabled, ...rest }: TextInputProps) {
  return (
    <input
      {...rest}
      className={disabled ? 'input input-muted' : 'input'}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}`}
        </CodeBlock>

        <ul>
          <li><strong><code>onChange</code> gets a string</strong> instead of the event. Every caller written for <code>&lt;input&gt;</code>, such as <code>{'(e) => setName(e.target.value)'}</code>, has to be rewritten.</li>
          <li><strong><code>disabled</code> is read but never passed on.</strong> The field turns gray but still accepts typing.</li>
          <li><strong><code>className</code> is overwritten.</strong> A class the caller passes is dropped without a warning.</li>
        </ul>

        <p>The first one TypeScript stops: the props type no longer says it takes what <code>&lt;input&gt;</code> takes, so you get an error at every caller. The other 2 are the real Liskov problem. The type promises <code>disabled</code> and <code>className</code>, and the behavior breaks that promise. TypeScript does not catch them, and you find them in manual testing (QA) or in production.</p>

        <p>The fix is to honor the type you claim. Take every input prop, pass every one of them on, and merge the caller's class with your own:</p>

        <CodeBlock language="tsx" title="components/TextInput.tsx" highlight="5-6">
{`import type { ComponentProps } from 'react';
import { cn } from '../utils/cn';

// Takes every <input> prop, ref included, and passes it on. Disabled styles come from :disabled in CSS.
export function TextInput({ className, ...rest }: ComponentProps<'input'>) {
  return <input {...rest} className={cn('input', className)} />;
}`}
        </CodeBlock>

        <p><code>ComponentProps&lt;'input'&gt;</code> includes <code>ref</code>, which form libraries such as react-hook-form attach to each field. In React 19, <code>ref</code> is a normal prop, so <code>...rest</code> passes it on. In React 18, wrap the component in <code>forwardRef</code>, or the ref is dropped.</p>

        <p>The same rule applies to fakes in tests. A fake upload function that resolves to <code>{'{ ok: true }'}</code> instead of <code>{'{ url }'}</code> lets the test pass while the form saves <code>avatarUrl: undefined</code>, a case production never sees. Give the fake the same type as the real one, and TypeScript checks the shape for you.</p>

        <p><strong>What it buys you:</strong> you can swap <code>&lt;input&gt;</code> for <code>&lt;TextInput&gt;</code> by changing the tag name, and nothing else.</p>
      </Reveal>

      <Reveal>
        <h2>I: Interface Segregation</h2>

        <p><strong>The rule:</strong> do not make code depend on things it does not use. For a component, that means its props should ask for what it reads, not for the whole object it came from.</p>

        <p>Now you want the avatar in the navbar too, so you write a badge for it:</p>

        <CodeBlock language="tsx" title="components/AvatarBadge.tsx" highlight="3">
{`import type { User } from '../types';

export function AvatarBadge({ user }: { user: User }) {
  return <img className="avatar-badge" src={user.avatarUrl} alt={user.name} />;
}`}
        </CodeBlock>

        <p>It reads 2 fields but asks for a full <code>User</code>, with email, age and settings. That has 3 costs:</p>
        <ul>
          <li>The navbar may only have a session with a name and a picture. To use the badge it has to load or fake a whole user.</li>
          <li>Every test has to build a full <code>User</code> object to show a picture.</li>
          <li>If you wrap the badge in <code>React.memo</code>, which skips a render when the props are equal, a new <code>user</code> object makes it render again even when only the email changed. With 2 string props, <code>memo</code> can skip that render.</li>
        </ul>

        <p>Ask for the 2 fields instead. <code>Pick</code> keeps them tied to the <code>User</code> type, so a rename still shows up as a type error:</p>

        <CodeBlock language="tsx" title="components/AvatarBadge.tsx" highlight="3,5-6">
{`import type { User } from '../types';

type AvatarBadgeProps = Pick<User, 'name' | 'avatarUrl'>;

export function AvatarBadge({ name, avatarUrl }: AvatarBadgeProps) {
  return <img className="avatar-badge" src={avatarUrl} alt={name} />;
}`}
        </CodeBlock>

        <p>The navbar now writes <code>{'<AvatarBadge name={session.name} avatarUrl={session.avatarUrl} />'}</code> with the data it already has. The same idea applies beyond props: a hook that returns 12 values when callers use 2, or an API payload that carries fields nobody reads.</p>

        <p><strong>What it buys you:</strong> small components that are easy to reuse, test and render in places you did not plan for.</p>
      </Reveal>

      <Reveal>
        <h2>D: Dependency Inversion</h2>

        <p><strong>The rule:</strong> high-level code should not depend on low-level details. Both should depend on a shared shape. Here the form is the high-level code, and <code>fetch</code> is the detail.</p>

        <p>After the Single Responsibility split, <code>ProfileForm</code> imports <code>uploadAvatar</code>, and <code>uploadAvatar</code> calls <code>fetch</code>. So the form can only ever upload with <code>fetch</code>. To test it you have to patch something global: the <code>fetch</code> function, or the <code>uploadAvatar</code> module with <code>vi.mock</code>. Neither is something your app code can do. This test uses Vitest, and Jest's <code>jest.spyOn</code> works the same way:</p>

        <CodeBlock language="tsx" title="components/ProfileForm.test.tsx">
{`// The form imports its uploader, so the test has to patch a global.
vi.spyOn(globalThis, 'fetch').mockResolvedValue(
  new Response(JSON.stringify({ url: 'https://cdn.example.com/a.png' })),
);`}
        </CodeBlock>

        <p>The fix is to name the shape the form needs, a function from a file to an upload result, and let the form receive it. <code>uploadAvatar.ts</code> becomes <code>uploader.ts</code>: the same code, now with a name for its shape:</p>

        <CodeBlock language="ts" title="services/uploader.ts" highlight="5-6">
{`export interface UploadResult {
  url: string;
}

// What the app depends on: a shape, not fetch.
export type Uploader = (file: File) => Promise<UploadResult>;

export const defaultUploader: Uploader = async (file) => {
  const body = new FormData();
  body.append('avatar', file);

  const res = await fetch('/api/avatar', { method: 'POST', body });
  if (!res.ok) throw new Error('Upload failed: ' + res.status);
  return res.json();
};`}
        </CodeBlock>

        <p>The form can get its <code>Uploader</code> through a prop or through context. Context saves you from passing it through every layer:</p>

        <CodeBlock language="ts" title="context/UploaderContext.ts">
{`import { createContext, useContext } from 'react';
import { defaultUploader } from '../services/uploader';
import type { Uploader } from '../services/uploader';

export const UploaderContext = createContext<Uploader>(defaultUploader);
export const useUploader = () => useContext(UploaderContext);`}
        </CodeBlock>

        <CodeBlock language="tsx" title="components/ProfileForm.tsx" removed="1,7" added="2,5,8">
{`import { uploadAvatar } from '../services/uploadAvatar';
import { useUploader } from '../context/UploaderContext';

export default function ProfileForm({ onSave }: { onSave: (profile: Profile) => void }) {
  const upload = useUploader();
  // ...
      const { url } = await uploadAvatar(avatar);
      const { url } = await upload(avatar);`}
        </CodeBlock>

        <p>The test hands in its own uploader, and no global is touched:</p>

        <CodeBlock language="tsx" title="components/ProfileForm.test.tsx">
{`const fakeUploader: Uploader = async () => ({ url: 'https://cdn.example.com/a.png' });

render(
  <UploaderContext.Provider value={fakeUploader}>
    <ProfileForm onSave={onSave} />
  </UploaderContext.Provider>,
);`}
        </CodeBlock>

        <p>Later you move uploads straight to S3 with a presigned URL: your server signs a short-lived URL, and the browser sends the file to the bucket with a <code>PUT</code>. That is a new body for <code>defaultUploader</code>, and nothing else changes:</p>

        <CodeBlock language="ts" title="services/uploader.ts">
{`export const defaultUploader: Uploader = async (file) => {
  const sign = await fetch('/api/avatar/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: file.type }),
  });
  if (!sign.ok) throw new Error('Sign failed: ' + sign.status);
  const { uploadUrl, publicUrl } = await sign.json();

  const res = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
  if (!res.ok) throw new Error('Upload failed: ' + res.status);
  return { url: publicUrl };
};`}
        </CodeBlock>

        <p><strong>What it buys you:</strong> the form's code only calls an <code>Uploader</code>. The default one is picked in one place, the context file. A test or a different app can hand in another uploader, and you swap the real transport in that one place.</p>

        <h3 id="try-the-uploader">Try it: swap the uploader</h3>

        <p>Below is the refactored form in a live editor, with the console open under it. The editor starts on <code>uploader.ts</code>, which holds the <code>Uploader</code> type and 3 versions of it. <code>App.tsx</code> picks one and passes it to <code>ProfileForm</code> as the <code>upload</code> prop.</p>

        <p>Pick an image, press Save, and read the console. Then edit <code>uploader.ts</code>: change the URL that <code>fakeUploader</code> returns, or make it throw, and press Save again. You can also pick another uploader in the form. <code>ProfileForm.tsx</code> and <code>AvatarPicker.tsx</code> never change. <code>fetchUploader</code> fails here, because the preview has no <code>/api/avatar</code>.</p>
      </Reveal>

      <SolidPlayground />

      <Reveal>
        <h2>See the difference</h2>

        <p>Reading 5 definitions does not show what SOLID is for. Counting files does. Below is the same feature written 2 ways: tangled, where each form holds everything, and split by the 5 principles. Pick a change request and see which files each version has to edit.</p>
      </Reveal>

      <ChangeRipple />

      <Reveal>
        <p>The split version is not always fewer files: a new avatar source adds 2 new files. It is fewer edits to code that already works, and that is where bugs come from.</p>
      </Reveal>

      <Reveal>
        <h2>When not to apply it</h2>

        <p>Every principle here adds a file, a type or a layer. That has a cost: more places to look, more names to learn, and more code to read before you can change anything.</p>

        <Callout variant="warning" title="Skip it when">
          The code is a prototype you may throw away. The screen is used once and owned by one person. An interface has exactly one implementation and no test needs a fake, so a function call is enough. Or the result would be 6 files for a 20-line feature. Wait until the second real case shows up, then split along the line it shows you.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>What to keep</h2>

        <p>Use the 5 principles as questions in code review, not as rules to apply everywhere:</p>
        <ul>
          <li><strong>S:</strong> Does this file have more than one reason to change?</li>
          <li><strong>O:</strong> Can I add this case without editing a file that already works?</li>
          <li><strong>L:</strong> Does this component do everything its props type promises?</li>
          <li><strong>I:</strong> Does this component ask for more than it reads?</li>
          <li><strong>D:</strong> Does this logic call <code>fetch</code> or a library directly, where a type would let me swap it?</li>
        </ul>
      </Reveal>
    </div>
  );
}
