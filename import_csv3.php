<?php
include ("api/config.php");
$conn=openDB();

$csvfile = $_FILES["file"]["tmp_name"];

$databasetable = "persons";
$databaseusername="root";
$databasepassword = NULL;
$fieldseparator = ",";
$lineseparator = "\n";
$delimiter = '"';
$escaper = "\\";

$sql = "LOAD DATA INFILE ".$csvfile."
INTO TABLE `persons`
FIELDS TERMINATED BY ','
ENCLOSED BY '\"'
ESCAPED BY '\\'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(key_id,person_id,name,surname,name_surname,was_born,was_born_year,died,died_year,still_alive,born_in,died_in,linkwikiperson,linkviafperson,bio,picture)
";
$res = mysqli_query($conn,$sql);

// Chiudo la connessione al DB
mysqli_close($conn);



?>
