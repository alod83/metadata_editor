<?php
include ("config.php"); //conn to the database
$conn=openDB();

$csvfile = $_FILES["file"]["tmp_name"]; //get file path and open it
$file = fopen($csvfile, "r");
$content=file_get_contents($csvfile); //get file content

$csv_rows=explode("\n",$content); //create an array dividing the content by the line delimiter \n
array_pop($csv_rows); //delete the last empty element of the array

$records_fields=[]; //array to store the fields for each row
foreach ($csv_rows as $index=>$row) {
   if ($index==0){
      $row_fields=explode(',', $row); //get the first line of the file, which contains the table fields
   }
   else{
      $row_fields=explode('","', $row); //get the array with all the fields
      $row_fields[0]=str_replace('"','',$row_fields[0]); //remove the double quotes of the csv file
      $row_fields[sizeof($row_fields)-1]=str_replace(',','',$row_fields[sizeof($row_fields)-1]); //remove " and , characters from the last field
      $row_fields[sizeof($row_fields)-1]=str_replace('"','',$row_fields[sizeof($row_fields)-1]);
   }
   array_push($records_fields, $row_fields); //store all in the main array
}

echo "<div id='import_csv_container'><table id='import_csv_table'>"; //return a table with the file data to verify if it's correct
foreach ($records_fields as $row) { //from the main array get every row
   echo "<tr>";
   foreach ($row as $field) { //from every row get every field
      if (strlen($field)>300){
         echo "<td><textarea class='long_text' readonly='readonly'>".$field."</textarea></td>";
      }
      else{
         echo "<td>".$field."</td>";
      }
   }
   echo "</tr>";
}
echo "</table></div>";

fclose($file); //close the file
closeDB($conn); //close the conn


?>
