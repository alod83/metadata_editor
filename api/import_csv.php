<?php
include ("config.php"); //open the conn
$conn=openDB();

$csvfile = $_FILES["file"]["tmp_name"]; //get file path and open it
$file = fopen($csvfile, "r");
$content=file_get_contents($csvfile); //get the file content
$request=$_POST["request"]; //get the request

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

$result=""; //final string
$success=0; //number of success
$duplicate=0; //number of duplicates
$errors=0; //number of errors

if ($request=="person"){ //insert for persons
   if (strpos($csv_rows[0], 'person_id') !== false) { //verify that the type of data is correct
      foreach ($records_fields as $index => $row) { //get fields for every row exept the first
         if($index!=0){
            $name=$row[2];
            $surname=$row[3];
            $name_surname=$row[4];
            $was_born=$row[5];
            $died=$row[7];
            $still_alive=$row[9];
            $born_in=$row[10];
            $died_in=$row[11];
            $linkwikiperson=$row[12];
            $linkviafperson=$row[13];
            $bio=$row[14];
            $bio=mysqli_real_escape_string($conn, $bio);
            $picture=$row[15];

            if ($picture=="") {
               $picture="imgs/avatar.svg";
               $picture=mysqli_real_escape_string($conn, $picture);
            }

            $check_id=select($conn, "SELECT MAX(person_id) AS lastId FROM persons");
            $last_id=$check_id[0]['lastId'];
            $key_id='per_'.($last_id+1);

            $check=select($conn, "SELECT * FROM persons WHERE name_surname='$name_surname'");
            if ($check==NULL) {
               $sql= "INSERT INTO persons (key_id, name, surname, name_surname, was_born, was_born_year, died, died_year, still_alive, born_in, died_in, bio, linkwikiperson, linkviafperson, picture)
               VALUES('$key_id','$name','$surname','$name_surname','$was_born','$was_born','$died','$died','$still_alive','$born_in','$died_in','$bio','$linkwikiperson', '$linkviafperson', '$picture')";
               $res = mysqli_query($conn, $sql);
               if(!$res) { //in case an error occurred
                  $result=$result.'<tr class="error"><td>Insert error for <i>'.$name_surname.'</i>: '.mysqli_errno($conn).'</td></tr>';
                  $errors=$errors+1;
               }
               else { //in case of success
                  $result=$result.'<tr class="success"><td><i>'.$name_surname.'</i> inserted correctly</td></tr>';
                  $success=$success+1;
               }
            }
            else { //in case the data is already in the database
               $result=$result.'<tr class="duplicate"><td><i>'.$name_surname.'</i> is already in the database, so it was not inserted</td></tr>';
               $duplicate=$duplicate+1;
            }
         }
      }
   }
   else { //in case the type of data does not match
      $errors=$errors+1;
      $result='<tr class="error"><td>And error occurred: the type does not match with your data.</td></tr>';
   }
}
elseif ($request=="place"){ //insert for places
   if (strpos($csv_rows[0], 'location_id') !== false) {
      foreach ($records_fields as $index => $row) {
         if($index!=0){
            $oname=$row[2];
            $ename=$row[3];
            $country=$row[4];
            $region=$row[5];
            $population=$row[6];
            $lat=$row[7];
            $long=$row[8];
            $wiki=$row[9];
            $geonames=$row[10];
            $bio=$row[11];
            $bio=mysqli_real_escape_string($conn, $bio);
            $picture=$row[12];

            if ($ename=="") {
               $ename=$oname;
            }

            if ($picture=="") {
               $picture="imgs/location.svg";
               $picture=mysqli_real_escape_string($conn, $picture);
            }

            $check_id=select($conn, "SELECT MAX(location_id) AS lastId FROM places");
            $last_id=$check_id[0]['lastId'];
            $key_id='pla_'.($last_id+1);

            $check=select($conn, "SELECT * FROM places WHERE original_name='$oname' AND english_name='$ename'");
            if ($check==NULL) {
               $sql= "INSERT INTO places (key_id, original_name, english_name, country, region, population, latitude, longitude, linkwikipedia, linkgeonames, description, picture) VALUES('$key_id','$oname','$ename','$country','$region','$population','$lat','$long','$wiki','$geonames','$bio','$picture')";          $res = mysqli_query($conn, $sql);
               $res = mysqli_query($conn, $sql);
               if(!$res) {
                  $result=$result.'<tr class="error"><td>Insert error for <i>'.$oname.'</i>: '.mysqli_errno($conn).'</td></tr>';
                  $errors=$errors+1;
               }
               else {
                  $result=$result.'<tr class="success"><td><i>'.$oname.'</i> inserted correctly</td></tr>';
                  $success=$success+1;
               }
            }
            else {
               $result=$result.'<tr class="duplicate"><td><i>'.$oname.'</i> is already in the database, so it was not inserted</td></tr>';
               $duplicate=$duplicate+1;
            }
         }
      }
   }
   else {
      $errors=$errors+1;
      $result='<tr class="error"><td>And error occurred: the type does not match with your data.</td></tr>';
   }
}
elseif ($request=="cho"){ //insert for cho
   if (strpos($csv_rows[0], 'cho_id') !== false) {
      foreach ($records_fields as $index => $row) {
         if($index!=0){
            $otitle=$row[2];
      		$etitle=$row[3];
      		$author=$row[4];
      		$place=$row[6];
      		$cdate=$row[7];
      		$idate=$row[8];
      		$type=$row[9];
      		$lang=$row[10];
      		$wiki=$row[11];
      		$bio=$row[12];
      		$bio=mysqli_real_escape_string($conn, $bio);
      		$picture=$row[13];

            if ($etitle=="") {
      			$etitle=$otitle;
      		}

      		if ($picture=="") {
      			$picture="imgs/museum.svg";
      			$picture=mysqli_real_escape_string($conn, $picture);
      		}

      		$check_id=select($conn, "SELECT MAX(cho_id) AS lastId FROM cho");
      		$last_id=$check_id[0]['lastId'];
      		$key_id='cho_'.($last_id+1);

            $check=select($conn, "SELECT * FROM cho WHERE original_title='$otitle' AND english_title='$etitle'");
            if ($check==NULL) {
               $sql= "INSERT INTO cho (key_id, original_title, english_title, author, author_id, place, creation_date, issue_date, type, language, linkwiki, bio, picture) VALUES('$key_id','$otitle','$etitle','$author','$author_id','$place','$cdate','$idate','$type','$lang','$wiki','$bio','$picture')";
               $res = mysqli_query($conn, $sql);
               if(!$res) {
                  $result=$result.'<tr class="error"><td>Insert error for <i>'.$otitle.'</i>: '.mysqli_errno($conn).'</td></tr>';
                  $errors=$errors+1;
               }
               else {
                  $result=$result.'<tr class="success"><td><i>'.$otitle.'</i> inserted correctly</td></tr>';
                  $success=$success+1;
               }
            }
            else {
               $result=$result.'<tr class="duplicate"><td><i>'.$otitle.'</i> is already in the database, so it was not inserted</td></tr>';
               $duplicate=$duplicate+1;
            }
         }
      }
   }
   else {
      $errors=$errors+1;
      $result='<tr class="error"><td>And error occurred: the type does not match with your data.</td></tr>';
   }
}

echo '<p><b>'.$success.' records inserted</b> | '.$duplicate.' duplicate records | '.$errors.' errors</p>';
echo '<div id="import_csv_container"><table id="import_result">';
echo $result;
echo '</table></div>';

fclose($file); //close the file
closeDB($conn); //close the conn

?>
