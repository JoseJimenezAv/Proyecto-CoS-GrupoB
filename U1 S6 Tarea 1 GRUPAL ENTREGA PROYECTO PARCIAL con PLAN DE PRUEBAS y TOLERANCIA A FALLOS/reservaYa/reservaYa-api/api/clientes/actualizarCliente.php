<?php
// Incluye la conexión a la base de datos y las cabeceras CORS
require_once "../../config/conexion.php";

// Lee y decodifica el cuerpo JSON enviado por el cliente
$data = json_decode(file_get_contents("php://input"));

// Valida que los campos obligatorios estén presentes
if(
    !empty($data->id_cliente) &&
    !empty($data->nombre_completo) &&
    isset($data->cedula) &&
    isset($data->telefono) &&
    !empty($data->correo)
){
    $id_cliente = $data->id_cliente;
    $nombre_completo = $data->nombre_completo;
    $cedula = $data->cedula;
    $telefono = $data->telefono;
    $correo = $data->correo;

    try{
        // Actualiza los datos del cliente mediante consulta preparada
        $query = "UPDATE clientes SET nombre_completo = :nombre_completo, cedula = :cedula, telefono = :telefono, correo = :correo WHERE id_cliente = :id_cliente";
        $stmt = $conn->prepare($query);

        $stmt->bindParam(":id_cliente", $id_cliente, PDO::PARAM_INT);
        $stmt->bindParam(":nombre_completo", $nombre_completo);
        $stmt->bindParam(":cedula", $cedula, PDO::PARAM_STR);
        $stmt->bindParam(":telefono", $telefono, PDO::PARAM_STR);
        $stmt->bindParam(":correo", $correo);

        if($stmt->execute()){
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "mensaje" => "Cliente actualizado correctamente"
            ]);
        } else{
            http_response_code(503);
            echo json_encode([
                "success" => false,
                "error" => "No se pudo actualizar el cliente"
            ]);
        }
    } catch(PDOException $e){
        // Captura erroes de base de datos
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Error en la base de datos: " . $e->getMessage()
        ]);
    }
} else{
    // Response si faltan datos requeridos en la petición
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Datos incompletos. Se requiere el ID y todos los campos."
    ]);
}
?>