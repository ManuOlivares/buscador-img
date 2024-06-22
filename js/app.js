const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

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

    buscarImagenes(terminoBusqueda);

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
function buscarImagenes(termino){
    const key = '44529819-cd7cfbfe87af3268b595645f8';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}`;

    //console.log(url);
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => {
        //console.log(resultado.hits)
        mostrarImagenes(resultado.hits)
    })
}

function mostrarImagenes(imagenes) {
    console.log(imagenes);
}