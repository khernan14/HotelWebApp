const serverURL = "http://localhost:3000/";
const itemsPath = "events/";

function waitForDOM() {
  const event_name = document.getElementById("event_name");
  const description = document.getElementById("description");
  const event_date = document.getElementById("event_date");
  const price_per_person = document.getElementById("price_per_person");
  const number_for_attendees = document.getElementById("number_for_attendees");

  const event_name_Element = document.getElementById("event-name-display");
  const event_date_Element = document.getElementById("event-date-display");
  const price_per_person_Element = document.getElementById(
    "price-person-display"
  );
  const number_for_attendees_element = document.getElementById(
    "number-attendees-display"
  );
  const description_Element = document.getElementById("description-display");

  event_name_Element.textContent = event_name.value;
  event_date_Element.textContent = event_date.value;
  price_per_person_Element.textContent = price_per_person
    ? `HNL ${price_per_person.value}`
    : "No disponible";
  number_for_attendees_element.textContent = number_for_attendees.value;
  description_Element.textContent = description.value;
}

function validateEventDetails() {
  const event_name = document.getElementById("event_name").value.trim();
  const description = document.getElementById("description").value.trim();
  const event_date = document.getElementById("event_date").value.trim();
  const price_per_person = document
    .getElementById("price_per_person")
    .value.trim();
  const number_for_attendees = document
    .getElementById("number_for_attendees")
    .value.trim();

  if (
    !event_name ||
    !description ||
    !event_date ||
    !price_per_person ||
    !number_for_attendees
  ) {
    Swal.fire({
      title: "Campos Vacíos",
      text: "Por favor, completa todos los campos obligatorios.",
      icon: "error",
    });
    return false;
  }

  return true;
}

function insertEvents() {
  if (!validateEventDetails()) {
    return; // Detener la ejecución si hay campos vacíos
  }

  const completeName = document.getElementById("nombre").value;
  const telephone = document.getElementById("telefono").value;
  const email = document.getElementById("correo").value;
  const event_name = document.getElementById("event_name").value;
  const description = document.getElementById("description").value;
  const event_date = document.getElementById("event_date").value;
  const price_per_person = document.getElementById("price_per_person").value;
  const number_of_attendees = document.getElementById(
    "number_for_attendees"
  ).value;
  const reservation_status = "Pendiente";

  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Quieres agregar este evento?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Agregar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario acepta, enviar los datos al backend
      fetch(serverURL + itemsPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_name,
          description,
          event_date,
          price_per_person,
          completeName,
          email,
          telephone,
          number_of_attendees,
          reservation_status,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error al insertar los datos");
          }
          return res.json(); // Convertir la respuesta a JSON
        })
        .then((data) => {
          console.log("Datos guardados correctamente:", data);
          Message("Enviando la solicitud de reserva", 3000, data);
        })
        .catch((error) => {
          console.error("Error al guardar el evento:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo agregar el evento",
            icon: "error",
          });
        });
    } else {
      Swal.fire({
        title: "Cancelado",
        text: "El evento no ha sido agregado",
        icon: "info",
      }).then(() => {
        // Reiniciar la pantalla de agregar eventos
        window.location.reload();
      });
    }
  });
}

function Message(title, timer, data) {
  let timerInterval;
  swal
    .fire({
      title: title,
      timer: timer, // Tiempo en milisegundos
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    })
    .then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("El temporizador ha cerrado la alerta.");
        // Verificar si hay datos disponibles
        Swal.fire({
          title: "Reserva exitosa",
          text: "Se ha realizado la reserva con éxito",
          icon: "success",
        }).then(() => {
          window.location.href = "index.html"; // Redirigir después de éxito
        });
      }
    });
}
