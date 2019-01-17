app.controller('rankingController', function($scope) { 
    $scope.pagename = "Ranking";
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
                var url = baseServiceUrl + 'assetdatabases/' + WebId + '/elementtemplates?field=Categories&query='+filterCategoryName+'&searchFullHierarchy=true';
                var parentTemplateList =  processJsonContent(url, 'GET', null);                    
                    $.when(parentTemplateList).fail(function () {
                        warningmsg("Cannot Find the Element Templates.");
                    });
                    $.when(parentTemplateList).done(function () {
                      var parentTemplateListItems = (parentTemplateList.responseJSON.Items);
                      var sr= 1;
                        $.each(parentTemplateListItems,function(key) {
                            $("#parentTemplateList").append("<option  data-id="+WebId+" value="+parentTemplateListItems[key].Name+">"+parentTemplateListItems[key].Name+"</option>"); 
                            sr++;
                        }); 
                    });  
                    /****TEMPLATE ELEMENT SEARCH BY TEMPLATE NAME END****/ 
               });
    
    /*****ZONE ELEMENT ONCHNAGE START****/
            $("#parentTemplateList").change(function (){
                var parentTemplateID = $("#parentTemplateList option:selected").attr("data-id");//BLOCK ELEMENT NAME FOR IFRAME GRAPH GENERATION
                    $("#parentList").empty();
                    $("#parentList").append("<option value='' selected disabled>---Select Block---</option>");
                 var parentTemplateName = $("#parentTemplateList").val();
         
                 var url = baseServiceUrl + 'assetdatabases/' + parentTemplateID + '/elements?templateName=' + parentTemplateName+'&searchFullHierarchy=true';
                      var parentList =  processJsonContent(url, 'GET', null);                    
                        $.when(parentList).fail(function () {
                            warningmsg("Cannot Find the Element Templates.");
                      });
                      $.when(parentList).done(function () {
                         var parentListItems = (parentList.responseJSON.Items);
                         var sr= 1;
                            $.each(parentListItems,function(key) {
                                $("#parentList").append("<option  data-name="+parentListItems[key].Name+" value="+parentListItems[key].WebId+">"+parentListItems[key].Name+"</option>"); 
                                sr++;
                            }); 
                      });  
            });          
                    
    /*****GET ZONE BLOCK ONCHNAGE DATA START****/
    
    $("#parentList").change(function (){
        var myTab = [];
           var parentname = $("#parentList option:selected").attr("data-name");//BLOCK ELEMENT NAME FOR IFRAME GRAPH GENERATION
                $("#parameterList").empty();
                $("#parameterList").append("<option value='' selected disabled>---Select Parameter---</option>");
            var parentWebId = $("#parentList").val();
            var url = baseServiceUrl + 'elements/' + parentWebId + '/attributes';
            //console.log(url);
            var attributesList =  processJsonContent(url, 'GET', null);
                $.when(attributesList).fail(function () {
                    warningmsg("Cannot Find the Attributes.");
                });            
                $.when(attributesList).done(function () {
                     var attributesItems = (attributesList.responseJSON.Items);
                     var WebIdVal='';
                        
                     $.each(attributesItems,function(key) {  
                         var category = attributesItems[key].CategoryNames; 
                         $.each(category,function(key1) {
                              if(WebIdVal==='' || WebIdVal!==attributesItems[key].WebId){
                             if(trendCat===category[key1] || valueCat===category[key1] || timestampCat===category[key1]){
                                   $("#parameterList").append("<option  data-name="+attributesItems[key].Name+" value="+attributesItems[key].WebId+">"+attributesItems[key].Name+"</option>"); 
                                   //$("#topexample>thead>tr").append("<th>"+attributesItems[key].Name+"</th>");
                                   myTab.push({"Element":attributesItems[key].Name});
                                }
                                WebIdVal=attributesItems[key].WebId;
                            }
                          });
                     });  
                // CreateTableFromJSON(myTab);
                });  
           });
           
     function CreateTableFromJSON(myTab) {
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


/*****GET ZONE BLOCK ONCHNAGE DATA END****/  
        $("#parameterList").change(function (){
              var startDate = $('#startDate').val()+'T00:00:00Z';
              var endDate = $('#startDate').val()+'T23:59:59Z';
              var vdate='';
              var vtime='';
              var unit='';
              var myTab=[];
              var name = $("#parameterList option:selected").attr("data-name");
            var parameterWebId = $("#parameterList").val();
              var url = baseServiceUrl+'streams/' + parameterWebId + '/interpolated?startTime='+startDate+'&endTime='+endDate+'&interval=1h&searchFullHierarchy=true';
            console.log(url);
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
                        }else{                            
                            vdate = (Timestamp).substring(0,10);//start date
                            vtime = (Timestamp).substring(11,19);//start time                                   
                                    vdate = vdate.split('-');//start date split array
                                    vtime = vtime.split(':');//start time split array
                            var val = Math.round((parameterItems[key].Value) * 100) / 100;
                            //var dt = Date.UTC(vdate[0],(vdate[1]-1),vdate[2],vtime[0],vtime[1],vtime[2]);
                            //data1.push([dt,val]);
                            //xAxis.push(Timestamp); 
                            unit = parameterItems[key].UnitsAbbreviation;   
                            myTab.push({"Sr.No":srt,"Element":name,"Date":vdate[2]+'/'+(vdate[1])+'/'+vdate[0],"Value":val+'('+unit+')'});
                            //$("#containerTable").append('<tr><td>'+val+'</td></tr>');
                        }
                           srt++;
                     });
                  
                     console.log(myTab);
                 });
        });


});
