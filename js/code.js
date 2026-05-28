const listPokemon = document.querySelector('#list__pokemon');
const btns = document.querySelectorAll('.btn:not(#btnLoadMore)'); 
const btnTodos = document.querySelector('#todos');
const btnLoadMore = document.querySelector('#btnLoadMore');

const URL_API = "https://pokeapi.co/api/v2/pokemon/";
const URL_TYPE = "https://pokeapi.co/api/v2/type/"; // Nuevo endpoint para tipos

let pokemons = []; 
let offset = 0;
const limit = 20;
let tipoActual = "todos"; 

// Cargar los primeros 20 al iniciar
document.addEventListener('DOMContentLoaded', () => {
  fetchPokemonPage(limit, offset);
  setupMobileMenu();
});

// Manejador del botón "Cargar más" (Solo funciona en la pestaña "Todos")
btnLoadMore.addEventListener('click', () => {
  if (tipoActual === "todos") {
    offset += limit;
    fetchPokemonPage(limit, offset);
  }
});

// 1. Petición paginada eficiente (Para la pestaña "Todos")
async function fetchPokemonPage(limit, offset) {
  try {
    const response = await fetch(`${URL_API}?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    
    const pokemonDetails = await Promise.all(
      data.results.map(async (p) => {
        const res = await fetch(p.url);
        return await res.json();
      })
    );
    
    pokemonDetails.forEach(pokemon => {
      if (pokemon && pokemon.types && !pokemons.some(p => p.id === pokemon.id)) {
        pokemons.push(pokemon);
      }
      insertPokemonHtml(pokemon);
    });
  } catch (error) {
    console.error("Error cargando los Pokémon:", error);
  }
}

// 2. NUEVA FUNCIÓN: Filtración Real desde la API
async function fetchPokemonByType(type) {
  try {
    listPokemon.innerHTML = '<p class="loading-msj" style="color: white; text-align: center; grid-column: 1/-1;">Buscando Pokémon...</p>';
    
    // Pedimos a la API todos los Pokémon de ese tipo específico
    const response = await fetch(`${URL_TYPE}${type}`);
    const data = await response.json();
    
    // La estructura de la API cambia aquí: los pokémon vienen dentro de data.pokemon
    // Tomamos los primeros 40 de ese tipo para no saturar si hay demasiados (ej. Agua tiene +150)
    const pokemonList = data.pokemon.slice(0, 40); 
    
    const pokemonDetails = await Promise.all(
      pokemonList.map(async (p) => {
        const res = await fetch(p.pokemon.url);
        return await res.json();
      })
    );
    
    // Limpiamos el mensaje de carga y renderizamos
    listPokemon.innerHTML = '';
    
    // Ordenar numéricamente por ID para que se vea organizado
    pokemonDetails.sort((a, b) => a.id - b.id).forEach(pokemon => {
      insertPokemonHtml(pokemon);
    });

  } catch (error) {
    console.error(`Error cargando Pokémon de tipo ${type}:`, error);
    listPokemon.innerHTML = '<p style="color: red; text-align: center; grid-column: 1/-1;">Error al cargar este tipo.</p>';
  }
}

// 3. Generador de tarjetas único
function insertPokemonHtml(pokemon) {
  if (!pokemon || !pokemon.types) return;

  let tipe = pokemon.types.map((type) => `<p class="tipe" id="${type.type.name}">${type.type.name}</p>`).join('');
  let pokemonId = pokemon.id.toString().padStart(3, '0');

  let altura = (pokemon.height / 10).toFixed(1).replace('.', ',');
  let peso = (pokemon.weight / 10).toFixed(1).replace('.', ',');

  const div = document.createElement('div');
  div.classList.add('pokemon-card');
  div.innerHTML = `
    <p class="pokemos-id-back">#${pokemonId}</p>
    <div class="img-pokemon">
      <img src="${pokemon.sprites.other["official-artwork"].front_default || ''}" alt="${pokemon.name}">
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

// 4. Controladores de Eventos para los Botones de Filtro
btns.forEach(boton => {
  boton.addEventListener('click', (e) => {
    tipoActual = e.target.id; 
    
    if (tipoActual === "todos") {
      restaurarTodos();
      return;
    }

    // Al filtrar por tipo, ocultamos el botón de cargar más ya que traemos el bloque completo directo de su categoría
    btnLoadMore.style.display = 'none';
    fetchPokemonByType(tipoActual);
  });
});

btnTodos.addEventListener('click', restaurarTodos);

function restaurarTodos() {
  tipoActual = "todos";
  btnLoadMore.style.display = 'inline-block';
  listPokemon.innerHTML = '';
  // Mostramos lo que ya teníamos guardado en memoria de la paginación principal
  pokemons.sort((a, b) => a.id - b.id).forEach(insertPokemonHtml);
}

// 5. Lógica del Menú Móvil
function setupMobileMenu() {
  const btnOpen = document.getElementById('btnOpen');
  const ulList = document.getElementById('boxBtns');

  if(btnOpen && ulList) {
    btnOpen.addEventListener('click', () => {
        ulList.classList.toggle('ul__list--visible');
        if (ulList.classList.contains('ul__list--visible')) {
            btnOpen.querySelector('.menu-icon').textContent = '✕';
        } else {
            btnOpen.querySelector('.menu-icon').textContent = '☰';
        }
    });
  }
}

// 6. Redirección y transferencia de información
listPokemon.addEventListener('click', e => {
  const card = e.target.closest('.pokemon-card');
  if (card) {
    transferInformation(card);
  }
});

function transferInformation(pokemon) {
  const infoPokemon = {
    imagen: pokemon.querySelector('img').src,
    nombre: pokemon.querySelector('h2').textContent,
    number: pokemon.querySelector('.pokemon-id').textContent,
    tipe: Array.from(pokemon.querySelectorAll('.tipe')).map(t => t.textContent).join(', '),
    height: pokemon.querySelector('.altura').textContent,
    weight: pokemon.querySelector('.peso').textContent
  };

  localStorage.setItem('infoPokemon', JSON.stringify(infoPokemon));
  window.location.href = "pokemon.html";
}