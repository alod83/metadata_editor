$(window).ready(function () {
	$("#search_button").click(function(){searchDB()});
});

function searchDB() {
	var keywords=$('#search_text').val();
	//console.log(keywords);
	var type=$('input[name="search_radio"]:checked').val();
	//console.log(type);
	if (keywords != '' && type != undefined) {
		//console.log("Cerco...");
		$.ajax({
			type: "GET",
			url: "api/ajax.php",
			data: {keywords: keywords, type: type, request: "searchDB"},
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				$('#result').html("Results: ");
				if (result==null) {
					res="Sorry, no result found.";
				}
				else {
					console.log(result[0].bio);
					$.each(result, function(index,value){
						$('#result').append(value.name_surname+"; ");
					})
					
					
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
	};
};