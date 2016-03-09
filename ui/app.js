(function (angular) {
    'use strict';


    /**
     * Handles the constituent model.
     */
    function ConstituentCtrl(ConstituentService) {
        var vm;

        vm = this;
        vm.isReady = false;

        ConstituentService.getConstituent(280).then(function (data) {
            vm.isAuthenticated = (data.id);

            if (vm.isAuthenticated) {
                vm.constituent = data;
            }

            vm.isReady = true;
        });
    }


    /**
     * Handles authenticated requests to the constituent API.
     */
    function ConstituentService($http, $q) {
        return {
            getConstituent: function (id) {
                var deferred;

                deferred = $q.defer();

                $http
                    .get('/auth/authenticated')
                    .then(function (res) {
                        if (res.data.authenticated) {

                            console.log("Session is Authenticated. Attempting to find constituent with ID: ", id);

                            $http
                                .get('/api/constituents/' + id)
                                .then(function (res) {
                                    console.log("Constituent API response: ", res.data);
                                    deferred.resolve(res.data);
                                });
                        } else {
                            deferred.resolve(res.data);
                        }
                    });

                return deferred.promise;
            }
        };
    }


    // Dependencies.
    ConstituentCtrl.$inject = [
        'ConstituentService'
    ];
    ConstituentService.$inject = [
        '$http',
        '$q'
    ];


    // Initialize the app.
    angular.module('AuthCodeFlowTutorial', [])
        .controller('ConstituentCtrl', ConstituentCtrl)
        .service('ConstituentService', ConstituentService);

})(window.angular);