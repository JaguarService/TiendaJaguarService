// variable que mantiene el estdo visible del carrito
var carritoVisible = false;

//esperamos que todos los elementos de la pagina se carguen para continuar con el script
if (document.readyState=='loading'){
    document.addEventListener('DOMContentLoaded',ready)
}else{
    ready();
}


function ready(){
    //agregamos fincionalidad a los botones eliminar de carrito
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for(var i=0; i < botonesEliminarItem.length;i++){
        var button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    //agrego funcionalidad al boton sumar
    var botonesSumarCantiad = document.getElementsByClassName('sumar-cantidad');
    for(var i=0; i < botonesSumarCantiad.length;i++){
        var button = botonesSumarCantiad[i];
        button.addEventListener('click', sumarCantiad);
    }

    //agrego funcionalidad al boton restar cantidad
    var botonesRestarCantiad = document.getElementsByClassName('restar-cantidad');
    for(var i=0; i < botonesRestarCantiad.length;i++){
        var button = botonesRestarCantiad[i];
        button.addEventListener('click', restarCantiad);
    } 

    //agregar funcionalidad a los botones agregar al carrito
    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for(var i=0; i<botonesAgregarAlCarrito.length;i++){
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    //agregar funcionalidad al boton pagar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click',pagarClicked)
}

//elimino el item seleccionado del carrito
function eliminarItemCarrito(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();

    //actualizamos el total del carrito una vez que hemos eliminado un item
    actualizarTotalCarrito();

    //la siguiente funcion controla si hay elementos en el carrito una vez que se eliminan
    //si no hay debo ocultar el carrito
    ocultarCarrito();
}

//actualiza el total del carrito
function actualizarTotalCarrito(){
    //seleccionamos el contenedor carrito
   var carritoContenedor = document.getElementsByClassName('carrito')[0];
   var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
   var total = 0;

   //recorremos cada elemento del carrito para actualizar el total
   for(var i=0; i < carritoItems.length;i++){
    var item = carritoItems[i];
    var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
    console.log(precioElemento);
    //quitamos el simbolo peso el punto del milesimo
    var precio = parseFloat(precioElemento.innerText.replace('$','').replace(',','').replace('USD',''));
    console.log(precio);
    var cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
    var cantidad = cantidadItem.value;
    console.log(cantidad);
    total = total + (precio * cantidad);
   }
   total = Math.round(total*100)/100;
   document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ' USD';
}

function ocultarCarrito(){
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if(carritoItems.childElementCount==0){
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity='0';
        carritoVisible = false;

        //ahora maximizo el contenedor de los elementos
        var items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}
    
//aumento la cantidad en uno del elemento seleccionado
function sumarCantiad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    console.log(cantidadActual);
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    //actualizamos el total
    actualizarTotalCarrito();
}
   
function restarCantiad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    console.log(cantidadActual);
    cantidadActual--;

    //controlamos que no sea menor que 1
    if(cantidadActual>=1){
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        //actualizamos el total
        actualizarTotalCarrito();
    }
}

function agregarAlCarritoClicked(event){
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    console.log(titulo);
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;
    console.log(imagenSrc);

    //la siguiente funcion agrega el elemento al carrito le madno pr paramentros los valores
    agregarItemAlCarrito(titulo, precio, imagenSrc);

    //hacemos visible el carrito cuando agrega por primera vez
    hacerVisibleCarrito();
}

function agregarItemAlCarrito(titulo, precio, imagenSrc){
    var item = document.createElement('div');
    item.classList.add = 'item';
    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    //vamos a controlar que el item que esta ingresando no se encuentra ya en el carrito
    var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for(var i=0; i < nombresItemsCarrito.length;i++){
        if(nombresItemsCarrito[i].innerText==titulo){
            alert("El producto ya se encuentra añadido");
            return;
        }
    }

    var itemCarritoContenido = `        
    <div class="carrito-item">
        <img src="${imagenSrc}" alt="" width="80px">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i>
                <input id="holaB" type="text" value="1" class="carrito-item-cantidad" disabled>
                <i class="fa-solid fa-plus sumar-cantidad"></i>
            </div>
            <span class="carrito-item-precio">${precio}</span>
        </div>
        <span class="btn-eliminar">
            <i class="fa-solid fa-trash"></i>
        </span>
    </div>
    `
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    //funcionalidad de eliminar del nuevo item
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click',eliminarItemCarrito);

    //funcionalidad de sumar nuevo item
    var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click',sumarCantiad);

    //funcionalidad de restar nuevo item
    var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click',restarCantiad);

    //actualizar carrito
    actualizarTotalCarrito();

}



function hacerVisibleCarrito(){
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}


function pagarClicked(event) {

    copiarAlPortapapeles();
  
  }


  function pagarClicked(event) {
    // seleccionamos el contenedor carrito
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var texto = "COMPRA JAGUAR SERVICE​\n\n";
  
    // recorremos cada elemento del carrito para agregarlo al texto
  
    for (var i = 0; i < carritoItems.length; i++) {
      var item = carritoItems[i];
      var titulo = item.getElementsByClassName('carrito-item-titulo')[0].innerText;
      var precio = item.getElementsByClassName('carrito-item-precio')[0].innerText;
      var cantidad = item.getElementsByClassName('carrito-item-cantidad')[0].value;
      var subtotal = parseFloat(precio.replace('$', '').replace(',', '').replace('USD', '')) * cantidad;
      texto += `${titulo} x ${cantidad} - ${precio} - Subtotal: $${subtotal.toLocaleString("es")} USD\n`;
    }
    texto += "\n"; // agregar línea en blanco aquí
    var total = document.getElementsByClassName('carrito-precio-total')[0].innerText;
    texto += `Total: ${total}\n`;
  
  
    // copiamos el texto al portapapeles
    navigator.clipboard.writeText(texto).then(() => {
      console.log("Texto copiado al portapapeles");
     // alert("Gracias por su compra, su pedido a sido copiado al portapales, ya puede enviarselo a nuestros agentes para que marcos cobre su porciento");
  
      // eliminamos los elementos del carrito
  
      var carritoItems = document.getElementsByClassName('carrito-items')[0];
      while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild);
      }
  
  
      actualizarTotalCarrito();
      ocultarCarrito();
  
  
      // redirigimos a final.html
      window.location.href = 'final.html?texto=' + encodeURIComponent(texto);
    }).catch((error) => {
      console.error("Error al copiar al portapapeles:", error);
    });
  }

