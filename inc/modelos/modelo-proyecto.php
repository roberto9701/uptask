<?php

$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];

if ($accion === 'crear') {
    // codigo para crear los proyectos 

    // importar la conexion 

    include '../funciones/conexion.php';
    try {
        // realizar la consulta en la base de datos
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) ");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto
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
