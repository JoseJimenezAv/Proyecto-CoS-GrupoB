<?php
// Incluye la conexión a la base de datos y las cabeceras CORS
require_once "../config/conexion.php";

// Lee y decodifica el cuerpo JSON enviado por el cliente
$data = json_decode(file_get_contents("php://input"));

// Verifica que se hayan recibido usuario y contraseña
if (!empty($data->usuario) && !empty($data->password)){
    $usuario = $data->usuario;
    $password = $data->password;

    try{
        // Busca el administrador activo por nombre de usuario
        $query = "SELECT * FROM administradores WHERE usuario = :usuario AND estado = 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":usuario", $usuario);
        $stmt->execute();

        if($stmt->rowCount() > 0){
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            // Valida la contraseña y devuelve los datos del administrador si coincide
            if($password === $admin['password']){
                http_response_code(200);
                echo json_encode([
                    "status" => "success",
                    "mensaje" => "Bienvenido",
                    "data" => [
                        "id_admin" => $admin['id_admin'],
                        "nombre" => $admin['nombre'],
                        "usuario" => $admin['usuario']
                    ]
                ]);
            } else{
                http_response_code(401);
                echo json_encode([
                    "status" => "error",
                    "mensaje" => "Contraseña incorrecta"
                ]);
            }
        } else{
            http_response_code(404);
            echo json_encode([
                "status" => "error",
                "mensaje" => "El usuario no existe o está inactivo"
            ]);
        }
    } catch(Exception $e){
        // Captura errores inesperados durante la consulta
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "mensaje" => "Error en el servidor: " . $e->getMessage()
        ]);
    }
} else{
    // Responde con error si faltan credenciales en la petición
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "mensaje" => "Datos incompletos"
    ]);
}
?>