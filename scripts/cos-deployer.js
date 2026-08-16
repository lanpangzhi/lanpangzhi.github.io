'use strict';

const fs = require('node:fs');
const path = require('node:path');
const COS = require('cos-nodejs-sdk-v5');

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.moc', 'application/octet-stream'],
  ['.mtn', 'application/octet-stream'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.ttf', 'font/ttf'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8']
]);

async function listFiles(directory) {
  const entries = await fs.promises.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(absolutePath) : [absolutePath];
  }));
  return files.flat();
}

function putObject(cos, params) {
  return new Promise((resolve, reject) => {
    cos.putObject(params, (error, data) => error ? reject(error) : resolve(data));
  });
}

hexo.extend.deployer.register('cos', async function deployToCos() {
  const config = this.config.deploy;
  const secretId = process.env.COS_SECRET_ID || process.env.secretId;
  const secretKey = process.env.COS_SECRET_KEY || process.env.secretKey;

  if (!config.bucket || !config.region || !secretId || !secretKey) {
    throw new Error('COS deployment requires bucket, region, and COS_SECRET_ID/COS_SECRET_KEY credentials.');
  }

  const cos = new COS({ SecretId: secretId, SecretKey: secretKey });
  const files = await listFiles(this.public_dir);
  const concurrency = 8;
  let uploaded = 0;

  for (let offset = 0; offset < files.length; offset += concurrency) {
    const batch = files.slice(offset, offset + concurrency);
    await Promise.all(batch.map(async filePath => {
      const key = path.relative(this.public_dir, filePath).split(path.sep).join('/');
      const extension = path.extname(filePath).toLowerCase();
      const stat = await fs.promises.stat(filePath);
      await putObject(cos, {
        Bucket: config.bucket,
        Region: config.region,
        Key: key,
        Body: fs.createReadStream(filePath),
        ContentLength: stat.size,
        ContentType: contentTypes.get(extension) || 'application/octet-stream',
        CacheControl: extension === '.html' ? 'no-cache' : 'public, max-age=86400'
      });
      uploaded += 1;
    }));
    this.log.info(`Uploaded ${uploaded}/${files.length} files to Tencent COS`);
  }

  this.log.info(`Tencent COS deployment completed without deleting remote files.`);
});
