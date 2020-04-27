<?php

$conn = new mysqli('localhost', 'root', '', 'uptask');

if ($conn->connect_error) {
    echo $conn->connect_error;
}
// echo "<pre>";
// var_dump($conn->ping());
// echo "</pre>";

// para poder ver los acentos o la ñ
$conn->set_charset('utf8');
