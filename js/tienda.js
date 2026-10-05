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

// PASO 11: Vista rápida del producto (modal)
const modalProductoElement = document.getElementById('modalProducto');
const modalProductoTitulo = document.getElementById('modalProductoTitulo');
const modalImagen = document.getElementById('modalImagen');
const modalPrecio = document.getElementById('modalPrecio');
const modalDescripcion = document.getElementById('modalDescripcion');
const modalColor = document.getElementById('modalColor');
const btnModalAgregar = document.getElementById('btnModalAgregar');

let productoEnModal = null;

// Escuchar cuando el modal está a punto de abrirse
modalProductoElement.addEventListener('show.bs.modal', (evento) => {
  // El botón (ojo) que abrió el modal
  const botonOjo = evento.relatedTarget;
  
  // Extraer los datos guardados en los atributos data-*
  const nombre = botonOjo.getAttribute('data-nombre');
  const precio = Number(botonOjo.getAttribute('data-precio'));
  const imagen = botonOjo.getAttribute('data-imagen');
  const descripcion = botonOjo.getAttribute('data-descripcion');
  
  // Guardar el producto temporalmente
  productoEnModal = { nombre, precio };
  
  // Llenar el contenido visual del modal
  modalProductoTitulo.textContent = nombre;
  modalImagen.src = imagen;
  modalImagen.alt = nombre;
  modalDescripcion.textContent = descripcion;
  modalPrecio.textContent = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio);
});

// Cuando hacen clic en el botón "Agregar" dentro del modal
btnModalAgregar.addEventListener('click', () => {
  if (productoEnModal) {
    const colorElegido = modalColor.value;
    // Guardamos el nombre sumándole el color
    const nombreConColor = `${productoEnModal.nombre} (${colorElegido})`;
    
    // 1. Agregamos al carrito
    carrito.push({ nombre: nombreConColor, precio: productoEnModal.precio });
    
    // 2. Avisamos a toda la página que hay cambios (actualiza total y lista)
    const eventoCambio = new CustomEvent('carrito:cambio');
    document.dispatchEvent(eventoCambio);
    
    // 3. Mostramos el Toast de que se agregó
    avisoProductoNombre.textContent = nombreConColor;
    const toast = bootstrap.Toast.getOrCreateInstance(avisoCarrito);
    toast.show();
    
    // 4. Cerramos el modal
    const modalInstance = bootstrap.Modal.getInstance(modalProductoElement);
    modalInstance.hide();
  }
});

// PASO 14: Validación del formulario de suscripción
const formSuscripcion = document.getElementById('formSuscripcion');

formSuscripcion.addEventListener('submit', (evento) => {
  // Evitar que la página se recargue
  evento.preventDefault();

  // Activar los estilos de validación de Bootstrap
  formSuscripcion.classList.add('was-validated');

  // Revisar si todos los campos son válidos
  if (!formSuscripcion.checkValidity()) {
    return; // Si hay errores, detener aquí
  }

  // Si todo está bien: mostrar aviso de gracias
  avisoProductoNombre.textContent = '¡Gracias por suscribirte a TechZone!';
  const toast = bootstrap.Toast.getOrCreateInstance(avisoCarrito);
  toast.show();

  // Limpiar el formulario y quitar los estilos de validación
  formSuscripcion.reset();
  formSuscripcion.classList.remove('was-validated');
});
