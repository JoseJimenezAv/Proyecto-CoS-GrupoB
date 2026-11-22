<?php
// Incluye la conexión a la base de datos y las cabeceras CORS
require_once "../../config/conexion.php";

// Lee y decodifica el cuerpo JSON enviado por el cliente
$data = json_decode(file_get_contents("php://input"));

// Valida que los campos obligatorios estén presentes
if (
    !empty($data->id_cliente) &&
    !empty($data->id_espacio) &&
    !empty($data->fecha) &&
    !empty($data->hora_inicio) &&
    !empty($data->hora_fin) &&
    !empty($data->estado)
) {
    $id_cliente  = $data->id_cliente;
    $id_espacio  = $data->id_espacio;
    $fecha       = $data->fecha;
    $hora_inicio = $data->hora_inicio;
    $hora_fin    = $data->hora_fin;
    $estado      = $data->estado;

    // Verifica que la hora de fin sea posterior a la hora de inicio
    if ($hora_fin <= $hora_inicio) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => "La hora de fin debe ser mayor que la hora de inicio."
        ]);
        exit();
    }

    try {
        // Valida que no exista cruce de horarios con otras reservas activas en el mismo espacio y fecha
        $queryCruce = "SELECT COUNT(*) FROM reservas WHERE id_espacio = :id_espacio AND fecha = :fecha AND estado != 'Cancelada' AND (:hora_inicio < hora_fin AND :hora_fin > hora_inicio)";
        $stmtCruce = $conn->prepare($queryCruce);
        $stmtCruce->bindParam(":id_espacio", $id_espacio, PDO::PARAM_INT);
        $stmtCruce->bindParam(":fecha", $fecha);
        $stmtCruce->bindParam(":hora_inicio", $hora_inicio);
        $stmtCruce->bindParam(":hora_fin", $hora_fin);
        $stmtCruce->execute();

        if ($stmtCruce->fetchColumn() > 0) {
            http_response_code(409);
            echo json_encode([
                "success" => false,
                "error" => "Ya existe una reserva en ese espacio, fecha y rango de horas."
            ]);
            exit();
        }

        // Inserta la nueva reserva mediante consulta preparada
        $query = "INSERT INTO reservas (id_cliente, id_espacio, fecha, hora_inicio, hora_fin, estado) VALUES (:id_cliente, :id_espacio, :fecha, :hora_inicio, :hora_fin, :estado)";
        $stmt = $conn->prepare($query);

        $stmt->bindParam(":id_cliente", $id_cliente, PDO::PARAM_INT);
        $stmt->bindParam(":id_espacio", $id_espacio, PDO::PARAM_INT);
        $stmt->bindParam(":fecha", $fecha);
        $stmt->bindParam(":hora_inicio", $hora_inicio);
        $stmt->bindParam(":hora_fin", $hora_fin);
        $stmt->bindParam(":estado", $estado);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Reserva creada correctamente",
                "id_reserva" => $conn->lastInsertId()
            ]);
        } else {
            http_response_code(503);
            echo json_encode([
                "success" => false,
                "message" => "No se pudo crear la reserva"
            ]);
        }
    } catch (PDOException $e) {
        // Captura errores de base de datos
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error en la base de datos: " . $e->getMessage()
        ]);
    }
} else {
    // Responde si faltan datos requeridos en la petición
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Datos incompletos. Faltan campos obligatorios."
    ]);
}
?>