<?php
// Incluye la conexión a la base de datos y las cabeceras CORS
require_once "../../config/conexion.php";

try {
    // Consulta las reservas combinando datos de clientes y espacios
    $query = "SELECT 
                r.id_reserva,
                r.id_cliente,
                c.nombre_completo AS cliente_nombre,
                c.cedula AS cliente_cedula,
                r.id_espacio,
                e.nombre AS espacio_nombre,
                e.tipo AS espacio_tipo,
                e.precio_hora,
                r.fecha,
                r.hora_inicio,
                r.hora_fin,
                r.estado
              FROM reservas r
              INNER JOIN clientes c ON r.id_cliente = c.id_cliente
              INNER JOIN espacios e ON r.id_espacio = e.id_espacio
              ORDER BY r.id_reserva DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute();

    $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devuelve el listado de reservas en formato JSON
    http_response_code(200);
    echo json_encode($reservas);

} catch (PDOException $e) {
    // Captura errores de base de datos durante la consulta
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al listar las reservas: " . $e->getMessage()
    ]);
}
?>