app.controller('chroniclesController', function($scope) {  
     $("#generate-excel").click(function () {
          var excel = new ExcelGen({
        "src_id": "test_table",
        "show_header": true
    });
        excel.generate();
    });       
 
 var dataSet = [
    [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
    [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
    [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
    [ "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060" ],
    [ "Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700" ],
    [ "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000" ],
    [ "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500" ],
    [ "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900" ],
    [ "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500" ],
    [ "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600" ],
    [ "Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560" ],
    [ "Quinn Flynn", "Support Lead", "Edinburgh", "9497", "2013/03/03", "$342,000" ],
    [ "Charde Marshall", "Regional Director", "San Francisco", "6741", "2008/10/16", "$470,600" ],
    [ "Haley Kennedy", "Senior Marketing Designer", "London", "3597", "2012/12/18", "$313,500" ],
    [ "Tatyana Fitzpatrick", "Regional Director", "London", "1965", "2010/03/17", "$385,750" ],
    [ "Michael Silva", "Marketing Designer", "London", "1581", "2012/11/27", "$198,500" ],
    [ "Paul Byrd", "Chief Financial Officer (CFO)", "New York", "3059", "2010/06/09", "$725,000" ],
    [ "Gloria Little", "Systems Administrator", "New York", "1721", "2009/04/10", "$237,500" ],
    [ "Bradley Greer", "Software Engineer", "London", "2558", "2012/10/13", "$132,000" ],
    [ "Dai Rios", "Personnel Lead", "Edinburgh", "2290", "2012/09/26", "$217,500" ],
    [ "Jenette Caldwell", "Development Lead", "New York", "1937", "2011/09/03", "$345,000" ],
    [ "Yuri Berry", "Chief Marketing Officer (CMO)", "New York", "6154", "2009/06/25", "$675,000" ],
    [ "Caesar Vance", "Pre-Sales Support", "New York", "8330", "2011/12/12", "$106,450" ],
    [ "Doris Wilder", "Sales Assistant", "Sidney", "3023", "2010/09/20", "$85,600" ],
    [ "Angelica Ramos", "Chief Executive Officer (CEO)", "London", "5797", "2009/10/09", "$1,200,000" ],
    [ "Gavin Joyce", "Developer", "Edinburgh", "8822", "2010/12/22", "$92,575" ],
    [ "Jennifer Chang", "Regional Director", "Singapore", "9239", "2010/11/14", "$357,650" ],
    [ "Brenden Wagner", "Software Engineer", "San Francisco", "1314", "2011/06/07", "$206,850" ],
    [ "Fiona Green", "Chief Operating Officer (COO)", "San Francisco", "2947", "2010/03/11", "$850,000" ],
    [ "Shou Itou", "Regional Marketing", "Tokyo", "8899", "2011/08/14", "$163,000" ],
    [ "Michelle House", "Integration Specialist", "Sidney", "2769", "2011/06/02", "$95,400" ],
    [ "Suki Burks", "Developer", "London", "6832", "2009/10/22", "$114,500" ],
    [ "Prescott Bartlett", "Technical Author", "London", "3606", "2011/05/07", "$145,000" ],
    [ "Gavin Cortez", "Team Leader", "San Francisco", "2860", "2008/10/26", "$235,500" ],
    [ "Martena Mccray", "Post-Sales support", "Edinburgh", "8240", "2011/03/09", "$324,050" ],
    [ "Unity Butler", "Marketing Designer", "San Francisco", "5384", "2009/12/09", "$85,675" ]
];
      $('#example').DataTable( {
         data: dataSet,
        columns: [
            { title: "Name" },
            { title: "Position" },
            { title: "Office" },
            { title: "Extn." },
            { title: "Start date" },
            { title: "Salary" }
        ]
    } );
    
    $scope.pagename = "Chronicles";
    $(".tabDiv").hide();
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
       var start = yr +'-'+emonth + '-' + day;       
       var end = now.getFullYear()+'-'+month + '-' + day;
        $("#startDate").val(start);
        $("#startDate").datepicker({dateFormat: 'yy-mm-dd',maxDate : '0'});
        $("#endDate").val(end);
        $("#endDate").datepicker({dateFormat: 'yy-mm-dd',maxDate : '0'});
    });
    $(function(){     
      var h = now.getHours(),
          m = now.getMinutes(),
          s = now.getSeconds();
      if(h < 10) h = '0' + h; 
      if(m < 10) m = '0' + m; 
      if(s < 10) s = '0' + s;
      $('input[type="time"][name="starttime"]').attr({'value':'00:00:00' });
      $('input[type="time"][name="endtime"]').attr({'value': h + ':' + m + ':' + s });
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
                var url = baseServiceUrl + 'assetdatabases/' + WebId + '/elementtemplates?field=Categories&query='+filterCategoryName+'&sortField=Name&selectedFields=items.name;items.webid;&searchFullHierarchy=true';
                    //var url = baseServiceUrl + 'assetdatabases/' + WebId + '/elements?templateName=' + templateName+'&searchFullHierarchy=true';
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
    
    /*****BLOCK ELEMENT ONCHNAGE START****/
    $("#parentTemplateList").change(function (){
        var parentTemplateID = $("#parentTemplateList option:selected").attr("data-id");//BLOCK ELEMENT NAME FOR IFRAME GRAPH GENERATION
            $("#containern").empty();
           // $("#containerTable").empty();
             $("#elementList").empty();
              $("#attributesListLeft").empty();
            $("#parentList").empty();
           $("#parentList").append("<option value='' selected disabled>---Select Parent---</option>");
        var parentTemplateName = $("#parentTemplateList").val();
         
          var url = baseServiceUrl + 'assetdatabases/' + parentTemplateID + '/elements?templateName=' + parentTemplateName+'&sortField=Name&selectedFields=items.name;items.webid;&searchFullHierarchy=true';
                     //console.log(url);
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
                    
    /*****GET CHART DATA AND VALUE AND TIMESTAMP ATTRIBUTES START****/
    $("#parentList").change(function (){
           var parentname = $("#parentList option:selected").attr("data-name");//BLOCK ELEMENT NAME FOR IFRAME GRAPH GENERATION
             $("#containern").empty();
             //$("#containerTable").empty();
              $("#elementList").empty();
              $("#attributesListLeft").empty();
           //$("#elementList").append("<option value='' selected disabled>---Select Parent---</option>");
        var parentWebId = $("#parentList").val();
        var url = baseServiceUrl + 'elements/' + parentWebId + '/attributes';
        //console.log(url);
        var attributesList =  processJsonContent(url, 'GET', null);
            $.when(attributesList).fail(function () {
                warningmsg("Cannot Find the Attributes.");
            });            
            $.when(attributesList).done(function () {
                 var attributesItems = (attributesList.responseJSON.Items);
                 var cat=1;
                 //var WebIdVal='';
                  $("#elementList").append("<optgroup label="+parentname+" data-name="+parentname+" value="+parentWebId+">");
                                        /***ElementsListByRightOnchange START***/
                                                    var url = baseServiceUrl + 'elements/' + parentWebId+ '/elements?sortField=Name&selectedFields=items.name;items.webid;';
                                                   
                                                    var secondElementList = processJsonContent(url, 'GET', null);
                                                    $.when(secondElementList).fail(function() {
                                                        warningmsg("Cannot Find the Element On Change.");
                                                        console.log("Cannot Find the Element.")
                                                    });
                                                    $.when(secondElementList).done(function() {
                                                        var elementsChildListItems = (secondElementList.responseJSON.Items);
                                                       // var srt = lastSrl;
                                                        $.each(elementsChildListItems, function(key) {  
                                                            //$("#elementList").append("<optgroup label="+elementsChildListItems[key].Name+" data-name="+elementsChildListItems[key].Name+" value="+elementsChildListItems[key].WebId+">");
                                                            //$("#elementList").append("<option  data-name="+elementsChildListItems[key].Name+" value="+elementsChildListItems[key].WebId+">"+elementsChildListItems[key].Name+"</option>");
                                                                    /***ElementsListByRightOnchange START***/
                                                                        var url = baseServiceUrl + 'elements/' + elementsChildListItems[key].WebId+ '/elements?sortField=Name&selectedFields=items.name;items.webid;';
                                                                        var thirdElementList = processJsonContent(url, 'GET', null);
                                                                        $.when(thirdElementList).fail(function() {
                                                                            warningmsg("Cannot Find the Element On Change.");
                                                                            console.log("Cannot Find the Element.")
                                                                        });
                                                                        $.when(thirdElementList).done(function() {
                                                                            var thirdElementsChildListItems = (thirdElementList.responseJSON.Items);
                                                                           // var srt = lastSrl;
                                                                           $("#elementList").append("<optgroup style='margin-left:7px;' label="+elementsChildListItems[key].Name+" data-name="+elementsChildListItems[key].Name+" value="+elementsChildListItems[key].WebId+">");
                                                                            $.each(thirdElementsChildListItems, function(key) {                                                           
                                                                                $("#elementList").append("<option style='margin-left:15px;'   data-name="+thirdElementsChildListItems[key].Name+" value="+thirdElementsChildListItems[key].WebId+">"+thirdElementsChildListItems[key].Name+"</option>");
                                                                                //srt++
                                                                            });
                                                                             $("#elementList").append("</optgroup>");
                                                                        });
                                                                    /***ElementsListByRightOnchange END***/
                                                            //srt++
                                                              //$("#elementList").append("</optgroup>");
                                                        });
                                                    });
                                                /***ElementsListByRightOnchange END***/
                     $("#elementList").append("</optgroup>");
                 $.each(attributesItems,function(key) {  
                     var category = attributesItems[key].CategoryNames;     
                     $.each(category,function(key1) {
                         if(trendCat===category[key1]){
                              $.each(eventsColorsData,function(key1) {
                                if(attributesItems[key].Name===eventsColorsData[key1].name){
                                    $("#attributesListLeft").append('<li class="elListChild paramterList'+cat+'">\n\<input type="checkbox" id="elemList'+cat+'" data-id="'+cat+'"  data-name="'+attributesItems[key].Name+'" onchange="getChartts('+cat+');" class="paraList" value="'+attributesItems[key].WebId+'" name="selectorLeft">\n\
                            <label class="labelListChild leftLabel" for="elemList'+cat+'">'+attributesItems[key].Name+' ('+attributesItems[key].DefaultUnitsNameAbbreviation+')</label>\n\
                            <div class="ScaleDiv">\n\
                                <input type="text" class="scales min" placeholder="Min" value="'+eventsColorsData[key1].min+'" name="min" onchange="getCharts('+cat+');" id="min'+cat+'">\n\
                                <input type="text" class="scales max" placeholder="Max" value="'+eventsColorsData[key1].max+'" name="max" onchange="getCharts('+cat+');" id="max'+cat+'">\n\
                            </div>\n\
                           </li>');    
                                       }
                            });
                         
                            }
                      });
                    cat++;
                 });    
                 
            });  
//            /*****GET CHART DATA AND VALUE AND TIMESTAMP ATTRIBUTES END****/
//             loadEventFrame();//Loading Event Frames
        });
/*****BLOCK ELEMENT ONCHNAGE END****/   
});



    
/***LOAD ALL CHARTS ON DATE OR TIME CHANGE***/
function getChartts(){   
   // getMap();
    loadEventFrames();   
}
/***LOAD ALL CHARTS ON DATE OR TIME CHANGE***/

 
/*****LOAD EVENT FRAME DATA START****/ 
function loadEventFrames(){
    var charts;
    $("#example").empty();
      /**************///
        var data=[];
        var yAxisData=[];
        var chkArray = [];
        var myTab = [];
        var sr=0;
        var startDate = $('#startDate').val();
        var startTime = $("#startTime").val();
        var startDateTime = (startDate + 'T' + startTime+'Z');
        var endDate = $('#endDate').val();
        var endTime = $("#endTime").val();
        var endDateTime = (endDate + 'T' + endTime+'Z');   
        var vdate='';
        var vtime='';    
        startDate = startDate.split('-');
        endDate = endDate.split('-');
        startTime = startTime.split(':');
        endTime = endTime.split(':');  
         
      $(document).ready(function() {    
    /*****Main Charts****/
     //$("#containerTable").append('<tr>');
      var srt=1;
    $.each($("input[name='selectorLeft']:checked"), function(){ 
        var data1=[];
        var WebId = $(this).val();
        var name = $(this).attr("data-name");
        var cat = $(this).attr("data-id");
        var min = $("#min"+cat).val();
        var max = $("#max"+cat).val();       
        chkArray.push(WebId); 
       
                //$("#containerTable").append('');              
        var url = baseServiceUrl+'streams/' + WebId + '/interpolated?startTime='+startDateTime+'&endTime='+endDateTime+'&interval=1d&selectedFields=items.Timestamp;items.Value;items.UnitsAbbreviation;&searchFullHierarchy=true';
        //console.log(url);
        var attributesData =  processJsonContent(url, 'GET', null);
            $.when(attributesData).fail(function () {
                console.log("Cannot Find the Attributes.");
            });
            
            $.when(attributesData).done(function () {                 
                 var attributesDataItems = (attributesData.responseJSON.Items);
                 var unit = '';
                 //console.log("count: "+(attributesDataItems.length));
                   //$("#containerTable").append('<tr><th id='+name+'>'+name+'</th><tr>');
                  
                $.each(attributesDataItems,function(key) {
                        var Timestamp = attributesDataItems[key].Timestamp;
                        var val = (Math.round((attributesDataItems[key].Value) * 100) / 100);                         
                        if(isNaN(val)){
                           // console.log(val);////Skipping NaN Values
                        }else{                            
                            vdate = (Timestamp).substring(0,10);//start date
                            vtime = (Timestamp).substring(11,19);//start time                                   
                                    vdate = vdate.split('-');//start date split array
                                    vtime = vtime.split(':');//start time split array
                            var val = Math.round((attributesDataItems[key].Value) * 100) / 100;
                            var dt = Date.UTC(vdate[0],(vdate[1]-1),vdate[2],vtime[0],vtime[1],vtime[2]);
                            data1.push([dt,val]);
                            //xAxis.push(Timestamp); 
                            unit = attributesDataItems[key].UnitsAbbreviation;   
                            //myTab.push({"Sr.No":srt,"Element":name,"Date":vdate[2]+'/'+(vdate[1])+'/'+vdate[0],"Value":val+'('+unit+')'});
                            //$("#containerTable").append('<tr><td>'+val+'</td></tr>');
                        }
                      srt++;
                       
                  });  
                  // CreateTableFromJSON(myTab);
                   $.each(eventsColorsData,function(key) {
                       if(name===eventsColorsData[key].name){
                             data.push({
                                name: name,
                                type: 'spline',
                                yAxis: sr,
                                color:eventsColorsData[key].color,
                                data: data1,
                                tooltip: { valueSuffix: unit}
                            });
                            //data = data1;
                            if(min===''){ min = eventsColorsData[key].min;}
                            if(max===''||max===0){ max = eventsColorsData[key].max;}
                            // console.log(cat+" min: "+min+" | "+" max: "+max);
                            yAxisData.push({
                                min:min,//eventsColorsData[key].min,
                                max:max,//eventsColorsData[key].max,
                                title: {text: ''},
                                labels: {format: '{value}'+unit,
                                    style: {color: eventsColorsData[key].color},
                                     enabled: true
                                }
                            }); 
                       }
                   });    
                   //console.log(JSON.stringify(data));
                                 
               charts =   Highcharts.chart('containern', {
                        chart: {
                            zoomType: 'xy',
                              type: 'spline'
                              },
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: ''
                        },
                         xAxis:{
                            type: 'datetime',
//                            events:{               
//                                 afterSetExtremes:function(){                                
//                                      if (!this.chart.options.chart.isZoomed)
//                                       {                                         
//                                       var xMin = this.chart.xAxis[0].min;
//                                       var xMax = this.chart.xAxis[0].max;
//                                       chart1.xAxis[0].isDirty = true;
//                                       chart2.xAxis[0].setExtremes(xMin, xMax, true);                                
//                                       chart2.options.chart.isZoomed = false;
//                                       }
//                                   } 
//                                 }
                            },
                        yAxis: yAxisData, //Y AXIS RANGE DATA
                        tooltip: {
                                shared: true
                        },
                        plotOptions: {
                            spline: {
                                lineWidth: 1,
                                states: {
                                    hover: {
                                        lineWidth: 2
                                    }
                                },
                            }
                        },
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            x: 0,
                            verticalAlign: 'top',
                            y: 0,
                            floating: true,
                            enabled: true
                        },                       
                    series:data  //PI ATTRIBUTES RECORDED DATA                    
                });
               charts.xAxis[0].setExtremes(Date.UTC(startDate[0],(startDate[1]-1),startDate[2],startTime[0],startTime[1],startTime[2]), Date.UTC(endDate[0],(endDate[1]-1),endDate[2],endTime[0],endTime[1],endTime[2]));//EXTREME POINTSET
                sr++;
            });  
    }); 
   
     if(chkArray.length === 0){
        $("#containern").empty(); //Empty chart Div  
    }else{
     //console.log(chkArray);
    }
       
  });    

     }
     
    /*****LOAD EVENT FRAME DATA END****/
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
        var divContainer = document.getElementById("tables");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);   
    }

  /*********MAIN CHARTS SECTION END**********/  
  