'use strict';


angular.module('trioApp', [
    'ui-router',
    'ng-translate',
    'main',
    'wizard'
])
    .config(require('./trioApp.routes'))
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'resources/translation/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('de');
    }])
    .factory('LanguageResource', ['$resource', function ($resource) {
        return $resource('services/auth/language', {}, {
            setLanguage: {
                method: 'POST'
            }
        });
    }])
    .config(['HeaderFooterProvider', 'LinksProvider', 'CatalogModelProvider', function (HeaderFooterProvider, LinksProvider, CatalogModelProvider) {

        var MODES = {
            ORDER: "active",
            HOME: "hidden"
        };
        var tabLinks = {
            'NEXT_CUSTOMER': {type: 'eorders', tail: 'nextCustomer.do'},
            'ORDERS_OVERVIEW': {type: 'eorders', tail: 'startCase.do'},
            'MUTATION': {type: 'eorders', tail: 'menuServices.do'},
            'ORDER': {type: 'hash', route: 'order'},
            'CUSTOMER': {type: 'eorders', tail: 'customerOverview.do'},
            'SERVICE_ADVISER': {type: 'eorders', tail: 'adviser.do'}, //TODO map navigates internally (where should we link) ng-click="openQualifyOrderResCatalog()
            'HOME': {type: 'eorders', tail: 'home.do'}
        };

        HeaderFooterProvider.tabMode = function (name) {
            return MODES[name] || "inactive";
        };
        HeaderFooterProvider.tabLink = function (name) {
            return tabLinks[name];
        };

        LinksProvider.registerType("hash", {
            template: '#/{{ route }}'
        });

        LinksProvider.registerType("eorders", {
            template: "/eorders/{{ context.sessionContext }}/ursa/{{ tail }}?lang={{ context.language }}"
        });

        CatalogModelProvider.url = "services/catalog/:which";
        CatalogModelProvider.defaultParams = {
            which: "test2"
        };

    }])

    .factory('LogoutResourceHandler', ['$window', 'NevisContext', function ($window, NevisContext) {
        return {
            handleLogoutUrsa: function () {
                $window.location.href = '/eorders/' + NevisContext.sessionContext + '/misc/logoutPartner.do';
            }
        };
    }])

    .factory('LogoutService', ['$resource', 'LogoutResourceHandler', function ($resource, LogoutResourceHandler) {
        var logoutResource = $resource('services/public/logout', {}, {
            logout: {
                method: 'POST'
            }
        });
        return {
            logoutUrsa: function () {
                logoutResource.logout({}, LogoutResourceHandler.handleLogoutUrsa, LogoutResourceHandler.handleLogoutUrsa);
            }
        };
    }])

    .run(['HeaderFooter', 'Links', 'LanguageResource', 'LogoutService', 'NevisContext', '$state', function (HeaderFooter, Links, LanguageResource, LogoutService, NevisContext, $state) {
        HeaderFooter.languageChanged = LanguageResource.setLanguage;
        HeaderFooter.logoutUrsa = LogoutService.logoutUrsa;
        HeaderFooter.info = NevisContext;

        Links.registerType("router", {
            fire: function (desc) {
                $state.go(desc.route);
            }
        });
    }]);



