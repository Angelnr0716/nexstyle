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
