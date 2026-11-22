<?php
// Incluye la conexión a la base de datos y las cabeceras CORS
require_once "../../config/conexion.php";

try{
    // Obtiene todos los clientes ordenados del más reciente al más antiguo
    $query = "SELECT * FROM clientes ORDER BY id_cliente DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devuelve la lista de clientes en formato JSON
    http_response_code(200);
    echo json_encode($clientes);

}catch(PDOException $e){
    // Captura errores de base de datos durante la consulta
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al listar los clientes. " . $e->getMessage()
    ]);
}
?>