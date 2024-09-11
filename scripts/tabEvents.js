// Obtén todos los elementos necesarios
const tabs = document.querySelectorAll(".tab");
const tabPanes = document.querySelectorAll(".tab-pane");

// Función para cambiar de pestaña
function switchTab(tabId) {
  tabs.forEach((tab) => tab.classList.remove("active"));
  document
    .querySelector(`a[href="${tabId}"]`)
    .parentNode.classList.add("active");

  tabPanes.forEach((pane) => pane.classList.remove("active"));
  document.querySelector(tabId).classList.add("active");
}

// Función de validación y cambio de pestaña para un formulario
function setupTabNavigation(formId, nextTabId, buttonId) {
  const form = document.querySelector(`#${formId}`);
  const button = document.querySelector(`#${buttonId}`);

  button.addEventListener("click", (e) => {
    e.preventDefault();

    // Validar campos del formulario
    const inputs = form.querySelectorAll("input, select, textarea");
    let valid = true;

    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        // Solo validamos si el checkbox/radio está marcado
        if (!input.checked) {
          valid = false;
        }
      } else if (input.value.trim() === "") {
        valid = false;
        // Puedes agregar un mensaje de error aquí
      }
    });

    if (valid) {
      switchTab(nextTabId);
    } else {
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todos los campos",
        icon: "error",
      });
    }
  });
}

// Configura la navegación para cada pestaña
setupTabNavigation("form-datos-cliente", "#detalle-reserva", "guardar-datos");
setupTabNavigation("form-metodo-pago", "#confirmacion", "pagar"); // Este botón y formulario no están en tu HTML actual

// Configura los botones que no están en formularios
document.querySelector("#siguiente-detalle").addEventListener("click", (e) => {
  e.preventDefault();
  switchTab("#datos-cliente"); // Asegúrate de que esta es la pestaña correcta para mostrar
});
