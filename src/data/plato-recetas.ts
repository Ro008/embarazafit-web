/**
 * Recetas del Simulador del Plato — combinaciones exactas (hardcoded).
 *
 * Cómo añadir una combinación:
 * 1. Copia un bloque existente.
 * 2. Pon los IDs exactos de `plato-alimentos.ts` (verdura, proteina, carbohidrato).
 * 3. Escribe 1–2 recetas con título y tip redactados a mano (sin placeholders).
 *
 * Si no hay match exacto de los 3 IDs, la UI no muestra bloque de recetas.
 * (PLATO_FALLBACK_POR_PROTEINA se mantiene por si lo reutilizas más adelante.)
 */

export interface PlatoReceta {
  title: string;
  tip: string;
}

export interface PlatoCombinacion {
  verdura: string;
  proteina: string;
  carbohidrato: string;
  recetas: PlatoReceta[];
}

export const PLATO_COMBINACIONES: PlatoCombinacion[] = [
  {
    verdura: 'espinacas',
    proteina: 'huevos',
    carbohidrato: 'pan-centeno',
    recetas: [
      {
        title: 'Tosta rápida a la sartén',
        tip: 'Tuesta la rebanada de pan de centeno 100%. Mientras tanto, saltea un minuto en la sartén las espinacas frescas con un toque de ajo en polvo y aceite de oliva. Corona tu tosta con los dos huevos a la plancha y listo.',
      },
      {
        title: 'Revuelto exprés en 5 minutos',
        tip: 'Pica las espinacas y échalas a la sartén con un chorrito de AOVE. Saltéalas brevemente, añade los dos huevos batidos y remueve hasta que quede un revuelto jugoso. Sírvelo en el plato junto a tu rebanada de pan de centeno al lado.',
      },
    ],
  },
  {
    verdura: 'calabacin',
    proteina: 'pollo',
    carbohidrato: 'arroz-integral',
    recetas: [
      {
        title: 'Wok express de pollo y verduras',
        tip: 'Corta la pechuga de pollo en tiras y saltéala a fuego fuerte. Añade el calabacín cortado fino en rodajas o dados. Cuando esté listo, mezcla en la misma sartén tu porción de arroz integral ya cocido para que absorba los jugos. Un toque de especias y a cenar.',
      },
    ],
  },
  {
    verdura: 'aguacate',
    proteina: 'atun',
    carbohidrato: 'pan-centeno',
    recetas: [
      {
        title: 'Cena en frío: Tosta marinera',
        tip: 'Cero cocina. Machaca el aguacate sobre tu rebanada de pan de centeno 100% con unas gotas de limón y una pizca de sal. Abre la lata de atún al natural o sardinas, escúrrela bien y colócala encima. Rápido, saciante y seguro.',
      },
    ],
  },
  {
    verdura: 'brocoli',
    proteina: 'salmon',
    carbohidrato: 'quinoa',
    recetas: [
      {
        title: 'Salmón con base crujiente',
        tip: 'Haz el salmón a la plancha por el lado de la piel para que quede crujiente. Al mismo tiempo, saltea los arbolitos de brócoli (cortados pequeños para que se hagan rápido) en otra sartén o al microondas 3 min. Mezcla el brócoli con tu quinoa cocida al dente y sirve el salmón encima.',
      },
    ],
  },
  {
    verdura: 'champinones',
    proteina: 'ternera',
    carbohidrato: 'trigo-sarraceno',
    recetas: [
      {
        title: 'Salteado campestre de ternera',
        tip: 'Pasa los champiñones laminados por la sartén con un diente de ajo. Añade la ternera magra cortada en tiras finas para que se cocine en un par de minutos. Sírvelo todo mezclado con tu porción de trigo sarraceno cocido al dente.',
      },
    ],
  },
  {
    verdura: 'judias-verdes',
    proteina: 'pescado-blanco',
    carbohidrato: 'batata',
    recetas: [
      {
        title: 'Plato limpio al microondas (Papillote exprés)',
        tip: 'En un estuche de vapor o plato tapado, pon los filetes de merluza o bacalao con las judías verdes y tu porción de batata cortada fina. Un chorrito de AOVE, sal y pimienta. Cocina 5-6 minutos a máxima potencia en el microondas. Limpio, rápido y metabólicamente perfecto.',
      },
    ],
  },
  {
    verdura: 'rucula',
    proteina: 'queso-curado',
    carbohidrato: 'pan-centeno',
    recetas: [
      {
        title: 'Carpaccio templado de queso y rúcula',
        tip: 'Tuesta tu rebanada de pan de centeno 100%. Cubre el plato con una buena base de rúcula aliñada con limón y unas gotas de AOVE. Coloca encima unas lascas finas de queso curado o manchego y añade un toque de pimienta negra. Acompaña con la tosta.',
      },
    ],
  },
  {
    verdura: 'tomate',
    proteina: 'queso-fresco',
    carbohidrato: 'pasta-integral',
    recetas: [
      {
        title: 'Ensalada Caprese de pasta express',
        tip: 'Mezcla tu porción de pasta integral cocida (y ya fría) con el tomate picado y dados de queso fresco. Aliña generosamente con aceite de oliva virgen extra y hojas de albahaca o un toque de orégano. Una cena fresca que se hace en 3 minutos.',
      },
    ],
  },
  {
    verdura: 'calabacin',
    proteina: 'tofu',
    carbohidrato: 'trigo-sarraceno',
    recetas: [
      {
        title: 'Salteado crujiente de tofu y calabacín',
        tip: 'Corta el tofu en dados y sécalo bien con papel de cocina. Dóralo en la sartén a fuego fuerte hasta que quede crujiente por fuera. Añade el calabacín a rodajas finas y saltea todo junto. Sírvelo mezclado con tu porción de trigo sarraceno cocido.',
      },
    ],
  },
  {
    verdura: 'pepino',
    proteina: 'jamon',
    carbohidrato: 'pan-centeno',
    recetas: [
      {
        title: 'Sándwich abierto ligero',
        tip: 'Cero fuegos. Corta el pepino en rodajas muy finas. Unta tu rebanada de pan de centeno con una pincelada de queso crema ligero si quieres, coloca encima las lonchas de jamón cocido de calidad y cubre con el pepino. Crujiente, fresco y rápido.',
      },
    ],
  },
  {
    verdura: 'pimiento',
    proteina: 'pollo',
    carbohidrato: 'quinoa',
    recetas: [
      {
        title: 'Fajitas de pollo desestructuradas',
        tip: 'Corta el pimiento y la pechuga de pollo en tiras. Saltéalos en la sartén con un toque de comino, pimentón y ajo en polvo a fuego fuerte. Emplata el salteado encima de tu porción de quinoa cocida como si fuera una base de arroz.',
      },
    ],
  },
  {
    verdura: 'esparragos',
    proteina: 'salmon',
    carbohidrato: 'batata',
    recetas: [
      {
        title: 'Cena al horno en una sola bandeja',
        tip: 'Corta la batata en rodajas finitas (para que se hagan rápido). Pon en una bandeja de horno la batata, los espárragos trigueros y el lomo de salmón. Añade un hilo de AOVE y hornea a 200°C durante 12-15 minutos. Cenarás de lujo sin manchar casi nada.',
      },
    ],
  },
  {
    verdura: 'lechuga',
    proteina: 'atun',
    carbohidrato: 'garbanzos',
    recetas: [
      {
        title: 'Ensalada rápida de garbanzos y mar',
        tip: 'En un bol, pon los garbanzos cocidos de bote (bien lavados y escurridos). Añade una buena base de lechuga limpia y picada y la lata de atún al natural o sardinas entera. Aliña con vinagre de manzana y AOVE. Saciedad inmediata sin picos.',
      },
    ],
  },
  {
    verdura: 'champinones',
    proteina: 'huevos',
    carbohidrato: 'pan-centeno',
    recetas: [
      {
        title: 'Tortilla campera con champiñones',
        tip: 'Lamina los champiñones y saltéalos en la sartén hasta que suelten el agua. Bate los dos huevos, échalos a la sartén junto a los champiñones y cocina una tortilla jugosa. Sírvela recién hecha acompañada de tu rebanada de pan de centeno.',
      },
    ],
  },
  {
    verdura: 'coliflor',
    proteina: 'ternera',
    carbohidrato: 'arroz-integral',
    recetas: [
      {
        title: 'Filete con "falso arroz" mixto',
        tip: 'Haz el filete de ternera magra a la plancha a tu gusto. Para la guarnición, ralla o pica la coliflor muy fina (puedes usar el microondas 3 min para ablandarla) y saltéala en la sartén mezclada a partes iguales con tu porción de arroz integral cocido.',
      },
    ],
  },
  {
    verdura: 'tomate',
    proteina: 'pescado-blanco',
    carbohidrato: 'batata',
    recetas: [
      {
        title: 'Pescado en salsa rápida de tomate',
        tip: 'En una sartén honda, pon un poco de tomate natural triturado o picado con un chorrito de aceite. Coloca los filetes de merluza o bacalao encima, tapa y deja que se cocinen al vapor del tomate 6-8 minutos. Acompaña con tu batata cocida al vapor o al microondas.',
      },
    ],
  },
  {
    verdura: 'espinacas',
    proteina: 'pollo',
    carbohidrato: 'lentejas',
    recetas: [
      {
        title: 'Salteado templado de lentejas y pollo',
        tip: 'Cocina unos dados de pechuga de pollo a la plancha. Cuando estén casi listos, añade un buen puñado de espinacas frescas y las lentejas de bote escurridas a la sartén. Remueve dos minutos para que todo se temple y se integre. Rápido y reconfortante.',
      },
    ],
  },
  {
    verdura: 'aguacate',
    proteina: 'huevos',
    carbohidrato: 'pan-centeno',
    recetas: [
      {
        title: 'Tosta premium de aguacate y huevo',
        tip: 'Tuesta el pan de centeno 100%. Aplasta el aguacate encima con un tenedor, sal y pimienta. Prepara los dos huevos (pueden ser escalfados en el microondas 1 min o a la plancha) y colócalos encima del aguacate. El desayuno o cena perfecto.',
      },
    ],
  },
  {
    verdura: 'tomate',
    proteina: 'atun',
    carbohidrato: 'garbanzos',
    recetas: [
      {
        title: 'Empedrat express mediterráneo',
        tip: 'Abre un bote de garbanzos cocidos, saca tu porción y lávala bien. Pica el tomate en dados y añade la lata de atún al natural o sardinas bien escurrida. Mézclalo todo en un bol con un buen chorrito de AOVE, sal y un chorrito de vinagre de manzana. Cena alta en fibra lista en 2 minutos.',
      },
    ],
  },
  {
    verdura: 'lechuga',
    proteina: 'pollo',
    carbohidrato: 'pan-centeno',
    recetas: [
      {
        title: 'César Salad en versión segura',
        tip: 'Si tienes restos de pechuga de pollo de mediodía o la haces a la plancha en un momento, córtala en tiras. Pon una buena base de lechuga de bolsa (limpia y rápida), añade los trozos de pollo y unos daditos de tu pan de centeno 100% tostado a modo de picatostes. Aliña con AOVE, limón y un toque de queso parmesano o curado rallado.',
      },
    ],
  },
  {
    verdura: 'champinones',
    proteina: 'huevos',
    carbohidrato: 'quinoa',
    recetas: [
      {
        title: 'Quinoa salteada con champiñones y huevo poché',
        tip: 'Lamina los champiñones y saltéalos en una sartén con ajo en polvo. Añade tu porción de quinoa ya cocida para que coja el sabor del salteado. Sírvelo en el plato y corona con un huevo poché express (hazlo en el microondas: un vaso con agua, introduce el huevo, tápalo con un plato y dale 50 segundos a potencia media). Al romper la yema, se crea la salsa.',
      },
    ],
  },
  {
    verdura: 'calabacin',
    proteina: 'huevos',
    carbohidrato: 'batata',
    recetas: [
      {
        title: 'Tortilla de batata y calabacín al microondas',
        tip: 'Corta la batata y el calabacín en rodajas finas. Ponlos en un estuche de vapor o bol tapado con film en el microondas con un hilo de AOVE y sal durante 6-7 minutos hasta que estén blandos. Bate los huevos, mezcla todo y cuájalo en la sartén 1 minuto por cada lado. Sabor a tortilla tradicional, pero express y sin picos.',
      },
    ],
  },
  {
    verdura: 'pimiento',
    proteina: 'atun',
    carbohidrato: 'pan-centeno',
    recetas: [
      {
        title: 'Tostas de pimientos asados con ventresca o sardinas',
        tip: 'Usa pimientos rojos asados en conserva (mira que sean solo pimiento, agua y sal). Tuesta tu rebanada de pan de centeno 100%, coloca una buena capa de tiras de pimiento y corona con los lomos de atún o sardinas en conserva bien escurridos. Una cena fría, saciante y súper sabrosa.',
      },
    ],
  },
  {
    verdura: 'brocoli',
    proteina: 'pollo',
    carbohidrato: 'pasta-integral',
    recetas: [
      {
        title: 'Pasta integral con pollo y brócoli al ajillo',
        tip: 'Corta el brócoli en arbolitos muy pequeños. Ponlos en una sartén con un chorrito de AOVE y ajo laminado junto con la pechuga de pollo a tiras. Cuando el pollo esté dorado y el brócoli al dente, añade tu ración de pasta integral cocida directamente a la sartén. Saltea un minuto para integrar sabores y listo.',
      },
    ],
  },
  {
    verdura: 'tomate',
    proteina: 'jamon',
    carbohidrato: 'pan-centeno',
    recetas: [
      {
        title: 'El clásico "Pa amb tomàquet" con jamón',
        tip: 'Ralla el tomate maduro y extiéndelo sobre tu rebanada de pan de centeno 100% tostada, añadiendo un buen chorrito de AOVE y una pizca de sal. Coloca encima las lonchas de jamón cocido de calidad (mínimo 90% carne). Acompáñalo con unos tomatitos cherry extra al lado para completar tu 50% de verdura.',
      },
    ],
  },
  {
    verdura: 'espinacas',
    proteina: 'queso-fresco',
    carbohidrato: 'garbanzos',
    recetas: [
      {
        title: 'Ensalada templada de garbanzos, espinacas y queso fresco',
        tip: 'Saltea las espinacas frescas en la sartén solo 1 minuto para que pierdan volumen pero queden tersas. Añade tu porción de garbanzos de bote lavados para que se templen. Pásalo a un bol, añade dados de queso fresco y aliña con AOVE y un toque de orégano.',
      },
    ],
  },
  {
    verdura: 'rucula',
    proteina: 'salmon',
    carbohidrato: 'arroz-integral',
    recetas: [
      {
        title: 'Bowl nórdico express',
        tip: 'Pon en un bol una base generosa de rúcula fresca. Añade tu porción de arroz integral cocido a un lado. Haz el salmón a la plancha rápido (vuelta y vuelta para que quede jugoso), desmenúzalo libre de espinas y añádelo al bol. Aliña todo con exprimir medio limón y un hilo de aceite de oliva.',
      },
    ],
  },
  {
    verdura: 'pepino',
    proteina: 'queso-fresco',
    carbohidrato: 'quinoa',
    recetas: [
      {
        title: 'Tabulé express de quinoa y queso fresco',
        tip: 'Pica el pepino en daditos muy pequeños y haz lo mismo con el queso fresco (puedes añadir también un poco de tomate si quieres). En un bol, mézclalo todo con tu porción de quinoa cocida fría. Aliña con abundante limón, AOVE y unas hojas de menta o perejil picadas. Ultra refrescante y saciante.',
      },
    ],
  },
];

/**
 * Instrucciones básicas si la combinación no está en el diccionario.
 * Clave = id de proteína en plato-alimentos.ts
 */
export const PLATO_FALLBACK_POR_PROTEINA: Record<string, PlatoReceta[]> = {
  pollo: [
    {
      title: 'Cómo montarlo',
      tip: 'Cocina la pechuga de pollo a la plancha o al horno con tus especias favoritas. Utiliza la verdura seleccionada como guarnición (salteada o en ensalada) y acompaña el plato con la porción justa del carbohidrato elegido.',
    },
  ],
  'pescado-blanco': [
    {
      title: 'Cómo montarlo',
      tip: 'Prepara el pescado blanco (merluza o bacalao) a la plancha con un chorrito de aceite de oliva y ajo. Acompáñalo con la verdura al vapor o plancha y tu ración de carbohidrato complejo.',
    },
  ],
  salmon: [
    {
      title: 'Cómo montarlo',
      tip: 'Haz el salmón a la plancha (no necesita apenas aceite porque ya tiene grasas saludables). Sírvelo junto a las verduras que has elegido bien aliñadas y tu porción de carbohidrato.',
    },
  ],
  ternera: [
    {
      title: 'Cómo montarlo',
      tip: 'Cocina la ternera a la plancha rápido para que quede jugosa. Úsala como plato principal junto con tu zona del 50% de verduras y tu 25% de carbohidratos.',
    },
  ],
  atun: [
    {
      title: 'Cómo montarlo',
      tip: 'Una opción perfecta para no cocinar: emplata tu lata de atún o sardinas bien escurridas, añade la verdura elegida en formato ensalada o crudités, y suma tu porción de carbohidrato listo para tomar.',
    },
  ],
  huevos: [
    {
      title: 'Cómo montarlo',
      tip: 'Prepara tus dos huevos (poché, pasados por agua, tortilla o plancha). Sírvelos acompañados de tus verduras salteadas y la porción del carbohidrato que has elegido.',
    },
  ],
  'queso-curado': [
    {
      title: 'Cómo montarlo',
      tip: 'Corta tu porción de queso curado o manchego. Es ideal para tomar en frío montando una ensalada con tus verduras y acompañándolo con la porción de carbohidrato.',
    },
  ],
  'queso-fresco': [
    {
      title: 'Cómo montarlo',
      tip: 'Elige tu queso fresco y combínalo en un bol o plato con tus verduras picadas (el tomate y el pepino van genial) y añade tu ración de carbohidrato.',
    },
  ],
  tofu: [
    {
      title: 'Cómo montarlo',
      tip: 'Corta el tofu o tempeh en dados y dóralos en la sartén con un toque de salsa de soja baja en sodio. Añade las verduras al salteado y sirve junto a tu carbohidrato.',
    },
  ],
  jamon: [
    {
      title: 'Cómo montarlo',
      tip: 'Usa el jamón cocido de calidad para hacer unos rollitos o cortarlo en una ensalada rápida con tu 50% de verduras y acompáñalo con tu porción de carbohidrato.',
    },
  ],
};

/** Último recurso si la proteína no tiene fallback propio */
export const PLATO_FALLBACK_GENERICO: PlatoReceta[] = [
  {
    title: 'Cómo montarlo',
    tip: 'Prioriza plancha, vapor u horno. Come primero la verdura, después la proteína y deja el carbohidrato para el final. Aliña con vinagre o limón.',
  },
];

/** Busca recetas exactas. Sin match → array vacío (no se muestra nada en la UI). */
export function findRecetasForSelection(ids: {
  verdura: string;
  proteina: string;
  carbohidrato: string;
}): { recetas: PlatoReceta[]; source: 'match' | 'none' } {
  const match = PLATO_COMBINACIONES.find(
    (c) =>
      c.verdura === ids.verdura &&
      c.proteina === ids.proteina &&
      c.carbohidrato === ids.carbohidrato,
  );

  if (match?.recetas.length) {
    return { recetas: match.recetas, source: 'match' };
  }

  return { recetas: [], source: 'none' };
}
