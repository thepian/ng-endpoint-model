'use strict';

module.exports = require('ng').module('product', []);

module.exports.provider('CatalogModel', require('./catalog.model'));
module.exports.provider('PricingModel', require('./pricing.model'));
module.exports.provider('AvailabilityModel', require('./availability.model'));

module.exports.filter('productPrice', ['$filter', function ($filter) {
    return function (inputPrice) {
        if (inputPrice == null) {
            return " ";
        }

        var reg = new RegExp('\\.');
        if (!reg.test(inputPrice)) {
            return inputPrice + '.-';
        }
        else {
            return $filter('number')(inputPrice, 2);
        }
    };
}]);

module.exports.filter('speedMbit', ['$filter', function ($filter) {
    return function (inputSpeed) {
        if (inputSpeed == null) {
            return " ";
        }

        if (typeof inputSpeed === "string") {
            inputSpeed = parseFloat(inputSpeed);
        }

        if (inputSpeed >= 1000000) {
            var gbits = inputSpeed / 1000000;

            return $filter('number')(gbits, 0) + ' Gbit/s';
        }

        var mbits = inputSpeed / 1000;

        return $filter('number')(mbits, 0) + ' Mbit/s';
    };
}]);
