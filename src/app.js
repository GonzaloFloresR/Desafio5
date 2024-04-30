const express = require("express");
const mongoose = require("mongoose");
const path=require('path');
const engine = require("express-handlebars").engine;
const {Server} = require("socket.io"); 

const {router:productsRouter} = require("./routes/products_routers.js");
const cartRouter = require("./routes/carts_router.js");
const vistaRouter = require("./routes/views_router.js");

const PORT = 8080;
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(express.static(__dirname+'/public'));

//Estoy agregando un middleware literal en flecha y enviando io al products_routers
app.use("/api/products/", (req, res, next) => { req.io = io;
                                                next();
                                            } ,productsRouter); 
app.use("/api/carts/", cartRouter);
app.use("/", vistaRouter);


const serverHTTP = app.listen(PORT, () => console.log(`Server online en puerto ${PORT}`)); 
const io = new Server(serverHTTP);

io.on("connection", socket => {
    console.log(`Se conecto un cliente con el ID ${socket.id}`);

    socket.emit("Saludo", "Bienvenido, identificate");

    socket.on("id", nombre => {
        console.log(`El cliente con id ${socket.id} se identifico con el nombre ${nombre}`);
        
        socket.broadcast.emit("nuevoUsuario", nombre );
    });

    socket.on("NuevoMensaje", (nombre, mensaje)=>{
        io.emit("mensaje", nombre, mensaje);
    });

});

const connDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://gonzalof:Coder098@cluster0.pt1wq7n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {dbName:"IwasIn"});
    console.log("DB MONGO ONLINE");
    } catch (error) {
        console.log("Error al conectar a la DB", error.message)
    }
} 
connDB();