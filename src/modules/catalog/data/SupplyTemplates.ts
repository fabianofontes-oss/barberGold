export interface SupplyTemplate {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  suggestedCost: number;
  unit: string;
  minStock: number;
  emoji: string;
}

export interface SupplyCategory {
  id: string;
  name: string;
  emoji: string;
  subcategories: {
    id: string;
    name: string;
    emoji: string;
    supplies: Omit<SupplyTemplate, 'category' | 'subcategory'>[];
  }[];
}

export const SUPPLY_CATALOG: SupplyCategory[] = [
  {
    id: 'consumiveis',
    name: 'Consumíveis Básicos',
    emoji: '🔧',
    subcategories: [
      {
        id: 'laminas',
        name: 'Lâminas & Navalhas',
        emoji: '🪒',
        supplies: [
          { id: 'lamina-gillette', name: 'Lâmina Gillette (cartela 5un)', suggestedCost: 15.00, unit: 'cartela', minStock: 10, emoji: '🪒' },
          { id: 'lamina-descartavel', name: 'Lâmina Descartável (caixa 100un)', suggestedCost: 25.00, unit: 'caixa', minStock: 2, emoji: '🪒' },
          { id: 'navalha-descartavel', name: 'Navalha Descartável (caixa 50un)', suggestedCost: 35.00, unit: 'caixa', minStock: 3, emoji: '🪒' },
        ]
      },
      {
        id: 'papel-algodao',
        name: 'Papel & Algodão',
        emoji: '🧻',
        supplies: [
          { id: 'papel-toalha', name: 'Papel Toalha (pacote)', suggestedCost: 8.00, unit: 'pacote', minStock: 5, emoji: '🧻' },
          { id: 'papel-pescoco', name: 'Papel de Pescoço (rolo)', suggestedCost: 12.00, unit: 'rolo', minStock: 10, emoji: '🧻' },
          { id: 'algodao', name: 'Algodão (pacote 500g)', suggestedCost: 15.00, unit: 'pacote', minStock: 3, emoji: '☁️' },
        ]
      },
      {
        id: 'cremes',
        name: 'Cremes & Espumas',
        emoji: '🧴',
        supplies: [
          { id: 'creme-barbear', name: 'Creme de Barbear (500ml)', suggestedCost: 25.00, unit: 'frasco', minStock: 3, emoji: '🧴' },
          { id: 'espuma-barbear', name: 'Espuma de Barbear (400ml)', suggestedCost: 18.00, unit: 'lata', minStock: 5, emoji: '🧴' },
          { id: 'gel-pos-barba', name: 'Gel Pós-Barba (500ml)', suggestedCost: 22.00, unit: 'frasco', minStock: 3, emoji: '✨' },
        ]
      }
    ]
  },
  {
    id: 'higiene',
    name: 'Higiene & Limpeza',
    emoji: '🧹',
    subcategories: [
      {
        id: 'esterilizacao',
        name: 'Esterilização',
        emoji: '🔬',
        supplies: [
          { id: 'alcool-70', name: 'Álcool 70% (1L)', suggestedCost: 8.00, unit: 'litro', minStock: 5, emoji: '🧪' },
          { id: 'spray-clipper', name: 'Spray Desinfetante Clipper (500ml)', suggestedCost: 35.00, unit: 'frasco', minStock: 3, emoji: '🔬' },
          { id: 'barbicide', name: 'Barbicide (480ml)', suggestedCost: 55.00, unit: 'frasco', minStock: 2, emoji: '🔬' },
          { id: 'luvas', name: 'Luvas Descartáveis (caixa 100un)', suggestedCost: 25.00, unit: 'caixa', minStock: 2, emoji: '🧤' },
        ]
      },
      {
        id: 'limpeza',
        name: 'Limpeza Geral',
        emoji: '🧹',
        supplies: [
          { id: 'sabao-liquido', name: 'Sabão Líquido (5L)', suggestedCost: 20.00, unit: 'galão', minStock: 2, emoji: '🧴' },
          { id: 'desinfetante', name: 'Desinfetante (5L)', suggestedCost: 18.00, unit: 'galão', minStock: 2, emoji: '🧹' },
          { id: 'limpador-vidros', name: 'Limpa Vidros (500ml)', suggestedCost: 8.00, unit: 'frasco', minStock: 3, emoji: '✨' },
        ]
      },
      {
        id: 'descartaveis',
        name: 'Descartáveis',
        emoji: '🗑️',
        supplies: [
          { id: 'capa-tnt', name: 'Capa TNT (pacote 50un)', suggestedCost: 40.00, unit: 'pacote', minStock: 2, emoji: '👕' },
          { id: 'touca', name: 'Touca Descartável (pacote 100un)', suggestedCost: 15.00, unit: 'pacote', minStock: 2, emoji: '🧢' },
          { id: 'saco-lixo', name: 'Saco de Lixo 50L (pacote 100un)', suggestedCost: 25.00, unit: 'pacote', minStock: 2, emoji: '🗑️' },
        ]
      }
    ]
  },
  {
    id: 'profissional',
    name: 'Produtos Profissionais',
    emoji: '💈',
    subcategories: [
      {
        id: 'shampoos',
        name: 'Shampoos & Condicionadores',
        emoji: '🧴',
        supplies: [
          { id: 'shampoo-galao', name: 'Shampoo Profissional (5L)', suggestedCost: 45.00, unit: 'galão', minStock: 2, emoji: '🧴' },
          { id: 'condicionador-galao', name: 'Condicionador Profissional (5L)', suggestedCost: 50.00, unit: 'galão', minStock: 2, emoji: '🧴' },
          { id: 'shampoo-barba-pro', name: 'Shampoo para Barba Profissional (1L)', suggestedCost: 35.00, unit: 'litro', minStock: 2, emoji: '🧔' },
        ]
      },
      {
        id: 'coloracao',
        name: 'Coloração',
        emoji: '🎨',
        supplies: [
          { id: 'tintura-preta', name: 'Tintura Preta', suggestedCost: 18.00, unit: 'bisnaga', minStock: 5, emoji: '⬛' },
          { id: 'tintura-castanho', name: 'Tintura Castanho', suggestedCost: 18.00, unit: 'bisnaga', minStock: 5, emoji: '🟫' },
          { id: 'tintura-loiro', name: 'Tintura Loiro', suggestedCost: 18.00, unit: 'bisnaga', minStock: 3, emoji: '🟨' },
          { id: 'agua-oxigenada-10', name: 'Água Oxigenada 10 Vol (1L)', suggestedCost: 12.00, unit: 'litro', minStock: 3, emoji: '💧' },
          { id: 'agua-oxigenada-20', name: 'Água Oxigenada 20 Vol (1L)', suggestedCost: 12.00, unit: 'litro', minStock: 3, emoji: '💧' },
          { id: 'agua-oxigenada-30', name: 'Água Oxigenada 30 Vol (1L)', suggestedCost: 14.00, unit: 'litro', minStock: 2, emoji: '💧' },
        ]
      },
      {
        id: 'finalizacao',
        name: 'Finalização',
        emoji: '✨',
        supplies: [
          { id: 'talco-pro', name: 'Talco Profissional (500g)', suggestedCost: 25.00, unit: 'pote', minStock: 3, emoji: '☁️' },
          { id: 'spray-brilho', name: 'Spray de Brilho (300ml)', suggestedCost: 30.00, unit: 'lata', minStock: 3, emoji: '✨' },
          { id: 'oleo-maquina', name: 'Óleo para Máquina (120ml)', suggestedCost: 15.00, unit: 'frasco', minStock: 5, emoji: '🛢️' },
        ]
      }
    ]
  },
  {
    id: 'toalhas',
    name: 'Toalhas & Tecidos',
    emoji: '🧺',
    subcategories: [
      {
        id: 'toalhas-uso',
        name: 'Toalhas de Uso',
        emoji: '🧻',
        supplies: [
          { id: 'toalha-rosto', name: 'Toalha de Rosto (unidade)', suggestedCost: 8.00, unit: 'unidade', minStock: 20, emoji: '🧻' },
          { id: 'toalha-barbear', name: 'Toalha para Barbear Quente (unidade)', suggestedCost: 12.00, unit: 'unidade', minStock: 10, emoji: '🔥' },
          { id: 'toalha-banho', name: 'Toalha de Banho (unidade)', suggestedCost: 25.00, unit: 'unidade', minStock: 5, emoji: '🛁' },
        ]
      },
      {
        id: 'capas',
        name: 'Capas & Aventais',
        emoji: '👔',
        supplies: [
          { id: 'capa-corte', name: 'Capa de Corte (unidade)', suggestedCost: 35.00, unit: 'unidade', minStock: 5, emoji: '👔' },
          { id: 'avental', name: 'Avental Barbeiro (unidade)', suggestedCost: 45.00, unit: 'unidade', minStock: 3, emoji: '👕' },
        ]
      }
    ]
  }
];

export const getAllSupplies = (): SupplyTemplate[] => {
  const supplies: SupplyTemplate[] = [];
  
  SUPPLY_CATALOG.forEach(category => {
    category.subcategories.forEach(subcategory => {
      subcategory.supplies.forEach(supply => {
        supplies.push({
          ...supply,
          category: category.name,
          subcategory: subcategory.name
        });
      });
    });
  });
  
  return supplies;
};

export const getSuppliesByCategory = (categoryId: string): SupplyTemplate[] => {
  const category = SUPPLY_CATALOG.find(c => c.id === categoryId);
  if (!category) return [];
  
  const supplies: SupplyTemplate[] = [];
  category.subcategories.forEach(subcategory => {
    subcategory.supplies.forEach(supply => {
      supplies.push({
        ...supply,
        category: category.name,
        subcategory: subcategory.name
      });
    });
  });
  
  return supplies;
};
