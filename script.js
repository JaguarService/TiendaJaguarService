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



        // Mostrar la etiqueta <p> con el mensaje del carrito vacío
        var mensajeCarrito = document.getElementById('mensaje-carrito');
        mensajeCarrito.style.display = 'block';
        mensajeCarrito.innerHTML = '<br><br>El carrito está vacío.<br>Valla a la tienda y agregue algún producto';
    }
}


function actualizarSubtotal(item) {
  var cantidad = item.getElementsByClassName('carrito-item-cantidad')[0].value;
  var precioUnitario = parseFloat(item.getElementsByClassName('carrito-item-precio')[0].innerText.replace('$', '').replace(',', '').replace('USD', ''));
  var subtotal = precioUnitario * cantidad;
  item.getElementsByClassName('carrito-item-subtotal')[0].innerText = '$' + subtotal.toFixed(2);
}
    

function sumarCantiad(event) {
  var buttonClicked = event.target;
  var selector = buttonClicked.parentElement;
  var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
  cantidadActual++;
  selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
  actualizarSubtotal(buttonClicked.parentElement.parentElement);
  actualizarTotalCarrito();
}

function restarCantiad(event) {
  var buttonClicked = event.target;
  var selector = buttonClicked.parentElement;
  var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
  cantidadActual--;
  if (cantidadActual >= 1) {
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarSubtotal(buttonClicked.parentElement.parentElement);
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

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
  var item = document.createElement('div');
  item.classList.add('item');
  var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

  // Vamos a controlar que el item que esta ingresando no se encuentra ya en el carrito
  var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
  for (var i = 0; i < nombresItemsCarrito.length; i++) {
    if (nombresItemsCarrito[i].innerText == titulo) {
      alert("El producto ya se encuentra añadido");
      return;
    }
  }

  var cantidad = 1;
  var precioUnitario = parseFloat(precio.replace('$', '').replace(',', '').replace('USD', ''));
  var subtotal = precioUnitario * cantidad;

  var itemCarritoContenido = `
    <div class="carrito-item">
      <img src="${imagenSrc}" alt="" width="80px">
      <div class="carrito-item-detalles">
        <span class="carrito-item-titulo">${titulo}</span>
        <span class="carrito-item-precio">${precio}</span>
        <div class="selector-cantidad">
          <i class="fa-solid fa-minus restar-cantidad"></i>
          <input id="holaB" type="text" value="${cantidad}" class="carrito-item-cantidad" disabled>
          <i class="fa-solid fa-plus sumar-cantidad"></i>
        </div>
        <span class="carrito-item-subtotal">$${subtotal.toFixed(2)}</span>
      </div>
      <span class="btn-eliminar">
        <i class="fa-solid fa-trash"></i>
      </span>
    </div>
  `;
  item.innerHTML = itemCarritoContenido;
  itemsCarrito.append(item);

  // Funcionalidad de eliminar del nuevo item
  item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

  // Funcionalidad de sumar nuevo item
  var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
  botonSumarCantidad.addEventListener('click', sumarCantiad);

  // Funcionalidad de restar nuevo item
  var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
  botonRestarCantidad.addEventListener('click', restarCantiad);

  // Actualizar carrito
  actualizarTotalCarrito();
}



function hacerVisibleCarrito(){
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';

       // Ocultar el mensaje del carrito vacío
       var mensajeCarrito = document.getElementById('mensaje-carrito');
       mensajeCarrito.style.display = 'none';
}


function pagarClicked(event) {

    copiarAlPortapapeles();
  
  }

      function pagarClicked(event) {
        // seleccionamos el contenedor carrito
        var carritoContenedor = document.getElementsByClassName('carrito')[0];
        var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
        var productos = [];
      
        // recorremos cada elemento del carrito para agregarlo al array de productos
        for (var i = 0; i < carritoItems.length; i++) {
          var item = carritoItems[i];
          var titulo = item.getElementsByClassName('carrito-item-titulo')[0].innerText;
          var precio = item.getElementsByClassName('carrito-item-precio')[0].innerText;
          var cantidad = item.getElementsByClassName('carrito-item-cantidad')[0].value;
          var subtotal = parseFloat(precio.replace('$', '').replace(',', '').replace('USD', '')) * cantidad;
      
          productos.push({
            titulo: titulo,
            precio: precio,
            cantidad: cantidad,
            subtotal: subtotal
          });
        }
      
        // convertimos el array de productos en una cadena de texto JSON
        var texto = JSON.stringify(productos);
      
        // eliminamos los elementos del carrito
        var carritoItems = document.getElementsByClassName('carrito-items')[0];
        while (carritoItems.hasChildNodes()) {
          carritoItems.removeChild(carritoItems.firstChild);
        }
      
        actualizarTotalCarrito();
        ocultarCarrito();
      
        // redirigimos a la página final.html
        window.location.href = 'final.html?texto=' + encodeURIComponent(texto);
      }


  /////////////////////////////////////LO NUEVO
  const tabs= document.querySelectorAll('.tab_btn');
  const all_content= document.querySelectorAll('.content');

  tabs.forEach((tab, index)=>{
      tab.addEventListener('click', (e)=>{
          tabs.forEach(tab=>{tab.classList.remove('active')});
          tab.classList.add('active');
          
          var line=document.querySelector('.line');
          line.style.width = e.target.offsetWidth + "px";
          line.style.left = e.target.offsetLeft + "px";

          all_content.forEach(content=>{content.classList.remove('active')});
          all_content[index].classList.add('active');
      })
  })

/////////////////////////////////////////CATEGORIAS

const btnLeft = document.querySelector(".left-btn");
const btnRight = document.querySelector(".right-btn");
const tabMenu = document.querySelector(".tab-menu");

const IconVisibility = () =>{
    let scrollLeftValue = Math.ceil(tabMenu.scrollLeft);
    //console.log("1.", scrollLeftValue);
    let scrollableWidth = tabMenu.scrollWidth - tabMenu.clientWidth;
    //console.log("2.", scrollLeftValue);


    btnLeft.style.display = scrollLeftValue > 0 ? "block" : "none";
    btnRight.style.display = scrollableWidth > scrollLeftValue ? "block" : "none";
}

btnRight.addEventListener("click", () => {
    tabMenu.scrollLeft += 100;
   // IconVisibility();
   setTimeout(() => IconVisibility(), 50);
});
btnLeft.addEventListener("click", () => {
    tabMenu.scrollLeft -= 100;
    //IconVisibility();
    setTimeout(() => IconVisibility(), 50);
});

window.onload = function(){
    btnRight.style.display = tabMenu.scrollWidth > tabMenu.clientWidth || tabMenu.scrollWidth >=tabMenu.scrollWidth >= window.innerWidth ? "block" : "none";                                        
    btnLeft.style.display = tabMenu.scrollWidth >=window.innerWidth ? "" : "none";
}

window.onresize = function(){
    btnRight.style.display = tabMenu.scrollWidth > tabMenu.clientWidth || tabMenu.scrollWidth >=tabMenu.scrollWidth >= window.innerWidth ? "block" : "none";                                        
    btnLeft.style.display = tabMenu.scrollWidth >=window.innerWidth ? "" : "none";


    let scrollLeftValue = Math.round(tabMenu.scrollLeft);

    btnLeft.style.display = scrollLeftValue > 0 ? "block" : "none";
}


const filterButtons = document.querySelectorAll(".tab-menu li");
const filterableItem = document.querySelectorAll(".contenedor-items .item");

const filterItem = e => {
    document.querySelector(".actives").classList.remove("actives");
    e.target.classList.add("actives");

    filterableItem.forEach(item => {
        item.classList.add("hide");
        if(item.dataset.name === e.target.dataset.name || e.target.dataset.name === "todos"){
            item.classList.remove("hide");
        }
    })
};


filterButtons.forEach(li => li.addEventListener("click", filterItem));



const btnLink = document.querySelector('.btnlink');
const carritoBtn = document.querySelector('.tab_btn:nth-child(2)');
const carritoContent = document.querySelector('.content:nth-child(2)');
const line = document.querySelector('.line'); // supongo que esta es la línea que quieres mover

btnLink.addEventListener('click', (e) => {
  carritoBtn.classList.add('active');
  tabs.forEach(tab => {
    if (tab!== carritoBtn) {
      tab.classList.remove('active');
    }
  });

  carritoContent.classList.add('active');
  all_content.forEach(content => {
    if (content!== carritoContent) {
      content.classList.remove('active');
    }
  });

  line.style.width = carritoBtn.offsetWidth + "px";
  line.style.left = carritoBtn.offsetLeft + "px";
});
