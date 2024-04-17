
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


