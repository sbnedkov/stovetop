var calculator = require('../trewbrews-calc/src/calculator');
var gravity = require('../trewbrews-calc/src/gravity');

angular.module('stovetop').service('TrewbrewsCalculator', function () {
    return function () {
        return {
            calculate: (input, cb) => {
                calculator.calculate(JSON.stringify(input), cb);
            },
            gravityToAbv: (g) => {
                return gravity.calculateAbv(g);
            }
        };
    };
});
