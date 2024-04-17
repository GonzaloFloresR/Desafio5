/* let lista = document.getElementById("lista");

if(lista){
    fetch("http://localhost:8080/api/products")
        .then(data => data.json())
        .then(data => {
            
            data.forEach(element => {
                let {id,title,description,price,thumbnail,code,stock} = element;
                lista.innerHTML += `<ul>
                                        <li><h3> ${title} <h3></li>
                                        <li> ${description} </li>
                                        <li>$ ${price} </li>
                                        <li><img src=${thumbnail} alt=${description} width="250" > </li>
                                        <li>Código ${code} </li>
                                        <li>Stock Actual ${stock} </li>
                                        <li><button class="comprar" data-id="${id}">Agregar al carrito</button></li>
                                    </ul>`;
            });
        }); 
} */