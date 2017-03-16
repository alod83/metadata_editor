<?php
header('Content-Type: application/json');
error_reporting(E_ERROR | E_WARNING | E_PARSE);
//connection
include ("config.php");
$conn=openDB();

$result1=select($conn, "SELECT table_name, column_name
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_schema = 'metadata_editor'
    ORDER BY table_name, ordinal_position");
var_dump($result1);

?>