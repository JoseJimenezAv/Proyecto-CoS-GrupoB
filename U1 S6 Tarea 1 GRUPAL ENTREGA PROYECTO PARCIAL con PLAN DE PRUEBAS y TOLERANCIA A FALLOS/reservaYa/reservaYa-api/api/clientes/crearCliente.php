<?php
// Incluye la conexión a la base de datos y las cabeceras CORS
require_once "../../config/conexion.php";

// Lee y decodifica el cuerpo JSON enviado por el cliente
$data = json_decode(file_get_contents("php://input"));

// Valida que los campos obligatorios estén presentes
if(
    !empty($data->nombre_completo) &&
    !empty($data->cedula) &&
    !empty($data->telefono) &&
    !empty($data->correo)
){
    $nombre_completo = trim($data->nombre_completo);
    $cedula = trim($data->cedula);
    $telefono = trim($data->telefono);
    $correo = trim($data->correo);

    try{
        // Verifica si ya existe un cliente con la misma cédula
        $check = $conn->prepare("SELECT id_cliente FROM clientes WHERE cedula = :cedula");
        $check->bindParam(":cedula", $cedula, PDO::PARAM_STR);
        $check->execute();

        if($check->rowCount() > 0){
            http_response_code(409);
            echo json_encode([
                "success" => false,
                "message" => "Ya existe un cliente registrado con esa cédula"
            ]);
            exit;
        }

        // Inserta el nuevo cliente mediante consulta preparada
        $query = "INSERT INTO clientes (nombre_completo, cedula, telefono, correo) VALUES (:nombre_completo, :cedula, :telefono, :correo)";
        $stmt = $conn->prepare($query);

        $stmt->bindParam(":nombre_completo", $nombre_completo);
        $stmt->bindParam(":cedula", $cedula, PDO::PARAM_STR);
        $stmt->bindParam(":telefono", $telefono, PDO::PARAM_STR);
        $stmt->bindParam(":correo", $correo);

        if($stmt->execute()){
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Cliente creado correctamente",
                "id_cliente" => $conn->lastInsertId()
            ]);
        } else{
            http_response_code(503);
            echo json_encode([
                "success" => false,
                "message" => "No se pudo crear el cliente"
            ]);
        }
    } catch(PDOException $e){
        // Captura errores de base de datos
        // 23000 = violación de restricción (por ejemplo, cédula UNIQUE duplicada)
        if($e->getCode() == 23000){
            http_response_code(409);
            echo json_encode([
                "success" => false,
                "message" => "Ya existe un cliente registrado con esa cédula"
            ]);
        } else{
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Error en la base de datos"
            ]);
        }
    }
} else{
    // Responde si faltan datos requeridos en la petición
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Datos incompletos. Faltan campos obligatorios."
    ]);
}
?>