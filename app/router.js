'use strict';

module.exports = app => {
  const { router } = app;
  router.post('/file_upload', 'upload.index');
};
