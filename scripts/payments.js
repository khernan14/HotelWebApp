const serverURL = "http://localhost:3000/";
const itemsPath = "bookings/";

// Obtener los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const roomType = urlParams.get("room_type");
const roomNumber = urlParams.get("room_number");
const pricePerNight = urlParams.get("price_per_night");
const roomId = urlParams.get("room_id");
const checkInDate = urlParams.get("check_in_date");
const checkOutDate = urlParams.get("check_out_date");

// Esperar a que el DOM se cargue
function waitForDOM() {
  const roomNumberElement = document.getElementById("room-number");
  const pricePerNightElement = document.getElementById("price-per-night");
  const checkInDisplayElement = document.getElementById("checkin-display");
  const checkOutDisplayElement = document.getElementById("checkout-display");
  const roomTypeElement = document.getElementById("room-type");

  // Asignar los valores a los elementos
  roomNumberElement.textContent = roomNumber || "No disponible";
  pricePerNightElement.textContent = pricePerNight
    ? `HNL ${pricePerNight}`
    : "No disponible";
  checkInDisplayElement.textContent = checkInDate || "No seleccionado";
  checkOutDisplayElement.textContent = checkOutDate || "No seleccionado";
  roomTypeElement.textContent = roomType || "No disponible";
  console.log(calculateTotal());

  // totalAmountElement.textContent = totalAmount
  //   ? $${totalAmount}
  //   : "No disponible";
}

function calculateTotal() {
  // Obtener los valores del precio por noche y las fechas
  const pricePerNight = parseFloat(urlParams.get("price_per_night"));
  const checkInDate = new Date(urlParams.get("check_in_date"));
  const checkOutDate = new Date(urlParams.get("check_out_date"));

  // Verificar que las fechas sean válidas
  if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
    // Calcular la diferencia en días
    const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convertir de milisegundos a días

    // Calcular el total
    const totalAmount = pricePerNight * differenceInDays;

    // Mostrar el total en el campo correspondiente
    document.getElementById("total").textContent = totalAmount
      ? `$${totalAmount.toFixed(2)}`
      : "No disponible";

    return totalAmount.toFixed(2); // Retornar el valor calculado
  } else {
    document.getElementById("total").textContent = "No disponible";
    return null; // Retornar null si no hay un cálculo válido
  }
}

// Añadir el evento de cambio a los campos de fecha para recalcular automáticamente el total
document.getElementById("checkin").addEventListener("change", calculateTotal);
document.getElementById("checkout").addEventListener("change", calculateTotal);

function validatePaymentDetails() {
  const tarjeta = document.getElementById("tarjeta").value.trim();
  const fechaVencimiento = document
    .getElementById("fecha-vencimiento")
    .value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  if (!tarjeta || !fechaVencimiento || !cvv) {
    Swal.fire({
      title: "Campos Vacíos",
      text: "Por favor, completa todos los campos obligatorios.",
      icon: "error",
    });
    return false;
  }
  return true;
}

function insertBookings() {
  if (!validatePaymentDetails()) {
    return; // Detener la ejecución si hay campos vacíos
  }

  const name = document.getElementById("nombre").value;
  const telephone = document.getElementById("telefono").value;
  const email = document.getElementById("correo").value;
  const checkInElement = document.getElementById("checkin-display").value;
  const checkOutElement = document.getElementById("checkout-display").value;

  Swal.fire({
    title: "Confirmación de Reserva",
    text: "¿Estás seguro de que deseas guardar los datos de la reserva?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario acepta, proceder con la solicitud de guardar los datos
      fetch(`${serverURL}${itemsPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: roomId,
          completeName: name,
          telephone: telephone,
          email: email,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          total_price: parseFloat(pricePerNight),
          amount: parseFloat(calculateTotal()), // Asegúrate de que calculateTotal() devuelva un número
          payment_method: "Tarjeta de crédito",
          event_reservation_id: null,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error al insertar los datos");
          }
          return res.json(); // Convertir la respuesta a JSON
        })
        .then((data) => {
          console.log("Datos insertados:", data);
          // Manejar la respuesta del servidor

          // Simular un proceso de pago de 3 segundos para mostrar el mensaje de éxito
          // showSpinner();
          Message("Realizando la transacción", 3000, data);
        })
        .catch((error) => {
          console.error("Error al insertar los datos:", error.message);
          console.error(error);
          Swal.fire({
            title: "Error",
            text: "No se pudo guardar la reserva",
            icon: "error",
          });
        });
    } else {
      // Si el usuario cancela, redirigir a la pestaña de datos del cliente
      Swal.fire({
        title: "Cancelado",
        text: "La reserva ha sido cancelada",
        icon: "info",
      }).then(() => {
        // Aquí podrías redirigir o realizar alguna acción
        // Por ejemplo, podrías redirigir a la pestaña de datos del cliente
        window.location.reload(); // Ajusta según sea necesario
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

// // Spinner para mostrar al usuario que se están procesando los datos
// function showSpinner() {
//   const spinner = document.getElementById("spinner");
//   spinner.classList.remove("hidden");

//   // Simula un proceso de pago de 3 segundos antes de ocultar el spinner
//   setTimeout(() => {
//     spinner.classList.add("hidden");
//     Swal.fire({
//       title: "Reserva exitosa",
//       text: "Se ha realizado la reserva con éxito",
//       icon: "success",
//     }).then(() => {
//       window.location.href = "index.html"; // Redirigir después de éxito
//     });
//   }, 4000); // Cambia el tiempo según sea necesario
// }
