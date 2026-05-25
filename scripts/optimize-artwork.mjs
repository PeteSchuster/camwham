#!/usr/bin/env node
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const DIR = 'src/assets/artwork';
const MAX_WIDTH = 2000;
const MAX_BYTES = 1_000_000;
const JPEG_QUALITY = 85;
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const files = await readdir(DIR);
let touched = 0;
let skipped = 0;

for (const name of files) {
  const ext = extname(name).toLowerCase();
  if (!RASTER.has(ext)) continue;

  const path = join(DIR, name);
  const { size } = await stat(path);
  const img = sharp(path, { failOn: 'none' });
  const meta = await img.metadata();
  const tooWide = meta.width && meta.width > MAX_WIDTH;
  const tooHeavy = size > MAX_BYTES;

  if (!tooWide && !tooHeavy) {
    skipped++;
    continue;
  }

  if (ext !== '.jpg' && ext !== '.jpeg') {
    console.warn(`! ${name} needs optimizing but isn't a JPG — leaving as-is to avoid changing the extension`);
    skipped++;
    continue;
  }

  const pipeline = img.rotate();
  if (tooWide) pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const buf = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();

  const before = (size / 1024).toFixed(0);
  const after = (buf.length / 1024).toFixed(0);
  await writeFile(path, buf);
  console.log(`✓ ${name}  ${before}KB → ${after}KB${tooWide ? ` (resized to ${MAX_WIDTH}px)` : ''}`);
  touched++;
}

console.log(`done — optimized ${touched}, left alone ${skipped}`);
