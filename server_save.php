
<?php

require_once("conn.php");

 $N = $_POST["N"];
 $E = $_POST["E"];
 $DATA = $_POST["DATA"];

 $sql = "INSERT INTO data (id_uzivatel, N, E,data, datum)
 VALUES (1, '$N', '$E','$DATA','NOW()')";
 
 if ($conn->query($sql) === TRUE) {
   echo true;
 } else {
   echo "Error: " . $sql . "<br>" . $conn->error;
 }
 
 $conn->close();


?>