<?php
include ("api/config.php");
$conn=openDB();

$databasehost = "localhost";
$databasename = "metadata_editor";
$databasetable = "persons";
$databaseusername="root";
$databasepassword = NULL;
$fieldseparator = ",";
$lineseparator = "\n";
$delimiter = '"';
$escaper = "\\";
$csvfile = $_FILES["file"]["tmp_name"];

if(!file_exists($csvfile)) {
    die("File not found. Make sure you specified the correct path.");
}

try {
    $pdo = new PDO("mysql:host=$databasehost;dbname=$databasename",
        $databaseusername, $databasepassword,
        array(
            PDO::MYSQL_ATTR_LOCAL_INFILE => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        )
    );
} catch (PDOException $e) {
    die("database connection failed: ".$e->getMessage());
}

$affectedRows = $pdo->exec("
    LOAD DATA LOCAL INFILE ".$pdo->quote($csvfile)." INTO TABLE `$databasetable`
    FIELDS TERMINATED BY ".$pdo->quote($fieldseparator)."
    ESCAPED BY ".$pdo->quote($escaper)."
    LINES TERMINATED BY ".$pdo->quote($lineseparator)."
    IGNORE 1 LINES
    (key_id,person_id,name,surname,name_surname,was_born,was_born_year,died,died_year,still_alive,born_in,died_in,linkwikiperson,linkviafperson,bio,picture)"
);

echo "Loaded a total of $affectedRows records from this csv file.\n";

?>
