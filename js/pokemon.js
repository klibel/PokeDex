const main = document.querySelector('.main');
const infoPokemon = JSON.parse(localStorage.getItem('infoPokemon'));

document.addEventListener('DOMContentLoaded', () => {
  if (infoPokemon) {
    mostCard();
  } else {
    window.location.href = 'index.html'; // Redirección de seguridad si no hay datos
  }
});

function mostCard() {
  const { imagen, nombre, number, tipe, height, weight } = infoPokemon;

  // Separar los tipos de manera limpia
  const tiposSeparados = tipe.split(', '); 
  const tipo1 = tiposSeparados[0] || ''; 
  const tipo2 = tiposSeparados[1] || ''; 

  // Generar los bloques HTML de los tipos solo si existen
  const htmlTipo1 = tipo1 ? `<span class="badge-type" id="${tipo1.toLowerCase()}">${tipo1}</span>` : '';
  const htmlTipo2 = tipo2 ? `<span class="badge-type" id="${tipo2.toLowerCase()}">${tipo2}</span>` : '';

  const div = document.createElement('div');
  div.classList.add('card');
  div.innerHTML = `
    <div class="cardImg">
      <p class="pokemon-number-bg">#${number.replace('#', '')}</p>
      <img src="${imagen}" alt="${nombre}">
    </div>
    
    <div class="info__card">
      <div class="card__header">
        <span class="pokemon-id-tag">${number}</span>
        <h1>${nombre}</h1>
        <div class="tipePokemon">
          ${htmlTipo1} ${htmlTipo2}
        </div>
      </div>
      
      <div class="card__body">
        <div class="data-row">
          <span class="data-label">Altura:</span>
          <span class="data-value">${height}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Peso:</span>
          <span class="data-value">${weight}</span>
        </div>
      </div>
      
      <button id="volver">← Volver al mapa</button>
    </div>
  `;

  main.appendChild(div);

  const btnVolver = document.querySelector('#volver');
  btnVolver.addEventListener('click', () => {
    localStorage.removeItem('infoPokemon'); // Elimina solo la info del pokémon
    history.back();
  });
}



