'use strict';

// @ngInject
function RouteProvider($httpProvider, $urlRouterProvider, $stateProvider, CatalogModelProvider, PricingModelProvider, AvailabilityModelProvider) {

    var initUserContext = function (UserContextInitService) {
        console.log("-initUserContext");
        return UserContextInitService.initUserContext();
    };

    // FUTURE_WORK mock pricing and availability (remove it when backend has rest endpoint)
    PricingModelProvider.mock({
        "Paco": 0,
        "TwixM": 49,
        "TwixXS": 29,
        "TwixXL": 399
    });
    AvailabilityModelProvider.mock({});


    $httpProvider.defaults.withCredentials = true;

    $stateProvider
        .state('main', {
            resolve: {
                initUserContext: initUserContext
            },
            url: '/main',
            templateUrl: require('./main/main.tpl.html').name,
            controller: require('./main/main.controller')
        })

        .state('callCustomerCenter', {
            url: '/callCustomerCenter',
            templateUrl: require('./callCustomerCenter/callCustomerCenter.tpl.html').name,
            controller: require('./callCustomerCenter/callCustomerCenter.controller')
        })

        .state('order', {
            //FIXME resolve here as well so this can also work as starting point, should support multiple calls to initUserContext
            resolve: {
                initUserContext: initUserContext
            },
            url: '/order',
            wizardSteps: ['generalInformation', 'bundleSelection', 'configuration', 'billing', 'summary', 'confirmed'],
            abstract: true,
            templateUrl: require('./order/order.tpl.html').name,
            controller: require('./order/order.controller')
        })

        // url will be nested (/offer/generalInformation)
        .state('order.generalInformation', {
            url: '/generalInformation',
            title: 'ORDER.GENERAL',
            templateUrl: require('./order/generalInformation/generalInformation.tpl.html').name,
            controller: require('./order/generalInformation/generalInformation.controller')
        })

        // url will be nested (/offer/bundleSelection)
        .state('order.bundleSelection', {
            resolve: {
                catalog: CatalogModelProvider.resolve,
                pricing: PricingModelProvider.resolve,
                availability: AvailabilityModelProvider.resolve
                // experiment needed: availability: AvailabilityModelProvider('initial ').resolve
            },
            url: '/bundleSelection',
            title: 'ORDER.SELECTION',
            templateUrl: require('./order/bundleSelection/bundleSelection.tpl.html').name,
            controller: require('./order/bundleSelection/bundleSelection.controller'),
            controllerAs: 'bundles'
        })

        // url will be nested (/offer/configuration)
        .state('order.configuration', {
            url: '/configuration',
            title: 'ORDER.CONFIGURATION',
            templateUrl: require('./order/configuration/configuration.tpl.html').name,
            controller: require('./order/configuration/configuration.controller'),
            controllerAs: 'configuration'
        })

        // url will be nested (/offer/billing)
        .state('order.billing', {
            url: '/billing',
            title: 'ORDER.BILLING',
            templateUrl: require('./order/billing/billing.tpl.html').name,
            controller: require('./order/billing/billing.controller'),
            controllerAs: 'billing'
        })

        // url will be nested (/offer/summary)
        .state('order.summary', {
            url: '/summary',
            title: 'ORDER.SUMMARY',
            templateUrl: require('./order/summary/summary.tpl.html').name,
            controller: require('./order/summary/summary.controller'),
            controllerAs: 'summary'
        })

        // url will be nested (/offer/confirmed)
        .state('order.confirmed', {
            url: '/confirmed',
            title: 'ORDER.CONFIRMED',
            confirmation: true,
            templateUrl: require('./order/confirmed/confirmed.tpl.html').name,
            controller: require('./order/confirmed/confirmed.controller'),
            controllerAs: 'confirmed'
        });

    // catch all route
    // send users to the form page
    $urlRouterProvider
        .when('/order', '/order/generalInformation')
        .when('/callCustomerCenter', '/callCustomerCenter')
        .otherwise('/main');
}

module.exports = RouteProvider;