let mongoose = require("mongoose");

const productCollection = "productos";
const productosEsquema = new mongoose.Schema({
    title: String,
    description: String,
    price: String,
    thumbnail: String,
    code: String,
    stock: String
},{
    timestamps:true
});

const productoModelo = mongoose.model(
    productCollection,
    productosEsquema
);


module.exports = productoModelo;