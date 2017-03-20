<?php
include ("config.php");
error_reporting(E_ERROR | E_WARNING | E_PARSE);
$conn=openDB();
$request = $_REQUEST['request'];

switch($request) {

	case "modify_person":
		$key_id=$_REQUEST['key_id'];
		$name=$_REQUEST['name'];
		$surname=$_REQUEST['surname'];
		$name_surname=$name." ".$surname;
		$was_born=$_REQUEST['was_born'];
		$died=$_REQUEST['died'];
		$still_alive=$_REQUEST['still_alive'];
		$born_in=$_REQUEST['born_in'];
		$died_in=$_REQUEST['died_in'];
		$bio=$_REQUEST['bio'];
		$bio=mysqli_real_escape_string($conn, $bio);
		$linkwikiperson=$_REQUEST['linkwikiperson'];
		$linkviafperson=$_REQUEST['linkviafperson'];
		$picture=$_REQUEST['picture'];

		if ($picture=="") {
			$picture="imgs/avatar.svg";
			$picture=mysqli_real_escape_string($conn, $picture);
		}

		$sql= "UPDATE persons SET name='$name', surname='$surname', name_surname='$name_surname', was_born='$was_born', was_born_year='$was_born', died='$died', died_year='$died', still_alive='$still_alive', born_in='$born_in', died_in='$died_in', bio='$bio', linkwikiperson='$linkwikiperson', linkviafperson='$linkviafperson', picture='$picture' WHERE key_id='$key_id'";
	    $res = mysqli_query($conn, $sql);
	    if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	    else echo ("OK");
	break;

	case "modify_place":
		$key_id=$_REQUEST['key_id'];
		$oname=$_REQUEST['oname'];
		$ename=$_REQUEST['ename'];
		$country=$_REQUEST['country'];
		$region=$_REQUEST['region'];
		$population=$_REQUEST['population'];
		$lat=$_REQUEST['lat'];
		$long=$_REQUEST['long'];
		$wiki=$_REQUEST['wiki'];
		$bio=$_REQUEST['bio'];
		$bio=mysqli_real_escape_string($conn, $bio);
		$picture=$_REQUEST['picture'];

		if ($ename=="") {
			$ename=$oname;
		}

		if ($picture=="") {
			$picture="imgs/location.svg";
			$picture=mysqli_real_escape_string($conn, $picture);
		}

		$sql= "UPDATE places SET original_name='$oname', english_name='$ename', country='$country', region='$region', population='$population', latitude='$lat', longitude='$long', linkwikipedia='$wiki', description='$bio', picture='$picture' WHERE key_id='$key_id'";
	    $res = mysqli_query($conn, $sql);
	    if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	    else echo ("OK");
	break;

	case "modify_cho":
		$key_id=$_REQUEST['key_id'];
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
		$picture=$_REQUEST['picture'];

		if ($etitle=="") {
			$etitle=$otitle;
		}

		if ($picture=="") {
			$picture="imgs/museum.svg";
			$picture=mysqli_real_escape_string($conn, $picture);
		}

		$sql= "UPDATE cho SET original_title='$otitle', english_title='$etitle', author='$author', author_id='$author_id', place='$place', creation_date='$cdate', issue_date='$idate', type='$type', language='$lang', linkwiki='$wiki', bio='$bio', picture='$picture' WHERE key_id='$key_id'";
	    $res = mysqli_query($conn, $sql);
	    if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	    else echo ("OK");
	break;

	case "delete":
		$type=$_REQUEST['type'];
		$id=$_REQUEST['key_id'];
		if ($type=="person"){
			$sql="DELETE FROM persons WHERE key_id='$id'";
	  		$res = mysqli_query($conn, $sql);
	  		if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	  		else echo "OK";
		}
		elseif ($type=="place"){
			$sql="DELETE FROM places WHERE key_id='$id'";
	  		$res = mysqli_query($conn, $sql);
	  		if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	  		else echo "OK";
		}
		elseif ($type=="cho"){
			$sql="DELETE FROM cho WHERE key_id='$id'";
	  		$res = mysqli_query($conn, $sql);
	  		if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	  		else echo "OK";
		}
		$sql="DELETE FROM coll_associations WHERE elem_id='$id'";
	  	$res = mysqli_query($conn, $sql);
	  	if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	  	else echo "OK";
	break;
}
//close connection
closeDB($conn);
?>
