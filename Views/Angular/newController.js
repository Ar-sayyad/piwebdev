app.controller('newController', function($scope) {
    $scope.pagename = "New Dashboard";
    $(".tabDiv").hide();
    var now = new Date();
    $(function() {   
       var month = (now.getMonth() + 1);  
       var emonth = (now.getMonth());
       var day = now.getDate();
       if (month < 10) 
           month = "0" + month;
       if (day < 10) 
           day = "0" + day;
       var start = now.getFullYear()+'-'+emonth + '-' + day;
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
    
    var url = baseServiceUrl+'assetdatabases?path=\\\\' + afServerName + '\\' + afDatabaseName; 
       var ajaxEF =  processJsonContent(url, 'GET', null);
           $.when(ajaxEF).fail(function () {
               warningmsg("Cannot Find the WebId.");
           });
            $.when(ajaxEF).done(function () {
               var WebId = (ajaxEF.responseJSON.WebId); 
               
                /****TEMPLATE ELEMENT SEARCH BY TEMPLATE NAME START****/
                var url = baseServiceUrl + 'assetdatabases/' + WebId + '/elements?templateName=' + templateName+'&searchFullHierarchy=true';
                    var elementList =  processJsonContent(url, 'GET', null);                    
                    $.when(elementList).fail(function () {
                        warningmsg("Cannot Find the Element Templates.");
                    });
                    $.when(elementList).done(function () {
                     var elementListItems = (elementList.responseJSON.Items);
                     var sr= 1;
                        $.each(elementListItems,function(key) {
                            $("#elementList").append("<option  data-name="+elementListItems[key].Name+" value="+elementListItems[key].WebId+">"+elementListItems[key].Name+"</option>"); 
                            sr++;
                        }); 
                    });  
                    /****TEMPLATE ELEMENT SEARCH BY TEMPLATE NAME END****/ 
               });
    
    /*****BLOCK ELEMENT ONCHNAGE START****/
    $("#elementList").change(function (){
        var elementName = $("#elementList option:selected").attr("data-name");//BLOCK ELEMENT NAME FOR IFRAME GRAPH GENERATION
        var iframeUrl= iframeConfigUrl+'?name='+elementName; //IFRAME URL 
        $('.iframeMapp').attr('src', iframeUrl);  
        //console.log(iframeUrl);
        $("#container").empty();
        $("#attributesListLeft").empty();
        $(".tableAttributes").empty();
        $("#elementChildList").empty();
        $("#cellGraphList").empty(); 
        $(".tabDiv").show();
        var WebId = $("#elementList").val();
        
        /***GET CHILD ELEMENTS OF SELECTED BLOCK ELEMENT START***/  
            var url = baseServiceUrl+'elements/' + WebId + '/elements?templateName=CELL'; 
            //console.log(url);
            var childElementList =  processJsonContent(url, 'GET', null);
                $.when(childElementList).fail(function () {
                    //warningmsg("Cannot Find the Child Element On Change.");
                    console.log("Cannot Find the child Element.");
                });
                $.when(childElementList).done(function () {  
                    $("#elementChildList").append("<option value='' selected disabled>---Select Elements---</option>");
                     var elementsChildListItems = (childElementList.responseJSON.Items);     
                     $.each(elementsChildListItems,function(key) {
                          $("#elementChildList").append("<option data-name="+elementsChildListItems[key].Name+" value="+elementsChildListItems[key].WebId+">"+elementsChildListItems[key].Name+"</option>"); 
                        });
                });
        /***GET CHILD ELEMENTS OF SELECTED BLOCK ELEMENT END***/ 
        
    /*****GET CHART DATA AND VALUE AND TIMESTAMP ATTRIBUTES START****/
        var url = baseServiceUrl + 'elements/' + WebId + '/attributes';
        var attributesList =  processJsonContent(url, 'GET', null);
            $.when(attributesList).fail(function () {
                warningmsg("Cannot Find the Attributes.");
            });            
            $.when(attributesList).done(function () {
                 var attributesItems = (attributesList.responseJSON.Items);
                 var cat=1;
                 var WebIdVal='';
                 $.each(attributesItems,function(key) {  
                     var category = attributesItems[key].CategoryNames;                       
                                   
                     $.each(category,function(key1) {
                         if(trendCat===category[key1]){
                         $("#attributesListLeft").append('<li class="paramterListChild paramterList'+cat+'">\n\<input type="checkbox" id="elemList'+cat+'" data-id="'+cat+'"  data-name="'+attributesItems[key].Name+'" onchange="getMap('+cat+');" class="paraList" value="'+attributesItems[key].WebId+'" name="selectorLeft">\n\
                            <label class="labelListChild leftLabel" for="elemList'+cat+'">'+attributesItems[key].Name+'</label>\n\
                            <div class="ScaleDiv">\n\
                                <input type="text" class="scales min" placeholder="Min" name="min" onchange="getMap('+cat+');" id="min'+cat+'">\n\
                                <input type="text" class="scales max" placeholder="Max" name="max" onchange="getMap('+cat+');" id="max'+cat+'">\n\
                            </div>\n\
                             </li>');  
                        }
                        
                        else if(timestampCat===category[key1] || valueCat===category[key1]){
                            if(WebIdVal==='' || WebIdVal!==attributesItems[key].WebId){
                            var url = baseServiceUrl + 'streams/' + attributesItems[key].WebId + '/value';
                            //console.log(url);
                            var attributesValue =  processJsonContent(url, 'GET', null);
                                $.when(attributesValue).fail(function () {
                                    console.log("Cannot Find the Attributes Values.");
                                });
                                 $.when(attributesValue).done(function () {
                                       var currName = attributesItems[key].Name;
                                       var Value = (Math.round(attributesValue.responseJSON.Value * 100) / 100).toFixed(2);
                                       var bgcolor='';
                                       $.each(tableAttrColors,function(key) {
                                            if(currName===tableAttrColors[key].name){
                                                  if(Value < tableAttrColors[key].LT){
                                                        bgcolor=minLTclr;
                                                  }else if(Value > tableAttrColors[key].LT && Value < tableAttrColors[key].HT){
                                                        bgcolor=btwnLTHTclr;
                                                  }else if(Value > tableAttrColors[key].HT){
                                                        bgcolor=maxHTclr;
                                                  }else{
                                                        bgcolor=defaultColor;//NaN
                                                  }
                                            }
                                       }); 
                                       var Units = (attributesValue.responseJSON.UnitsAbbreviation);
                                       var Timestamp = (attributesValue.responseJSON.Timestamp).substring(0,10);
                                 $(".tableAttributes").append('<div class="attributeData" style="background-color:'+bgcolor+'"><div class="attrHead">'+attributesItems[key].Name+'<br>'+Value+' <b>'+Units+'</b><br><span>('+Timestamp+')</span></div></div>');
                                 }); 
                                 WebIdVal=attributesItems[key].WebId;
                             }
                        }
                     });
                    cat++;
                 });                                            
            });  
            /*****GET CHART DATA AND VALUE AND TIMESTAMP ATTRIBUTES END****/
             loadEventFrame();//Loading Event Frames
        });
/*****BLOCK ELEMENT ONCHNAGE END****/   
});


/****ADD CELL GRAPH START****/
   var maincell=1; //Child Chart Value Declaration
   function addCell(){       
        if (!$("#elementChildList option:selected").val()) {
            warningmsg("No Element Selected..!");
            return false;
        }
        else{  
            $("#cellGraphList").append('<div class="col-12 col-lg-6 col-xl-1 ChildAttrs childListDiv'+maincell+'">\n\
                                <div class="card">\n\
                                    <div class="card-body childGraph style-1">\n\
                                        <ul id="cellgraph'+maincell+'"></ul>\n\
                                    </div>\n\
                                </div>\n\
                            </div>\n\
                            <div class="col-12 col-lg-6 col-xl-5 ChildAttrsChart childListDiv'+maincell+'">\n\
                                <button  type="button" onclick="removeDiv('+maincell+');" class="btn btn-sm btn-danger childChartClose"><i class="fa fa-close"></i></button>\n\
                                <div class="card">\n\
                                    <div class="card-body childGraph" id="cellgraphChart'+maincell+'">\n\
                                        </div>\n\
                                </div>\n\
                            </div></div>');               
        $("#cellGraphList").show();  
            var inc = maincell;
            var childName = $("#elementChildList option:selected").attr("data-name");//childElementName
            var ChildWebId = $("#elementChildList").val();         //childWebId 
            /*****CHILD ATTRIBUTES LOAD START*****/
            var url = baseServiceUrl+'elements/' + ChildWebId + '/attributes'; 
            var childParaData =  processJsonContent(url, 'GET', null);
            $.when(childParaData).fail(function () {
                console.log("Cannot Find the child Parameters.");
            });
            $.when(childParaData).done(function () {
                $(".childGraph").append('<input type="hidden" id="childId'+inc+'" value="'+ChildWebId+'"><input type="hidden" id="childName'+inc+'" value="'+childName+'">');
                $("#cellgraph"+inc).append('<h6 sty>'+childName+'</h6>');
                 var childAttributesItems = (childParaData.responseJSON.Items);
                 var cat=1;
                 $.each(childAttributesItems,function(key) {  
                     var category = childAttributesItems[key].CategoryNames;                    
                     $.each(category,function(key1) {
                         if(trendCat===category[key1]){
                        $("#cellgraph"+inc).append('<li class="paramterListCellChild paramterList'+cat+'">\n\
                            <input type="checkbox" id="elemChildList'+inc+cat+'" data-id="'+cat+'"  data-name="'+childAttributesItems[key].Name+'" onchange="getChildMap('+inc+');" class="paraList getChildChart" value="'+childAttributesItems[key].WebId+'" name="selectorChild'+inc+'">\n\
                            <label class="labelListCellChild leftLabel" for="elemChildList'+inc+cat+'">'+childAttributesItems[key].Name+'</label>\n\
                            </li>');  
                        }
                    });                    
                    cat++;
                });
            });
             /*****CHILD ATTRIBUTES LOAD END*****/
            maincell++; 
            $('#elementChildList option:selected').remove();   ///Remove List Items   
        }        
     }
    /****ADD CELL GRAPH END****/ 
    
/***LOAD ALL CHARTS ON DATE OR TIME CHANGE***/
function getCharts(){   
    getMap();
    loadEventFrame();
    for(var i=1;i<maincell;i++){
    getChildMap(i);
    }
}
/***LOAD ALL CHARTS ON DATE OR TIME CHANGE***/
 
/***CLOSE CHILD CHART DIV***/
function removeDiv(id){
    var name= $("#childName"+id).val();
    var WebId= $("#childId"+id).val();
    $(".childListDiv"+id).remove();
     $("#elementChildList").append("<option data-name="+name+" value="+WebId+">"+name+"</option>"); 
}
/***CLOSE CHILD CHART DIV***/
 
/*****LOAD EVENT FRAME DATA START****/ 
function loadEventFrame(){
                //getMap();
                var now = new Date();
                var WebId = $("#elementList").val();
                var startDate = $('#startDate').val();
                var startTime = $("#startTime").val();
                var startDateTime = (startDate + 'T' + startTime+'Z');
                var endDate = $('#endDate').val();
                var endTime = $("#endTime").val();
                var endDateTime = (endDate + 'T' + endTime+'Z'); 
                var eventFrameList=[];
                var data=[];
                var sdate ='',stime ='',edate ='',etime ='',y=0;
                 var chart1;
    var chart2;
    var controllingChart;
    
    var defaultTickInterval = 5;
    var currentTickInterval = defaultTickInterval;
    
    $(document).ready(function() {
        function unzoom() {
             chart1.options.chart.isZoomed = false;
             chart2.options.chart.isZoomed = false;
            
            chart1.xAxis[0].setExtremes(null, null);
            chart2.xAxis[0].setExtremes(null, null);
        }
    function computeTickInterval(xMin, xMax) {
        var zoomRange = xMax - xMin;
        
        if (zoomRange <= 2)
            currentTickInterval = 0.5;
        if (zoomRange < 20)
            currentTickInterval = 1;
        else if (zoomRange < 100)
            currentTickInterval = 5;
    }

    //explicitly set the tickInterval for the 3 charts - based on
    //selected range
    function setTickInterval(event) {
        var xMin = event.xAxis[0].min;
        var xMax = event.xAxis[0].max;
        computeTickInterval(xMin, xMax);

        chart1.xAxis[0].options.tickInterval = currentTickInterval;
        chart1.xAxis[0].isDirty = true;
        chart2.xAxis[0].options.tickInterval = currentTickInterval;
        chart2.xAxis[0].isDirty = true;
    }

    //reset the extremes and the tickInterval to default values
    function unzoom() {
        chart1.xAxis[0].options.tickInterval = defaultTickInterval;
        chart1.xAxis[0].isDirty = true;
        chart2.xAxis[0].options.tickInterval = defaultTickInterval;
        chart2.xAxis[0].isDirty = true;
    
        chart1.xAxis[0].setExtremes(null, null);
        chart2.xAxis[0].setExtremes(null, null);
    }
                var url = baseServiceUrl + 'elements/' + WebId + '/eventframes?startTime='+startDateTime+'&endTime='+endDateTime+'&searchFullHierarchy=true'; 
                var eventFrameData =  processJsonContent(url, 'GET', null);
                    $.when(eventFrameData).fail(function () {
                        console.log("Cannot Find the Event Frames.");
                    });
                     $.when(eventFrameData).done(function () {
                          var eventFrames = (eventFrameData.responseJSON.Items);
                            $.each(eventFrames,function(key) {  
                                var eventFrameName = eventFrames[key].TemplateName;
                                eventFrameList.push(eventFrameName);                               
                                var eventFrameStartTime = eventFrames[key].StartTime;
                                var eventFrameEndTime = eventFrames[key].EndTime;
                                    sdate = eventFrameStartTime.substring(0,10);//start date
                                    stime = eventFrameStartTime.substring(11,19);//start time
                                    edate = eventFrameEndTime.substring(0,10);//end date
                                    etime = eventFrameEndTime.substring(11,19);//end time                                     
                                    sdate = sdate.split('-');//start date split array
                                    stime = stime.split(':');//start time split array
                                    edate = edate.split('-');//end date split array
                                    etime = etime.split(':');//end time split array
                                if(edate[0]==='9999'){ var edyr=now.getFullYear(), edmnth = now.getMonth(), eddt=now.getDate(), h = now.getHours(), m = now.getMinutes(), s = now.getSeconds(); eventFrameEndTime="Running";}
                                else{ var edyr=edate[0], edmnth = (edate[1]-1), eddt=edate[2], h = etime[0], m = etime[1], s =etime[2]; } //if Event Frame is Runnig Stage                              
                                var color ='';
                                $.each(EFData,function(key) {
                                    if(eventFrameName===EFData[key].efName){
                                         color = EFData[key].color;
                                    }
                                    if(color!==''){
                                        data.push({
                                             nm:eventFrameName,
                                             sd:eventFrameStartTime,
                                             ed:eventFrameEndTime,
                                             color:color,
                                             x: Date.UTC(sdate[0], (sdate[1]-1), sdate[2],stime[0],stime[1],stime[2]),
                                             x2: Date.UTC(edyr, edmnth, eddt,h,m,s),
                                             y: y
                                         }); 
                                     }else{
                                          data.push({
                                             nm:eventFrameName,
                                             sd:eventFrameStartTime,
                                             ed:eventFrameEndTime,
                                             color:defaultColor,
                                             x: Date.UTC(sdate[0], (sdate[1]-1), sdate[2],stime[0],stime[1],stime[2]),
                                             x2: Date.UTC(edyr, edmnth, eddt,h,m,s),
                                             y: y
                                         }); 
                                     }                                     
                                });                             
                              y++; //AXIS INCREAMENT
                            }); 
                            
         chart1 = Highcharts.chart('eventFrame', {
                                chart: {
                                  type: 'xrange',
                                  zoomType: 'xy'
                                },
                                title: {
                                  text: ''
                                },
                                xAxis: {
                                  type: 'datetime',
                                   events:{               
                                    afterSetExtremes:function(){
                                
                                 if (!this.chart.options.chart.isZoomed)
                                 {                                         
                                    var xMin = this.chart.xAxis[0].min;
                                    var xMax = this.chart.xAxis[0].max;
                                     
                                    var zmRange = computeTickInterval(xMin, xMax);
                                    chart1.xAxis[0].options.tickInterval =zmRange;
                                    chart1.xAxis[0].isDirty = true;
                                    chart2.xAxis[0].options.tickInterval = zmRange;
                                    chart2.xAxis[0].isDirty = true;
                                     
                                   chart2.options.chart.isZoomed = true;
                                   chart2.xAxis[0].setExtremes(xMin, xMax, true);
                                
                                   chart2.options.chart.isZoomed = false;
                                }
                            }
                            
                            
                        }
                                },
                               tooltip: {
                                    shared: true,
                                    useHTML: true,
                                    headerFormat:'<table>',
                                    pointFormat: '<tr><th colspan="2" style="text-align: center;font-size:10px;"><b>{point.nm} </b></th></tr>' +
                                        '<tr><td style="font-size:10px;">Start: {point.sd} - End: {point.ed}</td></tr>',
                                    footerFormat: '</table>',
                                    valueDecimals: 2
                                },
                                yAxis: {
                                    gridLineColor: '#FFFFFF',
                                    minorGridLineWidth: 0,
                                    lineColor: '#FFFFFF',
                                    gridLineWidth: 0,
                                  title: {
                                    text: ''
                                  },
                                  categories: eventFrameList,
                                  reversed: true,
                                  labels: {
                                        enabled: false
                                    }
                                },
                                series: [{
                                    showInLegend: false, 
                                    name: 'Event Frames',
                                    pointPadding: 0,
                                    groupPadding: 0,
                                    borderColor: '#ffffff',
                                    pointWidth: 10,
                                    borderRadius:0,
                                    data: data,
                                  dataLabels: {
                                      format:'{point.nm}',
                                      enabled: false,
                                    style: {
                                        fontSize: '9',
                                        fontWeight:''
                                    }
                                  }
                                }]
                            }); 
                        startDate = startDate.split('-');
                        endDate = endDate.split('-');
                        chart1.xAxis[0].setExtremes(Date.UTC(startDate[0],(startDate[1]-1),startDate[2]), Date.UTC(endDate[0],(endDate[1]-1),endDate[2]));//EXTREME POINTSET
                    });
                });            
            }
    /*****LOAD EVENT FRAME DATA END****/
             
/****LOAD CHILD ATTRIBUTES CHARTS****/
 function getChildMap(maincell){
        var startDate = $('#startDate').val();
        var startTime = $("#startTime").val();
        var startDateTime = (startDate + 'T' + startTime+'Z');
        var endDate = $('#endDate').val();
        var endTime = $("#endTime").val();
        var endDateTime = (endDate + 'T' + endTime+'Z'); 
        var data=[];
        var yAxisData=[];
        var xAxis=[];
        var sr=0;
        var chkArray=[];
        var vdate='';
        var vtime='';
        startDate = startDate.split('-');
        endDate = endDate.split('-');
        startTime = startTime.split(':');
        endTime = endTime.split(':');   
        $.each($("input[name='selectorChild"+maincell+"']:checked"), function(){ 
            var data1=[];
            var WebId = $(this).val();
            var name = $(this).attr("data-name");
             chkArray.push(WebId); 
            var url = baseServiceUrl+'streams/' + WebId + '/interpolated?startTime='+startDateTime+'&endTime='+endDateTime+'&interval=1d&searchFullHierarchy=true'; 
            var attributesData =  processJsonContent(url, 'GET', null);
            $.when(attributesData).fail(function () {
                console.log("Cannot Find the Attributes.");
            });
            $.when(attributesData).done(function () {
                 var attributesDataItems = (attributesData.responseJSON.Items);
                 var unit = '';
                $.each(attributesDataItems,function(key) {                    
                 var Timestamp = attributesDataItems[key].Timestamp;
                        var val = (Math.round((attributesDataItems[key].Value) * 100) / 100);                         
                        if(isNaN(val)){
                           // console.log(val);//Skipping NaN Values
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
                        }                        
                  });   
                 // data1.pop();   
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
                            yAxisData.push({
                                min:eventsColorsData[key].min,
                                max:eventsColorsData[key].max,
                                title: {text: ''},
                                labels: {format: '{value}'+unit,
                                    style: {color: eventsColorsData[key].color}
                                }
                            }); 
                       }
                   });    
                     
             var Childchart =    Highcharts.chart('cellgraphChart'+maincell, {
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
                         xAxis: {
                                  type: 'datetime'
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
                            layout: 'vetical',
                            align: 'right',
                            x: 0,
                            verticalAlign: 'top',
                            y: 40,
                            floating: true,
                            enabled: false
                        },
                    series: data //PI ATTRIBUTES RECORDED DATA
                });    
                 Childchart.xAxis[0].setExtremes(Date.UTC(startDate[0],(startDate[1]-1),startDate[2],startTime[0],startTime[1],startTime[2]), Date.UTC(endDate[0],(endDate[1]-1),endDate[2],endTime[0],endTime[1],endTime[2]));//EXTREME POINTSET
                 sr++;
            });            
        });  
            if(chkArray.length === 0){
                $("#cellgraphChart"+maincell).empty(); //Empty current chart Div  
            }else{ //console.log(chkArray);
            }
    }
/****LOAD CHILD ATTRIBUTES CHARTS****/

/*********MAIN CHARTS SECTION START**********/  
function getMap(){
    var chart1;
    var chart2;
    var controllingChart;
    
    var defaultTickInterval = 5;
    var currentTickInterval = defaultTickInterval;
    
    $(document).ready(function() {
        function unzoom() {
             chart1.options.chart.isZoomed = false;
             chart2.options.chart.isZoomed = false;
            
            chart1.xAxis[0].setExtremes(null, null);
            chart2.xAxis[0].setExtremes(null, null);
        }
    function computeTickInterval(xMin, xMax) {
        var zoomRange = xMax - xMin;
        
        if (zoomRange <= 2)
            currentTickInterval = 0.5;
        if (zoomRange < 20)
            currentTickInterval = 1;
        else if (zoomRange < 100)
            currentTickInterval = 5;
    }

    //explicitly set the tickInterval for the 3 charts - based on
    //selected range
    function setTickInterval(event) {
        var xMin = event.xAxis[0].min;
        var xMax = event.xAxis[0].max;
        computeTickInterval(xMin, xMax);

        chart1.xAxis[0].options.tickInterval = currentTickInterval;
        chart1.xAxis[0].isDirty = true;
        chart2.xAxis[0].options.tickInterval = currentTickInterval;
        chart2.xAxis[0].isDirty = true;
    }

    //reset the extremes and the tickInterval to default values
    function unzoom() {
        chart1.xAxis[0].options.tickInterval = defaultTickInterval;
        chart1.xAxis[0].isDirty = true;
        chart2.xAxis[0].options.tickInterval = defaultTickInterval;
        chart2.xAxis[0].isDirty = true;
    
        chart1.xAxis[0].setExtremes(null, null);
        chart2.xAxis[0].setExtremes(null, null);
    }

    var data=[];
    var yAxisData=[];
    var xAxis=[];
    var chkArray = [];
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
    $.each($("input[name='selectorLeft']:checked"), function(){ 
        var data1=[];
        var WebId = $(this).val();
        var name = $(this).attr("data-name");
        var cat = $(this).attr("data-id");
        var min = $("#min"+cat).val();
        var max = $("#max"+cat).val();       
        chkArray.push(WebId); 
        var url = baseServiceUrl+'streams/' + WebId + '/interpolated?startTime='+startDateTime+'&endTime='+endDateTime+'&interval=1d&searchFullHierarchy=true';
        //console.log(url);
        var attributesData =  processJsonContent(url, 'GET', null);
            $.when(attributesData).fail(function () {
                console.log("Cannot Find the Attributes.");
            });
            $.when(attributesData).done(function () {                 
                 var attributesDataItems = (attributesData.responseJSON.Items);
                 var unit = '';
                 //console.log("count: "+(attributesDataItems.length));
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
                        }
                  });  
                  //console.log(data1);
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
                                    style: {color: eventsColorsData[key].color}
                                }
                            }); 
                       }
                   });    
                   //console.log(JSON.stringify(data));
                                 
               chart2 =   Highcharts.chart('container', {
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
                         xAxis: {
                                  type: 'datetime',
                                   events:{               
                                    afterSetExtremes:function(){
                                
                                 if (!this.chart.options.chart.isZoomed)
                                 {                                         
                                    var xMin = this.chart.xAxis[0].min;
                                    var xMax = this.chart.xAxis[0].max;
                                     
                                    var zmRange = computeTickInterval(xMin, xMax);
                                    chart1.xAxis[0].options.tickInterval =zmRange;
                                    chart1.xAxis[0].isDirty = true;
                                    chart2.xAxis[0].options.tickInterval = zmRange;
                                    chart2.xAxis[0].isDirty = true;
                                     
                                   chart2.options.chart.isZoomed = true;
                                   chart2.xAxis[0].setExtremes(xMin, xMax, true);
                                
                                   chart2.options.chart.isZoomed = false;
                                }
                            }
                            
                            
                        }
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
                            layout: 'vetical',
                            align: 'right',
                            x: 0,
                            verticalAlign: 'top',
                            y: 40,
                            floating: true,
                            enabled: false
                        },
                       
                    series:data  //PI ATTRIBUTES RECORDED DATA
                    
                });
               chart2.xAxis[0].setExtremes(Date.UTC(startDate[0],(startDate[1]-1),startDate[2],startTime[0],startTime[1],startTime[2]), Date.UTC(endDate[0],(endDate[1]-1),endDate[2],endTime[0],endTime[1],endTime[2]));//EXTREME POINTSET
                sr++;
            });            
    }); 
     if(chkArray.length === 0){
        $("#container").empty(); //Empty chart Div  
    }else{
     //console.log(chkArray);
    }
 });
}



  /*********MAIN CHARTS SECTION END**********/  
  