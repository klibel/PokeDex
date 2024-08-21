const listPokemon = document.querySelector('#list__pokemon');
const btns = document.querySelectorAll('.btn');
const btnTodos = document.querySelector('#todos')
const main = document.querySelector('.main');
let URL = "https://pokeapi.co/api/v2/pokemon/";
let pokemons = []; 

for (let i = 1; i <= 250; i++) {
  fetch(URL + i)
    .then((response) => response.json())
    .then(data => {
      insertPokemonHtml(data);
      pokemons.push(data);
    });
}

function insertPokemonHtml(pokemon) {
  let tipe = pokemon.types.map((type) => `<p class="tipe" id="${type.type.name}">${type.type.name}</p>`);
  tipe = tipe.join('');

  let pokemonId = pokemon.id.toString().padStart(3, '0');

  // Convertir altura y peso
  let altura = (pokemon.height / 10).toFixed(1).replace('.', ','); // Convertir a metros y formatear
  let peso = (pokemon.weight / 10).toFixed(1).replace('.', ','); // Convertir a kilogramos y formatear

  const div = document.createElement('div');
  div.classList.add('pokemon-card');
  div.innerHTML = 
  `
    <p class="pokemos-id-back">#${pokemonId}</p>
    <div class="img-pokemon">
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
    </div>
    <div class="pokemon-info">
      <div class="name-contenedor">
        <p class="pokemon-id">#${pokemonId}</p>
        <h2 class="name-pokemon">${pokemon.name}</h2>
      </div>
      <div class="tipe-pokemon">
        ${tipe}
      </div>
      <div class="pokemon-stats">
        <p class="altura">${altura} m</p>
        <p class="peso">${peso} kg</p>
      </div>
    </div>			
  `;

  listPokemon.appendChild(div);
}

btns.forEach(boton => {
  boton.addEventListener('click', (e) => {
    const tipoBoton = e.target.id; 
    const pokemonsFiltrados = pokemons.filter(pokemon => 
      pokemon.types.some(type => type.type.name === tipoBoton)
    );

    btnFilterPokemon(pokemonsFiltrados);
  });
});

btnTodos.addEventListener('click', () => {
  listPokemon.innerHTML = '';
  pokemons.forEach(insertPokemonHtml);
});

function btnFilterPokemon(pokemons) {
  // Limpia la lista de Pokémon antes de mostrar los filtrados
  listPokemon.innerHTML = '';

  pokemons.forEach(pokemon => {
  let tipe = pokemon.types.map((type) => `<p class="tipe" id="${type.type.name}">${type.type.name}</p>`);
  tipe = tipe.join('');

  let pokemonId = pokemon.id.toString().padStart(3, '0');

  // Convertir altura y peso
  let altura = (pokemon.height / 10).toFixed(1).replace('.', ','); // Convertir a metros y formatear
  let peso = (pokemon.weight / 10).toFixed(1).replace('.', ','); // Convertir a kilogramos y formatear

  const div = document.createElement('div');
  div.classList.add('pokemon-card');
  div.innerHTML = 
  `
    <p class="pokemos-id-back">#${pokemonId}</p>
    <div class="img-pokemon">
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
    </div>
    <div class="pokemon-info">
      <div class="name-contenedor">
        <p class="pokemon-id">#${pokemonId}</p>
        <h2 class="name-pokemon">${pokemon.name}</h2>
      </div>
      <div class="tipe-pokemon">
        ${tipe}
      </div>
      <div class="pokemon-stats">
        <p class="altura">${altura} m</p>
        <p class="peso">${peso} kg</p>
      </div>
    </div>			
  `;

  listPokemon.appendChild(div);
  });
}

listPokemon.addEventListener('click', e => {
  const card = e.target.closest('.pokemon-card');
  if (card) {
    transferInformation(card);
  }
});

function transferInformation(pokemon) {
  const imagen = pokemon.querySelector('img').src;
  const nombre = pokemon.querySelector('h2').textContent;
  const number = pokemon.querySelector('.pokemon-id').textContent;
  const tipe = Array.from(pokemon.querySelectorAll('.tipe')).map(t => t.textContent).join(', ');
  const height = pokemon.querySelector('.altura').textContent;
  const weight = pokemon.querySelector('.peso').textContent;

  const infoPokemon = {
    imagen: imagen,
    nombre: nombre,
    number: number,
    tipe: tipe,
    height: height,
    weight: weight
  };

  localStorage.setItem('infoPokemon', JSON.stringify(infoPokemon));
  window.location.href = "pokemon.html";
}




