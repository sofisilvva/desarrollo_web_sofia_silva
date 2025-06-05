// Gestión de errores
function addErrorMessage(message, id) {
  const li = document.createElement("li");
  li.textContent = message;
  li.setAttribute("data-id", id);
  if (!document.querySelector(`[data-id="${id}"]`)) errorList.appendChild(li);
  errorMessages.style.display = "block";
  if (id != "faltaInfo") allValid = false;
}

function removeErrorMessageById(id) {
  const errorElement = document.querySelector(`[data-id="${id}"]`);
  if (errorElement) {
    errorElement.remove();
  }

  if (
    errorList.childNodes.length === 0 ||
    (errorList.childNodes.length == 1 &&
      document.querySelector(`[data-id="infoIncorrecta"]`))
  ) {
    if (document.querySelector(`[data-id="infoIncorrecta"]`)) {
      document.querySelector(`[data-id="infoIncorrecta"]`).remove();
    }
    errorMessages.style.display = "none";
    allValid = true;
  }
}

function errorStyling(inputField, bool) {
  if (bool == true) {
    inputField.style.borderColor = "red";
  } else {
    inputField.style.borderColor = "";
  }
}

// Validar que, si se escribe un sector, que este tenga maximo 100 caracteres
function validateSector(sector) {
  if (sector.length <= 100) return true;
  else return false;
}

// Validar el nombre del organizador
function validateName(name) {
  if (name.length && name.length < 200) {
    return true;
  }
}

// Validar el email del organizador
function validateEmail(email) {
  if (email.length > 100) {
    return false;
  }

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Validar el celular del organizador (campo opcional)
function validateNumeroChileno(phone) {
  const regex = /^\+569\.\d{8}$/;
  if (regex.test(phone)) {
    return true;
  } else if (phone === "") {
    return true;
  } else {
    return false;
  }
}

// Validar que se marcan máximo 5 redes sociales
function validateRedesSociales() {
  let count = 0;
  checkboxesRedes.forEach((checkbox) => {
    if (checkbox.checked) {
      count++;
    }
  });
  return count <= 5;
}

// Validar que el nombre de usuario de cada red social tenga entre 4 y 50 caract.
function validateInputRedesSociales(redSocial) {
  if (redSocial.length >= 4 && redSocial.length <= 50) return true;
  else return false;
}

// Validar que, si hay una fecha de término, que esta sea posterior a la de inicio
function validateFechas() {
  let fechaInicio = new Date(inicioInput.value);
  let fechaTermino = new Date(terminoInput.value);

  if (terminoInput.value === "") {
    return true;
  } else if (fechaInicio <= fechaTermino) {
    return true;
  } else {
    return false;
  }
}

// Validar que se seleccione al menos un tema
function validateTema() {
  const checkboxes = document.querySelectorAll('input[name="tema"]');
  isChecked = false;
  otherIsChecked = false;
  isFilled = false;

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      isChecked = true;
    }
  });

  const otherCheckbox = document.querySelector(
    'input[type="checkbox"][name="tema"][value="otro"]'
  );
  if (otherCheckbox.checked) {
    otherIsChecked = true;
    if (otroInput.value.length < 3 || otroInput.value.length > 15) {
      isFilled = false;
    } else {
      isFilled = true;
    }
  } else {
    otherIsChecked = false;
  }
  if (otherIsChecked && isFilled) isChecked = true;
  return isChecked && otherIsChecked && isFilled;
}

// Validar las selecciones múltiples
function validateSelect(select) {
  if (select.value === "") return false;
  else return true;
}

// Validar las fotos que se están adjuntando (entre 1-5)
function validateFiles() {
  const fileInput = document.querySelector('input[type="file"][name="fotos"]');
  const files = fileInput.files;

  // Validación del número de archivos
  cantidadArchivos = true;
  if (files.length < 1 || files.length > 5) {
    cantidadArchivos = false;
  }

  // Validación del tipo de archivo
  tipoArchivos = true;
  for (const file of files) {
    // El tipo de archivo debe ser "image/<foo>" o "application/pdf"
    const fileType = file.type;
    if (fileType.split("/")[0] !== "image" && fileType !== "application/pdf") {
      tipoArchivos = false;
      break;
    }
  }

  return cantidadArchivos && tipoArchivos;
}

// Validar que si es que hay un sector, que este tenga máximo 100 caracteres
function updateSectorValidation() {
  if (!validateSector(sectorInput.value)) {
    addErrorMessage("Sector demasiado largo (máximo 100 carácteres).", "sector");
    errorStyling(sectorInput, true);
  } else {
    removeErrorMessageById("name");
    errorStyling(sectorInput, false);
  }
}

// Validación del nombre del organizador
function updateNameValidation() {
  if (!validateName(nameInput.value)) {
    if (nameInput.value.length === 0) {
      addErrorMessage("Nombre obligatorio", "name");
    } else {
      addErrorMessage("Nombre demasiado largo (máximo 200 caracteres).", "name");
    }
    errorStyling(nameInput, true);
  } else {
    removeErrorMessageById("name");
    errorStyling(nameInput, false);
  }
}

// Validación del mail del organizador
function updateEmailValidation() {
  if (!validateEmail(emailInput.value)) {
    if (emailInput.value.length > 100) {
      addErrorMessage("Email demasiado largo (máximo 100 caracteres).", "email");
    } else {
      addErrorMessage("Email inválido", "email");
    }
    errorStyling(emailInput, true);
  } else {
    removeErrorMessageById("email");
    errorStyling(emailInput, false);
  }
}

// Validación del numero del organizador
function updatePhoneValidation() {
  if (!validateNumeroChileno(phoneInput.value)) {
    addErrorMessage("Número inválido.", "phone");
    errorStyling(phoneInput, true);
  } else {
    removeErrorMessageById("phone");
    errorStyling(phoneInput, false);
  }
}

// Validacion fecha termino
function updateFechaValidation() {
  if (!validateFechas()) {
    addErrorMessage("Fecha de término inválida.", "fecha");
    errorStyling(terminoInput, true);
  } else {
    removeErrorMessageById("fecha");
    errorStyling(terminoInput, false);
  }
}

function updateSelectValidation() {
  if (!validateSelect(seleccionRegion)) {
    addErrorMessage("Debe seleccionar una región.", "selectRegion");
    errorStyling(seleccionRegion, true);
  } else {
    removeErrorMessageById("selectRegion");
    errorStyling(seleccionRegion, false);
  }
  if (!validateSelect(seleccionComuna)) {
    addErrorMessage("Debe seleccionar una comuna.", "selectComuna");
    errorStyling(seleccionComuna, true);
  } else {
    removeErrorMessageById("selectComuna");
    errorStyling(seleccionComuna, false);
  }
}

function updateTemaValidation() {
  validateTema();
  if (otherIsChecked) {
    if (!isFilled) {
      addErrorMessage(
        "Por favor, especifique un tema válido (3-15 caracteres).",
        "otroTema"
      );
      errorStyling(otroInput, true);
    } else {
      removeErrorMessageById("otroTema");
      errorStyling(otroInput, false);
    }
  } else if (!isChecked && !otherIsChecked) {
    addErrorMessage("Por favor, seleccione al menos un tema.", "tema");
  } else {
    removeErrorMessageById("tema");
    removeErrorMessageById("otroTema");
    errorStyling(otroInput, false);
  }
}

function updateRedesSocialesValidation() {
  if (!validateRedesSociales()) {
    addErrorMessage("Seleccione máximo 5 redes sociales.", "redesSociales");
  } else {
    removeErrorMessageById("redesSociales");
  }
}

function updateInputRedesSocialesValidation() {
  checkboxesRedes.forEach((checkbox) => {
    if (checkbox.checked) {
      if (checkbox.name === "otra") {
        if (!validateInputRedesSociales(redInput.value)) {
          addErrorMessage(
            "Debe ingresar una red social (mínimo 4 caracteres, máximo 20).",
            "otraRed"
          );
          errorStyling(redInput, true);
        } else {
          removeErrorMessageById("otraRed");
          errorStyling(redInput, false);
        }
        if (!validateInputRedesSociales(usuarioInput.value)) {
          addErrorMessage(
            "Debe ingresar una red social y un usuario.",
            "otraRedUsario"
          );
          errorStyling(usuarioInput, true);
        } else {
          removeErrorMessageById("otraRedUsario");
          errorStyling(usuarioInput, false);
        }
      } else {
        if (
          !validateInputRedesSociales(
            document.getElementById(checkbox.name).value
          )
        ) {
          addErrorMessage("Debe ingresar un usuario.", checkbox.name);
          errorStyling(document.getElementById(checkbox.name), true);
        } else {
          removeErrorMessageById(checkbox.name);
          errorStyling(document.getElementById(checkbox.name), false);
        }
      }
    } else {
      if (checkbox.name === "otra") {
        removeErrorMessageById("otraRed");
        removeErrorMessageById("otraRedUsario");
      } else {
        removeErrorMessageById(checkbox.name);
      }
    }
  });
}

function updateFilesValidation() {
  validateFiles();
  if (!cantidadArchivos) {
    addErrorMessage(
      "Debe adjuntar al menos 1 foto y máximo 5 fotos.",
      "cantidadArchivos"
    );
    errorStyling(document.getElementById("files"), true);
  } else {
    removeErrorMessageById("cantidadArchivos");
    errorStyling(document.getElementById("files"), false);
  }
  if (!tipoArchivos) {
    addErrorMessage("Debe subir archivos de tipo foto o PDF.", "tipoArchivos");
    errorStyling(document.getElementById("files"), true);
  } else {
    removeErrorMessageById("tipoArchivos");
    errorStyling(document.getElementById("files"), false);
  }
}