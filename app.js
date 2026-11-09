import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

// Utilidad de seguridad contra XSS para entradas de texto
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// 1. DATOS DE BIOMAS, CATÁLOGO 3D Y CATÁLOGO COMPLETO DE TIENDA (24 ARTÍCULOS)
// ============================================================================
const HABITATS = [
  {
    id: 'savanna',
    name: 'Sabana del Serengueti',
    biomeFilter: 'Sabana Africana',
    badge: 'África Oriental · 2°S 34°E',
    icon: '🦁',
    lat: -2.3,
    lon: 34.8,
    dotColor: '#F59E0B',
    basePrice: 19.90,
    wooBaseId: 1002,
    defaultBaseType: 'oasis_dunes',
    zooNote: 'Ecosistema de llanura herbácea con charca permanente (abrevadero), afloramientos graníticos (kopjes) para descanso térmico y acacias.',
    palette: {
      groundMain: 0xFBBF24,
      groundSec: 0xD97706,
      rock: 0x78716C,
      water: 0x0EA5E9,
      foliage: 0x65A30D
    },
    defaultProps: ['acacia_tree', 'kopje_rock', 'watering_bush'],
    defaultFigures: ['lion_savanna', 'elephant_calf', 'giraffe_mini', 'zebra_mini']
  },
  {
    id: 'cretaceous',
    name: 'Isla Volcánica Cretácica',
    biomeFilter: 'Valle Cretácico',
    badge: 'Paleo-Caribe · 21°N 88°O',
    icon: '🌋',
    lat: 21.0,
    lon: -88.0,
    dotColor: '#EA580C',
    basePrice: 21.90,
    wooBaseId: 1001,
    defaultBaseType: 'volcanic_island',
    zooNote: 'Relieve volcánico activo con helechos arborescentes, palmeras prehistóricas, coladas basálticas y laguna termal cálida.',
    palette: {
      groundMain: 0x22C55E,
      groundSec: 0x16A34A,
      rock: 0x6D3B24,
      water: 0x06B6D4,
      foliage: 0x15803D
    },
    defaultProps: ['palm_left', 'volcano_vent', 'fern_cluster'],
    defaultFigures: ['dino_brown', 'dino_orange', 'dino_red', 'ptero_cyan']
  },
  {
    id: 'amazon',
    name: 'Selva Fluvial Amazónica',
    biomeFilter: 'Selva Amazónica',
    badge: 'Sudamérica · 3°S 62°O',
    icon: '🦜',
    lat: -3.4,
    lon: -62.2,
    dotColor: '#10B981',
    basePrice: 20.90,
    wooBaseId: 1003,
    defaultBaseType: 'river_valley',
    zooNote: 'Bosque húmedo neotropical estratificado: ribera fluvial para capibaras, sotobosque sombrío y dosel arbóreo para tucanes.',
    palette: {
      groundMain: 0x22C55E,
      groundSec: 0x15803D,
      rock: 0x57534E,
      water: 0x0284C7,
      foliage: 0x16A34A
    },
    defaultProps: ['palm_left', 'fallen_log', 'fern_cluster'],
    defaultFigures: ['toucan_amazon', 'capybara_river', 'frog_dart', 'jaguar_mini']
  },
  {
    id: 'sahara',
    name: 'Erg de Dunas del Sáhara',
    biomeFilter: 'Dunas del Sáhara',
    badge: 'Norte de África · 25°N 10°E',
    icon: '🐪',
    lat: 25.0,
    lon: 10.0,
    dotColor: '#D97706',
    basePrice: 18.90,
    wooBaseId: 1004,
    defaultBaseType: 'oasis_dunes',
    zooNote: 'Campo de dunas eólicas (Erg) con depresión interdunaria que forma un oasis de palmera datilera y refugios frescos bajo roca arenisca.',
    palette: {
      groundMain: 0xFCD34D,
      groundSec: 0xF59E0B,
      rock: 0xB45309,
      water: 0x0284C7,
      foliage: 0x65A30D
    },
    defaultProps: ['palm_left', 'sandstone_arch', 'desert_cactus'],
    defaultFigures: ['camel_desert', 'fennec_fox', 'dino_yellow']
  },
  {
    id: 'rockies',
    name: 'Cumbres Alpinas y Cascada',
    biomeFilter: 'Cumbres Alpinas',
    badge: 'Norteamérica · 44°N 110°O',
    icon: '🐻',
    lat: 44.5,
    lon: -110.5,
    dotColor: '#0D9488',
    basePrice: 21.50,
    wooBaseId: 1005,
    defaultBaseType: 'mountain_waterfall',
    zooNote: 'Ecosistema montañoso con gradiente altitudinal: pradera subalpina, río truchero con cascada oxigenada, coníferas y escarpes rocosos.',
    palette: {
      groundMain: 0x65A30D,
      groundSec: 0x4D7C0F,
      rock: 0x64748B,
      water: 0x38BDF8,
      foliage: 0x15803D
    },
    defaultProps: ['pine_tree', 'kopje_rock', 'fallen_log'],
    defaultFigures: ['bear_grizzly', 'wolf_timber', 'eagle_bald']
  },
  {
    id: 'arctic',
    name: 'Glaciar y Banquisa Ártica',
    biomeFilter: 'Glaciar Ártico',
    badge: 'Círculo Polar · 72°N 42°O',
    icon: '🐻‍❄️',
    lat: 72.0,
    lon: -42.0,
    dotColor: '#0284C7',
    basePrice: 19.90,
    wooBaseId: 1006,
    defaultBaseType: 'mountain_waterfall',
    zooNote: 'Relieve glaciar con placas de hielo marino (banquisa), respiraderos de agua abierta para focas y promontorios nevados.',
    palette: {
      groundMain: 0xE0F2FE,
      groundSec: 0xBAE6FD,
      rock: 0x64748B,
      water: 0x0284C7,
      foliage: 0x7DD3FC
    },
    defaultProps: ['ice_floe', 'ice_cave', 'kopje_rock'],
    defaultFigures: ['polar_bear', 'arctic_fox', 'seal_harp', 'penguin_guest']
  }
];

const CATALOG_FIGURES = [
  { id: 'dino_brown', name: 'Rexy Marrón Flexi', price: 5.90, wooId: 2001, emoji: '🦖', color: 0xA46434, accent: 0xF5EBE0, kind: 'rex', biome: 'Valle Cretácico', rating: 5.0, featured: true, desc: 'Tiranosaurio articulado print-in-place con ojos expresivos y acabado mate.' },
  { id: 'dino_orange', name: 'Ankylo Naranja Flexi', price: 6.50, wooId: 2002, emoji: '🟠', color: 0xF97316, accent: 0xFFEDD5, kind: 'ankylo', biome: 'Valle Cretácico', rating: 4.9, featured: true, desc: 'Anquilosaurio acorazado con pinchos dorsales blancos y cola articulada.' },
  { id: 'dino_red', name: 'Tricera Rojo Coral', price: 6.20, wooId: 2003, emoji: '🔴', color: 0xDC2626, accent: 0xFEF2F2, kind: 'tricera', biome: 'Valle Cretácico', rating: 4.9, featured: true, desc: 'Triceratops articulado con gola protectora y tres cuernos en contraste blanco.' },
  { id: 'ptero_cyan', name: 'Ptero Celeste de Copa', price: 6.50, wooId: 2004, emoji: '🩵', color: 0x38BDF8, accent: 0xE0F2FE, kind: 'ptero', biome: 'Valle Cretácico', rating: 5.0, featured: true, desc: 'Pterodáctilo celeste diseñado para posarse sobre palmeras y cumbres.' },
  { id: 'dino_green', name: 'Stego Verde Esmeralda', price: 5.90, wooId: 2005, emoji: '🦕', color: 0x22C55E, accent: 0xDCFCE7, kind: 'ankylo', biome: 'Valle Cretácico', rating: 4.8, featured: false, desc: 'Estegosaurio articulado con placas dorsales bitono y gran flexibilidad.' },
  { id: 'dino_yellow', name: 'Cera Amarillo Sol', price: 5.90, wooId: 2006, emoji: '🟡', color: 0xFACC15, accent: 0xFEF9C3, kind: 'tricera', biome: 'Dunas del Sáhara', rating: 4.7, featured: false, desc: 'Edición dorada de alta visibilidad ideal para escenarios de dunas y volcanes.' },
  { id: 'lion_savanna', name: 'León del Serengueti', price: 6.20, wooId: 2101, emoji: '🦁', color: 0xD97706, accent: 0x78350F, kind: 'mammal_mane', biome: 'Sabana Africana', rating: 5.0, featured: true, desc: 'Rey de la sabana con melena esculpida y cuerpo articulado para rocas kopje.' },
  { id: 'elephant_calf', name: 'Elefante Africano', price: 6.80, wooId: 2102, emoji: '🐘', color: 0x64748B, accent: 0xF8FAFC, kind: 'elephant', biome: 'Sabana Africana', rating: 4.9, featured: true, desc: 'Cría de elefante con grandes orejas móviles y trompa curvada hacia el oasis.' },
  { id: 'giraffe_mini', name: 'Jirafa Reticulada', price: 6.50, wooId: 2103, emoji: '🦒', color: 0xF59E0B, accent: 0x78350F, kind: 'giraffe', biome: 'Sabana Africana', rating: 4.8, featured: false, desc: 'Jirafa estilizada a medida para alcanzar las copas de las acacias del hábitat.' },
  { id: 'zebra_mini', name: 'Cebra de Grant', price: 5.90, wooId: 2104, emoji: '🦓', color: 0xF8FAFC, accent: 0x1E293B, kind: 'quadruped', biome: 'Sabana Africana', rating: 4.7, featured: false, desc: 'Cebra bicolor impresa en multimaterial sin pintura superficial.' },
  { id: 'toucan_amazon', name: 'Tucán Toco Amazónico', price: 5.90, wooId: 2105, emoji: '🦜', color: 0x1E293B, accent: 0xF97316, kind: 'bird', biome: 'Selva Amazónica', rating: 4.9, featured: true, desc: 'Ave tropical con gran pico naranja brillante para las ramas del dosel.' },
  { id: 'capybara_river', name: 'Capibara de Ribera', price: 5.80, wooId: 2106, emoji: '🦫', color: 0x92400E, accent: 0x451A03, kind: 'quadruped', biome: 'Selva Amazónica', rating: 5.0, featured: true, desc: 'El roedor más tranquilo y querido del Amazonas, ideal para orillas y puentes.' },
  { id: 'frog_dart', name: 'Rana Dardo Azul', price: 5.20, wooId: 2107, emoji: '🐸', color: 0x2563EB, accent: 0x1E3A8A, kind: 'frog', biome: 'Selva Amazónica', rating: 4.8, featured: false, desc: 'Rana dendrobátida en azul eléctrico intenso para hojas y charcas húmedas.' },
  { id: 'jaguar_mini', name: 'Jaguar Neotropical', price: 6.40, wooId: 2108, emoji: '🐆', color: 0xEAB308, accent: 0x451A03, kind: 'quadruped', biome: 'Selva Amazónica', rating: 4.9, featured: false, desc: 'Felino articulado de selva baja, perfecto para troncos caídos y riberas.' },
  { id: 'camel_desert', name: 'Dromedario del Erg', price: 6.50, wooId: 2109, emoji: '🐪', color: 0xD97706, accent: 0xFEF3C7, kind: 'camel', biome: 'Dunas del Sáhara', rating: 4.8, featured: false, desc: 'Dromedario adaptado a las crestas de dunas con giba texturizada.' },
  { id: 'fennec_fox', name: 'Zorrito Fénec del Sáhara', price: 5.80, wooId: 2110, emoji: '🦊', color: 0xFDE68A, accent: 0x92400E, kind: 'fox', biome: 'Dunas del Sáhara', rating: 5.0, featured: true, desc: 'Zorro del desierto con orejas extragrandes de termorregulación.' },
  { id: 'bear_grizzly', name: 'Oso Grizzly de Cascada', price: 6.60, wooId: 2111, emoji: '🐻', color: 0x78350F, accent: 0xD6D3D1, kind: 'quadruped', biome: 'Cumbres Alpinas', rating: 4.9, featured: false, desc: 'Oso pardo pescador diseñado para colocarse junto a cascadas y ríos.' },
  { id: 'wolf_timber', name: 'Lobo Ibérico / Alpino', price: 6.10, wooId: 2112, emoji: '🐺', color: 0x64748B, accent: 0xF1F5F9, kind: 'fox', biome: 'Cumbres Alpinas', rating: 4.9, featured: false, desc: 'Lobo articulado de pelaje grisáceo ideal para riscos y miradores altos.' },
  { id: 'polar_bear', name: 'Oso Polar del Ártico', price: 6.80, wooId: 2114, emoji: '🐻‍❄️', color: 0xF8FAFC, accent: 0x94A3B8, kind: 'quadruped', biome: 'Glaciar Ártico', rating: 5.0, featured: true, desc: 'Oso blanco perlado para témpanos y cuevas de hielo.' },
  { id: 'penguin_guest', name: 'Pingüino Polar', price: 5.50, wooId: 2117, emoji: '🐧', color: 0x0F172A, accent: 0xFACC15, kind: 'penguin', biome: 'Glaciar Ártico', rating: 4.9, featured: false, desc: 'Pingüino bicolor con detalles amarillos para bordes de agua helada.' }
];

const CATALOG_PROPS = [
  { id: 'palm_left', name: 'Palmera Tropical Curva', price: 3.50, wooId: 3001, emoji: '🌴', color: 0x22C55E, kind: 'palm', biome: 'Valle Cretácico', rating: 4.9, featured: true, desc: 'Palmera segmentada con tronco curvado y corona de 6 hojas donde posar aves o pteros.' },
  { id: 'acacia_tree', name: 'Acacia Copa Plana', price: 3.90, wooId: 3002, emoji: '🌳', color: 0x65A30D, kind: 'acacia', biome: 'Sabana Africana', rating: 4.8, featured: false, desc: 'Árbol característico del Serengueti que aporta sombra a leones y jirafas.' },
  { id: 'pine_tree', name: 'Abeto Alpino', price: 3.60, wooId: 3003, emoji: '🌲', color: 0x15803D, kind: 'pine', biome: 'Cumbres Alpinas', rating: 4.8, featured: false, desc: 'Conífera en tres pisos para laderas rocosas y bosques boreales.' },
  { id: 'kopje_rock', name: 'Peñón Termorregulador', price: 3.20, wooId: 3004, emoji: '🪨', color: 0x78716C, kind: 'rock', biome: 'Sabana Africana', rating: 4.7, featured: false, desc: 'Formación rocosa facetada para reptiles y mamíferos.' },
  { id: 'volcano_vent', name: 'Mini Volcán con Lava', price: 4.90, wooId: 3005, emoji: '🌋', color: 0x7C2D12, kind: 'volcano', biome: 'Valle Cretácico', rating: 5.0, featured: true, desc: 'Cono volcánico accesorio con cráter naranja incandescente.' },
  { id: 'sandstone_arch', name: 'Arco de Piedra / Cueva', price: 4.50, wooId: 3006, emoji: '🏜️', color: 0xD97706, kind: 'arch', biome: 'Dunas del Sáhara', rating: 4.9, featured: false, desc: 'Arco natural de arenisca que ofrece refugio de sombra en el desierto.' },
  { id: 'ice_cave', name: 'Cueva / Refugio Glacial', price: 4.40, wooId: 3007, emoji: '🧊', color: 0x38BDF8, kind: 'ice_cave', biome: 'Glaciar Ártico', rating: 4.8, featured: false, desc: 'Bóveda translúcida azul celeste para fauna polar.' },
  { id: 'fallen_log', name: 'Tronco Hueco de Ribera', price: 2.90, wooId: 3008, emoji: '🪵', color: 0x78350F, kind: 'log', biome: 'Selva Amazónica', rating: 4.7, featured: false, desc: 'Tronco musgoso para enriquecimiento ambiental de anfibios y mamíferos.' },
  { id: 'fern_cluster', name: 'Helecho Prehistórico', price: 2.50, wooId: 3009, emoji: '🌿', color: 0x16A34A, kind: 'fern', biome: 'Valle Cretácico', rating: 4.8, featured: false, desc: 'Roseta de frondas verdes para cubrir el suelo del hábitat.' },
  { id: 'desert_cactus', name: 'Cactus Saguaro', price: 2.80, wooId: 3010, emoji: '🌵', color: 0x15803D, kind: 'cactus', biome: 'Dunas del Sáhara', rating: 4.8, featured: false, desc: 'Cactus columnar con brazos laterales para climas áridos.' },
  { id: 'watering_bush', name: 'Juncos de Charca', price: 2.60, wooId: 3011, emoji: '🌾', color: 0x84CC16, kind: 'fern', biome: 'Sabana Africana', rating: 4.7, featured: false, desc: 'Vegetación acuática para bordear lagunas y ríos.' },
  { id: 'ice_floe', name: 'Cristales de Hielo Polar', price: 3.40, wooId: 3012, emoji: '❄️', color: 0x7DD3FC, kind: 'ice_crystal', biome: 'Glaciar Ártico', rating: 4.9, featured: false, desc: 'Drusa de agujas de hielo azul claro.' }
];

// Unificamos en un Catálogo General de 28 artículos para la Malla de Tienda (Sección 2)
const FULL_SHOP_PRODUCTS = [
  // Packs y Escenarios Base
  {
    id: 'pack_cretaceous_photo',
    name: 'Pack Completo Valle Cretácico (Edición Foto)',
    dept: 'PACKS',
    biome: 'Valle Cretácico',
    price: 38.90,
    wooId: 9001,
    emoji: '🌋',
    color: 0xEA580C,
    isFlexi: true,
    featured: true,
    rating: 5.0,
    habitatId: 'cretaceous',
    desc: 'Incluye el hábitat volcánico + 2 palmeras tropicales + 4 dinosaurios articulados (Rexy, Ankylo, Tricera y Ptero).'
  },
  {
    id: 'pack_serengeti_oasis',
    name: 'Pack Expedición Sabana del Serengueti',
    dept: 'PACKS',
    biome: 'Sabana Africana',
    price: 36.50,
    wooId: 9002,
    emoji: '🦁',
    color: 0xF59E0B,
    isFlexi: true,
    featured: true,
    rating: 5.0,
    habitatId: 'savanna',
    desc: 'Escenario 360° de dunas y charca central + Acacia + León, Elefante, Jirafa y Cebra.'
  },
  {
    id: 'base_mountain_waterfall',
    name: 'Escenario 360° Montañas Rocosas y Cascada',
    dept: 'HABITATS',
    biome: 'Cumbres Alpinas',
    price: 21.50,
    wooId: 1005,
    emoji: '⛰️',
    color: 0x0D9488,
    isFlexi: false,
    featured: true,
    rating: 4.9,
    habitatId: 'rockies',
    desc: 'Base orgánica no cuadrada con cumbres a 3 niveles, cascada oxigenada, poza inferior y 8 puntos de anclaje.'
  },
  {
    id: 'base_oasis_dunes',
    name: 'Escenario 360° Oasis de Dunas y Laguna',
    dept: 'HABITATS',
    biome: 'Dunas del Sáhara',
    price: 19.90,
    wooId: 1004,
    emoji: '🏝️',
    color: 0xD97706,
    isFlexi: false,
    featured: true,
    rating: 4.9,
    habitatId: 'sahara',
    desc: 'Terreno esculpido con dunas curvas y charca cristalina central rodeada de vegetación.'
  },
  {
    id: 'base_river_valley',
    name: 'Escenario 360° Valle Fluvial Amazónico',
    dept: 'HABITATS',
    biome: 'Selva Amazónica',
    price: 20.90,
    wooId: 1003,
    emoji: '🌊',
    color: 0x10B981,
    isFlexi: false,
    featured: false,
    rating: 4.8,
    habitatId: 'amazon',
    desc: 'Doble ribera elevada atravesada por un río azul con puente de tronco natural.'
  },
  {
    id: 'base_classic_cage',
    name: 'Expositor Diorama con Vallas (Modelo Clásico)',
    dept: 'HABITATS',
    biome: 'Valle Cretácico',
    price: 18.90,
    wooId: 1001,
    emoji: '📦',
    color: 0x8B4C39,
    isFlexi: false,
    featured: false,
    rating: 4.8,
    habitatId: 'cretaceous',
    desc: 'El expositor clásico con vallas grises laterales, bandeja verde y mural montañoso en relieve.'
  },
  // Todas las Figuras Articuladas
  ...CATALOG_FIGURES.map((f) => ({
    id: f.id,
    name: f.name,
    dept: 'FIGURAS',
    biome: f.biome,
    price: f.price,
    wooId: f.wooId,
    emoji: f.emoji,
    color: f.color,
    isFlexi: true,
    featured: f.featured,
    rating: f.rating,
    desc: f.desc,
    refItem: f,
    refType: 'figures'
  })),
  // Todos los Mini-Hábitats (Extras)
  ...CATALOG_PROPS.map((p) => ({
    id: p.id,
    name: p.name,
    dept: 'EXTRAS',
    biome: p.biome,
    price: p.price,
    wooId: p.wooId,
    emoji: p.emoji,
    color: p.color,
    isFlexi: false,
    featured: p.featured,
    rating: p.rating,
    desc: p.desc,
    refItem: p,
    refType: 'props'
  }))
];

// ============================================================================
// 2. ESCENA THREE.JS LUMINOSA Y CONTROLES DE CÁMARA LIBRES
// ============================================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 300);
camera.position.set(0, 2.1, 10.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.rotateSpeed = 0.78;
controls.zoomSpeed = 1.15;
controls.minDistance = 4.2;
controls.maxDistance = 20.0;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

let cameraAnim = null;
controls.addEventListener('start', () => {
  cameraAnim = null;
});

function animateCameraTo(targetPos, targetLookAt, durationMs = 650) {
  cameraAnim = {
    startPos: camera.position.clone(),
    endPos: targetPos.clone(),
    startLook: controls.target.clone(),
    endLook: targetLookAt.clone(),
    startTime: performance.now(),
    duration: durationMs
  };
}

// ============================================================================
// 2.5 ILUMINACIÓN DE ESTUDIO "SHOWCASE" (ART-TOY COLLECTIBLE LIGHTING)
// ============================================================================
const ambientLight = new THREE.AmbientLight(0xFFFDF9, 0.72);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xFFFBEB, 0xA7F3D0, 1.18);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xFFF8EB, 1.65);
sunLight.position.set(8, 13, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.radius = 4;
const d = 7.5;
sunLight.shadow.camera.left = -d;
sunLight.shadow.camera.right = d;
sunLight.shadow.camera.top = d;
sunLight.shadow.camera.bottom = -d;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);

// Rim-light trasera/lateral de contorno + luz de rebote cálida de estudio
const rimLight = new THREE.DirectionalLight(0xE0F2FE, 0.95);
rimLight.position.set(-10, 7, -9);
scene.add(rimLight);

const bounceLight = new THREE.DirectionalLight(0xFDE68A, 0.55);
bounceLight.position.set(7, -6, 6);
scene.add(bounceLight);

function toyMaterial(hexColor, roughness = 0.7) {
  return new THREE.MeshStandardMaterial({
    color: hexColor,
    roughness,
    metalness: 0.05,
    flatShading: false
  });
}

// ============================================================================
// 3. GLOBO TERRÁQUEO ART-TOY 3D (SOFT-TOUCH MATTE VINYL & ORGANIC BEVEL)
// ============================================================================
const globeGroup = new THREE.Group();
scene.add(globeGroup);

const GLOBE_RADIUS = 3.3;
const GLOBE_SEGMENTS = 160;

// Lienzos de Textura Difusa 4K + Bump de Bisel Acolchado + Campo de Elevación Suavizado
const mapCanvas = document.createElement('canvas');
mapCanvas.width = 4096;
mapCanvas.height = 2048;
const mapCtx = mapCanvas.getContext('2d');

const bumpCanvas = document.createElement('canvas');
bumpCanvas.width = 2048;
bumpCanvas.height = 1024;
const bumpCtx = bumpCanvas.getContext('2d');

const heightFieldCanvas = document.createElement('canvas');
heightFieldCanvas.width = 512;
heightFieldCanvas.height = 256;
const heightFieldCtx = heightFieldCanvas.getContext('2d', { willReadFrequently: true });

const globeTexture = new THREE.CanvasTexture(mapCanvas);
globeTexture.colorSpace = THREE.SRGBColorSpace;
globeTexture.wrapS = THREE.RepeatWrapping;
globeTexture.wrapT = THREE.ClampToEdgeWrapping;
globeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const globeBumpTexture = new THREE.CanvasTexture(bumpCanvas);
globeBumpTexture.wrapS = THREE.RepeatWrapping;
globeBumpTexture.wrapT = THREE.ClampToEdgeWrapping;

// Geometría Toy-like con sombreado suave (flatShading: false) y normales recalculadas
const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, GLOBE_SEGMENTS, GLOBE_SEGMENTS);
globeGeometry.computeVertexNormals();
const baseGlobePositions = new Float32Array(globeGeometry.attributes.position.array);

// Material Soft-Touch Matte Plastic / Vinyl con Rim-Light Fresnel integrado en Shader
const globeMaterial = new THREE.MeshPhysicalMaterial({
  map: globeTexture,
  bumpMap: globeBumpTexture,
  bumpScale: 0.038,
  roughness: 0.72,       // Acabado táctil vinilo mate / plástico sedoso (0.65 - 0.8)
  metalness: 0.05,       // Sutil respuesta de estudio
  clearcoat: 0.07,       // Recubrimiento soft-touch satinado
  clearcoatRoughness: 0.78,
  sheen: 0.26,           // Dispersión aterciopelada en contornos como los muñecos de MiniFauna
  sheenRoughness: 0.78,
  sheenColor: new THREE.Color(0xFFFDF5),
  flatShading: false
});

globeMaterial.onBeforeCompile = (shader) => {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <dithering_fragment>',
    `
    // Luz de contorno Fresnel suave (Showcase Rim-Light) + dispersión cálida Art-Toy
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 2.75);
    vec3 rimTint = mix(vec3(0.88, 0.97, 1.0), vec3(1.0, 0.98, 0.92), 0.55);
    gl_FragColor.rgb += rimTint * fresnel * 0.19;
    #include <dithering_fragment>
    `
  );
};

const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
globeMesh.receiveShadow = true;
globeMesh.castShadow = true;
globeGroup.add(globeMesh);

function lonToX(lon, w) { return ((lon + 180) / 360) * w; }
function latToY(lat, h) { return ((90 - lat) / 180) * h; }
function smoothstepJS(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// 1. Océano Azul Luminoso y Alegre (Estilo Art-Toy Acuático Limpio, CERO líneas)
function drawToyOceanBase(ctx, w, h) {
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
  oceanGrad.addColorStop(0.0, '#38BDF8');
  oceanGrad.addColorStop(0.22, '#29B6F6');
  oceanGrad.addColorStop(0.5, '#1DA1F2');
  oceanGrad.addColorStop(0.78, '#29B6F6');
  oceanGrad.addColorStop(1.0, '#38BDF8');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, w, h);

  bumpCtx.fillStyle = '#000000';
  bumpCtx.fillRect(0, 0, bumpCanvas.width, bumpCanvas.height);

  heightFieldCtx.fillStyle = '#000000';
  heightFieldCtx.fillRect(0, 0, heightFieldCanvas.width, heightFieldCanvas.height);
}

// 2. Simplificación y Suavizado Orgánico de Costas (Algoritmo de Chaikin Compacto)
function smoothToyRingChaikin(rawPoints, iterations = 1) {
  if (rawPoints.length < 4) return rawPoints;

  // Paso A: Diezmado suave para preservar canales estrechos (Mediterráneo, Mar Rojo, Golfo Pérsico)
  const simplified = [rawPoints[0]];
  const minDistSq = 0.35 * 0.35; // 0.35° conserva la silueta nítida y canales interiores
  for (let i = 1; i < rawPoints.length - 1; i++) {
    const prev = simplified[simplified.length - 1];
    const cur = rawPoints[i];
    const dx = cur[0] - prev[0];
    const dy = cur[1] - prev[1];
    if (dx * dx + dy * dy >= minDistSq) {
      simplified.push(cur);
    }
  }
  simplified.push(rawPoints[rawPoints.length - 1]);
  if (simplified.length < 4) return rawPoints;

  // Paso B: Subdivisión de Chaikin suave (1 sola iteración para curvas amigables sin invadir el mar)
  let pts = simplified;
  for (let iter = 0; iter < iterations; iter++) {
    const next = [];
    const n = pts.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      next.push([0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1]]);
      next.push([0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1]]);
    }
    next.push(next[0]);
    pts = next;
  }
  return pts;
}

function decodeTopoJsonLandUnwrapped(topology) {
  const tf = topology.transform;
  const decodedArcs = topology.arcs.map((arc) => {
    let x = 0, y = 0;
    return arc.map((pt) => {
      x += pt[0];
      y += pt[1];
      return [x * tf.scale[0] + tf.translate[0], y * tf.scale[1] + tf.translate[1]];
    });
  });

  function arcToCoords(arcIndex) {
    if (arcIndex >= 0) return decodedArcs[arcIndex];
    return decodedArcs[~arcIndex].slice().reverse();
  }

  function unwrapAndCleanRing(rawRing) {
    if (rawRing.length < 4) return [];
    const unwrapped = [[rawRing[0][0], rawRing[0][1]]];
    let minLon = rawRing[0][0], maxLon = rawRing[0][0];
    let minLat = rawRing[0][1], maxLat = rawRing[0][1];

    for (let i = 1; i < rawRing.length; i++) {
      let lon = rawRing[i][0];
      const lat = rawRing[i][1];
      const prevLon = unwrapped[i - 1][0];
      while (lon - prevLon > 180) lon -= 360;
      while (lon - prevLon < -180) lon += 360;
      unwrapped.push([lon, lat]);
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }

    // Filtrar islotes minúsculos manteniendo islas reconocibles (Sicilia, Japón, Cuba, etc.)
    const bboxArea = (maxLon - minLon) * (maxLat - minLat);
    if (bboxArea < 0.6) return [];

    // Cerrar limpiamente el casquete de la Antártida por el Polo Sur (-90°)
    const first = unwrapped[0];
    const last = unwrapped[unwrapped.length - 1];
    if (Math.abs(last[0] - first[0]) > 200 && first[1] < -55) {
      unwrapped.push([last[0], -90]);
      unwrapped.push([first[0], -90]);
      return unwrapped;
    }

    return smoothToyRingChaikin(unwrapped, 1);
  }

  function decodeRing(indices) {
    let coords = [];
    indices.forEach((idx) => {
      coords = coords.concat(arcToCoords(idx));
    });
    return unwrapAndCleanRing(coords);
  }

  const geom = topology.objects.land;
  const polygons = [];
  const geoms = geom.type === 'GeometryCollection' ? geom.geometries : [geom];
  geoms.forEach((g) => {
    if (g.type === 'Polygon') {
      const rings = g.arcs.map(decodeRing).filter((r) => r.length >= 4);
      if (rings.length > 0) polygons.push(rings);
    } else if (g.type === 'MultiPolygon') {
      g.arcs.forEach((poly) => {
        const rings = poly.map(decodeRing).filter((r) => r.length >= 4);
        if (rings.length > 0) polygons.push(rings);
      });
    }
  });
  return polygons;
}

// Traza curvas Quadratic Bézier continuas para siluetas redondeadas y nítidas
function traceSmoothToyPolygonsPath(ctx, polygons, w, h, offsetX = 0, offsetY = 0) {
  ctx.beginPath();
  [-w, 0, w].forEach((shiftW) => {
    polygons.forEach((poly) => {
      poly.forEach((ring) => {
        if (ring.length < 4) return;
        const pts = ring.map(([lon, lat]) => [
          lonToX(lon, w) + shiftW + offsetX,
          latToY(lat, h) + offsetY
        ]);
        const len = pts.length;
        const startMidX = (pts[0][0] + pts[len - 1][0]) * 0.5;
        const startMidY = (pts[0][1] + pts[len - 1][1]) * 0.5;
        ctx.moveTo(startMidX, startMidY);

        for (let i = 0; i < len; i++) {
          const curr = pts[i];
          const next = pts[(i + 1) % len];
          const midX = (curr[0] + next[0]) * 0.5;
          const midY = (curr[1] + next[1]) * 0.5;
          ctx.quadraticCurveTo(curr[0], curr[1], midX, midY);
        }
        ctx.closePath();
      });
    });
  });
}

// Añade los Casquetes Polares Blancos Redondeados y Suaves (Polo Norte y Polo Sur)
function traceRoundedPolarCapsPath(ctx, w, h, offsetY = 0) {
  ctx.beginPath();
  // Casquete Polar Norte (suave y ligeramente ondulado de forma orgánica)
  const northBaseY = latToY(81.5, h) + offsetY;
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, northBaseY);
  for (let x = w; x >= 0; x -= w / 24) {
    const lonRad = (x / w) * Math.PI * 2;
    const wave = Math.sin(lonRad * 2) * (h * 0.008) + Math.cos(lonRad * 3) * (h * 0.005);
    ctx.lineTo(x, northBaseY + wave);
  }
  ctx.closePath();

  // Casquete Polar Sur (redondeado y acolchado en el Polo Sur)
  const southBaseY = latToY(-76.5, h) + offsetY;
  ctx.moveTo(0, h);
  ctx.lineTo(w, h);
  ctx.lineTo(w, southBaseY);
  for (let x = w; x >= 0; x -= w / 24) {
    const lonRad = (x / w) * Math.PI * 2;
    const wave = Math.cos(lonRad * 2) * (h * 0.009) + Math.sin(lonRad * 4) * (h * 0.005);
    ctx.lineTo(x, southBaseY + wave);
  }
  ctx.closePath();
}

// 3. Degradado Suave entre Continentes (Color Blending sin cortes duros, paleta oficial MiniFauna)
function paintDiffusedArtToyContinents(ctx, w, h) {
  // Pintamos las regiones en un lienzo intermedio y aplicamos difusión Gaussiana amplia (smoothstep blending)
  const rawColorCanvas = document.createElement('canvas');
  rawColorCanvas.width = 1024;
  rawColorCanvas.height = 512;
  const rCtx = rawColorCanvas.getContext('2d');
  const rw = rawColorCanvas.width;
  const rh = rawColorCanvas.height;

  // Base suave Verde Brote MiniFauna (--mf-lime)
  rCtx.fillStyle = '#9CCC3D';
  rCtx.fillRect(0, 0, rw, rh);

  // Zonas base por continente con los colores del Libro de Estilos MiniFauna
  const baseRegions = [
    // NORTEAMÉRICA: Verde Lima Suave (--mf-lime)
    { color: '#9CCC3D', pts: [[-170, 75], [-52, 75], [-72, 16], [-105, 14], [-170, 50]] },
    // CENTROAMÉRICA Y CARIBE: Transición Turquesa-Esmeralda
    { color: '#52D18C', pts: [[-105, 22], [-58, 25], [-60, 8], [-95, 8]] },
    // SUDAMÉRICA: Verde Esmeralda Suave (--mf-emerald luminoso)
    { color: '#34D399', pts: [[-84, 12], [-32, 10], [-32, -58], [-82, -58]] },
    // EUROPA: Rosa Orquídea Suave (--mf-orchid)
    { color: '#F28BB2', pts: [[-25, 36], [28, 35], [42, 44], [56, 56], [58, 73], [-25, 73]] },
    // ÁFRICA: Amarillo Polen y Ámbar Cálido (--mf-pollen)
    { color: '#FCD34D', pts: [[-20, 36], [33, 33], [52, 12], [52, -38], [-20, -38]] },
    // ASIA: Lavanda Pastel y Malva Suave
    { color: '#B197FC', pts: [[32, 35], [56, 54], [60, 80], [195, 80], [195, 14], [68, 14], [35, 29]] },
    // SUBCONTINENTE INDIO Y SUDESTE ASIÁTICO: Transición Melocotón -> Turquesa Laguna (--mf-lagoon-light)
    { color: '#FDBA74', pts: [[40, 30], [88, 28], [88, 6], [42, 12]] },
    { color: '#4CC4B9', pts: [[90, 22], [140, 20], [142, -11], [92, -11]] },
    // OCEANÍA / AUSTRALIA: Coral Papaya Suave (--mf-papaya)
    { color: '#F58E58', pts: [[110, -11], [180, -11], [180, -52], [110, -52]] },
    // GROENLANDIA Y CASQUETES POLARES: Blanco Nieve Cremoso
    { color: '#F8FAFC', pts: [[-74, 58], [-12, 58], [-12, 86], [-74, 86]] },
    { color: '#F8FAFC', pts: [[-180, 80], [180, 80], [180, 90], [-180, 90]] },
    { color: '#F8FAFC', pts: [[-180, -60], [180, -60], [180, -90], [-180, -90]] }
  ];

  baseRegions.forEach((reg) => {
    [-rw, 0, rw].forEach((shiftW) => {
      rCtx.fillStyle = reg.color;
      rCtx.beginPath();
      reg.pts.forEach(([lon, lat], idx) => {
        const x = lonToX(lon, rw) + shiftW;
        const y = latToY(lat, rh);
        if (idx === 0) rCtx.moveTo(x, y);
        else rCtx.lineTo(x, y);
      });
      rCtx.closePath();
      rCtx.fill();
    });
  });

  // Centros de difusión radial (smoothstep) para fundir fronteras terrestres (Europa-Asia, América N-S, África-Asia)
  const softBlendNodes = [
    { lat: 46, lon: -102, rx: 35, ry: 22, color: '#A3E635' }, // Norteamérica cálida
    { lat: 15, lon: -84,  rx: 20, ry: 14, color: '#6EE7B7' }, // Puente suave Norte-Sudamérica
    { lat: -15, lon: -58, rx: 28, ry: 26, color: '#34D399' }, // Corazón Sudamérica
    { lat: 49, lon: 14,   rx: 24, ry: 16, color: '#F497B6' }, // Corazón Europa
    { lat: 52, lon: 54,   rx: 24, ry: 18, color: '#D8B4FE' }, // Puente de fusión suave Europa-Asia (Urales)
    { lat: 30, lon: 36,   rx: 18, ry: 14, color: '#FDE68A' }, // Puente de fusión suave África-Asia
    { lat: 10, lon: 20,   rx: 28, ry: 24, color: '#FCD34D' }, // Corazón África
    { lat: -12, lon: 26,  rx: 20, ry: 18, color: '#FBBF24' }, // África Austral cálida
    { lat: 52, lon: 96,   rx: 38, ry: 22, color: '#C4B5FD' }, // Corazón Asia
    { lat: 24, lon: 80,   rx: 22, ry: 16, color: '#FDBA74' }, // Sur de Asia melocotón
    { lat: -25, lon: 135, rx: 24, ry: 16, color: '#F58E58' }, // Corazón Oceanía
    { lat: 74, lon: -42,  rx: 20, ry: 14, color: '#F8FAFC' }  // Groenlandia nieve
  ];

  softBlendNodes.forEach((b) => {
    [-rw, 0, rw].forEach((shiftW) => {
      const cx = lonToX(b.lon, rw) + shiftW;
      const cy = latToY(b.lat, rh);
      const rxPx = (b.rx / 360) * rw;
      const ryPx = (b.ry / 180) * rh;
      const maxR = Math.max(rxPx, ryPx);

      rCtx.save();
      rCtx.translate(cx, cy);
      rCtx.scale(rxPx / maxR, ryPx / maxR);
      const grad = rCtx.createRadialGradient(0, 0, 0, 0, 0, maxR);
      grad.addColorStop(0.0, b.color);
      grad.addColorStop(0.45, b.color);
      grad.addColorStop(1.0, 'rgba(255,255,255,0)');
      rCtx.fillStyle = grad;
      rCtx.beginPath();
      rCtx.arc(0, 0, maxR, 0, Math.PI * 2);
      rCtx.fill();
      rCtx.restore();
    });
  });

  // Difusión Gaussiana en el interior continental para fundir fronteras terrestres
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.filter = 'blur(45px)';
  ctx.drawImage(rawColorCanvas, -w * 0.05, -h * 0.05, w * 1.1, h * 1.1);
  ctx.drawImage(rawColorCanvas, 0, 0, w, h);
  ctx.restore();
}

// 4. Deformación Suave 3D de Vértices (Compact Toy Bevel) + Recálculo de Normales sin Costuras
function applySmoothToyVertexBevel(geometry, basePositions, hCanvas) {
  const gw = hCanvas.width;
  const gh = hCanvas.height;
  const imgData = hCanvas.getContext('2d').getImageData(0, 0, gw, gh).data;

  function sampleHeightBilinear(u, v) {
    const wrappedU = ((u % 1) + 1) % 1;
    const clampedV = Math.max(0, Math.min(1, v));
    const fx = wrappedU * (gw - 1);
    const fy = (1 - clampedV) * (gh - 1);
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const x1 = (x0 + 1) % gw;
    const y1 = Math.min(gh - 1, y0 + 1);
    const tx = fx - x0;
    const ty = fy - y0;

    const c00 = imgData[(y0 * gw + x0) * 4] / 255;
    const c10 = imgData[(y0 * gw + x1) * 4] / 255;
    const c01 = imgData[(y1 * gw + x0) * 4] / 255;
    const c11 = imgData[(y1 * gw + x1) * 4] / 255;

    const top = c00 * (1 - tx) + c10 * tx;
    const bot = c01 * (1 - tx) + c11 * tx;
    return top * (1 - ty) + bot * ty;
  }

  const posAttr = geometry.attributes.position;
  const uvAttr = geometry.attributes.uv;
  const count = posAttr.count;
  const maxExtrusion = 0.036; // Relieve compacto y definido sin invadir mares interiores

  for (let i = 0; i < count; i++) {
    const bx = basePositions[i * 3];
    const by = basePositions[i * 3 + 1];
    const bz = basePositions[i * 3 + 2];

    const u = uvAttr.getX(i);
    const v = uvAttr.getY(i);
    const rawH = sampleHeightBilinear(u, v);

    // Curva S (smoothstep) compacta para caída nítida y redondeada hacia el mar
    const cushionedH = smoothstepJS(0.18, 0.85, rawH);

    const latAbs = Math.abs(v - 0.5) * 2;
    const poleSmooth = 1 - smoothstepJS(0.92, 1.0, latAbs) * 0.65;

    const scale = 1 + (cushionedH * maxExtrusion * poleSmooth) / GLOBE_RADIUS;
    posAttr.setXYZ(i, bx * scale, by * scale, bz * scale);
  }

  posAttr.needsUpdate = true;
  geometry.computeVertexNormals();

  // Soldar normales en la costura del meridiano UV
  const normAttr = geometry.attributes.normal;
  const stride = GLOBE_SEGMENTS + 1;
  for (let row = 0; row <= GLOBE_SEGMENTS; row++) {
    const idx0 = row * stride;
    const idx1 = row * stride + GLOBE_SEGMENTS;
    const nx = (normAttr.getX(idx0) + normAttr.getX(idx1)) * 0.5;
    const ny = (normAttr.getY(idx0) + normAttr.getY(idx1)) * 0.5;
    const nz = (normAttr.getZ(idx0) + normAttr.getZ(idx1)) * 0.5;
    const len = Math.hypot(nx, ny, nz) || 1;
    normAttr.setXYZ(idx0, nx / len, ny / len, nz / len);
    normAttr.setXYZ(idx1, nx / len, ny / len, nz / len);
  }
  normAttr.needsUpdate = true;
}

// 5. Renderizador Maestro del Globo Art-Toy (Costas Nítidas, Mares Abiertos, Relieve Compacto)
function renderPolygonsToGlobe(polygons) {
  const w = mapCanvas.width;
  const h = mapCanvas.height;
  drawToyOceanBase(mapCtx, w, h);

  // Paso 1: Lienzo de color difundido interior
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = w;
  colorCanvas.height = h;
  const cCtx = colorCanvas.getContext('2d');
  paintDiffusedArtToyContinents(cCtx, w, h);

  // Paso 2: Máscara de continentes con corte nítido y compacto (lineWidth = 4)
  const landLayer = document.createElement('canvas');
  landLayer.width = w;
  landLayer.height = h;
  const lCtx = landLayer.getContext('2d');

  lCtx.globalCompositeOperation = 'source-over';
  lCtx.lineJoin = 'round';
  lCtx.lineCap = 'round';
  lCtx.lineWidth = 4; // Borde compacto: NO invade el mar ni cierra estrechos
  lCtx.strokeStyle = '#FFFFFF';
  lCtx.fillStyle = '#FFFFFF';
  traceSmoothToyPolygonsPath(lCtx, polygons, w, h);
  lCtx.stroke();
  lCtx.fill();

  // Casquetes polares suaves
  traceRoundedPolarCapsPath(lCtx, w, h);
  lCtx.lineWidth = 4;
  lCtx.stroke();
  lCtx.fill();

  // Paso 3: Aplicar el mapa de color a la silueta definida
  lCtx.globalCompositeOperation = 'source-in';
  lCtx.drawImage(colorCanvas, 0, 0);

  // Paso 4: Bisel interior compacto tipo plastilina moldeada (dentro de landLayer)
  lCtx.globalCompositeOperation = 'source-atop';

  // 4a. Sombra interior compacta (inferior-derecha)
  lCtx.save();
  traceSmoothToyPolygonsPath(lCtx, polygons, w, h, -2.5, -3.5);
  lCtx.lineJoin = 'round';
  lCtx.lineCap = 'round';
  lCtx.lineWidth = 8;
  lCtx.strokeStyle = 'rgba(10, 25, 55, 0.22)';
  lCtx.stroke();

  // 4b. Luz interior compacta (superior-izquierda)
  traceSmoothToyPolygonsPath(lCtx, polygons, w, h, 2, 2.5);
  lCtx.lineWidth = 6;
  lCtx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
  lCtx.stroke();
  lCtx.restore();

  // Paso 5: Sombra suave de contacto sobre el océano (compacta, sin tapar mares interiores)
  mapCtx.save();
  mapCtx.shadowColor = 'rgba(8, 32, 70, 0.32)';
  mapCtx.shadowBlur = 8;
  mapCtx.shadowOffsetX = 3;
  mapCtx.shadowOffsetY = 5;
  mapCtx.drawImage(landLayer, 0, 0);
  mapCtx.restore();

  // Paso 6: Campo de Elevación y Bump Map compactos
  const hw = heightFieldCanvas.width;
  const hh = heightFieldCanvas.height;
  heightFieldCtx.save();
  heightFieldCtx.fillStyle = '#000000';
  heightFieldCtx.fillRect(0, 0, hw, hh);
  heightFieldCtx.filter = 'blur(2px)';
  heightFieldCtx.lineJoin = 'round';
  heightFieldCtx.lineCap = 'round';
  heightFieldCtx.lineWidth = 2;
  heightFieldCtx.strokeStyle = '#FFFFFF';
  heightFieldCtx.fillStyle = '#FFFFFF';
  traceSmoothToyPolygonsPath(heightFieldCtx, polygons, hw, hh);
  heightFieldCtx.stroke();
  heightFieldCtx.fill();
  traceRoundedPolarCapsPath(heightFieldCtx, hw, hh);
  heightFieldCtx.stroke();
  heightFieldCtx.fill();
  heightFieldCtx.restore();

  const bw = bumpCanvas.width;
  const bh = bumpCanvas.height;
  bumpCtx.save();
  bumpCtx.fillStyle = '#000000';
  bumpCtx.fillRect(0, 0, bw, bh);
  bumpCtx.filter = 'blur(3px)';
  bumpCtx.lineJoin = 'round';
  bumpCtx.lineCap = 'round';
  bumpCtx.lineWidth = 4;
  bumpCtx.strokeStyle = '#CCCCCC';
  bumpCtx.fillStyle = '#FFFFFF';
  traceSmoothToyPolygonsPath(bumpCtx, polygons, bw, bh);
  bumpCtx.stroke();
  bumpCtx.fill();
  traceRoundedPolarCapsPath(bumpCtx, bw, bh);
  bumpCtx.stroke();
  bumpCtx.fill();
  bumpCtx.restore();

  // Aplicar deformación 3D en vértices de la esfera
  applySmoothToyVertexBevel(globeGeometry, baseGlobePositions, heightFieldCanvas);

  globeTexture.needsUpdate = true;
  globeBumpTexture.needsUpdate = true;
}

drawToyOceanBase(mapCtx, mapCanvas.width, mapCanvas.height);
fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json')
  .then((res) => res.json())
  .then((topology) => {
    const polygons = decodeTopoJsonLandUnwrapped(topology);
    renderPolygonsToGlobe(polygons);
  })
  .catch((err) => console.warn('Cartografía remota no disponible:', err));

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// ============================================================================
// 3.5 LETRAS DE PLASTILINA 3D EN RELIEVE + MICRO-INTERACCIÓN JELLY BOUNCE
// ============================================================================
const continentLettersRootGroup = new THREE.Group();
globeGroup.add(continentLettersRootGroup);

const continentLettersList = [];
const continentLetterColliders = [];
const letterRaycaster = new THREE.Raycaster();
const letterRayMouse = new THREE.Vector2();

function createClayLetterTexture(char) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 150px "Fredoka", "Plus Jakarta Sans", sans-serif';

  const cx = size * 0.5;
  const cy = size * 0.5;

  // 1. Sombra suave de contacto
  ctx.save();
  ctx.shadowColor = 'rgba(12, 28, 55, 0.38)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 7;
  ctx.fillStyle = '#C8BAA0';
  ctx.fillText(char, cx, cy + 3);
  ctx.restore();

  // 2. Extrusión redondeada de plastilina (borde color crema cálido/beige)
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 24;
  ctx.strokeStyle = '#DDD1BC';
  ctx.strokeText(char, cx, cy + 2);
  ctx.fillStyle = '#DDD1BC';
  ctx.fillText(char, cx, cy + 2);

  // 3. Cuerpo principal en blanco cálido/crema mate de juguete de vinilo
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#FFFDF7';
  ctx.strokeText(char, cx, cy);
  ctx.fillStyle = '#FFFDF7';
  ctx.fillText(char, cx, cy);

  // 4. Brillo biselado acolchado superior-izquierdo
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.strokeText(char, cx - 2, cy - 3);

  // 5. Acabado táctil mate sutil
  for (let i = 0; i < 35; i++) {
    const rx = cx + (Math.random() - 0.5) * 110;
    const ry = cy + (Math.random() - 0.5) * 110;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
    ctx.beginPath();
    ctx.arc(rx, ry, 2 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { canvas, tex };
}

function createCurvedLetterGeometry(w = 0.34, h = 0.34) {
  const geom = new THREE.PlaneGeometry(w, h, 6, 6);
  const pos = geom.attributes.position;
  // Curvar la placa para que se adhiera físicamente a la curvatura esférica de la Tierra
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const rSq = vx * vx + vy * vy;
    pos.setZ(i, -rSq / (2 * GLOBE_RADIUS));
  }
  geom.computeVertexNormals();
  return geom;
}

const CONTINENT_WORDS_DATA = [
  { text: 'América',    lat: 10.0,  lon: -73.0, rot: -0.32, charSpacing: 4.8 },
  { text: 'Europa',     lat: 51.5,  lon: 16.0,  rot: -0.06, charSpacing: 4.6 },
  { text: 'África',     lat: 7.0,   lon: 21.0,  rot: 0.0,   charSpacing: 4.8 },
  { text: 'Asia',       lat: 46.0,  lon: 90.0,  rot: 0.05,  charSpacing: 5.2 },
  { text: 'Oceanía',    lat: -24.5, lon: 134.5, rot: -0.05, charSpacing: 4.6 },
  { text: 'Polo Norte', lat: 82.5,  lon: -25.0, rot: 0.0,   charSpacing: 4.0 },
  { text: 'Polo Sur',   lat: -82.5, lon: 25.0,  rot: 0.0,   charSpacing: 4.0 }
];

CONTINENT_WORDS_DATA.forEach((wordDef) => {
  const chars = wordDef.text.split('');
  const totalChars = chars.length;
  const wordSiblings = [];

  chars.forEach((char, idx) => {
    if (char === ' ') return; // Espacio sin mesh

    const letterGroup = new THREE.Group();
    continentLettersRootGroup.add(letterGroup);

    // Calcular la posición angular sobre el arco del globo
    const offset = idx - (totalChars - 1) * 0.5;
    const radLat = (wordDef.lat * Math.PI) / 180;
    const cosLat = Math.max(Math.cos(radLat), 0.18);
    const dLon = (Math.cos(wordDef.rot) * wordDef.charSpacing * offset) / cosLat;
    const dLat = Math.sin(wordDef.rot) * wordDef.charSpacing * offset;

    const charLat = wordDef.lat + dLat;
    const charLon = wordDef.lon + dLon;

    // Radio ligeramente por encima del relieve del continente
    const R_LETTER = GLOBE_RADIUS + 0.052;
    const pos = latLonToVector3(charLat, charLon, R_LETTER);
    letterGroup.position.copy(pos);

    // Orientación física tangente a la normal esférica en su lat/lon
    const normal = pos.clone().normalize();
    let north = new THREE.Vector3(0, 1, 0).sub(normal.clone().multiplyScalar(normal.y));
    if (north.lengthSq() < 0.0001) {
      north = new THREE.Vector3(0, 0, normal.y > 0 ? -1 : 1);
    } else {
      north.normalize();
    }
    const east = new THREE.Vector3().crossVectors(north, normal).normalize();

    const right = east.clone().multiplyScalar(Math.cos(wordDef.rot)).add(north.clone().multiplyScalar(Math.sin(wordDef.rot))).normalize();
    const up = new THREE.Vector3().crossVectors(normal, right).normalize();

    const rotMatrix = new THREE.Matrix4().makeBasis(right, up, normal);
    letterGroup.quaternion.setFromRotationMatrix(rotMatrix);

    // Malla física 3D de la letra
    const { tex } = createClayLetterTexture(char);
    const curvedGeom = createCurvedLetterGeometry(0.36, 0.36);

    const letterMat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      roughness: 0.72,
      metalness: 0.04,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const letterMesh = new THREE.Mesh(curvedGeom, letterMat);
    letterMesh.castShadow = true;
    letterGroup.add(letterMesh);

    // Colisionador invisible para hover sin cambiar cursor
    const colliderGeom = new THREE.SphereGeometry(0.22, 6, 6);
    const colliderMat = new THREE.MeshBasicMaterial({ visible: false });
    const colliderMesh = new THREE.Mesh(colliderGeom, colliderMat);
    letterGroup.add(colliderMesh);

    const letterEntry = {
      char,
      group: letterGroup,
      mesh: letterMesh,
      scale: letterGroup.scale,
      velX: 0,
      velY: 0,
      velZ: 0,
      isBouncing: false,
      lastTrigger: 0,
      indexInWord: idx,
      siblings: wordSiblings
    };

    colliderMesh.userData = { letterRef: letterEntry };
    continentLetterColliders.push(colliderMesh);
    continentLettersList.push(letterEntry);
    wordSiblings.push(letterEntry);
  });
});

// Reacción física "Jelly Bounce" tipo squash & stretch con rebote de plastilina/gelatina
function triggerJellyBounce(letterEntry) {
  const now = performance.now();
  if (now - letterEntry.lastTrigger < 260) return;
  letterEntry.lastTrigger = now;
  letterEntry.isBouncing = true;

  // Impulso inicial elástico: se ensancha en X, se comprime en Y y salta en Z
  letterEntry.velX = 4.2;
  letterEntry.velY = -4.8;
  letterEntry.velZ = 3.6;

  // Onda suave letra por letra hacia las letras hermanas de la palabra
  if (letterEntry.siblings) {
    letterEntry.siblings.forEach((sib) => {
      if (sib === letterEntry) return;
      const dist = Math.abs(sib.indexInWord - letterEntry.indexInWord);
      const delay = dist * 42;
      setTimeout(() => {
        sib.isBouncing = true;
        const decay = 1 / (1 + dist * 0.45);
        sib.velX = 2.4 * decay;
        sib.velY = -2.8 * decay;
        sib.velZ = 2.0 * decay;
      }, delay);
    });
  }
}

// Detección hover en puntero (SIN cambiar cursor a pointer, manteniendo UX limpia)
renderer.domElement.addEventListener('pointermove', (e) => {
  if (currentMode !== 'GLOBE') return;
  const rect = renderer.domElement.getBoundingClientRect();
  letterRayMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  letterRayMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  letterRaycaster.setFromCamera(letterRayMouse, camera);
  const hits = letterRaycaster.intersectObjects(continentLetterColliders, false);
  if (hits.length > 0) {
    const lRef = hits[0].object.userData.letterRef;
    if (lRef) triggerJellyBounce(lRef);
  }
});

// Asegurar que las texturas tomen la tipografía Fredoka una vez descargada
if (document.fonts) {
  document.fonts.ready.then(() => {
    continentLettersList.forEach((entry) => {
      const { tex } = createClayLetterTexture(entry.char);
      entry.mesh.material.map = tex;
      entry.mesh.material.needsUpdate = true;
    });
  });
}

// Hotspots de los biomas/hábitats (100% INTACTOS como píldoras blancas flotantes interactivas)
const hotspotLayer = document.getElementById('hotspot-layer');
const globeHotspots = [];

HABITATS.forEach((hab) => {
  const pos = latLonToVector3(hab.lat, hab.lon, GLOBE_RADIUS * 1.028);
  const anchor = new THREE.Object3D();
  anchor.position.copy(pos);
  globeGroup.add(anchor);

  const pinMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.03, 0.18, 16),
    toyMaterial(hab.dotColor, 0.35)
  );
  pinMesh.lookAt(pos.clone().multiplyScalar(2));
  pinMesh.rotateX(Math.PI / 2);
  anchor.add(pinMesh);

  const el = document.createElement('div');
  el.className = 'hotspot';
  el.innerHTML = `
    <span class="hotspot-dot" style="background:${hab.dotColor}; color:${hab.dotColor}">${hab.icon}</span>
    <span>${escapeHtml(hab.name)}</span>
  `;
  el.addEventListener('click', () => enterHabitatMode(hab));
  hotspotLayer.appendChild(el);

  globeHotspots.push({ hab, anchor, el });
});

HABITATS.forEach((hab) => {
  const pos = latLonToVector3(hab.lat, hab.lon, GLOBE_RADIUS * 1.028);
  const anchor = new THREE.Object3D();
  anchor.position.copy(pos);
  globeGroup.add(anchor);

  const pinMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.03, 0.18, 16),
    toyMaterial(hab.dotColor, 0.35)
  );
  pinMesh.lookAt(pos.clone().multiplyScalar(2));
  pinMesh.rotateX(Math.PI / 2);
  anchor.add(pinMesh);

  const el = document.createElement('div');
  el.className = 'hotspot';
  el.innerHTML = `
    <span class="hotspot-dot" style="background:${hab.dotColor}; color:${hab.dotColor}">${hab.icon}</span>
    <span>${escapeHtml(hab.name)}</span>
  `;
  el.addEventListener('click', () => enterHabitatMode(hab));
  hotspotLayer.appendChild(el);

  globeHotspots.push({ hab, anchor, el });
});

// ============================================================================
// 4. ESCENARIOS ORGÁNICOS 360° Y PUNTOS DE ANCLAJE (SLOTS 1..8)
// ============================================================================
const dioramaGroup = new THREE.Group();
dioramaGroup.visible = false;
scene.add(dioramaGroup);

const terrainGroup = new THREE.Group();
const placedItemsGroup = new THREE.Group();
dioramaGroup.add(terrainGroup, placedItemsGroup);

let currentSlots = [];
let activeSlotIndex = 0;
let showSlotMarkers = true;

function buildArtisanHabitatBase(baseType, palette) {
  terrainGroup.clear();
  currentSlots.forEach((s) => s.markerEl && s.markerEl.remove());
  currentSlots = [];

  if (baseType !== 'classic_cage') {
    const woodPlinth = new THREE.Mesh(
      new THREE.CylinderGeometry(3.45, 3.6, 0.24, 48),
      toyMaterial(0x8B5A2B, 0.65)
    );
    woodPlinth.position.y = -0.12;
    woodPlinth.receiveShadow = true;
    terrainGroup.add(woodPlinth);
  }

  if (baseType === 'mountain_waterfall') {
    const mainGround = new THREE.Mesh(
      new THREE.CylinderGeometry(3.25, 3.4, 0.35, 36),
      toyMaterial(palette.groundMain, 0.6)
    );
    mainGround.position.y = 0.15;
    mainGround.receiveShadow = true;
    terrainGroup.add(mainGround);

    const peaks = [
      { x: -1.1, z: -1.1, rTop: 0.7, rBot: 1.5, h: 2.2 },
      { x:  0.3, z: -1.3, rTop: 0.5, rBot: 1.7, h: 2.7 },
      { x:  1.4, z: -0.8, rTop: 0.8, rBot: 1.4, h: 1.7 },
      { x: -1.8, z:  0.1, rTop: 0.7, rBot: 1.2, h: 1.1 }
    ];
    peaks.forEach((p) => {
      const rockMtn = new THREE.Mesh(
        new THREE.CylinderGeometry(p.rTop, p.rBot, p.h, 9),
        toyMaterial(palette.rock, 0.75)
      );
      rockMtn.position.set(p.x, 0.3 + p.h / 2, p.z);
      rockMtn.castShadow = true;
      rockMtn.receiveShadow = true;
      terrainGroup.add(rockMtn);

      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(p.rTop * 0.92, p.rTop, 0.14, 9),
        toyMaterial(palette.groundMain, 0.55)
      );
      cap.position.set(p.x, 0.3 + p.h + 0.05, p.z);
      cap.receiveShadow = true;
      terrainGroup.add(cap);
    });

    const waterfall = new THREE.Mesh(
      new RoundedBoxGeometry(0.65, 2.35, 0.25, 4, 0.08),
      toyMaterial(palette.water, 0.2)
    );
    waterfall.position.set(0.2, 1.35, -0.35);
    waterfall.rotation.x = 0.28;
    terrainGroup.add(waterfall);

    const pool = new THREE.Mesh(
      new THREE.CylinderGeometry(1.25, 1.15, 0.12, 28),
      toyMaterial(palette.water, 0.18)
    );
    pool.position.set(0.35, 0.31, 0.75);
    terrainGroup.add(pool);

    defineHabitatSlots([
      { label: '1·Pradera', x: -1.2, y: 0.33, z: 1.1, rotY: 0.3 },
      { label: '2·Orilla',  x:  0.35, y: 0.36, z: 0.85, rotY: -0.1 },
      { label: '3·Ladera',  x:  1.65, y: 0.33, z: 0.85, rotY: -0.4 },
      { label: '4·Mirador', x: -1.8,  y: 1.45, z: 0.1,  rotY: 0.5 },
      { label: '5·Cumbre',  x:  1.4,  y: 2.05, z: -0.8, rotY: -0.3 },
      { label: '6·Cima Alta', x: 0.3, y: 3.05, z: -1.3, rotY: 0.0 },
      { label: '7·Risco',   x: -1.1,  y: 2.55, z: -1.1, rotY: 0.2 },
      { label: '8·Sendero', x: -0.35, y: 0.33, z: 1.95, rotY: 0.1 }
    ]);

  } else if (baseType === 'oasis_dunes') {
    const sandBase = new THREE.Mesh(
      new THREE.CylinderGeometry(3.3, 3.45, 0.35, 40),
      toyMaterial(palette.groundMain, 0.65)
    );
    sandBase.position.y = 0.15;
    sandBase.receiveShadow = true;
    terrainGroup.add(sandBase);

    const dunes = [
      { x: -1.5, z: -1.0, sx: 1.6, sy: 0.75, sz: 1.2 },
      { x:  1.4, z: -1.1, sx: 1.7, sy: 0.90, sz: 1.3 },
      { x: -1.8, z:  0.8, sx: 1.3, sy: 0.55, sz: 1.2 },
      { x:  1.8, z:  0.9, sx: 1.4, sy: 0.60, sz: 1.1 }
    ];
    dunes.forEach((d) => {
      const duneGeo = new THREE.SphereGeometry(1.0, 28, 20);
      duneGeo.scale(d.sx, d.sy, d.sz);
      const dune = new THREE.Mesh(duneGeo, toyMaterial(palette.groundSec, 0.7));
      dune.position.set(d.x, 0.25, d.z);
      dune.receiveShadow = true;
      dune.castShadow = true;
      terrainGroup.add(dune);
    });

    const lushRing = new THREE.Mesh(
      new THREE.CylinderGeometry(1.45, 1.55, 0.08, 32),
      toyMaterial(palette.foliage, 0.6)
    );
    lushRing.position.set(0.0, 0.32, 0.25);
    terrainGroup.add(lushRing);

    const oasisWater = new THREE.Mesh(
      new THREE.CylinderGeometry(1.18, 1.18, 0.11, 32),
      toyMaterial(palette.water, 0.18)
    );
    oasisWater.position.set(0.0, 0.33, 0.25);
    terrainGroup.add(oasisWater);

    defineHabitatSlots([
      { label: '1·Oasis',     x: -0.85, y: 0.35, z: 0.85, rotY: 0.4 },
      { label: '2·Charca',    x:  0.20, y: 0.37, z: 0.35, rotY: -0.1 },
      { label: '3·Orilla',    x:  1.05, y: 0.35, z: 0.65, rotY: -0.4 },
      { label: '4·Duna Sur',  x: -1.75, y: 0.76, z: 0.80, rotY: 0.5 },
      { label: '5·Duna Este', x:  1.75, y: 0.80, z: 0.85, rotY: -0.5 },
      { label: '6·Cresta NO', x: -1.45, y: 0.96, z: -1.0, rotY: 0.25 },
      { label: '7·Cresta NE', x:  1.35, y: 1.10, z: -1.1, rotY: -0.3 },
      { label: '8·Entrada',   x:  0.00, y: 0.33, z: 2.05, rotY: 0.0 }
    ]);

  } else if (baseType === 'river_valley') {
    const valleyBase = new THREE.Mesh(
      new THREE.CylinderGeometry(3.3, 3.45, 0.32, 40),
      toyMaterial(palette.water, 0.2)
    );
    valleyBase.position.y = 0.14;
    terrainGroup.add(valleyBase);

    [-1.45, 1.45].forEach((xBank, i) => {
      const bank = new THREE.Mesh(
        new THREE.CylinderGeometry(1.75, 1.95, 0.45, 28),
        toyMaterial(palette.groundMain, 0.6)
      );
      bank.scale.set(0.95, 1, 1.45);
      bank.position.set(xBank, 0.32, i === 0 ? -0.15 : 0.15);
      bank.receiveShadow = true;
      bank.castShadow = true;
      terrainGroup.add(bank);
    });

    const hill = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 24, 18),
      toyMaterial(palette.groundSec, 0.65)
    );
    hill.scale.set(1.2, 0.75, 0.9);
    hill.position.set(-1.35, 0.45, -1.1);
    terrainGroup.add(hill);

    const bridge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.26, 1.65, 12),
      toyMaterial(0x78350F, 0.75)
    );
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.52, -0.1);
    bridge.castShadow = true;
    terrainGroup.add(bridge);

    defineHabitatSlots([
      { label: '1·Ribera Izq', x: -1.35, y: 0.55, z: 0.95, rotY: 0.35 },
      { label: '2·Puente Río', x:  0.00, y: 0.76, z: -0.1, rotY: 0.0 },
      { label: '3·Ribera Der', x:  1.45, y: 0.55, z: 0.95, rotY: -0.35 },
      { label: '4·Río Agua',   x:  0.05, y: 0.31, z: 1.25, rotY: 0.1 },
      { label: '5·Colina Alta',x: -1.35, y: 1.42, z: -1.1, rotY: 0.2 },
      { label: '6·Bosque Der', x:  1.55, y: 0.55, z: -0.85, rotY: -0.4 },
      { label: '7·Orilla Norte',x: 0.00, y: 0.31, z: -1.45, rotY: 0.0 },
      { label: '8·Prado Sur',  x: -1.15, y: 0.55, z: 1.85, rotY: 0.2 }
    ]);

  } else if (baseType === 'volcanic_island') {
    const seaBase = new THREE.Mesh(
      new THREE.CylinderGeometry(3.35, 3.45, 0.28, 40),
      toyMaterial(palette.water, 0.2)
    );
    seaBase.position.y = 0.12;
    terrainGroup.add(seaBase);

    const beach = new THREE.Mesh(
      new THREE.CylinderGeometry(2.75, 2.95, 0.24, 36),
      toyMaterial(0xFDE68A, 0.65)
    );
    beach.position.y = 0.24;
    beach.receiveShadow = true;
    terrainGroup.add(beach);

    const jungleIsland = new THREE.Mesh(
      new THREE.CylinderGeometry(2.35, 2.55, 0.32, 32),
      toyMaterial(palette.groundMain, 0.58)
    );
    jungleIsland.position.y = 0.38;
    jungleIsland.receiveShadow = true;
    terrainGroup.add(jungleIsland);

    const volcanoCone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 1.65, 2.1, 12),
      toyMaterial(palette.rock, 0.75)
    );
    volcanoCone.position.set(0, 1.45, -0.95);
    volcanoCone.castShadow = true;
    terrainGroup.add(volcanoCone);

    const lavaPool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.08, 12),
      new THREE.MeshBasicMaterial({ color: 0xF97316 })
    );
    lavaPool.position.set(0, 2.48, -0.95);
    terrainGroup.add(lavaPool);

    defineHabitatSlots([
      { label: '1·Selva Izq', x: -1.25, y: 0.54, z: 0.65, rotY: 0.3 },
      { label: '2·Centro Isla', x: 0.0, y: 0.54, z: 0.85, rotY: 0.0 },
      { label: '3·Selva Der', x:  1.25, y: 0.54, z: 0.65, rotY: -0.3 },
      { label: '4·Playa Sur', x: -0.75, y: 0.36, z: 2.15, rotY: 0.2 },
      { label: '5·Playa Este',x:  1.85, y: 0.36, z: 1.45, rotY: -0.4 },
      { label: '6·Falda Volcán', x: -1.45, y: 0.54, z: -0.75, rotY: 0.4 },
      { label: '7·Ladera Este',  x:  1.45, y: 0.54, z: -0.75, rotY: -0.4 },
      { label: '8·Cráter Alto',  x:  0.0,  y: 2.52, z: -0.95, rotY: 0.0 }
    ]);

  } else {
    const outerBase = new THREE.Mesh(
      new RoundedBoxGeometry(5.2, 0.36, 3.8, 4, 0.08),
      toyMaterial(0x8B4C39, 0.65)
    );
    outerBase.position.set(0, 0, 0.25);
    outerBase.receiveShadow = true;
    terrainGroup.add(outerBase);

    const greenFloor = new THREE.Mesh(
      new RoundedBoxGeometry(4.75, 0.22, 3.35, 4, 0.05),
      toyMaterial(palette.groundMain, 0.55)
    );
    greenFloor.position.set(0, 0.16, 0.28);
    greenFloor.receiveShadow = true;
    terrainGroup.add(greenFloor);

    const backWall = new THREE.Mesh(
      new RoundedBoxGeometry(5.1, 3.1, 0.28, 4, 0.05),
      toyMaterial(0x8B4C39, 0.65)
    );
    backWall.position.set(0, 1.6, -1.48);
    terrainGroup.add(backWall);

    [-2.42, 2.42].forEach((xSide) => {
      const fenceMat = toyMaterial(0x9CA3AF, 0.5);
      for (let z = -1.2; z <= 1.85; z += 0.75) {
        const post = new THREE.Mesh(new RoundedBoxGeometry(0.14, 1.25, 0.14, 2, 0.03), fenceMat);
        post.position.set(xSide, 0.75, z);
        terrainGroup.add(post);
      }
      [0.55, 0.95, 1.25].forEach((yBar) => {
        const rail = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.09, 3.2, 2, 0.02), fenceMat);
        rail.position.set(xSide, yBar, 0.32);
        terrainGroup.add(rail);
      });
    });

    defineHabitatSlots([
      { label: '1·Izq',    x: -1.35, y: 0.28, z: 0.15, rotY: 0.3 },
      { label: '2·Centro', x:  0.00, y: 0.28, z: 0.25, rotY: 0.0 },
      { label: '3·Der',    x:  1.35, y: 0.28, z: 0.15, rotY: -0.3 },
      { label: '4·Frente I', x: -1.1, y: 0.28, z: 1.25, rotY: 0.2 },
      { label: '5·Frente C', x:  0.2, y: 0.28, z: 1.30, rotY: -0.1 },
      { label: '6·Frente D', x:  1.4, y: 0.28, z: 1.20, rotY: -0.3 },
      { label: '7·Fondo I',  x: -1.45, y: 0.28, z: -0.85, rotY: 0.4 },
      { label: '8·Fondo D',  x:  1.25, y: 0.28, z: -0.85, rotY: -0.4 }
    ]);
  }
}

function defineHabitatSlots(slotDefs) {
  slotDefs.forEach((def, idx) => {
    const anchor3D = new THREE.Object3D();
    anchor3D.position.set(def.x, def.y, def.z);
    terrainGroup.add(anchor3D);

    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.24, 0.32, 24),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
    );
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.02;
    anchor3D.add(ringMesh);

    const markerEl = document.createElement('div');
    markerEl.className = 'slot-marker' + (idx === activeSlotIndex ? ' active-slot' : '');
    markerEl.textContent = idx + 1;
    markerEl.title = `Punto ${def.label}`;
    markerEl.addEventListener('click', (e) => {
      e.stopPropagation();
      selectSlotIndex(idx);
    });
    hotspotLayer.appendChild(markerEl);

    currentSlots.push({
      index: idx,
      label: def.label,
      pos: new THREE.Vector3(def.x, def.y, def.z),
      rotY: def.rotY || 0,
      anchor3D,
      markerEl
    });
  });
}

function selectSlotIndex(idx) {
  activeSlotIndex = idx;
  currentSlots.forEach((s, i) => {
    if (s.markerEl) s.markerEl.classList.toggle('active-slot', i === activeSlotIndex);
  });
  const found = placedItems.find((entry) => entry.slotIndex === idx);
  if (found) selectPlacedItem(found);
}

// ============================================================================
// 5. CONSTRUCTORES 3D DE FAUNA Y MINI-HÁBITATS
// ============================================================================
function createAnimalOrDinoMesh(item) {
  const group = new THREE.Group();
  const bodyMat = toyMaterial(item.color, 0.5);
  const accentMat = toyMaterial(item.accent, 0.55);
  const whiteMat = toyMaterial(0xFFFFFF, 0.2);
  const pupilMat = toyMaterial(0x0F172A, 0.15);

  function addToyEyes(parent, yPos, zPos, xSpread = 0.22) {
    [-xSpread, xSpread].forEach((xEye) => {
      const w = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), whiteMat);
      w.position.set(xEye, yPos, zPos);
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), pupilMat);
      p.position.set(xEye * 1.05, yPos, zPos + 0.045);
      parent.add(w, p);
    });
  }

  if (item.kind === 'giraffe') {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.36, 0.62, 4, 0.08), bodyMat);
    body.position.set(0, 0.42, 0);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 0.78, 12), bodyMat);
    neck.position.set(0, 0.85, 0.22);
    neck.rotation.x = 0.25;
    const head = new THREE.Mesh(new RoundedBoxGeometry(0.28, 0.24, 0.36, 4, 0.06), bodyMat);
    head.position.set(0, 1.22, 0.36);
    addToyEyes(group, 1.24, 0.48, 0.13);
    [[-0.14, 0.2], [0.14, 0.2], [-0.14, -0.2], [0.14, -0.2]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.38, 10), accentMat);
      leg.position.set(lx, 0.19, lz);
      group.add(leg);
    });
    group.add(body, neck, head);
  } else if (item.kind === 'elephant') {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.58, 0.48, 0.68, 5, 0.12), bodyMat);
    body.position.set(0, 0.38, -0.05);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18), bodyMat);
    head.position.set(0, 0.52, 0.32);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.38, 10), bodyMat);
    trunk.position.set(0, 0.35, 0.56);
    trunk.rotation.x = -0.5;
    [-0.32, 0.32].forEach((xEar) => {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 16), bodyMat);
      ear.rotation.z = Math.PI / 2;
      ear.position.set(xEar, 0.52, 0.25);
      group.add(ear);
    });
    addToyEyes(group, 0.56, 0.52, 0.16);
    group.add(body, head, trunk);
  } else if (item.kind === 'mammal_mane') {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.36, 0.62, 4, 0.09), bodyMat);
    body.position.set(0, 0.28, -0.08);
    const mane = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 1), accentMat);
    mane.position.set(0, 0.44, 0.26);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), bodyMat);
    head.position.set(0, 0.44, 0.34);
    addToyEyes(group, 0.47, 0.50, 0.12);
    group.add(body, mane, head);
  } else if (item.kind === 'bird' || item.kind === 'penguin') {
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.22, 8, 16), bodyMat);
    body.position.set(0, 0.32, 0);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 10), accentMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.42, 0.28);
    addToyEyes(group, 0.44, 0.16, 0.12);
    group.add(body, beak);
  } else {
    const segSizes = [0.26, 0.22, 0.17];
    segSizes.forEach((r, idx) => {
      const seg = new THREE.Mesh(new RoundedBoxGeometry(r * 1.85, r * 1.45, r * 1.55, 4, 0.08), bodyMat);
      seg.position.set(0, r * 0.85, -idx * 0.26);
      group.add(seg);
      if (item.kind === 'ankylo' || item.kind === 'camel') {
        const hump = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), accentMat);
        hump.position.set(0, r * 1.6, -idx * 0.24);
        group.add(hump);
      }
    });
    const head = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.42, 0.52, 5, 0.11), bodyMat);
    head.position.set(0, 0.35, 0.32);
    group.add(head);
    addToyEyes(group, 0.38, 0.52, 0.19);
  }

  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return group;
}

function createExtraPropMesh(propItem) {
  const group = new THREE.Group();
  if (propItem.kind === 'palm' || propItem.kind === 'acacia') {
    const trunkMat = toyMaterial(0x7C3F1C, 0.7);
    const leafMat = toyMaterial(propItem.color, 0.5);
    for (let i = 0; i < 6; i++) {
      const t = i / 6;
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.13 - t * 0.03, 0.16 - t * 0.03, 0.26, 10), trunkMat);
      seg.position.set(Math.sin(t) * 0.18, 0.13 + i * 0.22, 0);
      group.add(seg);
    }
    if (propItem.kind === 'acacia') {
      const flatCanopy = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.75, 0.24, 16), leafMat);
      flatCanopy.position.set(0.18, 1.5, 0);
      group.add(flatCanopy);
    } else {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const frond = new THREE.Mesh(new RoundedBoxGeometry(0.75, 0.07, 0.24, 3, 0.03), leafMat);
        frond.position.set(0.15 + Math.cos(a) * 0.34, 1.45, Math.sin(a) * 0.34);
        frond.rotation.y = -a;
        frond.rotation.z = -0.3;
        group.add(frond);
      }
    }
  } else if (propItem.kind === 'pine') {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.5, 10), toyMaterial(0x5C3A21));
    trunk.position.y = 0.25;
    group.add(trunk);
    [0.65, 1.05, 1.4].forEach((y, i) => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.65 - i * 0.14, 0.65, 10), toyMaterial(propItem.color));
      cone.position.y = y;
      group.add(cone);
    });
  } else if (propItem.kind === 'volcano') {
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.65, 0.95, 10), toyMaterial(0x5C2C16, 0.75));
    cone.position.y = 0.47;
    const lava = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshBasicMaterial({ color: 0xF97316 }));
    lava.position.y = 0.92;
    group.add(cone, lava);
  } else if (propItem.kind === 'arch' || propItem.kind === 'ice_cave') {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.18, 12, 20, Math.PI), toyMaterial(propItem.color, 0.5));
    arch.position.y = 0.1;
    group.add(arch);
  } else if (propItem.kind === 'cactus') {
    const main = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.75, 8, 12), toyMaterial(propItem.color));
    main.position.y = 0.45;
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.35, 8, 12), toyMaterial(propItem.color));
    arm.position.set(0.22, 0.55, 0);
    arm.rotation.z = -0.5;
    group.add(main, arm);
  } else {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 0), toyMaterial(propItem.color, 0.75));
    rock.position.y = 0.26;
    rock.scale.set(1.25, 0.75, 1.0);
    group.add(rock);
  }

  group.traverse((c) => {
    if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; }
  });
  return group;
}

// ============================================================================
// 6. LÓGICA DEL CONFIGURADOR 3D (AÑADIR, QUITAR, GIRAR, CARGAR .GLB/.STL)
// ============================================================================
let currentMode = 'GLOBE';
let activeHabitat = HABITATS[0];
let activeMiniTab = 'figures';
let placedItems = [];
let selectedEntry = null;
let uidCounter = 1;

const BIOME_SKY_GRADIENTS = {
  savanna: 'linear-gradient(180deg, #FDE68A 0%, #BAE6FD 52%, #FEF3C7 100%)',
  cretaceous: 'linear-gradient(180deg, #FDBA74 0%, #FED7AA 50%, #FEF08A 100%)',
  amazon: 'linear-gradient(180deg, #6EE7B7 0%, #A7F3D0 50%, #FEF9C3 100%)',
  sahara: 'linear-gradient(180deg, #FCD34D 0%, #FDE68A 55%, #FFEDD5 100%)',
  rockies: 'linear-gradient(180deg, #7DD3FC 0%, #E0F2FE 55%, #DCFCE7 100%)',
  arctic: 'linear-gradient(180deg, #BAE6FD 0%, #E0F2FE 55%, #F8FAFC 100%)'
};

function enterHabitatMode(habitat) {
  currentMode = 'HABITAT';
  activeHabitat = habitat;

  const frameEl = document.querySelector('.explorer-frame');
  if (frameEl && BIOME_SKY_GRADIENTS[habitat.id]) {
    frameEl.style.background = BIOME_SKY_GRADIENTS[habitat.id];
  }

  document.getElementById('stage-mode-icon').textContent = habitat.icon;
  document.getElementById('stage-mode-text').textContent = `Hábitat 3D: ${habitat.name}`;
  document.getElementById('habitat-badge').textContent = habitat.badge;
  document.getElementById('habitat-title').textContent = habitat.name;
  document.getElementById('habitat-zoo-note').textContent = habitat.zooNote;
  document.getElementById('base-style-select').value = habitat.defaultBaseType;

  document.getElementById('configurator-panel').classList.add('active');
  document.getElementById('btn-back-globe').style.display = 'inline-flex';
  document.getElementById('btn-toggle-slots').style.display = 'inline-flex';
  document.getElementById('globe-hint').style.opacity = '0';

  globeHotspots.forEach((h) => { h.el.style.display = 'none'; });

  globeGroup.visible = false;
  dioramaGroup.visible = true;
  controls.autoRotate = false;
  document.getElementById('cam-autorotate').classList.remove('active-toggle');

  buildArtisanHabitatBase(habitat.defaultBaseType, habitat.palette);
  clearAllPlacedItems();

  habitat.defaultFigures.forEach((fId) => {
    const f = CATALOG_FIGURES.find((x) => x.id === fId);
    if (f) addItemToHabitat(f, 'figures');
  });
  habitat.defaultProps.forEach((pId) => {
    const p = CATALOG_PROPS.find((x) => x.id === pId);
    if (p) addItemToHabitat(p, 'props');
  });

  animateCameraTo(new THREE.Vector3(0, 4.3, 7.2), new THREE.Vector3(0, 0.8, 0), 650);
  renderMiniCatalog();
  updateConfiguratorPricing();
}

function returnToGlobeMode() {
  currentMode = 'GLOBE';
  deselectPlacedItem();
  const frameEl = document.querySelector('.explorer-frame');
  if (frameEl) {
    frameEl.style.background = 'linear-gradient(180deg, #7DD3FC 0%, #BAE6FD 48%, #E0F2FE 78%, #FEF9C3 100%)';
  }
  document.getElementById('stage-mode-icon').textContent = '🌍';
  document.getElementById('stage-mode-text').textContent = 'Modo Globo Terráqueo Infantil · 6 Biomas Activos';
  document.getElementById('configurator-panel').classList.remove('active');
  document.getElementById('btn-back-globe').style.display = 'none';
  document.getElementById('btn-toggle-slots').style.display = 'none';
  document.getElementById('globe-hint').style.opacity = '1';

  currentSlots.forEach((s) => { if (s.markerEl) s.markerEl.style.display = 'none'; });
  globeHotspots.forEach((h) => { h.el.style.display = 'flex'; });

  dioramaGroup.visible = false;
  globeGroup.visible = true;

  animateCameraTo(new THREE.Vector3(0, 2.1, 10.2), new THREE.Vector3(0, 0, 0), 650);
}

function findTargetSlotIndex() {
  const occupiedSet = new Set(placedItems.map((x) => x.slotIndex));
  if (!occupiedSet.has(activeSlotIndex) && currentSlots[activeSlotIndex]) {
    return activeSlotIndex;
  }
  return currentSlots.findIndex((_, i) => !occupiedSet.has(i));
}

function addItemToHabitat(item, category) {
  const slotIdx = findTargetSlotIndex();
  if (slotIdx === -1) {
    showToast('⚠️ Los 8 puntos del hábitat están ocupados. Usa el botón "−" o la pestaña "Quitar" para liberar un hueco.');
    return;
  }

  const slot = currentSlots[slotIdx];
  const mesh = category === 'figures' ? createAnimalOrDinoMesh(item) : createExtraPropMesh(item);
  mesh.position.copy(slot.pos);
  mesh.rotation.y = slot.rotY;

  const entry = {
    uid: uidCounter++,
    category,
    item,
    slotIndex: slotIdx,
    mesh
  };
  mesh.userData = { entry };

  placedItemsGroup.add(mesh);
  placedItems.push(entry);

  const nextFree = findTargetSlotIndex();
  if (nextFree !== -1) activeSlotIndex = nextFree;

  selectPlacedItem(entry);
  renderMiniCatalog();
  updateConfiguratorPricing();
}

function removeEntryByUid(uid) {
  const idx = placedItems.findIndex((x) => x.uid === uid);
  if (idx === -1) return;
  const entry = placedItems[idx];
  placedItemsGroup.remove(entry.mesh);
  placedItems.splice(idx, 1);

  if (selectedEntry && selectedEntry.uid === uid) deselectPlacedItem();
  activeSlotIndex = entry.slotIndex;
  renderMiniCatalog();
  updateConfiguratorPricing();
}

function removeOneByItemId(itemId) {
  for (let i = placedItems.length - 1; i >= 0; i--) {
    if (placedItems[i].item.id === itemId) {
      removeEntryByUid(placedItems[i].uid);
      return;
    }
  }
}

function clearAllPlacedItems() {
  placedItemsGroup.clear();
  placedItems = [];
  deselectPlacedItem();
  activeSlotIndex = 0;
  renderMiniCatalog();
  updateConfiguratorPricing();
}

function selectPlacedItem(entry) {
  selectedEntry = entry;
  const toolbar = document.getElementById('selection-toolbar');
  document.getElementById('sel-item-name').textContent = `${entry.item.emoji} ${entry.item.name} (Punto ${entry.slotIndex + 1})`;
  toolbar.classList.add('visible');
}

function deselectPlacedItem() {
  selectedEntry = null;
  document.getElementById('selection-toolbar').classList.remove('visible');
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

renderer.domElement.addEventListener('pointerdown', (e) => {
  if (currentMode !== 'HABITAT') return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(placedItemsGroup.children, true);
  if (hits.length > 0) {
    let obj = hits[0].object;
    while (obj.parent && obj.parent !== placedItemsGroup) {
      obj = obj.parent;
    }
    if (obj.userData && obj.userData.entry) {
      selectPlacedItem(obj.userData.entry);
      selectSlotIndex(obj.userData.entry.slotIndex);
    }
  }
});

document.getElementById('sel-rotate-left').addEventListener('click', () => {
  if (selectedEntry) selectedEntry.mesh.rotation.y -= Math.PI / 4;
});
document.getElementById('sel-rotate-right').addEventListener('click', () => {
  if (selectedEntry) selectedEntry.mesh.rotation.y += Math.PI / 4;
});
document.getElementById('sel-scale-up').addEventListener('click', () => {
  if (selectedEntry) {
    const s = selectedEntry.mesh.scale.x > 1.25 ? 0.85 : selectedEntry.mesh.scale.x + 0.15;
    selectedEntry.mesh.scale.setScalar(s);
  }
});
document.getElementById('sel-delete').addEventListener('click', () => {
  if (selectedEntry) removeEntryByUid(selectedEntry.uid);
});
document.getElementById('sel-move-slot').addEventListener('change', (e) => {
  const newSlotIdx = parseInt(e.target.value, 10);
  e.target.value = '';
  if (!selectedEntry || Number.isNaN(newSlotIdx) || !currentSlots[newSlotIdx]) return;
  const targetSlot = currentSlots[newSlotIdx];
  selectedEntry.slotIndex = newSlotIdx;
  selectedEntry.mesh.position.copy(targetSlot.pos);
  selectedEntry.mesh.rotation.y = targetSlot.rotY;
  selectPlacedItem(selectedEntry);
  renderMiniCatalog();
  updateConfiguratorPricing();
});
document.getElementById('sel-close').addEventListener('click', deselectPlacedItem);

document.getElementById('base-style-select').addEventListener('change', (e) => {
  const newBaseType = e.target.value;
  const saved = placedItems.map((x) => ({ item: x.item, category: x.category }));
  buildArtisanHabitatBase(newBaseType, activeHabitat.palette);
  clearAllPlacedItems();
  saved.forEach((s) => addItemToHabitat(s.item, s.category));
  showToast('🏔️ Escenario base actualizado manteniendo tus figuras.');
});

const gltfLoader = new GLTFLoader();
const stlLoader = new STLLoader();

document.getElementById('artisan-file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const MAX_MB = 25;
  if (file.size > MAX_MB * 1024 * 1024) {
    showToast(`⚠️ El archivo supera el límite de seguridad de ${MAX_MB} MB.`);
    e.target.value = '';
    return;
  }

  const url = URL.createObjectURL(file);
  const ext = file.name.split('.').pop().toLowerCase();

  const applyCustomBase = (meshObj, formatLabel) => {
    URL.revokeObjectURL(url);
    terrainGroup.clear();
    currentSlots.forEach((s) => s.markerEl && s.markerEl.remove());
    currentSlots = [];
    terrainGroup.add(meshObj);
    defineHabitatSlots([
      { label: '1·Base Izq', x: -1.2, y: 0.45, z: 0.8, rotY: 0.3 },
      { label: '2·Centro',   x:  0.0, y: 0.45, z: 0.8, rotY: 0.0 },
      { label: '3·Base Der', x:  1.2, y: 0.45, z: 0.8, rotY: -0.3 },
      { label: '4·Frente I', x: -0.9, y: 0.40, z: 1.5, rotY: 0.2 },
      { label: '5·Frente D', x:  0.9, y: 0.40, z: 1.5, rotY: -0.2 },
      { label: '6·Alto Izq', x: -1.1, y: 1.15, z: -0.6, rotY: 0.3 },
      { label: '7·Cumbre',   x:  0.0, y: 1.35, z: -0.8, rotY: 0.0 },
      { label: '8·Alto Der', x:  1.1, y: 1.15, z: -0.6, rotY: -0.3 }
    ]);
    updateConfiguratorPricing();
    showToast(`✅ Hábitat "${escapeHtml(file.name)}" (${formatLabel}) cargado con 8 puntos activos.`);
    e.target.value = '';
  };

  const handleLoadError = () => {
    URL.revokeObjectURL(url);
    showToast('❌ No se pudo procesar el archivo 3D. Verifica que sea un .GLB o .STL válido.');
    e.target.value = '';
  };

  if (ext === 'stl') {
    stlLoader.load(url, (geometry) => {
      geometry.computeVertexNormals();
      geometry.center();
      const box = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position);
      const size = box.getSize(new THREE.Vector3());
      const scale = 4.8 / (Math.max(size.x, size.y, size.z) || 1);

      const customMesh = new THREE.Mesh(geometry, toyMaterial(activeHabitat.palette.groundMain, 0.55));
      customMesh.scale.setScalar(scale);
      customMesh.position.y = 0.6;
      customMesh.castShadow = true;
      customMesh.receiveShadow = true;
      applyCustomBase(customMesh, 'STL');
    }, undefined, handleLoadError);
  } else {
    gltfLoader.load(url, (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      model.scale.setScalar(4.8 / (Math.max(size.x, size.y, size.z) || 1));
      applyCustomBase(model, 'GLB');
    }, undefined, handleLoadError);
  }
});

function renderMiniCatalog() {
  const grid = document.getElementById('mini-catalog-grid');
  grid.innerHTML = '';

  if (activeMiniTab === 'placed') {
    const listWrap = document.createElement('div');
    listWrap.className = 'placed-list';
    if (placedItems.length === 0) {
      listWrap.innerHTML = `<div style="text-align:center;padding:18px;color:#64748B;font-size:0.78rem;">Tu hábitat está vacío. Añade figuras o extras desde las otras pestañas.</div>`;
    } else {
      placedItems.forEach((entry) => {
        const row = document.createElement('div');
        row.className = 'placed-item-row';
        row.innerHTML = `
          <div style="display:flex;align-items:center;gap:6px;font-weight:700;">
            <span>${entry.item.emoji}</span>
            <div>
              <div>${escapeHtml(entry.item.name)}</div>
              <div style="font-size:0.66rem;color:#64748B;">Punto ${entry.slotIndex + 1} · ${entry.item.price.toFixed(2)}€</div>
            </div>
          </div>
          <div style="display:flex;gap:4px;">
            <button class="mini-action-btn rot-btn">↻</button>
            <button class="mini-action-btn delete del-btn">✕ Quitar</button>
          </div>
        `;
        row.querySelector('.rot-btn').addEventListener('click', () => {
          entry.mesh.rotation.y += Math.PI / 4;
          selectPlacedItem(entry);
        });
        row.querySelector('.del-btn').addEventListener('click', () => {
          removeEntryByUid(entry.uid);
        });
        listWrap.appendChild(row);
      });
    }
    grid.appendChild(listWrap);
    return;
  }

  const list = activeMiniTab === 'figures' ? CATALOG_FIGURES : CATALOG_PROPS;
  list.forEach((item) => {
    const count = placedItems.filter((x) => x.item.id === item.id).length;
    const card = document.createElement('div');
    card.className = 'mini-card' + (count > 0 ? ' has-items' : '');
    const hexStr = '#' + item.color.toString(16).padStart(6, '0');

    card.innerHTML = `
      <div class="mini-preview" style="background:${hexStr}22">
        ${count > 0 ? `<span class="qty-badge">${count}</span>` : ''}
        <span>${item.emoji}</span>
      </div>
      <div style="font-size:0.74rem;font-weight:800;line-height:1.15;">${escapeHtml(item.name)}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:0.74rem;font-weight:800;color:#10B981;">${item.price.toFixed(2)}€</span>
        <div class="qty-btns">
          ${count > 0 ? `<button class="qty-btn remove" title="Quitar 1">−</button>` : ''}
          <button class="qty-btn add" title="Añadir 1">+</button>
        </div>
      </div>
    `;

    card.querySelector('.mini-preview').addEventListener('click', () => addItemToHabitat(item, activeMiniTab));
    card.querySelector('.qty-btn.add').addEventListener('click', () => addItemToHabitat(item, activeMiniTab));
    const remBtn = card.querySelector('.qty-btn.remove');
    if (remBtn) remBtn.addEventListener('click', () => removeOneByItemId(item.id));
    grid.appendChild(card);
  });
}

function getConfiguredPackPrice() {
  const extrasTotal = placedItems.reduce((acc, x) => acc + x.item.price, 0);
  return activeHabitat.basePrice + extrasTotal;
}

function updateConfiguratorPricing() {
  const figCount = placedItems.filter((x) => x.category === 'figures').length;
  const propCount = placedItems.filter((x) => x.category === 'props').length;
  const total = getConfiguredPackPrice();

  document.getElementById('tab-count-fig').textContent = figCount;
  document.getElementById('tab-count-prop').textContent = propCount;
  document.getElementById('tab-count-all').textContent = placedItems.length;
  document.getElementById('panel-total-price').textContent = `${total.toFixed(2)}€`;
  document.getElementById('stage-pack-price').textContent = `${total.toFixed(2)}€`;

  const occupiedSet = new Set(placedItems.map((x) => x.slotIndex));
  currentSlots.forEach((s, idx) => {
    if (!s.markerEl) return;
    s.markerEl.classList.toggle('active-slot', idx === activeSlotIndex);
    s.markerEl.classList.toggle('occupied', occupiedSet.has(idx));
  });
}

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeMiniTab = btn.dataset.tab;
    renderMiniCatalog();
  });
});

document.getElementById('cam-zoom-in').addEventListener('click', () => {
  cameraAnim = null;
  const dir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();
  camera.position.addScaledVector(dir, 1.3);
  controls.update();
});
document.getElementById('cam-zoom-out').addEventListener('click', () => {
  cameraAnim = null;
  const dir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();
  camera.position.addScaledVector(dir, -1.3);
  controls.update();
});
document.getElementById('cam-reset').addEventListener('click', () => {
  if (currentMode === 'GLOBE') {
    animateCameraTo(new THREE.Vector3(0, 2.1, 10.2), new THREE.Vector3(0, 0, 0), 500);
  } else {
    animateCameraTo(new THREE.Vector3(0, 4.3, 7.2), new THREE.Vector3(0, 0.8, 0), 500);
  }
});
document.getElementById('cam-autorotate').addEventListener('click', (e) => {
  controls.autoRotate = !controls.autoRotate;
  e.currentTarget.classList.toggle('active-toggle', controls.autoRotate);
});

document.getElementById('btn-toggle-slots').addEventListener('click', (e) => {
  showSlotMarkers = !showSlotMarkers;
  e.currentTarget.textContent = showSlotMarkers ? '📍 Puntos del Hábitat (ON)' : '📍 Puntos del Hábitat (OFF)';
  currentSlots.forEach((s) => {
    if (s.markerEl) s.markerEl.style.display = showSlotMarkers ? 'grid' : 'none';
  });
});

document.getElementById('btn-back-globe').addEventListener('click', returnToGlobeMode);
document.getElementById('btn-clear-stand').addEventListener('click', clearAllPlacedItems);

// ============================================================================
// 7. SECCIÓN 2: CATÁLOGO DE TIENDA CON FILTROS, ORDENACIÓN Y CARGAR MÁS (+8)
// ============================================================================
let selectedDept = 'TODOS';
let selectedBiome = 'TODOS';
let searchQuery = '';
let onlyFlexi = false;
let onlyFeatured = false;
let sortBy = 'featured';
const PAGE_SIZE = 8;
let visibleCount = PAGE_SIZE;
let wishlistIds = new Set();

function getFilteredShopProducts() {
  return FULL_SHOP_PRODUCTS.filter((p) => {
    if (selectedDept !== 'TODOS' && p.dept !== selectedDept) return false;
    if (selectedBiome !== 'TODOS' && p.biome !== selectedBiome) return false;
    if (onlyFlexi && !p.isFlexi) return false;
    if (onlyFeatured && !p.featured) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.desc.toLowerCase().includes(q) && !p.biome.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });
}

function renderShopCatalog() {
  const filtered = getFilteredShopProducts();
  const sliced = filtered.slice(0, visibleCount);
  const grid = document.getElementById('shop-products-grid');
  grid.innerHTML = '';

  document.getElementById('catalog-visible-num').textContent = sliced.length;
  document.getElementById('catalog-total-num').textContent = filtered.length;

  sliced.forEach((prod) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const hexStr = '#' + prod.color.toString(16).padStart(6, '0');
    const isWished = wishlistIds.has(prod.id);

    card.innerHTML = `
      <div class="product-visual" style="background: linear-gradient(145deg, ${hexStr}25, ${hexStr}45);">
        <span class="product-badge">${prod.isFlexi ? '🦖 Articulado 3D' : '🌿 Hábitat Modular'}</span>
        <button class="wishlist-heart-btn" aria-label="Guardar en favoritos">${isWished ? '🌸' : '🤍'}</button>
        <span>${prod.emoji}</span>
        <button class="try-3d-pill" title="Probar este artículo en el visor 3D">✨ Probar en 3D</button>
      </div>
      <div class="product-body">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="product-biome-tag">${escapeHtml(prod.biome)}</span>
          <span style="font-size:0.75rem;font-weight:800;color:#F59E0B;">★ ${prod.rating.toFixed(1)}</span>
        </div>
        <h3 class="product-title">${escapeHtml(prod.name)}</h3>
        <p class="product-desc">${escapeHtml(prod.desc)}</p>
        <div class="product-footer">
          <span class="product-price">${prod.price.toFixed(2)}€</span>
          <button class="add-cart-btn">🛒 Añadir</button>
        </div>
      </div>
    `;

    card.querySelector('.wishlist-heart-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (wishlistIds.has(prod.id)) {
        wishlistIds.delete(prod.id);
        showToast(`🤍 "${escapeHtml(prod.name)}" eliminado de tus favoritos.`);
      } else {
        wishlistIds.add(prod.id);
        showToast(`🌸 "${escapeHtml(prod.name)}" guardado en tus favoritos.`);
      }
      document.getElementById('wishlist-count').textContent = wishlistIds.size;
      renderShopCatalog();
      renderWishlistDrawer();
    });

    card.querySelector('.try-3d-pill').addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('explorador-3d').scrollIntoView({ behavior: 'smooth' });
      const targetHab = HABITATS.find((h) => h.biomeFilter === prod.biome) || HABITATS[0];
      if (currentMode !== 'HABITAT' || activeHabitat.id !== targetHab.id) {
        enterHabitatMode(targetHab);
      }
      if (prod.refItem) {
        addItemToHabitat(prod.refItem, prod.refType);
        showToast(`✨ "${escapeHtml(prod.name)}" colocado en el visor 3D.`);
      }
    });

    card.querySelector('.add-cart-btn').addEventListener('click', () => {
      addToWooCart({
        title: prod.name,
        emoji: prod.emoji,
        price: prod.price,
        wooId: prod.wooId,
        details: `Bioma: ${prod.biome}`
      });
    });

    grid.appendChild(card);
  });

  const loadMoreBtn = document.getElementById('btn-load-more');
  const statusEl = document.getElementById('load-more-status');
  const remaining = filtered.length - sliced.length;

  if (remaining > 0) {
    loadMoreBtn.style.display = 'inline-flex';
    document.getElementById('load-more-badge').textContent = `+${Math.min(PAGE_SIZE, remaining)}`;
    statusEl.textContent = `Mostrando ${sliced.length} de ${filtered.length} artículos disponibles`;
  } else {
    loadMoreBtn.style.display = 'none';
    statusEl.textContent = filtered.length > 0
      ? `✓ Has explorado los ${filtered.length} artículos de esta selección`
      : 'No hay artículos con esos filtros. Prueba con otra combinación.';
  }
}

document.querySelectorAll('.dept-tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dept-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    selectedDept = btn.dataset.dept;
    visibleCount = PAGE_SIZE;
    renderShopCatalog();
  });
});

document.getElementById('filter-biome').addEventListener('change', (e) => {
  selectedBiome = e.target.value;
  visibleCount = PAGE_SIZE;
  renderShopCatalog();
});
document.getElementById('filter-search').addEventListener('input', (e) => {
  searchQuery = e.target.value;
  visibleCount = PAGE_SIZE;
  renderShopCatalog();
});
document.getElementById('filter-flexi').addEventListener('change', (e) => {
  onlyFlexi = e.target.checked;
  visibleCount = PAGE_SIZE;
  renderShopCatalog();
});
document.getElementById('filter-featured').addEventListener('change', (e) => {
  onlyFeatured = e.target.checked;
  visibleCount = PAGE_SIZE;
  renderShopCatalog();
});
document.getElementById('filter-sort').addEventListener('change', (e) => {
  sortBy = e.target.value;
  visibleCount = PAGE_SIZE;
  renderShopCatalog();
});
document.getElementById('btn-reset-filters').addEventListener('click', () => {
  selectedDept = 'TODOS';
  selectedBiome = 'TODOS';
  searchQuery = '';
  onlyFlexi = false;
  onlyFeatured = false;
  sortBy = 'featured';
  visibleCount = PAGE_SIZE;
  document.querySelectorAll('.dept-tab').forEach((b) => b.classList.toggle('active', b.dataset.dept === 'TODOS'));
  document.getElementById('filter-biome').value = 'TODOS';
  document.getElementById('filter-search').value = '';
  document.getElementById('filter-flexi').checked = false;
  document.getElementById('filter-featured').checked = false;
  document.getElementById('filter-sort').value = 'featured';
  renderShopCatalog();
});
document.getElementById('btn-load-more').addEventListener('click', () => {
  visibleCount += PAGE_SIZE;
  renderShopCatalog();
});

// ============================================================================
// 8. CESTA WOOCOMMERCE, DRAWER DE FAVORITOS (WISHLIST), FAQ Y LEGAL RGPD
// ============================================================================
let cartItems = [
  {
    id: 1,
    title: 'Pack Inicial Sabana del Serengueti',
    emoji: '🦁',
    price: 19.90,
    wooId: 1002,
    details: 'Hábitat 360° Oasis + Figuras'
  }
];

function renderWishlistDrawer() {
  const containerEl = document.getElementById('wishlist-items-container');
  if (!containerEl) return;
  containerEl.innerHTML = '';

  const wishedProducts = FULL_SHOP_PRODUCTS.filter((p) => wishlistIds.has(p.id));

  if (wishedProducts.length === 0) {
    containerEl.innerHTML = `
      <div style="text-align:center;padding:32px 16px;color:var(--mf-text-muted);">
        <span style="font-size:38px;display:block;margin-bottom:8px;">🌸</span>
        <strong style="color:var(--mf-vine-dark);font-size:0.95rem;">Aún no tienes favoritos</strong>
        <p style="font-size:0.78rem;margin-top:4px;">Haz clic en el icono 🌸 de cualquier figura o hábitat del catálogo para guardarlo aquí.</p>
      </div>
    `;
    return;
  }

  wishedProducts.forEach((prod) => {
    const row = document.createElement('div');
    row.style.cssText = 'background:white;border:1.5px solid var(--mf-border);border-radius:14px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:10px;box-shadow:0 2px 6px rgba(0,0,0,0.04);';
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:26px;">${prod.emoji}</span>
        <div>
          <div style="font-weight:800;font-size:0.83rem;color:var(--mf-vine-dark);">${escapeHtml(prod.name)}</div>
          <div style="font-size:0.7rem;color:var(--mf-text-muted);">${escapeHtml(prod.biome)}</div>
          <div style="font-weight:900;color:var(--mf-lagoon);font-size:0.82rem;">${prod.price.toFixed(2)}€</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;align-items:center;">
        <button class="add-from-wish-btn" title="Añadir a la cesta" style="background:var(--mf-lime);border:none;padding:6px 10px;border-radius:8px;font-weight:800;font-size:0.74rem;cursor:pointer;color:var(--mf-vine-dark);">🛒 +</button>
        <button class="remove-wish-btn mini-action-btn delete" title="Quitar de favoritos">✕</button>
      </div>
    `;

    row.querySelector('.add-from-wish-btn').addEventListener('click', () => {
      addToWooCart({
        title: prod.name,
        emoji: prod.emoji,
        price: prod.price,
        wooId: prod.wooId,
        details: `Bioma: ${prod.biome}`
      });
    });

    row.querySelector('.remove-wish-btn').addEventListener('click', () => {
      wishlistIds.delete(prod.id);
      document.getElementById('wishlist-count').textContent = wishlistIds.size;
      renderShopCatalog();
      renderWishlistDrawer();
    });

    containerEl.appendChild(row);
  });
}

// Eventos de apertura/cierre del Drawer de Favoritos
const wishlistBtn = document.getElementById('nav-wishlist-btn');
if (wishlistBtn) {
  wishlistBtn.addEventListener('click', () => {
    renderWishlistDrawer();
    document.getElementById('wishlist-drawer-backdrop').classList.add('open');
  });
}

const closeWishlistBtn = document.getElementById('close-wishlist-btn');
if (closeWishlistBtn) {
  closeWishlistBtn.addEventListener('click', () => {
    document.getElementById('wishlist-drawer-backdrop').classList.remove('open');
  });
}

const addAllWishlistBtn = document.getElementById('btn-add-all-wishlist');
if (addAllWishlistBtn) {
  addAllWishlistBtn.addEventListener('click', () => {
    const wishedProducts = FULL_SHOP_PRODUCTS.filter((p) => wishlistIds.has(p.id));
    if (wishedProducts.length === 0) {
      showToast('⚠️ No tienes artículos en favoritos para añadir.');
      return;
    }
    wishedProducts.forEach((p) => {
      cartItems.push({
        id: Date.now() + Math.random(),
        title: p.name,
        emoji: p.emoji,
        price: p.price,
        wooId: p.wooId,
        details: `Bioma: ${p.biome}`
      });
    });
    renderCartDrawer();
    document.getElementById('wishlist-drawer-backdrop').classList.remove('open');
    showToast(`🛒 ¡Se han añadido ${wishedProducts.length} artículos de tus favoritos a la cesta!`);
  });
}

function addToWooCart(newItem) {
  cartItems.push({ ...newItem, id: Date.now() + Math.random() });
  renderCartDrawer();
  showToast(`🛒 <strong>${escapeHtml(newItem.title)}</strong> añadido a tu cesta WooCommerce.`);
}

function addConfiguredHabitatToCart() {
  const total = getConfiguredPackPrice();
  const names = placedItems.map((x) => x.item.name).join(', ') || 'Base sin extras';
  addToWooCart({
    title: `Hábitat 3D: ${activeHabitat.name}`,
    emoji: activeHabitat.icon,
    price: total,
    wooId: activeHabitat.wooBaseId,
    details: `${placedItems.length} piezas (${names})`
  });
}

document.getElementById('btn-add-woo').addEventListener('click', addConfiguredHabitatToCart);
document.getElementById('btn-stage-add-pack').addEventListener('click', addConfiguredHabitatToCart);

function renderCartDrawer() {
  const containerEl = document.getElementById('cart-items-container');
  containerEl.innerHTML = '';

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  document.getElementById('nav-cart-count').textContent = cartItems.length;
  document.getElementById('nav-cart-total').textContent = `${total.toFixed(2)}€`;
  document.getElementById('drawer-total-price').textContent = `${total.toFixed(2)}€`;

  if (cartItems.length === 0) {
    containerEl.innerHTML = `<p style="text-align:center;color:#64748B;padding:24px;">Tu cesta está vacía.</p>`;
    return;
  }

  cartItems.forEach((item) => {
    const row = document.createElement('div');
    row.style.cssText = 'background:white;border:1px solid #E2E8F0;border-radius:14px;padding:12px;display:flex;justify-content:space-between;align-items:center;gap:10px;';
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:26px;">${item.emoji}</span>
        <div>
          <div style="font-weight:800;font-size:0.85rem;">${escapeHtml(item.title)}</div>
          <div style="font-size:0.72rem;color:#64748B;">${escapeHtml(item.details)}</div>
          <div style="font-weight:900;color:#10B981;font-size:0.84rem;">${item.price.toFixed(2)}€</div>
        </div>
      </div>
      <button class="mini-action-btn delete" title="Eliminar del carrito">✕</button>
    `;
    row.querySelector('button').addEventListener('click', () => {
      cartItems = cartItems.filter((c) => c.id !== item.id);
      renderCartDrawer();
    });
    containerEl.appendChild(row);
  });
}

document.getElementById('nav-cart-btn').addEventListener('click', () => {
  document.getElementById('cart-drawer-backdrop').classList.add('open');
});
document.getElementById('close-cart-btn').addEventListener('click', () => {
  document.getElementById('cart-drawer-backdrop').classList.remove('open');
});
document.getElementById('btn-checkout-woo').addEventListener('click', () => {
  showToast('🔒 Conectando con pasarela segura de WooCommerce (/wp-json/wc/store/v1/cart)...');
  document.getElementById('cart-drawer-backdrop').classList.remove('open');
});

// Acordeón de Preguntas Frecuentes (Retraídas por defecto como en Martens)
document.querySelectorAll('.faq-question').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    item.classList.toggle('open');
  });
});

// Formulario de Contacto
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.reset();
  showToast('✉️ ¡Gracias! Hemos recibido tu consulta en hola@martenscrap.com.');
});

// Textos Legales Estándar basados en Martenscrap (Marta Pastor Escribano)
const LEGAL_CONTENTS = {
  aviso: `
    <h4 style="font-size:1rem;color:#0F172A;margin-bottom:8px;">Aviso Legal y Datos Identificativos (Art. 10 LSSI-CE)</h4>
    <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:</p>
    <ul style="padding-left:20px;margin:10px 0;">
      <li><strong>Titular:</strong> Marta Pastor Escribano</li>
      <li><strong>Marca Comercial:</strong> Martenscrap · Línea MiniFauna 3D</li>
      <li><strong>Actividad:</strong> Diseño y venta de figuras articuladas 3D, hábitats coleccionables, marcapáginas magnéticos y artículos de regalo.</li>
      <li><strong>Domicilio Social:</strong> Valencia, España</li>
      <li><strong>Contacto Electrónico Oficial:</strong> hola@martenscrap.com</li>
    </ul>
    <p>El acceso y navegación por este sitio web atribuye la condición de USUARIO e implica la aceptación íntegra de las presentes condiciones legales.</p>
  `,
  privacidad: `
    <h4 style="font-size:1rem;color:#0F172A;margin-bottom:8px;">Política de Privacidad y Protección de Datos (RGPD UE 2016/679 y LOPDGDD 3/2018)</h4>
    <p>Martenscrap garantiza la confidencialidad y seguridad de los datos personales facilitados por los usuarios:</p>
    <ul style="padding-left:20px;margin:10px 0;">
      <li><strong>Responsable del Tratamiento:</strong> Marta Pastor Escribano (hola@martenscrap.com).</li>
      <li><strong>Finalidad:</strong> Gestión de pedidos en WooCommerce, configuración de hábitats personalizados y respuesta a consultas comerciales.</li>
      <li><strong>Legitimación:</strong> Ejecución de contrato de compraventa y consentimiento expreso del interesado (Art. 6.1.a y 6.1.b RGPD).</li>
      <li><strong>Destinatarios:</strong> Operadores logísticos para la entrega física del pedido. No se ceden datos a terceros con fines publicitarios.</li>
      <li><strong>Derechos ARSOPOL:</strong> Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a <em>hola@martenscrap.com</em>.</li>
    </ul>
  `,
  cookies: `
    <h4 style="font-size:1rem;color:#0F172A;margin-bottom:8px;">Política de Cookies (Art. 22.2 LSSI-CE)</h4>
    <p>Este portal utiliza únicamente almacenamiento local técnico (<code>localStorage</code> y sesión de carrito WooCommerce) estrictamente necesario para conservar las piezas colocadas en el visor 3D y los artículos de la cesta.</p>
    <p style="margin-top:8px;">No se instalan cookies publicitarias ni rastreadores invasivos de terceros.</p>
  `,
  terminos: `
    <h4 style="font-size:1rem;color:#0F172A;margin-bottom:8px;">Condiciones de Contratación y Derecho de Desistimiento (14 Días)</h4>
    <p>Conforme al RDL 1/2007 de Defensa de los Consumidores y Usuarios:</p>
    <ul style="padding-left:20px;margin:10px 0;">
      <li><strong>Derecho de Desistimiento:</strong> Dispones de <strong>14 días naturales</strong> desde la recepción del pedido para realizar devoluciones de catálogo estándar sin necesidad de justificación.</li>
      <li><strong>Excepción en Piezas Personalizadas (Art. 103.c TRLGDCU):</strong> El derecho de desistimiento no será aplicable a los hábitats o figuras confeccionados conforme a las especificaciones del consumidor o archivos 3D personalizados bajo demanda.</li>
      <li><strong>Plazos de Entrega:</strong> Envíos nacionales en 24/72 horas laborales con embalaje sostenible.</li>
      <li><strong>Garantía Legal:</strong> Garantía oficial de conformidad de 3 años en todos nuestros productos.</li>
    </ul>
  `
};

function openLegalModal(tabKey = 'aviso') {
  const modal = document.getElementById('legal-modal-backdrop');
  modal.classList.add('open');
  document.querySelectorAll('.legal-tab-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.ltab === tabKey);
  });
  document.getElementById('legal-content-body').innerHTML = LEGAL_CONTENTS[tabKey] || LEGAL_CONTENTS.aviso;
}

document.querySelectorAll('[data-open-legal]').forEach((btn) => {
  btn.addEventListener('click', () => openLegalModal(btn.dataset.openLegal));
});
document.querySelectorAll('.legal-tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => openLegalModal(btn.dataset.ltab));
});
document.getElementById('close-legal-btn').addEventListener('click', () => {
  document.getElementById('legal-modal-backdrop').classList.remove('open');
});

// Banner de cookies
if (localStorage.getItem('minifauna_cookies_accepted') === 'true') {
  document.getElementById('cookie-banner').style.display = 'none';
}
document.getElementById('accept-cookies-btn').addEventListener('click', () => {
  localStorage.setItem('minifauna_cookies_accepted', 'true');
  document.getElementById('cookie-banner').style.display = 'none';
});

function showToast(htmlMsg) {
  const toast = document.getElementById('woo-toast');
  toast.innerHTML = htmlMsg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ============================================================================
// 9. BUCLE DE RENDERIZADO 3D (60 FPS)
// ============================================================================
let lastAnimTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  if (cameraAnim) {
    const t = Math.min((now - cameraAnim.startTime) / cameraAnim.duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    camera.position.lerpVectors(cameraAnim.startPos, cameraAnim.endPos, ease);
    controls.target.lerpVectors(cameraAnim.startLook, cameraAnim.endLook, ease);
    if (t >= 1) cameraAnim = null;
  }

  controls.update();

  const rect = container.getBoundingClientRect();
  const camWorldPos = new THREE.Vector3();
  camera.getWorldPosition(camWorldPos);

  if (currentMode === 'GLOBE') {
    // Actualización de física elástica "Jelly Bounce" (Squash & Stretch de plastilina en letras 3D)
    const dt = Math.min((now - (lastAnimTime || now)) / 1000, 0.04);
    lastAnimTime = now;
    const springK = 220;
    const damping = 14;

    continentLettersList.forEach((l) => {
      if (!l.isBouncing && l.velX === 0 && l.velY === 0 && l.velZ === 0) return;

      const fx = -springK * (l.scale.x - 1.0) - damping * l.velX;
      const fy = -springK * (l.scale.y - 1.0) - damping * l.velY;
      const fz = -springK * (l.scale.z - 1.0) - damping * l.velZ;

      l.velX += fx * dt;
      l.velY += fy * dt;
      l.velZ += fz * dt;

      l.scale.x += l.velX * dt;
      l.scale.y += l.velY * dt;
      l.scale.z += l.velZ * dt;

      if (
        Math.abs(l.scale.x - 1) < 0.005 && Math.abs(l.velX) < 0.02 &&
        Math.abs(l.scale.y - 1) < 0.005 && Math.abs(l.velY) < 0.02 &&
        Math.abs(l.scale.z - 1) < 0.005 && Math.abs(l.velZ) < 0.02
      ) {
        l.scale.set(1, 1, 1);
        l.velX = 0; l.velY = 0; l.velZ = 0;
        l.isBouncing = false;
      }
    });

    globeHotspots.forEach(({ anchor, el }) => {
      const worldPos = new THREE.Vector3();
      anchor.getWorldPosition(worldPos);

      const normal = worldPos.clone().normalize();
      const viewVec = camWorldPos.clone().sub(worldPos).normalize();
      const isFront = normal.dot(viewVec) > 0.14;

      if (!isFront) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      } else {
        const projected = worldPos.clone().project(camera);
        const x = (projected.x * 0.5 + 0.5) * rect.width;
        const y = (-(projected.y * 0.5) + 0.5) * rect.height;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
      }
    });
  } else if (currentMode === 'HABITAT' && showSlotMarkers) {
    currentSlots.forEach((slot) => {
      if (!slot.markerEl) return;
      const worldPos = new THREE.Vector3();
      slot.anchor3D.getWorldPosition(worldPos);
      worldPos.y += 0.18;
      const projected = worldPos.project(camera);
      const x = (projected.x * 0.5 + 0.5) * rect.width;
      const y = (-(projected.y * 0.5) + 0.5) * rect.height;
      slot.markerEl.style.left = `${x}px`;
      slot.markerEl.style.top = `${y}px`;
      slot.markerEl.style.display = 'grid';
    });
  }

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

renderMiniCatalog();
renderShopCatalog();
renderCartDrawer();
requestAnimationFrame(animate);
