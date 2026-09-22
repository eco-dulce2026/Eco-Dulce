// ---- Navegación entre secciones (cada botón muestra una página completa) ----
const botones = document.querySelectorAll('nav button');
const paginas = document.querySelectorAll('.page');

function irA(id){
  paginas.forEach(p => {
    if(p.id === id){
      p.classList.add('active');
      p.style.display = 'block';
    } else {
      p.classList.remove('active');
      p.style.display = 'none';
    }
  });
  botones.forEach(b => {
    b.classList.toggle('active', b.dataset.page === id);
  });
  window.scrollTo(0, 0);
  cerrarMenu();
}

paginas.forEach(p => {
  p.style.display = (p.id === 'inicio') ? 'block' : 'none';
});

botones.forEach(b => b.addEventListener('click', () => irA(b.dataset.page)));

// ---- Menú hamburguesa (mobile) ----
const hamburguesa = document.getElementById('hamburguesa');
const navPrincipal = document.getElementById('nav-principal');
const navOverlay = document.getElementById('nav-overlay');

function abrirMenu(){
  hamburguesa.classList.add('abierto');
  navPrincipal.classList.add('abierto');
  navOverlay.classList.add('abierto');
  hamburguesa.setAttribute('aria-expanded', 'true');
}
function cerrarMenu(){
  hamburguesa.classList.remove('abierto');
  navPrincipal.classList.remove('abierto');
  navOverlay.classList.remove('abierto');
  hamburguesa.setAttribute('aria-expanded', 'false');
}
if (hamburguesa) {
  hamburguesa.addEventListener('click', () => {
    const estaAbierto = navPrincipal.classList.contains('abierto');
    estaAbierto ? cerrarMenu() : abrirMenu();
  });
  navOverlay.addEventListener('click', cerrarMenu);
}

// ---- Carrusel de misiones (estilo Fortnite: avanza solo, barras de progreso) ----
// Para agregar o cambiar una misión, solo se edita esta lista.
// "imagen" en null usa el fondo degradado por defecto (definido en css/style.css).
const SLIDES = [
  {
    numero: 'ECO-DULCE',
    titulo: 'Moniquirá también siente',
    ods: null,
    texto: 'Videojuego educativo: recorre Moniquirá cumpliendo misiones para cuidar su entorno y su gente.',
    imagen: 'img/carrusel-fondo-inicio.jpg'
  },
  {
    numero: 'MISIÓN 01',
    titulo: 'Parque Simón Bolívar',
    ods: 'ODS 11',
    texto: 'El parque amanece cubierto de basura entre sus árboles. La misión de Luz es recorrerlo, recoger cada residuo y clasificarlo para devolverle su color.',
    imagen: 'img/carrusel-fondo-mision-01.jpg'
  },
  {
    numero: 'MISIÓN 02',
    titulo: 'Plaza de Mercado',
    ods: 'ODS 12',
    texto: 'La plaza principal amanece llena de bolsas rotas y basura regada. Luz debe recorrerla, recoger cada residuo y clasificarlo para devolverle su color.',
    imagen: null
  },
  {
    numero: 'MISIÓN 03',
    titulo: 'Puente Jaime Castro',
    ods: 'ODS 6',
    texto: 'El puente y el río que corre bajo él están regados de basura de un lado a otro. Luz debe recorrerlo, recoger cada residuo y clasificarlo bien.',
    imagen: null
  },
  {
    numero: 'MISIÓN 04',
    titulo: 'Fábrica de Bocadillo',
    ods: 'ODS 12',
    texto: 'Detrás de la fábrica se amontonan los residuos de la producción de bocadillo. Luz debe recogerlos y clasificarlos bien para devolverle su color.',
    imagen: null
  },
  {
    numero: 'MISIÓN 05',
    titulo: 'Moniquirá Renace',
    ods: 'ODS 4',
    texto: 'Con todo recuperado, la misión final es recorrer Moniquirá completo y disfrutar el resultado: calles limpias y un pueblo que cuida su entorno.',
    imagen: null
  }
];

const DURACION_MS = 6000; // tiempo que dura cada slide antes de avanzar sola

const carrusel = document.getElementById('carrusel');
const track = document.getElementById('track');
const barrasWrap = document.getElementById('barras');
const flechaIzq = document.getElementById('flecha-izq');
const flechaDer = document.getElementById('flecha-der');

if (carrusel && track && barrasWrap) {
  carrusel.style.setProperty('--duracion-carrusel', (DURACION_MS / 1000) + 's');

  // Genera los slides y sus barras de progreso a partir de SLIDES
  SLIDES.forEach(s => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    if (s.imagen) {
      slide.style.backgroundImage =
        `linear-gradient(135deg, rgba(10,30,25,.72), rgba(10,40,35,.55)), url('${s.imagen}')`;
    }
    slide.innerHTML = `
      <span class="num">${s.numero}</span>
      <h3>${s.titulo}</h3>
      ${s.ods ? `<span class="ods">${s.ods}</span>` : ''}
      <p>${s.texto}</p>
    `;
    track.appendChild(slide);

    const barra = document.createElement('div');
    barra.className = 'barra';
    barra.innerHTML = '<span class="barra-fill"></span>';
    barrasWrap.appendChild(barra);
  });

  const barras = document.querySelectorAll('.barra');
  let actual = 0;
  let temporizador = null;

  function marcarBarras(i){
    barras.forEach((b, idx) => {
      b.classList.remove('activa', 'completada');
      if (idx < i) b.classList.add('completada');
      if (idx === i) b.classList.add('activa');
    });
  }

  function irASlide(i){
    actual = (i + SLIDES.length) % SLIDES.length;
    track.style.transform = `translateX(-${actual * 100}%)`;
    marcarBarras(actual);
    reiniciarAutoplay();
  }

  function siguienteAuto(){
    actual = (actual + 1) % SLIDES.length;
    track.style.transform = `translateX(-${actual * 100}%)`;
    marcarBarras(actual);
    temporizador = setTimeout(siguienteAuto, DURACION_MS);
  }

  function reiniciarAutoplay(){
    clearTimeout(temporizador);
    temporizador = setTimeout(siguienteAuto, DURACION_MS);
  }

  barras.forEach((b, idx) => b.addEventListener('click', () => irASlide(idx)));
  if (flechaIzq) flechaIzq.addEventListener('click', () => irASlide(actual - 1));
  if (flechaDer) flechaDer.addEventListener('click', () => irASlide(actual + 1));

  // Pausa el avance automático mientras el usuario tiene el mouse encima o el foco dentro
  carrusel.addEventListener('mouseenter', () => { carrusel.classList.add('pausado'); clearTimeout(temporizador); });
  carrusel.addEventListener('mouseleave', () => { carrusel.classList.remove('pausado'); reiniciarAutoplay(); });
  carrusel.addEventListener('focusin', () => { carrusel.classList.add('pausado'); clearTimeout(temporizador); });
  carrusel.addEventListener('focusout', () => { carrusel.classList.remove('pausado'); reiniciarAutoplay(); });

  // Deslizar con el dedo en móvil
  let xInicio = null;
  track.addEventListener('touchstart', e => { xInicio = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (xInicio === null) return;
    const delta = e.changedTouches[0].clientX - xInicio;
    if (Math.abs(delta) > 40) irASlide(actual + (delta < 0 ? 1 : -1));
    xInicio = null;
  });

  marcarBarras(0);
  temporizador = setTimeout(siguienteAuto, DURACION_MS);
}

// ---- Popup de descripción al hacer clic en un ODS ----
const ODS_INFO = {
  '4': {
    titulo: 'ODS 4 — Educación de calidad',
    texto: 'Busca garantizar una educación inclusiva, equitativa y de calidad, y promover oportunidades de aprendizaje para todos a lo largo de la vida.'
  },
  '6': {
    titulo: 'ODS 6 — Agua limpia y saneamiento',
    texto: 'Busca garantizar la disponibilidad y la gestión sostenible del agua y el saneamiento para todas las personas.'
  },
  '11': {
    titulo: 'ODS 11 — Ciudades y comunidades sostenibles',
    texto: 'Busca lograr que las ciudades y los asentamientos humanos sean inclusivos, seguros, resilientes y sostenibles.'
  },
  '12': {
    titulo: 'ODS 12 — Producción y consumo responsables',
    texto: 'Busca garantizar modalidades de consumo y producción sostenibles, reduciendo el desperdicio y el mal manejo de los residuos.'
  }
};

const odsItems = document.querySelectorAll('.ods-item[data-ods]');
const odsOverlay = document.getElementById('ods-modal-overlay');
const odsBadge = document.getElementById('ods-modal-badge');
const odsTitulo = document.getElementById('ods-modal-titulo');
const odsTexto = document.getElementById('ods-modal-texto');
const odsCerrar = document.getElementById('ods-modal-cerrar');

function abrirOds(numero){
  const info = ODS_INFO[numero];
  if (!info) return;
  odsBadge.textContent = 'ODS ' + numero;
  odsTitulo.textContent = info.titulo;
  odsTexto.textContent = info.texto;
  odsOverlay.classList.add('abierto');
}
function cerrarOds(){
  odsOverlay.classList.remove('abierto');
}

if (odsItems.length && odsOverlay) {
  odsItems.forEach(item => {
    item.addEventListener('click', () => abrirOds(item.dataset.ods));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirOds(item.dataset.ods);
      }
    });
  });
  odsCerrar.addEventListener('click', cerrarOds);
  odsOverlay.addEventListener('click', e => { if (e.target === odsOverlay) cerrarOds(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarOds(); });
}

// ---- Botón de descarga (placeholder mientras no hay build lista) ----
const btnDescargar = document.querySelector('.btn-descargar');
if (btnDescargar) {
  btnDescargar.addEventListener('click', () => {
    alert('La build del juego todavía no está lista para descargar. ¡Vuelve pronto!');
  });
}
