"use strict";

const list = document.querySelector(".js-items");
const btnShowAll = document.querySelector(".btn-show-all");

//para pintar la respuesta del server.get /list

//función pa que lo pinte relativamente bien
const renderList = (arr) => {
    let html = '';
    arr.forEach((item) => {
      html += `<p>${JSON.stringify(item)}</p>`;
    });
    list.innerHTML = html;
};

const handleClick = (ev) => {
  ev.preventDefault();
  fetch("http://localhost:3002/list")
    .then((response) => response.json())
    .then((data) => {
      const tempArray = data.results;
      renderList(tempArray);
    });
};

btnShowAll.addEventListener("click", handleClick);
