app.controller("uploadController", ['$scope', function ($scope) {
    $scope.pagename = "Upload";
    $scope.divname1 = "Excel Sheet Table Display Here";
    $scope.divname2 = "Data Inputs";
    $('#input-excel').change(function(e){
                var reader = new FileReader();
                reader.readAsArrayBuffer(e.target.files[0]);
                reader.onload = function(e) {
                        var data = new Uint8Array(reader.result);
                        var wb = XLSX.read(data,{type:'array'});
                        var htmlstr = XLSX.write(wb,{sheet:"-", type:'binary',bookType:'html'});
                        $('#wrapper')[0].innerHTML += htmlstr;
                }
        });
}]);