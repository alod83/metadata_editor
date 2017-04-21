<?
include ("api/config.php");
$conn=openDB();

// Creo una variabile con il file CSV da importare
$CSVFile = $_FILES['file'];
$path=$CSVFile['tmp_name'];
$CSVcontent=file_get_contents($path);
echo ($CSVcontent);

// creo una variabile con la mia query
$sql = "LOAD DATA LOCAL INFILE '" . $CSVcontent . "' INTO TABLE persons "
     . "FIELDS TERMINATED BY ',' LINES TERMINATED BY '\\r\\n'";

// Eseguo la query per l'importazione
mysqli_query($conn, $sql);

// Chiudo la connessione al DB

?>
