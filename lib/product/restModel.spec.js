'use strict';

var mock = require('ng-mocks');

require('../../../testUtils');

var dummyModule = require('ng').module('testOn', [require('ng-resource').name]);

describe('Blank Rest Model', function () {

    var $httpBackend, $injector, createModel, catalogRequestHandler;

    var restModel = require('../../../../src/modules/trioApp/product/restModel'),
        URL = 'bundle.json',
        PARAMS = {},
        DEFAULTS = {},
        aGroups = [{
            id: "a"
        }],
        document;

    beforeEach(mock.module('testOn'));
    beforeEach(mock.inject(function (_$injector_) {
        $injector = _$injector_;
        $httpBackend = $injector.get('$httpBackend');
    }));

    it("should have defaults on provider", function () {

        var ModelProvider = restModel(function () {
            return {};
        }, {
            params: PARAMS,
            defaultParams: DEFAULTS,
            url: URL
        });

        var provider = new ModelProvider();
        expect(provider).toBeDefined();
        expect(provider.url).toBe(URL);
        expect(provider.params).toBe(PARAMS);
        expect(provider.defaultParams).toBe(DEFAULTS);

    });

    it("should return data on success", function () {
        //$httpBackend.expectGet(URL);
        $httpBackend.expectGET(URL).respond(200, {
            bestseller: "a",
            bundleGroups: aGroups
        });

        var ModelProvider = restModel(function () {
            return {};
        }, {url: URL});

        var provider = new ModelProvider();
        expect(provider).toBeDefined();

        var promise = $injector.invoke(provider.resolve);
        expect(promise).toBeDefined();
        expect(promise.$$resolved).toBeDefined();
        expect(promise.$$state).toBeDefined();

        expect(promise.$$resolved).toBe(false); // promise still outstanding

        $httpBackend.flush();

        expect(promise.$$resolved.success).toBe(true); // promise not outstanding
        expect(promise.$$resolved.value.bestseller).toBe("a");
        expect(promise.$$resolved.value.bundleGroups).toEqual(aGroups);

        // call promise again, must be the same
        var promise2 = $injector.invoke(provider.resolve);
        expect(promise2).toBeDefined();
        expect(promise2.$$resolved).toBeDefined();
        expect(promise2.$$state).toBeDefined();
        expect(promise2).toBe(promise);

    });

});