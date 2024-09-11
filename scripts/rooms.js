const serverURL = "http://localhost:3000/";
const itemsPath = "rooms/";

window.onload = getData;

const rooms_grid = document.querySelector(".rooms-grid");
console.log("rooms-grid: ", rooms_grid);

function getData() {
  fetch(`${serverURL}${itemsPath}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Received data:", data); // Verifica la estructura de los datos
      printData(data.rooms); // Accede a la propiedad `rooms` que es un array
    })
    .catch((error) =>
      console.error(
        "There has been a problem with your fetch operation:",
        error
      )
    );
}

function printData(rooms) {
  rooms.forEach((item) => {
    if (item.available > 0) {
      rooms_grid.innerHTML += createDomElement(item);
    }
  });
}

function createDomElement(item) {
  const itemHtml = `
        <div class="room-card">
          <img src="${item.image_url}" alt="Image_url">
          <div class="room-info">
            <h3>${item.room_type}</h3>
            <p>${item.description}</p>
            <a href="roomsReservations.html?room_type=${encodeURIComponent(
              item.room_type
            )}  " class="button"><i class="fas fa-calendar-alt"></i> Reservar</a>
          </div>
        </div>`;

  return itemHtml;
}
