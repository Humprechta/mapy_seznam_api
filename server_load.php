<?php
require_once("conn.php");
$id = 1;
$responseArray = array();
$mysql = "SELECT id, E, N,data from data WHERE id_uzivatel = ?";
    $stmt = $conn ->prepare($mysql);
    if($stmt === false){
        echo "err db";
        die;
    }
    $stmt -> bind_param("i",$id);
    $stmt -> execute();
    $stmt -> store_result();
    $stmt -> bind_result($id,$E,$N,$data);
    while ($stmt ->fetch())
    {   
        $coords = $N."\"N,".$E."\"E";
        $array = array("name" => $data,"id"=> $id,"coords"=> $coords);
        array_push($responseArray, $array);
    }
    $stmt->close();

    echo json_encode($responseArray);

    ?>