//CONTROLLERS

angular.module('wowApp')

.controller('homeCtrl', function () {
    
})


.controller('characterSearchCtrl', function ($scope, $location, sharedProperties, characterService, realmService) {
    

    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();
    
    $scope.selectedRealm = characterService.selectedRealm;
    
    // Populate the Realms drop down
    realmService.getRealms(function(response){
        console.log(response.data);
        $scope.realmsResult = response.data;
    }, function(err) {
        console.log(err.status);

    });
//    $scope.realmsResult = realmService.GetRealms(this.region, this.keyValue);
    
    
    
    console.log(characterService.name);
    
    $scope.$watch('name', function () {
        characterService.name = $scope.name;
    })
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    })
    
    
    $scope.submit = function() {
        $location.path("/characterResult");
    }
    
})



.controller('realmCtrl', function ($scope, sharedProperties, realmService) {
    
    $scope.keyValue = sharedProperties.getPrivateKey();
    $scope.region = sharedProperties.getRegion();
//    $scope.realmsResult = realmService.GetRealms($scope.region, $scope.keyValue);
    realmService.getRealms(function(response){
        console.log(response.data);
        $scope.realmsResult = response.data;
    }, function(err) {
        console.log(err.status);

    });
    
    $scope.sortType = 'name';
    $scope.sortReverse = false;
    $scope.searchRealms = '';
    
    $scope.sliceCountryFromTimezone = function(timezone) {
        var idx = timezone.indexOf("/");
        return timezone.slice(idx + 1).replace(/_/g," ");
    }
//    console.log(window.sessionStorage);
//    
//    if (typeof(window.Storage))  {
//        console.log('storage available.');
//        if (sessionStorage.realms) {
//            console.log('realms is already created');
//            $scope.realmsResult = sessionStorage.realms;
//            console.log(sessionStorage.realms);
//
//        } else {
//            console.log('realms is not created.');
//            $scope.realmsResult = realmService.GetRealms($scope.region, $scope.privateKey);
//            sessionStorage.setItem('realms', $scope.realmsResult);
//            console.log(sessionStorage['realms']);
//        }
//    } else {
//        console.log('Sorry, no storage is available.');
//        $scope.realmsResult = realmService.GetRealms($scope.region, $scope.privateKey);
//    }
    

})

.controller('characterCtrl', function ($scope, $resource, $location, $http, sharedProperties, characterService, realmService) {
    
    var self = this;

    self.feed = [];
    self.filteredFeed = [];
    var items = [];
    var count = 0;
    var idx = 0;

    $scope.searchFeed = '';
    $scope.sortType = 'name';
    $scope.sortReverse = false;
    $scope.showFeed = true;

    $scope.$watch('showFeed', function() {
        $scope.buttonText = $scope.showFeed ? 'Hide' : 'Show';
    })


    // characterService.getCharacter(function(response){
    //     console.log(response.data);
    //     $scope.characterResult = response.data;
    // }, function(err) {
    //     console.log(err.status);
    //
    // });

    function test (response) {
        console.log(idx);


        console.log(response);
        // console.log(idx);
        var feedElement = {};
        feedElement['type'] = 'LOOT';
        console.log(response.data);
        feedElement['name'] = response.data.name;
        feedElement['icon'] = response.data.icon;
        console.log(feedElement);
        // self.feed.unshift(feedElement);
        // console.log(idx);
        self.feed.splice(idx, 0, feedElement);

    }

    characterService.getCharacterFeed(function(response){
        // console.log(response.data);
        $scope.characterResult = response.data;
        // self.feed = angular.toJson(response.data.feed);
        // self.feed = response.data.feed;
         console.log(response.data.feed);



        for (var x = 0; x <= response.data.feed.length - 1; x++) {
            var feedElement = {};
            // console.log(response.data.feed[x]);
            // feedElement['type'] = response.data.feed[x].type;
            // console.log(feedElement);

            if (response.data.feed[x].type === 'LOOT') {
                var itemElement = {};
                // var type = response.data.feed[x].type;

                console.log('in loot');

                console.log(response.data.feed[x]);
                // do something
                // idx = x;
                // characterService.getItem(response.data.feed[x].itemId, test, function (err) {
                //     console.log(err.status);
                // });

                itemElement['index'] = x;
                itemElement['type'] = response.data.feed[x].type;
                itemElement['timestamp'] = response.data.feed[x].timestamp;
                items.push(itemElement);
                count++;

                console.log(items);
                characterService.getItem(response.data.feed[x].itemId, function (response) {
                    feedElement = {};
                    feedElement['type'] = items[idx].type;
                    feedElement['timestamp'] = items[idx].timestamp;

                    // var feedElement = {};
                    // feedElement['type'] = type;
                    console.log(response.data);
                    feedElement['name'] = response.data.name;
                    feedElement['icon'] = response.data.icon;

                    // feedElement['timestamp'] = response.data.
                    console.log(feedElement);
                    // self.feed.unshift(feedElement);
                    console.log(items[idx].index);
                    self.feed.splice(items[idx].index, 0, feedElement);
                    idx++;
                }, function (err) {
                    console.log(err.status);
                });

            } else if (response.data.feed[x].type === 'BOSSKILL') {
                // console.log('in boss');
                feedElement['timestamp'] = response.data.feed[x].timestamp;
                feedElement['type'] = response.data.feed[x].type;
                // do something else
                feedElement['name'] = response.data.feed[x].name;
                self.feed.push(feedElement);

                // console.log(feedElement);
            } else if (response.data.feed[x].type === 'ACHIEVEMENT') {
                // console.log('in achievement');
                // console.log(feedElement);
                feedElement['timestamp'] = response.data.feed[x].timestamp;
                feedElement['type'] = response.data.feed[x].type;
                // console.log(response.data.feed[x].type);
                // console.log(feedElement);
                feedElement['title'] = response.data.feed[x].achievement.title;

                // console.log(feedElement);
                feedElement['description'] = response.data.feed[x].achievement.description;

                // console.log(feedElement);
                feedElement['icon'] = response.data.feed[x].achievement.icon;
                // console.log(feedElement);
                self.feed.push(feedElement);
            }
            // Outside if/else so add to array.
            console.log(feedElement);
            // self.feed.push(feedElement);

        }
        // console.log(self.feed);
        $scope.list = self.feed;
        console.log($scope.list);
    }, function(err) {
        console.log(err.status);

    });


    // characterService.getItem(itemId, function (response) {
    //     console.log(response.data);
    // }, function (err) {
    //     console.log(err.status);
    // });


    // var retrieveItem = characterService.getItem(itemId, function (response) {
    //     console.log(response.data);
    // }, function (err) {
    //     console.log(err.status);
    // });
    // characterService.getAchievements(function(response){
    //     console.log(response.data);
    //     var achievements = response.data.achievements.achievementsCompleted;
    //
    //     achievements.forEach(function(entry) {
    //         self.ach.unshift(entry);
    //     })
    //     console.log(self.ach);
    //     self.ach = self.ach.slice(self.ach.length - 10);
    //     // Call the Achievements API
    //     for (var x = 0; x <= self.ach.length - 1; x++) {
    //         console.log(self.ach.length);
    //
    //         characterService.getAchievementDetails(self.ach[x], function(response){
    //             console.log(response.data);
    //             $scope.achDetails.unshift(response.data.title);
    //
    //             $scope.achDetails.forEach(function(entry) {
    //                 console.log(entry);
    //             })
    //         }, function(err) {
    //             console.log(err.status);
    //
    //         });
    //
    //     }
    // }, function(err) {
    //     console.log(err.status);
    //
    // });


    

    $scope.name = characterService.name;
    $scope.selectedRealm = characterService.selectedRealm;
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    })
    
    
    $scope.classMap = function(idx) {
        return sharedProperties.getClass(idx);
    }
    
    $scope.raceMap = function(idx) {
        return sharedProperties.getRace(idx);
    }
    $scope.factionMap = function(idx) {
        return sharedProperties.getFaction(idx);
    }
    $scope.genderMap = function(idx) {
        return sharedProperties.getGender(idx);
    }

    $scope.$watch('name', function () {
        characterService.name = $scope.name;
    })
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    })
    
    // $scope.submit = function() {
    //     $location.path("/characterResult");
    //     console.log($scope.selectedRealm);
    //     console.log($scope.name);
    // }

    
    $scope.convertToStandard = function(lastModified) {
      return new Date(lastModified).toUTCString();
    };
});