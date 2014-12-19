'use strict';
/**
 * Make a provider from a model function and defaults object for a REST endpoint.
 *
 *     angular.module("a")
 *         .provider('MyModel',restModel(MyModel,MyDefaults));
 *
 * To trigger the fetch of the model inject the model and call download
 *
 *     function myResolve(MyModel) {
 *         MyModel.download();
 *     }
 *
 * To resolve a rest endpoint before a route controller is invoked;
 *
 *     resolve: {
 *         myData: MyModelProvider.resolve
 *     }
 *
 *     controller: function(myData) {
 *     }
 *
 * @param modelFn Function that returns a model object. Supports dependency injection
 * @param defaults Default parameters {url,params,values} that can be overridden in .config phase
 * @returns {Provider}
 */
function restModel(modelFn, defaults) {

    function Provider() {
        var provider = this;

        this.promise = null;
        this.model = null;

        // provide the model
        this.$get = ['$resource', '$injector', function ($resource, $injector) {
            provider._ensure($resource, $injector);
            return provider.model;
        }];

        // resolve will return a deferred for the data to-be-fetched
        this.resolve = ['$resource', '$injector', function ($resource, $injector) {
            provider._ensure($resource, $injector);
            return provider.promise;
        }];
    }

    Provider.prototype.method = defaults.method || "GET";
    Provider.prototype.isArray = defaults.isArray === undefined ? false : defaults.isArray;
    Provider.prototype.url = defaults.url;
    Provider.prototype.params = defaults.params || {};
    Provider.prototype.defaultParams = defaults.defaultParams || {};

    Provider.prototype.onsuccess = function (data) {
        this.model.results = this.model.revise(data) || data;
        this.model.results.$model = this.model;
        return this.model.results;
    };

    Provider.prototype._ensure = function ($resource, $injector) {
        var provider = this;

        function onsuccess(data) {
            return provider.onsuccess(data);
        }

        function onerror(/*msg , code*/) {
            return provider.onerror.apply(provider, arguments);
        }

        var options = {
            method: this.method,
            isArray: this.isArray,
            params: this.params
        };

        if (this.promise == null) {
            this._invoke($injector);

            this.resource = $resource(this.url, this.defaultParams, {get: options});
            if (this.onerror) {
                this.promise = this.resource.get(onsuccess, onerror).$promise;
            } else {
                this.promise = this.resource.get(onsuccess).$promise;
            }
        }

        return this;
    };

    Provider.prototype._invoke = function ($injector) {
        this.model = $injector.invoke(modelFn);
        this.model.revise = this.model.revise || noOp;

        // Nil when download called as it will already be downloading
        this.model.download = noOp;
    };

    // allows forcing mock data for testing, and filling in missing backend support during development
    Provider.prototype.mock = function (mockResult) {
        var provider = this;

        this.resolve = ['$injector', '$q', '$timeout', function ($injector, $q, $timeout) {
            if (provider.promise == null) {

                provider._invoke($injector);

                var deferred = $q.defer();
                provider.promise = deferred.promise;

                $timeout(function () {
                    deferred.resolve(provider.onsuccess(mockResult));
                }, 0);
            }

            return provider.promise;
        }];

        this.$get = ['$injector', function ($injector) {
            $injector.invoke(provider.resolve);
            return provider.model;
        }];

    };

    return Provider;
}

function noOp() {

}

module.exports = restModel;