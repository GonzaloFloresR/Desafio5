const socket = io();
/* 
let nombre = prompt("Ingrese su nombre");
const bloque = document.getElementById("bloque");
*/
socket.on("Saludo", texto => {

    console.log(texto);
/*  bloque.innerHTML = `<h2>${texto}</h2>`;
    if(nombre){
        socket.emit("id", nombre);
    }  */

});

/* 
socket.on("nuevoUsuario", nombre => {
    console.log(`${nombre} se ha unido al servidor`);
});

const decir = (texto) => {
    socket.emit("NuevoMensaje", nombre, texto);
}
    
socket.on("mensaje", (nombre, mensaje) => {
    console.log(`${nombre} envio el siguiente mensaje: ${mensaje} `);
}); 
*/

const divProductos = document.getElementById("productos");
socket.on("NuevoProducto", NewProduct => {
    divProductos.innerHTML += ` <ul data-id=${NewProduct._id}>
                                    <li><h3> ${NewProduct.title}<h3></li>
                                    <li> ${NewProduct.description} </li>
                                    <li>$ ${NewProduct.price} </li>
                                    <li><img src=${NewProduct.thumbnail} alt=${NewProduct.description} width="250" > </li>
                                    <li>Código ${NewProduct.code} </li>
                                    <li>Stock Actual ${NewProduct.stock} </li>
                                    <li><button class="comprar" data-id=${NewProduct._id} onclick="Agregar()" >Agregar al carrito</button></li>
                                </ul>`;
});

socket.on("ProductoEliminado", pid => {
    let lista = document.getElementById("productos");
    let productoEliminar =lista.querySelector("ul[data-id='"+pid+"']");
    if(productoEliminar){
        productoEliminar.remove();
    }
});

function handleClick(event) {
    const dataId = event.target.getAttribute('data-id'); // Obtener el valor del atributo data-id
    console.log('Hiciste clic en el botón con data-id:', dataId);
    // Aquí puedes realizar las acciones que desees con el botón seleccionado
}

  // Seleccionar todos los botones con atributo data-id
const botones = document.querySelectorAll('button[data-id]');

  // Agregar un event listener a cada botón
botones.forEach(function(boton) {
    boton.addEventListener('click', handleClick);
});


