<?php
//require('library/facebook-php-sdk-v5/autoload.php');
include ("api/config.php");
$conn=openDB();

$email=$_REQUEST["email"];
$password=$_REQUEST["password"];
$name=$_REQUEST["name"];
$surname=$_REQUEST["surname"];

$check=select($conn, "SELECT * FROM users WHERE email='$email'");
if ($check==null) {
	$sql= "INSERT INTO users (email, password, firstname, lastname) VALUES ('$email','$password','$name','$surname')";
	$res = mysqli_query($conn, $sql);
	if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	else echo ("OK");
}
else {
	echo ("DUPLICATE");
}



?>