/*
 * Copyright 2016 ZTE Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var vm = avalon.define({
    $id: "tmDetailController",
    templateId: "",
    templateData: [
        {href: "#topology", name: "Topology", value: true},
        {href: "#nodes", name: "Nodes", value: false}
    ],
    $language: {
        "sProcessing": "<img src='../component/thirdparty/data-tables/images/loading-spinner-grey.gif'/><span>&nbsp;&nbsp;"
        + $.i18n.prop("nfv-nso-iui-table-sProcess") + "</span>",
        "sLengthMenu": $.i18n.prop("nfv-nso-iui-table-sLengthMenu"),
        "sZeroRecords": $.i18n.prop("nfv-nso-iui-table-sZeroRecords"),
        "sInfo": "<span class='seperator'>  </span>" + $.i18n.prop("nfv-nso-iui-table-sInfo"),
        "sInfoEmpty": $.i18n.prop("nfv-nso-iui-table-sInfoEmpty"),
        "sGroupActions": $.i18n.prop("nfv-nso-iui-table-sGroupActions"),
        "sAjaxRequestGeneralError": $.i18n.prop("nfv-nso-iui-table-sAjaxRequestGeneralError"),
        "sEmptyTable": $.i18n.prop("nfv-nso-iui-table-sEmptyTable"),
        "oPaginate": {
            "sPrevious": $.i18n.prop("nfv-nso-iui-table-sPrevious"),
            "sNext": $.i18n.prop("nfv-nso-iui-table-sNext"),
            "sPage": $.i18n.prop("nfv-nso-iui-table-sPage"),
            "sPageOf": $.i18n.prop("nfv-nso-iui-table-sPageOf")
        }
    },
    $restUrl: {
        queryNodeTemplateUrl: "/openoapi/catalog/v1/servicetemplates/{0}/nodetemplates",
        queryTemplateInfoUrl: "/openoapi/catalog/v1/servicetemplates"
    },
    $init: function () {
        vm.$initTemplateData();
        vm.$initTopoNodesData();
    },
    $initTemplateData: function () {
        $.ajax({
            type: "GET",
            url: vm.$restUrl.queryTemplateInfoUrl,
            success: function (resp) {
                if (resp) {
                    vm.nodesTab.servicesTemplateData = [];
                    for (var i = 0; i < resp.length; i++) {
                        //generate node table display data
                        vm.nodesTab.servicesTemplateData.push(resp[i]);
                    }
                    vm.nodesTab.$initNfvNodesTab();
                }
            },
            error: function () {
                commonUtil.showMessage($.i18n.prop("nfv-topology-iui-message-error"), "danger");
            }
        });
    },
    $initTopoNodesData: function () {
        $.ajax({
            type: "GET",
            url: vm.$restUrl.queryNodeTemplateUrl,
            success: function (resp) {
                if (resp) {
                    vm.nodesTab.nodesDetail.nodesTemplateDetailData = [];
                    for (var i = 0; i < resp.length; i++) {
                        //generate node table display data
                        var nodeTemplate = topoUtil.generateNodeTemplate(resp[i]);
                        vm.nodesTab.nodesList.nodesData.push(nodeTemplate);
                    }
                    vm.nodesTab.nodesDetail.nodesTemplateDetailData = resp;
                    //generate topology graph display data
                    vm.topologyTab.topoTemplateData = topoUtil.generateTopoTemplate(vm.nodesTab.nodesList.nodesData.$model);
                    //initialize topology data
                    topoUtil.initTopoData(vm.topologyTab.topoTemplateData.$model);
                    //vm.nodesTab.nodesList.$initNodesTable();
                }
            },
            error: function () {
                commonUtil.showMessage($.i18n.prop("nfv-topology-iui-message-error"), "danger");
            }
        });
    },
    $initNodesData: function () {
        $.ajax({
            type: "GET",
            url: vm.$restUrl.queryNodeTemplateUrl,
            success: function (resp) {
                if (resp) {
                    vm.nodesTab.nodesDetail.nodesTemplateDetailData = [];
                    for (var i = 0; i < resp.length; i++) {
                        //generate node table display data
                        var nodeTemplate = topoUtil.generateNodeTemplate(resp[i]);
                        vm.nodesTab.nodesList.nodesData.push(nodeTemplate);
                    }
                    vm.nodesTab.nodesDetail.nodesTemplateDetailData = resp;
                    //generate topology graph display data
                    //vm.topologyTab.topoTemplateData = topoUtil.generateTopoTemplate(vm.nodesTab.nodesList.nodesData.$model);
                    //initialize topology data
                    //topoUtil.initTopoData(vm.topologyTab.topoTemplateData.$model);
                    vm.nodesTab.nodesList.$initNodesTable();
                }
            },
            error: function () {
                commonUtil.showMessage($.i18n.prop("nfv-topology-iui-message-error"), "danger");
            }
        });
    },
    topologyTab: {
        topology: "topology.html",
        vnfTip: $.i18n.prop("nfv-topology-iui-vnf-tip"),
        btnTip: $.i18n.prop("nfv-topology-iui-btn-return-tip"),
        topoTemplateData: [],
        boxTopoDatas: [],
        networkTopoDatas: [],
        isShowNum: false,
        returnBtnVisible: false,
        $getColor: function (index) {
            return topoUtil.getColor(index);
        },
        $getCidr: function (properties) {
            return topoUtil.getCidr(properties);
        },
        $getCpTop: function (index, parentBoxId) {
            return topoUtil.getCpTop(index, parentBoxId);
        },
        $initTopology: function () {
            topoUtil.initTopoData(vm.topologyTab.topoTemplateData.$model);
        },
        $showTopo: function (id, name) {
            vm.nodesTab.nodesDetail.$showDetails("block", id, name);
        },
        $showVnfTopo: function (templateId) {
            vm.topologyTab.returnBtnVisible = true;
            vm.$restUrl.queryNodeTemplateUrl = "/openoapi/catalog/v1/servicetemplates/" + templateId + "/nodetemplates";
            vm.$init();
        },
        $returnNS: function () {
            vm.topologyTab.returnBtnVisible = false;
            vm.$restUrl.queryNodeTemplateUrl = "/openoapi/catalog/v1/servicetemplates/" + vm.templateId + "/nodetemplates";
            vm.$init();
        }
    },
    nodesTab: {
        servicesTemplateData: [],
        $nodesTabId: "ict_nodes_template_table",
        $nodesTemplateTabFields: {// table columns
            table: [
                {"mData": "serviceTemplateId", name: "ID", "bVisible": false},
                {"mData": "", name: "", "sClass": 'details-control'},
                {"mData": "templateName", name: $.i18n.prop("nfv-template-iui-field-templatename")},
                {"mData": "vendor", name: $.i18n.prop("nfv-template-iui-field-vendor")},
                {"mData": "version", name: $.i18n.prop("nfv-template-iui-field-version")},
                {"mData": "csarid", name: "packageID", "bVisible": false},
                {"mData": "type", name: $.i18n.prop("nfv-template-iui-field-type")},
                //{"mData": "inputs", name: $.i18n.prop("nfv-template-iui-field-inputs"),"fnRender" : tmDetailUtil.inputsRender},
                //{"mData": "outputs", name: $.i18n.prop("nfv-template-iui-field-outputs"),"fnRender" : tmDetailUtil.outputsRender},
                //{"mData": "operations", name: $.i18n.prop("nfv-template-iui-field-operations")}
            ]
        },
        $initNfvNodesTab: function () {
            var setting = {};
            setting.language = vm.$language;
            setting.paginate = true;
            setting.info = true;
            //setting.sort = true;
            setting.columns = vm.nodesTab.$nodesTemplateTabFields.table;
            setting.restUrl = vm.$restUrl.queryTemplateInfoUrl;
            setting.tableId = vm.nodesTab.$nodesTabId;
            //serverPageTable.initTableWithData(setting,vm.nodesTab.$nodesTabId + '_div',vm.nodesTab.servicesTemplateData.$model);
            serverPageTable.initDataTable(setting, {}, vm.nodesTab.$nodesTabId + '_div');
            $('#' + vm.nodesTab.$nodesTabId + '>tbody').on("click", 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var table = $('#' + vm.nodesTab.$nodesTabId).dataTable();
                if (table.fnIsOpen(tr[0])) {
                    table.fnClose(tr[0]);
                    tr.removeClass('shown');
                }
                else {
                    table.fnOpen(tr[0], vm.nodesTab.nodesList.$format_Detail(), 'details');
                    tr.addClass('shown');
                }
            });
        },

        //nodes list table
        nodesList: {
            nodesData: [],
            $nodesTabDataId: "ict_nodes_table",
            $nodesTabFields: {// table columns
                table: [
                    {"mData": "id", name: "ID", "bVisible": false},
                    {
                        "mData": "name",
                        name: $.i18n.prop("nfv-templateDetail-iui-field-nodetypename"),
                        "bSortable": true,
                        "fnRender": tmDetailUtil.nameRender
                    },
                    {"mData": "type", name: $.i18n.prop("nfv-templateDetail-iui-field-type"), "bSortable": false},
                    {
                        "mData": "containedin",
                        name: $.i18n.prop("nfv-templateDetail-iui-field-containedin"),
                        "bSortable": false
                    },
                    {
                        "mData": "deployedon",
                        name: $.i18n.prop("nfv-templateDetail-iui-field-deployedon"),
                        "bSortable": false
                    },
                    {
                        "mData": "connectedto",
                        name: $.i18n.prop("nfv-templateDetail-iui-field-connectedto"),
                        "bSortable": false
                    },
                    {
                        "mData": "virtuallinksto",
                        name: $.i18n.prop("nfv-templateDetail-iui-field-virtuallinksto"),
                        "bSortable": false
                    }
                ]
            },
            $initNodesTable: function () {
                var setting = {};
                setting.language = vm.$language;
                setting.paginate = true;
                setting.info = true;
                //setting.sort = true;
                setting.columns = vm.nodesTab.nodesList.$nodesTabFields.table;
                setting.restUrl = vm.$restUrl.queryNodeTemplateUrl;
                setting.tableId = vm.nodesTab.nodesList.$nodesTabDataId;
                //serverPageTable.initTableWithData(setting,vm.nodesTab.nodesList.$nodesTabDataId + '_div',vm.nodesTab.nodesList.nodesData.$model);
                serverPageTable.initTableWithoutLib(setting, {}, vm.nodesTab.nodesList.$nodesTabDataId + '_div');
            },
            $format_Detail: function () {
                var sOut = '<div class="row-fluid" data-name="table_zone"><div class="col-xs-12" id="ict_nodes_table_div"></div></div>'
                vm.$initNodesData();
                return sOut;
            },
        },
        //Nodes Details
        nodesDetail: {
            nodesTemplateDetailData: [],
            detailTitle: "",
            isShow: "none",
            detailIndex: 0,
            detailData: [
                {id: "general", name: $.i18n.prop("nfv-templateDetail-nodesTab-iui-tab-general"), isActive: true},
                {
                    id: "properties",
                    name: $.i18n.prop("nfv-templateDetail-nodesTab-iui-tab-properties"),
                    isActive: false
                },
                {
                    id: "relationShips",
                    name: $.i18n.prop("nfv-templateDetail-nodesTab-iui-tab-relationShips"),
                    isActive: false
                }
            ],
            $showDetails: function (isShow, nodetypeid, nodetypename) {
                vm.nodesTab.nodesDetail.isShow = isShow;
                if (isShow == "block") {
                    vm.nodesTab.nodesDetail.detailTitle = nodetypename + " " + $.i18n.prop("nfv-templateDetail-nodesTab-iui-title-nodeDetail"),
                        $('#' + vm.nodesTab.nodesDetail.detailData[0].id).click();
                    vm.nodesTab.nodesDetail.detailData[0].isActive = true;
                    vm.nodesTab.nodesDetail.$initNodeDetailTable(nodetypeid);
                }
            },
            detailCondChange: function (index) {
                vm.nodesTab.nodesDetail.detailIndex = index;
                for (var i = 0; i < vm.nodesTab.nodesDetail.detailData.length; i++) {
                    vm.nodesTab.nodesDetail.detailData[i].isActive = false;
                }
                vm.nodesTab.nodesDetail.detailData[index].isActive = true;
            },
            $tableFields: {// table columns
                general: [
                    {
                        "mData": "key",
                        "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-key"),
                        "bSortable": false
                    },
                    {
                        "mData": "value",
                        "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-value"),
                        "bSortable": false
                    }
                ],
                properties: [
                    {
                        "mData": "key",
                        "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-key"),
                        "bSortable": false
                    },
                    {
                        "mData": "value",
                        "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-value"),
                        "bSortable": false
                    }
                ],
                relationShips: [
                    {
                        "mData": "sourceNodeName",
                        "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-sourceNodeName"),
                        "bSortable": false
                    },
                    {
                        "mData": "targetNodeName",
                        "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-targetNodeName"),
                        "bSortable": false
                    },
                    {
                        "mData": "type",
                        "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-type"),
                        "bSortable": false
                    }
                ]
            },
            $initNodeDetailTable: function (nodetemplateid) {
                var data = topoUtil.getCurrentDetailData(vm.nodesTab.nodesDetail.nodesTemplateDetailData.$model, nodetemplateid);
                //initialize three tables of nodedetail
                $.each(vm.nodesTab.nodesDetail.$tableFields, function (key, value) {
                    var setting = {};
                    setting.language = vm.$language;
                    setting.paginate = false;
                    setting.info = false;
                    setting.columns = value;
                    setting.tableId = "ict_table_" + key;
                    serverPageTable.initTableWithData(setting, setting.tableId + '_div', data[key]);
                });
            }
        }
    },
    executionTab: {
        $eventsTabId: "ict_events_table",
        $eventsTabFields: {// table columns
            table: [
                {"mData": "currentStepId", name: "ID", "bVisible": false},
                {
                    "mData": "currentStepName",
                    name: $.i18n.prop("nfv-templateDetail-executionTab-iui-field-currentStepName")
                },
                {
                    "mData": "currentStepStatus",
                    name: $.i18n.prop("nfv-templateDetail-executionTab-iui-field-currentStepStatus")
                },
                {
                    "mData": "currentStepDesc",
                    name: $.i18n.prop("nfv-templateDetail-executionTab-iui-field-currentStepDesc")
                },
                {"mData": "currentTime", name: $.i18n.prop("nfv-templateDetail-executionTab-iui-field-executionTime")},
                {"mData": "allSteps", name: "allSteps", "bVisible": false}
            ]
        },
        $queryEventsInfoUrl: "/api/nsoc/appinstance/operateschedule?instanceId=",
        $queryStepUrl: "",
        $getEventsCond: function () {
            var cond = {};
            return cond;
        },
        $initEventsTable: function () {
            console.log("initEventsTable ");
            var setting = {};
            setting.language = vm.$language;
            setting.paginate = false;
            setting.info = false;
            setting.columns = vm.executionTab.$eventsTabFields.table;
            setting.restUrl = vm.executionTab.$queryEventsInfoUrl;
            setting.tableId = vm.executionTab.$eventsTabId;
            serverPageTable.initDataTable(setting, vm.executionTab.$getEventsCond(),
                vm.executionTab.$eventsTabId + '_div');
        },
        $operation: "",
        steps: [],
        $init: function () {
            vm.executionTab.$initEventsTable();
        }
    },

});

var initParam = function () { //initialize template detail params
    var paramStr = window.location.search.substring(1);
    if (paramStr.length > 0) {
        var params = paramStr.split("&");
        var templateId = params[0].substring(params[0].indexOf('=') + 1);
        var flavor = params[1].substring(params[1].indexOf('=') + 1);
        avalon.scan();

        vm.templateId = templateId;
        vm.$restUrl.queryNodeTemplateUrl = commonUtil.format(vm.$restUrl.queryNodeTemplateUrl, templateId);

        if (flavor) {
            vm.$restUrl.queryNodeTemplateUrl += "?flavor=" + flavor;
        }

        vm.$init();
    }
};
initParam();