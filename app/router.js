'use strict';

module.exports = app => {
  const { router } = app;
  router.get('/', 'file.index');
  router.get('/file_download', 'file.download');
  router.post('/file_upload', 'upload.index');
};
