<?php
// Incluye la conexión a la base de datos y las cabeceras CORS
require_once "../../config/conexion.php";

// Lee y decodifica el cuerpo JSON enviado por el cliente
$data = json_decode(file_get_contents("php://input"));

// Valida que se reciba el ID del cliente
if(!empty($data->id_cliente)){
    $id_cliente = $data->id_cliente;

    try{
        // Prepara y ejecuta la eliminación del cliente por ID
        $query = "DELETE FROM clientes WHERE id_cliente = :id_cliente";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":id_cliente", $id_cliente, PDO::PARAM_INT);

        if($stmt->execute()){
            // Verifica si existía un registro con ese ID para responder en consecuencia
            if($stmt->rowCount() > 0){
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "mensaje" => "Cliente eliminado correctamente"
                ]);
            } else{
                http_response_code(404);
                echo json_encode([
                    "success" => false,
                    "error" => "No se encontró un cliente con ese ID"
                ]);
            }
        } else{
            http_response_code(503);
            echo json_encode([
                "success" => false,
                "error" => "No se pudo eliminar el cliente"
            ]);
        }
    } catch(PDOException $e){
        // Captura errores de base de datos
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Error en la base de datos: " . $e->getMessage()
        ]);
    }
} else{
    // Responde si no se envía el ID del cliente
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "ID de cliente no proporcionado"
    ]);
}
?>