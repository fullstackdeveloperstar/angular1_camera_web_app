import angular from 'angular';
import 'angular-route';

import config from './app.config';
import './utils/prevent-scaling';
import './utils/polyfills';
import imageStoreService from './images/image-store.service';
import ImagesIndexController from './images/images-index.controller';
import ImagesEditController from './images/images-edit.controller';
import ImagesNewController from './images/images-new.controller';
import './styles/normalize.css';
import './styles/main.css';

// import 'webrtc-adapter';
import './libs/darkroom/darkroom.css';
import './libs/darkroom/darkroom';
import './libs/darkroom/plugins/darkroom.brightness';

angular.module('pos', [
  'ngRoute',
])
  .service('imageStore', imageStoreService)
  .controller('ImagesIndexController', ImagesIndexController)
  .controller('ImagesEditController', ImagesEditController)
  .controller('ImagesNewController', ImagesNewController)
  .config(config);
