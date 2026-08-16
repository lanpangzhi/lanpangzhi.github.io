'use strict';


const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const requiredFiles = [
  'index.html',
  '404.html',
  'CNAME',
  'sitemap.xml',
  'baidusitemap.xml',
  'atom.xml',
  'content.json',
  'css/style.css',
  'js/main.min.js',
  'js/search.min.js',
  'live2dw/lib/L2Dwidget.min.js',
  'live2dw/lib/L2Dwidget.0.min.js',
  'live2dw/assets/koharu.model.json',
  'live2dw/assets/moc/koharu.moc',
  'live2dw/assets/moc/koharu.2048/texture_00.png',
  'Loop与Graph-Engineering-AI-Agent编排演进指南..html'
];

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const read = relativePath => fs.readFileSync(path.join(publicDir, relativePath), 'utf8');

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(publicDir, relativePath);
  assert(fs.existsSync(absolutePath), `Missing generated file: ${relativePath}`);
  if (fs.existsSync(absolutePath)) {
    assert(fs.statSync(absolutePath).size > 0, `Generated file is empty: ${relativePath}`);
  }
}

const cname = read('CNAME').trim();
assert(cname === 'blog.langpz.com', `Unexpected CNAME: ${cname}`);

const indexHtml = read('index.html');
const postHtml = read('Loop与Graph-Engineering-AI-Agent编排演进指南..html');

for (const html of [indexHtml, postHtml]) {
  assert(html.includes('京ICP备17033838号'), 'ICP license is missing from generated HTML');
  assert(html.includes('https://beian.miit.gov.cn/'), 'ICP link is missing from generated HTML');
  assert(html.includes('https://blog.langpz.com'), 'HTTPS site URL is missing from generated HTML');
  assert(!html.includes('http://blog.langpz.com'), 'Legacy HTTP site URL remains in generated HTML');
  assert(html.includes('/live2dw/lib/L2Dwidget.min.js'), 'Local Live2D script is missing');
  assert(html.includes('/live2dw/assets/koharu.model.json'), 'Koharu Live2D model is missing');
}

assert(indexHtml.includes('Loop 与 Graph Engineering'), 'Newest article is missing from the home page');
assert(indexHtml.includes('Hosted by'), 'Hosting attribution is missing');
assert(indexHtml.includes('Tencent COS'), 'Tencent COS attribution is missing');
assert(!indexHtml.includes('Coding Pages'), 'Obsolete Coding Pages attribution remains');
assert(postHtml.includes('https://waline.langpz.com'), 'Waline server URL is missing');
assert(postHtml.includes('@waline/client@3.15.2'), 'Pinned Waline client version is missing');

for (const xmlFile of ['sitemap.xml', 'baidusitemap.xml', 'atom.xml']) {
  const xml = read(xmlFile);
  assert(xml.startsWith('<?xml'), `${xmlFile} is not XML`);
  assert(xml.includes('https://blog.langpz.com'), `${xmlFile} does not contain the canonical HTTPS URL`);
  assert(!xml.includes('http://blog.langpz.com'), `${xmlFile} contains the legacy HTTP URL`);
}

const content = JSON.parse(read('content.json'));
const posts = Array.isArray(content) ? content : content.posts;
assert(Array.isArray(posts), 'content.json does not contain a post array');
if (Array.isArray(posts)) {
  assert(posts.length >= 130, `Search index unexpectedly contains only ${posts.length} posts`);
  assert(posts.some(post => post.title && post.title.includes('Loop 与 Graph Engineering')), 'Newest article is missing from search index');
}

if (failures.length) {
  console.error(`Build verification failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Build verification passed: ${requiredFiles.length} required files, ${posts.length} indexed posts.`);
