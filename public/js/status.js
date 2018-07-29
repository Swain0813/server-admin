var webroot = "";
var App = [];
App.status = [];

App.status.init = function () {
    var grid_selector = "#grid-table";

    var parent_column = $(grid_selector).closest('[class*="col-"]');
    $(window).on('resize.jqGrid', function () {
        var tableHeight = 0;
        if (window.screen.width <= 1366) {
            tableHeight = $(window).height() - 600;
        } else {
            tableHeight = $(window).height() - 600;
        }
        $(grid_selector).jqGrid('setGridWidth', parent_column.width());
        $(grid_selector).parents('div.ui-jqgrid-bdiv').css({
            'height': 'auto',
            'min-height': tableHeight + 'px'
        });
    });
    // resize on sidebar collapse/expand
    $(document).on(
        'settings.ace.jqGrid',
        function (ev, event_name, collapsed) {
            if (event_name === 'sidebar_collapsed'
                || event_name === 'main_container_fixed') {
                setTimeout(function () {
                    $(grid_selector).jqGrid('setGridWidth',
                        parent_column.width());
                }, 0);
            }
        })

    jQuery(grid_selector).jqGrid(
        {
            url: webroot + "/getStatuList",
            datatype: "json",
            colNames: ['设备id', '设备类型','设备所在地址', '设备状态'],
            colModel: [{name: 'mscId', index: 'mscId', width: 150, sortable: false},
                {name: 'status', index: 'status', width: 150, sortable: false, formatter: setMscType},
                {name: 'address', index: 'address', width: 150, sortable: false},
                {name: 'status', index: 'status', width: 150, sortable: false, formatter: setStatus}
            ],
            viewrecords: true,
            rowNum: 20,
            rowList: [20, 100, 500, 1000],
            pager: '#grid-pager',
            jsonReader: {
                total: 'totalPage',
                records: 'count',
                root: 'data',
                repeatitems: true
            },
            altRows: true,
            multiselect: true,
            multiboxonly: true,
            loadComplete: function (data) {
                var table = this;
                var pageNow = $(grid_selector).jqGrid('getGridParam', 'page');// 当前页
                var limitNow = $(grid_selector).jqGrid('getGridParam', 'rowNum');// 当前行数
                var totalPage = data.total;// 总页数
                if (totalPage == 0) {
                    $(".ui-pg-input").val(0);
                    $("td.ui-corner-all").addClass("ui-state-disabled");
                } else {
                    if (pageNow > totalPage) {
                        var pageInfo = ($(".ui-pg-selbox").val()
                            * (totalPage - 1) + 1)
                            + " - "
                            + data.records
                            + "\u3000共  "
                            + data.records + " 条";
                        if (totalPage == 1) {
                            $("td.ui-corner-all").addClass(
                                "ui-state-disabled");
                        }
                        $(".ui-pg-input").val(totalPage);
                        $(grid_selector).jqGrid('setGridParam', {
                            page: totalPage
                        });
                        $("#grid-pager_right > div").text(pageInfo);
                        $("#next_grid-pager").addClass("ui-state-disabled")
                            .next().addClass("ui-state-disabled");
                    }
                }

                setTimeout(function () {
                    updatePagerIcons(table);
                }, 0);
            }
        });
    $(window).triggerHandler('resize.jqGrid');

    $(document).one('ajaxloadstart.page', function (e) {
        $(grid_selector).jqGrid('GridUnload');
        $('.ui-jqdialog').remove();
    });

    $.ajax({
        type: "post",
        url: webroot + "/getOnlineInfo",
        async :false,
        success: function(data){
            if (data.code == "0000"){
                $("#fact1").html(data.data.box_on);
                $("#fact2").html(data.data.box_off);
                $("#fact3").html(data.data.app_on);
                $("#fact4").html(data.data.app_off);
            }
        }
    })
}

function queryMscInfo() {
    $.ajax({
        type: "post",
        url: webroot + "/getMscInfo",
        data:{
            mscId:$("#mscId_search").val()
        },
        async :false,
        success: function(data){
            if (data.code == "0000"){
                if (data.address!=null){
                    $("#address_result").val(data.address);
                }else{
                    $("#address_result").val("-");
                }
                $("#status_result").val(data.status);
            }
        }
    })
}

function changeStatus() {
    $.ajax({
        type: "post",
        url: webroot + "/changeStatus",
        data:{
            mscId:$("#mscId_search").val()
        },
        async :false,
        success: function(data){
            if (data.code =="0000"){
                alertmsg("warning","至少选择一条记录进行操作");
                queryMscInfo();
            }
        }
    })
}

function setStatus(cellvalue, options, rowObject) {
    switch (cellvalue) {
        case "1":
            return '离线';
        case "2":
            return '离线';
        case "3":
            return '在线';
        case "4":
            return '在线';
        default:
            return '未知';
    }
}

function setMscType(cellvalue, options, rowObject) {
    switch (cellvalue) {
        case "1":
            return '主屏';
        case "2":
            return '从屏';
        case "3":
            return '主屏';
        case "4":
            return '从屏';
        default:
            return '未知';
    }
}
function queryStatus() {
    $("#grid-table").jqGrid('setGridParam', {
        datatype: 'json',
        postData: getQueryParam(), // 发送数据
        page: 1,
    }).trigger("reloadGrid"); // 重新载入
}

function getQueryParam() {
    var param;
    param = {
        'mscId': $("#mscId").val(),
        'mscType': $("#mscType").val(),
        'status': $("#status").val()
    };
    return param;
};

function reset() {
    $("#mscId").val("");
    $("#mscType").val("");
    $("#status").val("");
    queryStatus();
}


function updatePagerIcons(table) {
    var replacement = {
        'ui-icon-seek-first': 'ace-icon fa fa-angle-double-left bigger-140',
        'ui-icon-seek-prev': 'ace-icon fa fa-angle-left bigger-140',
        'ui-icon-seek-next': 'ace-icon fa fa-angle-right bigger-140',
        'ui-icon-seek-end': 'ace-icon fa fa-angle-double-right bigger-140'
    };
    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon')
        .each(function () {
            var icon = $(this);
            var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

            if ($class in replacement)
                icon.attr('class', 'ui-icon ' + replacement[$class]);
        })
}



