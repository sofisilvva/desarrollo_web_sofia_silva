// Hora de inicio+3h en fecha de término (como predeterminado, pero puede cambiarse)
function inicializarFechaTermino() {
    fechaInicioInput = document.getElementById("inicio");
    let [fecha, tiempo] = fechaInicioInput.value.split("T");
    let [horas, minutos] = tiempo.split(":");
    let nuevasHoras = (parseInt(horas, 10) + 3).toString().padStart(2, "0");
    if (nuevasHoras > 24) {
      nuevasHoras = (nuevasHoras - 24).toString().padStart(2, "0");
      fecha = new Date(fecha);
      fecha.setDate(fecha.getDate() + 1);
      fecha = fecha.toISOString().split("T")[0];
    }
    let nuevoTiempo = `${nuevasHoras}:${minutos}`;
    let nuevoDateTime = `${fecha}T${nuevoTiempo}`;
    document.getElementById("termino").value = nuevoDateTime;
  }

// Pone la fecha y hora actual en fecha de inicio y muestra hora actual+3h en fecha de término
function setDateTimeInitial() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
  
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById("inicio").value = formattedDateTime;
    inicializarFechaTermino();
  }