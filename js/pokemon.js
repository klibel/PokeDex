const main = document.querySelector('.main');
const infoPokemon = JSON.parse(localStorage.getItem('infoPokemon'));

document.addEventListener('DOMContentLoaded', e => {
  mostCard(); // Llama a la función mostCard después de que el DOM esté cargado
});

function mostCard() {
  const { imagen, nombre, number, tipe, height, weight } = infoPokemon;

  // Separar los tipos
  const tiposSeparados = tipe.split(', '); 

  // Asignar tipos a variables
  const tipo1 = tiposSeparados[0] || ''; 
  const tipo2 = tiposSeparados[1] || ''; 

  const div = document.createElement('div');
  div.classList.add('card');
  div.innerHTML =
  `
  <div class="cardImg">
    <img src="${imagen}" alt="${nombre}">
  </div>
  <div class="info__card">
    <h1>${nombre}</h1>
    <div class="tipePokemon">
      <p id="${tipo1}">${tipo1}</p><p id="${tipo2}">${tipo2}</p>
    </div>
    <div class="tipe-pokemon"><strong>Number:</strong> ${number} </div>
    <div class="tipe-pokemon"><strong>Type:</strong><div class="tipes"><p>${tipo1}</p> <p>${tipo2}</p></div></div>
    <div class="tipe-pokemon"><strong>altura:</strong> ${height} </div>
    <div class="tipe-pokemon"><strong>peso:</strong> ${weight} </div>
  </div>
  <button id="volver">VOLVER</button>
  `;

  main.appendChild(div);

  // Mueve el evento aquí, después de que el botón ha sido creado
  const btnVolver = document.querySelector('#volver');
  btnVolver.addEventListener('click', e => {
    localStorage.clear();
    history.back();
  });
}




