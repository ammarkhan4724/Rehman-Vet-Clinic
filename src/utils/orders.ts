/**
 * Rehman Veterinary Clinic — Customer Orders & Inquiries Manager
 * Multi-Item Cart & Professional Step-by-Step E-Commerce Engine
 */

export interface CartLineItem {
  productId: string;
  productName: string;
  productImage: string;
  weightOrSize: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: string; // e.g. RVC-202609-8492
  timestamp: number;
  formattedDate: string;
  items: CartLineItem[];
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  
  // Customer & Location Details
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  customerArea: string;
  customerAddress: string;
  nearbyLandmark?: string;
  
  // Shipping & Payment Options
  deliveryMethod: "Standard Lahore (Same Day)" | "Express Rush (60-90 Mins)" | "Clinic Pickup (Free)" | string;
  paymentMethod: "Cash on Delivery (COD)" | "EasyPaisa / JazzCash" | "Bank Transfer (Meezan/HBL)" | string;
  channel: "Direct Website Checkout" | "WhatsApp Inquiry";
  status: "New Inquiry" | "Confirmed" | "Processing" | "Dispatched" | "Delivered" | "Cancelled";
  notes?: string;

  // Legacy fields for backward compatibility
  productId?: string;
  productName?: string;
  productImage?: string;
  weightOrSize?: string;
  price?: number;
}

const ORDERS_STORAGE_KEY = "rvc_orders_log";

export function getStoredOrders(): OrderItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse orders from localStorage", e);
  }
  return [];
}

export function saveOrder(orderData: Partial<OrderItem> & {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  items?: CartLineItem[];
  price?: number;
}): OrderItem {
  const now = new Date();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `RVC-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}-${randomSuffix}`;
  
  const formattedDate = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  // Calculate items and totals if passed as single product or multiple
  let items: CartLineItem[] = orderData.items || [];
  if (items.length === 0 && orderData.productId && orderData.productName) {
    items = [{
      productId: orderData.productId,
      productName: orderData.productName,
      productImage: orderData.productImage || "/images/products/fluffy-cat-food-1-2kg.png",
      weightOrSize: orderData.weightOrSize || "1 Pack",
      price: orderData.price || 0,
      quantity: 1
    }];
  }

  const subtotal = orderData.subtotal !== undefined
    ? orderData.subtotal
    : items.reduce((acc, it) => acc + (it.price * it.quantity), 0);

  const deliveryFee = orderData.deliveryFee !== undefined ? orderData.deliveryFee : 0;
  const totalPrice = orderData.totalPrice !== undefined ? orderData.totalPrice : (subtotal + deliveryFee);

  const firstItem = items[0] || {
    productId: "unknown",
    productName: "Pet Product",
    productImage: "/images/products/fluffy-cat-food-1-2kg.png",
    weightOrSize: "Standard",
    price: totalPrice,
    quantity: 1
  };

  const newOrder: OrderItem = {
    id,
    timestamp: now.getTime(),
    formattedDate,
    items,
    subtotal,
    deliveryFee,
    totalPrice,
    customerName: orderData.customerName || "Customer",
    customerPhone: orderData.customerPhone || "N/A",
    customerEmail: orderData.customerEmail,
    customerCity: orderData.customerCity || "Lahore",
    customerArea: orderData.customerArea || "Lahore Area",
    customerAddress: orderData.customerAddress || "Lahore, Pakistan",
    nearbyLandmark: orderData.nearbyLandmark,
    deliveryMethod: orderData.deliveryMethod || "Standard Lahore (Same Day)",
    paymentMethod: orderData.paymentMethod || "Cash on Delivery (COD)",
    channel: orderData.channel || "Direct Website Checkout",
    status: orderData.status || "Confirmed",
    notes: orderData.notes,
    
    // Legacy properties
    productId: firstItem.productId,
    productName: items.length > 1 ? `${firstItem.productName} + ${items.length - 1} more items` : firstItem.productName,
    productImage: firstItem.productImage,
    weightOrSize: firstItem.weightOrSize,
    price: totalPrice
  };

  if (typeof window !== "undefined") {
    const existing = getStoredOrders();
    const updated = [newOrder, ...existing];
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("rvc_orders_updated"));
    } catch (e) {
      console.error("Failed to save order to localStorage", e);
    }
  }

  return newOrder;
}

export function updateOrderStatus(orderId: string, status: OrderItem["status"]): OrderItem[] {
  if (typeof window === "undefined") return [];
  const existing = getStoredOrders();
  const updated = existing.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("rvc_orders_updated"));
  } catch (e) {
    console.error("Failed to update order status", e);
  }
  return updated;
}

export function deleteOrder(orderId: string): OrderItem[] {
  if (typeof window === "undefined") return [];
  const existing = getStoredOrders();
  const updated = existing.filter((ord) => ord.id !== orderId);
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("rvc_orders_updated"));
  } catch (e) {
    console.error("Failed to delete order", e);
  }
  return updated;
}

export function clearAllOrders(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    window.dispatchEvent(new Event("rvc_orders_updated"));
  } catch (e) {
    console.error("Failed to clear orders", e);
  }
}

export function exportOrdersCSV(orders: OrderItem[]): void {
  if (orders.length === 0) {
    alert("No orders available to export.");
    return;
  }

  const headers = [
    "Order ID",
    "Date & Time",
    "Customer Name",
    "Phone / WhatsApp",
    "City",
    "Area",
    "Address",
    "Items Count",
    "Items Detail",
    "Subtotal (PKR)",
    "Delivery Fee (PKR)",
    "Total (PKR)",
    "Delivery Method",
    "Payment Method",
    "Channel",
    "Status"
  ];

  const rows = orders.map((o) => {
    const itemsSummary = (o.items && o.items.length > 0)
      ? o.items.map(it => `${it.quantity}x ${it.productName} (${it.weightOrSize})`).join("; ")
      : o.productName || "Product";

    return [
      `"${o.id}"`,
      `"${o.formattedDate}"`,
      `"${(o.customerName || "N/A").replace(/"/g, '""')}"`,
      `"${o.customerPhone || "N/A"}"`,
      `"${o.customerCity || "Lahore"}"`,
      `"${(o.customerArea || "N/A").replace(/"/g, '""')}"`,
      `"${(o.customerAddress || "N/A").replace(/"/g, '""')}"`,
      o.items ? o.items.length : 1,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      o.subtotal || o.price || 0,
      o.deliveryFee || 0,
      o.totalPrice || o.price || 0,
      `"${o.deliveryMethod || "Standard"}"`,
      `"${o.paymentMethod || "COD"}"`,
      `"${o.channel || "Website"}"`,
      `"${o.status}"`
    ];
  });

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `rvc_clinic_orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
