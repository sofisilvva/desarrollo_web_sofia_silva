// Declaracion de todos los elementos del formulario
let nameInput = document.getElementById("nombre");
let phoneInput = document.getElementById("phone");
let emailInput = document.getElementById("email");
let inicioInput = document.getElementById("inicio");
let terminoInput = document.getElementById("termino");
let sectorInput = document.getElementById("sector");
let otroInput = document.getElementById("otro");
let submitButton = document.getElementById("submit-btn");
let errorMessages = document.getElementById("error-messages");
let errorList = document.getElementById("error-list");
let seleccionRegion = document.getElementById("select-region");
let seleccionComuna = document.getElementById("select-comuna");
let whatsappInput = document.getElementById("whatsapp");
let telegramInput = document.getElementById("telegram");
let xInput = document.getElementById("x");
let instagramInput = document.getElementById("instagram");
let tiktokInput = document.getElementById("tiktok");
let redInput = document.getElementById("red");
let usuarioInput = document.getElementById("usuario");
let submitBtn = document.getElementById("submit-btn");
let fotoInput = document.getElementById("files");
let fileInputs = document.querySelectorAll('input[type="file"][name="foto"]');

let checkboxNames = [
  "whatsapp",
  "telegram",
  "x",
  "instagram",
  "tiktok",
  "otra",
];
let checkboxesRedes = checkboxNames.map((name) =>
  document.querySelector(`input[name="${name}"]`)
);

let allFilled = true;
let allValid = true;

const btnSiguiente1 = document.getElementById("btn-siguiente-region");
const btnSiguiente2 = document.getElementById("btn-siguiente-nombre");

btnSiguiente1.addEventListener("click", function () {
  updateSelectValidation();
  nextSection(1);
});

btnSiguiente2.addEventListener("click", function () {
  updateNameValidation();
  updateEmailValidation();
  updatePhoneValidation();
  updateRedesSocialesValidation();
  updateInputRedesSocialesValidation();
  nextSection(2);
});

// Máximo 5 redes sociales seleccionadas
document.addEventListener("DOMContentLoaded", function () {
  checkboxesRedes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const checkedCount = checkboxNames.reduce((count, name) => {
        return (
          count +
          (document.querySelector(`input[name="${name}"]:checked`) ? 1 : 0)
        );
      }, 0);

      if (checkedCount > 5) {
        this.checked = false;
        revisaCheck(this);
        alert("No puede seleccionar más de 5 redes sociales.");
      }
    });
  });
});

function validateForm() {
  // Mostrar la validación
  let validationBox = document.getElementById("val-box");
  let validationMessageElem = document.getElementById("val-msg");

  if (errorList.childNodes.length === 0) {
    // Ocultar el formulario
    myForm.style.display = "none";

    // Establecer mensaje de éxito
    validationMessageElem.innerText =
      "¡Formulario válido! ¿Está seguro que desea agregar esta actividad?";
    validationBox.style.display = "block";

    // Verificar si los botones existen o no
    let submitButton = document.getElementById("submitButton");
    let backButton = document.getElementById("backButton");
    let indexButton = document.getElementById("indexButton");

    if (!submitButton) {
      // Agregar botones para enviar el formulario o volver
      submitButton = document.createElement("button");
      submitButton.id = "submitButton";
      submitButton.innerText = "Sí, estoy seguro";
      submitButton.style.marginBottom = "10px";
      submitButton.addEventListener("click", () => {
        validationMessageElem.innerText =
        "Hemos recibido su información, muchas gracias y suerte en su actividad"
        backButton.style.display = "none";
        submitButton.style.display = "none";
        validationBox.appendChild(indexButton);
        // myForm.submit();
        // Aún no tenemos un backend al cual enviarle los datos
      });
    }
    if (!backButton) {
      backButton = document.createElement("button");
      backButton.id = "backButton";
      backButton.innerText = "No, no estoy seguro, quiero volver al formulario";
      backButton.addEventListener("click", () => {
        // Mostrar el formulario nuevamente
        myForm.style.display = "block";
        validationBox.style.display = "none";
      });
    }
    validationBox.appendChild(submitButton);
    validationBox.appendChild(backButton);
    
    if (!indexButton) {
      indexButton = document.createElement("button");
      indexButton.id = "indexButton";
      indexButton.innerText = "Volver a la portada";
      indexButton.addEventListener("click", () => {
        window.location.href='index.html'
      })
    }

    // Hacer visible el mensaje de validación
    validationBox.hidden = false;
  }
}

// Botón enviar formulario
document.addEventListener("DOMContentLoaded", function () {
  submitButton.addEventListener("click", function (event) {
    // Verificando de nuevo cada valor antes de enviar
    updateNameValidation();
    updateEmailValidation();
    updatePhoneValidation();
    updateRedesSocialesValidation();
    updateInputRedesSocialesValidation();
    updateSelectValidation();
    updateTemaValidation();
    updateFechaValidation();
    updateFilesValidation();

    if (errorList.children.length === 0) {
      errorMessages.style.display = "none";
      validateForm();
    }
  });
});

// Blur para validar cada input
sectorInput.addEventListener("blur", function () {
  updateSectorValidation();
});

nameInput.addEventListener("blur", function () {
  updateNameValidation();
});

emailInput.addEventListener("blur", function () {
  updateEmailValidation();
});

phoneInput.addEventListener("blur", function () {
  updatePhoneValidation();
});

inicioInput.addEventListener("change", function () {
  inicializarFechaTermino();
});

terminoInput.addEventListener("blur", function () {
  updateFechaValidation();
});

sectorInput.addEventListener("blur", function () {
  updateSelectValidation();
});

fileInputs.forEach(function (fileInput) {
  fileInput.addEventListener("change", function () {
    updateFilesValidation();
  });
});

// Botón "anterior"
function prevSection(currentSection) {
  document
    .getElementById(`section${currentSection}`)
    .classList.remove("active");
  document
    .getElementById(`section${currentSection - 1}`)
    .classList.add("active");
}

// Botón "siguiente"
function nextSection(currentSection) {
  const currentSectionElement = document.getElementById(
    `section${currentSection}`
  );
  const requiredFields = currentSectionElement.querySelectorAll(
    "input[required], textarea[required], select[required]"
  );

  let countFields = 0;
  let fieldsFilled = 0;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      countFields++;
    } else {
      fieldsFilled++;
      countFields++;
    }
  });

  if (fieldsFilled === countFields) {
    allFilled = true;
    removeErrorMessageById("faltaInfo");
  } else {
    allFilled = false;
  }

  // Alerta de completar/cambiar campos
  if (!allFilled) {
    addErrorMessage(
      "Por favor, complete todos los campos obligatorios antes de continuar.",
      "faltaInfo"
    );
  } else if (!allValid) {
    addErrorMessage(
      "Por favor, verifique los campos marcados en rojo para asegurarse de que contienen datos válidos.",
      "infoIncorrecta"
    );
  } else {
    errorMessages.style.display = "none";
    currentSectionElement.classList.remove("active");
    document
      .getElementById(`section${currentSection + 1}`)
      .classList.add("active");
    if (currentSection === 2) {
      setDateTimeInitial();
    }
  }
}

// Descripción: área de texto de 50 columnas, 10 filas.
window.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById("descripcion");

  // Verificamos y forzamos los valores si no están correctos
  if (textarea) {
      if (textarea.cols !== 50) textarea.cols = 50;
      if (textarea.rows !== 10) textarea.rows = 10;
  }
});
