eventListeners();

function eventListeners(params) {
    document.querySelector('#formulario').addEventListener('submit',validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

        if (usuario ===''|| password==='') {
            // la validacion fallo
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ambos campos son obligatorios!'
              })
        }else{
            // ambos campos son correctos mandar a ejecutar ajax
            // ajax

            // datos que se envian al server 
            var datos = new FormData();
            datos.append('usuario',usuario);
            datos.append('password',password);
            datos.append('accion',tipo);

            // console.log(...da tos);

            // crear un llamado a ajax
            var xhr = new XMLHttpRequest();
            // abrir la conexion 
            xhr.open('POST','inc/modelos/modelo-admin.php',true);
            // retorno de datos 
            xhr.onload = function () {
                if (this.status == 200) {
                    var  respuesta = JSON.parse(xhr.responseText);
                    console.log(respuesta);
                    // si la respuesta es correcta
                    if (respuesta.respuesta ==='correcto') {
                        // si es un nuevo usuario 
                        if (respuesta.tipo === 'crear') {
                            // si se crea correctamente
                            Swal.fire({
                                icon: 'success',
                                title: 'Usuario Creado',
                                text: 'El usuario se creo correctamente'
                              })}
                         else if(respuesta.tipo==='login'){
                            Swal.fire({
                                icon: 'success',
                                title: 'Login correcto',
                                text: '´Presiona OK para abrir el dashboard'
                              }).then(result =>{
                                  if (result.value) {
                                      window.location.href='index.php';
                                  }
                              })
                            }
                         
                        
                    }
                    else{
                        // si hay un error 
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error',
                            text: 'error'
                              })        
                    }
                }
            }
            // enviar la peticion 
            xhr.send(datos);
        }
}