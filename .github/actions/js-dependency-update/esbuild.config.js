const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',
  bundle: true, // All in one file
  platform: 'node',
  target: 'node16',
  sourcemap: false,
  minify: true,
}).catch(() => process.exit(1));


