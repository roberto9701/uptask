<?php

function obtenerPaginaActual()
{
    // obtener el archivo actual 
    $archivo = basename($_SERVER['PHP_SELF']);
    // este codigo remueve el .php 
    $pagina = str_replace(".php", "", $archivo);
    return $pagina;
}
