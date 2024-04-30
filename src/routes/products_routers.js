const Router = require("express").Router;
const router = Router();

const path = require("path");

const ProductManager = require("../dao/ProductManagerMONGO.js");


const uploader = require("../utils.js");
const { isValidObjectId } = require("mongoose");
const { BSON } = require("mongodb");

const entorno = async () => {

    const producto = new ProductManager();
    
    router.get("/", async (request, response) => {
        let productos;
        //Confirmar si existen queries
        let limit = request.query.limit;
        if(limit){
            limit = Number(limit);
            if(!(isNaN(limit))){
                if (limit > 0){
                    try {
                        productos = await producto.getProducts(limit); //agregar limite
                    } catch(error){
                        console.log(error);
                        response.setHeader('Content-Type','application/json');
                        response.status(500).json({error:"Error inesperado en el servidor - intente más tarde", detalle:`${error.message}`});
                        return
                    }
                    
                }
            } else {
                response.setHeader('Content-Type','application/json');
                response.status(400).json({error:"Los limites deben ser numericos"});
            }
        } else {
            try { 
            productos = await producto.getProducts();
            } catch(error){ 
                console.log(error);
                response.setHeader('Content-Type','application/json');
                response.status(500).json({error:"Error inesperado en el servidor - intente más tarde", detalle:`${error.message}`});
                return
            }
        }
        
        response.setHeader('Content-Type','application/json');
        response.status(200).json(productos);
        
    });
    // -------------------------------------------------------------------------------------------
    router.get("/:pid", async (request, response) => {
        let productos;
        //Verifica si existe un pid en los paramas
        let {pid} = request.params;
        /* pid = Number(pid);
        if(isNaN(pid)){
            response.json({error:"Ingrese un ID numérico"});
        } else {} */
        if(pid){
            if(!isValidObjectId(pid)){
                response.setHeader('Content-Type','application/json');
                return response.status(400).json({erro:'Ingrese un ID valido de MongoDB'})
            } else {
                try {
                    
                    pid = new BSON.ObjectId(pid);
                    productos = producto.getProductBy({_id:pid});
                    response.setHeader('Content-Type','application/json');
                    response.status(200).json(productos);
                    console.log({_id:`${pid}`}, "Desde el producto Routers");
                }
                catch(error){
                    console.log(error);
                    response.setHeader('Content-Type','application/json');
                    return response.status(500).json(
                        {
                            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                            detalle:`${error.message}`
                        }
                    );
                }
            }
            
        } else {
            try { 
                productos = await producto.getProducts();
                response.setHeader('Content-Type','application/json');
                response.status(200).json(productos);
    
            } catch(error){ 
                console.log(error);
                response.setHeader('Content-Type','application/json');
                return response.status(500).json(
                    {
                        error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                        detalle:`${error.message}`
                    }
                );
            }
        }
    
    });
    
    router.post("/", uploader.single('thumbnail'), async(request, response) => {
        //Recuperar todos los datos desde el cuerpo de la consulta
        let {title,description,price,thumbnail,code,stock} = request.body;
        //Verificar Si recibimos imagenenes
        if (request.file){
            thumbnail = request.file.path;
        }
        
        let existe;
        if(!title || !description || !price || !code || !stock){
            response.setHeader('Content-Type','application/json');
            return response.status(400).json({error:"valores requeridos title, description, price, code, stock"});

        } else {

            code = code.trim();
            try { 
                existe = await producto.getProductBy({code:code});
            }
            catch (error) {
                response.setHeader('Content-Type','application/json');
                return response.status(500).json(
                    {
                        error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                        detalle:`${error.message}`
                    }
                );
            }   

            if(!existe){ 

                if (thumbnail){
                    thumbnail = thumbnail.replace("/Applications/MAMP/htdocs/ClaseBackend/Desafio5/src/public", "..")
                }  

                let nuevoProducto = {
                        title:title,
                        description:description,
                        price:price,
                        thumbnail:thumbnail || "../img/SinImagen.png",
                        code:code,
                        stock:stock
                    };

                let agregado = await producto.addProduct(nuevoProducto);
                    console.log(agregado._id);
                if(agregado){

                    let productos;
                    try {
                        productos = await producto.getProductBy({_id:agregado._id});
                        console.log(productos, typeof productos );
                    } 
                    catch(error){ 
                        console.log(error);
                        return
                    }

                    request.io.emit("NuevoProducto", productos);
                    response.setHeader('Content-Type','application/json');
                    response.redirect(302, '/home');

                } else { //Cerrando si se agrego

                    response.setHeader('Content-Type','application/json');
                    response.status(400).json({status:"error", message:"El producto no se pudo agregar"});

                }
            } else { //Si se encuentra el "code" en la Base de datos

                response.setHeader('Content-Type','application/json');
                response.status(400).json({status:"error", message:`Codigo Repetido ${code}`});
            } //fin condición !existe
            
        } //cerrando "else" donde confirmamos recibir todos los datos del productos
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