var _ = require('lodash');
var express = require('express');
var hbs = require('hbs');

var fermentables = require('./data/fermentables.json');
var hops = require('./data/hops.json');
var yeasts = require('./data/yeasts.json');
var styles = require('./data/styles.json');

var app = express();

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use('/src', express.static(__dirname + '/src'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/views/templates', express.static(__dirname + '/views/templates'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/trewbrews-calc-public', express.static(__dirname + '/trewbrews-calc-public'));

app.get('/', function (req, res) {
    res.render('main.hbs', {
    });
});

app.get('/data', function (req, res) {
    res.json({
        fermentables: _.sortBy(_.map(fermentables, function (fermentable) {
            return {
                name: fermentable.name,
                data: JSON.stringify(fermentable)
            };
        }), function (fermentable) {
            return fermentable.name;
        }),
        hops: _.chain(hops).
            filter(function (hop) {
                return hop.alpha;
            }).
            map(function (hop) {
                return {
                    name: hop.name,
                    data: JSON.stringify(hop)
                };
            }).
            sortBy(function (hops) {
                return hops.name;
            }).
            value(),
        yeasts: _.chain(yeasts).
            map(function (yeast) {
                return {
                    name: yeast.name,
                    data: JSON.stringify(yeast)
                };
            }).
            sortBy(function (yeast) {
                return yeast.name;
            }).
            value(),
        styles: _.chain(styles).
            filter(function (style) {
                return _.all(style, function (value) {
                    return value !== 'Variable';
                });
            }).
            map(function (style) {
                return {
                    name: style.name,
                    data: JSON.stringify(style)
                };
            }).
            sortBy(function (style) {
                return style.name;
            }).
            value()
    });
});

app.listen(process.env.PORT || 31314);

console.log('Server started');
