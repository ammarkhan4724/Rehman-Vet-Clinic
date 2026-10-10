import fs from 'node:fs';
import path from 'node:path';

// Ensure /blog/ directory has an index.html identical to blog.html
const distBlogHtml = path.resolve('dist/blog.html');
const distBlogDir = path.resolve('dist/blog');
const distBlogIndex = path.resolve('dist/blog/index.html');

if (fs.existsSync(distBlogHtml)) {
  if (!fs.existsSync(distBlogDir)) {
    fs.mkdirSync(distBlogDir, { recursive: true });
  }
  fs.copyFileSync(distBlogHtml, distBlogIndex);
  console.log('✓ Successfully mirrored dist/blog.html -> dist/blog/index.html for Apache/Hostinger');
}
