export type PlatoCategory = 'verduras' | 'proteinas' | 'carbohidratos';

export interface PlatoAlimento {
  id: string;
  name: string;
  gi?: number;
  note?: string;
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
      },
      {
        id: 'pescado-blanco',
        name: 'Pescado blanco (Merluza, Bacalao)',
        gi: 0,
      },
      { id: 'salmon', name: 'Salmón a la plancha', gi: 0 },
      { id: 'ternera', name: 'Ternera magra a la plancha', gi: 0 },
      { id: 'atun', name: 'Atún al natural o sardinas', gi: 0 },
      {
        id: 'huevos',
        name: 'Huevos',
        gi: 0,
        note: 'Hasta 3 unidades en tortilla o revuelto.',
      },
      { id: 'queso-curado', name: 'Queso curado o manchego', gi: 25 },
      { id: 'queso-fresco', name: 'Queso fresco', gi: 30 },
      { id: 'tofu', name: 'Tofu o Tempeh', gi: 15 },
      { id: 'jamon', name: 'Jamón cocido', gi: 20 },
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
      },
      {
        id: 'garbanzos',
        name: 'Garbanzos cocidos',
        gi: 33,
        note: 'Pautados en guisos o cremas.',
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
