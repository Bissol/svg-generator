var svggenApp = angular.module('svggenApp', []);

svggenApp.controller('SvgAppCtrl', ['$scope', 'paramService', 'svgService', '$sce', function ($scope, paramService, svgService, $sce) {
  $scope.test = "ng";
  $scope.dnaString = "";
  $scope.svgs = [];
  $scope.selected = null;
  $scope.finalWidth = 2000;
  $scope.finalHeight = 2000;
  $scope.depth = 4;
  console.clear();
  
  $scope.dnaChanged = function()
  {
  	paramService.setDna($scope.dnaString);
  };
  
  $scope.selectSvg = function(index)
  {
  	$scope.selected = index;
  };
  
  $scope.isSelected = function(index)
  {
  	return $scope.selected === index;
  };
  
  $scope.generateSvg = function()
  {
  	svgService.setWidth($scope.finalWidth);
  	svgService.setHeight($scope.finalHeight);
  	var svg = svgService.generateSvg($scope.depth);
  	//document.getElementById("svgContainer").appendChild(svg);
  	$scope.svgs.unshift({svg:svg, dna:$scope.dnaString});
  };
  
  $scope.saveSvg = function(index)
  {
  	// Create tmp canvas
  	var canvas = document.createElement('canvas');
  	context = canvas.getContext("2d");
	canvas.width  = $scope.finalWidth;
	canvas.height = $scope.finalHeight;
	document.body.appendChild(canvas);

  	var html = $scope.svgs[index].svg;
  	var data = (new XMLSerializer()).serializeToString(html);
  	//data = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" width=\"200\" height=\"200\"><rect x=\"10\" y=\"10\" width=\"50\" height=\"50\" /><text x=\"0\" y=\"100\">Look, i'm cool</text></svg>";
  	var imgsrc = 'data:image/svg+xml;base64,'+ btoa(data);
	var DOMURL = window.URL || window.webkitURL || window;
	
	var img = new Image();
  var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
  var url = DOMURL.createObjectURL(svgBlob);

  img.onload = function () {
  	console.log("In Onload img");
    context.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);
  };
  img.src = url;
	
  };
  
  $scope.testFunc = function()
  {
  	$scope.svgs = [];
  	$scope.selected = null;
  };
  
  $scope.randomDNA = function()
  {
  	var dna = "";
  	for (var i=0; i<40; i++)
  	{
  		dna += String.fromCharCode(50 + Math.floor(Math.random()*215));
  	}
  	$scope.dnaString = dna;
  	paramService.setDna($scope.dnaString);
  	
  	$scope.generateSvg($scope.depth);
  };
  
  $scope.mutation = function()
  {
  	var dna = $scope.svgs[$scope.selected].dna;
  	
  	paramService.setDna($scope.dnaString);
  	paramService.mutate();
  	$scope.dnaString = dna;
  	
  	$scope.generateSvg($scope.depth);
  };
  
}]);

  

svggenApp.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  };
}]);