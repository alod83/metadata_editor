<?php
include ("config.php");
header('Content-Type: text/plain');
$conn=openDB();
$request = $_REQUEST['request'];

switch($request) {

	case "add_person":
		$name=$_REQUEST['name'];
		$surname=$_REQUEST['surname'];
		$name_surname=$name." ".$surname;
		$was_born= empty($_REQUEST['was_born']) ? 'NULL' : $_REQUEST['was_born'];
		$was_born_year = intval($was_born);
		if(strpos($was_born, '-') !== FALSE)
			$was_born_year = intval(substr($was_born, 0, strpos($was_born,'-'))); 
		else
			$was_born = 'NULL';	
		$died= empty($_REQUEST['died']) ? 'NULL' : $_REQUEST['died'];
		$died_year = intval($died);
		if(strpos($died, '-') !== FALSE)
			$died_year = intval(substr($died, 0, strpos($died, '-')));
		else
			$died = 'NULL';
		$still_alive=$_REQUEST['still_alive'];
		$born_in=$_REQUEST['born_in'];
		$died_in=$_REQUEST['died_in'];
		$bio=$_REQUEST['bio'];
		$bio=mysqli_real_escape_string($conn, $bio);
		$bio=str_replace('\n',' ',$bio);
		$linkwikiperson=$_REQUEST['linkwikiperson'];
		$linkviafperson=$_REQUEST['linkviafperson'];
		$picture=$_REQUEST['picture'];


		if ($picture=="") {
			$picture="imgs/avatar.svg";
			$picture=mysqli_real_escape_string($conn, $picture);
		}

		$check_id=select($conn, "SELECT MAX(person_id) AS lastId FROM persons");
		$last_id=$check_id[0]['lastId'];
		$key_id='per_'.($last_id+1);

		$check=select($conn, "SELECT * FROM persons WHERE name_surname='$name_surname'");
		if ($check==NULL) {
			$sql= "INSERT INTO persons (key_id, name, surname, name_surname, was_born, was_born_year, died, died_year, still_alive, born_in, died_in, bio, linkwikiperson, linkviafperson, picture) VALUES('$key_id','$name','$surname','$name_surname',$was_born,$was_born_year,$died,$died_year,'$still_alive','$born_in','$died_in','$bio','$linkwikiperson', '$linkviafperson', '$picture')";
		    $res = mysqli_query($conn, $sql);
		    if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
		    else echo ("OK");
		}
		else {
			echo ("duplicate");
		}
	break;

	case "add_place":
		$oname=$_REQUEST['oname'];
		$ename=$_REQUEST['ename'];
		$country=$_REQUEST['country'];
		$region=$_REQUEST['region'];
		$population=$_REQUEST['population'];
		$lat=$_REQUEST['lat'];
		$long=$_REQUEST['long'];
		$wiki=$_REQUEST['wiki'];
		$geonames=$_REQUEST['geonames'];
		$bio=$_REQUEST['bio'];
		$bio=mysqli_real_escape_string($conn, $bio);
		$bio=str_replace('\n',' ',$bio);
		$picture=$_REQUEST['picture'];

		if ($ename=="") {
			$ename=$oname;
		}

		if ($picture=="") {
			$picture="imgs/location.svg";
			$picture=mysqli_real_escape_string($conn, $picture);
		}

		$check_id=select($conn, "SELECT MAX(location_id) AS lastId FROM places");
		$last_id=$check_id[0]['lastId'];
		$key_id='pla_'.($last_id+1);

		$check=select($conn, "SELECT * FROM places WHERE original_name='$oname' AND english_name='$ename'");
		if ($check==NULL) {
			$sql= "INSERT INTO places (key_id, original_name, english_name, country, region, population, latitude, longitude, linkwikipedia, linkgeonames, description, picture) VALUES('$key_id','$oname','$ename','$country','$region','$population','$lat','$long','$wiki','$geonames','$bio','$picture')";
		    $res = mysqli_query($conn, $sql);
		    if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
		    else echo ("OK");
		}
		else {
			echo "duplicate";
		}
	break;

	case "add_cho":
		$otitle=$_REQUEST['otitle'];
		$etitle=$_REQUEST['etitle'];
		$author=$_REQUEST['author'];
		$author_id=$_REQUEST['author_id'];
		$place=$_REQUEST['place'];
		$cdate=$_REQUEST['cdate'];
		$idate=$_REQUEST['idate'];
		$type=$_REQUEST['type'];
		$lang=$_REQUEST['lang'];
		$wiki=$_REQUEST['wiki'];
		$bio=$_REQUEST['bio'];
		$bio=mysqli_real_escape_string($conn, $bio);
		$bio=str_replace('\n',' ',$bio);
		$picture=$_REQUEST['picture'];

		if ($etitle=="") {
			$etitle=$otitle;
		}

		if ($picture=="") {
			$picture="imgs/museum.svg";
			$picture=mysqli_real_escape_string($conn, $picture);
		}

		$check_id=select($conn, "SELECT MAX(cho_id) AS lastId FROM cho");
		$last_id=$check_id[0]['lastId'];
		$key_id='cho_'.($last_id+1);

		$check=select($conn, "SELECT * FROM cho WHERE original_title='$otitle' AND english_title='$etitle'");
		if ($check==NULL) {
			$sql= "INSERT INTO cho (key_id, original_title, english_title, author, author_id, place, creation_date, issue_date, type, language, linkwiki, bio, picture) VALUES('$key_id','$otitle','$etitle','$author','$author_id','$place','$cdate','$idate','$type','$lang','$wiki','$bio','$picture')";
		    $res = mysqli_query($conn, $sql);
		    if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
		    else echo ("OK");
		}
		else {
			echo "duplicate";
		}
	break;
}
//close connection
closeDB($conn);
?>
