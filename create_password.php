<?php
include ("api/config.php");
$conn=openDB();

$email=$_REQUEST["email"];
$password=$_REQUEST["password"];

$sql= "UPDATE users SET password='$password' WHERE email='$email'";
$res = mysqli_query($conn, $sql);
if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
else echo ("OK");


?>