// Lógica dada por el profesor
function revisaCheck(element) {
    if (element.name === "otra") {
        // Mostrar los campos "red" y "usuario"
        const red = document.getElementById("red");
        const usuario = document.getElementById("usuario");
        const display = element.checked ? "block" : "none";
        red.style.display = display;
        usuario.style.display = display;
    }
    else if (element.name === "tema" && element.value === "otro") {
        const otroTema = document.getElementById("otro");
        otroTema.style.display = element.checked ? "block" : "none";
    } else {
        // Mostrar el campo que coincida con el name del checkbox
        const target = document.getElementById(element.name);
        if (target) {
            target.style.display = element.checked ? "block" : "none";
        }
    }
  }