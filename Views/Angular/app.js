var app=
angular.module("myApp",["ngRoute"]);
app.config(function($routeProvider){
    $routeProvider.when("/Home",
    {controller:'summaryController',templateUrl:"Views/default.html"})
    .when("/Master",{controller:"masterController",templateUrl:"Views/master_dashboard.html"})
    .when("/Allocation",{controller:"allocationController",templateUrl:"Views/allocation.html"})
    .when("/AssetDesign",{controller:"assetdesignController",templateUrl:"Views/assetDesign.html"})
    .when("/BlockMagistral",{controller:"blockMagistralController",templateUrl:"Views/BlockMagistral.html"})
    .when("/MasterNew",{controller:"newController",templateUrl:"Views/master_newdashboard.html"})
    .when("/Charts",{controller:"chartsController",templateUrl:"Views/charts.html"})
    .otherwise({redirectTo:'/Home'})});

var processJsonContent=function(url,type,data){
    return $.ajax({
        url:encodeURI(url),
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        type:type,
        data:data,
        contentType:"application/json; charset=UTF-8",
        crossDomain: true,
        xhrFields: { withCredentials: true },
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization",makeBasicAuth(user,pass))}
    })
};

var makeBasicAuth=function(user,password){
    var tok=user+':'+password;
    var hash=window.btoa(tok);
    return"Basic "+hash
}