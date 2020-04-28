eventListeners();
// lista de proyectos 
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    document.querySelector('.crear-proyecto a').addEventListener('click',nuevoProyecto);
    
    // boton para agregar tareas
    document.querySelector('.nueva-tarea').addEventListener('click',agregarTarea);
}

function nuevoProyecto(e) {
    e.preventDefault();
    if (document.querySelector('#nuevo-proyecto')) {
        listaProyectos.removeChild(nuevoProyecto);
    }else{
    //crea un input para el nombre de el nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // selecionar el id con el nuevo proyecto 
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // al presoinar enter crear el proyecto 
    inputNuevoProyecto.addEventListener('keypress', function(e){
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
    var datos= new FormData();
    datos.append('proyecto',nombreProyecto);
    datos.append('accion','crear');
    //abrir la conexion
    xhr.open('POST','inc/modelos/modelo-proyecto.php', true);
    //en la carga
    xhr.onload = function () {
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
                        text: 'El proyecto '+proyecto+' se agrego correctamente',
                        showConfirmButton: false,
                        timer: 1500
                      }).then(result =>{
                        if (result.value) {
                            //   redireccionar ala nueva URL 
                             window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    })
                    

                }else{
                    //se actualizo o se elimino
                }

            }else{
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
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    // validar que el campo tenga algo escrito 
    if (nombreTarea === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Una tarea no puede ir vacía'
          })
    }else{
        // insertar en php 
        // crear llamado a ajax
        var xhr = new XMLHttpRequest();

        // crear FormData 
        var datos = new FormData();
        datos.append('tarea',nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto',document.querySelector('#id_proyecto').value);

        // abrir la conexion 
        xhr.open('POST','inc/modelos/modelo-tareas.php');
        // ejecutarlo y respuesta 
        xhr.onload = function () {
            if (this.status === 200) {
                // todo correcto 
                var respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);
                var resultado = respuesta.respuesta;
                var tarea = respuesta.tarea;
                var id_insertado = respuesta.id_insertado;
                var accion = respuesta.accion;
                if (resultado ==='correcto') {
                    // se agrego correctamente
                    if (accion == 'crear') {
                        // alerta 
                        Swal.fire({
                            position: 'top-center',
                            icon: 'success',
                            title: 'Tarea Creada',
                            text: 'La tarea '+tarea+' se agrego correctamente',
                            showConfirmButton: false,
                            timer: 1500
                          })
                        //   construir template 
                        var nuevaTarea = document.createElement('li');
                        // agregar el ID 
                        nuevaTarea.id = 'tarea:'+id_insertado;
                        // agregar la clase tarea 
                        nuevaTarea.classList.add('tarea');
                        // insertar en el html 
                        nuevaTarea.innerHTML=`
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
                    }
                }else{
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
