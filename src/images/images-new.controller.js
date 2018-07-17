import imageStoreMockup from './imageStoreMockup';
import { iOS, ie11 } from '../utils';

function createImage(dataURL, n = Date.now()) {
  return {
    id: `c${n}`,
    base64: dataURL || imageStoreMockup[0].base64,
  };
}

function createConstraints() {
  return {
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };
}

function ImagesNewController($scope, imageStore, $location) {
  $scope.hasCamera = true;
  $scope.hasStream = false;
  $scope.hasFewCams = false;

  let cameras = [];
  let currentCameraIndex = window.currentCameraIndex || -1;
  let isCameraFlipped = window.isCameraFlipped || true;

  function deviceFailure(err) {
    console.error(`${err.name}: ${err.message}`);
    $scope.$apply(() => {
      $scope.hasCamera = false;
    });
  }

  function snapCallback(dataURL) {
    imageStore.add(createImage(dataURL));
    const { id } = imageStore.at(-1);
    Webcam.reset();

    if (Webcam.mediaDevices) {
      $location.path(`/images/${id}/edit`);
    } else if (iOS || ie11) {
      $scope.$apply(() => { $location.path(`/images/${id}/edit`); });
    }
  }

  function pickNextCamera() {
    let constraints = createConstraints();

    if (
      navigator.mediaDevices
      && navigator.mediaDevices.enumerateDevices
    ) {
      currentCameraIndex = window.currentCameraIndex = (currentCameraIndex + 1 < cameras.length)
        ? currentCameraIndex + 1 : 0;
      
      const { deviceId } = cameras[currentCameraIndex];
      constraints = {
        ...constraints,
        deviceId: { exact: deviceId || '' },
      };
    } else {
      isCameraFlipped = window.isCameraFlipped = !isCameraFlipped;
      constraints = {
        ...constraints,
        facingMode: isCameraFlipped ? 'user' : 'environment',
      }
    }
    
    Webcam.set('constraints', constraints);
    Webcam.attach('.workspace__area');

    if (!Webcam.mediaDevices && iOS) {
      Webcam.snap();
    }
  }

  $scope.handleCameraClick = function () {
    Webcam.snap();
  };

  $scope.handleFlipCameraClick = function () {
    $scope.hasStream = false;
    Webcam.reset();
    pickNextCamera();
  };

  $scope.$on('$destroy', function () {
    Webcam.reset();
  });

  function handleWebcamLive() {
    $scope.$apply(() => {
      $scope.hasStream = Webcam.live;
    });
  }

  Webcam.set({
    width: 640,
    height: 480,
    dest_width: 1280,
    dest_height: 720,
    image_format: 'jpeg',
    jpeg_quality: 90,
    user_callback: snapCallback,
  });

  Webcam.on('live', handleWebcamLive);

  if (
    navigator.mediaDevices
    && navigator.mediaDevices.enumerateDevices
  ) {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        cameras = devices.filter(d => d.kind === 'videoinput');
        pickNextCamera();
      })
      .catch(deviceFailure);
  } else {
    pickNextCamera();
  }
}

ImagesNewController.$inject = ['$scope', 'imageStore', '$location'];
export default ImagesNewController;
