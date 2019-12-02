'use strict';

const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const crypto = require('crypto');
const Controller = require('egg').Controller;

class UploadController extends Controller {
  async index() {
    const { ctx, ctx: { app: { config } } } = this;

    const query = ctx.query;
    const keyid = query.keyid;
    const nonce = query.nonce;
    const timestamp = query.timestamp;
    const sign = query.sign;
    const expiredTime = 60;
    // binding
    const version = query.version;
    const modules = query.modules;
    const platform = query.platform;
    const arch = query.arch;
    const filename = query.filename;

    // check params
    if (!sign || !timestamp) {
      ctx.body = { ok: false, message: 'lack of query' };
      return;
    }

    // check upload time
    if (Date.now() - timestamp > expiredTime * 1000) {
      ctx.body = { ok: false, message: 'out of time' };
      return;
    }

    // check key exits
    const keysecret = config.uploadKey[keyid];
    if (!keysecret) {
      ctx.body = { ok: false, message: 'key not exists' };
      return;
    }

    // check signature
    const shasum = crypto.createHash('sha1');
    shasum.update([keyid, keysecret, nonce, timestamp].join(''));
    const signature = shasum.digest('hex');
    if (sign !== signature) {
      ctx.body = { ok: false, message: 'signature error' };
      return;
    }

    // upload to oss
    const file = ctx.request.files[0];
    const dest = path.join(config.saveDir,
      `v${version}`,
      `node-v${modules}-${platform}-${arch}`,
      filename);
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(file.filepath, dest);

    ctx.body = { ok: true };

  }
}

module.exports = UploadController;
