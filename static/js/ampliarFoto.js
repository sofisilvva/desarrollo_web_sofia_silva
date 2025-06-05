function cerrarFoto() {
    document.getElementById("fotoAmpliada").style.display = "none";
}

function mostrarFotoAmpliada(src) {
    const imagenGrande = document.getElementById("imagenGrande");
    imagenGrande.src = src;
    document.getElementById("fotoAmpliada").style.display = "flex";
}

// Agrega eventos a todas las miniaturas
document.addEventListener("DOMContentLoaded", () => {
    const miniaturas = document.querySelectorAll(".imagen-miniatura");
    miniaturas.forEach(img => {
        img.addEventListener("click", () => {
            mostrarFotoAmpliada(img.src);
        });
    });
});