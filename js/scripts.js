eventListeners();
// lista de proyectos 
var listaProyectos = document.querySelector('.proyectos');
var contenidoTareas = document.querySelector('.listado-pendientes');
var SelectedProject = false;


function eventListeners() {
    // document ready 
    document.addEventListener('DOMContentLoaded', function() {
        actualizarProgreso();
    })
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
    // boton para agregar tareas
    if (!SelectedProject == false) {
        document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);


    }

    // botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);

}

function nuevoProyecto(e) {
    e.preventDefault();
    console.log(listaProyectos);
    if (document.querySelector('#nuevo-proyecto')) {
        listaProyectos.removeChild(nuevoProyecto);
    } else {
        console.log(listaProyectos);

        //crea un input para el nombre de el nuevo proyecto
        var nuevoProyecto = document.createElement('li');
        console.log(nuevoProyecto);
        nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
        listaProyectos.appendChild(nuevoProyecto);

        // selecionar el id con el nuevo proyecto 
        var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

        // al presoinar enter crear el proyecto 
        inputNuevoProyecto.addEventListener('keypress', function(e) {
            var tecla = e.keyCode;
            if (tecla === 13) {
                guardarProyectoDB(inputNuevoProyecto.value);
                // remover el campo de texto 
                listaProyectos.removeChild(nuevoProyecto);
            }
        });
    }

}

function guardarProyectoDB(nombreProyecto) {
    //crear llamado ajax
    var xhr = new XMLHttpRequest();

    // enviar datos por FormData()
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');
    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
    //en la carga
    xhr.onload = function() {
            if (this.status === 200) {
                //Obtener datos de la respuesta
                var respuesta = JSON.parse(xhr.responseText);
                var proyecto = respuesta.nombre_proyecto,
                    id_proyecto = respuesta.id_insertado,
                    tipo = respuesta.tipo,
                    resultado = respuesta.respuesta;

                // comprobar la insercion
                if (resultado === 'correcto') {
                    // fue exitoso 
                    if (tipo === 'crear') {
                        //se creo un nuevo proyecto
                        //inyectar en el html
                        var nuevoProyecto = document.createElement('li');
                        nuevoProyecto.innerHTML = `
                    <a href ="index.php?id_proyecto=${id_proyecto}" id ="proyecto:${id_proyecto}">
                    ${proyecto}
                    </a>
                    `;
                        //agregar al html
                        listaProyectos.appendChild(nuevoProyecto);
                        // enviar alerta
                        Swal.fire({
                            position: 'top',
                            icon: 'success',
                            title: 'Proyecto Creado',
                            text: 'El proyecto ' + proyecto + ' se agrego correctamente',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(result => {
                            if (result.value) {
                                //   redireccionar ala nueva URL 
                                window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                            }
                        })


                    } else {
                        //se actualizo o se elimino
                    }

                } else {
                    //hubo un error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Hubo un error'
                    })
                }


            }
        }
        // enviar el request 
    xhr.send(datos);
}

function agregarTarea(e) {
    SelectedProject == true;

    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;

    contenidoTareas.style.display = 'block';

    // validar que el campo tenga algo escrito 
    if (nombreTarea === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Una tarea no puede ir vacía'
        })
    } else {
        // insertar en php 
        // crear llamado a ajax
        var xhr = new XMLHttpRequest();

        // crear FormData 
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        // abrir la conexion 
        xhr.open('POST', 'inc/modelos/modelo-tareas.php');
        // ejecutarlo y respuesta 
        xhr.onload = function() {
                if (this.status === 200) {
                    // todo correcto 
                    var respuesta = JSON.parse(xhr.responseText);
                    console.log(respuesta);
                    var resultado = respuesta.respuesta;
                    var tarea = respuesta.tarea;
                    var id_insertado = respuesta.id_insertado;
                    var accion = respuesta.accion;
                    if (resultado === 'correcto') {
                        // se agrego correctamente
                        if (accion == 'crear') {
                            // alerta 
                            Swal.fire({
                                position: 'top-center',
                                icon: 'success',
                                title: 'Tarea Creada',
                                text: 'La tarea ' + tarea + ' se agrego correctamente',
                                showConfirmButton: false,
                                timer: 1500
                            });

                            // seleccionar el parrafo con la lista vacia 
                            // se usa para comprobar si un elemento existe
                            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                            if (parrafoListaVacia.length > 0) {
                                //   el elemento existe 
                                // se borra 
                                document.querySelector('.lista-vacia').remove();
                            }
                            //construir template 
                            var nuevaTarea = document.createElement('li');
                            // agregar el ID 
                            nuevaTarea.id = 'tarea:' + id_insertado;
                            // agregar la clase tarea 
                            nuevaTarea.classList.add('tarea');
                            // insertar en el html 
                            nuevaTarea.innerHTML = `
                          <p>${tarea}</p>
                          <div class="acciones">
                          <i class="far fa-check-circle"></i>
                          <i class="fas fa-trash"></i>
                          </div>
                        `;
                            // agregarlo al DOM 
                            var listado = document.querySelector('.listado-pendientes ul');
                            listado.appendChild(nuevaTarea);
                            // limpiar el formulario 
                            document.querySelector('.agregar-tarea').reset();
                            // actualizar Progreso de la barra 
                            actualizarProgreso();
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Hubo un error'
                        })
                    }
                }
            }
            //enviar la consulta
        xhr.send(datos);

    }
}

// cambia el estado de las tareas o las elimina 
function accionesTareas(e) {
    e.preventDefault();
    // console.log('click en listado');
    // target devuelve el elemento selecionado dentro de un contenedor 
    // a esto se le conoce como delegation 
    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }
    if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: '¿Seguro (a?',
            text: "Esta accion no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;
                // borrar de la bd 
                eliminarTareaBD(tareaEliminar);
                // borrar del html
                tareaEliminar.remove();

                Swal.fire(
                    'Eliminado',
                    'La tara fue eliminada',
                    'success'
                )
            }
        })
    }


}

// completa o descompleta la tarea 
function cambiarEstadoTarea(tarea, estado) {

    var idTarea = tarea.parentElement.parentElement.id.split(':');
    // crear llamdo a ajax 
    var xhr = new XMLHttpRequest();
    // informacion 
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    // abrir la conexion 
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    // on load 
    xhr.onload = function() {
            if (this.status === 200) {
                respuesta = JSON.parse(xhr.responseText);
                // actualizar Progreso de la barra 
                actualizarProgreso();
            }
        }
        // enviar la peticion 
    xhr.send(datos);
}

// elimina las tareas de la bd

function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');
    // crear llamdo a ajax 
    var xhr = new XMLHttpRequest();
    // informacion 
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    // abrir la conexion 
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    // on load 
    xhr.onload = function() {
            if (this.status === 200) {
                respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);

                // comprobar que existan tareas restantes
                var listaTareasRestantes = document.querySelectorAll('li.tarea');
                if (listaTareasRestantes.length == 0) {
                    document.querySelector('.listado-pendientes ul').innerHTML = ("<p class ='lista-vacia'>No hay tareas en este proyecto</p>");
                }
                // actualizar Progreso de la barra 
                actualizarProgreso();
            }
        }
        // enviar la peticion 
    xhr.send(datos);
}

// actualiza el avance del proyecto 

function actualizarProgreso() {
    // obtener todas las tareas 
    const tareas = document.querySelectorAll('li.tarea');
    // obtener las tareas completadas 
    const tareasCompletadas = document.querySelectorAll('i.completo');
    //determinar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    console.log(avance);
    // asignar el avance a la barra 
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance + '%'
    porcentaje.innerHTML = `${avance}% `;

    if (avance === 100) {
        Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Proyecto terminado',
            text: 'Completaste el proyecto, ya no tienes tareas pendientes',
            showConfirmButton: false,
            timer: 1700
        });
    }

}