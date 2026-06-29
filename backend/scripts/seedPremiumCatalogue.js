const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const dns = require('dns');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

dns.setServers(['8.8.8.8', '1.1.1.1']);

// Define the existing 10 electronics
const electronics = [
  {
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony",
    model: "WH-1000XM5",
    category: "Electronics",
    subcategory: "Audio",
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    image: "/images/products/sony_wh_1000xm5.png",
    stock: 50,
    rating: 4.8,
    reviews: 1245,
    description: "Industry-leading noise cancellation. Two processors control 8 microphones for unprecedented noise cancellation."
  },
  {
    name: "Apple iPhone 15 Pro Max (256GB)",
    brand: "Apple",
    model: "A3106",
    category: "Electronics",
    subcategory: "Smartphones",
    price: 159900,
    originalPrice: 159900,
    discount: 0,
    image: "/images/products/iphone_15_pro_max.png",
    stock: 25,
    rating: 4.9,
    reviews: 3410,
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever."
  },
  {
    name: "Samsung Galaxy S24 Ultra (512GB)",
    brand: "Samsung",
    model: "SM-S928B",
    category: "Electronics",
    subcategory: "Smartphones",
    price: 139999,
    originalPrice: 144999,
    discount: 3,
    image: "/images/products/samsung_galaxy_s24_ultra.png",
    stock: 30,
    rating: 4.8,
    reviews: 2100,
    description: "Galaxy AI is here. Welcome to the era of mobile AI."
  },
  {
    name: "Bose QuietComfort Ultra Earbuds",
    brand: "Bose",
    model: "QC Ultra",
    category: "Electronics",
    subcategory: "Audio",
    price: 25900,
    originalPrice: 25900,
    discount: 0,
    image: "/images/products/bose_qc_ultra_earbuds.png",
    stock: 45,
    rating: 4.7,
    reviews: 890,
    description: "Groundbreaking Bose Immersive Audio pushes the boundary of what it means to listen."
  },
  {
    name: "MacBook Air M3 (13-inch, 16GB RAM, 512GB SSD)",
    brand: "Apple",
    model: "M3",
    category: "Electronics",
    subcategory: "Laptops",
    price: 134900,
    originalPrice: 134900,
    discount: 0,
    image: "/images/products/macbook_air_m3.png",
    stock: 15,
    rating: 4.9,
    reviews: 1540,
    description: "Lean. Mean. M3 machine. The MacBook Air breezes through work and play."
  },
  {
    name: "Nintendo Switch OLED Model",
    brand: "Nintendo",
    model: "HEG-001",
    category: "Electronics",
    subcategory: "Gaming",
    price: 32990,
    originalPrice: 34990,
    discount: 5,
    image: "/images/products/nintendo_switch_oled.png",
    stock: 60,
    rating: 4.8,
    reviews: 4200,
    description: "Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen."
  },
  {
    name: "Dell XPS 15 (9530)",
    brand: "Dell",
    model: "XPS 15",
    category: "Electronics",
    subcategory: "Laptops",
    price: 185000,
    originalPrice: 195000,
    discount: 5,
    image: "/images/products/dell_xps_15.png",
    stock: 12,
    rating: 4.6,
    reviews: 650,
    description: "A perfect balance of power and portability. The XPS 15 features a stunning 15.6-inch InfinityEdge display."
  },
  {
    name: "Samsung Odyssey G9 49\" Curved Gaming Monitor",
    brand: "Samsung",
    model: "LC49G95TSSWXXL",
    category: "Electronics",
    subcategory: "Monitors",
    price: 115000,
    originalPrice: 135000,
    discount: 14,
    image: "/images/products/samsung_odyssey_g9.png",
    stock: 8,
    rating: 4.7,
    reviews: 420,
    description: "The curve revolution. 1000R, the new apex of curved screen technology."
  },
  {
    name: "Logitech MX Master 3S Wireless Mouse",
    brand: "Logitech",
    model: "MX Master 3S",
    category: "Electronics",
    subcategory: "Accessories",
    price: 9495,
    originalPrice: 10995,
    discount: 13,
    image: "/images/products/logitech_mx_master_3s.png",
    stock: 85,
    rating: 4.9,
    reviews: 5120,
    description: "An iconic mouse remastered for ultimate tactility, performance, and flow."
  },
  {
    name: "DJI Mini 4 Pro (DJI RC 2)",
    brand: "DJI",
    model: "Mini 4 Pro",
    category: "Electronics",
    subcategory: "Cameras & Drones",
    price: 95000,
    originalPrice: 105000,
    discount: 9,
    image: "/images/products/dji_mini_4_pro.png",
    stock: 20,
    rating: 4.8,
    reviews: 315,
    description: "Mini to the Max. DJI Mini 4 Pro is our most advanced mini-camera drone to date."
  }
];

const newProducts = [
  // FASHION
  {
    name: "Gucci 1953 Horsebit Leather Loafers",
    brand: "Gucci",
    model: "1953",
    category: "Fashion",
    subcategory: "Shoes",
    price: 75000,
    originalPrice: 75000,
    discount: 0,
    image: "/images/products/gucci_leather_loafers.png",
    sourceUrl: "local",
    localSource: "C:\\Users\\Kaustav Ghosh\\.gemini\\antigravity-ide\\brain\\134c2b49-a986-4ea7-a24e-8a5c5d4fcf01\\gucci_leather_loafers_1782685790812.png",
    stock: 12,
    rating: 4.9,
    reviews: 84,
    description: "Iconic Gucci 1953 Horsebit leather loafers. Crafted in Italy with premium calf leather and the classic gold-tone horsebit detail."
  },
  {
    name: "Tom Ford Aviator Sunglasses",
    brand: "Tom Ford",
    model: "FT0711",
    category: "Fashion",
    subcategory: "Accessories",
    price: 32000,
    originalPrice: 38000,
    discount: 15,
    image: "/images/products/tom_ford_aviators.png",
    sourceUrl: "local",
    localSource: "C:\\Users\\Kaustav Ghosh\\.gemini\\antigravity-ide\\brain\\134c2b49-a986-4ea7-a24e-8a5c5d4fcf01\\tom_ford_aviators_1782685799899.png",
    stock: 25,
    rating: 4.8,
    reviews: 156,
    description: "Classic aviator sunglasses featuring a rose gold-tone frame and gradient lenses with 100% UV protection."
  },
  {
    name: "Brunello Cucinelli Cashmere Sweater",
    brand: "Brunello Cucinelli",
    model: "M2200100",
    category: "Fashion",
    subcategory: "Apparel",
    price: 85000,
    originalPrice: 85000,
    discount: 0,
    image: "/images/products/brunello_cashmere.png",
    sourceUrl: "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp",
    stock: 8,
    rating: 5.0,
    reviews: 32,
    description: "Pure cashmere V-neck sweater crafted in Solomeo, Italy. Exceptional softness and a timeless, elegant fit."
  },

  // BOOKS
  {
    name: "The Architecture of Light (Hardcover)",
    brand: "Phaidon Press",
    model: "First Edition",
    category: "Books",
    subcategory: "Architecture",
    price: 4500,
    originalPrice: 5000,
    discount: 10,
    image: "/images/products/architecture_light.jpg",
    sourceUrl: "https://covers.openlibrary.org/b/id/8259441-L.jpg",
    stock: 45,
    rating: 4.9,
    reviews: 120,
    description: "A stunning visual journey through the use of natural light in modern architecture. Features over 300 high-resolution photographs."
  },
  {
    name: "Steve Jobs Biography (Collector's Edition)",
    brand: "Simon & Schuster",
    model: "Hardcover",
    category: "Books",
    subcategory: "Biography",
    price: 2500,
    originalPrice: 2500,
    discount: 0,
    image: "/images/products/steve_jobs_book.jpg",
    sourceUrl: "https://covers.openlibrary.org/b/id/8226191-L.jpg",
    stock: 120,
    rating: 4.8,
    reviews: 840,
    description: "The exclusive collector's edition of the definitive biography of Steve Jobs by Walter Isaacson. Bound in premium cloth."
  },
  {
    name: "Modernism Rediscovered",
    brand: "Taschen",
    model: "Art Edition",
    category: "Books",
    subcategory: "Art & Design",
    price: 12000,
    originalPrice: 15000,
    discount: 20,
    image: "/images/products/modernism_rediscovered.jpg",
    sourceUrl: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
    stock: 15,
    rating: 5.0,
    reviews: 45,
    description: "An incredibly rare art edition showcasing mid-century modernism. Features archival prints and exclusive architectural drafts."
  },

  // FURNITURE
  {
    name: "Annibale Colombo Luxury Sofa",
    brand: "Annibale Colombo",
    model: "Moderna",
    category: "Furniture",
    subcategory: "Living Room",
    price: 245000,
    originalPrice: 280000,
    discount: 12,
    image: "/images/products/colombo_sofa.webp",
    sourceUrl: "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/1.webp",
    stock: 4,
    rating: 4.9,
    reviews: 18,
    description: "A masterpiece of Italian craftsmanship. This luxury sofa combines deep comfort with elegant, sweeping lines and premium fabric."
  },
  {
    name: "Annibale Colombo Bed",
    brand: "Annibale Colombo",
    model: "Elegance",
    category: "Furniture",
    subcategory: "Bedroom",
    price: 320000,
    originalPrice: 350000,
    discount: 8,
    image: "/images/products/colombo_bed.webp",
    sourceUrl: "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/1.webp",
    stock: 2,
    rating: 5.0,
    reviews: 12,
    description: "The epitome of bedroom luxury. Features a hand-carved solid wood frame with a tufted Italian leather headboard."
  },
  {
    name: "Knoll Saarinen Executive Chair",
    brand: "Knoll",
    model: "Executive",
    category: "Furniture",
    subcategory: "Office",
    price: 85000,
    originalPrice: 95000,
    discount: 10,
    image: "/images/products/knoll_chair.webp",
    sourceUrl: "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/1.webp",
    stock: 15,
    rating: 4.8,
    reviews: 94,
    description: "Designed by Eero Saarinen in 1950, this iconic chair features a fluid, sculptural form that brings mid-century elegance to any space."
  },

  // LIFESTYLE
  {
    name: "Chanel Coco Noir Eau De Parfum",
    brand: "Chanel",
    model: "100ml",
    category: "Lifestyle",
    subcategory: "Fragrance",
    price: 14500,
    originalPrice: 14500,
    discount: 0,
    image: "/images/products/chanel_coco_noir.png",
    sourceUrl: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/1.png",
    stock: 35,
    rating: 4.9,
    reviews: 310,
    description: "A magnetic and uncompromising fragrance. Coco Noir reveals a black that is intimate, seductive, and intensely brilliant."
  },
  {
    name: "Dior J'adore Eau de Parfum",
    brand: "Dior",
    model: "50ml",
    category: "Lifestyle",
    subcategory: "Fragrance",
    price: 11000,
    originalPrice: 12500,
    discount: 12,
    image: "/images/products/dior_jadore.png",
    sourceUrl: "https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/1.png",
    stock: 42,
    rating: 4.8,
    reviews: 420,
    description: "The iconic women's floral fragrance by Dior. A bouquet finely crafted down to the last detail, like a custom-made flower."
  },
  {
    name: "Gucci Bloom Eau de Parfum",
    brand: "Gucci",
    model: "100ml",
    category: "Lifestyle",
    subcategory: "Fragrance",
    price: 12800,
    originalPrice: 12800,
    discount: 0,
    image: "/images/products/gucci_bloom.png",
    sourceUrl: "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/1.png",
    stock: 28,
    rating: 4.7,
    reviews: 185,
    description: "Capturing the spirit of the contemporary, diverse, and authentic women of Gucci. Bloom is created to unfold like its name."
  },

  // ACCESSORIES
  {
    name: "Rolex Submariner Date",
    brand: "Rolex",
    model: "126610LN",
    category: "Accessories",
    subcategory: "Watches",
    price: 950000,
    originalPrice: 950000,
    discount: 0,
    image: "/images/products/rolex_submariner.png",
    sourceUrl: "https://cdn.dummyjson.com/products/images/mens-watches/Rolex%20Submariner%20Watch/1.png",
    stock: 1,
    rating: 5.0,
    reviews: 15,
    description: "The archetypal divers' watch. The Rolex Submariner Date in Oystersteel features a Cerachrom bezel insert in black ceramic and a black dial."
  },
  {
    name: "Black Classic Sunglasses",
    brand: "Ray-Ban",
    model: "Wayfarer Classic",
    category: "Accessories",
    subcategory: "Eyewear",
    price: 12500,
    originalPrice: 15000,
    discount: 16,
    image: "/images/products/black_sunglasses.png",
    sourceUrl: "https://cdn.dummyjson.com/products/images/sunglasses/Black%20Sun%20Glasses/1.png",
    stock: 55,
    rating: 4.8,
    reviews: 320,
    description: "The most recognizable style in the history of sunglasses. Since its initial design in 1952, the Wayfarer Classic has gained popularity among celebrities."
  },
  {
    name: "Cartier Love Bracelet",
    brand: "Cartier",
    model: "Yellow Gold",
    category: "Accessories",
    subcategory: "Jewelry",
    price: 580000,
    originalPrice: 580000,
    discount: 0,
    image: "/images/products/cartier_love.png",
    sourceUrl: "https://cdn.dummyjson.com/products/images/womens-jewellery/Green%20Crystal%20Earring/1.png", // Using a premium jewelry image fallback
    stock: 5,
    rating: 4.9,
    reviews: 42,
    description: "A child of 1970s New York, the LOVE collection remains today an iconic symbol of love that transgresses convention."
  }
];

const downloadImage = async (url, filepath) => {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filepath, buffer);
};

const seedDatabase = async () => {
  try {
    const API_URL = 'http://localhost:5000/api';
    const PUBLIC_DIR = path.resolve(__dirname, '../../frontend/public');
    
    // Ensure directories exist
    if (!fs.existsSync(path.join(PUBLIC_DIR, 'images'))) fs.mkdirSync(path.join(PUBLIC_DIR, 'images'));
    if (!fs.existsSync(path.join(PUBLIC_DIR, 'images', 'products'))) fs.mkdirSync(path.join(PUBLIC_DIR, 'images', 'products'));

    console.log('📦 Downloading high-quality product images...');
    for (const prod of newProducts) {
      const destPath = path.join(PUBLIC_DIR, prod.image);
      if (prod.sourceUrl === 'local') {
         if (fs.existsSync(prod.localSource)) {
             fs.copyFileSync(prod.localSource, destPath);
             console.log(`✅ Copied local image: ${prod.image}`);
         } else {
             console.log(`⚠️ Missing local image for: ${prod.name}`);
         }
      } else {
         if (!fs.existsSync(destPath)) {
            try {
              await downloadImage(prod.sourceUrl, destPath);
              console.log(`✅ Downloaded: ${prod.image}`);
            } catch(e) {
              console.log(`❌ Failed to download ${prod.image}: ${e.message}`);
            }
         } else {
            console.log(`⏩ Image already exists: ${prod.image}`);
         }
      }
    }

    console.log('\n🗑️ Wiping existing database via Mongoose directly...');
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI is undefined");
    
    await mongoose.connect(mongoUri, { family: 4 });
    console.log('Connected to MongoDB.');
    
    // Define a loose Product schema to delete everything
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    const delRes = await Product.deleteMany({});
    console.log(`Deleted ${delRes.deletedCount} existing dummy/placeholder products.`);

    console.log('\n🚀 Registering temporary user for seeding...');
    const credentials = {
      name: 'Master Seeder',
      email: `master_seeder_${Date.now()}@bazarghar.com`,
      password: 'password123'
    };

    const authRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const authData = await authRes.json();
    const token = authData.token;
    
    if (!token) throw new Error('Failed to obtain token: ' + authData.message);
    
    console.log('\n🌟 Seeding Premium Catalogue...');
    let count = 0;
    const allProducts = [...electronics, ...newProducts];
    
    for (const prod of allProducts) {
      try {
        const prodData = { ...prod };
        delete prodData.sourceUrl;
        delete prodData.localSource;
        
        const prodRes = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(prodData)
        });
        
        if (!prodRes.ok) {
          const errData = await prodRes.json();
          throw new Error(errData.message || 'Unknown error');
        }
        console.log(`✅ Injected: ${prod.name}`);
        count++;
      } catch (err) {
        console.error(`❌ Failed to inject ${prod.name}:`, err.message);
      }
    }

    console.log(`\n🎉 Successfully built Premium Catalogue! (${count} products verified)`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
