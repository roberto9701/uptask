<?php

$accion = $_POST['accion'];

if ($accion === 'crear') {
    // se le agrega int para asegurar que se tome como int el id 
    $id_proyecto = (int) $_POST['id_proyecto'];
    $tarea = $_POST['tarea'];
    // codigo para crear las taras 
    // importar la conexion 
    include '../funciones/conexion.php';
    try {
        // realizar la consulta en la base de datos
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?) ");
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'accion' => $accion,
                'tarea' => $tarea
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

if ($accion === 'actualizar') {
    $estado = $_POST['estado'];
    $id_tarea = (int) $_POST['id'];
    // se le agrega int para asegurar que se tome como int el id 

    // codigo para actualizar las taras 
    // importar la conexion 
    include '../funciones/conexion.php';
    try {
        // realizar la consulta en la base de datos
        $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ? ");
        $stmt->bind_param('ii', $estado, $id_tarea);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'accion' => $accion,
                // 'tarea' => $tarea
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

if ($accion === 'eliminar') {
    $id_tarea = (int) $_POST['id'];
    // codigo para eliminar las taras 
    // importar la conexion 
    include '../funciones/conexion.php';
    try {
        // realizar la consulta en la base de datos
        $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ? ");
        $stmt->bind_param('i', $id_tarea);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'accion' => $accion,
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
