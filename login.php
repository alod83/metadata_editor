<?php
//require('library/facebook-php-sdk-v5/autoload.php');
include ("api/config.php");
$conn=openDB();

if( isset( $_REQUEST["provider"] ) ) {
$provider_name = $_REQUEST["provider"];
	try
	{
	$config   = dirname(__FILE__) . '/libraries/hybridauth/config.php';
	require_once( dirname(__FILE__) . '/libraries/hybridauth/Hybrid/Auth.php' );
	$hybridauth = new Hybrid_Auth( $config );
 // try to authenticate with the selected provider
	$adapter = $hybridauth->authenticate( $provider_name );
 // then grab the user profile
	$user_profile = $adapter->getUserProfile();
	//var_dump($user_profile);
	$name=$user_profile->firstName;
	$lastname=$user_profile->lastName;
	$email=$user_profile->email;
	}
	// something went wrong?
	catch( Exception $e )
	{
		echo $e->getMessage();
		echo $e->getCode();

	}
// set the user as connected and redirect him
	if(isset($name)&&isset($email)){
		$result=select($conn, "SELECT * FROM users WHERE email='$email'");
		echo $result;
		if ($result==null) {
			$sql= "INSERT INTO users (email, firstname, lastname) VALUES ('$email','$name','$lastname')";
	    	$res = mysqli_query($conn, $sql);
	    	if(!$res) die("Errore inserimento $sql".mysqli_errno($conn));
	    	else echo ("OK");
		}
		header("Location: index.php?user=$name&lastname=$lastname&email=$email");
	}
	else {
		echo ("error while connecting to '$provider_name'");
	}
}
?>
