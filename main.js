angular.module('KRRclass', [ 'chart.js']).controller('MainCtrl', ['$scope','$http', mainCtrl]);
let mymap;

$(document).ready(function(){
		console.log( "ready!" );
    $(".results").hide();
		$(".search").show();
		$(".searchlist.type").hide();
		$(".searchlist.countries").hide();
		$(".searchlist.people").hide();
		$(".searchlist.period").hide();
		$(".searchlist.submitButton").hide();
		mymap = L.map('mapid').setView([51.505, -0.09], 13);

		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGF1cmF3ZW50IiwiYSI6ImNqbm05NDQyeDB3cjMza3BrM3lzMWFmbmoifQ.VZdQ2r0x0jdLp60OnGoSRQ'
}).addTo(mymap);
});

function afterBudget(){
    if ($('#budget').val()){
       $(".searchlist.budget").fadeOut("slow");
			 setTimeout(function(){$(".searchlist.type").fadeIn("slow");},600);
     }else{
			 if(confirm("Select an option")){
			 };
		 };
}

function afterType(){
  if ($('#type').val()){
     $(".searchlist.type").fadeOut("slow");
		 setTimeout(function(){$(".searchlist.countries").fadeIn("slow");},600);
   }else{
		 if(confirm("Select an option")){
		 }
	 }
}

function afterCountries(){
  if ($('#countries').val()){
     $(".searchlist.countries").fadeOut("slow");
		 setTimeout(function(){$(".searchlist.people").fadeIn("slow");},600);
   }else{
		 if(confirm("Select an option")){
		 }
	 }
}

function afterPeople(){
  if ($('#people').val()){
     $(".searchlist.people").fadeOut("slow");
		 setTimeout(function(){$(".searchlist.period").fadeIn("slow");},600);
   }else{
		 if(confirm("Select an option")){
		 }
	 }
}

function afterPeriod(){
  if ($('#period').val()){
     $(".searchlist.period").fadeOut("slow");
		 setTimeout(function(){$(".searchlist.submitButton").fadeIn("slow");},600);
   }else{
		 if(confirm("Select an option")){
		 }
	 }
}


//
// function doClick(thisId){
// 	console.log(thisId);
//
// }




function mainCtrl($scope, $http){

	$scope.searchSubmitted = function(){
			$(".search").hide();
			$(".results").show();
			let budget = document.getElementById("budget").value;
			let type = document.getElementById("type").value;
			let countries = document.getElementById("countries").value;
			let people = document.getElementById("people").value;
			let period = document.getElementById("period").value;
			console.log(budget);

			$scope.myEndpoint = "http://localhost:5820/Group17Final/query?query="
			let finalQuery = "SELECT DISTINCT ?city WHERE {  ?city ex:hasBudgetRange ?budget      FILTER (?budget < " + budget + ") .   " + period + " owl:equivalentClass ?a.   ?a owl:someValuesFrom ?b.    " + type + " rdf:type ?b.  ?city ex:hasTravelType " + type + ".  ?city ex:inCountry ?country.  ?country rdf:type " + countries + ".   ?city rdf:type ?n.  ?n owl:someValuesFrom " + people + ".}"
			console.log(finalQuery);
			$scope.myFinalQuery = encodeURI(finalQuery).replace(/#/g, '%23');



			$http( {
			 	method: "GET",
				url :  $scope.myEndpoint+$scope.myFinalQuery,
				headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'}
				} )
				.success(function(data, status) {
				    $scope.result = data.results.bindings;
						$scope.myDynamicData = [];

						angular.forEach(data.results.bindings, function(val) {
							str = val.city.value.split("#").pop();
							if(str == "Ibiza-city"){
								str = "Ibiza";
							}else if(str == "Chania"){
								str = "Crete";
							}else if(str == "Corfu-city"){
								str = "Corfu_(city)";
							}else	if(str == "St.Tropez"){
								str = "Saint-Tropez";
							}else if(str == "Rhodos-city"){
								str = "Rhodes";
							}else if(str == "Les_Trois_Vallees"){
								str = "Les_Trois_Vallées";
							}else if(str == "huez"){
								str = "Huez";
							}else if(str == "Spa"){
								str = "Spa,_Belgium";
							}else if(str == "Lech"){
								str = "Vorarlberg";
							}else if(str == "St.Moritz"){
								str = "St._Moritz";
							}else if(str == "Saalbach"){
								str = "Schattberg_(Saalbach-Hinterglemm)";
							}else {
							}



						 	$scope.myDynamicData.push(str);




							document.getElementById("result-list").innerHTML += "<li class='a' id='" + $scope.myDynamicData[$scope.myDynamicData.length-1] + "' >"  + $scope.myDynamicData[$scope.myDynamicData.length-1] + "<div class = 'dynamic'  id='d" + $scope.myDynamicData[$scope.myDynamicData.length-1] + "' ></div> </li>";
							//+ $scope.myDynamicData.length + " ", onclick='doClick(this.value)'
							$(function() {
								$(".a").on("click", function() {
									console.clear()
									console.log("id: " + this.id);
									let id = this.id
									$(".dynamic").hide();

									function getAbstract(abstract){
										console.log("abstract: " + abstract);
										console.log("d"+id);
										if(document.getElementById("d"+id).innerHTML == ""){
											document.getElementById("d"+id).innerHTML = abstract;
											$("#d"+id).show();
										}else{
											document.getElementById("d"+id).innerHTML = "";
											$("#d"+id).hide();
										}

									};

									$scope.myEndpoint2 = "http://dbpedia.org/sparql"
									totalName = "<http://dbpedia.org/resource/" + this.id + ">"
									$scope.finalQuery2 = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> PREFIX dbo: <http://dbpedia.org/ontology/> SELECT ?abstract ?latitude ?longitude WHERE {   " + totalName + " geo:long ?longitude .   " + totalName + " geo:lat ?latitude.   " + totalName + " dbo:abstract ?abstract   	FILTER (LANGMATCHES(LANG(?abstract), 'en')). } LIMIT 1"
									$scope.myFinalQuery2 = $scope.myEndpoint2+"?query="+ encodeURIComponent($scope.finalQuery2) +"&format=json";
									console.log($scope.myFinalQuery2);
									$.ajax({
							        dataType: "jsonp",
							        url: $scope.myFinalQuery2,
							        success: function( _data ) {
							            var results = _data.results.bindings;
							            for ( let result of results ) {
							                abstract = result.abstract.value;
							                console.log("abstract: " + abstract);
															lat = result.latitude.value;
															console.log("latitude: " + lat);
															long = result.longitude.value;
															console.log("longitude: " + long);
															getAbstract(abstract);
															mymap.invalidateSize();
															mymap.setView([lat, long], 13);
															break;
							            }
							        },
											error: function( _data ){
											    console.log('Error ' +_data);
											}

							    })
									// $(".dynamic").hide();
									// $("#" + this.id).show();

								});
							});







						});


			 			console.log($scope.myDynamicData);
			  })

				.error(function(error ){
				    console.log('Error '+error);
				});


				// angular.forEach($scope.myDynamicData, function(val) {
				//
				// });
				//console.log($("ul > li.a").attr("id"));
				// $("li").click(function(){
				// 	console.log("yes");
    		// 	console.log($(this).attr("id"));
				// });



	}



}
