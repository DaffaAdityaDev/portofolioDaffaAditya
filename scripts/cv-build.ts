// Compiles a cv-src main document with Tectonic and publishes it as the site's resume PDF, exactly like the
// /cv editor's Publish button (same code: features/CvEditor/server).
//   npm run cv:build [main=cv.tex]
// Env: TECTONIC_BIN (default 'tectonic'), CV_SRC_DIR (default <repo>/cv-src). Run from the repo root.
import { DEFAULT_CV_MAIN } from '../features/CvEditor/constants';
import { assertMain } from '../features/CvEditor/server/paths';
import { publishCv } from '../features/CvEditor/server/publish';

async function main() {
  const doc = await assertMain(process.argv[2] || DEFAULT_CV_MAIN);
  console.log(`Compiling ${doc}...`);
  const result = await publishCv(doc);
  if (!result.ok) {
    process.stderr.write(`${result.log}\n`);
    throw new Error(result.error);
  }
  console.log(
    result.changed
      ? `Published ${result.path} (hash ${result.hash}) and updated features/Resume/resumePdf.ts`
      : `Unchanged: ${result.path} already holds hash ${result.hash}`,
  );
}

main().catch((err: unknown) => {
  console.error(`cv:build failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
