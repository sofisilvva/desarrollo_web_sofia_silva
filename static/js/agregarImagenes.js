// Contador de archivos, empezando con el predeterminado
let photoCount = 1;

function addFoto() {
    if (photoCount >= 5) {
        alert("No se puede agregar más de 5 fotos.");
        return;
    }

    const contenedor = document.getElementById("contenedorFotos");

    const wrapper = document.createElement("div");
    wrapper.classList.add("foto-wrapper");

    // Agregar inputs de agregar archivo
    const newInput = document.createElement("input");
    newInput.type = "file";
    newInput.name = "fotos";
    newInput.accept = "image/*,.pdf";

    // Eliminar inputs de agregar archivo
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("small-btn");
    deleteButton.onclick = function () {
        contenedor.removeChild(wrapper);
        photoCount--;
    };

    wrapper.appendChild(newInput);
    wrapper.appendChild(deleteButton);
    contenedor.appendChild(wrapper);

    photoCount++;
}