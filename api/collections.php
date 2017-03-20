<?php
header('Content-Type: application/json');
error_reporting(E_ERROR | E_WARNING | E_PARSE);

include ("config.php");
$conn=openDB();

$request = $_REQUEST['request'];

switch($request) {

	case "all_collections":
		$email= $_REQUEST['email'];
		$result=select($conn, "SELECT collections.coll_name, collections.coll_id, users.email
			FROM collections
			JOIN users ON collections.coll_user=users.id
			WHERE users.email='$email'
			");
		echo json_encode($result);
	break;

	case "view_collection":
		$id=$_REQUEST['id'];
		$result1=select($conn, "SELECT *
			FROM coll_associations
			JOIN persons ON coll_associations.elem_id=persons.key_id
			JOIN collections ON coll_associations.coll_id=collections.coll_id
			WHERE coll_associations.coll_id='$id'");
		$result2=select($conn, "SELECT *
			FROM coll_associations
			JOIN places ON coll_associations.elem_id=places.key_id
			JOIN collections ON coll_associations.coll_id=collections.coll_id
			WHERE coll_associations.coll_id='$id'");
		$result3=select($conn, "SELECT *
			FROM coll_associations
			JOIN cho ON coll_associations.elem_id=cho.key_id
			JOIN collections ON coll_associations.coll_id=collections.coll_id
			WHERE coll_associations.coll_id='$id'");
		$result=array();
		array_push($result, $result1);
		array_push($result, $result2);
		array_push($result, $result3);
		echo json_encode($result);
	break;

	case "view_collection2":
	$id=$_REQUEST['id'];
	$result1=select($conn, "SELECT persons.*
		FROM coll_associations
		JOIN persons ON coll_associations.elem_id=persons.key_id
		JOIN collections ON coll_associations.coll_id=collections.coll_id
		WHERE coll_associations.coll_id='$id'");
	$result2=select($conn, "SELECT places.*
		FROM coll_associations
		JOIN places ON coll_associations.elem_id=places.key_id
		JOIN collections ON coll_associations.coll_id=collections.coll_id
		WHERE coll_associations.coll_id='$id'");
	$result3=select($conn, "SELECT cho.*
		FROM coll_associations
		JOIN cho ON coll_associations.elem_id=cho.key_id
		JOIN collections ON coll_associations.coll_id=collections.coll_id
		WHERE coll_associations.coll_id='$id'");
	$result=array();
	array_push($result, $result1);
	array_push($result, $result2);
	array_push($result, $result3);
	echo json_encode($result);
	break;

	case "elem_collections":
		$email= $_REQUEST['email'];

		$result=select($conn, "SELECT COUNT(*) AS elem_num, collections.name, collections.id, users.email
			FROM collections
			JOIN coll_associations ON coll_associations.coll_id=collections.id
			JOIN users ON collections.user=users.id
			WHERE users.email='$email'
			GROUP BY collections.id
			");

		/*$result=select($conn, "SELECT COUNT(*) AS elem_num, collections.name, collections.id, users.email, (CASE coll_associations.elem_type WHEN 'person' THEN persons.name_surname ELSE places.original_name END) AS elem_name, coll_associations.elem_id
			FROM coll_associations
			JOIN collections ON coll_associations.coll_id=collections.id
			JOIN users ON collections.user=users.id
			JOIN persons ON coll_associations.elem_id=persons.person_id
			JOIN places ON coll_associations.elem_id=places.location_id
			WHERE users.email='$email'
			GROUP BY collections.id
			");*/
		echo json_encode($result);
	break;

	case "add_collection":
		$email= $_REQUEST['email'];
		$name= $_REQUEST['name'];
		$name=mysqli_real_escape_string($conn, $name);
		$id=select($conn, "SELECT id FROM users WHERE email='$email'");
		$id=$id[0]["id"];

		$sql= "INSERT INTO collections (coll_name, coll_user) VALUES('$name','$id')";
		$res = mysqli_query($conn, $sql);
		if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
		else echo ("Collection Deleted Successfully!");
	break;

	case "delete_collection":
		$id=$_REQUEST['id'];
		$delete="DELETE FROM collections WHERE coll_id='$id'";
	  	$res = mysqli_query($conn, $delete);
	  	if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	  	else echo "OK";
	  	$delete="DELETE FROM coll_associations WHERE coll_id='$id'";
	  	$res = mysqli_query($conn, $delete);
	  	if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	  	else echo "OK";
	break;

	case "elem_in_DB":
		$coll_id=$_REQUEST['coll_id'];
		$result1=select($conn, "SELECT * FROM persons WHERE key_id NOT IN (SELECT elem_id FROM coll_associations WHERE coll_id='$coll_id') ORDER BY surname ASC");
		$result2=select($conn, "SELECT * FROM places WHERE key_id NOT IN (SELECT elem_id FROM coll_associations WHERE coll_id='$coll_id') ORDER BY original_name ASC");
		$result3=select($conn, "SELECT * FROM cho WHERE key_id NOT IN (SELECT elem_id FROM coll_associations WHERE coll_id='$coll_id') ORDER BY original_title ASC");
		$result=array();
		array_push($result, $result1);
		array_push($result, $result2);
		array_push($result, $result3);
		echo json_encode($result);
	break;

	case "elem_in_coll":
		$elem_id=$_REQUEST['key_id'];
		$result=select($conn, "SELECT * FROM coll_associations
			JOIN collections ON coll_associations.coll_id=collections.coll_id
			WHERE coll_associations.elem_id='$elem_id'
			ORDER BY collections.coll_name");
		echo json_encode($result);
	break;

	case "elem_notin_coll":
		$elem_id=$_REQUEST['key_id'];
		$result=select($conn, "SELECT * FROM collections WHERE coll_id NOT IN (SELECT coll_id FROM coll_associations WHERE elem_id='$elem_id')");
		echo json_encode($result);
	break;

	case "remove_element":
		$coll_id=$_REQUEST['coll_id'];
		$elem_id=$_REQUEST['elem_id'];
		$delete="DELETE FROM coll_associations WHERE coll_id='$coll_id' AND elem_id='$elem_id'";
	  	$res = mysqli_query($conn, $delete);
	  	if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	  	else echo json_encode("Record removed");
	break;

	case "add_element":
		$coll_id=$_REQUEST['coll_id'];
		$elem_id=$_REQUEST['elem_id'];
		$insert="INSERT INTO coll_associations (coll_id, elem_id) VALUES ('$coll_id', '$elem_id')";
	  	$res = mysqli_query($conn, $insert);
	  	if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	  	else echo json_encode("Record added");
	break;
}

?>
