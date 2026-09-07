import fs from 'node:fs';
const paths = ['collection/pack-print.webp','profile.png','projects/coletai-home.webp','thumb/imensurable-love.webp','collection/card-back.webp'];
fs.writeFileSync('src/texture-assets.js', 'export default '+JSON.stringify(paths.map(p=>'data:image/'+(p.endsWith('.webp')?'webp':'png')+';base64,'+fs.readFileSync('docs/assets/img/'+p).toString('base64')))+';');
import { build } from 'vite';
await build({
  configFile: false,
  publicDir: false,
  build: {
    outDir: 'docs/assets/js',
    emptyOutDir: false,
    sourcemap: false,
    lib: { entry: 'src/opening.js', name: 'YDHCOpening', formats: ['iife'], fileName: () => 'opening.js' },
    minify: 'esbuild',
    target: 'es2020'
  }
});
