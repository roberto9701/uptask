<?php

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if ($accion === 'crear') {
    // codigo para crear los admin 
    // hashear password 
    $opciones = array(
        'cost' => 10
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
    // importar la conexion 

    include '../funciones/conexion.php';
    try {
        // realizar la consulta en la base de datos
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
                // 'respuesta' => $stmt->affected_rows,
                // 'error-list' => $stmt->error_list,
                // 'error' => $stmt->error
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }

        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}

if ($accion === 'login') {
    // codigo para logear 
    include '../funciones/conexion.php';

    try {
        // seleccionar administrador de la bd 
        $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        // logear al usuario 
        $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
        $stmt->fetch();
        if ($nombre_usuario) {
            // el usuario existe vericar el password 
            if (password_verify($password, $pass_usuario)) {
                // iniciar la sesion 

                session_start();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                // login correcto
                $respuesta = array(
                    // 'resultado' => 'login correcto'
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_usuario,
                    'tipo' => $accion
                    // 'id' => $id_usuario,
                    // 'pass' => $pass_usuario
                    // 'columnas' => $stmt->affected_rows
                );
            } else {
                // login incorrecto 
                $respuesta = array('resultado' => 'Password incorrecto');
            }
        } else {
            $respuesta = array(
                'error' => 'usuario no existe'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}
