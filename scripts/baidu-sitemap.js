'use strict';

const xmlEscape = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

hexo.extend.generator.register('baidu-sitemap', function baiduSitemapGenerator(locals) {
  const config = this.config.baidusitemap || {};
  const baseUrl = String(config.url || this.config.url).replace(/\/$/, '');
  const root = `${String(this.config.root || '/').replace(/\/$/, '')}/`;
  const entries = locals.posts.toArray()
    .concat(locals.pages.toArray())
    .filter(page => page.baidusitemap !== false && page.path)
    .sort((a, b) => b.updated.valueOf() - a.updated.valueOf())
    .map(page => {
      const updated = (page.updated || page.date).toDate().toISOString().slice(0, 10);
      const url = `${baseUrl}${root}${String(page.path).replace(/^\//, '')}`;
      return [
        '  <url>',
        `    <loc>${xmlEscape(encodeURI(url))}</loc>`,
        `    <lastmod>${updated}</lastmod>`,
        '  </url>'
      ].join('\n');
    });

  return {
    path: config.path || 'baidusitemap.xml',
    data: [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries,
      '</urlset>',
      ''
    ].join('\n')
  };
});
