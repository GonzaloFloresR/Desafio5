const Router = require("express").Router;
const router = Router();
const path = require("path");
const rutaProductos = path.join(__dirname,`../data/productos.json`);

const productManager = require("../classes/ProductManager");
const { query } = require("express");
const ProductManager = new productManager(rutaProductos);

router.get("/inicio", (req, res) =>{
    datos = {   title:"Bienvenido a mi primera plantilla Handlebars 2024 JS",
                    nombre:"Gonzalo",
                    description:"Utilización de plantillas Handlebars en el curso de bankEnd de CoderHouse",
                    keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
                    author:"Gonzalo Flores"
                }
    res.setHeader("Content-Type","text/html");
    res.status(200).render("index",{datos});
});

router.get("/home", (req, res) =>{
    let {id} = req.query;
    let productos;
        try { 
            productos = ProductManager.getProducts();
        } catch(error){ 
            console.log(error);
            res.setHeader('Content-Type','application/json');
            res.status(500).json({error:`Error inesperado en el servidor`});
        }

    if(!id){

        datos = {   title:"Página de Productos",
        description:"Lista de productos",
        keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
        author:"Gonzalo Flores"
        }

        res.setHeader("Content-Type","text/html");
        res.status(200).render("home",{productos, datos});
    } else {
        id = Number(id);
        if(isNaN(id)){  res.setHeader("Content-Type","application/json");
                        res.status(401).json({error:"Ingrese un ID numérico"});
        }

        datos = {   title:"Página de Producto seleccionado",
        description:"Producto seleccionado por el ID",
        keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
        author:"Gonzalo Flores"
    }
                    let producto;
                    try {
                        producto = ProductManager.getProductById(id);
                    } catch (error){
                        console.log(error);
                        res.setHeader('Content-Type','application/json');
                        res.status(500).json({error:`Error inesperado en el servidor`});
                    }
        
        
        res.setHeader("Content-Type","text/html");
        res.status(200).render("home",{producto, datos, id});
    }
});

router.get("/realtimeproducts", (req, res) =>{
    datos = {   title:"Bienvenido a mi primera plantilla Handlebars 2024 JS",
                    nombre:"Gonzalo",
                    description:"Utilización de plantillas Handlebars en el curso de bankEnd de CoderHouse",
                    keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
                    author:"Gonzalo Flores"
    }

    let productos;
    try { 
        productos = ProductManager.getProducts();
    } catch(error){ 
        console.log(error);
        res.setHeader('Content-Type','application/json');
        res.status(500).json({error:`Error inesperado en el servidor`});
    }
            
                
    res.setHeader("Content-Type","text/html");
    res.status(200).render("realTimeProducts",{productos, datos});
});



module.exports = router;