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
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyBagy-sRo9-EEKzXxA9LiHRFwFpKxtxqZM"></script>
	<script type="text/javascript" src="script.js"></script>
	<script type="text/javascript" src="libraries/fullpage/fp.js"></script>
	<script type="text/javascript" src="libraries/zip/dist/jszip.js"></script>
	<script type="text/javascript" src="libraries/FileSaver.js"></script>
	<!--Icona-->
	<link rel="icon" href="img/me.png" type="img/x-icon">
	<!--Font-->
	<link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">

	<?php //connection with the database
		include ("api/config.php");
		$conn=openDB();
	?>
</head>

<?php //login session
	session_start();
	if(isset($_REQUEST["user"])) {
		$name=$_REQUEST["user"];
		$email=$_REQUEST["email"];
		$lastname=$_REQUEST["lastname"];
		$_SESSION['email'] = $email;
		$_SESSION['name'] = $name;
		echo ('<body email="'.$email.'">');
	}
	else {
		echo ('<body>');
	}
?>
<div class="fullpage">
	<section id="header">
		<table id="header_container">
		<tr><td id="header_title"><span>Metadata Editor for Linked Data</span></td>
		<?php //show social buttons or user name
				if (!isset($_SESSION['name'])) {
					echo ('<td id="header_login">Welcome! Can you tell us about you?</td>');
					echo ('<td id="header_login_console_opener">Login</td>');
					echo ('<div id="login_console">
						<span id="login_console_top"><img src="imgs/exit.svg" id="login_console_close"/></span>
						<span id="login_console_container">
						<input class="login_console_input" id="login_console_email" type="email" placeholder="Email"></input>
						<input class="login_console_input" id="login_console_password" type="password" placeholder="Password"></input>
						<button class="login_console_button" id="login_console_login">Login</button>
						<span id="login_console_message">Not registered? <span id="login_console_message_signin">Create an account</span>.</span>
						<span id="login_console_result"></span>
						</span>
						<span id="login_console_divider"></span>
						<span id="login_console_social">
						<img id="google" src="imgs/google_login.png"/>
						<img id="facebook" src="imgs/facebook_login.png"/>
						</span>

					</div>');
					echo ('</td></tr></table>');
				}
				else {
					echo ('<td id="header_login_logged">Welcome, '.($_SESSION['name']).'!'.
						'<td onclick="adding_menu_console()" id="header_addmenu">Add Record</td>'.
						'<td onclick="collection_manager()" id="header_collections">Collections</td>'.
						'<td id="header_logout"><a href="logout.php">Logout</a></td>'.
						'<div id="add_console">
						<span id="add_console_top"><img src="imgs/exit.svg" id="add_console_close"/></span>
						<span id="add_console_message">What kind of record you would like to add?</span>
						<div onclick="adding_menu(1)" class="add_console_button">New Person</div>
						<div onclick="adding_menu(2)" class="add_console_button">New Place</div>
						<div onclick="adding_menu(3)" class="add_console_button">New CHO</div>
						</div></table>');
					/*echo ("<table id='adding_menu'><tr>");
					echo ('<td><a id="add_person" href="#2" onclick="adding_menu(1)">New Person</a></td>');
					echo ('<td><a id="add_place" href="#2" onclick="adding_menu(2)">New Place</a></td>');
					echo ('<td><a id="add_CHO" href="#2" onclick="adding_menu(3)">New Cultural Heritage Object</a></td>');
					echo ('</tr></table>');*/
				}
		?>
	</section>
	<section class="section" id="section1">
		<div class="content slide">
			<div id="internal_content">
				<h2><img id="title_img" src="imgs/len.svg" />Search in the Database:</h2>
				<form id="search_database">
					<input type="radio" name="search_radio" value="person" id="search_radio_person"></input>
					<label for="search_radio_person">Person</label>
					<input type="radio" name="search_radio" value="place" id="search_radio_place"></input>
					<label for="search_radio_place">Place</label>
					<input type="radio" name="search_radio" value="cho" id="search_radio_CHO"></input>
					<label for="search_radio_CHO">CHO</label>
					<input type="text" name="search_text" id="search_text" list="type_list"></input>
					<datalist id="type_list"></datalist>
				</form>
				<div id="search_button">Search</div>
				<span id="search_or">or</span>
				<p id="search_general_button">View the entire Database</p>
				<p id="result"></p>
			</div>
		</div>
		<div class="content slide" id="result">
			<div class="internal_slider">
			</div>
		</div>
	</section>
	<section class="section" id="section2">
		<div class="content">
		<?php //show social buttons or user name
				if (!isset($_SESSION['name'])) {
					echo ('<div id="input_message">Hi! <span onclick="open_login_console()" id="input_message_add">Login</span> to unlock the editing menu.</div></div>');
				}
				else {
					echo ('<span id="input_message"><b>Hi, '.($_SESSION['name']).'!</b> Do you want to <span onclick="adding_menu_console()" id="input_message_add">add a record</span>?</span>');
				}
		?>
		</div>
	</section>
</div>
</body>
</html>
