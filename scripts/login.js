const serverURL = "http://localhost:3000";
const itemsPath = "/users/login";

function verificarUsuario() {
  const usuario = document.getElementById("email").value;
  const contra = document.getElementById("password").value;

  if (usuario === "" || contra === "") {
    swal.fire("Error", "Debe ingresar los datos", "error");
    return false;
  }

  const login = {
    email: usuario, // Asegúrate de que coincida con el nombre de campo en tu base de datos
    password_hash: contra, // Lo mismo aquí
  };

  fetch(`${serverURL}${itemsPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login),
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          // Credenciales inválidas
          throw new Error("Usuario o contraseña incorrecta");
        } else {
          // Otro error
          throw new Error("Error en la respuesta del servidor");
        }
      }
      return res.json();
    })
    .then((data) => {
      //   swal.fire("Éxito", data.message, "success");
      if (data.message === "Inicio de sesión exitoso") {
        const user = data.user;
        // Ocultar el enlace de inicio de sesión

        swal.fire("Éxito", "Logueado correctamente", "success").then(() => {
          // Ocultar el formulario de login
          document.getElementById("form-container").style.display = "none";

          // Mostrar el mensaje de bienvenida
          document.getElementById("welcome-message").style.display = "block";
          document.getElementById("mensajeBienvenida").textContent =
            "Bienvenido, " + user.first_name + " " + user.last_name + "!";
        });
      } else {
        swal.fire("Error", "Usuario o contraseña incorrecta", "error");
        console.log("Contraseña o usuario incorrecta");
      }
    })
    .catch((error) => {
      swal.fire("Error", error.message, "error");
    });
}
