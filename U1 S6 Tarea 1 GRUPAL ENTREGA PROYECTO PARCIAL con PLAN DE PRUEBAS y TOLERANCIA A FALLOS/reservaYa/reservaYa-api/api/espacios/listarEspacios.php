<?php
// Incluye la conexión a la base de datos y las cabeceras CORS
require_once "../../config/conexion.php";

try{
    // Consulta todos los espacios ordenados del más reciente al más antiguo
    $query = "SELECT * FROM espacios ORDER BY id_espacio DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $espacios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devuelve la lista de espacios en formato JSON
    http_response_code(200);
    echo json_encode($espacios);

} catch(PDOException $e){
    // Captura errores de base de datos durante la consulta
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al listar los espacios: " . $e->getMessage()
    ]);
}
?>