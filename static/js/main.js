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
let fotoInput = document.getElementById("files");
let fileInputs = document.querySelectorAll('input[type="file"][name="fotos"]');

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
const btnPrevio1 = document.getElementById("btn-previo-nombre");
const btnPrevio2 = document.getElementById("btn-previo-tema");

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

btnPrevio1.addEventListener("click", function () {
  prevSection(2);

  // Remover mensajes de error de la sección para evitar de bloquear el usario
  removeErrorMessageById("redesSociales");
  removeErrorMessageById("otraRed");
  removeErrorMessageById("otraRedUsario");
  removeErrorMessageById("name");
  removeErrorMessageById("email");
  removeErrorMessageById("phone");
});

btnPrevio2.addEventListener("click", function () {
  prevSection(3);
  removeErrorMessageById("tema");
  removeErrorMessageById("otroTema");
  removeErrorMessageById("cantidadArchivos");
  removeErrorMessageById("tipoArchivos");
  removeErrorMessageById("fecha");
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
        myForm.submit();
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
        window.location.href= "/"
      })
    }

    // Hacer visible el mensaje de validación
    validationBox.hidden = false;
  }
}

document.getElementById("submit-btn").addEventListener("click", async function() {
  const form = document.getElementById("actividad-form");
  const formData = new FormData(myForm);

  // Sacar backend validation error, si existe
  removeErrorMessageById("backendValidationError");

  // Verificando de nuevo cada valor en el front antes de seguir con el fetch
  updateNameValidation();
  updateEmailValidation();
  updatePhoneValidation();
  updateRedesSocialesValidation();
  updateInputRedesSocialesValidation();
  updateSelectValidation();
  updateTemaValidation();
  updateFechaValidation();
  updateFilesValidation();

  // Validar con el backend usando fetch
  const response = await fetch("/validar", {
    method: "POST",
    body: formData
  });

  const result = await response.json();
  if (result.ok === true) {
    // Si la validación es exitosa, enviar el formulario
    validateForm();
  } else {
    // Mostrar mensaje de error
    addErrorMessage(
      "El formulario no es válido. Por favor, revise el contenido de los campos: " +
        result.errores.join(", "),
      "backendValidationError"
    )
  }
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
    removeErrorMessageById("backendValidationError");
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

document.addEventListener('DOMContentLoaded', function () {
  // Helper para poner primera letra mayúscula y resto minúsculas
  function primeraMayuscula(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  // Capitalizar todas las palabras (Nombre)
  function capitalizarPalabras(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }

  // Capitalizar la primera letra después de puntos y al inicio (Descripción)
  function capitalizarDescripcion(text) {
    if (!text) return '';
    // Convertir todo a minúsculas primero
    text = text.toLowerCase();

    // Capitalizar la primera letra de la cadena
    text = text.charAt(0).toUpperCase() + text.slice(1);

    // Capitalizar letra después de un punto y espacio
    return text.replace(/(\. +)([a-z])/g, function(match, p1, p2) {
      return p1 + p2.toUpperCase();
    });
  }

  // Input sector - primera letra mayúscula
  const sectorInput = document.getElementById('sector');
  if (sectorInput) {
    sectorInput.addEventListener('blur', () => {
      sectorInput.value = primeraMayuscula(sectorInput.value.trim());
    });
  }

  // Input nombre - capitalizar cada palabra
  const nombreInput = document.getElementById('nombre');
  if (nombreInput) {
    nombreInput.addEventListener('blur', () => {
      nombreInput.value = capitalizarPalabras(nombreInput.value.trim());
    });
  }

  // Input email - todo minúsculas
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      emailInput.value = emailInput.value.trim().toLowerCase();
    });
  }

  // Inputs redes sociales - todo minúsculas, excepto input id=red (la "Otra" red) con primera mayúscula
  const redesInputs = ['whatsapp', 'telegram', 'x', 'instagram', 'tiktok', 'usuario'];
  redesInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('blur', () => {
        input.value = input.value.trim().toLowerCase();
      });
    }
  });

  // Input red (red social "Otra") - primera letra mayúscula resto minúscula
  const redInput = document.getElementById('red');
  if (redInput) {
    redInput.addEventListener('blur', () => {
      redInput.value = primeraMayuscula(redInput.value.trim());
    });
  }

  // Input descripción - primera letra mayúscula, y después de cada punto también
  const descripcionInput = document.getElementById('descripcion');
  if (descripcionInput) {
    descripcionInput.addEventListener('blur', () => {
      descripcionInput.value = capitalizarDescripcion(descripcionInput.value.trim());
    });
  }
});

