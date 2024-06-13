"use strict";

const list = document.querySelector(".js-items");
const btnShowAll = document.querySelector(".btn-show-all");
const btnAdd = document.querySelector(".js-btn-add");
const inputSong = document.querySelector(".js-input-song");
const inputArtist = document.querySelector(".js-input-artist");
const inputCountry = document.querySelector(".js-input-country");
const confirmation = document.querySelector(".js-res-add");
const nameSignup = document.querySelector(".js-input-signup-name");
const emailSignup = document.querySelector(".js-input-signup-email");
const passSignup = document.querySelector(".js-input-signup-pass");
const btnSignup = document.querySelector(".js-btn-signup");
const confSign = document.querySelector(".js-res-sign");
const emailLogin = document.querySelector(".js-input-login-email");
const passLogin = document.querySelector(".js-input-login-pass");
const btnLogin = document.querySelector(".js-btn-login");
const confLogin = document.querySelector(".js-res-login");
const btnLogout = document.querySelector(".js-btn-logout");
const confLogout = document.querySelector(".js-res-logout");

let token = "";
//registro y login

const handleSignUp = (ev) => {
  ev.preventDefault();

  const signupValues = {
    email: emailSignup.value,
    name: nameSignup.value,
    password: passSignup.value,
  };
  fetch("http://localhost:3002/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signupValues),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        confSign.innerHTML = "Has sido registrada!";
        token = data.token;
        emailSignup.value = "";
        nameSignup.value = "";
        passSignup.value = "";
      } else {
        confSign.innerHTML = data.message;
      }
    });
};

btnSignup.addEventListener("click", handleSignUp);

const handleLogin = (ev) => {
  ev.preventDefault();

  const LoginValues = {
    email: emailLogin.value,
    password: passLogin.value,
  };
  fetch("http://localhost:3002/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(LoginValues),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        confLogin.innerHTML = "Bienvenida de nuevo <3";
        token = data.token;
        localStorage.setItem("token", token);
        emailLogin.value = "";
        passLogin.value = "";
     //   console.log(token);
        confLogout.innerHTML = data.message;
      } else {
        confSign.innerHTML = data.message;
      }
    });
};

btnLogin.addEventListener("click", handleLogin);

//función para que pinte la lista de canciones relativamente bien
const renderList = (arr) => {
  let html = "";
  arr.forEach((item) => {
    html += `<p>${JSON.stringify(item)}</p>`;
  });
  list.innerHTML = html;
};

const fetchGetList = () => {
  fetch("http://localhost:3002/list")
    .then((response) => response.json())
    .then((data) => {
      if (data.success === false) {
        list.innerHTML = "Error al conectarse con la base de datos.";
      }
      const tempArray = data.results;
      renderList(tempArray);
    });
};
const handleClick = (ev) => {
  ev.preventDefault();
  fetchGetList();
};

btnShowAll.addEventListener("click", handleClick);

const handleAdd = (ev) => {
  ev.preventDefault();
  const songValue = inputSong.value;
  const artistValue = inputArtist.value;
  const countryValue = inputCountry.value;

  const bodyParams = {
    songName: songValue,
    name: artistValue,
    country: countryValue,
  };

  fetch("http://localhost:3002/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(bodyParams),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        confirmation.innerHTML = data.message;
        fetchGetList();
        inputSong.value = "";
        inputArtist.value = "";
        inputCountry.value = "";
      }else{
        confirmation.innerHTML = "Ups, algo ha ido mal...";
      }
    });
};

btnAdd.addEventListener("click", handleAdd);


const handleLogout = (ev) =>{
    ev.preventDefault();

    fetch("http://localhost:3002/user/logout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
            confLogin.innerHTML = "";
          confLogout.innerHTML = data.message;
          if (data.success) {
            localStorage.removeItem("token"); // Eliminar el token del almacenamiento local
            token = ""; // Limpiar la variable token
          }
        });
    };

btnLogout.addEventListener("click", handleLogout);