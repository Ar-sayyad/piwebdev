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
        $("#parameterList").append("<option  data-name=" + rankingParameters[key].name + " value=" + rankingParameters[key].name + ">" + rankingParameters[key].name + "</option>");
        $("#params").append("<option  data-name=" + rankingParameters[key].name + " value=" + rankingParameters[key].name + ">" + rankingParameters[key].name + "</option>");
     });
    $("#blockList").change(function() {
        var WebId = $("#parentTemplateList").val();
        var blockList = $("#blockList").val();
        var parentId = $("#parentTemplateList option:selected").attr("data-id");
        var name = $("#parentTemplateList option:selected").attr("data-name");
        if (blockList === 'CELL') {
            var url = baseServiceUrl + 'assetdatabases/' + parentId + '/elements?templateName=CELL&nameFilter=' + name + '*&selectedFields=Items.Name;Items.Webid;&searchFullHierarchy=true'
        } else {
            var url = baseServiceUrl + 'elements/' + WebId + '/elements?selectedFields=Items.Name;Items.Webid;'
        }
        var elemList = processJsonContent(url, 'GET', null);
        $.when(elemList).fail(function() {
            warningmsg("Cannot Find the Attributes.");
        });
        $.when(elemList).done(function() {
            var elemItems = (elemList.responseJSON.Items);
            $.each(elemItems, function(key) {
                var blockname = elemItems[key].Name;
                var url = baseServiceUrl + 'elements/' + elemItems[key].WebId + '/attributes?selectedFields=Items.Name;Items.WebId;';
                var attributesList = processJsonContent(url, 'GET', null);
                $.when(attributesList).fail(function() {
                    warningmsg("Cannot Find the Attributes.")
                });
                $.when(attributesList).done(function() {
                    var attributesItems = (attributesList.responseJSON.Items);
                    $.each(attributesItems, function(key) {
                        var Name = attributesItems[key].Name;
                        var sr=1;
                        $.each(rankingParameters, function(key1) {
                            if (rankingParameters[key1].name === Name) {
                                getVal( Name, attributesItems[key].WebId);                               
                            } else {}
                             sr++;
                        })
                    })
                })
            })
           // createTable();
        })
        
    });
    var array=[];
    function getVal(name, WebId) {
        var startDate = $('#startDate').val() + 'T00:00:00Z';
        var endDate = $('#startDate').val() + 'T23:59:59Z';
        var t = $('#example').DataTable();
        var url = baseServiceUrl + 'streams/' + WebId + '/end?startTime=' + startDate + '&endTime=' + endDate + '&searchFullHierarchy=true';
        var parameterList = processJsonContent(url, 'GET', null);
        $.when(parameterList).fail(function() {
            warningmsg("Cannot Find the Parameter.")
        });
        $.when(parameterList).done(function() {
            t.row.add([ name, parameterList.responseJSON.Value,0,0,0,0]).draw(!1);
//            array.push({name:name, value:parameterList.responseJSON.Value });
//            createTable(array);
        });
        
    }
         
         function createTable(myTab){
            var array=[];
            for (var i = 0; i <  rankingParameters.length; i++) {
                var rows = myTab.filter(function (pilot) {
                return pilot.name === rankingParameters[i].name;
            });
            array.push(rows);
        }
        console.log(array);
//        var col = [];
//        for (var i = 0; i < rows.length; i++) {
//            col.push(rows[i].name);
//        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.id = 'test_table';
        table.className = 'table table-bordered dataTable';
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i <  rankingParameters.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = rankingParameters[i].name;
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < rankingParameters.length; i++) {
            tr = table.insertRow(-1);
            for (var j = 0; j < rows.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = array[i][j].value;
            }
        }

//    for (var i=0;i<3;i++){
//            for(var j=0;j<5;j++){
//                console.log(array[i][j].value);
//            }
//        }
        
        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
         }
         
    var cols = [];
//    cols.push({
//            title: "Sr"
//        },            
//         {
//            title: "Block"
//        })
    $.each(rankingParameters, function(key1) {
        cols.push({
            title: rankingParameters[key1].name
        })
    });
    $('#example').DataTable({
        columns: cols
    });
    $("#parameterListt").change(function() {
        console.log('filteration task...!')
    });
     var blank_entry  = $('#containerTable').html(); 
    $("#addExpress").click(function(){       
        $("#containerTable").append(blank_entry);
    });
});
    function deleteParentElement(n) {
        n.parentNode.remove();
    }