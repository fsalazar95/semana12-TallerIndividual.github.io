  let peliculas = [];

  // Cargar las películas al cargar la página pero sin mostrarlas
  window.onload = async () => {
    try {
      const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
      peliculas = await response.json();
    } catch (error) {
      console.error('Error al cargar las películas:', error);
    }
  };

  const btnBuscar = document.getElementById('btnBuscar')
  // Función para buscar películas
  btnBuscar.addEventListener('click', () => {
    const query = document.getElementById('inputBuscar').value.toLowerCase();
    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    if (query) {
        const peliculasFiltradas = peliculas.filter(pelicula =>
            pelicula.title.toLowerCase().includes(query) ||
            pelicula.genres.some(g => String(g).toLowerCase().includes(query)) ||  // Asegurarse de que 'g' es string
            pelicula.tagline.toLowerCase().includes(query) ||
            pelicula.overview.toLowerCase().includes(query)
        );

        peliculasFiltradas.forEach(pelicula => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'bg-dark', 'text-light');
            listItem.innerHTML = `
              <h5>${pelicula.title}</h5>
              <p>${pelicula.tagline}</p>
              <p>${crearEstrellas(pelicula.vote_average)}</p>
            `;
            listItem.addEventListener('click', () => mostrarDetallesPelicula(pelicula));
            lista.appendChild(listItem);
        });
    }
  });

  // Función para mostrar los detalles de la película seleccionada
  function mostrarDetallesPelicula(pelicula) {
    document.getElementById('tituloPelicula').innerText = pelicula.title;
    document.getElementById('overviewPelicula').innerText = pelicula.overview;
    
    const genresList = document.getElementById('genresPelicula');
    genresList.innerHTML = '';
    pelicula.genres.forEach(genero => {
      const li = document.createElement('li');
      li.innerText = genero.name;  // Acceder al nombre del género
      genresList.appendChild(li);
    });

    document.getElementById('anioLanzamiento').innerText = `Año de lanzamiento: ${pelicula.release_date.split('-')[0]}`;
    document.getElementById('duracionPelicula').innerText = `Duración: ${pelicula.runtime} minutos`;
    document.getElementById('presupuestoPelicula').innerText = `Presupuesto: $${pelicula.budget.toLocaleString()}`;
    document.getElementById('gananciasPelicula').innerText = `Ganancias: $${pelicula.revenue.toLocaleString()}`;

    document.getElementById('peliculaSeleccionada').style.display = 'block';
  }

  // Función para crear estrellas basadas en el vote_average
  function crearEstrellas(voteAverage) {
    const estrellas = Math.round(voteAverage / 2);
    let estrellasHtml = '';
    for (let i = 0; i < 5; i++) {
      if (i < estrellas) {
        estrellasHtml += '<span class="fa fa-star checked"></span>';
      } else {
        estrellasHtml += '<span class="fa fa-star"></span>';
      }
    }
    return estrellasHtml;
  }