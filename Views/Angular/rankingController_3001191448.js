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
                $("#parentTemplateList").append("<option  data-name=" + parentTemplateListItems[key].Name + " value=" + parentTemplateListItems[key].WebId + ">" + parentTemplateListItems[key].Name + "</option>")
            })
        })
    });
    $("#parentTemplateList").change(function() {
        $("#parentList").empty();
        $("#parentList").append("<option value='' selected disabled>---Select Block---</option>");
        var parentTemplateID = $("#parentTemplateList").val();
        var url = baseServiceUrl + 'elements/' + parentTemplateID + '/elements?selectedFields=Items.Name;Items.Webid;Items.TemplateName;';
        var parentList = processJsonContent(url, 'GET', null);
        $.when(parentList).fail(function() {
            warningmsg("Cannot Find the Element Templates.")
        });
        $.when(parentList).done(function() {
            var parentListItems = (parentList.responseJSON.Items);
            $.each(parentListItems, function(key) {
                $("#parentList").append("<option  data-name=" + parentListItems[key].Name + " value=" + parentListItems[key].WebId + ">" + parentListItems[key].Name + "</option>")
            })
        })
    });
    
    $("#parentList").change(function() {
          var startDate = $('#startDate').val() + 'T00:00:00Z';
        var endDate = $('#startDate').val() + 'T23:59:59Z';
        var unit = '';
        var tableData=[];
        $("#parameterList").empty();
        $("#parameterList").append("<option value='' selected disabled>---Select Parameter---</option>");
        var parentWebId = $("#parentList").val();
        var url = baseServiceUrl + 'elements/' + parentWebId + '/attributes?selectedFields=Items.Name;Items.Webid;';
        var attributesList = processJsonContent(url, 'GET', null);
        $.when(attributesList).fail(function() {
            warningmsg("Cannot Find the Attributes.");
        });
        $.when(attributesList).done(function() {
            var attributesItems = (attributesList.responseJSON.Items);
            var burl = baseServiceUrl + 'streamsets/value?';
            $.each(attributesItems, function(key) {
                var Name = attributesItems[key].Name;
                $.each(rankingParameters, function(key1) {
                    if (Name === rankingParameters[key1].name) {
                        burl += 'webid=' + attributesItems[key].WebId + '&';
                        $("#parameterList").append("<option  data-name=" + attributesItems[key].Name + " value=" + attributesItems[key].WebId + ">" + attributesItems[key].Name + "</option>")
                                      
                                       var url = baseServiceUrl + 'streams/' + attributesItems[key].WebId  + '/interpolated?startTime=' + startDate + '&endTime=' + endDate + '&interval=1h&searchFullHierarchy=true';
                                       var parameterList = processJsonContent(url, 'GET', null);
                                       $.when(parameterList).fail(function() {
                                           warningmsg("Cannot Find the Parameter.")
                                       });
                                       $.when(parameterList).done(function() {
                                           var parameterItems = (parameterList.responseJSON.Items);
                                           var srt = 1;
                                            tableData.push({name:Name});
                                            var nm='';
                                                $.each(parameterItems, function(key) {
                                                   // var Timestamp = parameterItems[key].Timestamp;
                                                    var val = (Math.round((parameterItems[key].Value) * 100) / 100);
                                                    if (isNaN(val)) {} else if (srt <= 10) {
//                                                        vdate = (Timestamp).substring(0, 10);
//                                                        vtime = (Timestamp).substring(11, 19);
//                                                        vdate = vdate.split('-');
//                                                        vtime = vtime.split(':');
                                                          tableData.push({ value:val });
                                                        //var val = Math.round((parameterItems[key].Value) * 100) / 100;
                                                        //unit = parameterItems[key].UnitsAbbreviation;
                                                       //$("#showData").append("<tr><td>" + val + "</td></tr>");
                                                    
                                                    }
                                                    srt++;
                                                });
                                                CreateTableFromJSON(tableData);
                                                 console.log(tableData); 
                                       });
                    }
                });
                   
            });
          
            burl += 'selectedFields=Items.Name;Items.Webid;Items.Value.Value;Items.Value.UnitsAbbreviation;&searchFullHierarchy=true';
           // console.log(burl);
          
            var atList = processJsonContent(burl, 'GET', null);
            $.when(atList).fail(function() {
                warningmsg("Cannot Find the Attributes.");
            });
            $.when(atList).done(function() {
                var attItems = (atList.responseJSON.Items);
              //console.log(attItems)
               $.each(attItems, function(key) {
                   var Name = attItems[key].Name;
                   var val = (Math.round((attItems[key].Value.Value) * 100) / 100);
                   $("#containerTable").append('<div class="filerDiv">\n\
                                        <input type="text" value="'+Name+'"  class="floatLeft form-control value" readonly id="value" placeholder="Parameter">\n\
                                        <select  class="floatLeft form-control operator" id="operator">\n\
                                            <option value="" selected="" disabled="">---Select Operator---</option>\n\
                                            <option value="=">=</option>\n\
                                            <option value=">">></option>\n\
                                            <option value="<"><</option>\n\
                                            <option value=">=">>=</option>\n\
                                            <option value="<="><=</option>\n\
                                        </select>\n\
                                        <input type="text" value="'+val+'"  class="floatLeft form-control number" id="number" placeholder="Number">\n\
                                        <button type="button" class="floatRight btn btn-danger remove"><i class="ti-close"></i></button> \n\
                                    </div>');
               });
            });
        });
        //makeTable(tableData);
        //console.log(tableData);
      //  CreateTableFromJSON(tableData);
    });

function makeTable(tableData){
     $("#showData").empty();
    var table='<table class="table table-bordered"><tr>';
    $.each(tableData, function(key) {
        //console.log(tableData[key].name);
        if(tableData[key].name !==undefined){
        table+="<th>"+tableData[key].name+"</th>";
    }
    });
     table+="</tr>";
     
    var count=(tableData.length/11);    
   
    //var sr=1;
      $.each(tableData, function(key) {  
           if(key/count===0 || key===0){
                table+="<tr>";
            }
           if(tableData[key].value !==undefined){
                table+="<td>"+tableData[key].value+"</td>";         
            }
            if(key/count===0){
                table+="</tr>";
            }
      //sr+count;
    });
    
      table+="</table>";
      $("#showData").append(table);
    console.log(table);
}
    function CreateTableFromJSON(myTab) {
        var col = [];
         var row = [];
        for (var i = 0; i < myTab.length; i++) {
             if (myTab[i].name) {
                  col.push(myTab[i].name);
             }
             if (myTab[i].value) {
                  row.push(myTab[i].value);
             }
             
//            for (var key in myTab[i]) {
//                if (col.indexOf(key) === -1) {
//                    col.push(key);
//                   // console.log(key);
//                }
//            }
        }
        //console.log(row);
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
                tr.appendChild(td);
             }
            
        
        }
    }
//         for (var i = 0; i < myTab.length; i++) {
//            tr = table.insertRow(-1);
//            for (var j = 0; j < col.length; j++) {
//                 var td = document.createElement("td");
//            td.innerHTML = myTab[i].value;
//            tr.appendChild(td)
////                var tabCell = tr.insertCell(-1);
////                tabCell.innerHTML = myTab[i].value;
//            }
        //}

//        for (var i = 0; i < myTab.length; i++) {
//            tr = table.insertRow(-1);
//            for (var j = 0; j < col.length; j++) {
//                var cell=myTab[i][col[j]];
//                console.log(cell);
//                if(cell!==undefined){
//                    tr = table.insertRow(-1);
//                    var tabCell = tr.insertCell(-1);   
//                        tabCell.innerHTML = myTab[i][col[j]]
//                    }
//            }
//            }
        
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
    $("#parameterList").change(function() {
        var myTab = [];
        var startDate = $('#startDate').val() + 'T00:00:00Z';
        var endDate = $('#startDate').val() + 'T23:59:59Z';
        var vdate = '';
        var vtime = '';
        var unit = '';
        var name = $("#parameterList option:selected").attr("data-name");
        var parameterWebId = $("#parameterList").val();
        $("#showData").append("<table>")
       // var tble = "<table>";
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
                   $("#showData").append("<tr><td>" + val + "</td></tr>");
                }
                srt++
            })
        });
        $("#showData").append("</table>");
//        console.log(tble);
//        $("#showData").html(tble)
    })
})