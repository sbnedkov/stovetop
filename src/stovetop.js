var stovetop = angular.module('stovetop');

stovetop.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

stovetop.controller('stovetop', ['$scope', '$uibModal', function ($scope, $modal) {
    $scope.click = function () {
        alert('Coming soon');
    };

    $scope.showVideo = function (id) {
        $modal.open({
            animation: true,
            controller: 'VideoController',
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: '/views/templates/video.html',
            resolve: {
                ytid: function () {
                    return id;
                }
            },
            size: 'lg'
        });
    };
}])
.controller('VideoController', ['$scope', 'ytid', '$sce', function ($scope, ytid, $sce) {
    $scope.videoUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + ytid);
}]);
