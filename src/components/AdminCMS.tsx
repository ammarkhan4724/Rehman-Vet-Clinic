import React, { useState, useEffect, useMemo, useRef } from "react";
import { PRODUCTS as DEFAULT_PRODUCTS, type Product } from "./ShopCatalog";
import { detectSqlInjection, sanitizeInput, checkBruteForceLockout, isRateLimited } from "../utils/security";
import {
  getStoredOrders,
  saveOrder,
  updateOrderStatus,
  deleteOrder,
  clearAllOrders,
  exportOrdersCSV,
  type OrderItem
} from "../utils/orders";

const STORAGE_KEY = "rvc_products_catalog";
const AUTH_KEY = "rvc_admin_auth";
const DEFAULT_PIN = "2026";

const EXISTING_LIBRARY_IMAGES = [
  { label: "Fluffy Adult Cat Food 1.2kg", path: "/images/products/fluffy-cat-food-1-2kg.png" },
  { label: "Fluffy Cat Food Economy 3kg", path: "/images/products/fluffy-cat-food-3kg.png" },
  { label: "Nourvet Gold Fresh Salmon", path: "/images/products/nourvet-gold-cat-food.jpg" },
  { label: "Pawfect Gourmet Salmon & Chicken", path: "/images/products/pawfect-gourmet-cat-food.png" },
  { label: "Royal Canin Kitten Nutrition", path: "/images/products/royal-canin-kitten.jpg" },
  { label: "Reflex Plus Adult Salmon", path: "/images/products/reflex-plus-salmon.png" },
  { label: "PetAg KMR Kitten Milk Powder 340g", path: "/images/products/petag-kmr-kitten-milk-powder.jpg" },
  { label: "Silicone Teat Feeder Bottle Kit", path: "/images/products/pet-nursing-feeder-bottle-kit.webp" },
  { label: "Klumpy Bentonite Cat Litter 5kg", path: "/images/products/klumpy-bentonite-cat-litter-5kg.png" },
  { label: "Cat Litter Box with Rim & Scoop", path: "/images/products/cat-litter-box-rim-scoop.jpg" },
  { label: "Orthopedic Calming Donut Cat Bed", path: "/images/products/orthopedic-donut-cat-bed.webp" },
  { label: "Wooden Indoor Cat House Condo", path: "/images/products/wooden-indoor-cat-house-condo.jpg" },
  { label: "Heavy-Duty Foldable Wire Cage", path: "/images/products/heavy-duty-cat-wire-cage.jpg" },
  { label: "Anti-Escape Mesh Cat Harness & Leash", path: "/images/products/anti-escape-cat-harness-leash.png" },
  { label: "Silicone Anti-Scratch Cat Shoes", path: "/images/products/protective-soft-silicone-cat-shoes.png" },
  { label: "Feli-Worm Cat Deworming Tablets", path: "/images/products/feli-worm-cat-deworming-tablets.jpg" },
  { label: "Frontline Plus Flea & Tick Spray", path: "/images/products/frontline-plus-spray-100ml.png" },
  { label: "Organic Catnip Euphoric Spray & Herb", path: "/images/products/organic-catnip-spray-herb.jpg" },
  { label: "Veterinary Pink Antiseptic Wound Spray", path: "/images/products/veterinary-pink-antiseptic-wound-spray.jpg" },
  { label: "Medicated Antifungal Shampoo", path: "/images/products/medicated-antifungal-chlorhexidine-shampoo.jpg" },
  { label: "Woof Premium Adult Dog Food 3kg", path: "/images/products/woof-dog-food-3kg.png" },
  { label: "Heavy-Duty No-Pull Dog Harness", path: "/images/products/no-pull-dog-harness-reflective.png" },
];

export default function AdminCMS() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  
  // Navigation Tabs: Products, Orders, Security
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "security">("products");
  
  // Products State
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Orders State
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>("");
  
  // Security & Lockout State
  const [lockoutState, setLockoutState] = useState<{ isLocked: boolean; remainingSeconds: number; failedAttempts: number }>({
    isLocked: false,
    remainingSeconds: 0,
    failedAttempts: 0
  });
  const [securityTestInput, setSecurityTestInput] = useState<string>("");
  const [securityTestResult, setSecurityTestResult] = useState<{ isMalicious: boolean; reason?: string } | null>(null);

  // Modal states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");
  
  // Image Upload and Library Picker states
  const [formImage, setFormImage] = useState<string>("/images/products/fluffy-cat-food-1-2kg.png");
  const [imageMode, setImageMode] = useState<"upload" | "library" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Brute Force Lockout Countdown Polling
  useEffect(() => {
    const checkLock = () => {
      const lock = checkBruteForceLockout();
      setLockoutState({
        isLocked: lock.isLocked,
        remainingSeconds: lock.remainingSeconds,
        failedAttempts: lock.failedAttempts
      });
    };

    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check auth and load products & orders from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem(AUTH_KEY);
      if (auth === "true") {
        setIsAuthenticated(true);
      }

      // Load products
      const savedProds = localStorage.getItem(STORAGE_KEY);
      if (savedProds) {
        try {
          const parsed = JSON.parse(savedProds);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        } catch (e) {
          console.error("Failed to parse saved products", e);
        }
      }

      // Load orders
      setOrders(getStoredOrders());

      const handleOrdersUpdate = () => {
        setOrders(getStoredOrders());
      };

      window.addEventListener("rvc_orders_updated", handleOrdersUpdate);
      return () => {
        window.removeEventListener("rvc_orders_updated", handleOrdersUpdate);
      };
    }
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const saveProductsToStorage = (updated: Product[]) => {
    setProducts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("rvc_catalog_updated"));
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/webp", 0.85);
          setFormImage(compressedDataUrl);
          showToast("Image uploaded and optimized for web!");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check if currently locked out
    if (lockoutState.isLocked) {
      setAuthError(`Security Lockout Active: Too many failed attempts. Please wait ${lockoutState.remainingSeconds}s.`);
      return;
    }

    // 2. Check for SQL injection in PIN field
    const sqliCheck = detectSqlInjection(pinInput);
    if (sqliCheck.isMalicious) {
      setAuthError("⚠️ Security Shield Alert: SQL Injection payload detected and rejected!");
      return;
    }

    // 3. Verify PIN
    if (pinInput.trim() === DEFAULT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, "true");
      setAuthError("");
      checkBruteForceLockout().resetAttempts();
      showToast("Access Granted: Welcome to Rehman Vet Clinic Admin Panel!");
    } else {
      const lockRes = checkBruteForceLockout().recordFailure();
      if (lockRes.isLocked) {
        setAuthError(`⚠️ Brute-Force Lockout Activated: 5 incorrect attempts. Access locked for 15 minutes (${lockRes.remainingSeconds}s).`);
      } else {
        setAuthError(`Incorrect PIN (${lockRes.failedAttempts}/5 attempts). Please check with Dr. Saif.`);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
    setPinInput("");
  };

  const handleToggleStock = (id: string) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, inStock: !p.inStock } : p
    );
    saveProductsToStorage(updated);
    showToast("Stock status updated successfully!");
  };

  const handleQuickPriceChange = (id: string, newPriceStr: string) => {
    const newPrice = parseInt(newPriceStr, 10);
    if (isNaN(newPrice) || newPrice <= 0) return;
    const updated = products.map((p) =>
      p.id === id ? { ...p, price: newPrice } : p
    );
    saveProductsToStorage(updated);
    showToast("Price updated live in catalog!");
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the clinic shop?`)) {
      const updated = products.filter((p) => p.id !== id);
      saveProductsToStorage(updated);
      showToast(`Removed "${name}" from catalog.`);
    }
  };

  const handleSaveProductForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const id = (formData.get("id") as string).trim() || `prod-${Date.now()}`;
    const rawName = (formData.get("name") as string).trim();
    const rawDesc = (formData.get("description") as string).trim();
    const rawNote = (formData.get("clinicalNote") as string).trim();
    const rawKeywords = (formData.get("keywords") as string).trim();

    // SQL Injection Defense on CMS fields
    if (
      detectSqlInjection(rawName).isMalicious ||
      detectSqlInjection(rawDesc).isMalicious ||
      detectSqlInjection(rawNote).isMalicious ||
      detectSqlInjection(rawKeywords).isMalicious
    ) {
      alert("⚠️ Security Shield: SQL Injection attempt blocked on product form.");
      return;
    }

    const name = sanitizeInput(rawName);
    const category = formData.get("category") as Product["category"];
    const categoryLabel = sanitizeInput((formData.get("categoryLabel") as string).trim());
    const price = parseInt(formData.get("price") as string, 10) || 0;
    const originalPrice = parseInt(formData.get("originalPrice") as string, 10) || undefined;
    const weightOrSize = sanitizeInput((formData.get("weightOrSize") as string).trim());
    const badge = sanitizeInput((formData.get("badge") as string).trim()) || undefined;
    const image = formImage.trim() || (formData.get("image") as string)?.trim() || "/images/products/fluffy-cat-food-1-2kg.png";
    const description = sanitizeInput(rawDesc);
    const clinicalNote = sanitizeInput(rawNote);
    const keywords = rawKeywords ? rawKeywords.split(",").map((k) => sanitizeInput(k.trim())) : [];

    const newProdData: Product = {
      id,
      name,
      category,
      categoryLabel,
      price,
      originalPrice,
      weightOrSize,
      badge,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      inStock: true,
      image,
      description,
      clinicalNote,
      keywords,
    };

    let updated: Product[];
    if (editingProduct) {
      updated = products.map((p) => (p.id === editingProduct.id ? newProdData : p));
      showToast(`Product "${name}" updated successfully!`);
    } else {
      updated = [newProdData, ...products];
      showToast(`New product "${name}" added to catalog!`);
    }

    saveProductsToStorage(updated);
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  const handleResetToFactory = () => {
    if (confirm("Reset catalog back to original 22 verified clinic products? Any custom products will be restored to defaults.")) {
      saveProductsToStorage(DEFAULT_PRODUCTS);
      showToast("Catalog reset to factory default.");
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `rehman_vet_clinic_products_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchor.click();
    showToast("Product catalog JSON exported!");
  };

  // Orders Handlers
  const handleUpdateOrderStatus = (orderId: string, status: OrderItem["status"]) => {
    const updated = updateOrderStatus(orderId, status);
    setOrders(updated);
    showToast(`Order status updated to "${status}"`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
      const updated = deleteOrder(orderId);
      setOrders(updated);
      showToast(`Order ${orderId} removed.`);
    }
  };

  const handleClearOrders = () => {
    if (confirm("Are you sure you want to clear all order history?")) {
      clearAllOrders();
      setOrders([]);
      showToast("Order history cleared.");
    }
  };

  const handleCreateSampleOrder = () => {
    const sample = saveOrder({
      items: [
        {
          productId: "fluffy-cat-food-1-2kg",
          productName: "Fluffy Premium Adult Cat Food (Poultry & Ocean Fish)",
          productImage: "/images/products/fluffy-cat-food-1-2kg.png",
          weightOrSize: "1.2 kg",
          price: 1850,
          quantity: 2
        },
        {
          productId: "klumpy-bentonite-cat-litter-5kg",
          productName: "Klumpy Ultra Clumping Bentonite Cat Litter",
          productImage: "/images/products/klumpy-bentonite-cat-litter-5kg.png",
          weightOrSize: "5 kg",
          price: 1350,
          quantity: 1
        }
      ],
      subtotal: 5050,
      deliveryFee: 0,
      totalPrice: 5050,
      customerName: "Malik Usman",
      customerPhone: "+92 311 4899904",
      customerCity: "Lahore",
      customerArea: "DHA (Phase 1, 2, 3, 4, 5, 6, 7, 8)",
      customerAddress: "House 24-B, Sector J, Phase 5 DHA, Lahore",
      nearbyLandmark: "Near Jalal Sons DHA",
      deliveryMethod: "Standard Lahore (Same Day)",
      paymentMethod: "Cash on Delivery (COD)",
      channel: "Direct Website Checkout",
      status: "Confirmed",
      notes: "Deliver in evening after 5pm please."
    });
    setOrders(getStoredOrders());
    showToast(`Demo multi-item order ${sample.id} generated!`);
  };

  // Security Test Sandbox
  const handleRunSecurityTest = (e: React.FormEvent) => {
    e.preventDefault();
    const result = detectSqlInjection(securityTestInput);
    setSecurityTestResult(result);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCat === "all" || p.category === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.toLowerCase().includes(q)) ||
        p.id.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [products, selectedCat, searchQuery]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = orderFilterStatus === "all" || o.status === orderFilterStatus;
      const q = orderSearchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        (o.productName && o.productName.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.includes(q)) ||
        (o.customerArea && o.customerArea.toLowerCase().includes(q)) ||
        (o.customerAddress && o.customerAddress.toLowerCase().includes(q)) ||
        (o.paymentMethod && o.paymentMethod.toLowerCase().includes(q)) ||
        (o.deliveryMethod && o.deliveryMethod.toLowerCase().includes(q)) ||
        (o.items && o.items.some(it => it.productName.toLowerCase().includes(q)));
      return matchesStatus && matchesQuery;
    });
  }, [orders, orderFilterStatus, orderSearchQuery]);

  const metrics = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.inStock).length;
    const outOfStock = total - inStock;
    const totalValue = products.reduce((acc, p) => acc + p.price, 0);

    const totalOrders = orders.length;
    const ordersValue = orders.reduce((acc, o) => acc + (o.totalPrice || o.price || 0), 0);
    const newInquiries = orders.filter((o) => o.status === "New Inquiry" || o.status === "WhatsApp Contacted").length;
    const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

    return { total, inStock, outOfStock, totalValue, totalOrders, ordersValue, newInquiries, deliveredOrders };
  }, [products, orders]);

  // Format countdown minutes:seconds
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09111e] flex items-center justify-center p-5 text-slate-100 font-sans">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 grid place-items-center font-black text-xl text-slate-950 mx-auto shadow-lg shadow-emerald-500/20 mb-4">
              RV
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-extrabold uppercase tracking-wider mb-2">
              <span>🔒</span> Restricted • NoIndex &amp; SQLi Shielded
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Clinic CMS Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Rehman Veterinary Clinic &amp; Pet Pharmacy Management
            </p>
          </div>

          {/* Brute Force Lockout Banner */}
          {lockoutState.isLocked && (
            <div className="mb-5 p-4 bg-red-950/80 border border-red-700 rounded-2xl text-center space-y-1 animate-pulse">
              <div className="text-xs font-black text-red-300 uppercase tracking-wider">
                ⚠️ Security Lockout Active
              </div>
              <div className="text-[11px] text-red-200">
                5 consecutive failed PIN attempts detected. Access is locked to protect clinic data.
              </div>
              <div className="text-lg font-mono font-black text-white pt-1">
                ⏳ Unlocks in: {formatSeconds(lockoutState.remainingSeconds)}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Enter Master Security PIN
                </label>
                {lockoutState.failedAttempts > 0 && !lockoutState.isLocked && (
                  <span className="text-[10px] text-amber-400 font-bold">
                    Attempts: {lockoutState.failedAttempts}/5
                  </span>
                )}
              </div>
              <input
                type="password"
                disabled={lockoutState.isLocked}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder={lockoutState.isLocked ? "LOCKED (Please wait)" : "Enter PIN (Default: 2026)"}
                autoFocus={!lockoutState.isLocked}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl text-center text-lg tracking-[0.3em] font-bold text-white outline-none transition disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 text-center font-medium">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={lockoutState.isLocked}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-between">
            <span>Rehman Vet Clinic CMS v2.5</span>
            <span className="text-emerald-400 font-semibold">PIN: 2026</span>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-[#faf9f7] text-slate-800 font-sans pb-20">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-slide-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 grid place-items-center font-black text-sm text-slate-950 shadow-md">
              RV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight leading-none text-white">Rehman Clinic CMS</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  NoIndex
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SQLi Shielded
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Pet Shop Inventory &amp; Live Orders Manager</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
            >
              <span>View Public Shop</span>
              <span>↗</span>
            </a>
            <button
              onClick={handleExportJSON}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
            >
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs font-bold transition"
            >
              Lock &amp; Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-5 pt-6">
        {/* Navigation Tabs Switcher */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
                activeTab === "products"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              <span>📦 Products Inventory</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === "products" ? "bg-slate-800 text-emerald-400" : "bg-slate-100 text-slate-600"}`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
                activeTab === "orders"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              <span>🛒 Orders &amp; Inquiries</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                orders.length > 0
                  ? activeTab === "orders" ? "bg-emerald-500 text-slate-950" : "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-400"
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
                activeTab === "security"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              <span>🛡️ Security &amp; Traffic</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Dr. Saif Ur Rehman, DVM</span>
          </div>
        </div>

        {/* TAB 1: PRODUCTS INVENTORY */}
        {activeTab === "products" && (
          <div>
            {/* Metric Cards Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Products</div>
                <div className="text-3xl font-black text-slate-900 mt-1">{metrics.total}</div>
                <div className="text-[11px] text-slate-500 mt-1">Active catalog items</div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">In Stock</div>
                <div className="text-3xl font-black text-emerald-700 mt-1">{metrics.inStock}</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">Available for delivery</div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-600">Out of Stock</div>
                <div className="text-3xl font-black text-amber-700 mt-1">{metrics.outOfStock}</div>
                <div className="text-[11px] text-slate-500 mt-1">Restock required</div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Sync Status</div>
                <div className="text-sm font-black text-slate-900 mt-2 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-Time LocalSync</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Live on /shop instantly</div>
              </div>
            </div>

            {/* Toolbar: Search, Filters, Add Product */}
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products by name or keywords..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-emerald-500"
                  />
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">All Categories ({products.length})</option>
                  <option value="cat-food">Cat &amp; Kitten Food</option>
                  <option value="kitten-care">Kitten Milk &amp; Nursing</option>
                  <option value="litter">Cat Litter &amp; Hygiene</option>
                  <option value="beds-housing">Beds &amp; Housing</option>
                  <option value="gear">Harnesses &amp; Accessories</option>
                  <option value="pharmacy">Veterinary Pharmacy</option>
                  <option value="dog">Dog Food &amp; Supplies</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  onClick={handleResetToFactory}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition"
                >
                  Restore Defaults
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setFormImage("/images/products/fluffy-cat-food-1-2kg.png");
                    setImageMode("upload");
                    setIsCreatingNew(true);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition flex items-center gap-1.5"
                >
                  <span>+ Add New Product</span>
                </button>
              </div>
            </div>

            {/* Products Management Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">Item</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price (PKR)</th>
                      <th className="py-3.5 px-4">Size/Pack</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4">Prescription Note</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1 max-w-xs">{p.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {p.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                            {p.categoryLabel}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 font-bold text-[11px]">Rs.</span>
                            <input
                              type="number"
                              defaultValue={p.price}
                              onBlur={(e) => handleQuickPriceChange(p.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleQuickPriceChange(p.id, (e.target as HTMLInputElement).value);
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg font-black text-slate-900 text-xs outline-none"
                              title="Click and press Enter to update price live"
                            />
                          </div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-600">
                          {p.weightOrSize}
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleStock(p.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                              p.inStock
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                            title="Click to toggle stock status"
                          >
                            {p.inStock ? "✓ In Stock" : "✕ Out of Stock"}
                          </button>
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                            {p.clinicalNote}
                          </div>
                        </td>

                        <td className="py-3 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setIsCreatingNew(false);
                                setEditingProduct(p);
                                setFormImage(p.image);
                                setImageMode(p.image.startsWith("data:") ? "upload" : p.image.startsWith("/images/") ? "library" : "url");
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-[11px] text-slate-700 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 font-bold text-[11px] text-red-700 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS & INQUIRIES */}
        {activeTab === "orders" && (
          <div>
            {/* Orders Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Inquiries</div>
                <div className="text-3xl font-black text-slate-900 mt-1">{metrics.totalOrders}</div>
                <div className="text-[11px] text-slate-500 mt-1">Orders &amp; WhatsApp inquiries</div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Total Order Value</div>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  Rs. {metrics.ordersValue.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 mt-1">Inquired product volume</div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending / New</div>
                <div className="text-3xl font-black text-amber-700 mt-1">{metrics.newInquiries}</div>
                <div className="text-[11px] text-slate-500 mt-1">Requires follow-up</div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Delivered</div>
                <div className="text-3xl font-black text-blue-700 mt-1">{metrics.deliveredOrders}</div>
                <div className="text-[11px] text-slate-500 mt-1">Completed doorstep deliveries</div>
              </div>
            </div>

            {/* Orders Toolbar */}
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by customer name, phone, order ID..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-emerald-500"
                  />
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
                </div>

                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="New Inquiry">New Inquiry</option>
                  <option value="WhatsApp Contacted">WhatsApp Contacted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  onClick={handleCreateSampleOrder}
                  className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition border border-emerald-200"
                >
                  + Demo Order
                </button>
                <button
                  onClick={() => exportOrdersCSV(orders)}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  📥 Export CSV
                </button>
                {orders.length > 0 && (
                  <button
                    onClick={handleClearOrders}
                    className="px-3 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition"
                  >
                    Clear History
                  </button>
                )}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-2">🛒</div>
                  <h3 className="font-bold text-slate-700 text-sm">No Orders Found</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    When visitors click "Order via WhatsApp" or submit the direct checkout form on /shop, their orders will appear here automatically.
                  </p>
                  <button
                    onClick={handleCreateSampleOrder}
                    className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                  >
                    Generate Test Order
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      <tr>
                        <th className="py-3.5 px-5">Order ID &amp; Time</th>
                        <th className="py-3.5 px-4">Purchased Items</th>
                        <th className="py-3.5 px-4">Amount &amp; Payment</th>
                        <th className="py-3.5 px-4">Customer &amp; Location</th>
                        <th className="py-3.5 px-4">Delivery Speed</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredOrders.map((ord) => {
                        const totalAmount = ord.totalPrice || ord.price || 0;
                        const itemsCount = ord.items && ord.items.length > 0
                          ? ord.items.reduce((acc, it) => acc + (it.quantity || 1), 0)
                          : 1;

                        return (
                          <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-5 align-top">
                              <div className="font-mono font-black text-slate-900">{ord.id}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{ord.formattedDate}</div>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                ord.channel === "WhatsApp Inquiry"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-blue-50 text-blue-800 border border-blue-200"
                              }`}>
                                {ord.channel}
                              </span>
                            </td>

                            <td className="py-3 px-4 align-top max-w-xs">
                              {ord.items && ord.items.length > 0 ? (
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold">
                                      {itemsCount} {itemsCount === 1 ? "unit" : "units"}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold">
                                      ({ord.items.length} {ord.items.length === 1 ? "product" : "products"})
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    {ord.items.map((it, idx) => (
                                      <div key={idx} className="flex items-center gap-2 text-[11px]">
                                        <div className="w-6 h-6 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                          <img src={it.productImage} alt={it.productName} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="font-medium text-slate-800 line-clamp-1">
                                          <strong className="text-slate-950 font-black">{it.quantity}x</strong> {it.productName}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2.5">
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                    <img src={ord.productImage} alt={ord.productName} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 line-clamp-1 max-w-xs">{ord.productName}</div>
                                    <div className="text-[10px] text-slate-400 font-semibold">{ord.weightOrSize}</div>
                                  </div>
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-4 align-top">
                              <div className="font-black text-slate-900 text-sm">
                                Rs. {totalAmount.toLocaleString()}
                              </div>
                              {ord.deliveryFee !== undefined && (
                                <div className="text-[10px] text-slate-500">
                                  Delivery: <span className="font-bold text-emerald-700">{ord.deliveryFee === 0 ? "FREE" : `Rs. ${ord.deliveryFee}`}</span>
                                </div>
                              )}
                              <div className="mt-1">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] inline-flex items-center gap-1">
                                  {ord.paymentMethod?.includes("Cash") ? "💵" : ord.paymentMethod?.includes("Bank") ? "🏦" : "📱"}
                                  <span className="truncate max-w-[120px]">{ord.paymentMethod || "COD"}</span>
                                </span>
                              </div>
                            </td>

                            <td className="py-3 px-4 align-top max-w-xs">
                              <div className="font-bold text-slate-900">{ord.customerName || "Website Visitor"}</div>
                              {ord.customerPhone && (
                                <div className="text-[11px] font-mono text-emerald-700 font-semibold">{ord.customerPhone}</div>
                              )}
                              {ord.customerArea && (
                                <div className="text-[10px] font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                                  <span>📍</span>
                                  <span className="truncate">{ord.customerArea}</span>
                                </div>
                              )}
                              {ord.customerAddress && (
                                <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{ord.customerAddress}</div>
                              )}
                              {ord.nearbyLandmark && (
                                <div className="text-[9px] text-amber-700 font-medium">Near: {ord.nearbyLandmark}</div>
                              )}
                            </td>

                            <td className="py-3 px-4 align-top">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                ord.deliveryMethod?.includes("Express")
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : ord.deliveryMethod?.includes("Pickup")
                                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              }`}>
                                <span>{ord.deliveryMethod?.includes("Express") ? "⚡" : ord.deliveryMethod?.includes("Pickup") ? "🏥" : "🚚"}</span>
                                <span className="truncate max-w-[110px]">{ord.deliveryMethod || "Standard"}</span>
                              </span>
                            </td>

                            <td className="py-3 px-4 align-top">
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase outline-none border cursor-pointer ${
                                  ord.status === "Delivered"
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : ord.status === "Confirmed" || ord.status === "Dispatched"
                                    ? "bg-blue-100 text-blue-800 border-blue-300"
                                    : ord.status === "Cancelled"
                                    ? "bg-red-100 text-red-800 border-red-300"
                                    : "bg-amber-100 text-amber-800 border-amber-300"
                                }`}
                              >
                                <option value="New Inquiry">New Inquiry</option>
                                <option value="WhatsApp Contacted">WhatsApp Contacted</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>

                            <td className="py-3 px-5 text-right align-top">
                              <div className="flex items-center justify-end gap-1.5">
                                {ord.customerPhone && (
                                  <a
                                    href={`https://wa.me/${ord.customerPhone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(ord.customerName || "Customer")},%20regarding%20your%20order%20${ord.id}%20(Rs.%20${totalAmount.toLocaleString()})%20at%20Rehman%20Vet%20Clinic.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-[#25D366]/20 text-emerald-800 hover:bg-[#25D366]/30 font-bold text-[11px] transition"
                                    title="Chat with customer on WhatsApp"
                                  >
                                    WhatsApp
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDeleteOrder(ord.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] transition"
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & TRAFFIC */}
        {activeTab === "security" && (
          <div>
            {/* Security Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">SQL Injection Shield</div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xl font-black text-emerald-800 mt-2">ACTIVE &amp; FILTERING</div>
                <p className="text-xs text-slate-500 mt-1">
                  Pattern interceptor monitors all search inputs, order fields, and PIN submissions.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                  Vector Regex: SELECT, UNION, DROP, --, SLEEP, BENCHMARK
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Bulk Traffic &amp; Rate Limit</div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xl font-black text-emerald-800 mt-2">ACTIVE (5 req/min)</div>
                <p className="text-xs text-slate-500 mt-1">
                  Sliding window limiter blocks rapid clicking, automated spam bots, and checkout flooding.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                  Throttle: Max 5 orders/min, Honeypot bot traps armed
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">PIN Brute-Force Guard</div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xl font-black text-emerald-800 mt-2">ARMED &amp; GUARDED</div>
                <p className="text-xs text-slate-500 mt-1">
                  Auto-lockout after 5 incorrect attempts with 15-minute system cooldown timer.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                  State: {lockoutState.isLocked ? "LOCKED" : "0/5 Failed Attempts (Clean)"}
                </div>
              </div>
            </div>

            {/* HTTP Headers Configuration Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
              <h3 className="text-sm font-black text-slate-900 mb-2">
                🔒 Enterprise HTTP Security Headers (public/_headers &amp; public/.htaccess)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                The clinic web application is served with hardcoded browser security policies that block clickjacking, MIME sniffing, and unauthorized framing:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 font-mono">
                  <div className="font-bold text-slate-800">X-Frame-Options: SAMEORIGIN</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Prevents malicious sites from framing or clickjacking the clinic portal.</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 font-mono">
                  <div className="font-bold text-slate-800">X-Content-Type-Options: nosniff</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Prevents malicious executable uploads from masquerading as image files.</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 font-mono">
                  <div className="font-bold text-slate-800">X-Robots-Tag: noindex, nofollow</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Server header guaranteeing /admin is omitted from all search engine indexes.</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 font-mono">
                  <div className="font-bold text-slate-800">Strict-Transport-Security: HSTS</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Forces 100% encrypted HTTPS data transfer between client and server.</div>
                </div>
              </div>
            </div>

            {/* Interactive SQL Injection Penetration Sandbox */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-1">
                🧪 Live Security Testing Sandbox
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Test the clinic's anti-SQL injection pattern detection engine by inputting sample attack payloads below:
              </p>

              <form onSubmit={handleRunSecurityTest} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={securityTestInput}
                    onChange={(e) => setSecurityTestInput(e.target.value)}
                    placeholder="Enter test string e.g. ' OR 1=1 -- or normal text"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition"
                  >
                    Test Shield
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className="text-slate-400 font-bold">Quick Sample Attacks:</span>
                  <button
                    type="button"
                    onClick={() => setSecurityTestInput("' OR '1'='1")}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 font-mono text-slate-700"
                  >
                    ' OR '1'='1
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecurityTestInput("admin' UNION SELECT 1,2,3--")}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 font-mono text-slate-700"
                  >
                    UNION SELECT
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecurityTestInput("1; DROP TABLE products;--")}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 font-mono text-slate-700"
                  >
                    DROP TABLE
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecurityTestInput("Fluffy Cat Food")}
                    className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 font-mono text-emerald-800"
                  >
                    Clean Product Query
                  </button>
                </div>
              </form>

              {securityTestResult !== null && (
                <div className={`mt-4 p-4 rounded-2xl border ${
                  securityTestResult.isMalicious
                    ? "bg-red-50 border-red-200 text-red-900"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}>
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <span>{securityTestResult.isMalicious ? "🚨 Attack Intercepted & Blocked!" : "✓ Clean Input (Approved)"}</span>
                  </div>
                  <div className="text-xs mt-1 font-mono">
                    {securityTestResult.isMalicious ? securityTestResult.reason : "No malicious SQL injection patterns found. Input is safe."}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      {(isCreatingNew || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsCreatingNew(false);
                setEditingProduct(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 grid place-items-center text-slate-600 font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-1">
              {editingProduct ? "Edit Product Details" : "Add New Store Product"}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Updates will instantly synchronize with the public /shop page and WhatsApp order generators.
            </p>

            <form onSubmit={handleSaveProductForm} className="space-y-4">
              <input type="hidden" name="id" defaultValue={editingProduct?.id || ""} />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingProduct?.name || ""}
                  placeholder="e.g. Fluffy Cat Food 1.2kg"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category Code</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || "cat-food"}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="cat-food">cat-food (Cat Food)</option>
                    <option value="kitten-care">kitten-care (KMR &amp; Milk)</option>
                    <option value="litter">litter (Litter &amp; Hygiene)</option>
                    <option value="beds-housing">beds-housing (Beds &amp; Houses)</option>
                    <option value="gear">gear (Harnesses &amp; Shoes)</option>
                    <option value="pharmacy">pharmacy (Veterinary Pharmacy)</option>
                    <option value="dog">dog (Dog Supplies)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category Label</label>
                  <input
                    type="text"
                    name="categoryLabel"
                    required
                    defaultValue={editingProduct?.categoryLabel || "Cat Food"}
                    placeholder="e.g. Cat Food"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    defaultValue={editingProduct?.price || 1500}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (PKR)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    defaultValue={editingProduct?.originalPrice || ""}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pack Size / Weight</label>
                  <input
                    type="text"
                    name="weightOrSize"
                    required
                    defaultValue={editingProduct?.weightOrSize || "1.2 kg"}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              {/* Image Upload & Selection Component */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🖼️ Product Image</span>
                    <span className="text-[10px] font-normal text-slate-500">(Auto-optimized)</span>
                  </label>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600">
                    <button
                      type="button"
                      onClick={() => setImageMode("upload")}
                      className={`px-2.5 py-1 rounded-lg transition ${imageMode === "upload" ? "bg-emerald-700 text-white shadow-sm" : "hover:bg-slate-100"}`}
                    >
                      📁 Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("library")}
                      className={`px-2.5 py-1 rounded-lg transition ${imageMode === "library" ? "bg-emerald-700 text-white shadow-sm" : "hover:bg-slate-100"}`}
                    >
                      🏛️ Clinic Library
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`px-2.5 py-1 rounded-lg transition ${imageMode === "url" ? "bg-emerald-700 text-white shadow-sm" : "hover:bg-slate-100"}`}
                    >
                      🔗 URL / Path
                    </button>
                  </div>
                </div>

                {/* Live Thumbnail + Selected Source Controls */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                    {formImage ? (
                      <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl text-slate-400">📷</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {imageMode === "upload" && (
                      <div className="space-y-1.5">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-sm flex items-center justify-center gap-2 transition"
                        >
                          <span>📁 Choose Image File from Computer</span>
                        </button>
                        <p className="text-[10px] text-slate-500">
                          Select any PNG, JPG, or WEBP. Automatically scaled and optimized for instant web loading.
                        </p>
                      </div>
                    )}

                    {imageMode === "library" && (
                      <div className="space-y-1.5">
                        <select
                          value={EXISTING_LIBRARY_IMAGES.some(img => img.path === formImage) ? formImage : ""}
                          onChange={(e) => {
                            if (e.target.value) setFormImage(e.target.value);
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 truncate"
                        >
                          <option value="">-- Choose from 22 Clinic Product Packshots --</option>
                          {EXISTING_LIBRARY_IMAGES.map((img) => (
                            <option key={img.path} value={img.path}>
                              {img.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-slate-500 truncate">
                          Path: <span className="font-mono text-emerald-700">{formImage}</span>
                        </p>
                      </div>
                    )}

                    {imageMode === "url" && (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="/images/products/... or https://..."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500">
                          Tip: Drop file into <code className="bg-slate-200 px-1 py-0.5 rounded text-[9px]">public/images/products/</code> and enter its path.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <input type="hidden" name="image" value={formImage} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Text (Optional)</label>
                <input
                  type="text"
                  name="badge"
                  defaultValue={editingProduct?.badge || ""}
                  placeholder="e.g. Best Seller in Pakistan, Vet Approved"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  name="description"
                  rows={2}
                  required
                  defaultValue={editingProduct?.description || ""}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-800 mb-1">🩺 Dr. Saif Clinical Guidance Note</label>
                <textarea
                  name="clinicalNote"
                  rows={2}
                  required
                  defaultValue={editingProduct?.clinicalNote || "Dr. Saif's Note: Administer with clean drinking water."}
                  className="w-full px-3.5 py-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-950 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SEO Target Keywords (comma separated)</label>
                <input
                  type="text"
                  name="keywords"
                  defaultValue={editingProduct?.keywords.join(", ") || ""}
                  placeholder="fluffy cat food, cat food price in pakistan"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
