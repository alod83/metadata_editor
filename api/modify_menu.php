<?php

include ("config.php");
$conn=openDB();
$request = $_REQUEST['request'];

switch($request) {

	case "person":
	echo ('
			<form id="data_input">
			<h2 id="input_title">Update Person</h2>
			<div id="check_wiki" case="person">Check with DBPedia</div>
			<div id="check_viaf" case="person">Check Viaf ID</div>
			<div class="label"><span>Name*</span><span>Surname*</span></div>
			<div><input type="text" id="input_name"></input>
			<input type="text" id="input_surname"></input></div>
			<div class="label"><span>Birth Date* (yyyy-mm-dd)</span><span>Birth Place</span></div>
			<div><input type="text" id="input_birthdate"></input>
			<input type="text" id="input_birthplace"></input></div>
			<div class="label"><span>Death Date (yyyy-mm-dd)</span><span>Birth Place</span></div>
			<div><input type="text" id="input_deathdate"></input>
			<input type="text" id="input_deathplace"></input></div>
			<div><input type="checkbox" id="input_stillalive" /><span id="stillalive">Still Alive</span></div>
			<div class="label"><span class="fullspan">Bio</span></div>
			<div><textarea id="input_bio"></textarea></div>
			<div class="label"><span class="fullspan">Image Link</span></div>
			<div><input id="input_picture" class="input_fullwidth"></input></div>
			<div class="label"><span class="midspan">Wikipedia Link</span><span class="midspan">Viaf Link</span></div>
			<div><input id="input_wiki" class="input_midwidth"></input><input id="input_viaf" class="input_midwidth"></input></div>
			<div id="input_update">Update</div><div id="input_cancel">Cancel</div>
			</form>');
	break;

	case "place":
	echo ('<form id="data_input">
			<h2 id="input_title">Updating Place</h2>
			<div id="check_wiki" case="place">Check with DBPedia</div>
			<div id="check_geonames" case="place">Check with Geonames</div>
			<div class="label"><span>Original Name*</span><span>English Name</span></div>
			<div><input type="text" id="input_oname"></input>
			<input type="text" id="input_ename"></input></div>
			<div class="label"><span class="halfspan">Country</span><span class="halfspan">Region</span><span class="halfspan">Population</span></div>
			<div><input type="text" id="input_country" class="input_halfwidth"></input>
			<input type="text" id="input_region" class="input_halfwidth"></input>
			<input type="text" id="input_population" class="input_halfwidth"></input></div>
			<div class="label"><span>Latitude</span><span>Longitude</span></div>
			<div><input type="text" id="input_latitude"></input>
			<input type="text" id="input_longitude"></input></div>
			<div class="label"><span class="fullspan">Description</span></div>
			<div><textarea id="input_bio"></textarea></div>
			<div class="label"><span class="fullspan">Image Link</span></div>
			<div><input id="input_picture" class="input_fullwidth"></input></div>
			<div class="label"><span class="fullspan">Wikipedia Link</span></div>
			<div><input id="input_wiki" class="input_fullwidth"></input></div>
			<div id="input_update">Update</div><div id="input_cancel">Cancel</div>
			</form>');
	break;

	case "cho":
	echo ('<form id="data_input">
			<h2 id="input_title">New Cultural Heritage Object</h2>

			<div class="label"><span>Original Title*</span><span>English Title</span></div>
			<div><input type="text" id="input_otitle" edm="dc:title"></input>
			<input type="text" id="input_etitle" edm="dcterms:alternative"></input></div>

			<div class="label"><span>Author*</span><span>Place</span></div>
			<div><input type="text" id="input_author" list="person_names" edm="dc:creator"></input>
			<datalist id="person_names">
			</datalist>
			<input type="text" id="input_place" list="place_names" edm="dcterms:spatial"></input>
			<datalist id="place_names">
			</datalist>
			</div>

			<div class="label"><span>Creation Date*</span><span>Issue Date</span></div>
			<div><input type="text" id="input_cdate" edm="dcterms:created"></input>
			<input type="text" id="input_idate" edm="dcterms:issued"></input></div>

			<div class="label"><span>Type*</span><span>Language</span></div>
			<div><select id="input_type" edm="edm:type">
				<option selected disabled hidden>Select the type</option>
				<option value="Text">Text</option>
  				<option value="Video">Video</option>
  				<option value="Sound">Sound</option>
  				<option value="Image">Image</option>
  				<option value="3D">3D</option>
			</select>
			<input type="text" id="input_lang" edm="dc:language"></input></div>

			<div class="label"><span class="fullspan">Description</span></div>
			<div><textarea id="input_bio" edm="dc:description"></textarea></div>

			<div class="label"><span class="fullspan">Image Link</span></div>
			<div><input id="input_picture" class="input_fullwidth" edm="dcterms:isFormatOf"></input></div>

			<div class="label"><span class="fullspan">Wikipedia Link</span></div>
			<div><input id="input_wiki" class="input_fullwidth" edm="owl:sameAs"></input></div>

			<div id="input_update">Update</div><div id="input_cancel">Cancel</div>
			</form>');
	break;
}
//close connection
closeDB($conn);
?>
