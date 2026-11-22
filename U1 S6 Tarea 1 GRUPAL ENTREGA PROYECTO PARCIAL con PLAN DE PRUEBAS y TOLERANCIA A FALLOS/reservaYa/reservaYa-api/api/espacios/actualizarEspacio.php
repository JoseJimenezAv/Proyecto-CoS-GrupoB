<?php
// Incluye la conexión a la base de datos y las cabeceras CORS
require_once "../../config/conexion.php";

// Lee y decodifica el cuerpo JSON enviado por el cliente
$data = json_decode(file_get_contents("php://input"));

// Valida que se envíen el ID y todos los campos obligatorios del espacio
if(
    !empty($data->id_espacio) &&
    !empty($data->nombre) &&
    !empty($data->tipo) &&
    isset($data->capacidad) &&
    isset($data->precio_hora) &&
    !empty($data->estado)
){
    $id_espacio = $data->id_espacio;
    $nombre = $data->nombre;
    $tipo = $data->tipo;
    $capacidad = $data->capacidad;
    $precio_hora = $data->precio_hora;
    $estado = $data->estado;

    try{
        // Actualiza los datos del espacio mediante consulta preparada
        $query = "UPDATE espacios SET nombre = :nombre, tipo = :tipo, capacidad = :capacidad, precio_hora = :precio_hora, estado = :estado WHERE id_espacio = :id_espacio";
        $stmt = $conn->prepare($query);

        $stmt->bindParam(":id_espacio", $id_espacio, PDO::PARAM_INT);
        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":tipo", $tipo);
        $stmt->bindParam(":capacidad", $capacidad, PDO::PARAM_INT);
        $stmt->bindParam(":precio_hora", $precio_hora);
        $stmt->bindParam(":estado", $estado);

        if($stmt->execute()){
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "mensaje" => "Espacio actualizado correctamente"
            ]);
        } else{
            http_response_code(503);
            echo json_encode([
                "success" => false,
                "error" => "No se pudo actualizar el espacio"
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
    // Responde si faltan datos requeridos en la petición
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Datos incompletos. Se requiere el ID y todos los campos."
    ]);
}
?>