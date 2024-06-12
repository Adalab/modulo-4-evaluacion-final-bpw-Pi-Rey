"use strict";

const list = document.querySelector(".js-items");
const btnShowAll = document.querySelector(".btn-show-all");
const btnAdd = document.querySelector(".js-btn-add");
const inputSong = document.querySelector(".js-input-song");
const inputArtist = document.querySelector(".js-input-artist");
const inputCountry = document.querySelector(".js-input-country");
const confirmation = document.querySelector(".js-res-add");

//para pintar la respuesta del server.get /list

//función pa que lo pinte relativamente bien
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
    },
    body: JSON.stringify(bodyParams),
  })
    .then((response) => response.json())
    .then((data) => {
      confirmation.innerHTML = data.message;
      if (data.success) {
        fetchGetList();
      }
    });
    
};

btnAdd.addEventListener("click", handleAdd);
