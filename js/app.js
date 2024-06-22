const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();
    
    const terminoBusqueda = document.querySelector('#termino').value; 

    // Validación formulario vacío: Mostrar una Alerta para el usuario
    if(terminoBusqueda === '') {
        //console.log('Agrega un termino de búsqueda');
        mostrarAlerta('Agrega un termino de búsqueda');
        return;
    }

    buscarImagenes();

}

// Función Alerta 
function mostrarAlerta(mensaje){

    //Validando si existe la alerta para evitar duplicación 
    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta){
        // Se crea un parrafo 'p' con estilos tailwins  (alerta.classlist.add(...))
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 
        'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
    
        `; 
    
        // Se agrega la alerta al formulario
        formulario.appendChild(alerta);
    
        //Mostrar alerta  por 3 segundos
        setTimeout(() => {
            alerta.remove();
    
        }, 3000);

    }


}

// Consumo API de IMAGENES  PIXABAY https://pixabay.com/api/docs/
function buscarImagenes(){

    const termino = document.querySelector('#termino').value;

    const key = '44529819-cd7cfbfe87af3268b595645f8';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page={registrosPorPagina}&page=${paginaActual}`;

    //console.log(url);
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => {
        //console.log(resultado.hits)
        totalPaginas = calcularPaginas(resultado.totalHits);
        //console.log(totalPaginas);
        mostrarImagenes(resultado.hits)
    })
}

//Generador que registra la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    for (let i = 1; i <= total; i++ ) {
        //console.log(i);
        yield i; 

    }
}


// // Cálcula el total de paginas 
function calcularPaginas(total){
    return parseInt(Math.ceil( total / registrosPorPagina )); 

    
}

function mostrarImagenes(imagenes) {
    //console.log(imagenes);
    
    //Limpiar el resultado
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Iterar sobre el arreglo de imagenes y se construye el html (Se cargan las imagenes(resultado))
    imagenes.forEach( imagen => {

        // Se utiliza destruction para extraer valores de la API y crear su variable almismo tiempo
        const { previewURL, likes, views, largeImageURL} = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">

                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light"> ❤️ </span> </p>
                        <p class="font-bold"> ${views} <span class="font-light"> vistas </span> </p>

                        <a  class=" block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                        >
                            ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        
        `;

    });

    //Limpiar el paginador
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    //Se genera un nuevo html
    imprimirPaginador();
}


function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while(true) {
        const { value, done } = iterador.next();
        if(done) return;

        // Genera un btn x cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'uppercase', 'rounded');

        boton.onclick = () => {
            paginaActual = value;

            //console.log(paginaActual);
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }

}