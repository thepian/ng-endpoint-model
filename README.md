
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

## Configuring the model URL

    angular.module('app').config(function(PricingModelProvider) {
    	PricingModelProvider.url = 'backend/pricing';
    });

## Depending on your model in Router

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
