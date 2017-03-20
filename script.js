$(window).ready(function () {

	$('*').click(function(){

	});

	$('#header_login_console_opener').click(function(){
		$('#login_console').css('margin-top','0');
	});

	$('#login_console_close').click(function(){
		var height=$('#login_console').height()+50;
		$('#login_console').css('margin-top', 0-height);
	});

	$('#login_console_login').click(function(){
		login();
	});

	$('#login_console_message_signin').click(function(){
		populate_login_console('signin');
	});

	$('#header_title span').click(function(){
		$.fn.fullpage.moveTo(1, 0);
	});

	$('#google').click(function(){
		window.location.href='login.php?provider=google';
	})

	$('#facebook').click(function(){
		window.location.href='login.php?provider=facebook';
	})

	$('#search_database').change(function(){set_datalist();});

	$("#search_button").click(function(){
		var keywords=$('#search_text').val(); //parole chiave per la ricerca
		var type=$('input[name="search_radio"]:checked').val();
		var coll=$('#coll_select').val(); //tipo di ricerca (person, place, ecc.)
		searchDB(type, keywords);
	})

	$('#search_general_button').click(function(){displayDB()});

	if ($('body').attr('email')!=undefined) {
		collection_select();
	}

});

function open_login_console() {
	$('#login_console').css('margin-top','0');
}

function populate_login_console(content) {
	if (content=="login") {
		var string='<input class="login_console_input" id="login_console_email" type="email" placeholder="Email"></input>'+
		'<input class="login_console_input" id="login_console_password" type="password" placeholder="Password"></input>'+
		'<button class="login_console_button" id="login_console_login">Login</button>'+
		'<span id="login_console_message">Not registered? <span id="login_console_message_signin">Create an account</span>.</span>'+
		'<span id="login_console_result"></span>';
		$('#login_console_container').html(string);
		$('#login_console_login').click(function(){
			login();
		});
		$('#login_console_message_signin').click(function(){
			populate_login_console('signin');
		});
	}
	else if (content=="signin") {
		var string='<input class="login_console_input" id="login_console_name" type="text" placeholder="Name*"></input>'+
		'<input class="login_console_input" id="login_console_surname" type="text" placeholder="Surname"></input>'+
		'<input class="login_console_input" id="login_console_email" type="email" placeholder="Email*"></input>'+
		'<input class="login_console_input" id="login_console_password" type="password" placeholder="Password*"></input>'+
		'<input class="login_console_input" id="login_console_repassword" type="password" placeholder="Repeat Password*"></input>'+
		'<button class="login_console_button" id="login_console_signin">Sign In</button>'+
		'<span id="login_console_message">Already registered? <span id="login_console_message_login">Login</span>.</span>'+
		'<span id="login_console_result"></span>';
		$('#login_console_container').html(string);
		$('#login_console_signin').click(function(){
			signin();
		});
		$('#login_console_message_login').click(function(){
			populate_login_console('login');
		});

	}
}

function login() {
	var email=$('#login_console_email').val();
	var password=$('#login_console_password').val();

	if (email!="" && password!="") {
		if (isEmail(email)==true) {
			$.ajax({
				type: "GET",
				url: "login_local.php",
				data: {email: email, password: password}, //effettuo una chiamata ajax
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				success: function (result) {
					console.log(result);
					if (result=="EMAIL") {
						$('#login_console_result').html('This email is not registered in our database.');
					}
					else if (result=="PASS") {
						$('#login_console_result').html('Password not correct!');
					}
					else if (result=="SOCIAL") {
						$('#login_console_result').html('You already logged in with a social account!<br/>Log in with that account or create a password.');
						$('#login_console_email').attr('readonly','readonly');
						$('#login_console_password').val("");
						$('#login_console_login').remove();
						$('#login_console_password').after('<input class="login_console_input" id="login_console_repassword" type="password" placeholder="Repeat Password*"></input>'+
							'<button class="login_console_button" id="login_console_createpassword">Create Password</button>');
						$('#login_console_createpassword').click(function(){
							if ($('#login_console_password').val()==$('#login_console_repassword').val()) {
								create_password();
							}
							else {
								$('#login_console_result').html('The passwords are not matching.');
							}

						})
					}
					else {
						var obj=jQuery.parseJSON(result);
						var name=obj[0].firstname;
						var email=obj[0].email;
						console.log(name, email)
						$('#login_console_result').html('Login succesful!');
						$('#login_console_result').css('color','green');
						setTimeout(function(){window.location.replace("http://localhost/LPW/MetadataEditor/index.php?user="+name+"&email="+email)}, 500);
					}
				}
			});
		}
		else {
			$('#login_console_result').html('Invalid email string.');
		}
	}
	else {
		$('#login_console_result').html('Missing required fields.');
	}
}

function signin() {
	var name=$('#login_console_name').val();
	var surname=$('#login_console_surname').val();
	var email=$('#login_console_email').val();
	var password=$('#login_console_password').val();
	var repassword=$('#login_console_repassword').val();

	if (name!="" && email!="" && password!="") {
		if (isEmail(email)==true) {
			if (password==repassword) {
				$.ajax({
					type: "GET",
					url: "signin.php",
					data: {name: name, surname: surname, email: email, password: password}, //effettuo una chiamata ajax
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					success: function (result) {
						console.log(result);
						if (result=="DUPLICATE") {
							$('#login_console_result').html('This email is already registered. <span id="login_console_login_button">Login</span>.');
							$('#login_console_login_button').click(function(){populate_login_console("login")});
						}
						else {
							$('#login_console_result').html('Account created succesfully!');
							$('#login_console_result').css('color','green');
							setTimeout(function(){
								populate_login_console("login");
								$('#login_console_email').val(email);
							}, 500);
						}
					}
				});
			}
			else {
				$('#login_console_result').html('The passwords are not matching.');
				console.log("password diverse");
			}
		}
		else {
			$('#login_console_result').html('Invalid email string.');
			console.log("password diverse");
		}
	}
	else {
		$('#login_console_result').html('Missing required fields.');
		console.log("mancano campi")
	}
}

function create_password() {
	var email=$('#login_console_email').val();
	var password=$('#login_console_password').val();
	$.ajax({
		type: "GET",
		url: "create_password.php",
		data: {email: email, password: password}, //effettuo una chiamata ajax
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			console.log(result);
			if (result=="OK") {
				$('#login_console_result').html('Password created succesfully!');
				$('#login_console_result').css('color','green');
				setTimeout(function(){
					populate_login_console("login");
					$('#login_console_email').val(email);
				}, 500);
			}
		}
	});
}

var add_console=0;
function adding_menu_console() {
	if (add_console==0) {
		add_console=1;
		$('#add_console').css('margin-top','0');
		$('#add_console_close').click(function(){adding_menu_console()});
	}
	else {
		add_console=0;
		var height=$('#add_console').height()+50;
		$('#add_console').css('margin-top', 0-height);
		$('#add_console_close').off();
	}
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
};

//funzione che verifica il formato della data yyyy-mm-dd
function isDate(txtDate) {
	var currVal = txtDate;
	if(currVal == '')
		return true;

    var rxDatePattern = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null) {
    	return isYear(currVal);
    }
    else {
    	var date=txtDate.split("-");

	    //Checks for mm/dd/yyyy format.
	    dtYear = date[0];
	    dtMonth= date[1];
	    dtDay = date[2];

	    if (dtMonth < 1 || dtMonth > 12)
	    	return false;
	    else if (dtDay < 1 || dtDay> 31)
	    	return false;
	    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
	    	return false;
	    else if (dtMonth == 2)
	    {
	    	var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
	    	if (dtDay> 29 || (dtDay ==29 && !isleap))
	    		return false;
	    }
	    return true;
	}
};

//funzione che verifica il formato della data yyyy
function isYear(txtDate) {
	var currVal = txtDate;
	if(currVal == '')
		return true;

    var rxDatePattern = /^\d{4}$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
    	return false;

    return true;
};

//funzione che formatta la data nel formato dd/mm/yyyy
function date_formatter(dateOb) {
	var d = new Date(dateOb);
	console.log(d);
	var day = d.getDate();
	console.log(day);
	var month = d.getMonth() + 1;
	console.log(month);
	var year = d.getFullYear();
	console.log(year);

	if(isNaN(day) || isNaN(month)) {
		return dateOb;
	}
	else{
		if (day < 10) {
			day = "0" + day;
		}
		if (month < 10) {
			month = "0" + month;
		}
		var date = day + "/" + month + "/" + year;
		return date;
	}
};

function number_formatter(str) {
	var parts = (str + "").split("."),
	main = parts[0],
	len = main.length,
	output = "",
	first = main.charAt(0),
	i;

	if (first === '-') {
		main = main.slice(1);
		len = main.length;
	}
	else {
		first = "";
	}
	i = len - 1;
	while(i >= 0) {
		output = main.charAt(i) + output;
		if ((len - i) % 3 === 0 && i > 0) {
			output = "," + output;
		}
		--i;
	}
	// put sign back
	output = first + output;
	// put decimal part back
	if (parts.length > 1) {
	    output += "." + parts[1];
	}
	return output;
};

function collection_select() {
	var email=$('body').attr('email');
	$.ajax({
		type: "GET",
		url: "api/collections.php",
			data: {email: email, request:"all_collections"}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				var res='<option value="all" selected="selected">All</option>';
				$.each(result, function(index,value) {
					res+='<option value="'+value.coll_id+'">'+value.coll_name+'</option>';
				});
				$('#coll_select').html(res);
			}
		});
};

function collection_manager() {
	$('#result .internal_slider').html("");
	var email=$('body').attr('email');
	$('#result .internal_slider').append("<h1 id='result_title'>Your Collections:</h1>");
	$.ajax({
		type: "GET",
		url: "api/collections.php",
			data: {email: email, request:"all_collections"}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				var res='<table id="collections_container">';
				$.each(result, function(index,value) {
					res+='<tr class="collection" collid="'+value.coll_id+'">'+
					'<td class="collection_name">'+value.coll_name+'</td>'+
					'<td class="collection_button"><img src="imgs/len.svg" class="collection_view" name="'+value.coll_name+'" collid="'+value.coll_id+'" alt="View Collection"/></td>'+
					'<td class="collection_button"><img src="imgs/edit.svg" class="collection_edit" name="'+value.coll_name+'" collid="'+value.coll_id+'" alt="Edit Collection" /></td>'+
					'<td class="collection_button"><img src="imgs/file.svg" class="collection_export" name="'+value.coll_name+'" collid="'+value.coll_id+'" alt="Export Collection" /></td>'+
					'<td class="collection_button"><img src="imgs/bin.svg" class="collection_delete" name="'+value.coll_name+'" collid="'+value.coll_id+'" alt="Delete Collection" /></td>'+
					'</tr>';
				});
				res+='<tr id="new_collection">'+
				'<td>Create a new collection</td>'+
				'<td class="collection_button" colspan=4><img src="imgs/plus.svg" /></td>'+
				'</tr>';
				res+="</table>";
				$('#result .internal_slider').append(res);
				$(".collection_view").click(function(){view_collection($(this).attr('collid'), $(this).attr('name'))});
				$(".collection_edit").click(function(){edit_collection($(this).attr('collid'), $(this).attr('name'))});
				$(".collection_export").click(function(){export_collection($(this).attr('collid'), $(this).attr('name'))});
				$(".collection_delete").click(function(){delete_collection($(this).attr('collid'), $(this).attr('name'))});
				$("#new_collection").click(function(){new_collection()});
			}
		});
	$.fn.fullpage.moveTo(1, 1);
};

function view_collection(id, name) {
	$.ajax({
		type: "GET",
		url: "api/collections.php",
		data: {id:id, request: "view_collection"}, //effettuo una chiamata ajax
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			console.log(result)
			var res=""; //variabile che contiene i risultati

			var persons=result[0];
			var places=result[1];
			var cho=result[2];
			var DBlength=0;
			if (persons!=null) {
				DBlength+=persons.length;
			}
			if (places!=null) {
				DBlength+=places.length;
			}
			if (cho!=null) {
				DBlength+=cho.length;
			}

			if (persons==null && places==null && cho==null) {
				$('#result .internal_slider').html("");
				$('#result .internal_slider').append("<h1 id='result_title'>Sorry, '"+name+"' is empty.</h1>");
			}
			else {
				$('#result .internal_slider').html("");
				$('#result .internal_slider').append("<h1 id='result_title'>"+DBlength+" records in '"+name+"':</h1>");
			}

			if (persons!=null) {
				$('#result .internal_slider').append("<h2 class='result_subtitle' type='person'>"+persons.length+" Persons<img class='DB_arrow' type='person' src='imgs/arrow.svg' /></h2>");
				var person_res="<table class='DB_records_container' type='person'>";
				person_res+='<thead><tr><td>Name</td><td>Birth Date</td><td>Birth Place</td><td>Death Date</td><td>Death Place</td><td class="centered">View</td></tr></thead>';
				$.each(persons, function(index,value) {
					var key_id=value.key_id;
					var name=value.name;
					var surname=value.surname;
					var picture=value.picture;
					var birthdate=value.was_born;
					var birthyear=value.was_born_year;
					var birth;
					var birthplace=value.born_in;
					var deathdate=value.died;
					var deathyear=value.died_year;
					var death;
					var deathplace=value.died_in;
					var still_alive=value.still_alive;

					//se il luogo di nascita non è specificato lo indico come mancante
					if (birthplace=="") {
						birthplace="--"
					}
					//se il luogo di morte non è specificato lo indico come mancante
					if (deathplace=="") {
						deathplace="--"
					}

					if (birthdate=="0000-00-00") {
						birth=birthyear;
					}
					else {
						birth=date_formatter(birthdate);
					};

					if (deathdate=="0000-00-00") {
						if (still_alive=="1") {
							death="Still Alive";
						}
						else {
							if (deathyear==0) {
								death="--";
							}
							else {
								death=deathyear;
							}

						}
					}
					else {
						death=date_formatter(deathdate);
					}

					person_res+='<tr class="DB_record"><td><b>'+name+' '+surname+'</b></td>'+
					'<td>'+birth+'</td><td>'+birthplace+'</td><td>'+death+'</td><td>'+deathplace+'</td>'+
					'<td class="centered"><img type="person" key_id="'+key_id+'" class="view_record" src="imgs/len.svg" /></td>'+
					'</tr>';
				});
				person_res+='</table>';

				$('#result .internal_slider').append(person_res);
			}

			if (places!=null) {
				$('#result .internal_slider').append("<h2 type='places' class='result_subtitle'>"+places.length+" Places<img class='DB_arrow' type='places' src='imgs/arrow.svg' /></h2>");
				var places_res="<table class='DB_records_container' type='places'>";
				places_res+='<thead><tr><td>Name</td><td>Region</td><td>Country</td><td>Population</td><td>Lat,Long</td><td class="centered">View</td></tr></thead>';
				$.each(places, function(index,value) {
					var key_id=value.key_id;
					var oname=value.original_name;
					var ename=value.english_name;
					var picture=value.picture;
					var country=value.country;
					var region=value.region;
					var population=value.population;
					var lat=value.latitude;
					var long=value.longitude;
					var latlong;
					var mapid="map"+index; //id per la creazione delle mappe
					var bio=value.description;
					var linkwiki=value.linkwikipedia;

					if (population=="0") {
						population="--";
					}
					else {
						population=number_formatter(population);
					}

					if (region=="") {
						region="--";
					}

					if (country=="") {
						country="--";
					}

					if (lat==0 || long==0) {
						latlong="--";
					}
					else {
						latlong=lat+", "+long;
					}

					places_res+='<tr class="DB_record"><td><b>'+oname+', '+ename+'</b></td>'+
					'<td>'+region+'</td><td>'+country+'</td><td>'+population+'</td><td>'+latlong+'</td>'+
					'<td class="centered"><img type="place" key_id="'+key_id+'" class="view_record" src="imgs/len.svg" /></td>'+
					'</tr>';
				});
				places_res+="</table>";
				$('#result .internal_slider').append(places_res);
			}

			if (cho!=null) {
				$('#result .internal_slider').append("<h2 type='cho' class='result_subtitle'>"+cho.length+" Cultural Heritage Object<img class='DB_arrow' type='cho' src='imgs/arrow.svg' /></h2>");
				var cho_res="<table class='DB_records_container' type='cho'>";
				cho_res+='<thead><tr><td>Title</td><td>Author</td><td>Place</td><td>Date</td><td>Type</td><td class="centered">View</td></tr></thead>';
				$.each(cho, function(index,value) {
					var key_id=value.key_id;
					var otitle=value.original_title;
					var etitle=value.english_title;
					var author=value.author;
					var author_id=value.author_id;
					var place=value.place;
					var cdate=value.creation_date;
					var idate=value.issue_date;
					var type=value.type;
					var lang=value.language;
					var bio=value.bio;
					var linkwiki=value.linkwiki;
					var picture=value.picture;

					if (etitle=="") {
						etitle=otitle;
					}

					if (lang!="") {
						type=type+" ("+lang+")";
					}

					if (idate!="") {
						var date=cdate+" (creation), "+idate+" (issue)";
					}
					else {
						var date=cdate+" (creation)";
					}



					cho_res+='<tr class="DB_record"><td><b>'+otitle+' ('+etitle+')</b></td>'+
					'<td>'+author+'</td><td>'+place+'</td><td>'+date+'</td><td>'+type+'</td>'+
					'<td class="centered"><img type="cho" key_id="'+key_id+'" class="view_record" src="imgs/len.svg" /></td>'+
					'</tr>';
				});
				cho_res+="</table>";
				$('#result .internal_slider').append(cho_res);
			}

			$('.DB_records_container').hide();
			$('.result_subtitle').click(function(){
				var type=$(this).attr('type');
				$('.DB_records_container[type="'+type+'"]').toggle();
				$('.DB_arrow[type="'+type+'"]').toggleClass("rotate");
				$(this).toggleClass("result_subtitle_fw");
			})
			$.fn.fullpage.moveTo(1, 1);
			$('.view_record').click(function(){
				var type=$(this).attr("type");
				var key_id=$(this).attr("key_id");
				searchRecord(type, key_id);
			})
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});
};

function edit_collection(id, name) {
	$.ajax({
		type: "GET",
		url: "api/collections.php",
		data: {id:id, request: "view_collection"}, //effettuo una chiamata ajax
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			console.log(result)
			var res=""; //variabile che contiene i risultati

			var persons=result[0];
			var places=result[1];
			var cho=result[2];
			var DBlength=0;
			if (persons!=null) {
				DBlength+=persons.length;
			}
			if (places!=null) {
				DBlength+=places.length;
			}
			if (cho!=null) {
				DBlength+=cho.length;
			}

			if (persons==null && places==null && cho==null) {
				$('#result .internal_slider').html("");
				$('#result .internal_slider').append("<h1 id='result_title'>'"+name+"' is empty.</h1>");
			}
			else {
				$('#result .internal_slider').html("");
				$('#result .internal_slider').append("<h1 id='result_title'>Edit '"+name+"':</h1>");
			}

			if (persons!=null) {
				$('#result .internal_slider').append("<h2 class='result_subtitle result_subtitle_fw' type='person'>"+persons.length+" Persons<img class='DB_arrow rotate' type='person' src='imgs/arrow.svg' /></h2>");
				var person_res="<table class='DB_records_container' type='person'>";
				person_res+='<thead><tr><td>Name</td><td>Birth Date</td><td>Birth Place</td><td>Death Date</td><td>Death Place</td><td class="centered">Remove</td></tr></thead>';
				$.each(persons, function(index,value) {
					var key_id=value.key_id;
					var name=value.name;
					var surname=value.surname;
					var picture=value.picture;
					var birthdate=value.was_born;
					var birthyear=value.was_born_year;
					var birth;
					var birthplace=value.born_in;
					var deathdate=value.died;
					var deathyear=value.died_year;
					var death;
					var deathplace=value.died_in;
					var still_alive=value.still_alive;

					//se il luogo di nascita non è specificato lo indico come mancante
					if (birthplace=="") {
						birthplace="--"
					}
					//se il luogo di morte non è specificato lo indico come mancante
					if (deathplace=="") {
						deathplace="--"
					}

					if (birthdate=="0000-00-00") {
						birth=birthyear;
					}
					else {
						birth=date_formatter(birthdate);
					};

					if (deathdate=="0000-00-00") {
						if (still_alive=="1") {
							death="Still Alive";
						}
						else {
							if (deathyear==0) {
								death="--";
							}
							else {
								death=deathyear;
							}

						}
					}
					else {
						death=date_formatter(deathdate);
					}

					person_res+='<tr class="DB_record" key_id="'+key_id+'" name="'+name+' '+surname+'"><td><b>'+name+' '+surname+'</b></td>'+
					'<td>'+birth+'</td><td>'+birthplace+'</td><td>'+death+'</td><td>'+deathplace+'</td>'+
					'<td class="centered"><img type="person" key_id="'+key_id+'" class="remove_record" src="imgs/bin.svg" /></td>'+
					'</tr>';
				});
				person_res+='</table>';

				$('#result .internal_slider').append(person_res);
			}

			if (places!=null) {
				$('#result .internal_slider').append("<h2 type='places' class='result_subtitle result_subtitle_fw'>"+places.length+" Places<img class='DB_arrow rotate' type='places' src='imgs/arrow.svg' /></h2>");
				var places_res="<table class='DB_records_container' type='places'>";
				places_res+='<thead><tr><td>Name</td><td>Region</td><td>Country</td><td>Population</td><td>Lat,Long</td><td class="centered">Remove</td></tr></thead>';
				$.each(places, function(index,value) {
					var key_id=value.key_id;
					var oname=value.original_name;
					var ename=value.english_name;
					var picture=value.picture;
					var country=value.country;
					var region=value.region;
					var population=value.population;
					var lat=value.latitude;
					var long=value.longitude;
					var latlong;
					var mapid="map"+index; //id per la creazione delle mappe
					var bio=value.description;
					var linkwiki=value.linkwikipedia;

					if (population=="0") {
						population="--";
					}
					else {
						population=number_formatter(population);
					}

					if (region=="") {
						region="--";
					}

					if (country=="") {
						country="--";
					}

					if (lat==0 || long==0) {
						latlong="--";
					}
					else {
						latlong=lat+", "+long;
					}

					places_res+='<tr class="DB_record" key_id="'+key_id+'" name="'+oname+'"><td><b>'+oname+', '+ename+'</b></td>'+
					'<td>'+region+'</td><td>'+country+'</td><td>'+population+'</td><td>'+latlong+'</td>'+
					'<td class="centered"><img type="place" key_id="'+key_id+'" class="remove_record" src="imgs/bin.svg" /></td>'+
					'</tr>';
				});
				places_res+="</table>";
				$('#result .internal_slider').append(places_res);
			}

			if (cho!=null) {
				$('#result .internal_slider').append("<h2 type='cho' class='result_subtitle result_subtitle_fw'>"+cho.length+" Cultural Heritage Object<img class='DB_arrow rotate' type='cho' src='imgs/arrow.svg' /></h2>");
				var cho_res="<table class='DB_records_container' type='cho'>";
				cho_res+='<thead><tr><td>Title</td><td>Author</td><td>Place</td><td>Date</td><td>Type</td><td class="centered">Remove</td></tr></thead>';
				$.each(cho, function(index,value) {
					var key_id=value.key_id;
					var otitle=value.original_title;
					var etitle=value.english_title;
					var author=value.author;
					var author_id=value.author_id;
					var place=value.place;
					var cdate=value.creation_date;
					var idate=value.issue_date;
					var type=value.type;
					var lang=value.language;
					var bio=value.bio;
					var linkwiki=value.linkwiki;
					var picture=value.picture;

					if (etitle=="") {
						etitle=otitle;
					}

					if (lang!="") {
						type=type+" ("+lang+")";
					}

					if (idate!="") {
						var date=cdate+" (creation), "+idate+" (issue)";
					}
					else {
						var date=cdate+" (creation)";
					}



					cho_res+='<tr class="DB_record" key_id="'+key_id+'" name="'+otitle+'"><td><b>'+otitle+' ('+etitle+')</b></td>'+
					'<td>'+author+'</td><td>'+place+'</td><td>'+date+'</td><td>'+type+'</td>'+
					'<td class="centered"><img type="cho" key_id="'+key_id+'" class="remove_record" src="imgs/bin.svg" /></td>'+
					'</tr>';
				});
				cho_res+="</table>";
				$('#result .internal_slider').append(cho_res);
			}


			$('.result_subtitle').click(function(){
				var type=$(this).attr('type');
				$('.DB_records_container[type="'+type+'"]').toggle();
				$('.DB_arrow[type="'+type+'"]').toggleClass("rotate");
				$(this).toggleClass("result_subtitle_fw");
			})
			$.fn.fullpage.moveTo(1, 1);
			$('.remove_record').click(function(){
				$('.remove_record').off();
				var key_id=$(this).attr("key_id");
				var elem=$('.DB_record[key_id="'+key_id+'"]');
				var elem_name=elem.attr('name');
				var string='<td colspan=5>Remove "<i>'+elem_name+'</i>" from the collection?</td>'+
				'<td class="centered"><img id="remove_record_confirm" src="imgs/check.svg" />'+
				'<img id="remove_record_cancel" src="imgs/cancel.svg" /></td>';
				elem.css('background-color','#ffbcbc');
				elem.html(string);
				$('#remove_record_confirm').click(function(){modify_collection_elem("remove_element", id, name, key_id);});
				$('#remove_record_cancel').click(function(){edit_collection(id, name);});
			})
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});

	$.ajax({
		type: "GET",
		url: "api/collections.php",
		data: {coll_id:id, request: "elem_in_DB"}, //effettuo una chiamata ajax
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			console.log(result)
			var res=""; //variabile che contiene i risultati

			var persons=result[0];
			var places=result[1];
			var cho=result[2];
			var DBlength=0;
			if (persons!=null) {
				DBlength+=persons.length;
			}
			if (places!=null) {
				DBlength+=places.length;
			}
			if (cho!=null) {
				DBlength+=cho.length;
			}

			if (persons==null && places==null && cho==null) {
				$('#result .internal_slider').append("<h1 id='result_title'>No more records in the Database.</h1>");
			}
			else {
				$('#result .internal_slider').append("<div class='big_divider'></div>");
				$('#result .internal_slider').append("<h1 id='result_title'>Add elements to the Collection:</h1>");
			}

			if (persons!=null) {
				$('#result .internal_slider').append("<h2 class='result_subtitleDB' type='personDB'>Persons<img class='DB_arrow rotate' type='personDB' src='imgs/arrow.svg' /></h2>");
				var person_res="<table class='DB_records_container hide' type='personDB'>";
				person_res+='<thead><tr><td>Name</td><td>Birth Date</td><td>Birth Place</td><td>Death Date</td><td>Death Place</td><td class="centered">Add</td></tr></thead>';
				$.each(persons, function(index,value) {
					var key_id=value.key_id;
					var name=value.name;
					var surname=value.surname;
					var picture=value.picture;
					var birthdate=value.was_born;
					var birthyear=value.was_born_year;
					var birth;
					var birthplace=value.born_in;
					var deathdate=value.died;
					var deathyear=value.died_year;
					var death;
					var deathplace=value.died_in;
					var still_alive=value.still_alive;

					//se il luogo di nascita non è specificato lo indico come mancante
					if (birthplace=="") {
						birthplace="--"
					}
					//se il luogo di morte non è specificato lo indico come mancante
					if (deathplace=="") {
						deathplace="--"
					}

					if (birthdate=="0000-00-00") {
						birth=birthyear;
					}
					else {
						birth=date_formatter(birthdate);
					};

					if (deathdate=="0000-00-00") {
						if (still_alive=="1") {
							death="Still Alive";
						}
						else {
							if (deathyear==0) {
								death="--";
							}
							else {
								death=deathyear;
							}

						}
					}
					else {
						death=date_formatter(deathdate);
					}

					person_res+='<tr class="DB_record"><td><b>'+name+' '+surname+'</b></td>'+
					'<td>'+birth+'</td><td>'+birthplace+'</td><td>'+death+'</td><td>'+deathplace+'</td>'+
					'<td class="centered"><img type="person" key_id="'+key_id+'" class="add_record" src="imgs/add.svg" /></td>'+
					'</tr>';
				});
				person_res+='</table>';

				$('#result .internal_slider').append(person_res);
			}

			if (places!=null) {
				$('#result .internal_slider').append("<h2 type='placesDB' class='result_subtitleDB'>Places<img class='DB_arrow rotate' type='placesDB' src='imgs/arrow.svg' /></h2>");
				var places_res="<table class='DB_records_container hide' type='placesDB'>";
				places_res+='<thead><tr><td>Name</td><td>Region</td><td>Country</td><td>Population</td><td>Lat,Long</td><td class="centered">Add</td></tr></thead>';
				$.each(places, function(index,value) {
					var key_id=value.key_id;
					var oname=value.original_name;
					var ename=value.english_name;
					var picture=value.picture;
					var country=value.country;
					var region=value.region;
					var population=value.population;
					var lat=value.latitude;
					var long=value.longitude;
					var latlong;
					var mapid="map"+index; //id per la creazione delle mappe
					var bio=value.description;
					var linkwiki=value.linkwikipedia;

					if (population=="0") {
						population="--";
					}
					else {
						population=number_formatter(population);
					}

					if (region=="") {
						region="--";
					}

					if (country=="") {
						country="--";
					}

					if (lat==0 || long==0) {
						latlong="--";
					}
					else {
						latlong=lat+", "+long;
					}

					places_res+='<tr class="DB_record"><td><b>'+oname+', '+ename+'</b></td>'+
					'<td>'+region+'</td><td>'+country+'</td><td>'+population+'</td><td>'+latlong+'</td>'+
					'<td class="centered"><img type="place" key_id="'+key_id+'" class="add_record" src="imgs/add.svg" /></td>'+
					'</tr>';
				});
				places_res+="</table>";
				$('#result .internal_slider').append(places_res);
			}

			if (cho!=null) {
				$('#result .internal_slider').append("<h2 type='choDB' class='result_subtitleDB'>Cultural Heritage Object<img class='DB_arrow rotate' type='choDB' src='imgs/arrow.svg' /></h2>");
				var cho_res="<table class='DB_records_container hide' type='choDB'>";
				cho_res+='<thead><tr><td>Title</td><td>Author</td><td>Place</td><td>Date</td><td>Type</td><td class="centered">Add</td></tr></thead>';
				$.each(cho, function(index,value) {
					var key_id=value.key_id;
					var otitle=value.original_title;
					var etitle=value.english_title;
					var author=value.author;
					var author_id=value.author_id;
					var place=value.place;
					var cdate=value.creation_date;
					var idate=value.issue_date;
					var type=value.type;
					var lang=value.language;
					var bio=value.bio;
					var linkwiki=value.linkwiki;
					var picture=value.picture;

					if (etitle=="") {
						etitle=otitle;
					}

					if (lang!="") {
						type=type+" ("+lang+")";
					}

					if (idate!="") {
						var date=cdate+" (creation), "+idate+" (issue)";
					}
					else {
						var date=cdate+" (creation)";
					}



					cho_res+='<tr class="DB_record"><td><b>'+otitle+' ('+etitle+')</b></td>'+
					'<td>'+author+'</td><td>'+place+'</td><td>'+date+'</td><td>'+type+'</td>'+
					'<td class="centered"><img type="cho" key_id="'+key_id+'" class="add_record" src="imgs/add.svg" /></td>'+
					'</tr>';
				});
				cho_res+="</table>";
				$('#result .internal_slider').append(cho_res);
			}

			$('.DB_records_container.hide').hide();
			$('.result_subtitleDB').click(function(){
				var type=$(this).attr('type');
				$('.DB_records_container[type="'+type+'"]').toggle();
				$('.DB_arrow[type="'+type+'"]').toggleClass("rotate");
				$(this).toggleClass("result_subtitle_fw");
			})
			$.fn.fullpage.moveTo(1, 1);
			$('.add_record').click(function(){
				var key_id=$(this).attr("key_id");
				modify_collection_elem("add_element", id, name, key_id);
			})
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});
};

function new_collection() {
	$("#new_collection").off();
	$('#new_collection').css('background-color', '#8fb4c1');
	var string='<tr id="new_collection_row"><td id="new_collection_name"><input type="text" placeholder="New collection name"></input></td>'+
	'<td></td>'+
	'<td></td>'+
	'<td class="collection_button" id="new_collection_create"><img src="imgs/check.svg" /></td>'+
	'<td class="collection_button" id="new_collection_cancel"><img src="imgs/cancel.svg" /></td></tr>';
	$("#collections_container").append(string);
	$("#new_collection_cancel").click(function(){collection_manager()});
	$("#new_collection_create").click(function(){modify_collection('add_collection')});
};

function delete_collection(id) {
	$(".collection_delete").off();
	var elem=$('.collection[collid="'+id+'"]');
	var name=$('.collection[collid="'+id+'"] .collection_name').html();
	var string='<td>Delete <i>'+name+'</i>?</td>'+
	'<td></td>'+
	'<td></td>'+
	'<td class="collection_button" id="delete_collection_confirm"><img src="imgs/check.svg" /></td>'+
	'<td class="collection_button" id="delete_collection_cancel"><img src="imgs/cancel.svg" /></td>';
	elem.css('background-color','#ffbcbc');
	elem.html(string);
	$("#delete_collection_cancel").click(function(){collection_manager()});
	$("#delete_collection_confirm").click(function(){modify_collection('delete_collection', id)});
}

function modify_collection(action, id) {
	$("#new_collection_create").off();
	var email=$('body').attr('email');
	var name=$("#new_collection_name input").val();

	if (action=="add_collection") {
		$.ajax({
			type: "GET",
			url: "api/collections.php",
			data: {email: email, name:name, request:"add_collection"}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {

			}
		});
	}
	else if (action=="delete_collection") {
		$.ajax({
			type: "GET",
			url: "api/collections.php",
			data: {id:id, request:"delete_collection"}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				console.log(result);
			}
		});
	}
	setTimeout(function(){collection_manager()},800);
	setTimeout(function(){collection_select()},800);
};

function modify_collection_elem(action, coll_id, coll_name, elem_id) {
	console.log(action+' from/to collection '+coll_id+', elem_id: '+elem_id);
	if (action=="remove_element") {
		$.ajax({
			type: "GET",
			url: "api/collections.php",
			data: {coll_id: coll_id, elem_id: elem_id, request: action}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				console.log(result);
			}
		});
	}
	else if (action=="add_element") {
		$.ajax({
			type: "GET",
			url: "api/collections.php",
			data: {coll_id: coll_id, elem_id: elem_id, request: action}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				console.log(result);
			}
		});
	}
	setTimeout(function(){edit_collection(coll_id,coll_name)},800);
};

function add_element(coll_id, elem_id) {
	$.ajax({
			type: "GET",
			url: "api/collections.php",
			data: {coll_id: coll_id, elem_id: elem_id, request: "add_element"}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				console.log(result);
			}
	});
}

var zip;
var files;
var dump;
function export_collection(coll_id, name) {
	$.ajax({
		type: "GET",
		url: "api/collections.php",
		data: {id:coll_id, request: "view_collection2"}, //effettuo una chiamata ajax
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			console.log(result)

			zip = new JSZip();
			var readme='----- Files downloaded from MetadataEditor -----\r\n\r\n'+
			'• In the "dump" folder you can find the DataBase structure, we recommend to import that first, if you haven\'t already.\r\n'+
			'• Each csv file is related to a single table (persons, places, cho). You can import each datalist into each table.\r\n'+
			'• The first line of each csv file contains the table fileds, make sure to check it out in your import options.';
			zip.file("README.txt", readme);
			files = zip.folder("csv");
			dump = zip.folder("dump");

	        var names=["persons","places","cho"];
	        for (i=0; i<result.length; i++) {
	        	if (result[i]!=null) {
	        		JSONToCSVConvertor(result[i], name, names[i], true);
	        	}
	        }
	        var dump_file;
	        jQuery.get('dump/metadata_editor.sql', function(data) {
			   dump_file=data;
			   console.log(dump_file);
			   dump.file('metadata_editor.csv', dump_file);
			});

			setTimeout(function(){
				zip.generateAsync({type:"blob"})
				.then(function(content) {
				    // see FileSaver.js
				    saveAs(content, name.toLowerCase().replace(/ /g,"_")+".zip");
				});
			},200);


		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});
};

function JSONToCSVConvertor(JSONData, ReportTitle, type, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = '';
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_") + '_' + type;

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    files.file(fileName.toLowerCase()+'.csv', CSV);

    //this part will append the anchor tag and remove it after automatic click
    /*document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);*/
}

function create_element(request, value) {
	var key_id=value.key_id;
	var res="";
	if (request=="person") {
		res="";
		var key_id=value.key_id;
		var id=value.person_id;
		var name=value.name;
		var surname=value.surname;
		var picture=value.picture;
		var birthdate=value.was_born;
		var birthyear=value.was_born_year;
		var birthplace=value.born_in;
		var deathdate=value.died;
		var deathyear=value.died_year;
		var deathplace=value.died_in;
		var still_alive=value.still_alive;
		var bio=value.bio;
		var linkwiki=value.linkwikiperson;
		var linkviaf=value.linkviafperson;

		//se il luogo di nascita non è specificato lo indico come mancante
		if (birthplace=="") {
			birthplace="--"
		}
		//se il luogo di morte non è specificato lo indico come mancante
		if (deathplace=="") {
			deathplace="--"
		}
		//se la data di morte non è riconosciuta dal database, verifico il campo still_alive
		//altrimenti verifico se esiste l'anno di morte, e in caso negativo la segno come mancante
		if (birthdate=="0000-00-00") {
			birthdate=birthyear;
		}
		else {
			birthdate=date_formatter(birthdate);
		}
		//se la data di morte non è riconosciuta dal database, verifico il campo still_alive
		//altrimenti verifico se esiste l'anno di morte, e in caso negativo la segno come mancante
		if (deathdate=="0000-00-00") {
			if (still_alive=="1") {
				deathdate="Still Alive";
			}
			else {
				if (deathyear==0) {
					deathdate="--";
				}
				else {
					deathdate=deathyear;
				}
			}
		}
		else {
			deathdate=date_formatter(deathdate);
		}

		res+='<div class="result_content person" key_id="'+key_id+'">'+
		'<div class="result_column1">'+
		'<img class="result_image load" src="'+picture+'" />'+
		'</div>'+
		'<div class="result_column2">'+
		'<span class="result_title">'+name+' '+surname+'</span>'+
		'<span class="result_edit">'+
		"<img class='result_modify' key_id='"+key_id+"' request='person' src='imgs/edit.svg' title='Edit element'/>"+
		"<img class='result_delete' key_id='"+key_id+"' request='person' src='imgs/bin.svg' title='Delete element'/>"+
		'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Info</span>'+
		'<span><b>Birth Date:</b> '+birthdate+'</span><br/>'+
		'<span><b>Birth Place:</b> '+birthplace+'</span><br/>'+
		'-<br/>'+
		'<span><b>Death Date:</b> '+deathdate+'</span><br/>'+
		'<span><b>Death Place:</b> '+deathplace+'</span><br/>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Bio</span>'+
		'<span class="result_bio">'+bio+'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Links</span>'+
		'<ul class="result_links"><li><a href="'+linkwiki+'">Wikipedia</a></li><li><a href="'+linkviaf+'">Viaf</a></li></ul>'+
		'</div>'+
		'</div>';

		$('#result .internal_slider').append(res);
		$('#result .internal_slider').append('<span class="big_divider"></span>');

		var places=[];
		if (birthplace!="--") {
			places.push(birthplace.split(',')[0]);
		}
		if (deathplace!="--"&&deathplace!=birthplace) {
			places.push(deathplace.split(',')[0]);
		}
		associations_places(key_id,places);

		associations_cho(key_id,name+' '+surname);
	}

	else if (request=="place") {
		res="";
		var key_id=value.key_id;
		var id=value.location_id;
		var oname=value.original_name;
		var ename=value.english_name;
		var picture=value.picture;
		var country=value.country;
		var region=value.region;
		var population=value.population;
		var lat=value.latitude;
		var long=value.longitude;
		var mapid="map"+key_id; //id per la creazione delle mappe
		var bio=value.description;
		var linkwiki=value.linkwikipedia;

		if (population=="0") {
			population="--";
		}
		else {
			population=number_formatter(population);
		}

		if (region=="") {
			region="--";
		}

		if (country=="") {
			country="--";
		}

		res+='<div class="result_content person" key_id="'+key_id+'">'+
		'<div class="result_column1">'+
		'<img class="result_image load" src="'+picture+'" />'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub2">Map</span>'+
		'<span class="map" id="'+mapid+'"></span>'+
		'</div>'+
		'<div class="result_column2">'+
		'<span class="result_title">'+oname+' ('+ename+')</span>'+
		'<span class="result_edit">'+
		"<img class='result_modify' key_id='"+key_id+"' request='place' src='imgs/edit.svg' title='Edit element'/>"+
		"<img class='result_delete' key_id='"+key_id+"' request='place' src='imgs/bin.svg' title='Delete element'/>"+
		'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Info</span>'+
		'<span><b>Country:</b> '+country+'</span><br/>'+
		'<span><b>Region:</b> '+region+'</span><br/>'+
		'<span><b>Population:</b> '+population+'</span><br/>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Bio</span>'+
		'<span class="result_bio">'+bio+'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Links</span>'+
		'<ul class="result_links"><li><a href="'+linkwiki+'">Wikipedia</a></li></ul>'+
		'</div>'+
		'</div>';

		$('#result .internal_slider').append(res);
		$('#result .internal_slider').append('<span class="big_divider"></span>');

		if (lat!=0&&long!=0) {
			//creo la mappa per il risultato corrente
			createMap(mapid, lat, long);
		}
		else { //se lat e long non sono definiti, la mappa non viene mostrata
			$("#"+mapid).html("No Latitude and Longitude given.");
			$("#"+mapid).height("auto");
		}
	}

	else if (request=="cho") {
		var key_id=value.key_id;
		var otitle=value.original_title;
		var etitle=value.english_title;
		var author=value.author;
		var author_id=value.author_id;
		var place=value.place;
		var cdate=value.creation_date;
		var idate=value.issue_date;
		var type=value.type;
		var lang=value.language;
		var bio=value.bio;
		var linkwiki=value.linkwiki;
		var picture=value.picture;

		if (etitle=="") {
			etitle=otitle;
		}

		if (lang!="") {
			type=type+" ("+lang+")";
		}

		if (idate=="") {
			idate="--";
		}

		res+='<div class="result_content person" key_id="'+key_id+'">'+
		'<div class="result_column1">'+
		'<img class="result_image load" src="'+picture+'" />'+
		'</div>'+
		'<div class="result_column2">'+
		'<span class="result_title">'+otitle+'<br/>('+etitle+')</span>'+
		'<span class="result_edit">'+
		"<img class='result_modify' key_id='"+key_id+"' request='cho' src='imgs/edit.svg' title='Edit element'/>"+
		"<img class='result_delete' key_id='"+key_id+"' request='cho' src='imgs/bin.svg' title='Delete element'/>"+
		'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Info</span>'+
		'<span><b>Author:</b> '+author+'</span><br/>'+
		'<span><b>Date of creation:</b> '+cdate+'</span><br/>'+
		'<span><b>Date of issue:</b> '+idate+'</span><br/>'+
		'<span><b>Type:</b> '+type+'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Bio</span>'+
		'<span class="result_bio">'+bio+'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Links</span>'+
		'<ul class="result_links"><li><a href="'+linkwiki+'">Wikipedia</a></li></ul>'+
		'</div>'+
		'</div>';

		$('#result .internal_slider').append(res);
		$('#result .internal_slider').append('<span class="big_divider"></span>');

		associations_persons(key_id,author);

	}

	var attr = $('body').attr('email');
	// For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.
	if (typeof attr !== typeof undefined && attr !== false) {
		console.log("Create Collections");
	  // Element has this attribute
		$.ajax({
			type: "GET",
			url: "api/collections.php",
			data: {key_id: key_id, request:"elem_in_coll"}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				var string='<span class="result_divider"></span>'+
				'<span class="result_sub">Collections</span>'+
				'<ul class="result_collection">';
				if (result!=null) {
					$.each(result, function(index,value) {
						string+='<li>'+value.coll_name+'</li>';
					})
				}
				string+='<li class="result_collection_add" key_id="'+key_id+'">Add to a collection</li></ul>';

				$('.result_content[key_id="'+key_id+'"] .result_column2').append(string);

				$('.result_collection_add').off();
				$('.result_collection_add').click(function(){
					$('.result_collection_add').off();
					$('.result_collection_add').html("");
					var key_id=$(this).attr("key_id");
					var elem=$('.result_content[key_id="'+key_id+'"]');
					var string="";
					$.ajax({
						type: "GET",
						url: "api/collections.php",
						data: {key_id: key_id, request:"elem_notin_coll"}, //effettuo una chiamata ajax
						contentType: "application/x-www-form-urlencoded; charset=UTF-8",
						success: function (result) {
							console.log(result)
							string+='Add to: <select id="coll_select">'+
							'<option selected disabled hidden>Select the Collection</option>';
							$.each(result, function(index,value){
								string+='<option value="'+value.coll_id+'">'+value.coll_name+'</option>';
							})
							string+='</select><img id="result_collection_add_confirm" src="imgs/check.svg" /><img id="result_collection_add_cancel" src="imgs/cancel.svg" />';
							elem.find($('.result_collection_add')).html(string);

							$('#result_collection_add_confirm').click(function(){
								var coll=$('#coll_select').val();
								if (coll!=null) {
									add_element(coll, key_id);
									setTimeout(function(){searchRecord(type, key_id);},200);
								}
								else {

								}
							});

							$('#result_collection_add_cancel').click(function(){
								searchRecord(type, key_id);
							});
						}
					});
				})
			}
		});
	}

	function create_action(){
		$('.result_modify').off();
		$('.result_delete').off();

		//aggiungo l'evento all'icona di modifica con i dati dell'oggetto da modificare
		$('.result_modify').click(function(){
			console.log("modify")
			var request=$(this).attr("request");
			var key_id=$(this).attr("key_id");
			console.log(request+key_id)
			modify_menu(request,key_id);
		})

		$('.result_delete').click(function(){
			var request=$(this).attr("request");
			var key_id=$(this).attr("key_id");
			var index=$(this).attr("index");
			var elem=$('.result_content[key_id='+key_id+']');
			var orig_content=elem.html();
			var height=elem.height();
			var string='<br/><span class="result_delete_message">Do you want to remove this record?</span>'+
			'<img id="result_delete_confirm" src="imgs/check.svg" />'+
			'<img id="result_delete_cancel" src="imgs/cancel.svg" />';
			elem.find($('.result_title')).append(string);
			elem.find($('.result_edit')).remove();

			$('#result_delete_confirm').click(function(){
				console.log(request)
				modify_data(request, key_id, "delete");
				elem.html('<span class="result_deleted_message">Record deleted correctly.</span>');
			})

			$('#result_delete_cancel').click(function(){
				searchRecord(request, key_id);
			})
		})

		var col1=$('.result_content[key_id='+key_id+'] .result_column1');
		var col2=$('.result_content[key_id='+key_id+'] .result_column2');
		$(".load").one("load", function() { //quando le immagini hanno caricato
			console.log(col1.height());
			console.log(col2.height());
			if (col1.height()>col2.height()) {
				col2.height(col1.height());
			}
			setTimeout(function(){ //controlla dopo 500ms per prevenire i bug
				if (col1.height()>col2.height()) {
					col2.height(col1.height());
				}
			},500);
		}).each(function() {
			if(this.complete) $(this).load();
		});


	}
	create_action();
};

function create_assoc_element(request, value) {
	$('#result_association').remove();
	$('.internal_slider').append('<span id="result_association"></span>');
	var string='<h1 class="result_main_title">Associated Record:</h1>';
	$('#result_association').html(string);

	var key_id=value.key_id;
	var res="";
	if (request=="person") {
		res="";
		var key_id=value.key_id;
		var id=value.person_id;
		var name=value.name;
		var surname=value.surname;
		var picture=value.picture;
		var birthdate=value.was_born;
		var birthyear=value.was_born_year;
		var birthplace=value.born_in;
		var deathdate=value.died;
		var deathyear=value.died_year;
		var deathplace=value.died_in;
		var still_alive=value.still_alive;
		var bio=value.bio;
		var linkwiki=value.linkwikiperson;
		var linkviaf=value.linkviafperson;

		//se il luogo di nascita non è specificato lo indico come mancante
		if (birthplace=="") {
			birthplace="--"
		}
		//se il luogo di morte non è specificato lo indico come mancante
		if (deathplace=="") {
			deathplace="--"
		}
		//se la data di morte non è riconosciuta dal database, verifico il campo still_alive
		//altrimenti verifico se esiste l'anno di morte, e in caso negativo la segno come mancante
		if (birthdate=="0000-00-00") {
			birthdate=birthyear;
		}
		else {
			birthdate=date_formatter(birthdate);
		}
		//se la data di morte non è riconosciuta dal database, verifico il campo still_alive
		//altrimenti verifico se esiste l'anno di morte, e in caso negativo la segno come mancante
		if (deathdate=="0000-00-00") {
			if (still_alive=="1") {
				deathdate="Still Alive";
			}
			else {
				if (deathyear==0) {
					deathdate="--";
				}
				else {
					deathdate=deathyear;
				}
			}
		}
		else {
			deathdate=date_formatter(deathdate);
		}

		res+='<div class="result_content person" key_id="'+key_id+'">'+
		'<div class="result_column1">'+
		'<img class="result_image load2" src="'+picture+'" />'+
		'</div>'+
		'<div class="result_column2">'+
		'<span class="result_title">'+name+' '+surname+'</span>'+
		'<span class="result_edit">'+
		"<img class='result_modify' key_id='"+key_id+"' request='person' src='imgs/edit.svg' title='Edit element'/>"+
		"<img class='result_delete' key_id='"+key_id+"' request='person' src='imgs/bin.svg' title='Delete element'/>"+
		'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Info</span>'+
		'<span><b>Birth Date:</b> '+birthdate+'</span><br/>'+
		'<span><b>Birth Place:</b> '+birthplace+'</span><br/>'+
		'-<br/>'+
		'<span><b>Death Date:</b> '+deathdate+'</span><br/>'+
		'<span><b>Death Place:</b> '+deathplace+'</span><br/>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Bio</span>'+
		'<span class="result_bio">'+bio+'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Links</span>'+
		'<ul class="result_links"><li><a href="'+linkwiki+'">Wikipedia</a></li><li><a href="'+linkviaf+'">Viaf</a></li></ul>'+
		'</div>'+
		'</div>';

		$('#result_association').append(res);

		/*var places=[];
		if (birthplace!="--") {
			places.push(birthplace.split(',')[0]);
		}
		if (deathplace!="--"&&deathplace!=birthplace) {
			places.push(deathplace.split(',')[0]);
		}
		associations_places(key_id,places);

		associations_cho(key_id,name+' '+surname);*/
	}

	else if (request=="place") {
		res="";
		var key_id=value.key_id;
		var id=value.location_id;
		var oname=value.original_name;
		var ename=value.english_name;
		var picture=value.picture;
		var country=value.country;
		var region=value.region;
		var population=value.population;
		var lat=value.latitude;
		var long=value.longitude;
		var mapid="map"+key_id; //id per la creazione delle mappe
		var bio=value.description;
		var linkwiki=value.linkwikipedia;

		if (population=="0") {
			population="--";
		}
		else {
			population=number_formatter(population);
		}

		if (region=="") {
			region="--";
		}

		if (country=="") {
			country="--";
		}

		res+='<div class="result_content person" key_id="'+key_id+'">'+
		'<div class="result_column1">'+
		'<img class="result_image load2" src="'+picture+'" />'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub2">Map</span>'+
		'<span class="map" id="'+mapid+'"></span>'+
		'</div>'+
		'<div class="result_column2">'+
		'<span class="result_title">'+oname+' ('+ename+')</span>'+
		'<span class="result_edit">'+
		"<img class='result_modify' key_id='"+key_id+"' request='place' src='imgs/edit.svg' title='Edit element'/>"+
		"<img class='result_delete' key_id='"+key_id+"' request='place' src='imgs/bin.svg' title='Delete element'/>"+
		'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Info</span>'+
		'<span><b>Country:</b> '+country+'</span><br/>'+
		'<span><b>Region:</b> '+region+'</span><br/>'+
		'<span><b>Population:</b> '+population+'</span><br/>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Bio</span>'+
		'<span class="result_bio">'+bio+'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Links</span>'+
		'<ul class="result_links"><li><a href="'+linkwiki+'">Wikipedia</a></li></ul>'+
		'</div>'+
		'</div>';

		$('#result_association').append(res);

		if (lat!=0&&long!=0) {
			//creo la mappa per il risultato corrente
			createMap(mapid, lat, long);
		}
		else { //se lat e long non sono definiti, la mappa non viene mostrata
			$("#"+mapid).html("No Latitude and Longitude given.");
			$("#"+mapid).height("auto");
		}
	}

	else if (request=="cho") {
		var key_id=value.key_id;
		var otitle=value.original_title;
		var etitle=value.english_title;
		var author=value.author;
		var author_id=value.author_id;
		var place=value.place;
		var cdate=value.creation_date;
		var idate=value.issue_date;
		var type=value.type;
		var lang=value.language;
		var bio=value.bio;
		var linkwiki=value.linkwiki;
		var picture=value.picture;

		if (etitle=="") {
			etitle=otitle;
		}

		if (lang!="") {
			type=type+" ("+lang+")";
		}

		if (idate=="") {
			idate="--";
		}

		res+='<div class="result_content person" key_id="'+key_id+'">'+
		'<div class="result_column1">'+
		'<img class="result_image load2" src="'+picture+'" />'+
		'</div>'+
		'<div class="result_column2">'+
		'<span class="result_title">'+otitle+'<br/>('+etitle+')</span>'+
		'<span class="result_edit">'+
		"<img class='result_modify' key_id='"+key_id+"' request='cho' src='imgs/edit.svg' title='Edit element'/>"+
		"<img class='result_delete' key_id='"+key_id+"' request='cho' src='imgs/bin.svg' title='Delete element'/>"+
		'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Info</span>'+
		'<span><b>Author:</b> '+author+'</span><br/>'+
		'<span><b>Date of creation:</b> '+cdate+'</span><br/>'+
		'<span><b>Date of issue:</b> '+idate+'</span><br/>'+
		'<span><b>Type:</b> '+type+'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Bio</span>'+
		'<span class="result_bio">'+bio+'</span>'+
		'<span class="result_divider"></span>'+
		'<span class="result_sub">Links</span>'+
		'<ul class="result_links"><li><a href="'+linkwiki+'">Wikipedia</a></li></ul>'+
		'</div>'+
		'</div>';

		$('#result_association').append(res);
		//associations_persons(key_id,author);

	}

	var attr = $('body').attr('email');
	// For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.
	if (typeof attr !== typeof undefined && attr !== false) {
		console.log("Create Collections");
	  // Element has this attribute
		$.ajax({
			type: "GET",
			url: "api/collections.php",
			data: {key_id: key_id, request:"elem_in_coll"}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				var string='<span class="result_divider"></span>'+
				'<span class="result_sub">Collections</span>'+
				'<ul class="result_collection">';
				if (result!=null) {
					$.each(result, function(index,value) {
						string+='<li>'+value.coll_name+'</li>';
					})
				}
				string+='<li class="result_collection_add" key_id="'+key_id+'">Add to a collection</li></ul>';

				$('.result_content[key_id="'+key_id+'"] .result_column2').append(string);

				$('.result_collection_add').off();
				$('.result_collection_add').click(function(){
					$('.result_collection_add').off();
					$('.result_collection_add').html("");
					var key_id=$(this).attr("key_id");
					var elem=$('.result_content[key_id="'+key_id+'"]');
					var string="";
					$.ajax({
						type: "GET",
						url: "api/collections.php",
						data: {key_id: key_id, request:"elem_notin_coll"}, //effettuo una chiamata ajax
						contentType: "application/x-www-form-urlencoded; charset=UTF-8",
						success: function (result) {
							console.log(result)
							string+='Add to: <select id="coll_select">'+
							'<option selected disabled hidden>Select the Collection</option>';
							$.each(result, function(index,value){
								string+='<option value="'+value.coll_id+'">'+value.coll_name+'</option>';
							})
							string+='</select><img id="result_collection_add_confirm" src="imgs/check.svg" /><img id="result_collection_add_cancel" src="imgs/cancel.svg" />';
							elem.find($('.result_collection_add')).html(string);

							$('#result_collection_add_confirm').click(function(){
								var coll=$('#coll_select').val();
								if (coll!=null) {
									add_element(coll, key_id);
									setTimeout(function(){searchRecord(type, key_id);},200);
								}
								else {

								}
							});

							$('#result_collection_add_cancel').click(function(){
								searchRecord(type, key_id);
							});
						}
					});
				})
			}
		});
	}

	function create_action(){
		$('.result_modify').off();
		$('.result_delete').off();

		//aggiungo l'evento all'icona di modifica con i dati dell'oggetto da modificare
		$('.result_modify').click(function(){
			console.log("modify")
			var request=$(this).attr("request");
			var key_id=$(this).attr("key_id");
			console.log(request+key_id)
			modify_menu(request,key_id);
		})

		$('.result_delete').click(function(){
			var request=$(this).attr("request");
			var key_id=$(this).attr("key_id");
			var index=$(this).attr("index");
			var elem=$('.result_content[key_id='+key_id+']');
			var orig_content=elem.html();
			var height=elem.height();
			var string='<br/><span class="result_delete_message">Do you want to remove this record?</span>'+
			'<img id="result_delete_confirm" src="imgs/check.svg" />'+
			'<img id="result_delete_cancel" src="imgs/cancel.svg" />';
			elem.find($('.result_title')).append(string);
			elem.find($('.result_edit')).remove();

			$('#result_delete_confirm').click(function(){
				console.log(request)
				modify_data(request, key_id, "delete");
				elem.html('<span class="result_deleted_message">Record deleted correctly.</span>');
			})

			$('#result_delete_cancel').click(function(){
				elem.html(orig_content);
				create_action();
			})
		})
	}
	create_action();
};

//funzione per la creazione delle mappe con la API di Google
function createMap(elem, lat, long) {
	var styleArray= [ //memorizzo gli stili in un array
	{
			featureType:"all", //featureType stabilisce l'elemento del quale si vuol modificare lo stile, all agisce su tutto
			stylers: [{}] //stylers è un altro array nel quale si stabiliscono le modifiche effettive
		},
		{
			featureType:"road.arterial",
			elementType:"geometry",
			stylers:[{saturation:100}]
		},
		{
			featureType:"poi.business",
			elementType:"labels",
			stylers:[{visibility:"off"}]
		}
		];


  	//memorizzo una mappa nella variabile map indicando l'elemento DOM nel quale inserirla (getElement...)
  	var map = new google.maps.Map(document.getElementById(elem), {
	    center: new google.maps.LatLng(lat,long), //setto il centro della mappa
	    scrollwheel: false, //impedisco lo zoom con lo scroll del mouse
	    draggable: false,
	    styles: styleArray, //applico gli stili memorizzati nell'array styleArray
	    zoom: 11, //stabilisco lo zoom iniziale
	    mapTypeId: google.maps.MapTypeId.ROADMAP //scelgo il tipo di mappa (ROADMAP,SATELLITE, HYBRID, TERRAIN)
	});

  	var marker = new google.maps.Marker({
  		position: new google.maps.LatLng(lat,long),
  		map: map
  	});
};

function associations_persons (key_id,author) {
	var str_pers='<span class="result_divider"></span>'+
	'<span class="result_sub2">Associated Persons</span>';
	$.ajax({
		type: "GET",
		url: "api/ajax.php",
		data: {keywords: author, type: "person", request: "searchDB"}, //effettuo una chiamata ajax
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			var res=""; //variabile che contiene i risultati

			if (result==null) { //se result è nullo significa che non ci sono risultati
				//svuoto la finestra dei risultati in caso ce ne fossero di precedenti
				str_pers+='<span class="result_nores">No results for "'+author+'", <span class="result_nores_add" key="'+author+'">add to the Database</span>.</span>';
			}
			else {
				$.each(result, function(index,value) {
					str_pers+='<span class="result_min" key_id="'+value.key_id+'"><img class="load" src="'+value.picture+'" /><span>'+value.name_surname+'</span></span>';
				})
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});

	setTimeout(function(){
		var elem=$('.result_content[key_id='+key_id+']');
		elem.find($('.result_column1')).append(str_pers);
		$('.result_min').off();
		$('.result_min').click(function(){
			var key_id=$(this).attr("key_id");
			associations_populate(key_id);
		});
		$('.result_nores_add').click(function(){
			var keywords=$(this).attr("key");
			adding_menu(1);
			setTimeout(function(){$('#input_name').val(keywords)},200);
			$.fn.fullpage.moveTo(2);
		})
	},300);
}

function associations_places (key_id,places) {
	var str_places='<span class="result_divider"></span>'+
	'<span class="result_sub2">Associated Places</span>';
	if (places.length==0) {
		str_places+='<span class="result_nores">No associated places.</span>';
	}
	else {
		$.each(places, function(i,key){
			$.ajax({
				type: "GET",
				url: "api/ajax.php",
				data: {keywords: key, type: "place", request: "searchDB"}, //effettuo una chiamata ajax
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				success: function (result) {
					var res=""; //variabile che contiene i risultati

					if (result==null) { //se result è nullo significa che non ci sono risultati
						//svuoto la finestra dei risultati in caso ce ne fossero di precedenti
						str_places+='<span class="result_nores">No results for "'+key+'", <span class="result_nores_add" key="'+key+'">add to the Database</span>.</span>';

					}
					else {
						$.each(result, function(index,value) {
							str_places+='<span class="result_min" key_id="'+value.key_id+'"><img class="load" src="'+value.picture+'" /><span>'+value.original_name+'</span></span>';
						})
					}

				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
		});
	}

	setTimeout(function(){
		var elem=$('.result_content[key_id='+key_id+']');
		elem.find($('.result_column1')).append(str_places);
		$('.result_min').off();
		$('.result_min').click(function(){
			var key_id=$(this).attr("key_id");
			associations_populate(key_id);
		});
		$('.result_nores_add').click(function(){
			var keywords=$(this).attr("key");
			console.log(keywords)
			adding_menu(2);
			setTimeout(function(){$('#input_oname').val(keywords)},200);
			$.fn.fullpage.moveTo(2);
		});
	},300);
}

function associations_cho (key_id,name) {
	console.log(name);
	var str_cho='<span class="result_divider"></span>'+
	'<span class="result_sub2">Associated Cho</span>';
	$.ajax({
		type: "GET",
		url: "api/ajax.php",
		data: {name: name, request: "get_cho"}, //effettuo una chiamata ajax
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			if (result==null) { //se result è nullo significa che non ci sono risultati
				//svuoto la finestra dei risultati in caso ce ne fossero di precedenti
				str_cho+='<span class="result_nores">No associated cho.</span>';

			}
			else {
				$.each(result, function(index,value) {
					str_cho+='<span class="result_min" key_id="'+value.key_id+'"><img class="load" src="'+value.picture+'" /><span>'+value.original_title+'</span></span>';
				})
			}

		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});

	setTimeout(function(){
		var elem=$('.result_content[key_id='+key_id+']');
		elem.find($('.result_column1')).append(str_cho);
		$('.result_min').off();
		$('.result_min').click(function(){
			var key_id=$(this).attr("key_id");
			associations_populate(key_id);
		});
	},300);
}

function associations_populate (key_id) {
	var substring=key_id.substring(0,3);
	if (substring=="per") {
		type="person";
	}
	else if (substring=="pla") {
		type="place";
	}
	else if (substring=="cho") {
		type="cho";
	}

	$.ajax({
		type: "GET",
		url: "api/ajax.php",
			data: {key_id: key_id, request: "searchRecord"}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				console.log(result);
				$.each(result, function(index,value) {
					create_assoc_element(type,value);
				})
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
	});

	setTimeout(function(){
		var container = $('.internal_slider');
		var scrollTo = $('#result_association');
		container.animate({
		    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
		});
		var col1=$('.result_content[key_id='+key_id+'] .result_column1');
		var col2=$('.result_content[key_id='+key_id+'] .result_column2');
		$(".load2").one("load", function() { //quando le immagini hanno caricato
			console.log(col1.height());
			console.log(col2.height());
			if (col1.height()>col2.height()) {
				col2.height(col1.height());
			}
			setTimeout(function(){ //controlla dopo 500ms per prevenire i bug
				if (col1.height()>col2.height()) {
					col2.height(col1.height());
				}
			},500);
		}).each(function() {
			if(this.complete) $(this).load();
		});
	},50)
}

function set_datalist() {
	var type=$('input[name="search_radio"]:checked').val();
	$.ajax({
		type: "GET",
		url: "api/ajax.php",
		data: {type: type, request: "searchType"}, //effettuo una chiamata ajax
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			var options="";
			if (type=="person") {
				$.each(result, function(index,value) {
					options+='<option value="'+value.name_surname+'" key_id="'+value.key_id+'">'+value.born_in+'</option>';
				})
			}
			else if (type=="place") {
				$.each(result, function(index,value) {
					options+='<option value="'+value.original_name+'" key_id="'+value.key_id+'">'+value.region+', '+value.country+'</option>';
				})
			}
			else if (type=="cho") {
				$.each(result, function(index,value) {
					options+='<option value="'+value.original_title+'" key_id="'+value.key_id+'">'+value.type+'</option>';
				})
			}
			else {
				$('#type_list').html("");
			}

			$('#type_list').html(options);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});
}

function searchDB(type, keywords) {
	if (keywords != '') { //verifico che esista la parola chiave
		$.ajax({
			type: "GET",
			url: "api/ajax.php",
			data: {keywords: keywords, type: type, request: "searchDB"}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				var content=""; //variabile che contiene i risultati

				if (result==null) { //se result è nullo significa che non ci sono risultati
					//svuoto la finestra dei risultati in caso ce ne fossero di precedenti
					$('#result .internal_slider').html("");
					$('#result .internal_slider').append("<h1 class='result_main_title'>Sorry, no results for '"+keywords+"'.</h1>");
					$.fn.fullpage.moveTo(1, 1);
				}
				else {
					//svuoto la finestra dei risultati in caso ce ne fossero di precedenti
					$('#result .internal_slider').html("");
					//inserisco il titolo e la lunghezza dei risultati
					$('#result .internal_slider').append("<h1 class='result_main_title'> Results for '"+keywords+"':</h1>");

					$.each(result, function(index,value) {
						create_element(type,value);
					})

					$.fn.fullpage.moveTo(1, 1);
				}
				$('#search_text').val("");
				$('input[name="search_radio"]:checked').prop('checked', false);
				$('#type_list').html("");


			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
	}
};

function displayDB() {
	$.ajax({
		type: "GET",
		url: "api/ajax.php",
		data: {request: "displayDB"}, //effettuo una chiamata ajax
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			console.log(result)
			var res=""; //variabile che contiene i risultati

			var persons=result[0];
			var places=result[1];
			var cho=result[2];
			var DBlength=0;
			if (persons!=null) {
				DBlength+=persons.length;
			}
			if (places!=null) {
				DBlength+=places.length;
			}
			if (cho!=null) {
				DBlength+=cho.length;
			}

			if (persons==null && places==null && cho==null) {
				$('#result .internal_slider').html("");
				$('#result .internal_slider').append("<h1 id='result_title'>Sorry, the Database is empty.</h1>");
			}
			else {
				$('#result .internal_slider').html("");
				$('#result .internal_slider').append("<h1 id='result_title'>"+DBlength+" records in the Database:"+
					"<br/><span id='DB_export'>Export <img src='imgs/file.svg' /><span></h1>");
				$('#DB_export').click(function(){export_DB()});
			}

			if (persons!=null) {
				$('#result .internal_slider').append("<h2 class='result_subtitle' type='person'>"+persons.length+" Persons<img class='DB_arrow' type='person' src='imgs/arrow.svg' /></h2>");
				var person_res="<table class='DB_records_container' type='person'>";
				person_res+='<thead><tr><td>Name</td><td>Birth Date</td><td>Birth Place</td><td>Death Date</td><td>Death Place</td><td class="centered">View</td></tr></thead>';
				$.each(persons, function(index,value) {
					var key_id=value.key_id;
					var name=value.name;
					var surname=value.surname;
					var picture=value.picture;
					var birthdate=value.was_born;
					var birthyear=value.was_born_year;
					var birth;
					var birthplace=value.born_in;
					var deathdate=value.died;
					var deathyear=value.died_year;
					var death;
					var deathplace=value.died_in;
					var still_alive=value.still_alive;

					//se il luogo di nascita non è specificato lo indico come mancante
					if (birthplace=="") {
						birthplace="--"
					}
					//se il luogo di morte non è specificato lo indico come mancante
					if (deathplace=="") {
						deathplace="--"
					}

					if (birthdate=="0000-00-00") {
						birth=birthyear;
					}
					else {
						birth=date_formatter(birthdate);
					};

					if (deathdate=="0000-00-00") {
						if (still_alive=="1") {
							death="Still Alive";
						}
						else {
							if (deathyear==0) {
								death="--";
							}
							else {
								death=deathyear;
							}

						}
					}
					else {
						death=date_formatter(deathdate);
					}

					person_res+='<tr class="DB_record"><td><b>'+name+' '+surname+'</b></td>'+
					'<td>'+birth+'</td><td>'+birthplace+'</td><td>'+death+'</td><td>'+deathplace+'</td>'+
					'<td class="centered"><img type="person" key_id="'+key_id+'" class="view_record" src="imgs/len.svg" /></td>'+
					'</tr>';
				});
				person_res+='</table>';

				$('#result .internal_slider').append(person_res);
			}

			if (places!=null) {
				$('#result .internal_slider').append("<h2 type='places' class='result_subtitle'>"+places.length+" Places<img class='DB_arrow' type='places' src='imgs/arrow.svg' /></h2>");
				var places_res="<table class='DB_records_container' type='places'>";
				places_res+='<thead><tr><td>Name</td><td>Region</td><td>Country</td><td>Population</td><td>Lat,Long</td><td class="centered">View</td></tr></thead>';
				$.each(places, function(index,value) {
					var key_id=value.key_id;
					var oname=value.original_name;
					var ename=value.english_name;
					var picture=value.picture;
					var country=value.country;
					var region=value.region;
					var population=value.population;
					var lat=value.latitude;
					var long=value.longitude;
					var latlong;
					var mapid="map"+index; //id per la creazione delle mappe
					var bio=value.description;
					var linkwiki=value.linkwikipedia;

					if (population=="0") {
						population="--";
					}
					else {
						population=number_formatter(population);
					}

					if (region=="") {
						region="--";
					}

					if (country=="") {
						country="--";
					}

					if (lat==0 || long==0) {
						latlong="--";
					}
					else {
						latlong=lat+", "+long;
					}

					places_res+='<tr class="DB_record"><td><b>'+oname+', '+ename+'</b></td>'+
					'<td>'+region+'</td><td>'+country+'</td><td>'+population+'</td><td>'+latlong+'</td>'+
					'<td class="centered"><img type="place" key_id="'+key_id+'" class="view_record" src="imgs/len.svg" /></td>'+
					'</tr>';
				});
				places_res+="</table>";
				$('#result .internal_slider').append(places_res);
			}

			if (cho!=null) {
				$('#result .internal_slider').append("<h2 type='cho' class='result_subtitle'>"+cho.length+" Cultural Heritage Object<img class='DB_arrow' type='cho' src='imgs/arrow.svg' /></h2>");
				var cho_res="<table class='DB_records_container' type='cho'>";
				cho_res+='<thead><tr><td>Title</td><td>Author</td><td>Place</td><td>Date</td><td>Type</td><td class="centered">View</td></tr></thead>';
				$.each(cho, function(index,value) {
					var key_id=value.key_id;
					var otitle=value.original_title;
					var etitle=value.english_title;
					var author=value.author;
					var author_id=value.author_id;
					var place=value.place;
					var cdate=value.creation_date;
					var idate=value.issue_date;
					var type=value.type;
					var lang=value.language;
					var bio=value.bio;
					var linkwiki=value.linkwiki;
					var picture=value.picture;

					if (etitle=="") {
						etitle=otitle;
					}

					if (lang!="") {
						type=type+" ("+lang+")";
					}

					if (idate!="") {
						var date=cdate+" (creation), "+idate+" (issue)";
					}
					else {
						var date=cdate+" (creation)";
					}



					cho_res+='<tr class="DB_record"><td><b>'+otitle+' ('+etitle+')</b></td>'+
					'<td>'+author+'</td><td>'+place+'</td><td>'+date+'</td><td>'+type+'</td>'+
					'<td class="centered"><img type="cho" key_id="'+key_id+'" class="view_record" src="imgs/len.svg" /></td>'+
					'</tr>';
				});
				cho_res+="</table>";
				$('#result .internal_slider').append(cho_res);
			}

			$('.DB_records_container').hide();
			$('.result_subtitle').click(function(){
				var type=$(this).attr('type');
				$('.DB_records_container[type="'+type+'"]').toggle();
				$('.DB_arrow[type="'+type+'"]').toggleClass("rotate");
				$(this).toggleClass('result_subtitle_fw');
			})
			$.fn.fullpage.moveTo(1, 1);
			$('.view_record').click(function(){
				var type=$(this).attr("type");
				var key_id=$(this).attr("key_id");
				searchRecord(type, key_id);
			})
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});
};

function export_DB() {
	$.ajax({
		type: "GET",
		url: "api/ajax.php",
		data: {request: "displayDB"}, //effettuo una chiamata ajax
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			console.log(result)

			zip = new JSZip();
			var readme='----- Files downloaded from MetadataEditor -----\r\n\r\n'+
			'• In the "dump" folder you can find the DataBase structure, we recommend to import that first, if you haven\'t already.\r\n'+
			'• Each csv file is related to a single table (persons, places, cho). You can import each datalist into each table.\r\n'+
			'• The first line of each csv file contains the table fileds, make sure to check it out in your import options.';
			zip.file("README.txt", readme);
			files = zip.folder("csv");
			dump = zip.folder("dump");

	        var names=["persons","places","cho"];
	        for (i=0; i<result.length; i++) {
	        	if (result[i]!=null) {
	        		JSONToCSVConvertor(result[i], 'metadata_editor', names[i], true);
	        	}
	        }
	        var dump_file;
	        jQuery.get('dump/metadata_editor.sql', function(data) {
			   dump_file=data;
			   console.log(dump_file);
			   dump.file('metadata_editor.csv', dump_file);
			});

			setTimeout(function(){
				zip.generateAsync({type:"blob"})
				.then(function(content) {
				    // see FileSaver.js
				    saveAs(content, 'metadata_editor.zip');
				});
			},200);


		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});
}

function searchRecord(type, key_id) {
	if (type==undefined) {
		var substring=key_id.substring(0,3);
		if (substring=="per") {
			type="person";
		}
		else if (substring=="pla") {
			type="place";
		}
		else if (substring=="cho") {
			type="cho";
		}
		console.log(type);
	}
	$.ajax({
		type: "GET",
		url: "api/ajax.php",
			data: {key_id: key_id, request: "searchRecord"}, //effettuo una chiamata ajax
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				var res=""; //variabile che contiene i risultati
				//svuoto la finestra dei risultati in caso ce ne fossero di precedenti
				$('#result .internal_slider').html("");
				//inserisco il titolo e la lunghezza dei risultati
				$('#result .internal_slider').append("<h1 class='result_main_title'>Selected Record:</h1>");

				$.each(result, function(index,value) {
					create_element(type,value);
				})
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
	});
};

//funzione per la creazione dinamica dei menu di input
function adding_menu(id) {
	$.fn.fullpage.moveTo(2);
	if (add_console==1) {
		adding_menu_console();
	}

	//imposto il controllo di validità della data a true
	dateCheck=true;

	//determino il tipo di menu da costruire
	var request;
	if(id==1) {
		request="add_person";
	}
	else if (id==2) {
		request="add_place";
	}
	else if (id==3) {
		request="add_cho";
	}

	//effettuo una chiamata ajax e recupero le stringhe per costruire i menu
	$.ajax({
		type: "GET",
		url: "api/adding_menu.php",
		data: {request: request},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			console.log("Adding menu for '"+request+"'");
			console.log("------------------------------");
				//inserisco il menu nella finestra
				$('#section2 .content').html(result);
				//creo una finestra di popup nascosta per gli avvisi
				$('#section2 .content').append('<div id="popup_container"><div id="popup"></div></div>');
				$('#popup_container').hide();
				//assegno al pulsante check_wiki la funzione check_wiki per la ricerca su DBPEDIA
				$("#check_wiki").click(function(){check_wiki($(this).attr("case"))});
				$('#check_viaf').click(function(){check_viaf()});
				$('#check_geonames').click(function(){check_geonames()});
				//assegno al pulsante input_send la funzione add_data per l'inserimento dei dati nel DB
				$('#input_send').click(function(){add_data(request)});

				if (request=="add_person") { //opzioni per il menu "person"
					//disabilito i dettagli sulla morte in caso sia attiva l'opzione still_alive
					$('#input_stillalive').click(function(){
					if ($(this).prop("checked")) {
						$('#input_deathdate').val("");
						$('#input_deathplace').val("");
						$("#input_deathdate").prop('disabled', true);
						$("#input_deathplace").prop('disabled', true);
					}
					else {
						$("#input_deathdate").prop('disabled', false);
						$("#input_deathplace").prop('disabled', false);
					}
				});

					//controllo la validità della data di nascita durante l'inserimento
					$("#input_birthdate").on("change paste keyup", function() {
						if(isDate($('#input_birthdate').val())==true) {
							dateCheck=true;
							$('#input_birthdate').css("border-color","green");
						}
						else {
							dateCheck=false;
							$('#input_birthdate').css("border-color","red");
						}
					});
					//controllo la validità della data di morte durante l'inserimento
					$("#input_deathdate").on("change paste keyup", function() {
						if(isDate($('#input_deathdate').val())==true) {
							dateCheck=true;
							$('#input_deathdate').css("border-color","green");
						}
						else {
							dateCheck=false;
							$('#input_deathdate').css("border-color","red");
						}
					});
				}
				else if (request=="add_place") { //opzioni per il menu place

				}
				else if (request=="add_cho") {
					$.ajax({
						type: "GET",
						url: "api/ajax.php",
						data: {type: "person", request: "searchType"}, //effettuo una chiamata ajax
						contentType: "application/x-www-form-urlencoded; charset=UTF-8",
						success: function (result) {
							var options="";
							$.each(result, function(index,value) {
								options+='<option value="'+value.name_surname+'" key_id="'+value.key_id+'">';
							})
							$('#person_names').html(options);
						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log(textStatus, errorThrown);
						}
					});
					$.ajax({
						type: "GET",
						url: "api/ajax.php",
						data: {type: "place", request: "searchType"}, //effettuo una chiamata ajax
						contentType: "application/x-www-form-urlencoded; charset=UTF-8",
						success: function (result) {
							var options="";
							$.each(result, function(index,value) {
								options+='<option value="'+value.original_name+'" key_id="'+value.key_id+'">';
							})
							$('#place_names').html(options);
						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log(textStatus, errorThrown);
						}
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
};

function popup(type, content) {
	var color={"positive":"#249A41", "negative":"#F03530", "no-res":"#FFBB00", "loading":"#196EEF"};
	var border=color[type];
	$('#popup').html(content);
	$('#popup').css("border", "2px solid "+border);
	$('#data_input').css("opacity",0.3);
	$('#popup_container').show();

	if ($('#popup_close')!=undefined) {
		$("#popup_close").one( "click", function() {
			$('#popup_container').hide();
			$('#data_input').css("opacity",1);
		});
	}
};

function resetInput() {
	$('#data_input input').val("");
	$('#data_input input').css("border-color","grey");
	$('#data_input textarea').val("");
	if ($('#input_stillalive')!=undefined) {
		$('#input_stillalive').prop('checked', false);
		$("#input_deathdate").prop('disabled', false);
		$("#input_deathplace").prop('disabled', false);
	}
};

//funzione per la ricerca su dbpedia
function check_wiki(request) {
	console.log("Searching data for "+request+":");
	if(request=="person") {
		var name=$('#input_name').val();
		var surname=$('#input_surname').val();
		console.log("Key: "+name+" "+surname);
		console.log("------------------------------");
		if(name==""&&surname=="") {
			$('#input_name').css("border-color","red");
			$('#input_surname').css("border-color","red");
		}
		else {
			var content="<img src='imgs/loading.svg' id='loading' />";
			popup("loading", content);

			$('#input_name').css("border-color","grey");
			$('#input_surname').css("border-color","grey");

			$.ajax({
				type: "GET",
				url: "api/ajax.php",
				data: {nomepersona: name, cognomepersona: surname, request: "wiki_person"},
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				success: function (result) {
					$('#popup_container').hide();
					console.log(result);
					if (result[0]==undefined) {
						if (result.check=="CONNERROR") {
							var content="<span>Sorry, there was an ERROR during the connection!</span>";
							content+="<div class='popup_button' id='popup_close'>Close</div>";
							popup("negative", content);
						}
						else {
							var content="<span>Sorry, no results found!</span>";
							content+="<div class='popup_button' id='popup_close'>Close</div>";
							popup("no-res", content);
						}
					}
					else {
						$('#data_input').css("opacity",1);
						$("#input_birthdate").val(result[0].birthedit.value);
						$("#input_birthplace").val(result[0].birthplaceedit.value);
						$("#input_deathdate").val(result[0].deathedit.value);
						$("#input_deathplace").val(result[0].deathplaceedit.value);
						$("#input_bio").val(result[0].bio.value);
						$("#input_picture").val(result[0].thumbedit.value);
						$("#input_wiki").val(result[0].wiki.value);
					}
				}
			});

			setTimeout(function(){
				if(isDate($('#input_birthdate').val())==true && $('#input_birthdate').val()!="") {
					dateCheck=true;
					$('#input_birthdate').css("border-color","green");
				}
				else {
					dateCheck=false;
					$('#input_birthdate').css("border-color","red");
				}

				if(isDate($('#input_deathdate').val())==true) {
					dateCheck=true;
					if ($('#input_birthdate').val()!="") {
						$('#input_deathdate').css("border-color","green");
					}
				}
				else {
					dateCheck=false;
					$('#input_deathdate').css("border-color","red");
				}
			},500);

		}

	}

	else if (request=="place") {
		var name=$('#input_oname').val();
		console.log("Key: "+name);
		console.log("------------------------------");
		if(name=="") {
			$('#input_oname').css("border-color","red");
		}
		else {
			var string="<img src='imgs/loading.svg' id='loading' />";
			$('#popup').html(string);
			$('#popup').css("border", "2px solid #196EEF");
			$('#popup_container').show();
			$('#data_input').css("opacity",0.3);

			$('#input_oname').css("border-color","grey");
			$.ajax({
				type: "GET",
				url: "api/ajax.php",
				data: {luogo: name, request: "wiki_place"},
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				success: function (result) {
					$('#popup_container').hide();
					console.log(result);
					if (result[0]==undefined) {
						if (result.check=="CONNERROR") {
							var content="<span>Sorry, there was an ERROR during the connection!</span>";
							content+="<div class='popup_button' id='popup_close'>Close</div>";
							popup("negative", content);
						}
						else {
							var content="<span>Sorry, no results found!</span>";
							content+="<div class='popup_button' id='popup_close'>Close</div>";
							popup("no-res", content);
						}
					}
					else {
						$('#data_input').css("opacity",1);
						$("#input_ename").val(result[0].name.value);
						$("#input_country").val(result[0].country.value);
						$("#input_region").val(result[0].region.value);
						$("#input_population").val(result[0].population.value);
						$("#input_latitude").val(result[0].lat.value);
						$("#input_longitude").val(result[0].long.value);
						$("#input_bio").val(result[0].est.value);
						$("#input_picture").val(result[0].thumbnail.value);
						$("#input_wiki").val(result[0].wiki.value);
					}
				}
			});

		}
	}

	else if (request=="event") {

	}
};

function check_viaf() {
	var name=$('#input_name').val();
	var surname=$('#input_surname').val();
	if(name==""&&surname=="") {
		$('#input_name').css("border-color","red");
		$('#input_surname').css("border-color","red");
	}
	else {
		var content="<img src='imgs/loading.svg' id='loading' />";
		popup("loading", content);
		$('#input_name').css("border-color","grey");
		$('#input_surname').css("border-color","grey");
		$.ajax({
			type: "GET",
			url: "api/ajax.php",
			data: {name: name, surname: surname, request: "viaf_person"},
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				$('#popup_container').hide();
				console.log(result);
				if (result==null) {
					var content="<span>Sorry, no results found!</span>";
					content+="<div class='popup_button' id='popup_close'>Close</div>";
					popup("no-res", content);
				}
				else {
					var index=0;
					var length=result.length;
					function askagain(index){
						var test=result[index].term;
						var content="<span>Is this what you're looking for?</span><br/>"+
						'<span><i>'+test+"</i></span><br/><div class='popup_button' id='popup_yes'>Yes</div><div class='popup_button' id='popup_no'>No</div>";
						popup("no-res", content);
						$("#popup_no").one( "click", function() {
							if (index!=length-1) {
								askagain(index+1);
							}
							else {
								$('#popup_container').hide();
								$('#data_input').css("opacity",1);
							}
						});
						$("#popup_yes").one( "click", function() {
							var viaf=result[index].viafid;
							var viaflink='http://viaf.org/viaf/'+viaf;
							$('#input_viaf').val(viaflink);
							$('#popup_container').hide();
							$('#data_input').css("opacity",1);

						});
					}
					askagain(index);
				}
			}
		});
	}
};

function check_geonames(){
	var name=$('#input_oname').val();
	console.log("Key: "+name);
	console.log("------------------------------");
	if(name=="") {
		$('#input_oname').css("border-color","red");
	}
	else {
		var string="<img src='imgs/loading.svg' id='loading' />";
		$('#popup').html(string);
		$('#popup').css("border", "2px solid #196EEF");
		$('#popup_container').show();
		$('#data_input').css("opacity",0.3);

		$('#input_oname').css("border-color","grey");
		$.ajax({
			type: "GET",
			url: "api/ajax.php",
			data: {luogo: name, request: "geonames"},
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				$('#popup_container').hide();
				console.log(result);
				if (result[0]==undefined) {
					if (result.check=="CONNERROR") {
						var content="<span>Sorry, there was an ERROR during the connection!</span>";
						content+="<div class='popup_button' id='popup_close'>Close</div>";
						popup("negative", content);
					}
					else {
						var content="<span>Sorry, no results found!</span>";
						content+="<div class='popup_button' id='popup_close'>Close</div>";
						popup("no-res", content);
					}
				}
				else {
					$('#data_input').css("opacity",1);
					$("#input_ename").val(result[0].name);
					$("#input_country").val(result[0].countryName);
					$("#input_region").val(result[0].adminName1);
					$("#input_population").val(result[0].population);
					$("#input_latitude").val(result[0].lat);
					$("#input_longitude").val(result[0].lng);
				}
			}
		});

	}
}

function check_google(){
	var name=$('#input_oname').val();
	if(name=="") {
		$('#input_oname').css("border-color","red");
	}
	else {
		var string="<img src='imgs/loading.svg' id='loading' />";
		$('#popup').html(string);
		$('#popup').css("border", "2px solid #196EEF");
		$('#popup_container').show();
		$('#data_input').css("opacity",0.3);

		$('#input_oname').css("border-color","grey");
		$.ajax({
			type: "GET",
			url: "api/ajax.php",
			data: {luogo: name, request: "google_place"},
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				$('#popup_container').hide();
				console.log(result);
				if (result==undefined) {
					if (result.check=="CONNERROR") {
						var content="<span>Sorry, there was an ERROR during the connection!</span>";
						content+="<div class='popup_button' id='popup_close'>Close</div>";
						popup("negative", content);
					}
					else {
						var content="<span>Sorry, no results found!</span>";
						content+="<div class='popup_button' id='popup_close'>Close</div>";
						popup("no-res", content);
					}
				}
				else {
					var ename;
					var region;
					var country;
					var addresses=result.address_components;
					$.each(addresses, function(index,value) {
						if (addresses[index].types[0]=="locality") {
							ename=addresses[index].long_name;
						}
						else if (addresses[index].types[0]=="administrative_area_level_1") {
							region=addresses[index].long_name;
						}
						else if (addresses[index].types[0]=="country") {
							country=addresses[index].long_name;
						}
					})
					var lat=result.geometry.location.lat;
					var long=result.geometry.location.lng;

					$('#data_input').css("opacity",1);

					if ($("#input_ename").val()=="") {
						$("#input_ename").val(ename);
					}
					if ($("#input_country").val()=="") {
						$("#input_country").val(country);
					}
					if ($("#input_region").val()=="") {
						$("#input_region").val(region);
					}
					if ($("#input_latitude").val()=="") {
						$("#input_latitude").val(lat);
					}
					if ($("#input_longitude").val()=="") {
						$("#input_longitude").val(long);
					}

				}
			}
		});
	}
};

var dateCheck=true;
function add_data(request) {
	console.log(request);
	var data={};
	var check=true;
	var type;
	var keywords;

	if (request=="add_person") {
		type="person";
		keywords=$('#input_name').val()+" "+$('#input_surname').val();
		data["request"]="add_person";
		data["name"]=$('#input_name').val();
		data["surname"]=$('#input_surname').val();
		data["was_born"]=$('#input_birthdate').val();
		data["born_in"]=$('#input_birthplace').val();
		data["died"]=$('#input_deathdate').val();
		data["died_in"]=$('#input_deathplace').val();
		data["linkwikiperson"]=$('#input_wiki').val();
		data["linkviafperson"]=$('#input_viaf').val();
		data["bio"]=$('#input_bio').val();
		data["picture"]=$('#input_picture').val();
		if ($('#input_stillalive').prop("checked")) {
			data["still_alive"]=1;
		}
		else {
			data["still_alive"]=0;
		}

		if (data["name"]=="" || data["surname"]=="" || data["was_born"]=="") {
			check=false;
		}
	}


	else if (request=="add_place") {
		type="place";
		keywords=$('#input_oname').val();
		data["request"]="add_place";
		data["oname"]=$('#input_oname').val();
		data["ename"]=$('#input_ename').val();
		data["country"]=$('#input_country').val();
		data["region"]=$('#input_region').val();
		data["population"]=$('#input_population').val();
		data["lat"]=$('#input_latitude').val();
		data["long"]=$('#input_longitude').val();
		data["wiki"]=$('#input_wiki').val();
		data["bio"]=$('#input_bio').val();
		data["picture"]=$('#input_picture').val();

		if (data["oname"]=="") {
			check=false;
		}
	}

	else if (request=="add_cho") {
		type="cho";
		keywords=$('#input_otitle').val();
		data["request"]="add_cho";
		data["otitle"]=$('#input_otitle').val();
		data["etitle"]=$('#input_etitle').val();
		data["author"]=$('#input_author').val();
		data["place"]=$('#input_place').val();
		data["cdate"]=$('#input_cdate').val();
		data["idate"]=$('#input_idate').val();
		data["type"]=$('#input_type').val();
		data["lang"]=$('#input_lang').val();
		data["wiki"]=$('#input_wiki').val();
		data["bio"]=$('#input_bio').val();
		data["picture"]=$('#input_picture').val();

		var author_id=$('option[value="'+data["author"]+'"').attr('key_id');
		data["author_id"]=author_id;

		if (data["otitle"]=="" || data["author"]=="" || data["cdate"]=="" || data["type"]==null) {
			check=false;
		}
	}

	if (check==true && dateCheck==true) {
		$.ajax({
			type: "GET",
			url: "api/adding_data.php",
			data: data,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				console.log(result);
				if (result=="OK") {
					resetInput();
					var content="<span>Insert Succesful!</span><div class='popup_button' id='popup_view'>View Record</div><div class='popup_button' id='popup_close'>Close</div>";
					popup("positive", content);
					$("#popup_view").one( "click", function() {
						searchDB(type, keywords);
						$('#popup_container').hide();
						$('#data_input').css("opacity",1);
					});
				}
				else if (result=="duplicate") {
					var content="<span>This record is already in the Database!</span><div class='popup_button' id='popup_view'>View Record</div><div class='popup_button' id='popup_close'>Close</div>";
					popup("negative", content);
					$("#popup_view").one( "click", function() {
						searchDB(type, keywords);
						$('#popup_container').hide();
						$('#data_input').css("opacity",1);
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
	}
	else if(check==false){
		var content="<span>Your input is incomplete!</span>";
		if (dateCheck==false) {
			content+="<span>Invalid date format!</span>"
		}
		content+="<div class='popup_button' id='popup_close'>Close</div>";
		popup("negative", content);
	}
	else if (check==true && dateCheck==false) {
		var content="<span>Invalid date format!<br/>Required: yyyy-mm-dd or yyyy.</span>";
		content+="<div class='popup_button' id='popup_close'>Close</div>";
		popup("negative", content);
	}
};

function modify_menu(request, key_id) {
	console.log("••••••••••••••••••••••••••••••••••••••••••");
	console.log("Modify menu for "+request+", item: "+key_id);
	console.log("------------------------------------------");


	//imposto il controllo di validità della data a true
	dateCheck=true;

	//effettuo una chiamata ajax e recupero le stringhe per costruire i menu
	$.ajax({
		type: "GET",
		url: "api/modify_menu.php",
		data: {request: request},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
				//inserisco il menu nella finestra
				$('#section2 .content').html(result);
				//creo una finestra di popup nascosta per gli avvisi
				$('#section2 .content').append('<div id="popup_container"><div id="popup"></div></div>');
				$('#popup_container').hide();
				//assegno al pulsante check_wiki la funzione check_wiki per la ricerca su DBPEDIA
				$("#check_wiki").click(function(){check_wiki($(this).attr("case"))});
				$('#check_viaf').click(function(){check_viaf()});
				$('#check_geonames').click(function(){check_geonames()});
				$('#input_update').click(function(){modify_data(request, key_id, "update")});
				$('#input_cancel').click(function(){modify_data(request, key_id, "cancel")});

				if (request=="person") { //opzioni per il menu "person"
					//disabilito i dettagli sulla morte in caso sia attiva l'opzione still_alive
					$('#input_stillalive').click(function(){
						if ($(this).prop("checked")) {
							$('#input_deathdate').val("");
							$('#input_deathplace').val("");
							$("#input_deathdate").prop('disabled', true);
							$("#input_deathplace").prop('disabled', true);
						}
						else {
							$("#input_deathdate").prop('disabled', false);
							$("#input_deathplace").prop('disabled', false);
						}
					});

					//controllo la validità della data di nascita durante l'inserimento
					$("#input_birthdate").on("change paste keyup", function() {
						if(isDate($('#input_birthdate').val())==true) {
							dateCheck=true;
							$('#input_birthdate').css("border-color","green");
						}
						else {
							dateCheck=false;
							$('#input_birthdate').css("border-color","red");
						}
					});
					//controllo la validità della data di morte durante l'inserimento
					$("#input_deathdate").on("change paste keyup", function() {
						if(isDate($('#input_deathdate').val())==true) {
							dateCheck=true;
							$('#input_deathdate').css("border-color","green");
						}
						else {
							dateCheck=false;
							$('#input_deathdate').css("border-color","red");
						}
					});

					$.ajax({
						type: "GET",
						url: "api/ajax.php",
						data: {key_id: key_id, type: request, request: "modify"}, //effettuo una chiamata ajax
						contentType: "application/x-www-form-urlencoded; charset=UTF-8",
						success: function (result) {
							console.log("Adding data for item "+key_id+":");
							console.log(result);
							console.log("------------------------------------------");
							$('#input_name').val(result[0].name);
							$('#input_surname').val(result[0].surname);
							if(result[0].was_born_year!=0) {
								$('#input_birthdate').val(result[0].was_born_year);
							}
							if (result[0].was_born!="0000-00-00") {
								$('#input_birthdate').val(result[0].was_born);
							}
							$('#input_birthplace').val(result[0].born_in);
							if (result[0].died_year!=0) {
								$('#input_deathdate').val(result[0].died_year);
							}
							if (result[0].died!="0000-00-00") {
								$('#input_deathdate').val(result[0].died);
							}
							$('#input_deathplace').val(result[0].died_in);
							if (result[0].still_alive==1) {
								$('#input_stillalive').prop("checked", true);
								$('#input_deathdate').val("");
								$('#input_deathplace').val("");
								$("#input_deathdate").prop('disabled', true);
								$("#input_deathplace").prop('disabled', true);
							}
							$('#input_bio').val(result[0].bio);
							$('#input_wiki').val(result[0].linkwikiperson);
							$('#input_viaf').val(result[0].linkviafperson);
							$('#input_picture').val(result[0].picture);

						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log(textStatus, errorThrown);
						}
					});
				}

				else if (request=="place") { //opzioni per il menu place
					$.ajax({
						type: "GET",
						url: "api/ajax.php",
						data: {key_id: key_id, type: request, request: "modify"}, //effettuo una chiamata ajax
						contentType: "application/x-www-form-urlencoded; charset=UTF-8",
						success: function (result) {
							console.log("Adding data for item "+key_id+":");
							console.log(result);
							console.log("------------------------------------------");
							$('#input_oname').val(result[0].original_name);
							$('#input_ename').val(result[0].english_name);
							$('#input_country').val(result[0].country);
							$('#input_region').val(result[0].region);
							$('#input_population').val(result[0].population);
							$('#input_latitude').val(result[0].latitude);
							$('#input_longitude').val(result[0].longitude);
							$('#input_bio').val(result[0].description);
							$('#input_wiki').val(result[0].linkwikipedia);
							$('#input_picture').val(result[0].picture);
						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log(textStatus, errorThrown);
						}
					});
				}

				else if (request=="cho") {
					$.ajax({
						type: "GET",
						url: "api/ajax.php",
						data: {type: "person", request: "searchType"}, //effettuo una chiamata ajax
						contentType: "application/x-www-form-urlencoded; charset=UTF-8",
						success: function (result) {
							var options="";
							$.each(result, function(index,value) {
								options+='<option value="'+value.name_surname+'" key_id="'+value.key_id+'">';
							})
							$('#person_names').html(options);
						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log(textStatus, errorThrown);
						}
					});
					$.ajax({
						type: "GET",
						url: "api/ajax.php",
						data: {type: "place", request: "searchType"}, //effettuo una chiamata ajax
						contentType: "application/x-www-form-urlencoded; charset=UTF-8",
						success: function (result) {
							var options="";
							$.each(result, function(index,value) {
								options+='<option value="'+value.original_name+'" key_id="'+value.key_id+'">';
							})
							$('#place_names').html(options);
						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log(textStatus, errorThrown);
						}
					});

					$.ajax({
						type: "GET",
						url: "api/ajax.php",
						data: {key_id: key_id, type: request, request: "modify"}, //effettuo una chiamata ajax
						contentType: "application/x-www-form-urlencoded; charset=UTF-8",
						success: function (result) {
							console.log("Adding data for item "+key_id+":");
							console.log(result);
							console.log("------------------------------------------");
							$('#input_otitle').val(result[0].original_title);
							$('#input_etitle').val(result[0].english_title);
							$('#input_author').val(result[0].author);
							$('#input_place').val(result[0].place);
							$('#input_cdate').val(result[0].creation_date);
							$('#input_idate').val(result[0].issue_date);
							$('#input_type option[value="'+result[0].type+'"]').prop('selected',true);
							$('#input_lang').val(result[0].language);
							$('#input_bio').val(result[0].bio);
							$('#input_wiki').val(result[0].linkwiki);
							$('#input_picture').val(result[0].picture);

						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log(textStatus, errorThrown);
						}
					});
				}

				$.fn.fullpage.moveTo(2);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
};

function modify_data(request, key_id, action) {
	console.log(action+" data for item "+request+" id: "+key_id);
	console.log("------------------------------------------");

	if (action=="update") {
		var data={};
		var check=true;
		var keywords;

		if (request=="person") {
			keywords=$('#input_name').val()+" "+$('#input_surname').val();
			data["request"]="modify_person";
			data["key_id"]=key_id;
			data["name"]=$('#input_name').val();
			data["surname"]=$('#input_surname').val();
			data["was_born"]=$('#input_birthdate').val();
			data["born_in"]=$('#input_birthplace').val();
			data["died"]=$('#input_deathdate').val();
			data["died_in"]=$('#input_deathplace').val();
			data["linkwikiperson"]=$('#input_wiki').val();
			data["linkviafperson"]=$('#input_viaf').val();
			data["bio"]=$('#input_bio').val();
			data["picture"]=$('#input_picture').val();
			if ($('#input_stillalive').prop("checked")) {
				data["still_alive"]=1;
			}
			else {
				data["still_alive"]=0;
			}

			if (data["name"]=="" || data["surname"]=="" || data["was_born"]=="") {
				check=false;
			}
		}


		else if (request=="place") {
			keywords=$('#input_oname').val();
			data["request"]="modify_place";
			data["key_id"]=key_id;
			data["oname"]=$('#input_oname').val();
			data["ename"]=$('#input_ename').val();
			data["country"]=$('#input_country').val();
			data["region"]=$('#input_region').val();
			data["population"]=$('#input_population').val();
			data["lat"]=$('#input_latitude').val();
			data["long"]=$('#input_longitude').val();
			data["wiki"]=$('#input_wiki').val();
			data["bio"]=$('#input_bio').val();
			data["picture"]=$('#input_picture').val();

			if (data["oname"]=="") {
				check=false;
			}
		}

		else if (request=="cho") {
			type="cho";
			keywords=$('#input_otitle').val();
			data["request"]="modify_cho";
			data["key_id"]=key_id;
			data["otitle"]=$('#input_otitle').val();
			data["etitle"]=$('#input_etitle').val();
			data["author"]=$('#input_author').val();
			data["place"]=$('#input_place').val();
			data["cdate"]=$('#input_cdate').val();
			data["idate"]=$('#input_idate').val();
			data["type"]=$('#input_type').val();
			data["lang"]=$('#input_lang').val();
			data["wiki"]=$('#input_wiki').val();
			data["bio"]=$('#input_bio').val();
			data["picture"]=$('#input_picture').val();

			var author_id=$('option[value="'+data["author"]+'"').attr('key_id');
			data["author_id"]=author_id;

			if (data["otitle"]=="" || data["author"]=="" || data["cdate"]=="" || data["type"]==null) {
				check=false;
			}
		}

		if (check==true && dateCheck==true) {
			$.ajax({
				type: "GET",
				url: "api/modify_data.php",
				data: data,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				success: function (result) {
					console.log("Result: "+result);
					console.log("------------------------------------------");
					if (result=="OK") {

						var content="<span>Update Succesful!</span><div class='popup_button' id='popup_view'>View Record</div><div class='popup_button' id='popup_close'>Close</div>";
						popup("positive", content);
						$("#popup_view").one( "click", function() {
							searchDB(request, keywords);
							$('#popup_container').hide();
							$('#data_input input').val("");
							$('#data_input textarea').val("");
							$('#data_input').css("opacity",1);

						});
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
		}
		else if(check==false){
			var content="<span>Your input is incomplete!</span>";
			if (dateCheck==false) {
				content+="<span>Invalid date format!</span>"
			}
			content+="<div class='popup_button' id='popup_close'>Close</div>";
			popup("negative", content);
		}
		else if (check==true && dateCheck==false) {
			var content="<span>Invalid date format!<br/>Required: yyyy-mm-dd or yyyy.</span>";
			content+="<div class='popup_button' id='popup_close'>Close</div>";
			popup("negative", content);
		}
	}
	else if (action=="cancel") {
		$.fn.fullpage.moveTo(1, 1);
		resetInput();
	}
	else if (action=="delete") {
		$.ajax({
			type: "GET",
			url: "api/modify_data.php",
			data: {request: "delete", key_id: key_id, type: request},
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function (result) {
				console.log("Deleting result: "+result);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
	}
};
