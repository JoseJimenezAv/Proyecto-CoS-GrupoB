<?php
// Incluye la conexión a la base de datos y las cabeceras CORS
require_once "../../config/conexion.php";

// Lee y decodifica el cuerpo JSON enviado por el cliente
$data = json_decode(file_get_contents("php://input"));

// Valida que los campos obligatorios estén presentes
if(
    !empty($data->nombre) &&
    !empty($data->tipo) &&
    isset($data->capacidad) &&
    isset($data->precio_hora) &&
    !empty($data->estado)
){
    $nombre = $data->nombre;
    $tipo = $data->tipo;
    $capacidad = $data->capacidad;
    $precio_hora = $data->precio_hora;
    $estado = $data->estado;

    try{
        // Inserta el nuevo espacio mediante consulta preparada
        $query = "INSERT INTO espacios (nombre, tipo, capacidad, precio_hora, estado) VALUES (:nombre, :tipo, :capacidad, :precio_hora, :estado)";
        $stmt = $conn->prepare($query);

        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":tipo", $tipo);
        $stmt->bindParam(":capacidad", $capacidad, PDO::PARAM_INT);
        $stmt->bindParam(":precio_hora", $precio_hora);
        $stmt->bindParam(":estado", $estado);

        if($stmt->execute()){
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Espacio creado correctamente",
                "id_espacio" => $conn->lastInsertId()
            ]);
        } else{
            http_response_code(503);
            echo json_encode([
                "success" => false,
                "message" => "No se pudo crear el espacio"
            ]);
        }
    } catch(PDOException $e){
        // Captura errores de base de datos
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error en la base de datos: " . $e->getMessage()
        ]);
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