<?php

//require('library/facebook-php-sdk-v5/autoload.php');
include ("api/config.php");
$conn=openDB();

$email=$_REQUEST["email"];
$password=$_REQUEST["password"];

$check=select($conn, "SELECT * FROM users WHERE email='$email'");
if ($check!=null) {
	$pass=$check[0][password];
	if ($pass!="") {
		$check_pass=select($conn, "SELECT * FROM users WHERE email='$email' && password='$password'");
		if ($check_pass!=null) {
			echo json_encode($check_pass);
		}
		else {
			echo ("PASS");
		}
	}
	else {
		echo ("SOCIAL");
	}
}
else {
	echo ("EMAIL");
}



?>