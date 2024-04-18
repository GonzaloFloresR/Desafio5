const Router = require("express").Router;
const router = Router();

const path = require("path");
const ProductManager = require("../classes/ProductManager.js");
const rutaProductos = path.join(__dirname,`../data/productos.json`); //esta es la ruta conflictiva

const uploader = require("../utils.js");

const entorno = async () => {

    const producto = new ProductManager(rutaProductos);
    try{
        await producto.inicializar();
    }
    catch(error){
        console.log(error.message);
        return
    }

    router.get("/", (request, response) => {
        let productos;
        try { 
            productos = producto.getProducts();
        } catch(error){ 
            console.log(error);
            return
        }
        
        let datos = productos;

        let limit = request.query.limit;
        if(limit){
            limit = Number(limit);
        if(!(isNaN(limit))){
            if (limit > 0){
                datos = datos.slice(0,limit);
            }
        } else {
            response.setHeader('Content-Type','application/json');
            response.status(400).json({error:"Los limites deben ser numericos"});
        }
        }
        
        response.setHeader('Content-Type','application/json');
        response.status(200).json(datos);
        
    });
    // -------------------------------------------------------------------------------------------
    router.get("/:pid",(request, response) => {
        let productos;
        try { 
            productos = producto.getProducts();
        } catch(error){ 
            console.lot(error);
            return
        }
    
        let pid = request.params.pid;
        pid = Number(pid);
        if(isNaN(pid)){
            response.json({error:"Ingrese un ID numérico"});
        } else {
            let producto = productos.find(p => p.id === pid);
            if(producto){
                response.json(producto);
            } else {
                response.json({error:`No existen productos con el ID ${pid}`});
            }
        }
    });
    
    router.post("/",uploader.single('thumbnail'),async (request, response) => {
        
        let {title,description,price,thumbnail,code,stock} = request.body; //Recordemos que el request.body el json que enviara el usuario al momento de hacer la petición
        if (request.file){
            thumbnail = request.file.path;
        }
        if(!title || !description || !price || !code || !stock){
            response.setHeader('Content-Type','application/json');
            return response.status(400).json({status:"error", error:"valores requeridos title, description, price, code, stock) 🛑"});
        } else {
                let agregado = await producto.addProduct(title,description,price,thumbnail,code,stock);
                if(agregado){

                    let productos;
                    try { 
                            productos = producto.getProducts();
                        } catch(error){ 
                            console.log(error);
                            return
                        }
                        const MaxIdFunc = (array) => {
                            return array.reduce((maxId, objeto) => { // Utilizar el método reduce para encontrar el último id
                                return objeto.id > maxId ? objeto.id : maxId;
                            }, 0); // Iniciar con un valor muy bajo para asegurar que cualquier id sea mayor
                        }
                        const MaxId = MaxIdFunc(productos);
                        let NewProduct = producto.getProductById(MaxId);
                    request.io.emit("NuevoProducto", NewProduct);
                    
                    response.setHeader('Content-Type','application/json');
                    //response.status(201).json({status:"succes", message:"Producto Agregado correctamente ✅"});
                    response.redirect(302, '/home');
                } else {
                    response.setHeader('Content-Type','application/json');
                    response.status(400).json({status:"error", message:"El producto no se pudo agregar"})
                }
        }
    });

    router.put("/:pid", async(request, response) => {

        let {title,description,price,thumbnail,code,stock} = request.body; //Recordemos que el request.body el json que enviara el usuario al momento de hacer la petición
        //Debería verificar que al menos modifique una propiedad.
        let pid = request.params.pid;
        if(!pid){
            response.setHeader('Content-Type','application/json');
            response.status(400).json({error:`Debe ingresar el ID del producto a modificar`});
        } else {
            pid = Number(pid);
            if(isNaN(pid)){
                response.setHeader('Content-Type','application/json');
                response.status(400).json({error:"Ingrese un ID numérico"});
            } else {
                //busco si existe producto con ese ID
                let produc = await producto.getProductById(pid);
                if(produc){
                    //modifico el producto
                    let modificado = await producto.updateProduct(pid, {title,description,price,thumbnail,code,stock});
                    if(modificado){
                        response.setHeader('Content-Type','application/json');
                        response.status(200).json({status:"succes", message:`Usuario con ID ${pid} modificado`});
                    } else {
                        response.setHeader('Content-Type','application/json');
                        response.status(500).json({error:`Error al intentar actualizar el producto ${pid}`});
                    }
                } else {
                    response.setHeader('Content-Type','application/json');
                    response.status(400).json({error:`No existe un producto con el ID ${pid}`});
                }
            }
        }
    });

    router.delete("/:pid", async (request, response) => {
        let pid = request.params.pid;
        if(!pid){
            response.setHeader('Content-Type','application/json');
            response.status(400).json({error:`Debe ingresar el ID del producto a eliminar 🛑`});
        } else {
            pid = Number(pid);
            if(isNaN(pid)){
                response.setHeader('Content-Type','application/json');
                response.status(400).json({error:"Ingrese un ID numérico 🛑"});
            } else {
                let produc = await producto.getProductById(pid);
                if(produc){
                    let borrado = await producto.deleteProduct(pid);
                    if(borrado){
                        request.io.emit("ProductoEliminado", pid);
                        response.setHeader('Content-Type','application/json');
                        response.status(200).json({status:"succes", message:`Producto con ID ${pid} Eliminado ✅`});
                    } else {
                        response.setHeader('Content-Type','application/json');
                        response.status(500).json({error:`Error al intentar elimimnar el producto ${pid} ❌`});
                    }
                } else {
                    response.setHeader('Content-Type','application/json');
                    response.status(400).json({error:`No existen producto con el ID ${pid} 🛑`});
                }
            }
        }
    });


//Cerrando entorno()
}

entorno();

module.exports = {router};