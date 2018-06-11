
requirejs.config({
  baseUrl: '.',
  paths: {
    'index':              'index'
  },
});

requirejs(['./index.js'], function(type) {
}, function(err) {
  console.log(err);
});
