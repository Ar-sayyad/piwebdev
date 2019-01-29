app.controller('rankingController', function($scope) { 
    $scope.pagename = "Ranking";
   // var t = $('#example').DataTable();
    var now = new Date();
    $(function() {  
       var emonth = '';
       var yr='';
       var month = (now.getMonth()+1); 
            if(month===1){
                 emonth = 12;
                 yr = (now.getFullYear()-1);
             }else{
                emonth = now.getMonth();
                yr = now.getFullYear();
             }
       var day = now.getDate();
       if (month < 10) 
           month = "0" + month;
       if (day < 10) 
           day = "0" + day;
       //var start = now.getFullYear() +'-'+month + '-' + (day-1);       
       var today = now.getFullYear()+'-'+month + '-' + day;
        $("#startDate").val(today);
        $("#startDate").datepicker({dateFormat: 'yy-mm-dd',maxDate : '0'});
       $("#endDate").val(today);
        $("#endDate").datepicker({dateFormat: 'yy-mm-dd',maxDate : '0'});
    });
  
    $("#chartView").click(function(){
        $("#tableViewData").hide();
        $("#chartViewData").show();
    });
    $("#tableView").click(function(){
        $("#tableViewData").show();
        $("#chartViewData").hide();
    });
 
    var url = baseServiceUrl+'assetdatabases?path=\\\\' + afServerName + '\\' + afDatabaseName; 
       var ajaxEF =  processJsonContent(url, 'GET', null);
           $.when(ajaxEF).fail(function () {
               warningmsg("Cannot Find the WebId.");
           });
            $.when(ajaxEF).done(function () {
               var WebId = (ajaxEF.responseJSON.WebId);                
                /****TEMPLATE ELEMENT SEARCH BY TEMPLATE NAME START****/
                var url = baseServiceUrl + 'assetdatabases/' + WebId + '/elements?templateName=' + defaultRankingTemplate+'&selectedFields=Items.Name;Items.Webid;Items.TemplateName;&searchFullHierarchy=true&searchFullHierarchy=true';
               // console.log(url);
                var parentTemplateList =  processJsonContent(url, 'GET', null);                    
                    $.when(parentTemplateList).fail(function () {
                        warningmsg("Cannot Find the Element Templates.");
                    });
                    $.when(parentTemplateList).done(function () {
                      var parentTemplateListItems = (parentTemplateList.responseJSON.Items);
                      $.each(parentTemplateListItems,function(key) {
                            $("#parentTemplateList").append("<option  data-name="+parentTemplateListItems[key].Name+" value="+parentTemplateListItems[key].WebId+">"+parentTemplateListItems[key].Name+"</option>"); 
                      }); 
                    });  
                    /****TEMPLATE ELEMENT SEARCH BY TEMPLATE NAME END****/ 
               });
    
    /*****ZONE ELEMENT ONCHNAGE START****/
            $("#parentTemplateList").change(function (){
                    $("#parentList").empty();
                    $("#parentList").append("<option value='' selected disabled>---Select Block---</option>");
                 var parentTemplateID = $("#parentTemplateList").val();
         
                 var url = baseServiceUrl + 'elements/' + parentTemplateID + '/elements?selectedFields=Items.Name;Items.Webid;Items.TemplateName;';
                 //console.log(url);
                      var parentList =  processJsonContent(url, 'GET', null);                    
                        $.when(parentList).fail(function () {
                            warningmsg("Cannot Find the Element Templates.");
                      });
                      $.when(parentList).done(function () {
                         var parentListItems = (parentList.responseJSON.Items);
                            $.each(parentListItems,function(key) {
                                $("#parentList").append("<option  data-name="+parentListItems[key].Name+" value="+parentListItems[key].WebId+">"+parentListItems[key].Name+"</option>"); 
                            }); 
                      });  
            });          
                    
    /*****GET ZONE BLOCK ONCHNAGE DATA START****/
     
    $("#parentList").change(function (){
            //$('#example').empty();
                //$('#example').append('<thead><tr>');
                //var parentname = $("#parentList option:selected").attr("data-name");//BLOCK ELEMENT NAME FOR IFRAME GRAPH GENERATION
                $("#parameterList").empty();
                $("#parameterList").append("<option value='' selected disabled>---Select Parameter---</option>");
            var parentWebId = $("#parentList").val();
            var url = baseServiceUrl + 'elements/' + parentWebId + '/attributes?selectedFields=Items.Name;Items.Webid;';
            //console.log(url);
            var attributesList =  processJsonContent(url, 'GET', null);
                $.when(attributesList).fail(function () {
                    warningmsg("Cannot Find the Attributes.");
                });            
                $.when(attributesList).done(function () {
                     var attributesItems = (attributesList.responseJSON.Items);   
                       var burl = baseServiceUrl + 'streamsets/value?';
                     $.each(attributesItems,function(key) {  
                         var Name = attributesItems[key].Name; 
                        
                         $.each(rankingParameters,function(key1) {
                             if(Name===rankingParameters[key1].name){
                                 burl+='webid='+attributesItems[key].WebId+'&';
                                   $("#parameterList").append("<option  data-name="+attributesItems[key].Name+" value="+attributesItems[key].WebId+">"+attributesItems[key].Name+"</option>"); 
                                 }
                          });
                           
                      }); 
                      burl+='selectedFields=Items.Name;Items.Webid;Items.Value.Value;Items.Value.UnitsAbbreviation;&searchFullHierarchy=true';
                      console.log(burl);
                           var atList =  processJsonContent(burl, 'GET', null);
                                $.when(atList).fail(function () {
                                    warningmsg("Cannot Find the Attributes.");
                                });            
                                $.when(atList).done(function () {
                                     var attItems = (atList.responseJSON.Items);  
                                     console.log(attItems);
                                 });
                });  
               // $('#example').append('</tr></thead>');
               // console.log(columns);
                 //CreateTable(columns);
           });
           
     function CreateTableFromJSO(myTab) {
        var col = [];
        for (var i = 0; i < myTab.length; i++) {
            for (var key in myTab[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        var table = document.createElement("table");
        table.id = 'test_table';
        table.className = 'table table-bordered dataTable';
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

//        for (var i = 0; i < col.length; i++) {
//            var th = document.createElement("tr");      // TABLE HEADER.
//            th.innerHTML = col[i];
//            tr.appendChild(th);
//        }
      
            //var tabCell = tr.insertCell(-1);
              var th = document.createElement("th");  
                th.innerHTML = "Rank";
                tr.appendChild(th);
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < myTab.length; i++) {

            //tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = myTab[i][col[j]];
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("topexample");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);   
    }
 function CreateTableFromJSON(myTab) {
       
        // EXTRACT VALUE FOR HTML HEADER. 
        // ('Book ID', 'Book Name', 'Category' and 'Price')
        var col = [];
        for (var i = 0; i < myTab.length; i++) {
            for (var key in myTab[i]) {
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
        for (var i = 0; i < myTab.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = myTab[i][col[j]];
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
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
       // data:myTab,
        columns: [{
            title: "Sr.No."
        }, {
            title: "Name"
        }, {
            title: "Value(Unit)"
        }, {
            title: "Date"
        }]
    });
}
/*****GET ZONE BLOCK ONCHNAGE DATA END****/  
        $("#parameterList").change(function (){            
            // $('#example').empty();
            var myTab=[];
              var startDate = $('#startDate').val()+'T00:00:00Z';
              var endDate = $('#startDate').val()+'T23:59:59Z';
              var vdate='';
              var vtime='';
              var unit='';
              
              var name = $("#parameterList option:selected").attr("data-name");
               //cols.push({ name });
              var parameterWebId = $("#parameterList").val();
              var tble="<table>";
//              var tr = document.getElementById('example').tHead.children[0];
//                tr.insertCell(0).outerHTML = "<th>"+name+"</th>" ;
//              var tr = document.getElementById('example').tHead.children[0];
//                     tr.insertCell(1).outerHTML = "<th>"+name+"</th>" 
//              var tr = document.getElementById('example').tHead.children[0],
//                    th = document.createElement('th');
//                th.innerHTML = name;
                //tr.appendChild(th);
              // t.row.add([name]).draw(!1);
              tble+="<tr><th>"+name+"</th></tr>";
              var url = baseServiceUrl+'streams/' + parameterWebId + '/interpolated?startTime='+startDate+'&endTime='+endDate+'&interval=1h&searchFullHierarchy=true';
            //console.log(url);
            var parameterList =  processJsonContent(url, 'GET', null);
                $.when(parameterList).fail(function () {
                    warningmsg("Cannot Find the Parameter.");
                });   
                 $.when(parameterList).done(function () {
                     var parameterItems = (parameterList.responseJSON.Items);
                     //console.log(parameterItems);
                     var srt=1;
                     $.each(parameterItems,function(key) {  
                          var Timestamp = parameterItems[key].Timestamp;
                        var val = (Math.round((parameterItems[key].Value) * 100) / 100);                         
                        if(isNaN(val)){
                           // console.log(val);////Skipping NaN Values
                        }else if(srt<=10){                            
                            vdate = (Timestamp).substring(0,10);//start date
                            vtime = (Timestamp).substring(11,19);//start time                                   
                                    vdate = vdate.split('-');//start date split array
                                    vtime = vtime.split(':');//start time split array
                            var val = Math.round((parameterItems[key].Value) * 100) / 100;
                            //var dt = Date.UTC(vdate[0],(vdate[1]-1),vdate[2],vtime[0],vtime[1],vtime[2]);
                            //data1.push([dt,val]);
                            //xAxis.push(Timestamp); 
                            unit = parameterItems[key].UnitsAbbreviation;   
                              tble+="<tr><td>"+val+"</td></tr>";
                               // tr.insertCell(0).outerHTML = "<td>"+val+"</td>" ;
//                               var row = document.getElementsByTagName("tr")[0];
//var x = row.insertCell(-1);
//x.innerHTML="New cell";
//                                var table = document.createElement("TABLE");
//         table.id = 'test_table';
//        table.className = 'table table-bordered dataTable';
//        var row   = table.insertRow(-1);
//var t = $('#example').DataTable();
//            var table = document.getElementById("example");
//             var row = table.insertRow(0);
//            var cell1 = row.insertCell(0);
//             var tr = document.getElementById('example').insertRow(0);
//                tr.insertCell(0).innerHTML = val ;
//            cell1.innerHTML = val;
            //myTab.push({ Sr:srt,name:name,value:val })
              // rows.push({ val });
                             //t.append('<td>'+val+'</td>');
                             //t.row.add( [val] ).draw( false );
                            //myTab.push({"Sr.No":srt,"Element":name,"Date":vdate[2]+'/'+(vdate[1])+'/'+vdate[0],"Value":val+'('+unit+')'});
                            //$("#containerTable").append('<tr><td>'+val+'</td></tr>');
                        }
                           srt++;
                     });
//                  console.log(cols);
//                  console.log(rows);
                    // CreateTableFromJSON(myTab);
                 });
                 
                    tble+="</table>";
                    console.log(tble);
                    $("#showData").html(tble);
        });
     

});
