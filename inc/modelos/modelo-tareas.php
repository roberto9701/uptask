<?php

$accion = $_POST['accion'];
// se le agrega int para asegurar que se tome como int el id 
$id_proyecto = (int) $_POST['id_proyecto'];
$tarea = $_POST['tarea'];


if ($accion === 'crear') {
    // codigo para crear los proyectos 
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
