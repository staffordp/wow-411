//CONTROLLERS

angular.module('wowApp')

.controller('homeCtrl', function () {
    
})


.controller('characterSearchCtrl', function ($scope, $location, sharedProperties, characterService, characterItemService, realmService, raceService, classService, bossService, zoneService) {
    

    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();

    // Build our sharedProperties information before the search.

    // Check for raceMap
    if (sharedProperties.getRaceStatus()) {
        console.log('they are defined');
    } else {
        // console.log('they are not defined');
        raceService.getRaces(function(response){
            // console.log(response.data)
            sharedProperties.setRaces(response.data.races);
            // console.log(sharedProperties.getRaceStatus());
        }, function(err) {
            console.log(err.status);
        });
    }

    // Check for classMap
    if (sharedProperties.getClassStatus()) {
        console.log('they are defined');
    } else {
        // console.log('they are not defined');
        classService.getClasses(function(response){
            // console.log(response.data);
            sharedProperties.setClasses(response.data.classes);
            // console.log(sharedProperties.getClassStatus());
        }, function(err) {
            console.log(err.status);
        });
    }

    if (sharedProperties.getBossStatus()) {
        console.log('they are defined');
    } else {
        // console.log('they are not defined');
        bossService.getBosses(function(response){
            // console.log(response.data);
            sharedProperties.setBosses(response.data.bosses);
            // console.log(sharedProperties.getBossStatus());
        }, function(err) {
            console.log(err.status);
        });
    }

    if (sharedProperties.getZoneStatus()) {
        console.log('zones are defined');
    } else {
        // console.log('zones are not defined');
        zoneService.getZones(function(response){
            // console.log(response.data);
            sharedProperties.setZones(response.data.zones);
            // console.log(sharedProperties.getZoneStatus());
        }, function(err) {
            console.log(err.status);
        });
    }



    $scope.selectedRealm = characterService.selectedRealm;
    
    // Populate the Realms drop down
    realmService.getRealms(function(response){
        // console.log(response.data);
        $scope.realmsResult = response.data;
    }, function(err) {
        console.log(err.status);

    });
//    $scope.realmsResult = realmService.GetRealms(this.region, this.keyValue);


    $scope.$watch('name', function () {
        characterService.name = $scope.name;
        characterItemService.name = $scope.name;
    });
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
        characterItemService.selectedRealm = $scope.selectedRealm;
    });
    
    
    $scope.submit = function() {
        $location.path("/characterResult");
    };
    
})


// This is the controller for the realms page
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
    };

})

.controller('characterCtrl', function ($scope, $resource, $location, $http, sharedProperties, characterService, characterItemService) {
    
    var self = this;

    self.feed = [];
    self.filteredFeed = [];
    self.inventorySlots = [];
    var items = [];
    var count = 0;
    var idx = 0;
    var item_idx = 0;
    self.inventoryArray = [];
    var race;
    var thumbnail;

    $scope.show = false;

    $scope.searchFeed = '';
    $scope.sortType = 'name';
    $scope.sortReverse = false;
    $scope.showFeed = true;

    $scope.showInfobox = false;

    // Set tooltips for feed and inventory areas.
    $(document).ready(function () {

        //Tooltip, activated by hover event
        $("#table-feed").tooltip({
            selector: "[data-toggle='tooltip']",
            container: "#table-feed",
            html: true
        });

        $("#summary-inventory").tooltip({
            selector: "[data-toggle='tooltip']",
            container: "#summary-inventory",
            html: true
        });


    });

    $scope.showinfo = function(feedItem, bool) {
        if(bool === true) {
            $scope.showInfobox = true;
            // $scope.personColour = {color: '#'+person.colour};
            // console.log(feedItem);
            console.log('mouse enter for');
        } else if (bool === false) {
            $scope.showInfobox = false;
            // $scope.personColour = {color: 'white'}; //or, whatever the original color is
            console.log(feedItem);
            console.log('mouse leave for');
        }
    };

    $scope.$watch('showFeed', function() {
        $scope.buttonText = $scope.showFeed ? 'Hide' : 'Show';
    });

    // Character Feed call
    characterService.getCharacterFeed(function(response){
        // console.log(response.data);

        $scope.characterResult = response.data;
        if (!race) {
            race = response.data.race;
        }
        thumbnail = response.data.thumbnail;
        // console.log(thumbnail);
        // console.log(race);
        // console.log(response.data);
        // self.feed = angular.toJson(response.data.feed);
        // self.feed = response.data.feed;
        //  console.log(response.data.feed);

        // console.log(thumbnail);
        $(".profile-wrapper").css("background", "url(http://render-api-us.worldofwarcraft.com/static-render/us/" + $scope.characterImage(thumbnail)+ ") no-repeat 182px 115px");

        // Set background image for profile based on race
        $(".content-top").css("background", "url(http://us.battle.net/wow/static/images/character/summary/backgrounds/race/" + race + ".jpg) left top no-repeat" );




        for (var x = 0; x <= response.data.feed.length - 1; x++) {
            var feedElement = {};
            // console.log(response.data.feed);
            // feedElement['type'] = response.data.feed[x].type;
            // console.log(feedElement);

            if (response.data.feed[x].type === 'LOOT') {
                var itemElement = {};

                itemElement['index'] = x;
                itemElement['type'] = response.data.feed[x].type;
                itemElement['timestamp'] = response.data.feed[x].timestamp;
                // console.log(itemElement);
                items.push(itemElement);
                count++;

                 // console.log(items);
                // console.log(response.data.feed[x]);
                // getItemDetails();
                characterService.getItem(response.data.feed[x].itemId, function (response) {
                    // console.log(response);
                    // console.log(itemElement['type']);
                    feedElement = {};
                    // Grabbing these two values from before since this new call might not have these keys
                    feedElement['type'] = itemElement['type'];
                    feedElement['timestamp'] = itemElement['timestamp'];
                    // feedElement['timestamp'] = items[idx].timestamp;
                    // console.log(response.data);
                    feedElement['name'] = response.data.name;
                    feedElement['icon'] = response.data.icon;
                    feedElement['armor'] = response.data.armor;
                    feedElement['bonusStats'] = response.data.bonusStats;
                    feedElement['buyPrice'] = response.data.buyPrice;
                    feedElement['requiredLevel'] = response.data.requiredLevel;
                    feedElement['socketInfo'] = response.data.socketInfo;
                    feedElement['upgradable'] = response.data.upgradable;
                    feedElement['itemLevel'] = response.data.itemLevel;
                    feedElement['itemBind'] = response.data.itemBind;
                    feedElement['itemClass'] = response.data.itemClass;
                    feedElement['maxDurability'] = response.data.maxDurability;
                    feedElement['sellPrice'] = response.data.sellPrice;
                    feedElement['quality'] = response.data.quality;
                    if (response.data.armor) {
                        feedElement['tooltip'] = "LOOT-YES";
                    } else {
                        feedElement['tooltip'] = "LOOT-NO";
                    }

                    // feedElement['tooltip'] = "LOOT";

                    // feedElement['timestamp'] = response.data.
                    // console.log(feedElement);
                    // console.log(feedElement.bonusStats[0].amount);
                    // self.feed.unshift(feedElement);
                    // console.log(items);
                    // console.log(idx);
                    // console.log(items[idx]);
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
                feedElement['icon'] = response.data.feed[x].achievement.icon;
                feedElement['title'] = response.data.feed[x].achievement.title;
                feedElement['quantity'] = response.data.feed[x].quantity;
                feedElement['id'] = response.data.feed[x].criteria.id;
                if (response.data.feed[x].name) {
                    feedElement['tooltip'] = "BOSS-YES";
                } else {
                    feedElement['tooltip'] = "BOSS-NO";
                }

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
                feedElement['tooltip'] = "ACHIEVEMENT";
                // console.log(feedElement);
                self.feed.push(feedElement);
            }
            // Outside if/else so add to array.
            // console.log(feedElement);
            // self.feed.push(feedElement);

        }
        // console.log(self.feed);
        $scope.list = self.feed;
        // console.log($scope.list);
    }, function(err) {
        console.log(err.status);

    });


    // This is the API call for the inventory Items.
    characterItemService.getItems(function(response){
        var itemElement = {};
        // console.log(response.data.items);
        // $scope.itemsResult = response.data.items;

        var slots = sharedProperties.getInventorySlots();

        for (var x=0; x < slots.length; x++) {
            // console.log('x is now '+ x.toString());
            // console.log(slots[x]);
            // console.log(response.data.items);

            // Map the items here before you push them.
            self.inventorySlots.push({
                name: slots[x],
                value: response.data.items[slots[x]],
                slot: sharedProperties.getInventorySlot(slots[x]),
                bonusStats: []
            });

            if (slots[x] in response.data.items) {
                console.log('key exists.');
                characterService.getItem(response.data.items[slots[x]].id, function (response) {

                    itemElement = {};
                    // itemElement['type'] = items[item_idx].type;
                    // itemElement['timestamp'] = items[item_idx].timestamp;
                    // console.log(response.data);
                    itemElement['name'] = response.data.name;
                    itemElement['icon'] = response.data.icon;
                    itemElement['armor'] = response.data.armor;
                    itemElement['bonusStats'] = response.data.bonusStats;
                    itemElement['buyPrice'] = response.data.buyPrice;
                    itemElement['requiredLevel'] = response.data.requiredLevel;
                    itemElement['socketInfo'] = response.data.socketInfo;
                    itemElement['upgradable'] = response.data.upgradable;
                    itemElement['itemLevel'] = response.data.itemLevel;
                    itemElement['itemBind'] = response.data.itemBind;
                    itemElement['itemClass'] = response.data.itemClass;
                    itemElement['maxDurability'] = response.data.maxDurability;
                    itemElement['sellPrice'] = response.data.sellPrice;
                    itemElement['quality'] = response.data.quality;

                    self.inventoryArray.push(itemElement);
                    // item_idx++;

                }, function (err) {
                    console.log(err.status);
                });
            } else {

                console.log('key does not exist. Moving on to next item.');

            }
        }
        // console.log('here');
        console.log(self.inventoryArray);
        console.log(self.inventorySlots);

        // Locate the item in the inventorySlots array by searching  for the response.data.name in value.name

        self.inventorySlots.forEach(function(element) {
            var item = element;
            console.log(element);
            console.log(self.inventoryArray.length);
            for (x = 0; x < self.inventoryArray.length; x++) {
                console.log('here');
                if (self.inventoryArray[x].name == item.name){
                    console.log('item is found.');
                    console.log(item);
                    console.log(element);

                } else {
                    console.log('match not found. continuing');
                }
            }
        });




        // Add additional fields to array


        // Need to map this with an internal values associating
        // console.log(self.inventorySlots);

        // This sorts the array by slot name (head, shoulders, finger, etc).
        $scope.inventory = self.inventorySlots.sort(function(a,b) {
            return a.slot - b.slot;
        });
        // console.log($scope.inventory);


        $scope.inventory = self.inventorySlots;

    }, function(err) {
        console.log(err.status);

    });


    $scope.name = characterService.name;
    $scope.selectedRealm = characterService.selectedRealm;
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    });
    
    
    $scope.classMap = function(idx) {
        return sharedProperties.getClass(idx);
    };
    $scope.bossMap = function(idx) {
        // console.log(sharedProperties.getRace(idx));
        var test = sharedProperties.getBoss(idx.name);
        if (test.name) {
            $scope.boss = sharedProperties.getBoss(idx.name);
        } else {
            idx.tooltip = "BOSS-NO";
        }

        // console.log($scope.boss);
    };

    $scope.zoneMap = function(zoneId) {
        // console.log(sharedProperties.getRace(idx));
        // console.log(zoneId);
        var zone = sharedProperties.getZone(zoneId);
        return zone;
    };
    
    $scope.raceMap = function(idx) {
        // console.log(sharedProperties.getRace(idx));
        return sharedProperties.getRace(idx);


    };
    $scope.factionMap = function(idx) {
        return sharedProperties.getFaction(idx);
    };
    $scope.genderMap = function(idx) {
        return sharedProperties.getGender(idx);
    };

    $scope.itemqualityMap = function(idx) {
        return sharedProperties.getItemQuality(idx);
    };

    $scope.itemupgradableMap = function(idx) {
        return sharedProperties.getItemUpgradable(idx);
    };

    $scope.itembindMap = function(idx) {
        return sharedProperties.getItemBind(idx);
    };

    $scope.bonusstatsParse = function(item) {
        // var totalString = "";
        return sharedProperties.getBonusstatsparse(item);
        // console.log(totalString);
        // return totalString;
        // return sharedProperties.getBonusstatsparse(idx);
    };

    $scope.characterImage = function(path) {
        // console.log(path);
        var imagePath = path.substr(0, path.indexOf('avatar.jpg'));
        // console.log(imagePath);
        imagePath += "profilemain.jpg";
        // console.log(imagePath);
        return imagePath;
    };



    $scope.convertGold = function(sellValue) {
        return sharedProperties.getGold(sellValue);
    };



    $scope.$watch('name', function () {
        characterService.name = $scope.name;
    });
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    });
    

    $scope.convertToStandard = function(lastModified) {
      return new Date(lastModified).toUTCString();
    };

    $scope.nameFromtitle = function(title) {
        console.log(title);
        console.log($scope.bossMap(title.substr(0, title.indexOf(' '))));
        var bossName = title.substr(0, title.indexOf(' ')).toLowerCase();
        console.log(bossName);
        console.log($scope.bossMap(bossName));
        return $scope.bossMap(bossName);
    };



});