app.controller('rankingController', function($scope) {
    $scope.pagename = "Ranking";
    var now = new Date();
    $(function() {
        var emonth = '';
        var yr = '';
        var month = (now.getMonth() + 1);
        if (month === 1) {
            emonth = 12;
            yr = (now.getFullYear() - 1)
        } else {
            emonth = now.getMonth();
            yr = now.getFullYear()
        }
        var day = now.getDate();
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;
        var today = now.getFullYear() + '-' + month + '-' + day;
        $("#startDate").val(today);
        $("#startDate").datepicker({
            dateFormat: 'yy-mm-dd',
            maxDate: '0'
        });
        $("#endDate").val(today);
        $("#endDate").datepicker({
            dateFormat: 'yy-mm-dd',
            maxDate: '0'
        })
    });
    $("#chartView").click(function() {
        $("#tableViewData").hide();
        $("#chartViewData").show()
    });
    $("#tableView").click(function() {
        $("#tableViewData").show();
        $("#chartViewData").hide()
    });
    var url = baseServiceUrl + 'assetdatabases?path=\\\\' + afServerName + '\\' + afDatabaseName;
    var ajaxEF = processJsonContent(url, 'GET', null);
    $.when(ajaxEF).fail(function() {
        warningmsg("Cannot Find the WebId.")
    });
    $.when(ajaxEF).done(function() {
        var WebId = (ajaxEF.responseJSON.WebId);
        var url = baseServiceUrl + 'assetdatabases/' + WebId + '/elements?templateName=' + defaultRankingTemplate + '&selectedFields=Items.Name;Items.Webid;Items.TemplateName;&searchFullHierarchy=true&searchFullHierarchy=true';
        var parentTemplateList = processJsonContent(url, 'GET', null);
        $.when(parentTemplateList).fail(function() {
            warningmsg("Cannot Find the Element Templates.")
        });
        $.when(parentTemplateList).done(function() {
            var parentTemplateListItems = (parentTemplateList.responseJSON.Items);
            $.each(parentTemplateListItems, function(key) {
                $("#parentTemplateList").append("<option data-id=" + WebId + "  data-name=" + parentTemplateListItems[key].Name + " value=" + parentTemplateListItems[key].WebId + ">" + parentTemplateListItems[key].Name + "</option>")
            })
        })
    });
    $.each(rankingParameters, function(key) {
        $("#parameterList").append("<option  data-name=" + rankingParameters[key].name + " value=" + rankingParameters[key].name + ">" + rankingParameters[key].name + "</option>")
    });
    $("#blockList").change(function() {
        var WebId = $("#parentTemplateList").val();
        var blockList = $("#blockList").val();
        var parentId = $("#parentTemplateList option:selected").attr("data-id");
        var name = $("#parentTemplateList option:selected").attr("data-name");
        var startDate = $('#startDate').val() + 'T00:00:00Z';
        var endDate = $('#startDate').val() + 'T23:59:59Z';
        var tableData = [];
        if (blockList === 'CELL') {
            var url = baseServiceUrl + 'assetdatabases/' + parentId + '/elements?templateName=CELL&nameFilter=' + name + '*&selectedFields=Items.Name;Items.Webid;&searchFullHierarchy=true'
        } else {
            var url = baseServiceUrl + 'elements/' + WebId + '/elements?selectedFields=Items.Name;Items.Webid;'
        }
        console.log(url);
        var elemList = processJsonContent(url, 'GET', null);
        $.when(elemList).fail(function() {
            warningmsg("Cannot Find the Attributes.")
        });
        $.when(elemList).done(function() {
            var elemItems = (elemList.responseJSON.Items);
            console.log(elemItems);
            $.each(elemItems, function(key) {
                var url = baseServiceUrl + 'elements/' + elemItems[key].WebId + '/attributes';
                var attributesList = processJsonContent(url, 'GET', null);
                $.when(attributesList).fail(function() {
                    warningmsg("Cannot Find the Attributes.")
                });
                $.when(attributesList).done(function() {
                    var attributesItems = (attributesList.responseJSON.Items);
                    console.log(attributesItems);
                    $.each(attributesItems, function(key) {
                        var Name = attributesItems[key].Name;
                        $.each(rankingParameters, function(key1) {
                            if (rankingParameters[key1].name === Name) {
                                var url = baseServiceUrl + 'streams/' + attributesItems[key].WebId + '/end?startTime=' + startDate + '&endTime=' + endDate + '&searchFullHierarchy=true';
                                var parameterList = processJsonContent(url, 'GET', null);
                                $.when(parameterList).fail(function() {
                                    warningmsg("Cannot Find the Parameter.")
                                });
                                $.when(parameterList).done(function() {
                                    var parameterItems = (parameterList.responseJSON);
                                    console.log(parameterItems.Value);
                                    var srt = 1;
                                    tableData.push({
                                        name: Name
                                    });
                                    $.each(parameterList, function(key) {
                                        var val = (Math.round((parameterItems.Value) * 100) / 100);
                                        if (isNaN(val)) {} else {
                                            tableData.push({
                                                value: val
                                            })
                                        }
                                        srt++
                                    });
                                    console.log(tableData)
                                })
                            }
                        })
                    })
                })
            })
        })
    });

    function makeTable(tableData) {
        $("#showData").empty();
        var table = '<table class="table table-bordered"><tr>';
        $.each(tableData, function(key) {
            if (tableData[key].name !== undefined) {
                table += "<th>" + tableData[key].name + "</th>"
            }
        });
        table += "</tr>";
        var count = (tableData.length / 11);
        $.each(tableData, function(key) {
            if (key / count === 0 || key === 0) {
                table += "<tr>"
            }
            if (tableData[key].value !== undefined) {
                table += "<td>" + tableData[key].value + "</td>"
            }
            if (key / count === 0) {
                table += "</tr>"
            }
        });
        table += "</table>";
        $("#showData").append(table);
        console.log(table)
    }

    function CreateTableFromJSON(myTab) {
        var col = [];
        var row = [];
        for (var i = 0; i < myTab.length; i++) {
            if (myTab[i].name) {
                col.push(myTab[i].name)
            }
            if (myTab[i].value) {
                row.push(myTab[i].value)
            }
        }
        var table = document.createElement("table");
        table.id = 'test_table';
        table.className = 'table table-bordered dataTable';
        var tr = table.insertRow(-1);
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = col[i];
            tr.appendChild(th)
        }
        for (var i = 0; i < myTab.length; i++) {
            tr = table.insertRow(-1);
            for (var j = 0; j < col.length; j++) {
                if (myTab[i].value) {
                    var td = document.createElement("td");
                    td.innerHTML = myTab[i].value;
                    tr.appendChild(td)
                }
            }
        }
        var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table)
    }

    function CreateTable(myTab) {
        $('#example').DataTable({
            "pageLength": 20,
            "lengthMenu": [
                [10, 20, 50, 100, -1],
                [10, 20, 50, 100, "All"]
            ],
            dom: 'Bfrtip',
            buttons: ['pageLength', 'copy', 'csv', 'excel', 'print'],
            columns: [{
                title: "Sr.No."
            }, {
                title: "Name"
            }, {
                title: "Value(Unit)"
            }, {
                title: "Date"
            }]
        })
    }
    $("#parameterListt").change(function() {
        var myTab = [];
        var startDate = $('#startDate').val() + 'T00:00:00Z';
        var endDate = $('#startDate').val() + 'T23:59:59Z';
        var vdate = '';
        var vtime = '';
        var unit = '';
        var name = $("#parameterList option:selected").attr("data-name");
        var parameterWebId = $("#parameterList").val();
        $("#showData").append("<table>")
        $("#showData").append("<tr><th>" + name + "</th></tr>");
        var url = baseServiceUrl + 'streams/' + parameterWebId + '/interpolated?startTime=' + startDate + '&endTime=' + endDate + '&interval=1h&searchFullHierarchy=true';
        var parameterList = processJsonContent(url, 'GET', null);
        $.when(parameterList).fail(function() {
            warningmsg("Cannot Find the Parameter.")
        });
        $.when(parameterList).done(function() {
            var parameterItems = (parameterList.responseJSON.Items);
            var srt = 1;
            $.each(parameterItems, function(key) {
                var Timestamp = parameterItems[key].Timestamp;
                var val = (Math.round((parameterItems[key].Value) * 100) / 100);
                if (isNaN(val)) {} else if (srt <= 10) {
                    vdate = (Timestamp).substring(0, 10);
                    vtime = (Timestamp).substring(11, 19);
                    vdate = vdate.split('-');
                    vtime = vtime.split(':');
                    var val = Math.round((parameterItems[key].Value) * 100) / 100;
                    unit = parameterItems[key].UnitsAbbreviation;
                    $("#showData").append("<tr><td>" + val + "</td></tr>")
                }
                srt++
            })
        });
        $("#showData").append("</table>")
    })
})