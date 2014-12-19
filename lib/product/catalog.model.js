'use strict';

var restModel = require('./restModel');

var defaults = {
    url: 'test/mock/bundles.json'
};

module.exports = restModel(CatalogModel, defaults);

// @ngInject
function CatalogModel() {

    return {
        revise: reviseResults
    };

    function reviseResults(results) {
        var firstGroup = results.bundleGroups[0];

        results.selected = results.bestseller || (firstGroup ? firstGroup.name : null);

        results.bundleGroups.forEach(function (bundle) {
            bundle.bestseller = (bundle.id === results.bestseller);

            bundle.descriptions.forEach(function (description) {
                description.params = require('ng').extend({

                    "nameKey": bundle.nameKey,
                    "sellFrom": bundle.sellFrom,
                    "sellTo": bundle.sellTo,
                    "intensitySymbol": bundle.intensitySymbol,
                    "marketingDownSpeed": bundle.marketingDownSpeed,
                    "marketingUpSpeed": bundle.marketingUpSpeed

                }, description.params);
            });
        });
    }
}
