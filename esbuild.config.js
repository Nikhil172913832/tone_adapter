// esbuild.config.js
// Bundles popup.js and all dependencies for Chrome extension popup
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['popup.js'],
  bundle: true,
  outfile: 'popup.bundle.js',
  format: 'iife',
  platform: 'browser',
  target: ['chrome58'],
  external: ['chrome'], // don't bundle chrome API
  define: { 'process.env.NODE_ENV': '"production"' },
  minify: true
}).catch(() => process.exit(1));
