'use strict';

var restModel = require('./restModel');

var defaults = {
    url: 'test/mock/:lineNumber/availability.json',
    defaultParams: {
        lineNumber: '123'
    }
};

module.exports = restModel(AvailabilityModel, defaults);

// @ngInject
function AvailabilityModel(NevisContext) {

    return {
        isBundleAvailable: isBundleAvailable,
        params: {lineNumber: NevisContext.sessionScn}
    };
}

function isBundleAvailable(bundle) {
    if (bundle && bundle.siebelProductInfo) {
        return bundle.siebelProductInfo.availability === 'available';
    }
    return true;
}