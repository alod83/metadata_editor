<!DOCTYPE html>
<html>
<head>
	<title>Metadata Editor for Linked Data</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=yes">
	<!--Fogli di stile-->
	<link rel="stylesheet" type="text/css" href="style.css" />
	<link rel="stylesheet" type="text/css" href="libraries/fullpage/fp.css" />
	<!--File jQuery-->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
	<script type="text/javascript" src="script.js"></script>
	<script type="text/javascript" src="libraries/fullpage/fp.js"></script>
	<!--Icona-->
	<link rel="icon" href="img/me.png" type="img/x-icon">
	<!--Font-->
	<link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">

	<?php //connection with the database
		//ini_set('display_errors', 'On');
		//error_reporting(E_ALL);
		include ("api/config.php");
		$conn=openDB();
	?>
</head>

<body>
<?php //login session
			session_start();
			//take data from hybridauth login
			if(isset($_REQUEST["user"])) {
				$name=$_REQUEST["user"];
				$email=$_REQUEST["email"];
				$lastname=$_REQUEST["lastname"];
				$testquery= "SELECT * FROM users WHERE users.email = '$email'";
				$result=mysqli_query($conn, $testquery);
				$count=mysqli_num_rows($result);						
				//If there is no user with that email, save in database
				if($count==0){
					$query="INSERT INTO users(email, firstname, lastname) VALUES ('$email', '$name', '$lastname')";
					mysqli_query($conn, $query);				
					//Check user email again
					$testresult=mysqli_query($conn, $testquery);
					$test=mysqli_num_rows($testresult);						
					if ($test==1){
						$count=1;
					}
				}
				//if user exist, initialize session
				if($count==1){																
					$_SESSION['email'] = $email;
					$_SESSION['name'] = $name;
				}
			}
?>
<div class="fullpage">
	<section id="header">
		<table id="header_container">
		<tr><td id="header_title">Metadata Editor for Linked Data</td>
		<td id="header_login">
			<?php //show social buttons or user name
				if (!isset($_SESSION['name'])) {
					echo ('<td><h2 id="header_login_message">Welcome! Are you new?</h2></td>');
					echo ('<td><a class="login" href="login.php?provider=google"><img src="imgs/google_login.png"/></a></td>');
					echo ('<td><a class="login" href="login.php?provider=facebook"><img src="imgs/facebook_login.png"/></a></td>');
				}
				else {
					echo ('<td><h2 id="header_login_message">Welcome, '.($_SESSION['name']).'!</h2></td>');
					echo ("<td><a href='logout.php' class='pure-menu-link'>Logout</a></td>");
				}
			?>
		</td></tr>
		</table>
	</section> 
	<section class="section" id="section1">
	<div class="content slide">
		<div id="internal_content">
			<h1 id="main-title">Metadata Editor for Linked Data</h1>
			<h2>Search in our Database:</h2>
			<form id="search_database">
				<input type="radio" name="search_radio" value="person" id="search_radio_person"></input>
				<label for="search_radio_person">Person</label>
				<input type="radio" name="search_radio" value="place" id="search_radio_place"></input>
				<label for="search_radio_place">Place</label>
				<input type="radio" name="search_radio" value="event" id="search_radio_event"></input>
				<label for="search_radio_event">Event</label>
				<input type="text" name="search_text" id="search_text"></input>
			</form>
			<div id="search_button">Search</div>
			<div class="divider"></div>
			<p id="result"></p>
		</div>
	</div>
	<div class="content slide">
		<div class="internal_content">
			
		</div>
	</div>
	</section>
	<section class="section" id="section2"></section>
</div>
</body>
</html>