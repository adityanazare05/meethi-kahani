export const INITIAL_CATEGORIES = [
  { id: 'cat-regular', name: 'Regular Luxury', slug: 'regular-luxury', isOnline: true },
  { id: 'cat-protein', name: 'High-Protein Oats', slug: 'protein-oats', isOnline: true },
  { id: 'cat-sugarfree', name: 'Sugar-Free Series', slug: 'sugar-free', isOnline: true }
];

export const INITIAL_COOKIES = [
  /* ---------------- REGULAR LUXURY SERIES (3 SKUs) ---------------- */
  {
    id: 'cookie-1',
    categoryId: 'cat-regular',
    name: 'Royal Saffron Pistachio Molten Melt Cookie',
    slug: 'saffron-pistachio-molten-cookie',
    price: 349,
    stockPieces: 45,
    isOnline: true,
    photoUrls: ['/images/saffron-pistachio.png'],
    kahaniText: 'Handcrafted with Kashmiri saffron strands and roasted Iranian pistachios, featuring a warm, oozy saffron-white chocolate molten core inside.',
    tasteNotes: ['🔥 Molten Saffron Core', 'Roasted Pistachio Crunch', 'Pure Butter Base'],
    provenance: 'Pampore, Kashmir & Kerman, Iran',
    piecesPerBox: 4,
    nutrition: {
      servingWeight: '35 g',
      energy: '168.4 Kcal',
      protein: '4.5 g',
      fat: '11.2 g',
      sugar: '4.8 g'
    }
  },
  {
    id: 'cookie-2',
    categoryId: 'cat-regular',
    name: 'Belgian Dark Chocolate Lava Melt Cookie',
    slug: 'dark-cocoa-lava-cookie',
    price: 299,
    stockPieces: 60,
    isOnline: true,
    photoUrls: ['/images/dark-cocoa.png'],
    kahaniText: '70% single-origin dark Belgian chocolate dough with a rich, warm molten chocolate lava center that oozes on the very first bite.',
    tasteNotes: ['🔥 70% Dark Molten Lava', 'Rich Cocoa Dough', 'Salted Butter Hint'],
    provenance: 'Flanders, Belgium',
    piecesPerBox: 4,
    nutrition: {
      servingWeight: '35 g',
      energy: '175.0 Kcal',
      protein: '3.8 g',
      fat: '12.6 g',
      sugar: '5.2 g'
    }
  },
  {
    id: 'cookie-3',
    categoryId: 'cat-regular',
    name: 'Kannauj Rose Almond Mawa Molten Cookie',
    slug: 'rose-almond-molten-cookie',
    price: 329,
    stockPieces: 30,
    isOnline: true,
    photoUrls: ['/images/rose-almond.png'],
    kahaniText: 'Infused with edible Kannauj damask rose petals and slivered California almonds, featuring a warm, luscious mawa cream molten center.',
    tasteNotes: ['🔥 Molten Mawa Core', 'Damask Rose Aroma', 'Crunchy Almond Bits'],
    provenance: 'Kannauj, Uttar Pradesh',
    piecesPerBox: 4,
    nutrition: {
      servingWeight: '35 g',
      energy: '162.5 Kcal',
      protein: '4.1 g',
      fat: '10.8 g',
      sugar: '4.5 g'
    }
  },

  /* ---------------- HIGH-PROTEIN OATS SERIES (3 SKUs) ---------------- */
  {
    id: 'cookie-4',
    categoryId: 'cat-protein',
    name: 'High-Protein Oats & Dark Molten Lava Cookie',
    slug: 'protein-oats-dark-lava-cookie',
    price: 379,
    stockPieces: 40,
    isOnline: true,
    photoUrls: ['/images/protein-oats-dark.png'],
    kahaniText: 'Hearty rolled oats dough packed with 15g premium whey protein, baked to crisp perfection with a warm dark chocolate molten lava core inside.',
    tasteNotes: ['💪 15g Whey Protein', '🔥 Molten Dark Lava', 'Rolled Oats Crunch'],
    provenance: 'Flanders, Belgium',
    piecesPerBox: 4,
    nutrition: {
      servingWeight: '35 g',
      energy: '158.0 Kcal',
      protein: '15.0 g',
      fat: '5.4 g',
      sugar: '1.8 g'
    }
  },
  {
    id: 'cookie-5',
    categoryId: 'cat-protein',
    name: 'High-Protein Oats & Almond Butter Melt Cookie',
    slug: 'protein-oats-almond-melt-cookie',
    price: 389,
    stockPieces: 35,
    isOnline: true,
    photoUrls: ['/images/protein-oats-almond.png'],
    kahaniText: 'Protein-packed oats dough stuffed with a creamy, warm roasted almond butter molten center for the ultimate fitness indulgence.',
    tasteNotes: ['💪 14g Whey Protein', '🔥 Molten Almond Core', 'Nutty Oats Crunch'],
    provenance: 'California, USA',
    piecesPerBox: 4,
    nutrition: {
      servingWeight: '35 g',
      energy: '161.2 Kcal',
      protein: '14.0 g',
      fat: '6.2 g',
      sugar: '1.5 g'
    }
  },
  {
    id: 'cookie-6',
    categoryId: 'cat-protein',
    name: 'High-Protein Oats & Peanut Butter Fudge Molten Cookie',
    slug: 'protein-oats-pb-fudge-cookie',
    price: 369,
    stockPieces: 50,
    isOnline: true,
    photoUrls: ['/images/protein-oats-pb.png'],
    kahaniText: 'Wholesome rolled oats dough infused with 16g protein and an oozy, warm peanut butter fudge molten core inside.',
    tasteNotes: ['💪 16g Whey Protein', '🔥 Molten PB Fudge', 'Slow-Roasted Oats'],
    provenance: 'Organic Oats Estate',
    piecesPerBox: 4,
    nutrition: {
      servingWeight: '35 g',
      energy: '165.8 Kcal',
      protein: '16.0 g',
      fat: '6.8 g',
      sugar: '1.6 g'
    }
  },

  /* ---------------- SUGAR-FREE SERIES (3 SKUs) ---------------- */
  {
    id: 'cookie-7',
    categoryId: 'cat-sugarfree',
    name: 'Sugar-Free Belgian Dark Chocolate Lava Cookie',
    slug: 'sugar-free-dark-lava-cookie',
    price: 359,
    stockPieces: 45,
    isOnline: true,
    photoUrls: ['/images/sugarfree-dark-lava.png'],
    kahaniText: 'Naturally sweetened with stevia and date syrup, featuring an intense 0% refined sugar dark Belgian chocolate molten lava core inside.',
    tasteNotes: ['🌱 0% Refined Sugar', '🔥 Molten Stevia Lava', '100% Guilt-Free'],
    provenance: 'Flanders, Belgium',
    piecesPerBox: 4,
    nutrition: {
      servingWeight: '35 g',
      energy: '142.0 Kcal',
      protein: '4.0 g',
      fat: '10.5 g',
      sugar: '0.0 g'
    }
  },
  {
    id: 'cookie-8',
    categoryId: 'cat-sugarfree',
    name: 'Sugar-Free Roasted Pistachio Mawa Molten Cookie',
    slug: 'sugar-free-pistachio-molten-cookie',
    price: 379,
    stockPieces: 25,
    isOnline: true,
    photoUrls: ['/images/sugarfree-pistachio.png'],
    kahaniText: 'Zero added refined sugar! Roasted Iranian pistachios dough stuffed with a warm, melt-in-mouth sugar-free pistachio cream molten center.',
    tasteNotes: ['🌱 0% Refined Sugar', '🔥 Molten Pistachio Core', 'Stevia Sweetened'],
    provenance: 'Kerman, Iran',
    piecesPerBox: 4,
    nutrition: {
      servingWeight: '35 g',
      energy: '148.5 Kcal',
      protein: '4.8 g',
      fat: '11.0 g',
      sugar: '0.0 g'
    }
  },
  {
    id: 'cookie-9',
    categoryId: 'cat-sugarfree',
    name: 'Sugar-Free Hazelnut Cocoa Crunch Molten Cookie',
    slug: 'sugar-free-hazelnut-molten-cookie',
    price: 369,
    stockPieces: 30,
    isOnline: true,
    photoUrls: ['/images/sugarfree-hazelnut.png'],
    kahaniText: 'Crisp sugar-free cocoa dough stuffed with a rich, warm sugar-free hazelnut gianduja molten core that flows smoothly.',
    tasteNotes: ['🌱 0% Refined Sugar', '🔥 Molten Hazelnut Lava', 'Crunchy Cocoa'],
    provenance: 'Piedmont, Italy',
    piecesPerBox: 4,
    nutrition: {
      servingWeight: '35 g',
      energy: '145.2 Kcal',
      protein: '4.2 g',
      fat: '10.8 g',
      sugar: '0.0 g'
    }
  }
];

export const INITIAL_HERO_BANNERS = [
  {
    id: 'banner-1',
    headline: '100% Pure Eggless Artisanal Cookies',
    subtitle: 'Slow-baked in Mumbai. Delivered within 24 hours of oven release.',
    imageDesktop: '/images/saffron-pistachio.png',
    ctaLink: '#catalog',
    priority: 1,
    isActive: true
  },
  {
    id: 'banner-2',
    headline: 'Royal Festive Gifting Collection',
    subtitle: 'Build your own custom gift tin with personalized wax-sealed cards.',
    imageDesktop: '/images/gift-box.png',
    ctaLink: '/gifting',
    priority: 2,
    isActive: true
  }
];

export const INITIAL_COUPONS = [
  { id: 'c-1', code: 'MEETHI20', type: 'PERCENT', value: 20, minOrder: 499, isActive: true, description: 'Get 20% OFF on min. order ₹499' },
  { id: 'c-2', code: 'KAHANI100', type: 'FLAT', value: 100, minOrder: 799, isActive: true, description: 'Flat ₹100 OFF on min. order ₹799' },
  { id: 'c-3', code: 'WELCOME15', type: 'PERCENT', value: 15, minOrder: 399, isActive: true, description: 'Extra 15% OFF on First Bakery Order' },
  { id: 'c-4', code: 'FESTIVE250', type: 'FLAT', value: 250, minOrder: 1299, isActive: true, description: 'Flat ₹250 OFF on Gifting & Luxury Tins' }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    customerName: 'Aarav Sharma',
    location: 'Bandra West',
    purchasedItem: 'Royal Saffron Pistachio Molten Cookie',
    ratingCookies: 5,
    reviewText: 'The saffron white chocolate molten core literally exploded in my mouth! You cannot tell it is 100% eggless. Absolute royal perfection.',
    isFeatured: true
  },
  {
    id: 'rev-2',
    customerName: 'Priya Mehta',
    location: 'Powai',
    purchasedItem: 'Sugar-Free Belgian Dark Chocolate Lava Cookie',
    ratingCookies: 5,
    reviewText: 'Zero sugar but 100% guilt-free indulgence! The dark chocolate lava center is so rich and warm. Ordered 3 packs already.',
    isFeatured: true
  },
  {
    id: 'rev-3',
    customerName: 'Kabir Kapoor',
    location: 'Juhu',
    purchasedItem: 'High-Protein Oats & Peanut Butter Fudge Cookie',
    ratingCookies: 5,
    reviewText: '16g protein with an oozy peanut butter fudge core after gym is a game changer! Beats every protein bar I have ever had.',
    isFeatured: true
  },
  {
    id: 'rev-4',
    customerName: 'Ananya Roy',
    location: 'Worli',
    purchasedItem: 'Kannauj Rose Almond Mawa Molten Cookie',
    ratingCookies: 5,
    reviewText: 'The rose aroma and mawa molten center took me straight to royal Rajasthan. The vintage tin box packaging is gorgeous!',
    isFeatured: true
  },
  {
    id: 'rev-5',
    customerName: 'Rohan Deshmukh',
    location: 'Lower Parel',
    purchasedItem: 'Classic Belgian Dark Chocolate Molten Cookie',
    ratingCookies: 5,
    reviewText: 'Warm, gooey molten lava inside every single bite. We baked them in microwave for 10 seconds — heavenly!',
    isFeatured: true
  },
  {
    id: 'rev-6',
    customerName: 'Simran Kaur',
    location: 'Lokhandwala',
    purchasedItem: 'Sugar-Free Hazelnut Praline Molten Cookie',
    ratingCookies: 5,
    reviewText: 'Finding sugar-free luxury cookies in Mumbai that taste this rich was impossible until Meethi Kahani. 10/10 recommendation!',
    isFeatured: true
  },
  {
    id: 'rev-7',
    customerName: 'Vikram Kulkarni',
    location: 'Thane West',
    purchasedItem: 'High-Protein Oats Dark Chocolate Molten Cookie',
    ratingCookies: 5,
    reviewText: 'High protein without any dry chalky taste! Rolled oats, grass-fed butter, and molten dark chocolate. Ordering weekly now.',
    isFeatured: true
  },
  {
    id: 'rev-8',
    customerName: 'Neha Verma',
    location: 'Colaba',
    purchasedItem: 'Double Dark Chocolate Fudge Lava Cookie',
    ratingCookies: 5,
    reviewText: 'Bought 4 tins for my office team party. Everyone was asking where I ordered these molten cookies from. Royal flavor!',
    isFeatured: true
  }
];

export const SERVICEABLE_PINCODES = ['400050', '400051', '400076', '400001', '400002', '400053', '400601'];
