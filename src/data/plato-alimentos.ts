export type PlatoCategory = 'verduras' | 'proteinas' | 'carbohidratos';

export interface PlatoIdea {
  title: string;
  tip: string;
}

export interface PlatoAlimento {
  id: string;
  name: string;
  gi?: number;
  note?: string;
  /** Ideas de ensamblaje rápido (proteínas; también lentejas/garbanzos en HC) */
  ideas?: PlatoIdea[];
}

export interface PlatoCategoria {
  id: PlatoCategory;
  label: string;
  shortLabel: string;
  percentage: number;
  description: string;
  colorClass: string;
  alimentos: PlatoAlimento[];
}

export const PLATO_NOTAS = {
  combinacion:
    'Los carbohidratos siempre deben ir acompañados de una proteína o grasa saludable (como aguacate o aceite de oliva) para evitar picos de glucosa.',
  preparacion:
    'Prioriza métodos de cocción al vapor, plancha u horno.',
  aderezos:
    'Vinagre y limón reducen la respuesta glucémica del plato.',
} as const;

/** Si la proteína (o el HC) no tiene ideas propias */
export const PLATO_IDEAS_FALLBACK: PlatoIdea[] = [
  {
    title: 'Plancha + ensalada',
    tip: 'Prepara tu proteína a la plancha. Empieza comiendo tu {verdura} aliñada con vinagre o limón y termina con tu {carbohidrato}.',
  },
  {
    title: 'Bowl 50-25-25',
    tip: 'Monta un bowl: mitad {verdura}, un cuarto de proteína y un cuarto de {carbohidrato}. Aceite de oliva y limón al final.',
  },
];

const IDEAS_QUESO: PlatoIdea[] = [
  {
    title: 'Torre de queso y colores',
    tip: 'Corta el queso en láminas. Intercala con tu {verdura} (tomate o calabacín a la plancha) y añade tu ración de {carbohidrato}. Ideal cuando no quieres encender el fuego.',
  },
  {
    title: 'Gratinado rápido al microondas',
    tip: 'Pon tu {verdura} con tu ración de {carbohidrato} en un plato. Cubre con queso y dale 2 minutos de microondas. La grasa y la proteína ralentizan la absorción del carbohidrato.',
  },
];

export const PLATO_CATEGORIAS: PlatoCategoria[] = [
  {
    id: 'verduras',
    label: 'Verduras y Hortalizas',
    shortLabel: 'Verduras',
    percentage: 50,
    description:
      'IG muy bajo. Base del control metabólico en diabetes gestacional.',
    colorClass: 'bg-deep-teal',
    alimentos: [
      { id: 'lechuga', name: 'Lechuga', gi: 10 },
      { id: 'rucula', name: 'Rúcula', gi: 10 },
      { id: 'champinones', name: 'Champiñones y setas', gi: 10 },
      { id: 'aguacate', name: 'Aguacate', gi: 10 },
      { id: 'brocoli', name: 'Brócoli', gi: 15 },
      { id: 'espinacas', name: 'Espinacas', gi: 15 },
      { id: 'pimiento', name: 'Pimiento', gi: 15 },
      {
        id: 'coliflor',
        name: 'Coliflor',
        gi: 15,
        note: 'Puré alternativo al de patata.',
      },
      { id: 'calabacin', name: 'Calabacín', gi: 15 },
      { id: 'pepino', name: 'Pepino', gi: 15 },
      { id: 'esparragos', name: 'Espárragos', gi: 15 },
      { id: 'judias-verdes', name: 'Judías verdes', gi: 15 },
      { id: 'tomate', name: 'Tomate', gi: 30 },
    ],
  },
  {
    id: 'proteinas',
    label: 'Proteínas de Calidad',
    shortLabel: 'Proteínas',
    percentage: 25,
    description:
      'Impacto glucémico nulo o muy bajo. Ralentizan la absorción de azúcar.',
    colorClass: 'bg-vibrant-coral',
    alimentos: [
      {
        id: 'pollo',
        name: 'Pechuga de pollo a la plancha u horno',
        gi: 0,
        ideas: [
          {
            title: 'Salteado exprés de colores',
            tip: 'Corta el pollo en tiras y dóralo en la sartén. Añade tu {verdura} (pimientos o calabacín van genial) y, cuando esté listo, mezcla tu porción de {carbohidrato} ya cocido.',
          },
          {
            title: 'Pollo a la plancha con base de fibra',
            tip: 'Haz la pechuga a la plancha con especias. Primero cómete tu {verdura} aliñada con vinagre y luego sigue con el pollo y tu {carbohidrato}.',
          },
        ],
      },
      {
        id: 'pescado-blanco',
        name: 'Pescado blanco (Merluza, Bacalao)',
        gi: 0,
        ideas: [
          {
            title: 'Papillote en 10 minutos',
            tip: 'Envuelve la merluza con tu {verdura} en papel de horno o aluminio. Hornea o microondas hasta el punto. Sírvelo con tu {carbohidrato} (la quinoa le va de lujo).',
          },
          {
            title: 'Pescado “al dente” con limón',
            tip: 'Pasa el pescado por la plancha sin pasarte de cocción. Acompáñalo de tu {verdura} favorita y la porción de {carbohidrato} para una cena ligera y segura.',
          },
        ],
      },
      {
        id: 'salmon',
        name: 'Salmón a la plancha',
        gi: 0,
        ideas: [
          {
            title: 'Salmón al vapor de microondas',
            tip: 'Pon el salmón y tu {verdura} (espárragos o brócoli) en un estuche de vapor o plato tapado 4-5 min al microondas. Sírvelo con tu {carbohidrato} y limón.',
          },
          {
            title: 'Plancha rápida y nutritiva',
            tip: 'Sella el salmón en la sartén por ambos lados. Acompáñalo con ensalada de {verdura} fresca y completa el plato con tu {carbohidrato}.',
          },
        ],
      },
      {
        id: 'ternera',
        name: 'Ternera magra a la plancha',
        gi: 0,
        ideas: [
          {
            title: 'Salteado de ternera y energía lenta',
            tip: 'Saltea tiras de ternera a fuego fuerte. Añade tu {verdura} para que quede crujiente (IG más bajo) y acompaña con tu porción de {carbohidrato}.',
          },
          {
            title: 'Filete clásico con “muro de fibra”',
            tip: 'Haz el filete a la plancha. Empieza la cena con tu {verdura} para frenar el azúcar y termina con la carne y tu {carbohidrato}.',
          },
        ],
      },
      {
        id: 'atun',
        name: 'Atún al natural o sardinas',
        gi: 0,
        ideas: [
          {
            title: 'Ensalada de rescate en 5 minutos',
            tip: 'Mezcla el atún al natural con tu {verdura} fresca (tomate y pepino son ideales) y tu porción de {carbohidrato}. Aliña con limón o vinagre.',
          },
          {
            title: '“Paté” exprés con base de fibra',
            tip: 'Chafa el atún con aguacate. Úsalo sobre tu {carbohidrato} (p. ej. pan de centeno) y acompaña con una montaña de {verdura} crujiente.',
          },
        ],
      },
      {
        id: 'huevos',
        name: 'Huevos',
        gi: 0,
        note: 'Hasta 3 unidades en tortilla o revuelto.',
        ideas: [
          {
            title: 'Revuelto jugoso en 5 minutos',
            tip: 'Bate 2 o 3 huevos. Saltea tu {verdura} picada (calabacín o champiñones van de cine) y añade los huevos. Sírvelo con tu porción de {carbohidrato}.',
          },
          {
            title: 'Tortilla con “escolta” de fibra',
            tip: 'Cocina una tortilla francesa. Llena el 50% del plato con {verdura} fresca y añade tu ración de {carbohidrato} al final.',
          },
        ],
      },
      {
        id: 'queso-curado',
        name: 'Queso curado o manchego',
        gi: 25,
        ideas: IDEAS_QUESO,
      },
      {
        id: 'queso-fresco',
        name: 'Queso fresco',
        gi: 30,
        ideas: IDEAS_QUESO,
      },
      {
        id: 'tofu',
        name: 'Tofu o Tempeh',
        gi: 15,
        ideas: [
          {
            title: 'Tofurevuelto con especias',
            tip: 'Desmenuza el tofu en la sartén con tu {verdura} picada y cúrcuma o pimentón. Saltéalo 5 minutos y sírvelo con tu {carbohidrato}.',
          },
          {
            title: 'Dados dorados con guarnición',
            tip: 'Dora dados de tofu con un poco de aceite de oliva. Sírvelos sobre una cama de {verdura} y completa con tu {carbohidrato}.',
          },
        ],
      },
      {
        id: 'jamon',
        name: 'Jamón cocido',
        gi: 20,
        ideas: [
          {
            title: 'Rollitos rellenos de energía',
            tip: 'Usa lonchas de jamón como envoltorio. Rellénalas con tu {verdura} (espinacas o pimiento) y acompaña con tu porción de {carbohidrato}.',
          },
          {
            title: 'Sartén de jamón y huerto',
            tip: 'Saltea tu {verdura} con trocitos de jamón. Incorpora tu {carbohidrato} al final y un chorrito de AOVE para una subida de glucosa más lenta.',
          },
        ],
      },
    ],
  },
  {
    id: 'carbohidratos',
    label: 'Carbohidratos Complejos',
    shortLabel: 'Carbohidratos',
    percentage: 25,
    description:
      'IG bajo o medio. Cocción al dente para mantener el IG bajo.',
    colorClass: 'bg-dusty-rose',
    alimentos: [
      {
        id: 'quinoa',
        name: 'Quinoa cocida',
        gi: 35,
        note: 'Pequeña porción / guarnición.',
      },
      {
        id: 'lentejas',
        name: 'Lentejas',
        gi: 30,
        note: 'Pautadas en ensaladas.',
        ideas: [
          {
            title: 'Ensalada “pim-pam” de lentejas',
            tip: 'Usa lentejas de bote (lávalas bien). Mézclalas con tu {verdura} fresca picada y tu {proteina}. Aliña con limón o vinagre.',
          },
          {
            title: 'Crema saciante con tropezones',
            tip: 'Tritura las lentejas cocidas con tu {verdura} (calabacín funciona genial). Sírvela con AOVE y tu {proteina} como acompañamiento.',
          },
        ],
      },
      {
        id: 'garbanzos',
        name: 'Garbanzos cocidos',
        gi: 33,
        note: 'Pautados en guisos o cremas.',
        ideas: [
          {
            title: 'Salteado de garbanzos de bote',
            tip: 'Saltea los garbanzos con especias y tu {verdura}. Incorpora tu {proteina} si quieres más saciedad. Cena completa en minutos.',
          },
          {
            title: 'Bowl de garbanzos',
            tip: 'Mezcla los garbanzos con tu {verdura} y tu {proteina}. Aliña con vinagre o limón para mantener a raya el glucómetro.',
          },
        ],
      },
      {
        id: 'pan-centeno',
        name: 'Pan de centeno 100%',
        gi: 41,
        note: '1-2 rebanadas en desayuno.',
      },
      { id: 'trigo-sarraceno', name: 'Trigo sarraceno cocido', gi: 34 },
      {
        id: 'arroz-integral',
        name: 'Arroz integral',
        gi: 68,
        note: 'Pequeña porción / guarnición.',
      },
      {
        id: 'batata',
        name: 'Batata / Patata dulce',
        gi: 70,
        note: 'Al horno; absorción más lenta que patata tradicional.',
      },
      {
        id: 'pasta-integral',
        name: 'Pasta integral',
        gi: 55,
        note: 'Siempre cocinada al dente.',
      },
    ],
  },
];

export function getAlimentoById(
  categoryId: PlatoCategory,
  alimentoId: string,
): PlatoAlimento | undefined {
  const categoria = PLATO_CATEGORIAS.find((c) => c.id === categoryId);
  return categoria?.alimentos.find((a) => a.id === alimentoId);
}

export function fillIdeaPlaceholders(
  tip: string,
  names: {
    verdura: string;
    carbohidrato: string;
    proteina: string;
  },
): string {
  return tip
    .replaceAll('{verdura}', names.verdura)
    .replaceAll('{carbohidrato}', names.carbohidrato)
    .replaceAll('{proteina}', names.proteina);
}

/** Si el HC tiene ideas (lentejas/garbanzos), priorízalas; si no, la proteína; si no, fallback. */
export function resolvePlatoIdeas(
  proteinId: string | null | undefined,
  carbId: string | null | undefined,
): PlatoIdea[] {
  if (carbId) {
    const carb = getAlimentoById('carbohidratos', carbId);
    if (carb?.ideas?.length) return carb.ideas;
  }
  if (proteinId) {
    const protein = getAlimentoById('proteinas', proteinId);
    if (protein?.ideas?.length) return protein.ideas;
  }
  return PLATO_IDEAS_FALLBACK;
}
