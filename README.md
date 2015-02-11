
# HTTP endpoint model for Angular JS

This is a simple way to access JSON served at a URL and present it as a model for your Angular app.

Use cases covered:

* Served JSON is tweaked in the client transparently
* JSON that must be fetched before a ui-router/ng-route route.
* A resource is fetched and remembered based on parameters.
* The endpoint URL is configured (with module.config) in your app.
* Mixin your own methods

## Setting up your model

    angular.module('app').provider('PricingModel',['$restModel',function($restModel) {
        return $restModel({ 
        	revise : revisePricing
        },{
        	url: 'services/pricing',
        	performInitialRequest: true
        });
    });

This sets up a model that only needs to be fetched once as it doesn't depend on anything.

The revise function is used to make adjustments to the results from the server.

    function revisePricing(pricing) {
    	pricing.prices.forEach(function(price) {
    		price.local = formatLocalPrice(price.amount);
    	});
    }

## Configuring the model URL

    angular.module('app').config(function(PricingModelProvider) {
    	PricingModelProvider.url = 'backend/pricing';
    });

Since models are registered using a provider it can be accessed during the config phase.

## Depending on your model in *Router*

    function RouteProvider($stateProvider, PricingModelProvider) {
        
        $stateProvider.state('main', {
            resolve: { pricingModel: PricingModelProvider.resolve },
            url: '/',
            controller: MainController,
            controllerAs: main	
        });
    }

    function MainController(pricingModel) {

    }

In this case `pricingModel` will be the revised results fetched from the server, as it
is the outcome of the resolve call. `PricingModel` would inject the model not the result.

## Fetching a model based on variable parameter

    angular.module('app').provider('InventoryModel',['$restModel',function($restModel) {
        return $restModel({ 
        	revise : reviseInventory
        },{
        	url: 'services/inventory/:location',
        	defaultParams: {
        		location: 'central'
        	},
        	performInitialRequest: false
        });
    });

This will set up an InventoryModel that depends on location. It will not fetch anything by
default, and if no parameter is giving when calling `get()` the inventory of the central
location is returned.

    function your_function(InventoryModel) {
        InventoryModel.get({ location:'milano' }).then(function(inventory) {
    	    // use the milano inventory.
        });
    }

To use previously fetched inventory results

    function your_function(InventoryModel) {
    	if (InventoryModel.results) {
    		// use the inventory in `results`
    	}
    }

## Adding your own methods

    angular.module('app').provider('InventoryModel',['$restModel',function($restModel) {
        return $restModel({ 
        	revise : reviseInventory,
        	check: checkInventory,
        	reserve: reserveInventory
        },{
        	url: 'services/inventory/:location',
        	defaultParams: {
        		location: 'central'
        	},
        	performInitialRequest: false
        });
    });

To use reserve inventory with your method

    function your_function(InventoryModel) {

    	// reserve 1000 of prod-12
    	InventoryModel.reserve('prod-12',1000);
    }

