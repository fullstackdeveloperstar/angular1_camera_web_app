import { debounce } from '../utils';

function ImagesEditController($scope, imageStore, $location, $routeParams) {
  $scope.image = imageStore.get($routeParams.imageId);
  $scope.isCropping = false;
  $scope.brightnessValue = 0;

  let dkrm;
  let lastBrightnessValue = 0;
  let brightnessInput;
  let brightnessUndoValues = [];

  function openImageInEditor(element) {
    const {
      clientWidth,
      clientHeight,
    } = document.querySelector('.workspace__area') || {};

    dkrm = window.darkroom = new Darkroom(element, {
      minWidth: 300,
      minHeight: 300,
      maxWidth: clientWidth || 400,
      maxHeight: clientHeight || 400,
      backgroundColor: 'rgba(0, 0, 0, 0)',

      plugins: {
        save: {
          callback: function () {
            const newImage = this.darkroom.image._element.src;
            imageStore.update($scope.image.id, {
              base64: newImage
            });

            $location.path('/');
          },
          hide: true
        },
      },

      initialize: function () {
        brightnessInput = document.querySelector('input[name="brightness"]');
        this.addEventListener('core:transformation', handleTransformationApply);
      },
    });
  }

  function createImageEl() {
    const imageEl = document.createElement('IMG');
    imageEl.id = 'js-edit-image';
    imageEl.className = 'workspace__img';
    imageEl.alt = 'Preview';
    return imageEl;
  }

  const previewImageEl = createImageEl();
  previewImageEl.style.display = 'none';
  document.querySelector('.workspace__area').appendChild(previewImageEl);
  previewImageEl.src = $scope.image.base64;

  previewImageEl.onload = function () {
    setTimeout(() => { openImageInEditor(previewImageEl); }, 250);
  };

  function handleTransformationApply() {
    brightnessUndoValues.push(brightnessInput.value);
  }

  $scope.handleCropClick = function () {
    if (dkrm) {
      dkrm.plugins.crop.toggleCrop();
      $scope.isCropping = dkrm.plugins.crop.hasFocus();
    }
  };

  $scope.handleCropConfirmClick = function () {
    if (dkrm) {
      if (
        dkrm.plugins.crop.cropZone
        && dkrm.plugins.crop.cropZone.width < 1
        && dkrm.plugins.crop.cropZone.height < 1
      ) {
        return $scope.handleCropCancelClick();
      }

      dkrm.plugins.crop.cropCurrentZone();
      $scope.isCropping = false;
    }
  };

  $scope.handleCropCancelClick = function () {
    if (dkrm) {
      dkrm.plugins.crop.toggleCrop();
      $scope.isCropping = dkrm.plugins.crop.hasFocus();
    }
  };

  $scope.handleRotateClick = function () {
    dkrm && dkrm.plugins.rotate.rotateRight();
  };

  const debouncedBrightnessChange = debounce(function () {
    dkrm && dkrm.plugins.brightness.brighten(
      (lastBrightnessValue - $scope.brightnessValue) * -5
    );

    lastBrightnessValue = $scope.brightnessValue;
  }, 400);

  $scope.handleBrightnessChange = debouncedBrightnessChange;

  $scope.handleReverseClick = function () {
    if (dkrm) {
      dkrm.plugins.history.undo();
      brightnessUndoValues.pop();

      const newValue = brightnessUndoValues[brightnessUndoValues.length - 1] || 0;
      brightnessInput.value = newValue;
      lastBrightnessValue = newValue;
    }
  };

  $scope.handleTrashClick = function (image) {
    imageStore.remove(image.id);
    $location.path('/');
  };

  $scope.handleNextClick = function (event) {
    event.preventDefault();
    if (dkrm) {
      dkrm.plugins['save'].save();
    } else {
      $location.path('/');
    }
  };

  $scope.$on('$destroy', function () {
    debouncedBrightnessChange.cancel();

    if (dkrm) {
      dkrm.selfDestroy();
    }
  });
}

ImagesEditController.$inject = ['$scope', 'imageStore', '$location', '$routeParams'];
export default ImagesEditController;
