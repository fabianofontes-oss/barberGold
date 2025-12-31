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
    name: 'ConsumÃ­veis BÃ¡sicos',
    emoji: 'ðŸ”§',
    subcategories: [
      {
        id: 'laminas',
        name: 'LÃ¢minas & Navalhas',
        emoji: 'ðŸª’',
        supplies: [
          { id: 'lamina-gillette', name: 'LÃ¢mina Gillette (cartela 5un)', suggestedCost: 15.00, unit: 'cartela', minStock: 10, emoji: 'ðŸª’' },
          { id: 'lamina-descartavel', name: 'LÃ¢mina DescartÃ¡vel (caixa 100un)', suggestedCost: 25.00, unit: 'caixa', minStock: 2, emoji: 'ðŸª’' },
          { id: 'navalha-descartavel', name: 'Navalha DescartÃ¡vel (caixa 50un)', suggestedCost: 35.00, unit: 'caixa', minStock: 3, emoji: 'ðŸª’' },
        ]
      },
      {
        id: 'papel-algodao',
        name: 'Papel & AlgodÃ£o',
        emoji: 'ðŸ§»',
        supplies: [
          { id: 'papel-toalha', name: 'Papel Toalha (pacote)', suggestedCost: 8.00, unit: 'pacote', minStock: 5, emoji: 'ðŸ§»' },
          { id: 'papel-pescoco', name: 'Papel de PescoÃ§o (rolo)', suggestedCost: 12.00, unit: 'rolo', minStock: 10, emoji: 'ðŸ§»' },
          { id: 'algodao', name: 'AlgodÃ£o (pacote 500g)', suggestedCost: 15.00, unit: 'pacote', minStock: 3, emoji: 'â˜ï¸' },
        ]
      },
      {
        id: 'cremes',
        name: 'Cremes & Espumas',
        emoji: 'ðŸ§´',
        supplies: [
          { id: 'creme-barbear', name: 'Creme de Barbear (500ml)', suggestedCost: 25.00, unit: 'frasco', minStock: 3, emoji: 'ðŸ§´' },
          { id: 'espuma-barbear', name: 'Espuma de Barbear (400ml)', suggestedCost: 18.00, unit: 'lata', minStock: 5, emoji: 'ðŸ§´' },
          { id: 'gel-pos-barba', name: 'Gel PÃ³s-Barba (500ml)', suggestedCost: 22.00, unit: 'frasco', minStock: 3, emoji: 'âœ¨' },
        ]
      }
    ]
  },
  {
    id: 'higiene',
    name: 'Higiene & Limpeza',
    emoji: 'ðŸ§¹',
    subcategories: [
      {
        id: 'esterilizacao',
        name: 'EsterilizaÃ§Ã£o',
        emoji: 'ðŸ”¬',
        supplies: [
          { id: 'alcool-70', name: 'Ãlcool 70% (1L)', suggestedCost: 8.00, unit: 'litro', minStock: 5, emoji: 'ðŸ§ª' },
          { id: 'spray-clipper', name: 'Spray Desinfetante Clipper (500ml)', suggestedCost: 35.00, unit: 'frasco', minStock: 3, emoji: 'ðŸ”¬' },
          { id: 'barbicide', name: 'Barbicide (480ml)', suggestedCost: 55.00, unit: 'frasco', minStock: 2, emoji: 'ðŸ”¬' },
          { id: 'luvas', name: 'Luvas DescartÃ¡veis (caixa 100un)', suggestedCost: 25.00, unit: 'caixa', minStock: 2, emoji: 'ðŸ§¤' },
        ]
      },
      {
        id: 'limpeza',
        name: 'Limpeza Geral',
        emoji: 'ðŸ§¹',
        supplies: [
          { id: 'sabao-liquido', name: 'SabÃ£o LÃ­quido (5L)', suggestedCost: 20.00, unit: 'galÃ£o', minStock: 2, emoji: 'ðŸ§´' },
          { id: 'desinfetante', name: 'Desinfetante (5L)', suggestedCost: 18.00, unit: 'galÃ£o', minStock: 2, emoji: 'ðŸ§¹' },
          { id: 'limpador-vidros', name: 'Limpa Vidros (500ml)', suggestedCost: 8.00, unit: 'frasco', minStock: 3, emoji: 'âœ¨' },
        ]
      },
      {
        id: 'descartaveis',
        name: 'DescartÃ¡veis',
        emoji: 'ðŸ—‘ï¸',
        supplies: [
          { id: 'capa-tnt', name: 'Capa TNT (pacote 50un)', suggestedCost: 40.00, unit: 'pacote', minStock: 2, emoji: 'ðŸ‘•' },
          { id: 'touca', name: 'Touca DescartÃ¡vel (pacote 100un)', suggestedCost: 15.00, unit: 'pacote', minStock: 2, emoji: 'ðŸ§¢' },
          { id: 'saco-lixo', name: 'Saco de Lixo 50L (pacote 100un)', suggestedCost: 25.00, unit: 'pacote', minStock: 2, emoji: 'ðŸ—‘ï¸' },
        ]
      }
    ]
  },
  {
    id: 'profissional',
    name: 'Produtos Profissionais',
    emoji: 'ðŸ’ˆ',
    subcategories: [
      {
        id: 'shampoos',
        name: 'Shampoos & Condicionadores',
        emoji: 'ðŸ§´',
        supplies: [
          { id: 'shampoo-galao', name: 'Shampoo Profissional (5L)', suggestedCost: 45.00, unit: 'galÃ£o', minStock: 2, emoji: 'ðŸ§´' },
          { id: 'condicionador-galao', name: 'Condicionador Profissional (5L)', suggestedCost: 50.00, unit: 'galÃ£o', minStock: 2, emoji: 'ðŸ§´' },
          { id: 'shampoo-barba-pro', name: 'Shampoo para Barba Profissional (1L)', suggestedCost: 35.00, unit: 'litro', minStock: 2, emoji: 'ðŸ§”' },
        ]
      },
      {
        id: 'coloracao',
        name: 'ColoraÃ§Ã£o',
        emoji: 'ðŸŽ¨',
        supplies: [
          { id: 'tintura-preta', name: 'Tintura Preta', suggestedCost: 18.00, unit: 'bisnaga', minStock: 5, emoji: 'â¬›' },
          { id: 'tintura-castanho', name: 'Tintura Castanho', suggestedCost: 18.00, unit: 'bisnaga', minStock: 5, emoji: 'ðŸŸ«' },
          { id: 'tintura-loiro', name: 'Tintura Loiro', suggestedCost: 18.00, unit: 'bisnaga', minStock: 3, emoji: 'ðŸŸ¨' },
          { id: 'agua-oxigenada-10', name: 'Ãgua Oxigenada 10 Vol (1L)', suggestedCost: 12.00, unit: 'litro', minStock: 3, emoji: 'ðŸ’§' },
          { id: 'agua-oxigenada-20', name: 'Ãgua Oxigenada 20 Vol (1L)', suggestedCost: 12.00, unit: 'litro', minStock: 3, emoji: 'ðŸ’§' },
          { id: 'agua-oxigenada-30', name: 'Ãgua Oxigenada 30 Vol (1L)', suggestedCost: 14.00, unit: 'litro', minStock: 2, emoji: 'ðŸ’§' },
        ]
      },
      {
        id: 'finalizacao',
        name: 'FinalizaÃ§Ã£o',
        emoji: 'âœ¨',
        supplies: [
          { id: 'talco-pro', name: 'Talco Profissional (500g)', suggestedCost: 25.00, unit: 'pote', minStock: 3, emoji: 'â˜ï¸' },
          { id: 'spray-brilho', name: 'Spray de Brilho (300ml)', suggestedCost: 30.00, unit: 'lata', minStock: 3, emoji: 'âœ¨' },
          { id: 'oleo-maquina', name: 'Ã“leo para MÃ¡quina (120ml)', suggestedCost: 15.00, unit: 'frasco', minStock: 5, emoji: 'ðŸ›¢ï¸' },
        ]
      }
    ]
  },
  {
    id: 'toalhas',
    name: 'Toalhas & Tecidos',
    emoji: 'ðŸ§º',
    subcategories: [
      {
        id: 'toalhas-uso',
        name: 'Toalhas de Uso',
        emoji: 'ðŸ§»',
        supplies: [
          { id: 'toalha-rosto', name: 'Toalha de Rosto (unidade)', suggestedCost: 8.00, unit: 'unidade', minStock: 20, emoji: 'ðŸ§»' },
          { id: 'toalha-barbear', name: 'Toalha para Barbear Quente (unidade)', suggestedCost: 12.00, unit: 'unidade', minStock: 10, emoji: 'ðŸ”¥' },
          { id: 'toalha-banho', name: 'Toalha de Banho (unidade)', suggestedCost: 25.00, unit: 'unidade', minStock: 5, emoji: 'ðŸ›' },
        ]
      },
      {
        id: 'capas',
        name: 'Capas & Aventais',
        emoji: 'ðŸ‘”',
        supplies: [
          { id: 'capa-corte', name: 'Capa de Corte (unidade)', suggestedCost: 35.00, unit: 'unidade', minStock: 5, emoji: 'ðŸ‘”' },
          { id: 'avental', name: 'Avental Barbeiro (unidade)', suggestedCost: 45.00, unit: 'unidade', minStock: 3, emoji: 'ðŸ‘•' },
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
