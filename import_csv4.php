<?php
include ("api/config.php");
$conn=openDB();

$csvfile = $_FILES["file"]["tmp_name"];
$file = fopen($csvfile, "r");

$content=file_get_contents($csvfile);
$csv_rows=explode("\n",$content);
array_pop($csv_rows);
$index=0;
$records_fields=[];
foreach ($csv_rows as $row) {
   if ($index==0){
      $row_fields=explode(',', $row);
   }
   else{
      $row_fields=explode('","', $row);
      $row_fields[0]=str_replace('"','',$row_fields[0]);
      $row_fields[sizeof($row_fields)-1]=str_replace(',','',$row_fields[sizeof($row_fields)-1]);
      $row_fields[sizeof($row_fields)-1]=str_replace('"','',$row_fields[sizeof($row_fields)-1]);
   }
   $index=$index+1;
   array_push($records_fields, $row_fields);
}
echo "<table id='import_csv_table'>";
foreach ($records_fields as $row) {
   echo "<tr>";
   foreach ($row as $field) {
      if (strlen($field)>300){
         echo "<td><textarea class='long_text' readonly='readonly'>".$field."</textarea></td>";
      }
      else{
         echo "<td>".$field."</td>";
      }
   }
   echo "</tr>";
}
echo "</table>";


/*while (($getData = fgetcsv($file, 10000,",","\\")) !== FALSE){
   print_r($getData);

   /*$sql = "INSERT into employeeinfo (emp_id,firstname,lastname,email,reg_date)
   values ('".$getData[0]."','".$getData[1]."','".$getData[2]."','".$getData[3]."','".$getData[4]."')";
   $result = mysqli_query($con, $sql);
   if(!isset($result))
   {
      echo "<script type=\"text/javascript\">
      alert(\"Invalid File:Please Upload CSV File.\");
      window.location = \"index.php\"
      </script>";
   }
   else {
      echo "<script type=\"text/javascript\">
      alert(\"CSV File has been successfully Imported.\");
      window.location = \"index.php\"
      </script>";
   }*/


fclose($file);



?>
