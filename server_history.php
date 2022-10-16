<?php
require_once("conn.php");
$responseArray = array();
$mysql = "SELECT id_data,smazáno,data from historie_dat";
    $stmt = $conn ->prepare($mysql);
    if($stmt === false){
        echo "err db ".$mysql;
        die;
    }
    $stmt -> execute();
    $stmt -> store_result();
    $stmt -> bind_result($id_data,$smazano,$data);
    while ($stmt ->fetch())
    {   
        $array = array("id_data" => $id_data,"smazano"=> $smazano,"data"=> $data);
        array_push($responseArray, $array);
    }
    $stmt->close();

    echo json_encode($responseArray);

    ?>