const serverURL = "http://localhost:3000/";
const itemsPath = "rooms/";

// Obtener los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const roomType = urlParams.get("room_type");

const list = document.querySelector(".room-list");

function getData() {
  // Obtener los valores de las fechas de los inputs
  const checkInDate = document.getElementById("checkin").value;
  const checkOutDate = document.getElementById("checkout").value;

  // Validar que las fechas estén seleccionadas
  if (!checkInDate || !checkOutDate) {
    swal.fire({
      title: "Error",
      text: "Debe seleccionar las fechas de entrada y salida",
      icon: "error",
    });
    return;
  }

  if (new Date(checkInDate) > new Date(checkOutDate)) {
    swal.fire({
      title: "Error",
      text: "La fecha de entrada no puede ser posterior a la fecha de salida",
      icon: "error",
    });
    return;
  }

  // Construir la URL con los parámetros de consulta
  const queryParams = new URLSearchParams({
    check_in_date: checkInDate,
    check_out_date: checkOutDate,
  });

  const fetchURL = `${serverURL}${itemsPath}${roomType}?${queryParams.toString()}`;

  // showSpinner();

  fetch(fetchURL)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Received data:", data);
      // setTimeout(() => {
      // }, 1000);

      Message("Cargando habitaciones disponibles...", 3000, data.rooms);
    })
    .catch((error) =>
      Message("Cargando habitaciones disponibles...", 3000, [])
    );
}

function printData(rooms) {
  list.innerHTML = ""; // Limpiar la lista antes de mostrar los resultados

  rooms.forEach((item) => {
    list.innerHTML += createDomElement(item);
  });
}

// function hiddeData() {
//   list.innerHTML = "No hay habitaciones disponibles para esas fechas";
//   list.classList.add("no-rooms");
// }
function hiddeData() {
  // Inserta un archivo SVG externo en el elemento de la lista
  list.innerHTML = `<img src="/img/nodata.svg" alt="No hay habitaciones disponibles">`;
  list.classList.add("no-rooms");
}

function createDomElement(item) {
  const color = item.available > 0 ? "green" : "red";
  const buttonDisabled = item.available > 0 ? "" : "disabled";

  const roomNumber = encodeURIComponent(item.room_number);
  const pricePerNight = encodeURIComponent(item.price_per_night);
  const roomType = item.room_type;
  const maxGuests = encodeURIComponent(item.max_guests);
  const roomId = item.room_id;
  const imgUrl = item.image_url;
  const checkInDate = document.getElementById("checkin").value;
  const checkOutDate = document.getElementById("checkout").value;

  const itemHtml = `
  

  <li>
      <div class="room-details">
          <img src="${imgUrl}" alt="Imagen de la habitación">
          <div class="info">
              <h3>${roomId} ${roomType}</h3>
              <p><i class="fas fa-bed icon"></i>Habitación #${roomNumber}</p>
              <p><i class="fas fa-users icon"></i>${maxGuests}</p>
              <br>
              <br>
              <br>
              <a href="details.html" class="details-link">Detalles de la habitación</a>
          </div>
          <div class="price">
              <p class="aumentar">${pricePerNight} HNL</p>
              <p class="diminuto">per nigth</p>
              <p class="diminuto">Con impuesto incluido</p>
              <div class="button-container">
                  <a href="payments.html?room_number=${roomNumber}&price_per_night=${pricePerNight}&room_type=${roomType}&max_guests=${maxGuests}&room_id=${roomId}&check_in_date=${checkInDate}&check_out_date=${checkOutDate}" class="button" type="submit">Seleccionar</a>
              </div>
          </div>
      </div>
  </li>
  `;

  return itemHtml;
}

// Spinner para mostrar al usuario que se están procesando los datos
function showSpinner() {
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("hidden");

  // Simula un proceso de pago de 3 segundos antes de ocultar el spinner
  setTimeout(() => {
    spinner.classList.add("hidden");
  }, 1000); // Cambia el tiempo según sea necesario
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
        if (data && data.length > 0) {
          printData(data);
        } else {
          hiddeData();
        }
      }
    });
}
