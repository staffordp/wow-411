//SERVICES

angular.module('wowApp')

// Assigning the cachFactory to 'myCache'
.factory('myCache', function($cacheFactory) {
    return $cacheFactory('myCache');
})

.service('keys', function () {
    var self = this;

    self.region = "en_US";
    self.privateKey = "jnfn9kb9a7pwgu327xq4exbedxjnzyxr";

})

.service('characterFeed', function (keys, $rootScope, myCache, raceService, classService, bossService, zoneService, realmService) {
    // Private Variables



    var self = this;

    var racesDefined, classesDefined, bossesDefined, zonesDefined, realmsDefined = false;
    var raceMap, classMap, bossMap, zoneMap = [], inventoryMap, realmMap;

    var genderMap = ["Male", "Female"];

    var factionMap = ["Alliance", "Horde"];
    var itemQualityMap = ["poor", "common", "uncommon", "rare", "epic", "legendary", "artifact", "heirloom"];
    var itemUpgradableMap = ["Item is not upgradable", "Item is upgradable"];
    var itemBindMap =["Tradeable", "Binds when picked up"];
    var inventorySlots = ['back', 'chest', 'feet', 'finger1', 'finger2', 'hands', 'head', 'legs', 'mainHand', 'neck', 'offHand', 'shirt', 'shoulder', 'trinket1', 'trinket2', 'waist', 'wrist'];
    var itemStatMap = {
        '1' : '+%s Health',
        '2' : '+%s Mana',
        '3' : '+%s Agility',
        '4' : '+%s Strength',
        '5' : '+%s Intellect',
        '6' : '+%s Spirit',
        '7' : '+%s Stamina',
        '12' : 'Equip: Increases defense rating by %s.',
        '13' : 'Equip: Increases your dodge rating by %s.',
        '14' : 'Equip: Increases your parry rating by %s.',
        '15' : 'Equip: Increases your shield block rating by %s.',
        '16' : 'Equip: Improves melee hit rating by %s.',
        '17' : 'Equip: Improves ranged hit rating by %s.',
        '18' : 'Equip: Improves spell hit rating by %s.',
        '19' : 'Equip: Improves melee critical strike rating by %s.',
        '20' : 'Equip: Improves ranged critical strike rating by %s.',
        '21' : 'Equip: Improves spell critical strike rating by %s.',
        '22' : 'Equip: Improves melee hit avoidance rating by %s.',
        '23' : 'Equip: Improves ranged hit avoidance rating by %s.',
        '24' : 'Equip: Improves spell hit avoidance rating by %s.',
        '25' : 'Equip: Improves melee critical avoidance rating by %s.',
        '26' : 'Equip: Improves ranged critical avoidance rating by %s.',
        '27' : 'Equip: Improves spell critical avoidance rating by %s.',
        '28' : 'Equip: Improves melee haste rating by %s.',
        '29' : 'Equip: Improves ranged haste rating by %s.',
        '30' : 'Equip: Improves spell haste rating by %s.',
        '31' : 'Equip: Increases your hit rating by %s.',
        '32' : '+%s Critical Strike',
        '33' : 'Equip: Improves hit avoidance rating by %s.',
        '34' : 'Equip: Improves critical avoidance rating by %s.',
        '35' : 'Equip: Increases your resilience rating by %s.',
        '36' : '+%s Haste',
        '37' : 'Equip: Increases your expertise rating by %s.',
        '38' : 'Equip: Increases attack power by %s.',
        '39' : 'Equip: Increases ranged attack power by %s.',
        '40' : 'Equip: Increases attack power by %s in Cat, Bear, Dire Bear, and Moonkin forms only.',
        '41' : 'Equip: Increases damage done by magical spells and effects by up to %s.',
        '42' : 'Equip: Increases healing done by magical spells and effects by up to %s.',
        '43' : 'Equip: Restores %s mana per 5 sec.',
        '44' : 'Equip: Increases your armor penetration rating by %s.',
        '45' : 'Equip: Increases spell power by %s.',
        '46' : 'Equip: Restores %s health per 5 sec.',
        '47' : 'Equip: Increases spell penetration by %s.',
        '48' : 'Equip: Increases the block value of your shield by %s.',
        '49' : '+%s Mastery',
        '50' : "Equip: Increases your armor rating by %s.",
        '51' : "Equip: Increases your fire resistance by %s.",
        '52' : "Equip: Increases your frost resistance by %s.",
        '54' : "Equip: Increases your shadow resistance by %s.",
        '55' : "Equip: Increases your nature resistance by %s.",
        '56' : "Equip: Increases your arcane resistance by %s.",
        '57' : "Equip: Increases your pvp power by %s.",
        '60' : "Equip: Increase your readiness by %s.",
        '61' : "Equip: Increase your speed by %s.",
        "62" : "Equip: Increase your leech by %s.",
        "63" : "Equip: Increase your avoidence by %s.",
        "64" : "Equip: Increase your indestructible by %s",
        "65" : "Equip: Increase your WOD_5 by %s.",
        '59' : "Equip: Increase your multistrike by %s.",
        "71" : "Equip: Increase your strength, agility or intellect by %s.",
        "72" : "Equip: Increase your strength or agility by %s.",
        '73' : "Equip: Increase your agility or intellect by %s.",
        "74" : "+ %s Strength or Intellect"
    };
    var inventorySlotMap = {
        'head' : 0,
        'neck' : 1,
        'shoulder' : 2,
        'back' : 3,
        'chest': 4,
        'shirt' : 5,
        'tabard' : 6,
        'wrist' : 7,
        'hands' : 8,
        'waist' : 9,
        'legs' : 10,
        'feet' : 11,
        'finger1' : 12,
        'finger2' : 13,
        'trinket1' : 14,
        'trinket2' : 15,
        'mainHand' : 16,
        'offHand' : 17
    };

    var getCacheStatus = function (cache) {
        return myCache.get(cache);
    };

    var setCacheStatus = function (cache, items) {
        myCache.put(cache, items);
    };


    var initRealms = function() {
        if (getCacheStatus("realms")) {
            console.log('realms are defined');
            console.log(realmMap);
        } else {
            console.log('Realms are not defined');
            realmService.getRealms(function(response){
                console.log('Get Realms API Call.');
                // console.log(response.data);
                setCacheStatus("realms", response.data);
                // Store in local array
                realmMap = response.data;
                // Send broadcast to controller
                $rootScope.$broadcast('realms_update');
                console.log('just sent update');
                if (getCacheStatus("realms")) {
                    console.log('realms are now defined.');
                    console.log(realmMap);
                    // console.log(myCache.info());
                    console.log('realms are cached: ');
                    console.log(myCache.get("realms"));

                    // var cachedData = myCache.get('realms');
                }
                // $scope.realmsResult = response.data;
            }, function(err) {
                console.log(err.status);

            });
        }

    };
    // Public variables

        return {

            getCacheItems: function(cacheName) {
                return myCache.get(cacheName);
            },

            getInventorySlots: function() {
                return inventorySlots;
            },
            getRegion: function () {
                return self.region;
            },
            getPrivateKey: function() {
                return self.privateKey;
            },
            getBoss: function(idx) {
                // console.log(idx);
                for(var key in bossMap) {
                     // console.log(bossMap[key]);
                    if(bossMap[key].name === idx) {
                        // console.log(bossMap[key]);
                        return bossMap[key];
                    }
                }

                console.log('not found in bosses');
                return "";
            },
            getClass: function(idx) {
                for(var key in classMap) {
                    // console.log(raceMap.races[key].id);
                    if(classMap[key].id === idx) {
                        return classMap[key].name;
                    }
                }
            },
            getGender: function(idx) {
                return genderMap[idx];
            },
            getGold: function(sellValue) {
                var n = sellValue;
                var s = "";
                if (sellValue < 0) {
                    s = "-";
                    n = Math.abs(n);
                }
                var gold = Math.floor(((n / 10000)));
                var silver = Math.floor(((n / 100) % 100));
                var copper = Math.floor((n % 100));
                if (!copper) {
                    copper = "";
                } else
                {
                    copper += ' <i class="fa fa-circle currency-copper"  aria-hidden="true"></i>';
                }
                if (!gold) {
                    gold = "";
                } else {
                    gold += ' <i class="fa fa-circle currency-gold"  aria-hidden="true"></i> ';
                }
                if (!silver) {
                    silver = "";
                } else {
                    silver += ' <i class="fa fa-circle currency-silver"  aria-hidden="true"></i> ';
                }
                return s + gold + silver + copper;

            },
            getRace: function(idx) {
                for(var key in raceMap) {
                    // console.log(raceMap.races[key].id);
                    if(raceMap[key].id === idx) {
                        return raceMap[key].name;
                    }
                }
            },
            getFaction: function(idx) {
                return factionMap[idx];
            },
            getItemQuality: function(idx) {
                return itemQualityMap[idx];
            },
            getItemUpgradable: function(isUpgradable) {
                if (isUpgradable) {
                    var idx = 1;
                } else {
                    var idx = 0;
                }
                return itemUpgradableMap[idx];
            },
            getItemBind: function(idx) {
                return itemBindMap[idx];
            },
            getBonusstatsparse: function(statsArray){
                // console.log(statsArray);
                var line = "";
                var combinedStats = "";
                // Sort the order by stat number
                var sortedStats = [];
                sortedStats = statsArray.sort(function(a,b) {
                    // console.log(a);
                    // console.log(a.stat);
                    // console.log(b.stat);
                    //
                    // console.log(statsArray[a]);
                    return a.stat - b.stat;
                });

                // console.log(sortedStats);

                for (var x = 0; x <= sortedStats.length -1; x++) {
                    // console.log(x);
                    // console.log(statsArray);
                    // var temp = statsArray[x].stat;
                    // console.log(temp);
                    line = itemStatMap[sortedStats[x].stat];
                    // console.log(line);
                    // console.log(statsArray[x].stat);
                    // console.log(statsArray[x].amount);
                    if (sortedStats[x].stat == 74 || sortedStats[x].stat == 36 || sortedStats[x].stat == 49 || sortedStats[x].stat == 7 ) {
                        var statCalc = Math.round(sortedStats[x].amount * .046);
                        line = line.replace("%s", statCalc);
                    } else {
                        line = line.replace("%s", sortedStats[x].amount);
                    }

                    if (sortedStats[x].stat > 7) {
                        line = "<span class='item-green-text'>" + line + "</span>";
                    } else {
                        line = "<span class='item-white-text'>" + line + "</span>";
                    }
                    combinedStats += line + '<br>';
                }

                return combinedStats;
            },

            getZone: function(idx) {
                // console.log(idx);
                for(var key in zoneMap) {
                    // console.log(bossMap[key]);
                    if(zoneMap[key].id === idx) {
                        // console.log(zoneMap[key].description);
                        return zoneMap[key].description;
                    }
                }

                console.log('not found in zones');
                return "";
            },

            getInventorySlot: function(item) {
                // This maps the item name to a slot value as defined by our array.
                return inventorySlotMap[item];
            },

            init: function() {

                initRealms();

                // Build the races map
                if (getCacheStatus("races")) {
                    console.log('races are defined. skipping API call.');
                } else {
                    console.log('races are not defined');
                   raceService.getRaces(function(response){
                        console.log('Race API Call.');
                        // console.log(response.data)
                        setCacheStatus("races", response.data.races);
                        // Store data in local array.
                        raceMap = response.data.races;
                        setCacheStatus("races", response.data.races);
                        if (getCacheStatus("races")) {
                            console.log('races are now defined.');
                            console.log('races are cached: ');
                            console.log(myCache.get("races"));
                        }
                    }, function(err) {
                        console.log(err.status);
                    });
                }

                // Build the classes map
                if (getCacheStatus("classes")) {
                    console.log('classes are defined. skipping API call.');
                } else {
                    // console.log('they are not defined');
                    console.log('classes are not defined');
                    classService.getClasses(function(response){
                        console.log('Classes API Call.');
                        // console.log(response.data);
                        setCacheStatus("classes", response.data.classes);
                        // setClasses(response.data.classes);
                        // Store response in local array
                        classNap = response.data.classes;
                        if (getCacheStatus("classes")) {
                            console.log('classes are now defined.');
                            console.log('classes are cached: ');
                            console.log(myCache.get("classes"));
                        }
                    }, function(err) {
                        console.log(err.status);
                    });
                }

                if (getCacheStatus("bosses")) {
                    console.log('they are defined');
                } else {
                    // console.log('they are not defined');
                    console.log('Bosses are not defined');
                    bossService.getBosses(function(response){
                        console.log('Boss API Call.');
                        // console.log(response.data);
                        setCacheStatus("bosses", response.data.bosses);
                        // Store in local array
                        bossMap = response.data.bosses;
                        if (getCacheStatus("bosses")) {
                            console.log('Bosses are now defined.');
                            console.log('bosses are cached: ');
                            console.log(myCache.get("bosses"));

                        }
                        // console.log(characterFeed.getBossStatus());
                    }, function(err) {
                        console.log(err.status);
                    });
                }

                if (getCacheStatus("zones")) {
                    console.log('zones are defined');
                } else {
                    // console.log('zones are not defined');
                    console.log('Zones are not defined');
                    zoneService.getZones(function(response){
                        console.log('Get Zones API Call.');
                        // console.log(response.data);
                        setCacheStatus("zones", response.data.zones);
                        // Store in local array
                        zoneMap = response.data.zones;
                        if (getCacheStatus("zones")) {
                            console.log('zones are now defined.');
                            console.log('zones are cached: ');
                            console.log(myCache.get("zones"));
                        }
                        // console.log(characterFeed.getZoneStatus());
                    }, function(err) {
                        console.log(err.status);
                    });
                }

            },


            initRealms: function() {
                initRealms();

            },

        };
    })

.service('characterService', function($http, myCache, characterFeed, keys) {

    var self = this;

    var race;
    var thumbnail;

    var characterResult;

    var items = [];
    var count = 0;
    var idx = 0;

    self.list = {};
    self.feed = [];
    self.filteredFeed = [];
    self.inventorySlots = [];
    self.inventoryArray = [];

    var backgroundImage;
    var raceBackgroundImage;


    self.checkCharacterFeed = function() {
            // return myCache.get(this.name + ':' + this.selectedRealm);
        if (!myCache.get(this.name + ':' + this.selectedRealm)) {
            console.log('cache empty.');
            self.getFeed();
        } else
        {
            console.log('cache not empty.');
        }
    };
    // This is a decorator function for getCharacterFeed
    self.getFeed = function() {
        self.getCharacterFeed(function(response){
            // This is called once.  The entire response is then parsed $scope.characterResult
            console.log('Character Feed API Call.');
            // $scope.characterResult = response.data;
            // store data to the cache first
            myCache.put(this.name + ':' + this.selectedRealm, response.data);
            console.log('Feed is now cached.');
            characterResult = response.data;

            if (!race) {
                race = response.data.race;
            }
            thumbnail = response.data.thumbnail;

            // Set the background images
            $(".profile-wrapper").css("background", "url(http://render-api-us.worldofwarcraft.com/static-render/us/" + self.characterImage(thumbnail)+ ") no-repeat 182px 115px");

            // Set background image for profile based on race
            $(".content-top").css("background", "url(http://us.battle.net/wow/static/images/character/summary/backgrounds/race/" + race + ".jpg) left top no-repeat" );

            // Process through items in reponse and determine the category each falls under.
            // console.log(response);
            for (var x = 0; x <= response.data.feed.length - 1; x++) {
                var feedElement = {};
                // If item is loot, modify some of the properties and add it to the end of the items array.  The item array is a temporary array to store loot items while asynch calls
                // are occurring.
                if (response.data.feed[x].type === 'LOOT') {
                    // First, we store each object of type loot into a seperate array called items.
                    var itemElement = {};
                    // Record the original position of the item from the AJAX call.
                    itemElement['index'] = x;
                    itemElement['type'] = response.data.feed[x].type;
                    itemElement['timestamp'] = response.data.feed[x].timestamp;
                    itemElement['id'] = response.data.feed[x].itemId;
                    // console.log(itemElement);
                    items.push(itemElement);
                    count++;
                    // Perform a call to the item service, passing on the itemElement that was pushed into the item array.
                    // console.log('calling callItemService wrapper from within getCharacterFeed');
                    // We assign the return object to be called feedElement.
                    console.log('Item Service API Call.');

                    if (!myCache.get(itemElement)) {
                        console.log('cache empty for item.');
                        console.log(itemElement);
                        self.getFeed();
                    } else
                    {
                        console.log('cache not empty.');
                    }

                    console.log('invoking call item service for the items in character Feed for item:');
                    console.log(itemElement);

                    feedElement = callItemService(itemElement);
                    // console.log('returned to getCharacterFeed with the following object:');
                    // console.log(feedElement);
                    // The object has an undefined property for one of its keys at this time.
                    // console.log('feedElement.armor = ' + feedElement.armor);

                    // We add some properties from the original item object into this new object.
                    feedElement['type'] = itemElement['type'];
                    feedElement['timestamp'] = itemElement['timestamp'];
                    // Insert the feedElement into the feed array at the position of the original AJAX call index.
                    // console.log('This is the final object before splicing into the feed array');
                    // console.log(feedElement);
                    // console.log('feedElement.armor = ' + feedElement.armor);
                    var i = items[idx].index - 1;
                    // console.log('The item is being spliced into index[' + i + ']');
                    self.feed.splice(items[idx].index, 0, feedElement);
                    // console.log('current self.feed is:');
                    // console.log(self.feed);
                    // console.log(self.feed);

                    // console.log(self.feed[i - 1]);
                    // console.log(self.feed[i - 1].quality);


                    idx++;
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
                    // console.log('BOSSKILL object:');
                    // console.log(feedElement);
                    // console.log('object is a BOSSKILL. It is being added to position : ' + self.feed.length)


                    self.feed.push(feedElement);
                    // console.log('current self.feed is:');
                    // console.log(self.feed);

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
                    // console.log('ACHIEVEMENT object:');
                    // console.log(feedElement);
                    // console.log('object is an ACHIEVEMENT. It is being added to position : ' + self.feed.length)

                    self.feed.push(feedElement);
                    // console.log('current self.feed is:');
                    // console.log(self.feed);
                }
            }

            self.list = self.feed;


        }, function(err) {
            console.log(err.status);

        });
    };


    self.characterImage = function(path) {
        // console.log(path);
        var imagePath = path.substr(0, path.indexOf('avatar.jpg'));
        // console.log(imagePath);
        imagePath += "profilemain.jpg";
        // console.log(imagePath);
        return imagePath;
    };





    // Character Profile API Call - Charcater Profile
    self.getCharacter = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  { cache: true,  params: {  locale: keys.region, apikey: keys.privateKey } } )
         .then(callback,err)
    };

    // Character Profile API Call - Charcater Feed
    self.getCharacterFeed = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  {cache: true, params: {  locale: keys.region, apikey: keys.privateKey, fields: "feed"} } )
            .then(callback,err)
    };

    // Character Profile API Call - Items
    self.getItem = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name +  '?jsonp=JSON_CALLBACK',  {cache: true, params: {  locale: keys.region, apikey: keys.privateKey, fields: "items" } } )
            .then(callback,err)
    };


    // Achievement API Call - Achievement
    self.getAchievementDetails = function(achievementID, callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/achievement/' + achievementID + '?jsonp=JSON_CALLBACK',  { cache: true, params: { locale: keys.region, apikey: keys.privateKey } } )
            .then(callback,err)
    };
  
                
})

.service('dataService', function($http, keys, characterFeed) {

    // DATA Resources - Charcater Achievements
    this.getAchievements = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  {cache: true, params: {  locale: keys.region, apikey: keys.privateKey, fields: "achievements" } } )
            .then(callback,err)
    };

})


.service('realmService', function($http, keys, myCache) {

    this.getRealms = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/realm/status?jsonp=JSON_CALLBACK',  { cache: myCache, params: {  locale: keys.region, apikey: keys.privateKey } } )
         .then(callback,err)
    };
                
})

.service('raceService', function($http, keys) {


    this.getRaces = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/data/character/races?jsonp=JSON_CALLBACK',  { cache: true, params: { locale: keys.region, apikey: keys.privateKey } } )
            .then(callback,err)
    };

})

.service('classService', function($http, keys) {


    this.getClasses = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/data/character/classes?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: keys.region, apikey: keys.privateKey} } )
            .then(callback,err)
    };

})

.service('bossService', function($http, keys) {

    this.getBosses = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/boss/?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: keys.region, apikey: keys.privateKey} } )
            .then(callback,err)
    };

})

.service('zoneService', function($http, keys) {

    this.getZones = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/zone/?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: keys.region, apikey: keys.privateKey} } )
            .then(callback,err)
    };

})

.service('itemService', function($http, characterFeed, keys) {

    this.keyValue = characterFeed.getPrivateKey();
    this.region = characterFeed.getRegion();

    // Item API Call - Item API
    this.getItem = function(itemId, callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/item/' + itemId + '?jsonp=JSON_CALLBACK',  {cache: true, params: {  apikey: keys.privateKey} } )
            .then(callback,err)
    };

})
