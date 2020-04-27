eventListeners();
// lista de proyectos 
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    document.querySelector('.crear-proyecto a').addEventListener('click',nuevoProyecto);
}

function nuevoProyecto(e) {
    e.preventDefault();

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

function guardarProyectoDB(nombreProyecto) {
    // inyectar el html 
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = `
    <a href="#">
    ${nombreProyecto}
    </a>
    `;
    listaProyectos.appendChild(nuevoProyecto);
}