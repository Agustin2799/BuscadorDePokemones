document.addEventListener('DOMContentLoaded', () => {
    const pokemones = 'https://pokeapi.co/api/v2/pokemon/'
    const divInfo = document.getElementById('divInfo')
    fetch(pokemones)
        .then(response => {
            if (!response.ok) {
                alert(error);
            }
            return response.json();
        })
        .then(objeto => {
            const divContenedorImagen = document.getElementById('divContenedorImagen');
            const contenedorInfo = document.getElementById('contenedorInfo');
            const boton = document.getElementById('btnBuscar');
            const inputNombre = document.getElementById('inputNombre');
            boton.addEventListener('click', async (event) => {
                event.preventDefault(); // Evita que el formulario se envíe y la página se recargue
                try {
                    const objPokemon = await indicePokemon(objeto, inputNombre.value);

                    if (objPokemon === -1) {
                        divInfo.innerHTML = ""
                        divInfo.innerHTML = "<h3> No se ha encontrado el pokemon</h3>";
                    } else {
                        //Hace la petición para obtener el json del pokemon.
                        const respuesta = await fetch(objPokemon.url);
                        if (!respuesta.ok) {
                            throw new Error('No se pudo establecer la conexión con el servidor');
                        }
                        //Convierte al json en un obj js.
                        const infoPokemon= await respuesta.json();
                        divInfo.innerHTML = ""
                        divInfo.innerHTML = "<h3>Nombre: </h3><h4>" + objPokemon.name + "</h4>";
                        divInfo.innerHTML += "<h3>Habilidades: </h3>"
                        infoPokemon.abilities.forEach(abilities => {
                            const nombreAbility = abilities.ability.name;
                            divInfo.innerHTML += "<h4>"+nombreAbility+"</h4>"
                        });
                        divInfo.innerHTML += "<h3>Movimientos:</h3>"
                        infoPokemon.moves.forEach(moves => {
                            const nombreMove = moves.move.name;
                            divInfo.innerHTML += "<h4>" + nombreMove + "</h4>"
                        });
                        const urlImgPokemon = infoPokemon.sprites.front_default;
                        divContenedorImagen.innerHTML = "<img src='" + urlImgPokemon + "' alt='imagen pokemon'>";
                    }
                } catch (error) {
                    console.error(error);
                }

            })
        })
});
//Función que itera por los jsons y devuelve el objeto js correspondiente al nombre que se le pasa como parámetro
async function indicePokemon(objetoJs, nombrePokemon) {
    let paginaActual = objetoJs;
    //Se ejecuta mientras exista página siguiente.
    while (paginaActual.next) {
        //Itera por el objeto results de la página actual
        for (i = 0; i < paginaActual.results.length; i++) {
            if (paginaActual.results[i].name === nombrePokemon) {
                //devuelve el indice del objeto que tiene el nombre del pokemón.
                return paginaActual.results[i];
            }
        }
        //Hace la petición para pasar al siguiente json.
        const respuesta = await fetch(paginaActual.next);
        if (!respuesta.ok) {
            throw new Error('No se pudo establecer la conexión con el servidor');
        }
        //Convierte al json en un obj js.
        paginaActual = await respuesta.json();
    }
    return -1; // si no se encontró el poquemón.
};
