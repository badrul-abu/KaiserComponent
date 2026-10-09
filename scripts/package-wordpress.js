'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { ZipArchive } = require('archiver');

const projectRoot = path.resolve(__dirname, '..');
const plugins = {
  'flickr-mosaic': ['flickr-mosaic.php', 'readme.txt', 'assets/flickr-mosaic.js', 'assets/flickr-mosaic.css', 'assets/flickr-logo.png'],
  'abu-programme-pdf': ['abu-programme-pdf.php', 'readme.txt', 'assets/custom-pdf-reader.js'],
};
const pluginName = process.argv[2] || 'flickr-mosaic';
if (!plugins[pluginName]) {
  throw new Error(`Unknown plugin: ${pluginName}`);
}
const pluginDirectory = path.join(projectRoot, 'wordpress', pluginName);
const outputDirectory = path.join(projectRoot, 'dist');
const outputFile = path.join(outputDirectory, `${pluginName}.zip`);
const requiredFiles = plugins[pluginName];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(pluginDirectory, relativePath))) {
    throw new Error(`Missing plugin package file: ${relativePath}. Run the plugin build first.`);
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
archive.directory(pluginDirectory, pluginName);
archive.finalize();
