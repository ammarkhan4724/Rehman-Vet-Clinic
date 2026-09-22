import React, { useState, useMemo, useEffect } from "react";
import { detectSqlInjection, sanitizeInput, isRateLimited } from "../utils/security";
import { saveOrder, type CartLineItem, type OrderItem } from "../utils/orders";
import CheckoutModal from "./CheckoutModal";
import CartDrawer from "./CartDrawer";

export interface Product {
  id: string;
  name: string;
  category: "cat-food" | "kitten-care" | "litter" | "beds-housing" | "gear" | "pharmacy" | "dog";
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  weightOrSize: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  image: string;
  description: string;
  clinicalNote: string;
  keywords: string[];
}

export const PRODUCTS: Product[] = [
  // CAT & KITTEN NUTRITION
  {
    id: "fluffy-cat-food-1-2kg",
    name: "Fluffy Premium Adult Cat Food (Poultry & Ocean Fish)",
    category: "cat-food",
    categoryLabel: "Cat Food",
    price: 1850,
    originalPrice: 2100,
    weightOrSize: "1.2 kg",
    badge: "Best Seller in Pakistan",
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    image: "/images/products/fluffy-cat-food-1-2kg.png",
    description: "Formulated with 32% high-grade animal protein, Omega-3 fatty acids, and essential taurine. Prevents hairballs and supports glossy fur for all cat breeds in Pakistan.",
    clinicalNote: "Dr. Saif's Note: Low ash formula with balanced urinary pH (6.2-6.5) to protect cats from feline lower urinary tract disease (FLUTD).",
    keywords: ["fluffy cat food", "cat food", "cat food price in pakistan"]
  },
  {
    id: "fluffy-cat-food-3kg",
    name: "Fluffy Cat Food Economy Pack (Ocean Blend)",
    category: "cat-food",
    categoryLabel: "Cat Food",
    price: 4350,
    originalPrice: 4800,
    weightOrSize: "3.0 kg",
    badge: "Value Pack",
    rating: 4.8,
    reviewCount: 96,
    inStock: true,
    image: "/images/products/fluffy-cat-food-3kg.png",
    description: "Economy family pack with enhanced prebiotics, natural antioxidants, and crunchy kibble design that reduces dental tartar buildup in adult cats.",
    clinicalNote: "Dr. Saif's Note: Suitable for multi-cat households. Ensure fresh clean water is available alongside dry kibble at all times.",
    keywords: ["fluffy cat food", "cat food price in pakistan", "dry cat food"]
  },
  {
    id: "nourvet-gold-cat-food",
    name: "Nourvet Gold Adult & Kitten Formula with Fresh Salmon",
    category: "cat-food",
    categoryLabel: "Cat Food",
    price: 2450,
    originalPrice: 2800,
    weightOrSize: "1.5 kg",
    badge: "High Protein 34%",
    rating: 4.9,
    reviewCount: 118,
    inStock: true,
    image: "/images/products/nourvet-gold-cat-food.jpg",
    description: "Enriched with Atlantic wild salmon, DHA for brain health, and zinc for dense, luxurious Persian cat coats. Hypoallergenic grain-friendly formula.",
    clinicalNote: "Dr. Saif's Note: Excellent palatability for picky Persian, British Shorthair, and Siamese cats.",
    keywords: ["nourvet cat food", "nourvet cat food price in pakistan", "best cat food"]
  },
  {
    id: "pawfect-gourmet-cat-food",
    name: "Pawfect Gourmet Complete Cat Food",
    category: "cat-food",
    categoryLabel: "Cat Food",
    price: 1950,
    originalPrice: 2300,
    weightOrSize: "1.2 kg",
    badge: "Veterinarian Formulated",
    rating: 4.7,
    reviewCount: 84,
    inStock: true,
    image: "/images/products/pawfect-gourmet-cat-food.png",
    description: "Complete and balanced daily ration designed for indoor cats. Contains natural yucca schidigera extract to reduce litter box fecal odors.",
    clinicalNote: "Dr. Saif's Note: Ideal indoor formula with moderate fat (14%) to prevent obesity in neutered indoor pets.",
    keywords: ["pawfect cat food", "cat food", "cat feed"]
  },
  {
    id: "royal-canin-kitten",
    name: "Royal Canin Kitten Health Nutrition (4-12 Months)",
    category: "cat-food",
    categoryLabel: "Cat Food",
    price: 6850,
    originalPrice: 7500,
    weightOrSize: "2.0 kg",
    badge: "Gold Standard Import",
    rating: 5.0,
    reviewCount: 210,
    inStock: true,
    image: "/images/products/royal-canin-kitten.jpg",
    description: "International veterinary gold standard for growing kittens. Highly digestible proteins (L.I.P.), patented complex of antioxidants, and immune booster.",
    clinicalNote: "Dr. Saif's Note: The definitive recommended diet for weaning kittens transitioning from mother's milk to solid food.",
    keywords: ["royal canin cat food", "royal canin", "best kitten food"]
  },
  {
    id: "reflex-plus-salmon",
    name: "Reflex Plus Adult Cat Food with Salmon & XOS Prebiotics",
    category: "cat-food",
    categoryLabel: "Cat Food",
    price: 3600,
    originalPrice: 4000,
    weightOrSize: "1.5 kg",
    badge: "Super Premium",
    rating: 4.8,
    reviewCount: 92,
    inStock: true,
    image: "/images/products/reflex-plus-salmon.png",
    description: "Manufactured in Turkey with xylo-oligosaccharides (XOS) to support gut microbiome balance, prevent digestive sensitivity, and eliminate urinary stones.",
    clinicalNote: "Dr. Saif's Note: Clinical choice for cats prone to sensitive stomachs or recurrent constipation.",
    keywords: ["reflex cat food", "cat food price in pakistan", "super premium cat food"]
  },

  // KITTEN MILK & ORPHAN CARE
  {
    id: "petag-kmr-kitten-milk-powder",
    name: "PetAg KMR Kitten Milk Replacer Powder (Authentic USA)",
    category: "kitten-care",
    categoryLabel: "Kitten Care",
    price: 7950,
    originalPrice: 8500,
    weightOrSize: "340 g",
    badge: "Life-Saving Formula",
    rating: 5.0,
    reviewCount: 165,
    inStock: true,
    image: "/images/products/petag-kmr-kitten-milk-powder.jpg",
    description: "Closest match to queen's maternal milk. Provides 40% protein and 28% fat with essential vitamins, minerals, and taurine for newborn and orphaned kittens.",
    clinicalNote: "Dr. Saif's Urgent Warning: NEVER feed cow's milk or buffalo milk to kittens; the lactose causes severe fatal dehydration diarrhea. Always use KMR.",
    keywords: ["kmr kitten milk", "kitten milk replacer", "cat milk powder", "kitten food"]
  },
  {
    id: "pet-nursing-feeder-bottle-kit",
    name: "Veterinary Pet Nursing Feeder Bottle Kit with Silicone Teats",
    category: "kitten-care",
    categoryLabel: "Kitten Care",
    price: 850,
    originalPrice: 1100,
    weightOrSize: "60 ml Bottle + 3 Teats",
    badge: "Essential for Neonates",
    rating: 4.9,
    reviewCount: 78,
    inStock: true,
    image: "/images/products/pet-nursing-feeder-bottle-kit.webp",
    description: "Graduated measurement bottle with soft food-grade silicone teats. Designed for safe, anti-aspiration feeding of newborn kittens, puppies, and small pets.",
    clinicalNote: "Dr. Saif's Technique: Keep the kitten on its belly (never on its back like a human baby) when bottle-feeding to prevent fluid from entering lungs.",
    keywords: ["feeder bottle", "kitten feeder", "cat milk powder"]
  },

  // CAT LITTER & HYGIENE
  {
    id: "klumpy-bentonite-cat-litter-5kg",
    name: "Klumpy Ultra Clumping Bentonite Cat Litter (Baby Powder Scent)",
    category: "litter",
    categoryLabel: "Cat Litter",
    price: 1350,
    originalPrice: 1600,
    weightOrSize: "5 kg",
    badge: "Top Seller in Lahore",
    rating: 4.9,
    reviewCount: 230,
    inStock: true,
    image: "/images/products/klumpy-bentonite-cat-litter-5kg.png",
    description: "100% natural sodium bentonite with instant rock-hard clumping in under 3 seconds. 99.5% dust-free to protect feline respiratory tracts.",
    clinicalNote: "Dr. Saif's Hygiene Protocol: Scoop clumps daily and sanitize the tray once every 14 days to prevent bacterial cystitis and toxoplasmosis.",
    keywords: ["klumpy cat litter", "clumpy cat litter", "bentonite cat litter", "cat litter price in pakistan"]
  },
  {
    id: "cat-litter-box-rim-scoop",
    name: "Deluxe High-Rim Anti-Spill Cat Litter Box with Sifting Scoop",
    category: "litter",
    categoryLabel: "Cat Litter",
    price: 2450,
    originalPrice: 2900,
    weightOrSize: "Large (48cm x 38cm x 20cm)",
    badge: "Anti-Scatter Shield",
    rating: 4.8,
    reviewCount: 88,
    inStock: true,
    image: "/images/products/cat-litter-box-rim-scoop.jpg",
    description: "Removable high-wall rim prevents litter scatter across your floor. Features a low front threshold allowing easy entry for kittens and senior arthritic cats.",
    clinicalNote: "Dr. Saif's Clinic Tip: Rule of thumb is (Number of Cats + 1) litter boxes in your residence for optimal urinary health.",
    keywords: ["cat litter box", "litter box for cats", "litter box", "kitten litter box"]
  },

  // PET BEDS, HOUSES & FURNITURE
  {
    id: "orthopedic-donut-cat-bed",
    name: "Orthopedic Calming Marshmallow Donut Pet Bed",
    category: "beds-housing",
    categoryLabel: "Beds & Housing",
    price: 2950,
    originalPrice: 3500,
    weightOrSize: "Medium 50cm (Up to 7kg cat)",
    badge: "Anxiety Relief",
    rating: 4.9,
    reviewCount: 195,
    inStock: true,
    image: "/images/products/orthopedic-donut-cat-bed.webp",
    description: "Ultra-plush shag faux fur with raised circular rim providing head, neck, and joint orthopedic support. Machine washable with non-skid bottom.",
    clinicalNote: "Dr. Saif's Recommendation: Excellent for nervous rescues or cold Lahore winters. The deep crevices recreate motherly security.",
    keywords: ["cat bed", "kitten bed", "pet house"]
  },
  {
    id: "wooden-indoor-cat-house-condo",
    name: "Cozy Indoor Cat House & Cave with Scratching Post",
    category: "beds-housing",
    categoryLabel: "Beds & Housing",
    price: 6850,
    originalPrice: 7800,
    weightOrSize: "2-in-1 Foldable Villa",
    badge: "Luxury Comfort",
    rating: 4.8,
    reviewCount: 64,
    inStock: true,
    image: "/images/products/wooden-indoor-cat-house-condo.jpg",
    description: "Semi-enclosed private sanctuary for cats who love security and high-vantage naps. Natural sisal rope post satisfies natural clawing instincts.",
    clinicalNote: "Dr. Saif's Behavior Advice: Scratching posts redirect aggressive clawing away from sofa fabrics and promote shoulder joint flexibility.",
    keywords: ["cat house", "cat home", "house of cat", "cat house price in pakistan"]
  },
  {
    id: "heavy-duty-cat-wire-cage",
    name: "Heavy-Duty Foldable 2-Door Pet Metal Wire Cage",
    category: "beds-housing",
    categoryLabel: "Beds & Housing",
    price: 4950,
    originalPrice: 5600,
    weightOrSize: "24 Inch (Small to Medium)",
    badge: "Surgical Recovery & Travel",
    rating: 4.7,
    reviewCount: 52,
    inStock: true,
    image: "/images/products/heavy-duty-cat-wire-cage.jpg",
    description: "Epoxy coated rust-resistant steel crate with slide-out leak-proof plastic pan. Dual latches ensure complete escape-proof confinement.",
    clinicalNote: "Dr. Saif's Surgical Note: Essential for post-operative recovery (such as spaying/neutering or fracture repair) to limit running and jumping.",
    keywords: ["cat cage price in pakistan", "cat carrier", "pet supplies"]
  },

  // HARNESSES, ACCESSORIES & SHOES
  {
    id: "anti-escape-cat-harness-leash",
    name: "Anti-Escape Breathable Air-Mesh Cat Harness & 1.5m Leash Set",
    category: "gear",
    categoryLabel: "Harnesses & Gear",
    price: 1650,
    originalPrice: 2000,
    weightOrSize: "Adjustable (Neck 20-30cm, Chest 28-44cm)",
    badge: "100% Escape Proof",
    rating: 4.9,
    reviewCount: 176,
    inStock: true,
    image: "/images/products/anti-escape-cat-harness-leash.png",
    description: "Vest-style harness that distributes pressure evenly across chest and shoulders, preventing choking. Equipped with high-visibility 3M reflective piping.",
    clinicalNote: "Dr. Saif's Safety Advice: Never attach a walking leash directly to a cat collar. Always use an anatomical chest harness to protect fragile trachea.",
    keywords: ["cat harness", "leash", "cat accessories"]
  },
  {
    id: "protective-soft-silicone-cat-shoes",
    name: "Veterinary Anti-Scratch Silicone Cat Shoes & Grooming Boots",
    category: "gear",
    categoryLabel: "Harnesses & Gear",
    price: 1250,
    originalPrice: 1500,
    weightOrSize: "Set of 4 Boots (Adjustable Velcro)",
    badge: "Grooming & Medical",
    rating: 4.8,
    reviewCount: 71,
    inStock: true,
    image: "/images/products/protective-soft-silicone-cat-shoes.png",
    description: "Soft medical-grade silicone booties with bottom drainage hole for bathing. Prevents scratching during ear cleaning, claw clipping, and medical dressing.",
    clinicalNote: "Dr. Saif's Clinical Note: Eliminates biting/scratching injuries during home medication administration and veterinary post-wound recovery.",
    keywords: ["cat shoes", "cat shoes pakistan", "cat accessories"]
  },

  // PET PHARMACY & WELLNESS
  {
    id: "feli-worm-cat-deworming-tablets",
    name: "Feli-Worm Broad-Spectrum Cat Deworming Tablets (Praziquantel + Pyrantel)",
    category: "pharmacy",
    categoryLabel: "Veterinary Pharmacy",
    price: 950,
    originalPrice: 1200,
    weightOrSize: "Strip of 4 Tablets",
    badge: "Veterinary Prescription Grade",
    rating: 5.0,
    reviewCount: 189,
    inStock: true,
    image: "/images/products/feli-worm-cat-deworming-tablets.jpg",
    description: "Single-dose eradication of Tapeworms, Roundworms, Hookworms, and Whipworms in cats and kittens over 6 weeks. Scored tablets for easy splitting.",
    clinicalNote: "Dr. Saif's Dosing Protocol: 1 tablet per 4kg body weight. Repeat deworming every 3 months for indoor cats and every 6-8 weeks for outdoor cats.",
    keywords: ["cat deworming tablet", "deworming tablets", "deworming medicine for cats in pakistan"]
  },
  {
    id: "frontline-plus-spray-100ml",
    name: "Frontline Plus Flea, Tick & Lice Treatment Spray (100ml)",
    category: "pharmacy",
    categoryLabel: "Veterinary Pharmacy",
    price: 3850,
    originalPrice: 4200,
    weightOrSize: "100 ml Spray Bottle",
    badge: "Original PVMC Certified",
    rating: 5.0,
    reviewCount: 147,
    inStock: true,
    image: "/images/products/frontline-plus-spray-100ml.png",
    description: "Fast-acting, long-lasting Fipronil spray that kills adult fleas within 24 hours and ticks within 48 hours. Safe for puppies and kittens from 2 days old.",
    clinicalNote: "Dr. Saif's Caution: Spray against the lay of hair until coat is damp. Wear gloves and do not allow pet to lick until thoroughly dry (approx 30 mins).",
    keywords: ["frontline spray", "frontline spray price in pakistan", "frontline spray for cats"]
  },
  {
    id: "organic-catnip-spray-herb",
    name: "100% Organic Catnip Mist Spray & Euphoric Herbal Blend",
    category: "pharmacy",
    categoryLabel: "Veterinary Pharmacy",
    price: 1150,
    originalPrice: 1400,
    weightOrSize: "60 ml Spray + 10g Herb",
    badge: "Pure Nepeta Cataria",
    rating: 4.9,
    reviewCount: 82,
    inStock: true,
    image: "/images/products/organic-catnip-spray-herb.jpg",
    description: "Extracted from natural Nepeta Cataria. Stimulates safe harmless euphoria, encourages exercise, and attracts cats to new scratchers and beds.",
    clinicalNote: "Dr. Saif's Tip: Great enrichment tool for indoor cats suffering from lethargy, boredom, or stress during home moving.",
    keywords: ["catnip", "catnip in pakistan", "cats treat"]
  },
  {
    id: "veterinary-pink-antiseptic-wound-spray",
    name: "Veterinary Pink Antiseptic & Wound Healing Spray for Animals",
    category: "pharmacy",
    categoryLabel: "Veterinary Pharmacy",
    price: 950,
    originalPrice: 1200,
    weightOrSize: "200 ml Aerosol Can",
    badge: "First Aid Kit Essential",
    rating: 4.8,
    reviewCount: 63,
    inStock: true,
    image: "/images/products/veterinary-pink-antiseptic-wound-spray.jpg",
    description: "Broad-spectrum topical antiseptic spray for lacerations, bite wounds, skin abrasions, and post-surgery suture disinfection with fly-repellent barrier.",
    clinicalNote: "Dr. Saif's Protocol: Cleanse wound with sterile saline first, then apply 2 quick bursts from 15cm distance twice daily until healed.",
    keywords: ["pink spray for animals", "pink spray", "anti fungal spray"]
  },
  {
    id: "medicated-antifungal-chlorhexidine-shampoo",
    name: "Derm-Care Medicated Ketoconazole & Chlorhexidine Pet Shampoo",
    category: "pharmacy",
    categoryLabel: "Veterinary Pharmacy",
    price: 1850,
    originalPrice: 2200,
    weightOrSize: "250 ml",
    badge: "Ringworm & Mange Treatment",
    rating: 4.9,
    reviewCount: 114,
    inStock: true,
    image: "/images/products/medicated-antifungal-chlorhexidine-shampoo.jpg",
    description: "Veterinary clinical shampoo treating dermatophyte ringworm (Microsporum canis), Malassezia dermatitis, bacterial pyoderma, and intense pruritus.",
    clinicalNote: "Dr. Saif's Therapeutic Rule: Work lather thoroughly down to skin and leave contact time for 8 to 10 minutes before rinsing with lukewarm water.",
    keywords: ["cat shampoo", "cat shampoo price in pakistan", "anti fungal spray", "ringworm cats"]
  },

  // DOG FOOD & CANINE SUPPLIES
  {
    id: "woof-dog-food-3kg",
    name: "Woof Premium Balanced Adult Dog Food (Real Beef & Rice)",
    category: "dog",
    categoryLabel: "Dog Supplies",
    price: 3450,
    originalPrice: 3900,
    weightOrSize: "3.0 kg",
    badge: "Canine Energy Formula",
    rating: 4.8,
    reviewCount: 56,
    inStock: true,
    image: "/images/products/woof-dog-food-3kg.png",
    description: "Complete nutrition formulated for energetic adult dogs. Fortified with Glucosamine and Chondroitin for strong hips and joints in large breeds.",
    clinicalNote: "Dr. Saif's Advice: Perfect dietary foundation for German Shepherds, Labradors, Huskies, and Rottweilers in Pakistan's climate.",
    keywords: ["woof dog food", "dog food price in pakistan", "dog food near me"]
  },
  {
    id: "no-pull-dog-harness-reflective",
    name: "Heavy-Duty No-Pull Reflective Dog Harness with Padded Handle",
    category: "dog",
    categoryLabel: "Dog Supplies",
    price: 2450,
    originalPrice: 2900,
    weightOrSize: "Size L (Chest 65-82cm)",
    badge: "Anti-Pulling Control",
    rating: 4.9,
    reviewCount: 48,
    inStock: true,
    image: "/images/products/no-pull-dog-harness-reflective.png",
    description: "Ergonomic front and back D-ring clips to curb aggressive pulling without choking trachea. Breathable mesh padding with reinforced top traffic handle.",
    clinicalNote: "Dr. Saif's Safety Recommendation: Eliminates cervical spine strain and tracheal collapse risk common with neck collars during heavy walks.",
    keywords: ["dog harness", "leash", "pet accessories"]
  }
];

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "cat-food", label: "Cat & Kitten Food" },
  { id: "kitten-care", label: "Kitten Milk & Care" },
  { id: "litter", label: "Cat Litter & Hygiene" },
  { id: "beds-housing", label: "Beds & Housing" },
  { id: "gear", label: "Harnesses & Accessories" },
  { id: "pharmacy", label: "Veterinary Pharmacy" },
  { id: "dog", label: "Dog Food & Gear" },
];

export default function ShopCatalog() {
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Security Alert State
  const [securityAlert, setSecurityAlert] = useState<string>("");
  
  // Professional Cart & Step-by-Step Checkout States
  const [cartItems, setCartItems] = useState<CartLineItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem("rvc_products_catalog");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProductsList(parsed);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load products from storage", e);
      }
    };

    loadFromStorage();

    const handleUpdate = () => {
      loadFromStorage();
    };

    // Load cart from localStorage
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("rvc_cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesCat = selectedCat === "all" || p.category === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.toLowerCase().includes(q)) ||
        p.categoryLabel.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return b.reviewCount - a.reviewCount; // Featured = popularity
    });
  }, [selectedCat, searchQuery, sortBy]);

  const handleSearchChange = (val: string) => {
    const check = detectSqlInjection(val);
    if (check.isMalicious) {
      setSecurityAlert("⚠️ Security Shield: SQL injection syntax detected & blocked.");
      setTimeout(() => setSecurityAlert(""), 4000);
      return;
    }
    setSearchQuery(sanitizeInput(val).slice(0, 100));
  };

  const handleWhatsAppOrder = (product: Product) => {
    // Bulk traffic rate limit defense
    const rateCheck = isRateLimited("wa_order_click", 5, 60000);
    if (!rateCheck.allowed) {
      setSecurityAlert(`Bulk traffic defense: Please wait ${rateCheck.retryAfterSeconds}s before clicking order again.`);
      setTimeout(() => setSecurityAlert(""), 4000);
      return;
    }

    const newOrder = saveOrder({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      weightOrSize: product.weightOrSize,
      price: product.price,
      channel: "WhatsApp Inquiry",
      status: "WhatsApp Contacted"
    });

    const text = encodeURIComponent(
      `Hello Dr. Saif / Rehman Vet Clinic,\n\nI want to order from your official shop:\n\n*Order ID:* ${newOrder.id}\n*Product:* ${product.name}\n*Pack/Size:* ${product.weightOrSize}\n*Price:* Rs. ${product.price.toLocaleString()}\n*Delivery City:* Lahore / Pakistan\n\nPlease confirm availability and doorstep dispatch.`
    );
    window.open(`https://wa.me/923114899904?text=${text}`, "_blank", "noopener,noreferrer");
  };

  // Cart Calculations & Handlers
  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  }, [cartItems]);

  const addToCart = (product: Product, openDrawer: boolean = true) => {
    setCartItems((prev) => {
      const existing = prev.find((it) => it.productId === product.id);
      let updated: CartLineItem[];
      if (existing) {
        updated = prev.map((it) =>
          it.productId === product.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      } else {
        updated = [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            weightOrSize: product.weightOrSize,
            price: product.price,
            quantity: 1,
          },
        ];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("rvc_cart", JSON.stringify(updated));
      }
      return updated;
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const quickBuyNow = (product: Product) => {
    addToCart(product, false);
    setIsCheckoutOpen(true);
  };

  const updateQuantity = (productId: string, newQty: number) => {
    setCartItems((prev) => {
      let updated: CartLineItem[];
      if (newQty <= 0) {
        updated = prev.filter((it) => it.productId !== productId);
      } else {
        updated = prev.map((it) =>
          it.productId === productId ? { ...it, quantity: newQty } : it
        );
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("rvc_cart", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    updateQuantity(productId, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("rvc_cart");
    }
  };

  return (
    <div className="w-full relative">
      {/* Security Alert Notification */}
      {securityAlert && (
        <div className="fixed top-20 right-5 z-50 bg-red-950/90 text-red-200 border border-red-700 px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <span>🛡️</span>
          <span>{securityAlert}</span>
        </div>
      )}

      {/* Category Pills & Search Filter */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search food, KMR milk, litter, harness, dewormers..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl text-sm font-medium transition outline-none text-slate-800"
            />
            <svg
              className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-5 h-5 grid place-items-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown & Counter */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs font-semibold text-slate-500">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="featured">Featured / Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 pb-1 no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedCat === c.id
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 my-10">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 grid place-items-center mx-auto text-2xl mb-3">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-800">No products matching your search</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Try searching for "cat food", "KMR", "deworming", "harness", or clear your filter to view all veterinarian-approved items.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCat("all");
            }}
            className="mt-4 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                      {p.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                    {p.weightOrSize}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {p.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <span>★</span>
                      <span className="text-slate-800">{p.rating}</span>
                      <span className="text-slate-400 text-[10px]">({p.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-800 transition">
                    {p.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Keywords Pills */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {p.keywords.slice(0, 2).map((k) => (
                      <span
                        key={k}
                        className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
                      >
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Clinic Price:</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-950">
                        Rs. {p.price.toLocaleString()}
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          Rs. {p.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-xl transition"
                  >
                    View Details
                  </button>
                </div>

                {/* Action Buttons: Add to Cart, Buy Now & WhatsApp */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => addToCart(p, true)}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition"
                      title="Add to clinic cart"
                    >
                      <span>🛒</span>
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => quickBuyNow(p)}
                      className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-black transition shadow-sm hover:scale-[1.02]"
                      title="Direct step-by-step checkout"
                    >
                      <span>⚡ Buy Now</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleWhatsAppOrder(p)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] text-[11px] font-extrabold transition"
                    title="Order and chat with Dr. Saif on WhatsApp"
                  >
                    <svg className="w-3.5 h-3.5 fill-[#128C7E]" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Order on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 grid place-items-center text-slate-600 font-bold transition"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl overflow-hidden aspect-square bg-slate-100">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {selectedProduct.categoryLabel}
                </span>

                <h2 className="text-xl font-black text-slate-900 mt-2 leading-tight">
                  {selectedProduct.name}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-amber-500 font-bold text-sm">★ {selectedProduct.rating}</span>
                  <span className="text-slate-400 text-xs">({selectedProduct.reviewCount} customer reviews)</span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-950">
                    Rs. {selectedProduct.price.toLocaleString()}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      Rs. {selectedProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {selectedProduct.weightOrSize}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Veterinary Clinical Guidance Box */}
                <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl">
                  <div className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                    <span>🩺 Veterinary Prescription Note:</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    {selectedProduct.clinicalNote}
                  </p>
                </div>

                {/* Modal Order Actions */}
                <div className="mt-5 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct, true);
                        setSelectedProduct(null);
                      }}
                      className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <span>🛒 Add to Cart</span>
                    </button>
                    <button
                      onClick={() => {
                        quickBuyNow(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-1.5"
                    >
                      <span>⚡ Buy Now</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleWhatsAppOrder(selectedProduct)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition shadow-md shadow-emerald-900/10"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Order via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sticky Cart Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-slide-in">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-2xl border border-slate-700 hover:scale-105 transition-all group"
          >
            <span className="text-base group-hover:scale-110 transition-transform">🛒</span>
            <span>Cart ({totalCartCount})</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
              Rs. {cartSubtotal.toLocaleString()}
            </span>
          </button>
        </div>
      )}

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Professional Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderCompleted={(order) => {
          setLastPlacedOrder(order);
        }}
        onClearCart={clearCart}
      />
    </div>
  );
}

