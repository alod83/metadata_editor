<?php
header('Content-Type: application/json');
error_reporting(E_ERROR | E_WARNING | E_PARSE);
//connection
include ("config.php");
$conn=openDB();
$request = $_REQUEST['request'];

switch($request) {



	case "searchDB":
	$keywords = mysqli_real_escape_string($conn, $_REQUEST['keywords']);
	//echo ($keywords);
	$type = $_REQUEST['type'];
	if ($type=="person") {
		$result=select($conn, "SELECT * FROM person WHERE name_surname='$keywords'");
		echo json_encode($result);
	}
}
//close connection
closeDB($conn);
?>