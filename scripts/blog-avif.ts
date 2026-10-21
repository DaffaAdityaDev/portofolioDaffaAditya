// Writes the AVIF copies of every blog banner and hero for features/Blog/components/BlogPicture.tsx, from the one
// 1280px WebP per image: banner.webp -> banner.avif (1280px) and banner-640.avif (640px). The WebP stays as the
// fallback for browsers without AVIF. Skips AVIFs newer than their WebP.
//   bun run blog:avif [--force]
//   bun run blog:avif --check   (no encoding; fails if an AVIF is missing. Runs before
//                               `next build`: a <source> pointing at a missing AVIF shows a broken image, no fallback)
// Quality 60: at 50 the faint background pattern of the thumbnails smears; 60 matches the WebP at about 30% fewer bytes.
// sharp comes with next. Run from the repo root.
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/image/blogs';
const SOURCES = /^(banner|hero)\.webp$/;
const QUALITY = 60;
/** Output file suffix and the width to resize to (undefined keeps the 1280px source width). */
const OUTPUTS: [suffix: string, width?: number][] = [['', undefined], ['-640', 640]];

const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

/** Every AVIF that is missing or, unless `missingOnly`, older than its WebP. A checkout resets mtimes, so CI checks presence only. */
async function staleOutputs({ force, missingOnly }: { force: boolean; missingOnly: boolean }) {
  const dirs = await readdir(ROOT);
  const webps = (
    await Promise.all(
      dirs.map(async (dir) => (await readdir(path.join(ROOT, dir)).catch(() => [])).filter((f) => SOURCES.test(f)).map((f) => path.join(ROOT, dir, f))),
    )
  ).flat();
  const outputs = await Promise.all(
    webps.flatMap((webp) =>
      OUTPUTS.map(async ([suffix, width]) => {
        const avif = webp.replace(/\.webp$/, `${suffix}.avif`);
        const [source, encoded] = await Promise.all([stat(webp), stat(avif).catch(() => undefined)]);
        return { webp, avif, width, size: source.size, stale: force || !encoded || (!missingOnly && encoded.mtimeMs < source.mtimeMs) };
      }),
    ),
  );
  return { total: outputs.length, stale: outputs.filter((o) => o.stale) };
}

async function main() {
  const check = process.argv.includes('--check');
  const { total, stale } = await staleOutputs({ force: !check && process.argv.includes('--force'), missingOnly: check });

  if (check) {
    if (stale.length) throw new Error(`missing AVIF, run \`bun run blog:avif\`:\n  ${stale.map((s) => s.avif).join('\n  ')}`);
    console.log(`blog:avif: all ${total} AVIF copies present.`);
    return;
  }

  // libvips spreads each encode over its own threads too, but the small files leave cores idle when run one by one.
  await Promise.all(
    stale.map(async ({ webp, avif, width, size }) => {
      const info = await sharp(webp).resize(width).avif({ quality: QUALITY, effort: 6 }).toFile(avif);
      console.log(`${avif}  (${kb(size)} webp source) -> ${kb(info.size)}`);
    }),
  );
  console.log(`Wrote ${stale.length} AVIF file(s), ${total - stale.length} already up to date.`);
}

main().catch((err: unknown) => {
  console.error(`blog:avif failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
