const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const CURATED_PRODUCTS = [
  // ---------------------------------------------
  // ELECTRONICS (Strictly tech, gadgets, and tech accessories)
  // ---------------------------------------------
  {
    name: "Apple iPhone 15 Pro 256GB",
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    price: 134900,
    originalPrice: 139900,
    discount: 3,
    category: "Electronics",
    subcategory: "Smartphones",
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800", // iPhone 15 Pro
    rating: 4.8,
    reviews: 1245,
    stock: 50
  },
  {
    name: "Samsung Galaxy S24 Ultra 512GB",
    description: "Experience the new era of Galaxy AI. Features a titanium exterior, a 200MP camera, and a built-in S Pen for ultimate productivity.",
    price: 129999,
    originalPrice: 134999,
    discount: 3,
    category: "Electronics",
    subcategory: "Smartphones",
    image: "https://images.unsplash.com/photo-1706606991536-e39841f6f54c?q=80&w=800", // Samsung S24
    rating: 4.7,
    reviews: 982,
    stock: 45
  },
  {
    name: "Apple MacBook Air M3 13-inch",
    description: "Supercharged by M3. The unbelievably thin and light MacBook Air features a liquid retina display and up to 18 hours of battery life.",
    price: 114900,
    originalPrice: 119900,
    discount: 4,
    category: "Electronics",
    subcategory: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800", // Macbook Air
    rating: 4.9,
    reviews: 876,
    stock: 30
  },
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise cancellation. Two processors control 8 microphones for unprecedented noise cancellation. Exceptional sound quality.",
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    category: "Electronics",
    subcategory: "Audio",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800", // Sony Headphones
    rating: 4.8,
    reviews: 2150,
    stock: 120
  },
  {
    name: "Apple iPad Pro 12.9-inch",
    description: "The ultimate iPad experience with the M2 chip, a breathtaking Liquid Retina XDR display, and blazing-fast wireless connectivity.",
    price: 112900,
    originalPrice: 119900,
    discount: 5,
    category: "Electronics",
    subcategory: "Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800", // iPad
    rating: 4.8,
    reviews: 654,
    stock: 25
  },
  {
    name: "Apple Watch Series 9 Smartwatch",
    description: "A brighter display, advanced health sensors, and the magical new Double Tap gesture. Your ultimate companion for a healthy life.",
    price: 41900,
    originalPrice: 44900,
    discount: 6,
    category: "Electronics",
    subcategory: "Wearables",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=800", // Apple Watch
    rating: 4.7,
    reviews: 1432,
    stock: 80
  },
  {
    name: "Sony PlayStation 5 Console",
    description: "Experience lightning-fast loading, deeper immersion with haptic feedback, and an all-new generation of incredible PlayStation games.",
    price: 54990,
    originalPrice: 59990,
    discount: 8,
    category: "Electronics",
    subcategory: "Gaming",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800", // PS5 Console / Controller
    rating: 4.9,
    reviews: 5430,
    stock: 60
  },
  {
    name: "GoPro HERO12 Black Action Camera",
    description: "Incredible 5.3K video, Emmy Award-winning HyperSmooth 6.0 video stabilization, and enhanced battery life.",
    price: 37990,
    originalPrice: 40990,
    discount: 7,
    category: "Electronics",
    subcategory: "Cameras",
    image: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=800", // GoPro
    rating: 4.6,
    reviews: 840,
    stock: 45
  },
  {
    name: "Keychron K2 Wireless Mechanical Keyboard",
    description: "75% layout hot-swappable mechanical keyboard with tactile brown switches and full RGB backlighting.",
    price: 8499,
    originalPrice: 10999,
    discount: 22,
    category: "Electronics",
    subcategory: "Tech Accessories",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800", // Keyboard
    rating: 4.9,
    reviews: 2100,
    stock: 60
  },
  {
    name: "Logitech MX Master 3S Wireless Mouse",
    description: "The ultimate productivity mouse. Features an 8K DPI sensor for tracking on glass and silent clicks.",
    price: 8999,
    originalPrice: 10999,
    discount: 18,
    category: "Electronics",
    subcategory: "Tech Accessories",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800", // Logitech Mouse
    rating: 4.9,
    reviews: 4500,
    stock: 85
  },

  // ---------------------------------------------
  // FASHION (Strictly clothing and footwear)
  // ---------------------------------------------
  {
    name: "Nike Air Max 270 Sneakers",
    description: "Nike's first lifestyle Air Max brings you style, comfort, and big attitude with its extra-large heel Air unit.",
    price: 11995,
    originalPrice: 14995,
    discount: 20,
    category: "Fashion",
    subcategory: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800", // Nike Shoes
    rating: 4.7,
    reviews: 3210,
    stock: 150
  },
  {
    name: "Adidas Essentials French Terry Hoodie",
    description: "A comfortable, everyday hoodie made with soft French terry fabric. Perfect for workouts or lounging.",
    price: 3599,
    originalPrice: 4599,
    discount: 21,
    category: "Fashion",
    subcategory: "Apparel",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800", // Hoodie
    rating: 4.5,
    reviews: 1120,
    stock: 200
  },
  {
    name: "Levi's 511 Slim Fit Men's Jeans",
    description: "A modern slim with room to move. These classic jeans are a wardrobe staple that looks good on everyone.",
    price: 2899,
    originalPrice: 3599,
    discount: 19,
    category: "Fashion",
    subcategory: "Apparel",
    image: "https://images.unsplash.com/photo-1542272604-780277df60cd?q=80&w=800", // Jeans
    rating: 4.6,
    reviews: 2450,
    stock: 180
  },
  {
    name: "Zara Premium Leather Biker Jacket",
    description: "Classic asymmetrical biker jacket in 100% genuine sheepskin leather with silver-toned hardware.",
    price: 8990,
    originalPrice: 11990,
    discount: 25,
    category: "Fashion",
    subcategory: "Apparel",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800", // Leather Jacket
    rating: 4.8,
    reviews: 430,
    stock: 40
  },
  {
    name: "Calvin Klein Crew Neck Cotton T-Shirt",
    description: "Pure cotton classic fit t-shirt with the signature CK logo on the chest. Soft, breathable, and versatile.",
    price: 1999,
    originalPrice: 2499,
    discount: 20,
    category: "Fashion",
    subcategory: "Apparel",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800", // T-shirt
    rating: 4.4,
    reviews: 1890,
    stock: 300
  },
  {
    name: "Puma Ultraride Running Shoes",
    description: "Lightweight, breathable running shoes designed for ultimate speed and comfort on the track or the street.",
    price: 4999,
    originalPrice: 6999,
    discount: 28,
    category: "Fashion",
    subcategory: "Shoes",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800", // Running Shoes
    rating: 4.5,
    reviews: 875,
    stock: 120
  },
  {
    name: "H&M Floral Summer Midi Dress",
    description: "Breezy viscose fabric with a flattering V-neck and a flowing skirt, perfect for warm summer days.",
    price: 2299,
    originalPrice: 2999,
    discount: 23,
    category: "Fashion",
    subcategory: "Apparel",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800", // Dress
    rating: 4.6,
    reviews: 650,
    stock: 110
  },
  {
    name: "The North Face Nuptse Puffer Jacket",
    description: "The iconic puffer jacket built for extreme warmth and durability. Water-repellent and insulated.",
    price: 24999,
    originalPrice: 27999,
    discount: 10,
    category: "Fashion",
    subcategory: "Apparel",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800", // Puffer Jacket
    rating: 4.9,
    reviews: 1050,
    stock: 35
  },
  {
    name: "Polo Ralph Lauren Oxford Shirt",
    description: "A classic fit button-down oxford shirt made from premium breathable cotton, featuring the signature embroidered pony.",
    price: 6599,
    originalPrice: 7999,
    discount: 17,
    category: "Fashion",
    subcategory: "Apparel",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800", // Oxford shirt
    rating: 4.7,
    reviews: 420,
    stock: 80
  },
  {
    name: "Vans Old Skool Classic Canvas Sneakers",
    description: "The iconic low-top skate shoe featuring durable canvas uppers, signature waffle outsoles, and padded collars.",
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    category: "Fashion",
    subcategory: "Shoes",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800", // Vans Sneakers
    rating: 4.8,
    reviews: 5600,
    stock: 220
  },

  // ---------------------------------------------
  // BOOKS (Strictly books)
  // ---------------------------------------------
  {
    name: "Atomic Habits by James Clear",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. Learn how to build good habits and break bad ones.",
    price: 499,
    originalPrice: 699,
    discount: 28,
    category: "Books",
    subcategory: "Self-Help",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800", // Book
    rating: 4.9,
    reviews: 8540,
    stock: 500
  },
  {
    name: "Deep Work by Cal Newport",
    description: "Rules for focused success in a distracted world. A guide to cultivating deep focus to achieve massive productivity.",
    price: 399,
    originalPrice: 550,
    discount: 27,
    category: "Books",
    subcategory: "Productivity",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800", // Book
    rating: 4.7,
    reviews: 4320,
    stock: 320
  },
  {
    name: "The Psychology of Money by Morgan Housel",
    description: "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't necessarily about what you know. It's about how you behave.",
    price: 350,
    originalPrice: 499,
    discount: 29,
    category: "Books",
    subcategory: "Finance",
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=800", // Book
    rating: 4.8,
    reviews: 7600,
    stock: 450
  },
  {
    name: "Thinking, Fast and Slow by Daniel Kahneman",
    description: "The groundbreaking tour of the mind and explains the two systems that drive the way we think.",
    price: 550,
    originalPrice: 799,
    discount: 31,
    category: "Books",
    subcategory: "Psychology",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800", // Book
    rating: 4.6,
    reviews: 5400,
    stock: 210
  },
  {
    name: "Sapiens: A Brief History of Humankind",
    description: "Dr Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical – and sometimes devastating – breakthroughs of the Cognitive, Agricultural and Scientific Revolutions.",
    price: 650,
    originalPrice: 899,
    discount: 27,
    category: "Books",
    subcategory: "History",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800", // Book
    rating: 4.8,
    reviews: 9800,
    stock: 380
  },
  {
    name: "Rich Dad Poor Dad by Robert Kiyosaki",
    description: "What the rich teach their kids about money that the poor and middle class do not!",
    price: 299,
    originalPrice: 450,
    discount: 33,
    category: "Books",
    subcategory: "Finance",
    image: "https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=800", // Book
    rating: 4.7,
    reviews: 12000,
    stock: 600
  },
  {
    name: "The Alchemist by Paulo Coelho",
    description: "A magical fable about learning to listen to your heart, reading the omens strewn along life's path, and, above all, following your dreams.",
    price: 250,
    originalPrice: 350,
    discount: 28,
    category: "Books",
    subcategory: "Fiction",
    image: "https://images.unsplash.com/photo-1476275466078-4007374efac4?q=80&w=800", // Book
    rating: 4.8,
    reviews: 15400,
    stock: 750
  },
  {
    name: "1984 by George Orwell",
    description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.",
    price: 199,
    originalPrice: 299,
    discount: 33,
    category: "Books",
    subcategory: "Fiction",
    image: "https://images.unsplash.com/photo-1585779034823-7e9ac8fa3707?q=80&w=800", // Book
    rating: 4.7,
    reviews: 8900,
    stock: 400
  },
  {
    name: "Dune by Frank Herbert",
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange.",
    price: 599,
    originalPrice: 799,
    discount: 25,
    category: "Books",
    subcategory: "Sci-Fi",
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800", // Book
    rating: 4.8,
    reviews: 6700,
    stock: 250
  },
  {
    name: "Steve Jobs by Walter Isaacson",
    description: "Based on more than forty interviews with Steve Jobs, this is the exclusive, definitive biography of the Apple co-founder.",
    price: 750,
    originalPrice: 999,
    discount: 24,
    category: "Books",
    subcategory: "Biography",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800", // Book
    rating: 4.7,
    reviews: 4100,
    stock: 150
  },

  // ---------------------------------------------
  // FURNITURE (Strictly furniture)
  // ---------------------------------------------
  {
    name: "Modern L-Shaped Sectional Sofa",
    description: "Premium velvet fabric and high-density foam cushioning. Seats up to 5 people comfortably. Perfect for any modern living room.",
    price: 45999,
    originalPrice: 59999,
    discount: 23,
    category: "Furniture",
    subcategory: "Living Room",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800", // Sofa
    rating: 4.6,
    reviews: 120,
    stock: 12
  },
  {
    name: "Solid Oak Wooden Study Desk",
    description: "Minimalist Scandinavian design with two built-in drawers. Crafted from 100% solid oak wood for lasting durability.",
    price: 18999,
    originalPrice: 24999,
    discount: 24,
    category: "Furniture",
    subcategory: "Office",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800", // Desk
    rating: 4.8,
    reviews: 340,
    stock: 25
  },
  {
    name: "Executive Ergonomic Office Chair",
    description: "Adjustable lumbar support, breathable mesh back, and 3D armrests ensure all-day comfort while working from home.",
    price: 12499,
    originalPrice: 16999,
    discount: 26,
    category: "Furniture",
    subcategory: "Office",
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=800", // Office Chair
    rating: 4.7,
    reviews: 890,
    stock: 45
  },
  {
    name: "Minimalist Glass Coffee Table",
    description: "Tempered glass top with a sleek brushed steel frame. Adds an airy, contemporary feel to your living space.",
    price: 8999,
    originalPrice: 12999,
    discount: 30,
    category: "Furniture",
    subcategory: "Living Room",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=800", // Coffee Table
    rating: 4.5,
    reviews: 210,
    stock: 30
  },
  {
    name: "King Size Platform Bed Frame",
    description: "Sturdy wooden frame with an upholstered headboard. No box spring needed. Supports up to 800 lbs.",
    price: 28999,
    originalPrice: 35999,
    discount: 19,
    category: "Furniture",
    subcategory: "Bedroom",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=800", // Bed
    rating: 4.8,
    reviews: 410,
    stock: 18
  },
  {
    name: "Rustic Oak 5-Tier Bookshelf",
    description: "Industrial style bookcase featuring a black metal frame and thick rustic wood shelves. Perfect for displaying your collection.",
    price: 10499,
    originalPrice: 14499,
    discount: 27,
    category: "Furniture",
    subcategory: "Storage",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=800", // Bookshelf
    rating: 4.7,
    reviews: 560,
    stock: 40
  },
  {
    name: "6-Seater Marble Dining Table Set",
    description: "Elegant marble-finish dining table accompanied by 6 velvet upholstered chairs with golden legs.",
    price: 54999,
    originalPrice: 72999,
    discount: 24,
    category: "Furniture",
    subcategory: "Dining",
    image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?q=80&w=800", // Dining Table
    rating: 4.9,
    reviews: 85,
    stock: 8
  },
  {
    name: "Mid-Century TV Cabinet Stand",
    description: "Accommodates up to 65-inch TVs. Features sliding doors and ample storage for consoles and media.",
    price: 15999,
    originalPrice: 20999,
    discount: 23,
    category: "Furniture",
    subcategory: "Living Room",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800", // TV Cabinet
    rating: 4.6,
    reviews: 320,
    stock: 22
  },
  {
    name: "Velvet Accent Armchair",
    description: "A pop of color for your living room or bedroom. Features a seashell back design and gold-plated legs.",
    price: 9999,
    originalPrice: 13999,
    discount: 28,
    category: "Furniture",
    subcategory: "Living Room",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800", // Accent Chair
    rating: 4.8,
    reviews: 450,
    stock: 35
  },
  {
    name: "Solid Pine Wooden Wardrobe",
    description: "Spacious 3-door wardrobe with hanging rods, shelves, and bottom drawers. Built from premium pine wood.",
    price: 32999,
    originalPrice: 45000,
    discount: 26,
    category: "Furniture",
    subcategory: "Bedroom",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800", // Wardrobe/Closet
    rating: 4.5,
    reviews: 120,
    stock: 15
  },

  // ---------------------------------------------
  // LIFESTYLE (Fitness, wellness, kitchen, home essentials)
  // ---------------------------------------------
  {
    name: "Premium Alignment Yoga Mat",
    description: "Non-slip, eco-friendly TPE material with alignment lines to perfect your poses. Includes a carrying strap.",
    price: 1899,
    originalPrice: 2999,
    discount: 36,
    category: "Lifestyle",
    subcategory: "Fitness",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800", // Yoga Mat
    rating: 4.8,
    reviews: 1240,
    stock: 150
  },
  {
    name: "Stanley Quencher H2.0 FlowState Tumbler",
    description: "The viral 40oz stainless steel tumbler. Keeps water ice-cold for up to 48 hours. Fits in car cup holders.",
    price: 4999,
    originalPrice: 5999,
    discount: 16,
    category: "Lifestyle",
    subcategory: "Drinkware",
    image: "https://images.unsplash.com/photo-1614735241165-6756e1df61ab?q=80&w=800", // Tumbler
    rating: 4.9,
    reviews: 5600,
    stock: 80
  },
  {
    name: "Ultrasonic Aromatherapy Diffuser",
    description: "500ml capacity essential oil diffuser with 7 ambient LED colors and auto-shutoff functionality.",
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    category: "Lifestyle",
    subcategory: "Wellness",
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=800", // Diffuser
    rating: 4.6,
    reviews: 890,
    stock: 200
  },
  {
    name: "Adjustable Dumbbell Set 20kg",
    description: "Space-saving adjustable dumbbells ideal for a home gym setup. Easily switch weights with a click.",
    price: 8999,
    originalPrice: 11999,
    discount: 25,
    category: "Lifestyle",
    subcategory: "Fitness",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800", // Dumbbells
    rating: 4.7,
    reviews: 430,
    stock: 45
  },
  {
    name: "Ceramic Potted Succulent Plant",
    description: "A beautiful, low-maintenance live indoor succulent plant that adds a touch of green to any desk or shelf.",
    price: 499,
    originalPrice: 799,
    discount: 37,
    category: "Lifestyle",
    subcategory: "Home Decor",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800", // Plant
    rating: 4.5,
    reviews: 650,
    stock: 300
  },
  {
    name: "Traditional Japanese Matcha Tea Set",
    description: "Includes a ceramic bowl, bamboo whisk, scoop, and a 50g tin of ceremonial grade matcha powder.",
    price: 3499,
    originalPrice: 4599,
    discount: 23,
    category: "Lifestyle",
    subcategory: "Kitchen",
    image: "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?q=80&w=800", // Matcha Set
    rating: 4.8,
    reviews: 320,
    stock: 60
  },
  {
    name: "Nespresso Essenza Mini Coffee Machine",
    description: "Compact espresso machine that delivers barista-style coffee in seconds. Includes an aeroccino milk frother.",
    price: 14999,
    originalPrice: 17999,
    discount: 16,
    category: "Lifestyle",
    subcategory: "Kitchen",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800", // Coffee Machine
    rating: 4.9,
    reviews: 2100,
    stock: 40
  },
  {
    name: "Vitamin C Brightening Serum",
    description: "A potent 15% Vitamin C serum with hyaluronic acid. Dermatologist tested to brighten skin and reduce dark spots.",
    price: 1299,
    originalPrice: 1899,
    discount: 31,
    category: "Lifestyle",
    subcategory: "Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800", // Serum
    rating: 4.6,
    reviews: 1450,
    stock: 250
  },
  {
    name: "Premium Leather Bound Journal",
    description: "Handcrafted full-grain leather notebook with 240 pages of thick, acid-free dotted paper. Perfect for bullet journaling.",
    price: 999,
    originalPrice: 1499,
    discount: 33,
    category: "Lifestyle",
    subcategory: "Stationery",
    image: "https://images.unsplash.com/photo-1531346878377-a541fa160938?q=80&w=800", // Journal
    rating: 4.8,
    reviews: 890,
    stock: 180
  },
  {
    name: "Waterproof Travel Backpack 40L",
    description: "40L capacity carry-on approved backpack. Features a dedicated laptop sleeve and anti-theft hidden pockets.",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    category: "Lifestyle",
    subcategory: "Travel",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800", // Backpack
    rating: 4.7,
    reviews: 3200,
    stock: 120
  },

  // ---------------------------------------------
  // ACCESSORIES (Strictly personal accessories)
  // ---------------------------------------------
  {
    name: "Ray-Ban Classic Aviator Sunglasses",
    description: "Currently one of the most iconic sunglass models in the world. Designed for U.S. aviators in 1937.",
    price: 7590,
    originalPrice: 8590,
    discount: 11,
    category: "Accessories",
    subcategory: "Eyewear",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800", // Aviators
    rating: 4.9,
    reviews: 3100,
    stock: 90
  },
  {
    name: "Bellroy Slim Leather Wallet",
    description: "Incredibly thin profile that holds up to 10 cards and folded bills. Crafted from environmentally certified leather.",
    price: 4999,
    originalPrice: 5999,
    discount: 16,
    category: "Accessories",
    subcategory: "Everyday Carry",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800", // Wallet
    rating: 4.7,
    reviews: 1250,
    stock: 90
  },
  {
    name: "Casio Vintage Digital Stainless Steel Watch",
    description: "A retro classic that never goes out of style. Features an alarm, stopwatch, and a sleek stainless steel band.",
    price: 1695,
    originalPrice: 1995,
    discount: 15,
    category: "Accessories",
    subcategory: "Watches",
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=800", // Casio Watch
    rating: 4.8,
    reviews: 4200,
    stock: 250
  },
  {
    name: "Sterling Silver Minimalist Necklace",
    description: "Elegant 925 sterling silver chain with a subtle geometric pendant. Perfect for layering or everyday wear.",
    price: 1899,
    originalPrice: 2999,
    discount: 36,
    category: "Accessories",
    subcategory: "Jewelry",
    image: "https://images.unsplash.com/photo-1599643478514-4a4e0a4f5db1?q=80&w=800", // Necklace
    rating: 4.8,
    reviews: 420,
    stock: 110
  },
  {
    name: "Designer Vegan Leather Crossbody Bag",
    description: "Cruelty-free vegan leather bag with gold hardware, an adjustable strap, and a spacious interior for essentials.",
    price: 2999,
    originalPrice: 4499,
    discount: 33,
    category: "Accessories",
    subcategory: "Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800", // Crossbody Bag
    rating: 4.5,
    reviews: 890,
    stock: 75
  },
  {
    name: "Genuine Leather Reversible Belt",
    description: "Premium full-grain leather belt that reverses from black to brown, complete with a silver-toned buckle.",
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    category: "Accessories",
    subcategory: "Belts",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800", // Leather Belt
    rating: 4.6,
    reviews: 650,
    stock: 200
  },
  {
    name: "Classic Wool Fedora Hat",
    description: "Timeless 100% wool fedora hat with a grosgrain ribbon band. Adds a touch of sophistication to any outfit.",
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    category: "Accessories",
    subcategory: "Headwear",
    image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=800", // Fedora Hat
    rating: 4.4,
    reviews: 320,
    stock: 80
  },
  {
    name: "Mulberry Silk Square Scarf",
    description: "Luxurious 100% mulberry silk scarf featuring an elegant floral print. Can be worn around the neck, hair, or bag.",
    price: 1299,
    originalPrice: 1899,
    discount: 31,
    category: "Accessories",
    subcategory: "Scarves",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800", // Silk Scarf
    rating: 4.9,
    reviews: 410,
    stock: 150
  },
  {
    name: "Stainless Steel Cufflinks Set",
    description: "Polished stainless steel cufflinks in a minimalist rectangular design. Includes a premium presentation box.",
    price: 999,
    originalPrice: 1499,
    discount: 33,
    category: "Accessories",
    subcategory: "Jewelry",
    image: "https://images.unsplash.com/photo-1623067860475-43a0558b292e?q=80&w=800", // Cufflinks
    rating: 4.7,
    reviews: 180,
    stock: 120
  },
  {
    name: "RFID Blocking Leather Passport Cover",
    description: "Keep your travel documents safe in style. Premium leather cover that blocks RFID signals to protect your identity.",
    price: 899,
    originalPrice: 1499,
    discount: 40,
    category: "Accessories",
    subcategory: "Travel",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800", // Passport Cover
    rating: 4.7,
    reviews: 560,
    stock: 400
  }
];

const seedDatabase = async (useExistingConnection = false) => {
  try {
    if (!useExistingConnection) {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bazarghar');
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    console.log('Inserting highly curated premium catalog...');
    await Product.insertMany(CURATED_PRODUCTS);
    
    console.log(`Successfully seeded ${CURATED_PRODUCTS.length} curated products!`);
    
    // Quick validation log
    const categories = [...new Set(CURATED_PRODUCTS.map(p => p.category))];
    console.log('Final Database Verification Breakdown:');
    for (const cat of categories) {
      const count = CURATED_PRODUCTS.filter(p => p.category === cat).length;
      console.log(`- ${cat}: ${count}`);
    }

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    if (!useExistingConnection) {
      mongoose.disconnect();
      console.log('Database connection closed.');
    }
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
