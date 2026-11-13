// Catálogo de Biomas, Figuras Articuladas, Extras, Tienda y Textos Legales

export const HABITATS = [
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

export const CATALOG_FIGURES = [
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

export const CATALOG_PROPS = [
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
export const FULL_SHOP_PRODUCTS = [
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

export const LEGAL_CONTENTS = {
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
