<?php
// Carga las cabeceras CORS y los encabezados HTTP necesarios para la API
require_once __DIR__ . "/cors.php";

// Credenciales de conexión a la base de datos reservaya_db
$host = "localhost";
$db_name = "reservaya_db";
$username = "root";
$password = "";

try{
    // Inicializa la conexión PDO con UTF-8 y modo de excepciones habilitado
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    // Devuelve el error de conexión en formato JSON y detiene la ejecución
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(["error" => "Error de conexión a la base de datos: " . $exception->getMessage()]);
    exit();
}
?>