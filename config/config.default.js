'use strict';

const os = require('os');
const path = require('path');

module.exports = () => {
  const config = {};

  config.keys = 'ilovewujiayi0217';

  config.security = {
    csrf: {
      ignore: ['/file_upload'],
    },
  };

  config.uploadKey = {};

  config.saveDir = path.join(os.homedir(), 'bindings/');
  config.saveDirTarGz = path.join(os.homedir(), 'bindings.tar.gz/');

  config.multipart = {
    fileSize: '4mb',
    fileExtensions: [
      '.node',
    ],
    mode: 'file',
  };

  return config;
};
