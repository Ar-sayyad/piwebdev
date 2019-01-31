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
            yr = now.getFullYear();
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
        $("#chartViewData").show();
    });
    $("#tableView").click(function() {
        $("#tableViewData").show();
        $("#chartViewData").hide();
    });
    var url = baseServiceUrl + 'assetdatabases?path=\\\\' + afServerName + '\\' + afDatabaseName;
    var ajaxEF = processJsonContent(url, 'GET', null);
    $.when(ajaxEF).fail(function() {
        warningmsg("Cannot Find the WebId.");
    });
    $.when(ajaxEF).done(function() {
        var WebId = (ajaxEF.responseJSON.WebId);
        var url = baseServiceUrl + 'assetdatabases/' + WebId + '/elements?templateName=' + defaultRankingTemplate + '&selectedFields=Items.Name;Items.Webid;Items.TemplateName;&searchFullHierarchy=true&searchFullHierarchy=true';
        var parentTemplateList = processJsonContent(url, 'GET', null);
        $.when(parentTemplateList).fail(function() {
            warningmsg("Cannot Find the Element Templates.");
        });
        $.when(parentTemplateList).done(function() {
            var parentTemplateListItems = (parentTemplateList.responseJSON.Items);
            $.each(parentTemplateListItems, function(key) {
                $("#parentTemplateList").append("<option data-id="+WebId+"  data-name=" + parentTemplateListItems[key].Name + " value=" + parentTemplateListItems[key].WebId + ">" + parentTemplateListItems[key].Name + "</option>")
            });
        });
    });
    /****Load parameters from Confif file****/
        $.each(rankingParameters, function(key) {
            $("#parameterList").append("<option  data-name=" + rankingParameters[key].name + " value=" + rankingParameters[key].name + ">" + rankingParameters[key].name + "</option>")
         });
//    $("#parentTemplateList").change(function() {
//        $("#parentList").empty();
//        $("#parentList").append("<option value='' selected disabled>---Select Block---</option>");
//        var parentTemplateID = $("#parentTemplateList").val();
//        var url = baseServiceUrl + 'elements/' + parentTemplateID + '/elements?selectedFields=Items.Name;Items.Webid;Items.TemplateName;';
//        var parentList = processJsonContent(url, 'GET', null);
//        $.when(parentList).fail(function() {
//            warningmsg("Cannot Find the Element Templates.")
//        });
//        $.when(parentList).done(function() {
//            var parentListItems = (parentList.responseJSON.Items);
//            $.each(parentListItems, function(key) {
//                $("#parentList").append("<option  data-name=" + parentListItems[key].Name + " value=" + parentListItems[key].WebId + ">" + parentListItems[key].Name + "</option>")
//            })
//        })
//    });
    
    $("#blockList").change(function() {
        var WebId = $("#parentTemplateList").val();
        var blockList = $("#blockList").val();
        var parentId = $("#parentTemplateList option:selected").attr("data-id");        
        var name = $("#parentTemplateList option:selected").attr("data-name");        
        var startDate = $('#startDate').val() + 'T00:00:00Z';
        var endDate = $('#startDate').val() + 'T23:59:59Z';
        var tableData=[];
        if(blockList==='CELL'){
            var url = baseServiceUrl + 'assetdatabases/' + parentId + '/elements?templateName=CELL&nameFilter='+name+'*&selectedFields=Items.Name;Items.Webid;&searchFullHierarchy=true';
        }else{
            var url = baseServiceUrl + 'elements/' + WebId + '/elements?selectedFields=Items.Name;Items.Webid;';
        }       
       // console.log(url);
        var elemList = processJsonContent(url, 'GET', null);
        $.when(elemList).fail(function() {
            warningmsg("Cannot Find the Attributes.");
        });
        $.when(elemList).done(function() {
            var elemItems = (elemList.responseJSON.Items);        
           // console.log(elemItems);
            $.each(elemItems, function(key) {
                var blockname = elemItems[key].Name; 
                  var url = baseServiceUrl + 'elements/' + elemItems[key].WebId + '/attributes?selectedFields=Items.Name;Items.WebId;';                  
                   var attributesList = processJsonContent(url, 'GET', null);
                        $.when(attributesList).fail(function() {
                            warningmsg("Cannot Find the Attributes.");
                        });
                        $.when(attributesList).done(function() {                          
                            var attributesItems = (attributesList.responseJSON.Items); 
                             //console.log(attributesItems);
                            // tableData.push({blockname: blockname}); 
                                  $.each(attributesItems, function(key) {
                                      var Name= attributesItems[key].Name;
                                       //tableData.push({name:attributesItems[key].Name});
                                $.each(rankingParameters, function(key1) {
                                    if (rankingParameters[key1].name===Name) {
                                        getVal(blockname,Name,attributesItems[key].WebId);
                                        //console.log(val);
//                                         var url = baseServiceUrl + 'streams/' + attributesItems[key].WebId  + '/end?startTime=' + startDate + '&endTime=' + endDate + '&searchFullHierarchy=true';
//                                        //console.log(url);
//                                                       var parameterList = processJsonContent(url, 'GET', null);
//                                                       $.when(parameterList).fail(function() {
//                                                           warningmsg("Cannot Find the Parameter.")
//                                                       });
//                                                       $.when(parameterList).done(function() {                                                              
//                                                           var parameterItems = (parameterList.responseJSON);
//                                                           //console.log(parameterList.responseJSON.Value);
//                                                            tableData.push({name:attributesItems[key].Name, value: (Math.round((parameterList.responseJSON.Value) * 100) / 100) });
//                                                        CreateTableFromJSON(tableData);
//                                                       });
//                                                        
                                                      // console.log(tableData); 
                                                       
                                    }
                                    else{}
                                   
                                    // CreateTableFromJSON(tableData);
                          // console.log(tableData); 
                                });
                                  
                            });
                           // console.log(tableData);
                           //CreateTableFromJSON();
                            });
                           
            });           // console.log(burl);
          
        });
        //makeTable(tableData);
            // console.log(myBooks);
       // CreateTableFromJSON(myBooks);
    });
     
function getVal (blockname,name,WebId){
    var startDate = $('#startDate').val() + 'T00:00:00Z';
    var endDate = $('#startDate').val() + 'T23:59:59Z';
    var t = $('#example').DataTable();
    var url = baseServiceUrl + 'streams/' + WebId  + '/end?startTime=' + startDate + '&endTime=' + endDate + '&searchFullHierarchy=true';
                                        //console.log(url);
                                                       var parameterList = processJsonContent(url, 'GET', null);
                                                       $.when(parameterList).fail(function() {
                                                           warningmsg("Cannot Find the Parameter.")
                                                       });
                                                     
                                                       $.when(parameterList).done(function() {             
                                                           // val = (Math.round((parameterList.responseJSON.Value) * 100) / 100);
                                                      //  CreateTableFromJSON(tableData);
                                                      //valArr.push({name:name,value:parameterList.responseJSON.Value});
                                                      // console.log(blockname+" "+name+" "+parameterList.responseJSON.Value);                                                       
                                                        t.row.add([blockname,name, parameterList.responseJSON.Value]).draw(!1)
                                                      
                                                       });
                                                       
                                                      
                                                        
}
function CreateTableFromJSON(myBooks) {
    console.log(myBooks);
               // EXTRACT VALUE FOR HTML HEADER. 
        // ('Book ID', 'Book Name', 'Category' and 'Price')
        var col = [];
        for (var i = 0; i < myBooks.length; i++) {
            for (var key in myBooks[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
         table.id = 'test_table';
        table.className = 'table table-bordered dataTable';
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < myBooks.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = myBooks[i][col[j]];
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
    }
    
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
    function CreateTableFromJSON2(myTab) {
       // console.log(myTab);
        var col = [];
         var row = [];
        for (var i = 0; i < myTab.length; i++) {             
             if (myTab[i].value) {
                    col.push(myTab[i].value);
             }
             
//            for (var key in myTab[i]) {
//                if (col.indexOf(key) === -1) {
//                    col.push(key.name);
//                   // console.log(key);
//                }
//            }
        }
     //  console.log(col);
        var table = document.createElement("table");
        table.id = 'test_table';
        table.className = 'table table-bordered dataTable';
        var tr = table.insertRow(-1);
        for (var i = 0; i < rankingParameters.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = rankingParameters[i].name;
            tr.appendChild(th);
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
//CreateTable();
    var cols=[];
   $.each(rankingParameters, function(key1) {
        cols.push({title:rankingParameters[key1].name});                
     });
        $('#example').DataTable({
            //"pageLength": 10,
//            "lengthMenu": [
//                [10, 20, 50, 100, -1],
//                [10, 20, 50, 100, "All"]
//            ],
          //  dom: 'Bfrtip',
            //buttons: ['pageLength', 'copy', 'csv', 'excel', 'print'],
           // data:myTab,
            columns: cols
//                    [ {
//                title: "Block"
//            },{
//                title: "Parameter"
//            }, {
//                title: "Values"
//            }]
        });
    
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