<?php
//require('library/facebook-php-sdk-v5/autoload.php');

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
		echo ($e);
		
	}
// set the user as connected and redirect him
	if(isset($name)&&isset($email)){	
		header("Location: http://localhost/LPW/MetadataEditor/index.php?user=$name&lastname=$lastname&email=$email");
	}
	else {
		echo ("error while connecting to '$provider_name'");
	}
}
?>