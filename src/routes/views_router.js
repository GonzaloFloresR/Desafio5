const Router = require("express").Router;
const router = Router();
const productManager = require("../dao/ProductManagerMONGO.js");
const { isValidObjectId } = require("mongoose");
const ProductManager = new productManager();

router.get("/chat", (req, res) =>{
    datos = {   title:"Bienvenido a mi Chat - Hecho con WebSocket 2024 GFR",
                    nombre:"Gonzalo",
                    description:`Utilización de plantillas Handlebars y websocket
                    para crear mi primer Chat Online - Curso de BankEnd de CoderHouse`,
                    keywords:"Chat, WebSocket, Plantillas, handlebars, JS, Coderhouse, Cursos BackEnd",
                    author:"Gonzalo Flores"
                }
    res.setHeader("Content-Type","text/html");
    return res.status(200).render("chat",{datos});
});

router.get("/home", async(req, res) => {
    let {id} = req.query;
    let productos;
        try { 
            productos = await ProductManager.getProducts();
        } catch(error){ 
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`Error inesperado en el servidor`});
        }
    if(!id){
        datos = {   
            title:"Página de Productos",
            description:"Lista de productos",
            keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
            author:"Gonzalo Flores"
        };
        res.setHeader("Content-Type","text/html");
        return res.status(200).render("home",{productos, datos});
    } 
    else {
        if(!isValidObjectId(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:"Ingrese un ID Valido para MongoDB"});
        } else {
            datos = {   
            title:"Página de Producto seleccionado",
            description:"Producto seleccionado por el ID",
            keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
            author:"Gonzalo Flores"
            };
            let producto;
            try {
                producto = await ProductManager.getProductBy({_id:id});
            } 
            catch (error){
                console.log(error);
                res.setHeader('Content-Type','application/json');
                return res.status(500).json({error:`Error inesperado en el servidor`});
            }
            res.setHeader("Content-Type","text/html");
            return res.status(200).render("home",{producto, datos, id});
        }
        
    }
});

router.get("/realtimeproducts", async(req, res) => {
    datos = {   title:"Bienvenido a mi primera plantilla Handlebars 2024 JS",
                nombre:"Gonzalo",
                description:"Utilización de plantillas Handlebars en el curso de bankEnd de CoderHouse",
                keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
                author:"Gonzalo Flores"
    }
    let productos;
    try { 
        productos = await ProductManager.getProducts();
        res.setHeader("Content-Type","text/html");
        return res.status(200).render("realTimeProducts",{productos, datos});
    } catch(error){ 
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor`});
    }
});

module.exports = router;