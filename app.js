(function () {
  'use strict';
  
  var app = angular.module('NarrowItDownApp', []);
  app.controller('NarrowItDownController', NarrowItDownController);
  app.service('MenuSearchService', MenuSearchService);
  app.directive('foundItems', FoundItemsDirective);
  //app.constant('ApiBasePath', 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json');
  
  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'found-items.html',
      restrict: "EA",
      scope: {
        foundItems: '<',
        onRemove: '&'
      }
    };
    return ddo;
  }
  
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;
  
    menu.found = [];
    menu.searchTerm = '';
  
    menu.getItems = function() {
      if (!(menu.searchTerm)) {
        menu.found = null;
        return;
      }
      menu.found = [];
      var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
      
      console.log("Menu Search Item",menu.searchTerm);
    
      promise.then(function (response) {
        console.log("After Promise response ",response);
        menu.found = response;        
      })
      .catch(function (error) {
        console.log("Something went wrong.");
      });
    };
  
    menu.removeItem = function (index) {
      menu.found.splice(index, 1);
    };
  }
  
  MenuSearchService.$inject = ['$http']
  function MenuSearchService($http) {
    var service = this;
  
    service.getMatchedMenuItems = function (searchTerm) {
      console.log("getMatchedMenuItems searchTerm",searchTerm);
      return $http({        
        method: "GET",
        url:'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json',
      }).then(function (result) {
        console.log("Result",result);

        if (searchTerm == false)
          return [];
  
        var foundItems = [];
        var list = result.data.data.menu_items;
        console.log("List ",list)
       
        console.log("Result Menu Items list", list)
  
        for (var i = 0; i < list.length; i++) {
          var description = list[i].description;
          if (description.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
            foundItems.push(list[i]);
          }
        } 
        return foundItems;
      });
    };
  }
  
  })();
  