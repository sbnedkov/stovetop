var stovetop = angular.module('stovetop');

stovetop.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

stovetop.controller('stovetop', ['$scope', function ($scope) {
    $scope.click = function () {
        alert('Coming soon');
    };
}]);
