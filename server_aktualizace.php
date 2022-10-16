<?php
require_once("conn.php");

$id = $_POST["id"];
if(empty($id)){
    echo "err data";
    die;
}
$date = date("Y-m-d");
$uzivatel_id = 1;
$old_data = $_POST["old_data"];
$DATA_NEW = $_POST["DATA"];
$responseArray = array();

    $mysql = "INSERT INTO historie_dat (id_data,smazáno,id_uzivatel,data) values (?,?,?,?)";
    $stmt = $conn ->prepare($mysql);
    if($stmt === false){
        echo "err db 2 ";
        die;
    }
    $stmt -> bind_param("isis",$id,$date,$uzivatel_id,$old_data);
    $stmt -> execute();
    $mysql = "UPDATE data set id_uzivatel=?, data=?, datum=? WHERE id=$id";
    $stmt = $conn ->prepare($mysql);
    if($stmt === false){
        echo "err db 3";
        die;
    }
    $stmt -> bind_param("iss",$uzivatel_id,$DATA_NEW,$date);
    $stmt -> execute();
    $stmt->close();
    echo 1;

?>