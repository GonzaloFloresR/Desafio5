const cartsModelo = require("../dao/models/CartModel.js");

class CartsManager{

    async getCarritos(limit){
        try {
            return await cartsModelo.find().limit(limit).lean();
        }
        catch(error){
            console.log(error,"Error desde getCarritos");
        }
    }

    async crearCarrito(NuevoCarrito){
        try {
            return await cartsModelo.create(NuevoCarrito);
        }
        catch(error){
            console.log(error,"Error desde crearCarrito");
        }
    }

    async getCarritotById(cid){
        try {
            return cartsModelo.findById(cid); //{_id:cid}
        } 
        catch(error){console.log(error, "Error en el getCarritoById")}
    }

    async updateCart(cid, update){
        try {
            return await cartsModelo.findByIdAndUpdate(cid, update,{runValidators:true, returnDocument:"after"});
        }
        catch(error){
            console.log(error, "Error desde updateCart");
        }
    }

    async deleteCarrito(pid){
        try{
            return await cartsModelo.deleteOne(pid);
        }
        catch(error){
            console.log(error,"Error desde deleteProduct")
        }
    }

}
module.exports = CartsManager;