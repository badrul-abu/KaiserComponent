'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { ZipArchive } = require('archiver');

const projectRoot = path.resolve(__dirname, '..');
const pluginDirectory = path.join(projectRoot, 'wordpress', 'flickr-mosaic');
const outputDirectory = path.join(projectRoot, 'dist');
const outputFile = path.join(outputDirectory, 'flickr-mosaic.zip');
const requiredFiles = [
  'flickr-mosaic.php',
  'readme.txt',
  'assets/flickr-mosaic.js',
  'assets/flickr-mosaic.css',
  'assets/flickr-logo.png',
];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(pluginDirectory, relativePath))) {
    throw new Error(`Missing plugin package file: ${relativePath}. Run npm run build:wordpress first.`);
  }
}

fs.mkdirSync(outputDirectory, { recursive: true });

const output = fs.createWriteStream(outputFile);
const archive = new ZipArchive({ zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Created ${path.relative(projectRoot, outputFile)} (${archive.pointer()} bytes)`);
});
output.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
archive.on('warning', (error) => {
  throw error;
});
archive.on('error', (error) => {
  throw error;
});

archive.pipe(output);
archive.directory(pluginDirectory, 'flickr-mosaic');
archive.finalize();
