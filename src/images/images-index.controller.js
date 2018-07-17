import { ie11 } from '../utils';

function ImagesIndexController($scope, imageStore, $location) {
  $scope.images = imageStore.getStore();
  $scope.selectedImage = imageStore.at(0);
  $scope.ie11 = ie11;

  $scope.handleImageClick = function (image) {
    $scope.selectedImage = image;
  };

  $scope.handleNewImageClick = function () {
    $location.path(`/images/new`);
  };

  $scope.handleEditClick = function (image) {
    $location.path(`/images/${image.id}/edit`);
  };

  $scope.handleTrashClick = function (image) {
    const index = imageStore.getStore().findIndex(i => i === image);
    const newLength = imageStore.remove(image.id);
    $scope.images = imageStore.getStore();
    $scope.selectedImage = imageStore.at(
      (newLength - 1) < index ? -1 : index
    );
  };

  $scope.getWorkspaceAreaStyle = function () {
    return (ie11 && $scope.selectedImage)
      ? `url(${$scope.selectedImage.base64})`
      : 'none';
  };
}

ImagesIndexController.$inject = ['$scope', 'imageStore', '$location'];
export default ImagesIndexController;
