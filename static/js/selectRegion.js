document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("select-region").addEventListener("change", function () {
      const regionId = this.value;
      const comunaSelect = document.getElementById("select-comuna");

      comunaSelect.innerHTML = '<option value="">Cargando...</option>';

      fetch(`/comunas/${regionId}`)
          .then(response => response.json())
          .then(data => {
              comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
              data.forEach(comuna => {
                  const option = document.createElement("option");
                  option.value = comuna.id;
                  option.textContent = comuna.nombre;
                  comunaSelect.appendChild(option);
              });
          })
          .catch(error => {
              comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
              console.error("Error al cargar comunas:", error);
          });
  });
});
