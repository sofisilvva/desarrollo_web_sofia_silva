// Click en las filas de la table
function mostrarDetalle() {
    window.location.href = "informacion-actividad.html";
}

// Botones en el detalle de las actividades
function volverListado() {
    document.querySelector('.detalle').style.display = 'none';
}

function volverPortada() {
    window.location.href = 'index.html';
}

function ampliarFoto(rutaImagen) {
    const modal = document.getElementById('fotoAmpliada');
    const contenedor = document.getElementById('contenedorImagen');
  
    contenedor.innerHTML = '';
  
    // Crear la imagen agrandada
    const imagen = document.createElement('img');
    imagen.src = rutaImagen;
    imagen.alt = 'Imagen agrandada';
    imagen.id = 'imagenGrande';
  
    contenedor.appendChild(imagen);
    modal.style.display = 'flex';
  }
  
  // Cerrar la imagen agrandada
  function cerrarFoto() {
    const modal = document.getElementById('fotoAmpliada');
    const contenedor = document.getElementById('contenedorImagen');
  
    // Ocultar y limpiar
    modal.style.display = 'none';
    contenedor.innerHTML = '';
  }
  