export interface ProductTemplate {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  suggestedCost: number;
  suggestedPrice: number;
  emoji: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  emoji: string;
  subcategories: {
    id: string;
    name: string;
    emoji: string;
    products: Omit<ProductTemplate, 'category' | 'subcategory'>[];
  }[];
}

export const PRODUCT_CATALOG: ProductCategory[] = [
  {
    id: 'bebidas',
    name: 'Bebidas',
    emoji: 'ðŸ¥¤',
    subcategories: [
      {
        id: 'refrigerantes',
        name: 'Refrigerantes',
        emoji: 'ðŸ¥¤',
        products: [
          { id: 'coca-lata', name: 'Coca-Cola Lata 350ml', suggestedCost: 3.50, suggestedPrice: 6.00, emoji: 'ðŸ¥¤' },
          { id: 'coca-zero-lata', name: 'Coca-Cola Zero Lata 350ml', suggestedCost: 3.50, suggestedPrice: 6.00, emoji: 'ðŸ¥¤' },
          { id: 'fanta-lata', name: 'Fanta Laranja Lata 350ml', suggestedCost: 3.00, suggestedPrice: 5.50, emoji: 'ðŸŠ' },
          { id: 'sprite-lata', name: 'Sprite Lata 350ml', suggestedCost: 3.00, suggestedPrice: 5.50, emoji: 'ðŸ‹' },
          { id: 'guarana-lata', name: 'GuaranÃ¡ Antarctica Lata 350ml', suggestedCost: 2.80, suggestedPrice: 5.00, emoji: 'ðŸ¥¤' },
          { id: 'schweppes-lata', name: 'Schweppes Citrus Lata 350ml', suggestedCost: 3.50, suggestedPrice: 6.00, emoji: 'ðŸ‹' },
        ]
      },
      {
        id: 'aguas',
        name: 'Ãguas',
        emoji: 'ðŸ’§',
        products: [
          { id: 'agua-500', name: 'Ãgua Mineral 500ml', suggestedCost: 1.50, suggestedPrice: 4.00, emoji: 'ðŸ’§' },
          { id: 'agua-gas-500', name: 'Ãgua com GÃ¡s 500ml', suggestedCost: 2.00, suggestedPrice: 5.00, emoji: 'ðŸ’§' },
          { id: 'agua-coco', name: 'Ãgua de Coco 330ml', suggestedCost: 4.00, suggestedPrice: 8.00, emoji: 'ðŸ¥¥' },
        ]
      },
      {
        id: 'cafes',
        name: 'CafÃ©s',
        emoji: 'â˜•',
        products: [
          { id: 'cafe-expresso', name: 'CafÃ© Expresso', suggestedCost: 1.00, suggestedPrice: 5.00, emoji: 'â˜•' },
          { id: 'cafe-coado', name: 'CafÃ© Coado', suggestedCost: 0.50, suggestedPrice: 3.00, emoji: 'â˜•' },
          { id: 'cappuccino', name: 'Cappuccino', suggestedCost: 2.00, suggestedPrice: 7.00, emoji: 'â˜•' },
          { id: 'cafe-gelado', name: 'CafÃ© Gelado', suggestedCost: 2.50, suggestedPrice: 8.00, emoji: 'ðŸ§Š' },
        ]
      },
      {
        id: 'energeticos',
        name: 'EnergÃ©ticos',
        emoji: 'âš¡',
        products: [
          { id: 'redbull', name: 'Red Bull 250ml', suggestedCost: 7.00, suggestedPrice: 12.00, emoji: 'âš¡' },
          { id: 'monster', name: 'Monster 473ml', suggestedCost: 8.00, suggestedPrice: 14.00, emoji: 'âš¡' },
          { id: 'tnt', name: 'TNT 269ml', suggestedCost: 4.00, suggestedPrice: 8.00, emoji: 'âš¡' },
        ]
      },
      {
        id: 'sucos',
        name: 'Sucos',
        emoji: 'ðŸ§ƒ',
        products: [
          { id: 'suco-laranja', name: 'Suco de Laranja Natural', suggestedCost: 4.00, suggestedPrice: 10.00, emoji: 'ðŸŠ' },
          { id: 'suco-caixa', name: 'Suco de Caixa 200ml', suggestedCost: 2.00, suggestedPrice: 5.00, emoji: 'ðŸ§ƒ' },
        ]
      }
    ]
  },
  {
    id: 'alcoolicas',
    name: 'Bebidas AlcoÃ³licas',
    emoji: 'ðŸº',
    subcategories: [
      {
        id: 'cervejas',
        name: 'Cervejas',
        emoji: 'ðŸº',
        products: [
          { id: 'heineken', name: 'Heineken Long Neck 330ml', suggestedCost: 5.50, suggestedPrice: 12.00, emoji: 'ðŸº' },
          { id: 'budweiser', name: 'Budweiser Long Neck 330ml', suggestedCost: 4.50, suggestedPrice: 10.00, emoji: 'ðŸº' },
          { id: 'corona', name: 'Corona Long Neck 330ml', suggestedCost: 6.00, suggestedPrice: 14.00, emoji: 'ðŸº' },
          { id: 'stella', name: 'Stella Artois Long Neck 330ml', suggestedCost: 5.00, suggestedPrice: 12.00, emoji: 'ðŸº' },
          { id: 'brahma', name: 'Brahma Lata 350ml', suggestedCost: 3.00, suggestedPrice: 7.00, emoji: 'ðŸº' },
          { id: 'skol', name: 'Skol Lata 350ml', suggestedCost: 2.80, suggestedPrice: 6.50, emoji: 'ðŸº' },
          { id: 'original', name: 'Original 600ml', suggestedCost: 8.00, suggestedPrice: 16.00, emoji: 'ðŸº' },
        ]
      },
      {
        id: 'destilados',
        name: 'Destilados (Dose)',
        emoji: 'ðŸ¥ƒ',
        products: [
          { id: 'whisky-dose', name: 'Whisky Dose', suggestedCost: 8.00, suggestedPrice: 20.00, emoji: 'ðŸ¥ƒ' },
          { id: 'vodka-dose', name: 'Vodka Dose', suggestedCost: 5.00, suggestedPrice: 15.00, emoji: 'ðŸ¸' },
          { id: 'gin-tonica', name: 'Gin TÃ´nica', suggestedCost: 10.00, suggestedPrice: 25.00, emoji: 'ðŸ¸' },
          { id: 'cachaca', name: 'CachaÃ§a Dose', suggestedCost: 3.00, suggestedPrice: 8.00, emoji: 'ðŸ¥ƒ' },
        ]
      },
      {
        id: 'vinhos',
        name: 'Vinhos',
        emoji: 'ðŸ·',
        products: [
          { id: 'vinho-taca', name: 'Vinho TaÃ§a', suggestedCost: 8.00, suggestedPrice: 18.00, emoji: 'ðŸ·' },
          { id: 'espumante-taca', name: 'Espumante TaÃ§a', suggestedCost: 10.00, suggestedPrice: 22.00, emoji: 'ðŸ¥‚' },
        ]
      }
    ]
  },
  {
    id: 'snacks',
    name: 'Snacks & Guloseimas',
    emoji: 'ðŸ«',
    subcategories: [
      {
        id: 'chocolates',
        name: 'Chocolates',
        emoji: 'ðŸ«',
        products: [
          { id: 'kitkat', name: 'KitKat', suggestedCost: 3.50, suggestedPrice: 7.00, emoji: 'ðŸ«' },
          { id: 'snickers', name: 'Snickers', suggestedCost: 3.50, suggestedPrice: 7.00, emoji: 'ðŸ«' },
          { id: 'twix', name: 'Twix', suggestedCost: 3.50, suggestedPrice: 7.00, emoji: 'ðŸ«' },
          { id: 'bis', name: 'Bis', suggestedCost: 2.50, suggestedPrice: 5.00, emoji: 'ðŸ«' },
          { id: 'trufas', name: 'Trufas (unidade)', suggestedCost: 2.00, suggestedPrice: 5.00, emoji: 'ðŸ«' },
        ]
      },
      {
        id: 'salgados',
        name: 'Salgadinhos',
        emoji: 'ðŸ¥¨',
        products: [
          { id: 'amendoim', name: 'Amendoim JaponÃªs', suggestedCost: 2.00, suggestedPrice: 5.00, emoji: 'ðŸ¥œ' },
          { id: 'castanhas', name: 'Mix de Castanhas', suggestedCost: 5.00, suggestedPrice: 12.00, emoji: 'ðŸ¥œ' },
          { id: 'batata-chips', name: 'Batata Chips', suggestedCost: 4.00, suggestedPrice: 8.00, emoji: 'ðŸ¥”' },
        ]
      },
      {
        id: 'doces',
        name: 'Balas & Chicletes',
        emoji: 'ðŸ¬',
        products: [
          { id: 'trident', name: 'Trident', suggestedCost: 2.50, suggestedPrice: 5.00, emoji: 'ðŸ¬' },
          { id: 'halls', name: 'Halls', suggestedCost: 2.00, suggestedPrice: 4.00, emoji: 'ðŸ¬' },
          { id: 'mentos', name: 'Mentos', suggestedCost: 2.00, suggestedPrice: 4.00, emoji: 'ðŸ¬' },
        ]
      }
    ]
  },
  {
    id: 'cuidados',
    name: 'Cuidados Masculinos',
    emoji: 'ðŸ’ˆ',
    subcategories: [
      {
        id: 'cabelo',
        name: 'Cabelo',
        emoji: 'ðŸ’‡',
        products: [
          { id: 'pomada', name: 'Pomada Modeladora', suggestedCost: 25.00, suggestedPrice: 55.00, emoji: 'ðŸ’‡' },
          { id: 'cera', name: 'Cera Capilar', suggestedCost: 20.00, suggestedPrice: 45.00, emoji: 'ðŸ’‡' },
          { id: 'gel', name: 'Gel Fixador', suggestedCost: 15.00, suggestedPrice: 35.00, emoji: 'ðŸ’‡' },
          { id: 'shampoo', name: 'Shampoo Masculino', suggestedCost: 18.00, suggestedPrice: 40.00, emoji: 'ðŸ§´' },
          { id: 'condicionador', name: 'Condicionador Masculino', suggestedCost: 18.00, suggestedPrice: 40.00, emoji: 'ðŸ§´' },
          { id: 'tonico', name: 'TÃ´nico Antiqueda', suggestedCost: 35.00, suggestedPrice: 75.00, emoji: 'ðŸ’§' },
        ]
      },
      {
        id: 'barba',
        name: 'Barba',
        emoji: 'ðŸ§”',
        products: [
          { id: 'oleo-barba', name: 'Ã“leo para Barba', suggestedCost: 30.00, suggestedPrice: 65.00, emoji: 'ðŸ§”' },
          { id: 'balm-barba', name: 'Balm para Barba', suggestedCost: 28.00, suggestedPrice: 60.00, emoji: 'ðŸ§”' },
          { id: 'shampoo-barba', name: 'Shampoo para Barba', suggestedCost: 22.00, suggestedPrice: 50.00, emoji: 'ðŸ§´' },
          { id: 'pos-barba', name: 'LoÃ§Ã£o PÃ³s-Barba', suggestedCost: 20.00, suggestedPrice: 45.00, emoji: 'âœ¨' },
        ]
      },
      {
        id: 'pele',
        name: 'Pele',
        emoji: 'ðŸ§´',
        products: [
          { id: 'hidratante', name: 'Hidratante Facial', suggestedCost: 25.00, suggestedPrice: 55.00, emoji: 'ðŸ§´' },
          { id: 'protetor-solar', name: 'Protetor Solar Facial', suggestedCost: 30.00, suggestedPrice: 65.00, emoji: 'â˜€ï¸' },
        ]
      }
    ]
  },
  {
    id: 'acessorios',
    name: 'AcessÃ³rios',
    emoji: 'ðŸŽ',
    subcategories: [
      {
        id: 'ferramentas',
        name: 'Ferramentas',
        emoji: 'ðŸ”§',
        products: [
          { id: 'pente-madeira', name: 'Pente de Madeira', suggestedCost: 15.00, suggestedPrice: 35.00, emoji: 'ðŸª¥' },
          { id: 'escova-barba', name: 'Escova para Barba', suggestedCost: 20.00, suggestedPrice: 45.00, emoji: 'ðŸª¥' },
          { id: 'tesoura', name: 'Tesoura para Barba', suggestedCost: 25.00, suggestedPrice: 55.00, emoji: 'âœ‚ï¸' },
        ]
      },
      {
        id: 'outros',
        name: 'Outros',
        emoji: 'ðŸŽ',
        products: [
          { id: 'necessaire', name: 'Necessaire Masculina', suggestedCost: 30.00, suggestedPrice: 70.00, emoji: 'ðŸ‘œ' },
          { id: 'toalha', name: 'Toalha de Rosto', suggestedCost: 15.00, suggestedPrice: 35.00, emoji: 'ðŸ§»' },
          { id: 'bone', name: 'BonÃ© da Barbearia', suggestedCost: 20.00, suggestedPrice: 50.00, emoji: 'ðŸ§¢' },
          { id: 'camiseta', name: 'Camiseta da Barbearia', suggestedCost: 25.00, suggestedPrice: 60.00, emoji: 'ðŸ‘•' },
        ]
      }
    ]
  }
];

export const getAllProducts = (): ProductTemplate[] => {
  const products: ProductTemplate[] = [];
  
  PRODUCT_CATALOG.forEach(category => {
    category.subcategories.forEach(subcategory => {
      subcategory.products.forEach(product => {
        products.push({
          ...product,
          category: category.name,
          subcategory: subcategory.name
        });
      });
    });
  });
  
  return products;
};

export const getProductsByCategory = (categoryId: string): ProductTemplate[] => {
  const category = PRODUCT_CATALOG.find(c => c.id === categoryId);
  if (!category) return [];
  
  const products: ProductTemplate[] = [];
  category.subcategories.forEach(subcategory => {
    subcategory.products.forEach(product => {
      products.push({
        ...product,
        category: category.name,
        subcategory: subcategory.name
      });
    });
  });
  
  return products;
};
