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
    emoji: '🥤',
    subcategories: [
      {
        id: 'refrigerantes',
        name: 'Refrigerantes',
        emoji: '🥤',
        products: [
          { id: 'coca-lata', name: 'Coca-Cola Lata 350ml', suggestedCost: 3.50, suggestedPrice: 6.00, emoji: '🥤' },
          { id: 'coca-zero-lata', name: 'Coca-Cola Zero Lata 350ml', suggestedCost: 3.50, suggestedPrice: 6.00, emoji: '🥤' },
          { id: 'fanta-lata', name: 'Fanta Laranja Lata 350ml', suggestedCost: 3.00, suggestedPrice: 5.50, emoji: '🍊' },
          { id: 'sprite-lata', name: 'Sprite Lata 350ml', suggestedCost: 3.00, suggestedPrice: 5.50, emoji: '🍋' },
          { id: 'guarana-lata', name: 'Guaraná Antarctica Lata 350ml', suggestedCost: 2.80, suggestedPrice: 5.00, emoji: '🥤' },
          { id: 'schweppes-lata', name: 'Schweppes Citrus Lata 350ml', suggestedCost: 3.50, suggestedPrice: 6.00, emoji: '🍋' },
        ]
      },
      {
        id: 'aguas',
        name: 'Águas',
        emoji: '💧',
        products: [
          { id: 'agua-500', name: 'Água Mineral 500ml', suggestedCost: 1.50, suggestedPrice: 4.00, emoji: '💧' },
          { id: 'agua-gas-500', name: 'Água com Gás 500ml', suggestedCost: 2.00, suggestedPrice: 5.00, emoji: '💧' },
          { id: 'agua-coco', name: 'Água de Coco 330ml', suggestedCost: 4.00, suggestedPrice: 8.00, emoji: '🥥' },
        ]
      },
      {
        id: 'cafes',
        name: 'Cafés',
        emoji: '☕',
        products: [
          { id: 'cafe-expresso', name: 'Café Expresso', suggestedCost: 1.00, suggestedPrice: 5.00, emoji: '☕' },
          { id: 'cafe-coado', name: 'Café Coado', suggestedCost: 0.50, suggestedPrice: 3.00, emoji: '☕' },
          { id: 'cappuccino', name: 'Cappuccino', suggestedCost: 2.00, suggestedPrice: 7.00, emoji: '☕' },
          { id: 'cafe-gelado', name: 'Café Gelado', suggestedCost: 2.50, suggestedPrice: 8.00, emoji: '🧊' },
        ]
      },
      {
        id: 'energeticos',
        name: 'Energéticos',
        emoji: '⚡',
        products: [
          { id: 'redbull', name: 'Red Bull 250ml', suggestedCost: 7.00, suggestedPrice: 12.00, emoji: '⚡' },
          { id: 'monster', name: 'Monster 473ml', suggestedCost: 8.00, suggestedPrice: 14.00, emoji: '⚡' },
          { id: 'tnt', name: 'TNT 269ml', suggestedCost: 4.00, suggestedPrice: 8.00, emoji: '⚡' },
        ]
      },
      {
        id: 'sucos',
        name: 'Sucos',
        emoji: '🧃',
        products: [
          { id: 'suco-laranja', name: 'Suco de Laranja Natural', suggestedCost: 4.00, suggestedPrice: 10.00, emoji: '🍊' },
          { id: 'suco-caixa', name: 'Suco de Caixa 200ml', suggestedCost: 2.00, suggestedPrice: 5.00, emoji: '🧃' },
        ]
      }
    ]
  },
  {
    id: 'alcoolicas',
    name: 'Bebidas Alcoólicas',
    emoji: '🍺',
    subcategories: [
      {
        id: 'cervejas',
        name: 'Cervejas',
        emoji: '🍺',
        products: [
          { id: 'heineken', name: 'Heineken Long Neck 330ml', suggestedCost: 5.50, suggestedPrice: 12.00, emoji: '🍺' },
          { id: 'budweiser', name: 'Budweiser Long Neck 330ml', suggestedCost: 4.50, suggestedPrice: 10.00, emoji: '🍺' },
          { id: 'corona', name: 'Corona Long Neck 330ml', suggestedCost: 6.00, suggestedPrice: 14.00, emoji: '🍺' },
          { id: 'stella', name: 'Stella Artois Long Neck 330ml', suggestedCost: 5.00, suggestedPrice: 12.00, emoji: '🍺' },
          { id: 'brahma', name: 'Brahma Lata 350ml', suggestedCost: 3.00, suggestedPrice: 7.00, emoji: '🍺' },
          { id: 'skol', name: 'Skol Lata 350ml', suggestedCost: 2.80, suggestedPrice: 6.50, emoji: '🍺' },
          { id: 'original', name: 'Original 600ml', suggestedCost: 8.00, suggestedPrice: 16.00, emoji: '🍺' },
        ]
      },
      {
        id: 'destilados',
        name: 'Destilados (Dose)',
        emoji: '🥃',
        products: [
          { id: 'whisky-dose', name: 'Whisky Dose', suggestedCost: 8.00, suggestedPrice: 20.00, emoji: '🥃' },
          { id: 'vodka-dose', name: 'Vodka Dose', suggestedCost: 5.00, suggestedPrice: 15.00, emoji: '🍸' },
          { id: 'gin-tonica', name: 'Gin Tônica', suggestedCost: 10.00, suggestedPrice: 25.00, emoji: '🍸' },
          { id: 'cachaca', name: 'Cachaça Dose', suggestedCost: 3.00, suggestedPrice: 8.00, emoji: '🥃' },
        ]
      },
      {
        id: 'vinhos',
        name: 'Vinhos',
        emoji: '🍷',
        products: [
          { id: 'vinho-taca', name: 'Vinho Taça', suggestedCost: 8.00, suggestedPrice: 18.00, emoji: '🍷' },
          { id: 'espumante-taca', name: 'Espumante Taça', suggestedCost: 10.00, suggestedPrice: 22.00, emoji: '🥂' },
        ]
      }
    ]
  },
  {
    id: 'snacks',
    name: 'Snacks & Guloseimas',
    emoji: '🍫',
    subcategories: [
      {
        id: 'chocolates',
        name: 'Chocolates',
        emoji: '🍫',
        products: [
          { id: 'kitkat', name: 'KitKat', suggestedCost: 3.50, suggestedPrice: 7.00, emoji: '🍫' },
          { id: 'snickers', name: 'Snickers', suggestedCost: 3.50, suggestedPrice: 7.00, emoji: '🍫' },
          { id: 'twix', name: 'Twix', suggestedCost: 3.50, suggestedPrice: 7.00, emoji: '🍫' },
          { id: 'bis', name: 'Bis', suggestedCost: 2.50, suggestedPrice: 5.00, emoji: '🍫' },
          { id: 'trufas', name: 'Trufas (unidade)', suggestedCost: 2.00, suggestedPrice: 5.00, emoji: '🍫' },
        ]
      },
      {
        id: 'salgados',
        name: 'Salgadinhos',
        emoji: '🥨',
        products: [
          { id: 'amendoim', name: 'Amendoim Japonês', suggestedCost: 2.00, suggestedPrice: 5.00, emoji: '🥜' },
          { id: 'castanhas', name: 'Mix de Castanhas', suggestedCost: 5.00, suggestedPrice: 12.00, emoji: '🥜' },
          { id: 'batata-chips', name: 'Batata Chips', suggestedCost: 4.00, suggestedPrice: 8.00, emoji: '🥔' },
        ]
      },
      {
        id: 'doces',
        name: 'Balas & Chicletes',
        emoji: '🍬',
        products: [
          { id: 'trident', name: 'Trident', suggestedCost: 2.50, suggestedPrice: 5.00, emoji: '🍬' },
          { id: 'halls', name: 'Halls', suggestedCost: 2.00, suggestedPrice: 4.00, emoji: '🍬' },
          { id: 'mentos', name: 'Mentos', suggestedCost: 2.00, suggestedPrice: 4.00, emoji: '🍬' },
        ]
      }
    ]
  },
  {
    id: 'cuidados',
    name: 'Cuidados Masculinos',
    emoji: '💈',
    subcategories: [
      {
        id: 'cabelo',
        name: 'Cabelo',
        emoji: '💇',
        products: [
          { id: 'pomada', name: 'Pomada Modeladora', suggestedCost: 25.00, suggestedPrice: 55.00, emoji: '💇' },
          { id: 'cera', name: 'Cera Capilar', suggestedCost: 20.00, suggestedPrice: 45.00, emoji: '💇' },
          { id: 'gel', name: 'Gel Fixador', suggestedCost: 15.00, suggestedPrice: 35.00, emoji: '💇' },
          { id: 'shampoo', name: 'Shampoo Masculino', suggestedCost: 18.00, suggestedPrice: 40.00, emoji: '🧴' },
          { id: 'condicionador', name: 'Condicionador Masculino', suggestedCost: 18.00, suggestedPrice: 40.00, emoji: '🧴' },
          { id: 'tonico', name: 'Tônico Antiqueda', suggestedCost: 35.00, suggestedPrice: 75.00, emoji: '💧' },
        ]
      },
      {
        id: 'barba',
        name: 'Barba',
        emoji: '🧔',
        products: [
          { id: 'oleo-barba', name: 'Óleo para Barba', suggestedCost: 30.00, suggestedPrice: 65.00, emoji: '🧔' },
          { id: 'balm-barba', name: 'Balm para Barba', suggestedCost: 28.00, suggestedPrice: 60.00, emoji: '🧔' },
          { id: 'shampoo-barba', name: 'Shampoo para Barba', suggestedCost: 22.00, suggestedPrice: 50.00, emoji: '🧴' },
          { id: 'pos-barba', name: 'Loção Pós-Barba', suggestedCost: 20.00, suggestedPrice: 45.00, emoji: '✨' },
        ]
      },
      {
        id: 'pele',
        name: 'Pele',
        emoji: '🧴',
        products: [
          { id: 'hidratante', name: 'Hidratante Facial', suggestedCost: 25.00, suggestedPrice: 55.00, emoji: '🧴' },
          { id: 'protetor-solar', name: 'Protetor Solar Facial', suggestedCost: 30.00, suggestedPrice: 65.00, emoji: '☀️' },
        ]
      }
    ]
  },
  {
    id: 'acessorios',
    name: 'Acessórios',
    emoji: '🎁',
    subcategories: [
      {
        id: 'ferramentas',
        name: 'Ferramentas',
        emoji: '🔧',
        products: [
          { id: 'pente-madeira', name: 'Pente de Madeira', suggestedCost: 15.00, suggestedPrice: 35.00, emoji: '🪥' },
          { id: 'escova-barba', name: 'Escova para Barba', suggestedCost: 20.00, suggestedPrice: 45.00, emoji: '🪥' },
          { id: 'tesoura', name: 'Tesoura para Barba', suggestedCost: 25.00, suggestedPrice: 55.00, emoji: '✂️' },
        ]
      },
      {
        id: 'outros',
        name: 'Outros',
        emoji: '🎁',
        products: [
          { id: 'necessaire', name: 'Necessaire Masculina', suggestedCost: 30.00, suggestedPrice: 70.00, emoji: '👜' },
          { id: 'toalha', name: 'Toalha de Rosto', suggestedCost: 15.00, suggestedPrice: 35.00, emoji: '🧻' },
          { id: 'bone', name: 'Boné da Barbearia', suggestedCost: 20.00, suggestedPrice: 50.00, emoji: '🧢' },
          { id: 'camiseta', name: 'Camiseta da Barbearia', suggestedCost: 25.00, suggestedPrice: 60.00, emoji: '👕' },
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
