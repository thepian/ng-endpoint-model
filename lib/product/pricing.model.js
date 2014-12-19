'use strict';

var restModel = require('./restModel');

var defaults = {
    url: 'test/mock/pricing.json',
    //url: 'test/mock/pricing.json/:customerNumber',
    defaultParams: {
        customerNumber: '123'
    }
};

module.exports = restModel(PricingModel, defaults);

// @ngInject
function PricingModel(NevisContext) {

    return {
        getBundlePrice: getBundlePrice,
        params: {
            customerNumber: NevisContext.sessionScn
        }
    };
}

function getBundlePrice(bundle) {
    if (bundle && bundle.siebelProductInfo && bundle.siebelProductInfo.siebelProductPrice != null) {
        return bundle.siebelProductInfo.siebelProductPrice;
    }
    // jshint -W040
    // validthis
    if (bundle.id in this.results) {
        return this.results[bundle.id];
    }
    return bundle ? 99 : 0;
}