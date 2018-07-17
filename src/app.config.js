const config = ($routeProvider, $locationProvider) => {
  $locationProvider.hashPrefix('!');
  $routeProvider
    .when('/images', {
      template: require('./images/templates/index.html'),
      controller: 'ImagesIndexController as ctrl',
    })
    .when('/images/new', {
      template: require('./images/templates/new.html'),
      controller: 'ImagesNewController as ctrl',
    })
    .when('/images/:imageId/edit', {
      template: require('./images/templates/edit.html'),
      controller: 'ImagesEditController as ctrl',
    })
    .otherwise('/images');
};

config.$inject = ['$routeProvider', '$locationProvider'];
export default config;
