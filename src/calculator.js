var stovetop = angular.module('stovetop');

stovetop.controller('calculator', ['$scope', '$http', 'TrewbrewsCalculator', function ($scope, $http, Calculator) {
    var _ = window._;

    $http.get('/data')
        .success(function (data) {
            _.extend($scope, data);
        })
        .error(function (err) {
            console.log(err);
            alert(JSON.stringify(err));
        });

    $scope.calculator = Calculator();
    $scope.result = {};

    $scope.boilsize = 28.5;
    $scope.size = 21;
    $scope.time = 60;
    $scope.efficiency = 75;
    $scope.fermentablesarr = [];
    $scope.hopsarr = [];

    $scope.addFermentable = function () {
        $scope.fermentablesarr.push({});
    };

    $scope.addHop = function () {
        $scope.hopsarr.push({});
    };

    $scope.deleteFermentable = function (idx) {
        $scope.fermentablesarr.splice(idx, 1);
    };

    $scope.deleteHop = function (idx) {
        $scope.hopsarr.splice(idx, 1);
    };

    $scope.color =  function (srm) {
        var r = 0.5 + (272.098 - 5.80255*srm);
        if (r > 253.0) {
            r = 253.0;
        }
        var g = (srm > 35)? 0 : 0.5 + (2.41975e2 - 1.3314e1*srm + 1.881895e-1*srm*srm);
        var b = 0.5 + (179.3 - 28.7*srm);

        r = (r < 0) ? 0 : ((r > 255)? 255 : r);
        g = (g < 0) ? 0 : ((g > 255)? 255 : g);
        b = (b < 0) ? 0 : ((b > 255)? 255 : b);

        return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
    };

    // Watch for gravity change
    $scope.$watch('[fermentablesarr, hopsarr, yeast, boilsize, size, efficiency, equipment]', function () {
        calculate();
    }, true);

    $scope.$watch('style', function (style) {
        if (style) {
            style = JSON.parse(style);

            var ogm = style.og.match(/^([0-9\.]+)-([0-9\.]+)\+?$/);
            $scope.oglow = parseFloat(ogm[1]);
            $scope.oghi = parseFloat(ogm[2]) / 1000 + 1;

            var fgm = style.fg.match(/^([0-9\.]+)-([0-9\.]+)\+?$/);
            $scope.fglow = parseFloat(fgm[1]);
            $scope.fghi = parseFloat(fgm[2]) / 1000 + 1;

            var ibum = style.ibu.match(/^([0-9\.]+)-([0-9\.]+)\+?$/);
            $scope.ibulow = parseFloat(ibum[1]);
            $scope.ibuhi = parseFloat(ibum[2]);

            var srmm = style.srm.match(/^([0-9\.]+)-([0-9\.]+)\+?$/);
            $scope.srmlow = parseFloat(srmm[1]);
            $scope.srmhi = parseFloat(srmm[2]);

            $scope.abvlow = $scope.calculator.gravityToAbv({
                og: $scope.oglow,
                fg: $scope.fglow
            });

            $scope.abvhi = $scope.calculator.gravityToAbv({
                og: $scope.oghi,
                fg: $scope.fghi
            });
        }
    });

    function calculate () {
        var batchSize = $scope.size;
        var time = $scope.time;

        var amounts = getSizes();
        var fermentables = getFermentables().map(function (f, idx) {
            return _.extend(f, {
                kgs: amounts[idx]
            });
        });

        var hamounts = getHopsSizes();
        var htimes = getHopsTimes();
        var hops = getHops().map(function (h, idx) {
            return _.extend(h, {
                grams: hamounts[idx],
                time: htimes[idx]
            });
        });

        var yeast = $scope.yeast && [JSON.parse($scope.yeast || '{}')] || [];

        $scope.calculator.calculate({
            batchSize: batchSize,
            time: time,
            fermentables: fermentables || [],
            hops: hops || [],
            yeast: yeast
        }, function (err, res) {
            if (err) {
                return console.log(err);
            }

            $scope.result = res;
        });
    }

    function getFermentables () {
        return _.map($scope.fermentablesarr, function (f) {
            return JSON.parse(f.fermentable || '{}');
        });
    }

    function getSizes () {
        return _.map($scope.fermentablesarr, function (f) {
            return parseFloat(f.size);
        });
    }

    function getHops () {
        return _.map($scope.hopsarr, function (h) {
            var hop = JSON.parse(h.hop || '{}');

            return _.extend(hop, {
                alpha: parseFloat(hop.alpha)
            });
        });
    }

    function getHopsSizes () {
        return _.map($scope.hopsarr, function (h) {
            return parseFloat(h.size);
        });
    }

    function getHopsTimes () {
        return _.map($scope.hopsarr, function (h) {
            return parseFloat(h.time);
        });
    }

    $scope.$watch('result', function (result) {
        if (result) {
            $scope.srm = result.srm;
            $scope.og = result.og;
            $scope.fg = result.fg;
            $scope.abv = result.abv;
            $scope.ibu = result.ibu;
        }
    });
}]);
