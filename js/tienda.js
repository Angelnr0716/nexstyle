// ============================================================
// tienda.js — TechZone
// Nuestro JavaScript. Se carga después de Bootstrap, por eso
// aquí ya existe el objeto «bootstrap».
// ============================================================

// PASO 8: Filtro de productos
const botonesFiltro = document.querySelectorAll('.btn-filtro-tech');
const columnasProductos = document.querySelectorAll('[data-categoria]');

botonesFiltro.forEach(boton => {
  boton.addEventListener('click', () => {
    // 1. Quitar la clase active de todos los botones
    botonesFiltro.forEach(b => b.classList.remove('active'));
    // 2. Ponérsela solo al botón al que se le hizo clic
    boton.classList.add('active');

    // 3. Leer qué filtro eligió el usuario ("todos", "celulares", etc.)
    const filtro = boton.getAttribute('data-filtro');

    // 4. Mostrar u ocultar productos usando la clase d-none de Bootstrap
    columnasProductos.forEach(producto => {
      const categoria = producto.getAttribute('data-categoria');
      if (filtro === 'todos' || filtro === categoria) {
        producto.classList.remove('d-none'); // Lo muestra
      } else {
        producto.classList.add('d-none');    // Lo oculta
      }
    });
  });
});

// PASO 9: Agregar al carrito y aviso (toast)
const carrito = [];
const contadorCarrito = document.getElementById('contadorCarrito');
const botonesAgregar = document.querySelectorAll('.btn-agregar');
const avisoCarrito = document.getElementById('avisoCarrito');
const avisoProductoNombre = document.getElementById('avisoProductoNombre');

// Función para actualizar el número rojo
function actualizarContador() {
  contadorCarrito.textContent = carrito.length;
}

// Escuchamos nuestro evento personalizado
document.addEventListener('carrito:cambio', actualizarContador);

botonesAgregar.forEach(boton => {
  boton.addEventListener('click', () => {
    // 1. Leer los datos del producto del botón
    const nombre = boton.getAttribute('data-nombre');
    const precio = Number(boton.getAttribute('data-precio'));

    // 2. Guardarlo en el arreglo
    carrito.push({ nombre, precio });

    // 3. Avisar a toda la página que el carrito cambió
    const eventoCambio = new CustomEvent('carrito:cambio');
    document.dispatchEvent(eventoCambio);

    // 4. Mostrar el aviso (Toast)
    avisoProductoNombre.textContent = nombre;
    const toast = bootstrap.Toast.getOrCreateInstance(avisoCarrito);
    toast.show();
  });
});

// PASO 10: Panel del carrito (offcanvas)
const listaCarrito = document.getElementById('listaCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');
const panelCarrito = document.getElementById('panelCarrito');

function pintarCarrito() {
  listaCarrito.innerHTML = '';
  
  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<li class="list-group-item text-center text-body-secondary py-4">Tu carrito está vacío.</li>';
    btnFinalizarCompra.disabled = true;
    totalCarrito.textContent = '$0';
    return;
  }
  
  btnFinalizarCompra.disabled = false;
  let total = 0;
  
  carrito.forEach((producto, indice) => {
    total += producto.precio;
    
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center px-0';
    
    const divNombre = document.createElement('div');
    divNombre.textContent = producto.nombre;
    
    const divPrecioCerrar = document.createElement('div');
    divPrecioCerrar.className = 'd-flex align-items-center gap-3';
    
    const spanPrecio = document.createElement('span');
    spanPrecio.className = 'text-body-secondary';
    spanPrecio.textContent = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(producto.precio);
    
    const btnQuitar = document.createElement('button');
    btnQuitar.className = 'btn-close btn-sm';
    btnQuitar.setAttribute('aria-label', 'Quitar');
    btnQuitar.addEventListener('click', () => {
      carrito.splice(indice, 1);
      const eventoCambio = new CustomEvent('carrito:cambio');
      document.dispatchEvent(eventoCambio);
    });
    
    divPrecioCerrar.appendChild(spanPrecio);
    divPrecioCerrar.appendChild(btnQuitar);
    
    li.appendChild(divNombre);
    li.appendChild(divPrecioCerrar);
    
    listaCarrito.appendChild(li);
  });
  
  totalCarrito.textContent = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(total);
}

// Escuchar el cambio para repintar la lista
document.addEventListener('carrito:cambio', pintarCarrito);

// Botón Vaciar Carrito
btnVaciarCarrito.addEventListener('click', () => {
  carrito.length = 0; // Vacia el arreglo
  const eventoCambio = new CustomEvent('carrito:cambio');
  document.dispatchEvent(eventoCambio);
});

// Botón Finalizar Compra
btnFinalizarCompra.addEventListener('click', () => {
  carrito.length = 0; // Vaciamos para simular compra
  const eventoCambio = new CustomEvent('carrito:cambio');
  document.dispatchEvent(eventoCambio);
  
  // Cerrar el panel usando la API de Bootstrap
  const offcanvas = bootstrap.Offcanvas.getInstance(panelCarrito);
  offcanvas.hide();
  
  // Reutilizamos el Toast para agradecer la compra
  avisoProductoNombre.textContent = '¡Compra finalizada! Gracias por elegir TechZone.';
  const toast = bootstrap.Toast.getOrCreateInstance(avisoCarrito);
  toast.show();
});

// Pintar estado inicial (vacío)
pintarCarrito();
