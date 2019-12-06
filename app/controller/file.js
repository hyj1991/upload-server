'use strict';

const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const promisify = require('util').promisify;
const readdir = promisify(fs.readdir);
const exists = promisify(fs.exists);
const exec = promisify(cp.exec);
const Controller = require('egg').Controller;

class FileController extends Controller {
  async index() {
    const { ctx, ctx: { app: { config } } } = this;
    let versions = await readdir(config.saveDir);
    versions = versions.filter(v => !v.includes('tar.gz'));
    await ctx.render('file', { versions });
  }

  async download() {
    const { ctx, ctx: { app: { config } } } = this;
    const version = ctx.query.version;

    const versionPath = path.join(config.saveDir, version);
    if (!await exists(versionPath)) {
      ctx.body = { ok: false, message: 'file not exists.' };
      return;
    }

    const gzName = `${version}.tar.gz`;
    await exec(`tar -cvf ${gzName}  ./${version}`, { cwd: path.dirname(versionPath) });
    const versionTarGz = path.join(config.saveDir, gzName);
    if (!await exists(versionTarGz)) {
      ctx.body = { ok: false, message: 'gzip failed.' };
      return;
    }

    ctx.set('content-type', 'application/octet-stream');
    ctx.set('content-disposition', `attachment;filename=${version}.tar.gz`);
    ctx.body = fs.createReadStream(versionTarGz);
  }
}

module.exports = FileController;