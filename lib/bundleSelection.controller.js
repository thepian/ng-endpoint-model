'use strict';

// @ngInject
function BundleSelectionController(catalog, pricing, availability, $scope) {
    var vm = this;
    this.bestseller = catalog.bestseller;
    this.bundleGroups = catalog.bundleGroups;
    this.select = select;

    this.bundleGroups.forEach(function (bundle) {
        if (typeof bundle.price === "undefined") {
            Object.defineProperty(bundle, "price", {
                get: function () {
                    return pricing.$model.getBundlePrice(this);
                }
            });
        }

        if (typeof bundle.price === "undefined") {
            Object.defineProperty(bundle, "available", {
                get: function () {
                    return availability.$model.isBundleAvailable(this);
                }
            });
        }

        if (typeof bundle.selected === "undefined") {
            Object.defineProperty(bundle, "selected", {
                get: function () {
                    return this.id === catalog.selected;
                }
            });
        }
    });

    select(catalog.bestseller || catalog.bundleGroups[0].id);

    function select(bundle) {
        if (typeof bundle === "string") {
            bundle = catalog.bundleGroups.reduce(function (prev, res) {
                return prev || (res.id === bundle ? res : null);
            }, null);
        }

        catalog.selected = bundle.id;
        vm.selectedBundle = bundle; // for the bundle detail rendering

        $scope.$emit('bundleSelect', bundle);
    }
}

module.exports = BundleSelectionController;