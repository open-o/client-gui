/* Copyright 2017, Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var app = angular.module("ResourceMgrApp", ["ui.router", "ngTable"])

    .run(function($rootScope, $location, $state, $stateParams) {
        $rootScope.$on('$viewContentLoaded', function() {
            //call it here
            loadTemplate();
        });
    })

    .config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider){
        $urlMatcherFactoryProvider.caseInsensitive(true);
        $urlRouterProvider.otherwise('/resource/site');

        $stateProvider
            .state("resource", {
                url: "/resource",
                templateUrl : "templates/resource.html",
                controller : "resourceCtrl"
            })

            .state("resource.site", {
                url: "/site",
                templateUrl : "sdn-resmgr/site/site.html",
                controller : "siteCtrl"

            })
            .state("resource.me", {
                url: "/ne",
                templateUrl : "sdn-resmgr/ne/ne.html",
                controller : "neCtrl"
            })
            .state("resource.port", {
                url: "/port",
                templateUrl : "sdn-resmgr/port/port.html",
                controller : "portCtrl"

            })
            .state("resource.link", {
                url: "/link",
                templateUrl : "sdn-resmgr/link/link.html",
                controller : "linkCtrl"

            })
            .state("resource.location", {
                url: "/location",
                templateUrl : "nfv-resmgr/location/location.html",
                controller : "locationCtrl"

            })
            .state("resource.datacenter", {
                url: "/datacenter",
                templateUrl : "nfv-resmgr/datacenter/datacenter.html",
                controller : "datacenterCtrl"
            })

            /*
			.state("resource.vim", {
                url: "/vim",
                templateUrl : "nfv-resmgr/vim/vim.html",
                controller : "vimCtrl"
            })
			*/

    })

    .controller("resourceCtrl", function($scope, $log){
        $scope.message = "Resource";
        console.log("Hello All");

        $scope.loadTemplate = function() {

        }
        $scope.getTemplate = function(templateId) {
            console.log("getTemplate() : " + $scope.templates);
            return $($scope.templates).filter('#defaultButtons').html();
        }
    })
/*------------------------------------------------------------------------------PORT--------------------------------------------------------------------------------------*/
    .controller("portCtrl", function($scope,portDataService,$log, $compile,NgTableParams, $state ){
        $scope.title = "Port";
        var def_button_tpl, def_iconbutton_tpl;

        $scope.init = function() {
            portDataService.getAllPortData()
                .then(function (data) {
                    $scope.data = data.logicalTerminationPoints;
                    console.log("Data: ");
                    $log.info(data);
                    loadButtons();
                }, function (reason) {
                    $scope.message = "Error is :" + JSON.stringify(reason);
                    loadButtons();
                });
        }

        function loadButtons() {
            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            var def_iconbutton_tpl = $(modelTemplate).filter('#defaultIconButtons').html();
            var dialog = $(modelTemplate).filter('#dialog').html();
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#portAction').html($compile(addhtml)($scope));
            $('#portAction').append($compile(deletehtml)($scope));

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(port.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var number = $(modelTemplate).filter('#numeric').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();


            var portName = {"ErrMsg" :     {"errmsg" : "Name is required.", "modalVar":"port.name", "errtag":"textboxErrName", "errfunc":"validatetextboxName", "required":true}};
            $('#myModal #name').append($compile(Mustache.to_html(text, portName.ErrMsg))($scope));

            portDataService.getAllNEData().then(function(response) {
                var medata = [];
                for(var i = 0; i < response.managedElements.length; i+=1){
                    medata[i] = {"serviceTemplateId":response.managedElements[i].id,"templateName":response.managedElements[i].name};
                }
                var dropdownInfo = translateToDropdownInfo(medata);
                $("#myModal #medropdown").html(dropdownInfo);
                console.log("Data: ");
                $log.info(data);
            }, function(reason) {
                $scope.message = "Error is :" + JSON.stringify(reason);
            });
            //var portType = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"port.type"}};
            //$('#myModal #type').append($compile(Mustache.to_html(dropDown, $scope.data.dropdowntypeData))($scope));

            /*var dropSimple_data = {
                "modalVar" : "port.type",
                "labelField" : "itemLabel",
                "optionsValue" : $scope.data ? JSON.stringify($scope.data.dropdowntypeData.item) : ""
            };

            $('#myModal #type').append($compile(Mustache.to_html(dropDown, dropSimple_data))($scope));*/
			
			var dropdownResponse=[{"serviceTemplateId":"ETH","templateName":"ETH"},{"serviceTemplateId":"POS","templateName":"POS"},{"serviceTemplateId":"Trunk","templateName":"Trunk"},{"serviceTemplateId":"Loopback","templateName":"Loopback"}];
			var dropdownInfo = translateToDropdownInfo(dropdownResponse);
            document.getElementById("portdropdown").innerHTML = dropdownInfo;

           /* var portType = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"port.logicalType"}};
            $('#myModal #logicalType').append($compile(Mustache.to_html(text, portType.ErrMsg))($scope));*/

            var portLayerRate = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"port.layerRate"}};
            $('#myModal #layerRate').append($compile(Mustache.to_html(text, portLayerRate.ErrMsg))($scope));

            //var portEdgePoint = {"ErrMsg" :     {"ipv4Err" : "IP Address is required.", "modalVar":"port.Edgepoint"}};
            //$('#myModal #Edgepoint').append($compile(Mustache.to_html(dropDown, $scope.data.dropdownEdgeData))($scope));

           /* var dropSimple_data = {
                "modalVar" : "port.Edgepoint",
                "labelField" : "itemLabel",
                "optionsValue" : $scope.data ? JSON.stringify($scope.data.dropdownEdgeData.item) : ""
            };

            $('#myModal #Edgepoint').append($compile(Mustache.to_html(dropDown, dropSimple_data))($scope));*/
			
			var dropdownResponse=[{"serviceTemplateId":"true","templateName":"true"},{"serviceTemplateId":"false","templateName":"false"}];
			var dropdownInfo = translateToDropdownInfo(dropdownResponse);
            document.getElementById("portEdropdown").innerHTML = dropdownInfo;
			

           /* var portEdgepoint = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"port.isEdgePoint"}};
            $('#myModal #isEdgePoint').append($compile(Mustache.to_html(text, portEdgepoint.ErrMsg))($scope));*/

            var portIndex = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"port.portIndex"}};
            $('#myModal #portIndex').append($compile(Mustache.to_html(text, portIndex.ErrMsg))($scope));

            var portIp = {"ErrMsg" :     {"errmsg" : "The ip is required.", "modalVar":"port.ipAddress"}};
            $('#myModal #ipAddress').append($compile(Mustache.to_html(text, portIp.ErrMsg))($scope));

            var portAdmin = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"port.adminState"}};
            $('#myModal #adminState').append($compile(Mustache.to_html(text, portAdmin.ErrMsg))($scope));

            var portOperatingState = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"port.operState"}};
            $('#myModal #operState').append($compile(Mustache.to_html(text, portOperatingState.ErrMsg))($scope));

            var neNativeId = {"ErrMsg" :     {"errmsg" : "The nativeid required.", "modalVar":"port.nativeID"}};
            $('#myModal #nativeId').append($compile(Mustache.to_html(text, neNativeId.ErrMsg))($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.portTableParams = new NgTableParams({count: 5, sorting: {name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.data});

            $scope.$watch('checkboxes.checked', function(value) {
                $scope.checkboxes.items = {};
                angular.forEach($scope.portTableParams.data, function(item) {
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });

        }
		
		function translateToDropdownInfo(dropdowndata) {
            var options = '<option value="select">--select--</option>';
            var i;
            for (i = 0; i < dropdowndata.length; i += 1) {
                var option = '<option value="' + dropdowndata[i].serviceTemplateId + '">' + dropdowndata[i].templateName
                    + '</option>';
                options = options + option;
            }

            return options;
        } 

        $scope.validatetextboxName = function (value){
            if($scope.port.name) {
                $scope.textboxErrName = false;
            }
            else
                $scope.textboxErrName = true;
        }

        $scope.validatetextboxMe = function (value){
            if($scope.port.meID) {
                $scope.textboxErrMe = false;
            }
            else
                $scope.textboxErrMe = true;
        }

        $scope.validateipv4 = function (value){
            if($scope.port.ipaddress) {
                $scope.ipv4Err = false;
            }
            else
                $scope.ipv4Err = true;
        }

        $scope.validatenumeric = function (value){
            if($scope.port.portindex) {
                $scope.numericErr = false;
            }
            else
                $scope.numericErr = true;
        }


        $scope.validatenumeric = function (value){
            if($scope.port.layerrate) {
                $scope.numericErr = false;
            }
            else
                $scope.numericErr = true;
        }

        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
            $state.reload();
        }



        $scope.checkAll = function() {
            angular.forEach($scope.portData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.port = {};
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
            $scope.textboxErrName = false;
            $scope.textboxErrMe = false;
            $scope.ipv4Err = false;
            $scope.numericErr = false;
        }
        $scope.saveData = function(id) {
            $scope.port.isEdgePoint = $('#portEdropdown').val();
            $scope.port.logicalType = $('#portdropdown').val();
            $scope.port.meID = $('#medropdown').val();
            if (!$scope.textboxErrName && !$scope.textboxErrMe) {
				var ports ={};
				ports.logicalTerminationPoint=$scope.port;
                if(id) {
					
                    //edit data
                    console.log("Editing data.." + JSON.stringify($scope.port));
                    portDataService.editPortData(ports)
                        .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                else {
                    console.log("Adding data.." + JSON.stringify($scope.port));
                    portDataService.addPortData(ports)
                        .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                $('#myModal').modal('hide');
            }
        }

        $scope.deleteData = function(id) {
            var confirmation=false;
            var checkbox = false;
            var dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var error = {"err_data" : { "title": "Error",
                "showClose": "true",
                "closeBtnTxt": "Cancel",
                "icon": "glyphicon glyphicon-exclamation-sign",
                "iconColor": "icon_error",
                "msg": "Do you really wanted to Delete?.",
                "buttons": [
                    {
                        "text": "OK", "action": "deleteConfirmation('"+[id]+"')"
                    }]
            }};
            angular.forEach($scope.checkboxes.items, function(value) {
                if(value) {
                    checkbox = true;
                }
            });
            if (checkbox || (typeof id !== "undefined")) {
                var html = Mustache.to_html(dialog_tpl, error.err_data);
                $($compile(html)($scope)).modal({backdrop: "static"});
            }
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in port data is ::");
            $log.info($scope.data.portData);
            var deleteArr = [];
            if (id){

                deleteArr.push(id);
            }
            else {
                angular.forEach($scope.checkboxes.items, function(value , key) {
                    if(value) {
                        console.log("deleting name is :"+key);
                        deleteArr.push(key);
                    }
                });
            }
            console.log("deleteArr: "+deleteArr);
            for(var i = 0; i < deleteArr.length; i++) {
                console.log("To be deleted : "+deleteArr[i]);
                portDataService.deletePortData(deleteArr[i])
                    .then(function(data){
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function(reason){
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }

        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.id);
                        $scope.port = data;
						$('#portdropdown').val(data.logicalType);
						$('#portEdropdown').val(data.isEdgePoint);
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }

    })
/*-----------------------------------------------------------------------------SITE-----------------------------------------------------------------------------------*/
    .controller("siteCtrl", function($scope,siteDataService, $log, $compile, $state, NgTableParams ){
        $scope.title = "Site";
        var def_button_tpl, def_iconbutton_tpl;
        $scope.init = function() {
            siteDataService.getAllSiteData()
                .then(function (data) {
                    $scope.data = data.sites;
                    console.log("Data: ");
                    $log.info(data);
                    loadButtons();
                }, function (reason) {

                    $scope.message = "Error is :" + JSON.stringify(reason);
                    loadButtons();
                });
        }

        function loadButtons() {
            def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            def_iconbutton_tpl = $(modelTemplate).filter('#defaultIconButtons').html();
            var dialog = $(modelTemplate).filter('#dialog').html();
            var add_data = {"title":"Create", "type":"btn btn-default",  "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#siteAction').html($compile(addhtml)($scope));
            $('#siteAction').append($compile(deletehtml)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            loadSiteDialog();


            $scope.siteTableParams = new NgTableParams({count: 5, sorting: {name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.data});

            $scope.$watch('checkboxes.checked', function(value) {
                $scope.checkboxes.items = {};
                angular.forEach($scope.siteTableParams.data, function(item) {
                    console.log(item.id);
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });



        }

        function loadSiteDialog() {


            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(site.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();

            var siteName = {"ErrMsg" :     {"errmsg" : "Name is required.", "modalVar":"site.name", "errtag":"textboxErrName", "errfunc":"validatetextboxName", "required":true}};
            $('#myModal #name').append($compile(Mustache.to_html(text, siteName.ErrMsg))($scope));

            /*var dropSimple_data = {
                "modalVar" : "site.type",
                "labelField" : "itemLabel",
                "optionsValue" : "$scope.data ? JSON.stringify($scope.data.dropdownsiteData.item)"
            };

            $('#myModal #type').append($compile(Mustache.to_html(dropDown, dropSimple_data))($scope));*/
			
			var dropdownResponse=[{"serviceTemplateId":"network_site","templateName":"network_site"},{"serviceTemplateId":"tenant_site","templateName":"tenant_site"}];
			var dropdownInfo = translateToDropdownInfo(dropdownResponse);
            document.getElementById("sitedropdown").innerHTML = dropdownInfo;

          /*  var siteType = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"site.type"}};
            $('#myModal #type').append($compile(Mustache.to_html(text, siteType.ErrMsg))($scope));
*/
     /*       var siteTenantName = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"site.tenantID"}};
            $('#myModal #tenantID').append($compile(Mustache.to_html(text, siteTenantName.ErrMsg))($scope));*/

            /*var siteTenantType = {"ErrMsg" :     {"errmsg" : "The tenanttype is required.", "modalVar":"site.tenanttype"}};
            $('#myModal #tenanttype').append($compile(Mustache.to_html(text, siteTenantType.ErrMsg))($scope));*/
            var siteTanant = {"ErrMsg" :     {"errmsg" : "Tenant is required.", "modalVar":"site.tenantID", "placeholder":"Tenant"}};
            $('#myModal #Tenant').append($compile(Mustache.to_html(text, siteTanant.ErrMsg))($scope));
            
            var siteLocation = {"ErrMsg" :     {"errmsg" : "Location is required.", "modalVar":"site.location", "placeholder":"Location"}};
            $('#myModal #location').append($compile(Mustache.to_html(text, siteLocation.ErrMsg))($scope));
        }

		
		 function translateToDropdownInfo(dropdowndata) {
            var options = '<option value="select">--select--</option>';
            var i;
            for (i = 0; i < dropdowndata.length; i += 1) {
                var option = '<option value="' + dropdowndata[i].serviceTemplateId + '">' + dropdowndata[i].templateName
                    + '</option>';
                options = options + option;
            }

            return options;
        } 
		
        $scope.validatetextboxName = function (value){
            if($scope.site.name) {
                $scope.textboxErrName = false;
            }
            else
                $scope.textboxErrName = true;
        }


        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
            $state.reload();
        }

        $scope.checkAll = function() {
            angular.forEach($scope.siteData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.site = {};
            $("#myModal").modal();
            //$("#myModal").modal({}).draggable();
            $scope.textboxErrName = false;
        }
        $scope.saveData = function(id) {
            $scope.site.type = $('#sitedropdown').val();
            if (!$scope.textboxErrName) {
				

					var sites ={};
						sites.site=$scope.site;
						sites.site.type="tenant_site";
					
				console.log("save data.." + JSON.stringify(sites.site));
                if(id) {
                    //edit data
                    console.log("Editing data.." + JSON.stringify(sites));
                    siteDataService.editSiteData(sites)
                        .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            //$log.info(reason);
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                else {
                    console.log("Adding data.." + JSON.stringify(sites.site));

                    siteDataService.addSiteData(sites)
                        .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                $('#myModal').modal('hide');
            }
        }

        $scope.deleteData = function(id) {
            var confirmation=false;
            var checkbox = false;
            var dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var error = {"err_data" : { "title": "Error",
                "showClose": "true",
                "closeBtnTxt": "Cancel",
                "icon": "glyphicon glyphicon-exclamation-sign",
                "iconColor": "icon_error",
                "msg": "Do you really wanted to Delete?.",
                "buttons": [
                    {
                        "text": "Ok", "action": "deleteConfirmation('"+[id]+"')"
                    }]
            }};

            angular.forEach($scope.checkboxes.items, function(value) {
              if(value) {
                  checkbox = true;
              }
            });
            if (checkbox || (typeof id !== "undefined")) {
                var html = Mustache.to_html(dialog_tpl, error.err_data);
                $($compile(html)($scope)).modal({backdrop: "static"});
            }
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in site data is :");
            $log.info($scope.data.siteData);
            var deleteArr = [];
            if (id){

                deleteArr.push(id);
            }
            else {
                angular.forEach($scope.checkboxes.items, function(value , key) {
                    if(value) {
                        console.log("deleting name is :"+key);
                        deleteArr.push(key);
                    }
                });
            }
            console.log("deleteArr: "+deleteArr);
            for(var i = 0; i < deleteArr.length; i++) {
                console.log("To be deleted : "+deleteArr[i]);
                siteDataService.deleteSiteData(deleteArr[i])
                    .then(function(data){
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function(reason){
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }

        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.name);
                        console.log("Found : " + data);
                        $scope.site = data;
						$('#sitedropdown').val(data.type);
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }

    })
/*-----------------------------------------------------------------------------------LOCATION-----------------------------------------------------------------------------------*/
    .controller("locationCtrl", function($scope,locationDataService,$log, $compile,NgTableParams, $state){

        $scope.title = "Location";

        $scope.init = function() {
            locationDataService.getLocationData()
                .then(function (data) {
                    $scope.data = data.locations;
                    console.log(JSON.stringify($scope.data));
                    $log.info(data);
                    loadButtons();
                }, function (reason) {
                    $scope.message = "Error is :" + JSON.stringify(reason);
                    loadButtons();
                });
        }

        function loadButtons() {

            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            var def_iconbutton_tpl = $(modelTemplate).filter('#defaultIconButtons').html();
            var dialog = $(modelTemplate).filter('#dialog').html();
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#locationAction').html($compile(addhtml)($scope));
            $('#locationAction').append($compile(deletehtml)($scope));

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(loc.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));


            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var number = $(modelTemplate).filter('#numeric').html();

            var locId = {"ErrMsg" :     {"errmsg" : "Name is required.", "modalVar":"loc.id", "errtag":"textboxErrId", "errfunc":"validatetextboxId"}};
            $('#myModal #Name').append($compile(Mustache.to_html(text, locId.ErrMsg))($scope));

            var locCountry = {"ErrMsg" :     {"errmsg" : "Country is required.", "modalVar":"loc.country", "errtag":"textboxErrCountry", "errfunc":"validatetextboxCountry","required":true}};
            $('#myModal #Country').append($compile(Mustache.to_html(text, locCountry.ErrMsg))($scope));

            var locLocation = {"ErrMsg" :     {"errmsg" : "Location is required.", "modalVar":"loc.location", "errtag":"textboxErrLocation", "errfunc":"validatetextboxLocation","required":true}};
            $('#myModal #Location').append($compile(Mustache.to_html(text, locLocation.ErrMsg))($scope));

            var locDescription = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"loc.description", "errtag":"textboxErr", "errfunc":"validatetextbox"}};
            $('#myModal #Description').append($compile(Mustache.to_html(text, locDescription.ErrMsg))($scope));

            var locLatitude = {"ErrMsg" :     {"errmsg" : "Latitude is required.", "modalVar":"loc.latitude", "errtag":"textboxErrLatitude", "errfunc":"validatetextboxLatitude", "required":true}};
            $('#myModal #Latitude').append($compile(Mustache.to_html(text, locLatitude.ErrMsg))($scope));

            var locLongitude = {"ErrMsg" :     {"errmsg" : "Longitude is required.", "modalVar":"loc.longitude", "errtag":"textboxErrLongitude", "errfunc":"validatetextboxLongitude", "required":true}};
            $('#myModal #Longitude').append($compile(Mustache.to_html(text, locLongitude.ErrMsg))($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.neTableParams = new NgTableParams({count: 5, sorting: {Id: 'asc'}    
            }, { counts:[5, 10, 20, 50], dataset: $scope.data});

            $scope.$watch('checkboxes.checked', function(value) {
                $scope.checkboxes.items = {};
                angular.forEach($scope.neTableParams.data, function(item) {
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });

        }

        $scope.validatetextboxCountry = function (value){
            if($scope.loc.country) {
                $scope.textboxErrCountry = false;
            }
            else
                $scope.textboxErrCountry = true;
        }

        $scope.validatetextboxLocation = function (value){
            if($scope.loc.location) {
                $scope.textboxErrLocation = false;
            }
            else
                $scope.textboxErrLocation = true;
        }

        $scope.validatetextboxLatitude = function (value){
            if($scope.loc.latitude) {
                $scope.textboxErrLatitude = false;
            }
            else
                $scope.textboxErrLatitude = true;
        }

        $scope.validatetextboxLongitude = function (value){
            if($scope.loc.longitude) {
                $scope.textboxErrLongitude = false;
            }
            else
                $scope.textboxErrLongitude = true;
        }

        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
            $state.reload();
        }


        $scope.checkAll = function() {
            angular.forEach($scope.locationData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.loc = {};
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
            $scope.textboxErrLocation = false;
            $scope.textboxErrCountry = false;
            $scope.textboxErrLatitude = false;
            $scope.textboxErrLongitude = false;
        }
        $scope.saveData = function(id) {
            if (!$scope.textboxErrLocation && !$scope.textboxErrCountry && !$scope.textboxErrLatitude && !$scope.textboxErrLongitude) {
				
				var locs = {}
					locs = $scope.loc
                if(id) {
					
					
                    //edit data
                    console.log("Editing data.." + JSON.stringify($scope.loc));
                    locationDataService.editLocationData(locs)
                        .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                else {
                    console.log("Adding data.." + JSON.stringify($scope.loc));
                    locationDataService.addLocationData(locs)
                        .then(function (data) {

                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                $('#myModal').modal('hide');
            }
        }

        $scope.deleteData = function(id) {
            var confirmation=false;
            var checkbox = false;
            var dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var error = {"err_data" : { "title": "Error",
                "showClose": "true",
                "closeBtnTxt": "Cancel",
                "icon": "glyphicon glyphicon-exclamation-sign",
                "iconColor": "icon_error",
                "msg": "Do you really wanted to Delete?.",
                "buttons": [
                    {
                        "text": "OK", "action": "deleteConfirmation('"+[id]+"')"
                    }]
            }};
            angular.forEach($scope.checkboxes.items, function(value) {
                if(value) {
                    checkbox = true;
                }
            });
            if (checkbox || (typeof id !== "undefined")) {
                var html = Mustache.to_html(dialog_tpl, error.err_data);
                $($compile(html)($scope)).modal({backdrop: "static"});
            }
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in location data is :");
            $log.info($scope.data.locationData);
            var deleteArr = [];
            if (id){

                deleteArr.push(id);
            }
            else {
                angular.forEach($scope.checkboxes.items, function(value , key) {
                    if(value) {
                        console.log("deleting name is :"+key);
                        deleteArr.push(key);
                    }
                });
            }
            console.log("deleteArr: "+deleteArr);
            for(var i = 0; i < deleteArr.length; i++) {
                console.log("To be deleted : "+deleteArr[i]);
                locationDataService.deleteLocationData(deleteArr[i])
                    .then(function(data){
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function(reason){
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }

        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.id);
                        $scope.loc = data;
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }


    })
/*---------------------------------------------------------------LINK----------------------------------------------------------------------------------------------------*/
    .controller("linkCtrl", function($scope,linkDataService,$log, $compile,NgTableParams, $state){
        $scope.title = "Link";
        $scope.init = function() {
            linkDataService.getAllLinkData()
                .then(function (data) {
                    $scope.data = data.topologicalLinks;
                    console.log("Data: ");
                    $log.info(data);
                    loadButtons();
                }, function (reason) {
                    $scope.message = "Error is :" + JSON.stringify(reason);
                    loadButtons();
                });
        }

        function loadButtons() {
            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            var def_iconbutton_tpl = $(modelTemplate).filter('#defaultIconButtons').html();
            var dialog = $(modelTemplate).filter('#dialog').html();
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#linkAction').html($compile(addhtml)($scope));
            $('#linkAction').append($compile(deletehtml)($scope));

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(link.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var number = $(modelTemplate).filter('#numeric').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();

            var linkName = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"link.name","errtag":"textboxErr", "errfunc":"validatetextbox","required":true}};
            $('#myModal #name').append($compile(Mustache.to_html(text, linkName.ErrMsg))($scope));

            //var linkType = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"link.type"}};
            //$('#myModal #type').append($compile(Mustache.to_html(dropDown, $scope.data.dropdownlinkData))($scope));

           /* var dropSimple_data = {
                "modalVar" : "link.type",
                "labelField" : "itemLabel",
                "optionsValue" : $scope.data ? JSON.stringify($scope.data.dropdownlinkData.item) : ""
            };

            $('#myModal #type').append($compile(Mustache.to_html(dropDown, dropSimple_data))($scope));*/
			
			var dropdownResponse=[{"serviceTemplateId":"tenant_site","templateName":"TP1"},{"serviceTemplateId":"tenant_site2","templateName":"TP2"}];
			var dropdownInfo = translateToDropdownInfo(dropdownResponse);
            document.getElementById("linkdropdown").innerHTML = dropdownInfo;

        /*    var linkType = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"link.logicalType"}};
            $('#myModal #logicalType').append($compile(Mustache.to_html(text, linkType.ErrMsg))($scope));
*/
            var linkLayerRate = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"link.layerRate"}};
            $('#myModal #layerRate').append($compile(Mustache.to_html(text, linkLayerRate.ErrMsg))($scope));

            var linkSourcePort = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"link.aEnd"}};
            $('#myModal #aEnd').append($compile(Mustache.to_html(text, linkSourcePort.ErrMsg))($scope));

            var linkSinkPort = {"ErrMsg" :     {"errmsg" : "IP Address is required.", "modalVar":"link.zEnd"}};
            $('#myModal #zEnd').append($compile(Mustache.to_html(text, linkSinkPort.ErrMsg))($scope));

            var linkSourceNe = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"link.aEndME"}};
            $('#myModal #aEndME').append($compile(Mustache.to_html(text, linkSourceNe.ErrMsg))($scope));

            var linkSinkNe = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"link.zEndME"}};
            $('#myModal #zEndME').append($compile(Mustache.to_html(text, linkSinkNe.ErrMsg))($scope));

            var linkAdminState = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"link.adminState"}};
            $('#myModal #adminState').append($compile(Mustache.to_html(text, linkAdminState.ErrMsg))($scope));

            var linkOperatingState = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"link.operatingState"}};
            $('#myModal #operatingState').append($compile(Mustache.to_html(text, linkOperatingState.ErrMsg))($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.linkTableParams = new NgTableParams({count: 5, sorting: {name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.data});

            $scope.$watch('checkboxes.checked', function(value) {
                $scope.checkboxes.items = {};
                angular.forEach($scope.linkTableParams.data, function(item) {
                    console.log(item.id);
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });

        }
		
		function translateToDropdownInfo(dropdowndata) {
            var options = '<option value="select">--select--</option>';
            var i;
            for (i = 0; i < dropdowndata.length; i += 1) {
                var option = '<option value="' + dropdowndata[i].serviceTemplateId + '">' + dropdowndata[i].templateName
                    + '</option>';
                options = options + option;
            }

            return options;
        } 

        $scope.validatetextbox = function (value){
            if($scope.link.name) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.validatenumeric = function (value){
            if($scope.link.sourcePort) {
                $scope.numericErr = false;
            }
            else
                $scope.numericErr = true;
        }

        $scope.validatenumeric = function (value){
            if($scope.link.sinkPort) {
                $scope.numericErr = false;
            }
            else
                $scope.numericErr = true;
        }

        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
            $state.reload();
        }

        $scope.checkAll = function() {
            angular.forEach($scope.linkData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.link = {};
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
            $scope.textboxErr = false;
            $scope.numericErr = false;
        }
        $scope.saveData = function(id) {
            $scope.link.type = $('#linkdropdown').val();
            if (!$scope.textboxErr) {
				
			var links ={}
			links.topologicalLink= $scope.link;
				
                if(id) {
					

                    //edit data
                    console.log("Editing data.." + JSON.stringify($scope.link));
                    linkDataService.editLinkData(links)
                        .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                else {
                    console.log("Adding data.." + JSON.stringify(links));
                    linkDataService.addLinkData(links)
                        .then(function (data) {

                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                $('#myModal').modal('hide');
            }
        }

        $scope.deleteData = function(id) {
            var confirmation=false;
            var checkbox = false;
            var dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var error = {"err_data" : { "title": "Error",
                "showClose": "true",
                "closeBtnTxt": "Cancel",
                "icon": "glyphicon glyphicon-exclamation-sign",
                "iconColor": "icon_error",
                "msg": "Do you really wanted to Delete?.",
                "buttons": [
                    {
                        "text": "OK", "action": "deleteConfirmation('"+[id]+"')"
                    }]
            }};
            angular.forEach($scope.checkboxes.items, function(value) {
                if(value) {
                    checkbox = true;
                }
            });
            if (checkbox || (typeof id !== "undefined")) {
                var html = Mustache.to_html(dialog_tpl, error.err_data);
                $($compile(html)($scope)).modal({backdrop: "static"});
            }
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in link data is :");
            $log.info($scope.data.linkData);
            var deleteArr = [];
            if (id){

                deleteArr.push(id);
            }
            else {
                angular.forEach($scope.checkboxes.items, function(value , key) {
                    if(value) {
                        console.log("deleting name is :"+key);
                        deleteArr.push(key);
                    }
                });
            }
            console.log("deleteArr: "+deleteArr);
            for(var i = 0; i < deleteArr.length; i++) {
                console.log("To be deleted : "+deleteArr[i]);
                linkDataService.deleteLinkData(deleteArr[i])
                    .then(function(data){
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function(reason){
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }

        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.id);
                        $scope.link = data;
						$('#linkdropdown').val(data.logicalType);
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }
    })
 /*------------------------------------------------------------------------------NE---------------------------------------------------------------------------------------*/
    .controller("neCtrl", function($scope,neDataService, $log, $compile, NgTableParams, $state) {

        $scope.title = "ME";

        $scope.init = function() {
            neDataService.getAllNEData()
                .then(function (data) {
                    $scope.data = data.managedElements;
                    console.log("Data: ");
                    $log.info(data);
                    loadButtons();
                }, function (reason) {
                    $scope.message = "Error is :" + JSON.stringify(reason);
                    loadButtons();
                });
        }

        function loadButtons() {

            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            var def_iconbutton_tpl = $(modelTemplate).filter('#defaultIconButtons').html();
            var dialog = $(modelTemplate).filter('#dialog').html();
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#neAction').html($compile(addhtml)($scope));
            $('#neAction').append($compile(deletehtml)($scope));

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(ne.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var number = $(modelTemplate).filter('#numeric').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();

            var neName = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"ne.name", "errtag":"textboxErrName", "errfunc":"validatetextboxName","required":true}};
            $('#myModal #name').append($compile(Mustache.to_html(text, neName.ErrMsg))($scope));

            var neVersion = {"ErrMsg" :     {"errmsg" : "The version is required.", "modalVar":"ne.version"}};  //,"errtag":"textboxErrVersion", "errfunc":"validatetextboxVersion","required":true
            $('#myModal #version').append($compile(Mustache.to_html(text, neVersion.ErrMsg))($scope));

            var neNERole = {"ErrMsg" :     {"errmsg" : "The role is required.", "modalVar":"ne.neRole"}}; //,"errtag":"textboxErrRole", "errfunc":"validatetextboxRole","required":true
            $('#myModal #nerole').append($compile(Mustache.to_html(text, neNERole.ErrMsg))($scope));

            var serialNumber = {"ErrMsg" :     {"errmsg" : "The serialNumber is required.", "modalVar":"ne.serialNumber"}}; //,"errtag":"textboxErrSerial", "errfunc":"validatetextboxSerial","required":true
            $('#myModal #serialNumber').append($compile(Mustache.to_html(text, serialNumber.ErrMsg))($scope));

            var neProductName = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"ne.productName" }};
            $('#myModal #productName').append($compile(Mustache.to_html(text, neProductName.ErrMsg))($scope));

            //$('#myModal #controller').append($compile(Mustache.to_html(dropDown, $scope.data.dropdownneData))($scope));
            /*var dropSimple_data = {
                "modalVar" : "ne.controller",
                "labelField" : "itemLabel",
                "optionsValue" : "$scope.data ? JSON.stringify($scope.data.dropdownneData.item)"
            };

            $('#myModal #controller').append($compile(Mustache.to_html(dropDown, dropSimple_data))($scope));*/
			
			/*var dropdownResponse=[{"serviceTemplateId":"meCtrl","templateName":"mecontroller1"},{"serviceTemplateId":"meCtrl2","templateName":"mecontroller"}];
			var dropdownInfo = translateToDropdownInfo(dropdownResponse);
            document.getElementById("medropdown").innerHTML = dropdownInfo;*/


            neDataService.getNECtrlDDList()
                .then(function (response) {
                    $scope.ctrlList = response;
                    var dropdownInfo = translateCtrlIDToDropdownInfo($scope.ctrlList);
                    $("#myModal #medropdown").html(dropdownInfo);
                    console.log("Data: ");
                    $log.info(data);
                }, function (reason) {
                    $scope.message = "Error is :" + JSON.stringify(reason);
                });

            /*var neController = {"ErrMsg" :     {"errmsg" : "IP Address is required.", "modalVar":"ne.controller"}};
            $('#myModal #controller').append($compile(Mustache.to_html(text, neController.ErrMsg))($scope));*/

            var neIPAddress = {"ErrMsg" :     {"errmsg" : "IP Address is required.", "modalVar":"ne.ipAddress"}};
            $('#myModal #ipAddress').append($compile(Mustache.to_html(text, neIPAddress.ErrMsg))($scope));



            var neNativeId = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"ne.nativeID"}};
            $('#myModal #nativeId').append($compile(Mustache.to_html(text, neNativeId.ErrMsg))($scope));

            /*var neOperatingState = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"ne.operatingState"}};
            $('#myModal #operatingState').append($compile(Mustache.to_html(text, neOperatingState.ErrMsg))($scope));*/


            neDataService.getNESiteDDList()
                .then(function (data) {
                    $scope.siteIDList = data.sites;
                    var dropdownInfo = translateSiteIdToDropdownInfo($scope.siteIDList);
                    $("#myModal #siteIdDropdown").html(dropdownInfo);
                    console.log("Data: ");
                    $log.info(data);
                }, function (reason) {
                    $scope.message = "Error is :" + JSON.stringify(reason);
                });

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.neTableParams = new NgTableParams({count: 5, sorting: {name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.data});

            $scope.$watch('checkboxes.checked', function(value) {
                $scope.checkboxes.items = {};
                angular.forEach($scope.neTableParams.data, function(item) {
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });

        }
		
		function translateToDropdownInfo(dropdowndata) {
            var options = '<option value="select">--select--</option>';
            var i;
            for (i = 0; i < dropdowndata.length; i += 1) {
                var option = '<option value="' + dropdowndata[i].serviceTemplateId + '">' + dropdowndata[i].templateName
                    + '</option>';
                options = options + option;
            }

            return options;
        }

        function translateSiteIdToDropdownInfo(dropdowndata) {
            var options = '<option value="select">--select--</option>';
            var i;
            for (i = 0; i < dropdowndata.length; i += 1) {
                var option = '<option value="' + dropdowndata[i].id + '">' + dropdowndata[i].name
                    + '</option>';
                options = options + option;
            }

            return options;
        }

        function translateCtrlIDToDropdownInfo(dropdowndata) {
            var options = '<option value="select">--select--</option>';
            var i;
            for (i = 0; i < dropdowndata.length; i += 1) {
                var option = '<option value="' + dropdowndata[i].sdnControllerId + '">' + dropdowndata[i].name
                    + '</option>';
                options = options + option;
            }

            return options;
        }

        $scope.validatetextboxName = function (value){
            if($scope.ne.name) {
                $scope.textboxErrName = false;
            }
            else
                $scope.textboxErrName = true;
        }

        $scope.validatetextboxVersion = function (value){
            if($scope.ne.version) {
                $scope.textboxErrVersion = false;
            }
            else
                $scope.textboxErrVersion = true;
        }

        $scope.validatetextboxRole = function (value){
            if($scope.ne.neRole) {
                $scope.textboxErrRole = false;
            }
            else
                $scope.textboxErrRole = true;
        }

        $scope.validatetextboxSerial = function (value){
            if($scope.ne.serialNumber) {
                $scope.textboxErrSerial = false;
            }
            else
                $scope.textboxErrSerial = true;
        }

        $scope.validatetextboxIP = function (value){
            if($scope.ne.ipAddress) {
                $scope.textboxErrIP = false;
            }
            else
                $scope.textboxErrIP = true;
        }

        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
            $scope.textboxErrName = false;
            $state.reload();
        }



        $scope.checkAll = function() {
            angular.forEach($scope.neData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.ne = {};
            $scope.textboxErrName = false;
            $scope.textboxErrVersion = false;
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
        }
        $scope.saveData = function(id) {
            $scope.ne.controllerID = [];
            $scope.ne.controllerID[0] = $('#medropdown').val();
            $scope.ne.siteID = [];
            $scope.ne.siteID[0] = $('#siteIdDropdown').val();

            if (!$scope.textboxErrName && !$scope.textboxErrIP) {
				
				var nes = {};
				nes.managedElement = $scope.ne;
                if(id) {
                    //edit data
                    console.log("Editing data.." + JSON.stringify(nes));
                    neDataService.editNEData(nes)
                        .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                else {
                    console.log("Adding data.." + JSON.stringify($scope.ne));
                    neDataService.addNEData(nes)
                        .then(function (data) {

                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                $('#myModal').modal('hide');
            }
        }

        $scope.deleteData = function(id) {
            var confirmation=false;
            var checkbox = false;
            var dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var error = {"err_data" : { "title": "Error",
                "showClose": "true",
                "closeBtnTxt": "Cancel",
                "icon": "glyphicon glyphicon-exclamation-sign",
                "iconColor": "icon_error",
                "msg": "Do you really wanted to Delete?.",
                "buttons": [
                    {
                        "text": "OK", "action": "deleteConfirmation('"+[id]+"')"
                    }]
            }};
            angular.forEach($scope.checkboxes.items, function(value) {
                if(value) {
                    checkbox = true;
                }
            });
            if (checkbox || (typeof id !== "undefined")) {
                var html = Mustache.to_html(dialog_tpl, error.err_data);
                $($compile(html)($scope)).modal({backdrop: "static"});
            }
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in ne data is :");
            $log.info($scope.data.neData);
            var deleteArr = [];
            if (id) {

                deleteArr.push(id);
            }
            else {
                angular.forEach($scope.checkboxes.items, function (value, key) {
                    if (value) {
                        console.log("deleting name is :" + key);
                        deleteArr.push(key);
                    }
                });
            }
            console.log("deleteArr: " + deleteArr);
            for (var i = 0; i < deleteArr.length; i++) {
                console.log("To be deleted : " + deleteArr[i]);
                neDataService.deleteNEData(deleteArr[i])
                    .then(function (data) {
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }
        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.id);
                        $scope.ne = data;
						$('#medropdown').val(data.controller);
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }


    })
/*-------------------------------------------------------------------------------DATA CENTRE---------------------------------------------------------------------*/
    .controller("datacenterCtrl", function($scope,datacenterDataService,$log, $compile, NgTableParams, $state){

        $scope.title = "Data Center";

        $scope.init = function() {
            datacenterDataService.getDatacenterData()
                .then(function (data) {
                    $scope.data = data.datacenters;
                    console.log("Data: ");
                    $log.info(data);
                    loadButtons();
                }, function (reason) {
                    $scope.message = "Error is :" + JSON.stringify(reason);
                    loadButtons();
                });
        }

        function loadButtons() {

            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            var def_iconbutton_tpl = $(modelTemplate).filter('#defaultIconButtons').html();
            var dialog = $(modelTemplate).filter('#dialog').html();
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#datacenterAction').html($compile(addhtml)($scope));
            $('#datacenterAction').append($compile(deletehtml)($scope));

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(datacenter.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var number = $(modelTemplate).filter('#numeric').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();

            var dataId = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"datacenter.id"}};
            $('#myModal #Id').append($compile(Mustache.to_html(text, dataId.ErrMsg))($scope));

            var dataName = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"datacenter.name","errtag":"textboxErr", "errfunc":"validatetextbox","required":true}};
            $('#myModal #Name').append($compile(Mustache.to_html(text, dataName.ErrMsg))($scope));

            var dataStatus = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"datacenter.Status"}};
            $('#myModal #Status').append($compile(Mustache.to_html(text, dataStatus.ErrMsg))($scope));

            //$('#myModal #Country').append($compile(Mustache.to_html(dropDown, $scope.data.dropdowncountryData))($scope));
            /*var dropSimple_data = {
                "modalVar" : "datacenter.Country",
                "labelField" : "itemLabel",
                "optionsValue" : $scope.data ? JSON.stringify($scope.data.dropdowncountryData.item) : ""
            };

            $('#myModal #Country').append($compile(Mustache.to_html(dropDown, dropSimple_data))($scope));*/

            //$('#myModal #Location').append($compile(Mustache.to_html(dropDown, $scope.data.dropdownlocationData))($scope));
            /*var dropSimple_data = {
                "modalVar" : "datacenter.Location",
                "labelField" : "itemLabel",
                "optionsValue" : $scope.data ? JSON.stringify($scope.data.dropdownlocationData.item) : ""
            };

            $('#myModal #Location').append($compile(Mustache.to_html(dropDown, dropSimple_data))($scope));*/

            //$('#myModal #ServiceName').append($compile(Mustache.to_html(dropDown, $scope.data.dropdownserviceData))($scope));
            /*var dropSimple_data = {
                "modalVar" : "datacenter.ServiceName",
                "labelField" : "itemLabel",
                "optionsValue" : $scope.data ? JSON.stringify($scope.data.dropdownlocationData.item) : ""
            };

            $('#myModal #ServiceName').append($compile(Mustache.to_html(dropDown, dropSimple_data))($scope));*/
			
			var dropdownResponse=[{"serviceTemplateId":"Country1","templateName":"Country1"},{"serviceTemplateId":"Country2","templateName":"Country2"}];
            var dropdownInfo = translateToDropdownInfo(dropdownResponse);
            //document.getElementById("countrydropdown").innerHTML = dropdownInfo;

            var dropdownResponse=[{"serviceTemplateId":"Location1","templateName":"Location1"},{"serviceTemplateId":"Location2","templateName":"Location2"}];
            var dropdownInfo = translateToDropdownInfo(dropdownResponse);
            //document.getElementById("locationdropdown").innerHTML = dropdownInfo;

            var dropdownResponse=[{"serviceTemplateId":"ServiceName1","templateName":"ServiceName1"},{"serviceTemplateId":"ServiceName2","templateName":"ServiceName2"}];
            var dropdownInfo = translateToDropdownInfo(dropdownResponse);
            //document.getElementById("servicenamedropdown").innerHTML = dropdownInfo;

            var dataCPU = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"datacenter.cpu"}};
            $('#myModal #Cpu').append($compile(Mustache.to_html(text, dataCPU.ErrMsg))($scope));

            var dataMemory = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"datacenter.memory"}};
            $('#myModal #Memory').append($compile(Mustache.to_html(text, dataMemory.ErrMsg))($scope));

            var dataHarddisk = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"datacenter.hardDisk"}};
            $('#myModal #HardDisk').append($compile(Mustache.to_html(text, dataHarddisk.ErrMsg))($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.neTableParams = new NgTableParams({count: 5, sorting: {Id: 'asc'}  
            }, { counts:[5, 10, 20, 50], dataset: $scope.data});

            $scope.$watch('checkboxes.checked', function(value) {
                $scope.checkboxes.items = {};

                angular.forEach($scope.neTableParams.data, function(item) {
					
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });
			
			//action
			fillCountryData();
			fillVimNameData();
			regChangeAction();

        }
		
		function translateToDropdownInfo(dropdowndata) {
            var options = '<option value="select">--select--</option>';
            var i;
            for (i = 0; i < dropdowndata.length; i += 1) {
                var option = '<option value="' + dropdowndata[i].serviceTemplateId + '">' + dropdowndata[i].templateName+ '</option>';
                options = options + option;
            }
            return options;
        }

        $scope.validatetextbox = function (value){
            if($scope.datacenter.name) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
            $state.reload();
        }


        $scope.checkAll = function() {
            angular.forEach($scope.datacenterData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.datacenter = {};
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
            $scope.textboxErr = false;
        }
        $scope.saveData = function(id) {
            if (!$scope.textboxErr) {
				
				var dcs = {}
				dcs =	$scope.datacenter;
				$scope.datacenter.vimName = $("#servicenamedropdown").val();
				$scope.datacenter.location = $("#locationdropdown").val();
				$scope.datacenter.country = $("#countrydropdown").val();
                if(id) {
                    //edit data
                    console.log("Editing data.." + JSON.stringify(dcs));
                    datacenterDataService.editDatacenterData(dcs)
                        .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                else {
                    console.log("Adding data.." + JSON.stringify($scope.datacenter));
                    datacenterDataService.addDatacenterData(dcs)
                        .then(function (data) {

                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
                }
                $('#myModal').modal('hide');
            }
        }

        $scope.deleteData = function(id) {
            var confirmation=false;
            var checkbox = false;
            var dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var error = {"err_data" : { "title": "Error",
                "showClose": "true",
                "closeBtnTxt": "Cancel",
                "icon": "glyphicon glyphicon-exclamation-sign",
                "iconColor": "icon_error",
                "msg": "Do you really wanted to Delete?.",
                "buttons": [
                    {
                        "text": "OK", "action": "deleteConfirmation('"+[id]+"')"
                    }]
            }};
            angular.forEach($scope.checkboxes.items, function(value) {
                if(value) {
                    checkbox = true;
                }
            });
            if (checkbox || (typeof id !== "undefined")) {
                var html = Mustache.to_html(dialog_tpl, error.err_data);
                $($compile(html)($scope)).modal({backdrop: "static"});
            }
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in datacenter data is :");
            $log.info($scope.data.datacenter);
            var deleteArr = [];
            if (id){

                deleteArr.push(id);
            }
            else {
                angular.forEach($scope.checkboxes.items, function(value , key) {
                    if(value) {
                        console.log("deleting name is :"+key);
                        deleteArr.push(key);
                    }
                });
            }
            console.log("deleteArr: "+deleteArr);
            for(var i = 0; i < deleteArr.length; i++) {
                console.log("To be deleted : "+deleteArr[i]);
                datacenterDataService.deleteDatacenterData(deleteArr[i])
                    .then(function(data){
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function(reason){
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }

        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.id);
                        $scope.datacenter = data;
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }


    })


    .controller("vimCtrl", function($scope, $log){
        $scope.message = "vimCtrl";
        //loadVimData();
    })




// ---------------------------------------------------------------------------------------------------------------------------------------------

var modelTemplate = "";
function loadTemplate() {
    
/*    $.get('/openoui/resmgr/templates/template.html', function (template) {
        modelTemplate += template;
    });*/
    $.get('/openoui/resmgr/templates/templateContainer.html', function (template) {
        modelTemplate += template;
    });
    $.get('/openoui/resmgr/templates/templateWidget.html', function (template) {
        //console.log("Template is : "+template);
        modelTemplate += template;
    });
    $.get('/openoui/resmgr/templates/templateNotification.html', function (template) {
        modelTemplate += template;
    });
    $.get('/openoui/resmgr/templates/templateFunctional.html', function (template) {
        modelTemplate += template;
    });
}


//------------------------------------------------- Common code ---------------------------------------------
function searchTable() {
    var filter, table, tr, td;
    filter = $("#myInput").val().toUpperCase();
    table = $("#myTable_search");
    tr = $("#myTable_search tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (var i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

