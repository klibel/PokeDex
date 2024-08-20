const listPokemon = document.querySelector('#list__pokemon');
const btns = document.querySelectorAll('.btn');
const btnTodos = document.querySelector('#todos')
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

  let pokemonId = pokemon.id.toString();
  if (pokemonId.length === 1) {
    pokemonId = "00" + pokemonId;
  } else if (pokemonId.length === 2) {
    pokemonId = "0" + pokemonId;
  }

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
        <p class="altura">${pokemon.height}m</p>
        <p class="peso">${pokemon.weight}Kg</p>
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

    let pokemonId = pokemon.id.toString();
    if (pokemonId.length === 1) {
      pokemonId = "00" + pokemonId;
    } else if (pokemonId.length === 2) {
      pokemonId = "0" + pokemonId;
    }

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
          <p class="altura">${pokemon.height}m</p>
          <p class="peso">${pokemon.weight}Kg</p>
        </div>
      </div>			
    `;

    listPokemon.appendChild(div);
  });
}

