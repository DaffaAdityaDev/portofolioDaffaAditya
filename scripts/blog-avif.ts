// Writes an AVIF copy next to every blog banner and hero WebP (banner.webp -> banner.avif, and the -640 copies),
// for the <picture> in features/Blog/components/BlogPicture.tsx. Skips files whose AVIF is newer than the WebP.
//   bun run blog:avif [--force]
//   bun run blog:avif --check   (no encoding; fails if an AVIF is missing. Runs before
//                               `next build`: a <source> pointing at a missing AVIF shows a broken image, no fallback)
// Quality 60: at 50 the faint background pattern of the thumbnails smears; 60 matches the WebP at about 30% fewer bytes.
// sharp comes with next. Run from the repo root.
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/image/blogs';
const SOURCES = /^(banner|hero)(-640)?\.webp$/;
const QUALITY = 60;

const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

/** Every blog WebP whose AVIF is missing or, unless `missingOnly`, older than it. A checkout resets mtimes, so CI checks presence only. */
async function staleSources({ force, missingOnly }: { force: boolean; missingOnly: boolean }) {
  const dirs = await readdir(ROOT);
  const webps = (
    await Promise.all(
      dirs.map(async (dir) => (await readdir(path.join(ROOT, dir)).catch(() => [])).filter((f) => SOURCES.test(f)).map((f) => path.join(ROOT, dir, f))),
    )
  ).flat();
  const checked = await Promise.all(
    webps.map(async (webp) => {
      const avif = webp.replace(/\.webp$/, '.avif');
      const [source, encoded] = await Promise.all([stat(webp), stat(avif).catch(() => undefined)]);
      return { webp, avif, size: source.size, stale: force || !encoded || (!missingOnly && encoded.mtimeMs < source.mtimeMs) };
    }),
  );
  return { total: webps.length, stale: checked.filter((c) => c.stale) };
}

async function main() {
  const check = process.argv.includes('--check');
  const { total, stale } = await staleSources({ force: !check && process.argv.includes('--force'), missingOnly: check });

  if (check) {
    if (stale.length) throw new Error(`missing AVIF, run \`bun run blog:avif\`:\n  ${stale.map((s) => s.avif).join('\n  ')}`);
    console.log(`blog:avif: all ${total} AVIF copies present.`);
    return;
  }

  // libvips spreads each encode over its own threads too, but the small files leave cores idle when run one by one.
  await Promise.all(
    stale.map(async ({ webp, avif, size }) => {
      const info = await sharp(webp).avif({ quality: QUALITY, effort: 6 }).toFile(avif);
      console.log(`${avif}  ${kb(size)} -> ${kb(info.size)}`);
    }),
  );
  console.log(`Wrote ${stale.length} AVIF file(s), ${total - stale.length} already up to date.`);
}

main().catch((err: unknown) => {
  console.error(`blog:avif failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
