import React, { useState, useMemo } from "react";
import type { CartLineItem, OrderItem } from "../utils/orders";
import { saveOrder } from "../utils/orders";
import { detectSqlInjection, sanitizeInput, validateHoneypot, isRateLimited } from "../utils/security";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartLineItem[];
  onOrderCompleted: (order: OrderItem) => void;
  onClearCart: () => void;
}

const LAHORE_AREAS = [
  "DHA (Phase 1, 2, 3, 4, 5, 6, 7, 8)",
  "DHA Phase 9 Prism & Rahbar",
  "Gulberg (I, II, III, MM Alam, Main Blvd)",
  "Model Town (Blocks A to M)",
  "Johar Town (Phase 1 & 2)",
  "Bahria Town Lahore (All Sectors)",
  "Lahore Cantt & Sarwar Road",
  "Cavalry Ground & Bridge Colony",
  "Askari (Askari 1, 5, 9, 10, 11)",
  "Wapda Town & PIA Society",
  "Valencia Town & Lake City",
  "Faisal Town & Garden Town",
  "Allama Iqbal Town & Samanabad",
  "Shadman, Jail Road & Mall Road",
  "Khayaban-e-Amin & Ferozepur Road",
  "Other Area in Lahore"
];

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderCompleted,
  onClearCart
}: CheckoutModalProps) {
  // Wizard step: 1 = Details, 2 = Shipping, 3 = Payment, 4 = Review, 5 = Success Receipt
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Step 1: Customer Contact & Delivery Details
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [city] = useState<string>("Lahore");
  const [selectedArea, setSelectedArea] = useState<string>(LAHORE_AREAS[0]);
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");

  // Step 2: Shipping Method
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "pickup">("standard");
  const [orderNotes, setOrderNotes] = useState<string>("");

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "jazzcash" | "bank">("cod");

  // State flags
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [securityError, setSecurityError] = useState<string>("");
  const [confirmedOrder, setConfirmedOrder] = useState<OrderItem | null>(null);

  // Financial Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    if (shippingMethod === "pickup") return 0;
    if (shippingMethod === "express") return 450;
    // Standard: Free if subtotal >= 3500, else 200 PKR
    return subtotal >= 3500 ? 0 : 200;
  }, [shippingMethod, subtotal]);

  const grandTotal = subtotal + deliveryFee;

  if (!isOpen) return null;

  // Validation before going to next step
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !streetAddress.trim()) {
      setSecurityError("Please fill out all required contact and address fields.");
      return;
    }

    if (
      detectSqlInjection(fullName).isMalicious ||
      detectSqlInjection(streetAddress).isMalicious ||
      detectSqlInjection(landmark).isMalicious
    ) {
      setSecurityError("⚠️ Security Shield: Invalid input syntax or SQL injection pattern detected.");
      return;
    }

    setSecurityError("");
    setCurrentStep(2);
  };

  const handleNextFromStep2 = () => {
    if (detectSqlInjection(orderNotes).isMalicious) {
      setSecurityError("⚠️ Security Shield: Invalid characters in delivery notes.");
      return;
    }
    setSecurityError("");
    setCurrentStep(3);
  };

  const handleNextFromStep3 = () => {
    setSecurityError("");
    setCurrentStep(4);
  };

  // Final Order Placement
  const handleFinalOrderSubmit = () => {
    // Bulk traffic protection
    const rateCheck = isRateLimited("checkout_submission", 3, 60000);
    if (!rateCheck.allowed) {
      setSecurityError(`Bulk traffic protection: Please wait ${rateCheck.retryAfterSeconds}s before retrying.`);
      return;
    }

    setIsSubmitting(true);
    setSecurityError("");

    setTimeout(() => {
      const deliveryMethodLabel =
        shippingMethod === "express"
          ? "Express Rush (60-90 Mins)"
          : shippingMethod === "pickup"
          ? "Clinic Pickup (Free)"
          : "Standard Lahore (Same Day)";

      const paymentMethodLabel =
        paymentMethod === "jazzcash"
          ? "EasyPaisa / JazzCash"
          : paymentMethod === "bank"
          ? "Bank Transfer (Meezan/HBL)"
          : "Cash on Delivery (COD)";

      const newOrder = saveOrder({
        customerName: sanitizeInput(fullName),
        customerPhone: sanitizeInput(phone),
        customerEmail: email ? sanitizeInput(email) : undefined,
        customerCity: city,
        customerArea: sanitizeInput(selectedArea),
        customerAddress: sanitizeInput(streetAddress),
        nearbyLandmark: landmark ? sanitizeInput(landmark) : undefined,
        deliveryMethod: deliveryMethodLabel,
        paymentMethod: paymentMethodLabel,
        channel: "Direct Website Checkout",
        status: "Confirmed",
        notes: orderNotes ? sanitizeInput(orderNotes) : undefined,
        items: cartItems,
        subtotal,
        deliveryFee,
        totalPrice: grandTotal
      });

      setConfirmedOrder(newOrder);
      onOrderCompleted(newOrder);
      onClearCart();
      setIsSubmitting(false);
      setCurrentStep(5); // Show success receipt
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 relative">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-5 sm:px-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 grid place-items-center font-black text-slate-950 text-sm shadow-md">
              RV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base text-white tracking-tight">Express Pet Checkout</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  256-Bit SSL Encrypted
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Rehman Veterinary Clinic &amp; Pet Pharmacy Lahore</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 grid place-items-center text-slate-300 hover:text-white text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Breadcrumbs (Hidden on step 5) */}
        {currentStep < 5 && (
          <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-3">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {[
                { step: 1, label: "Address" },
                { step: 2, label: "Delivery" },
                { step: 3, label: "Payment" },
                { step: 4, label: "Review" },
              ].map((item, idx) => (
                <React.Fragment key={item.step}>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full text-[11px] font-black grid place-items-center transition-all ${
                        currentStep === item.step
                          ? "bg-emerald-700 text-white shadow-md shadow-emerald-900/20 scale-105"
                          : currentStep > item.step
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {currentStep > item.step ? "✓" : item.step}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        currentStep === item.step
                          ? "text-slate-900"
                          : currentStep > item.step
                          ? "text-emerald-800"
                          : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {idx < 3 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded ${
                        currentStep > item.step ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Security Warning / Error Alert */}
        {securityError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-800 flex items-center gap-2">
            <span>🛡️</span>
            <span>{securityError}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: CUSTOMER CONTACT & ADDRESS */}
          {currentStep === 1 && (
            <form onSubmit={handleNextFromStep1} className="space-y-4">
              {/* Anti-Bot Honeypot Trap */}
              <input type="text" name="fax_trap" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

              <div>
                <h3 className="text-sm font-black text-slate-900 mb-1">Step 1: Contact &amp; Doorstep Delivery Location</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Enter where our clinic rider should deliver your pet food and medications in Lahore.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Usman Malik"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0312 3456789"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    disabled
                    value="Lahore (Same-Day Dispatch)"
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lahore Area / Sector *</label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {LAHORE_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Complete House / Street Address *</label>
                <textarea
                  required
                  rows={2}
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. House #14, Street 3, Sector Y, Phase 3 DHA"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nearest Landmark (Optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Packages Mall / Y-Block Commercial"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For order receipt"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
                >
                  <span>Continue to Shipping Method</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SHIPPING METHOD & SCHEDULE */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-1">Step 2: Choose Delivery Speed</h3>
                <p className="text-xs text-slate-500">
                  Select how urgently you need your pet supplies delivered to <strong className="text-slate-800">{selectedArea}</strong>.
                </p>
              </div>

              <div className="space-y-3">
                {/* Standard Lahore Delivery */}
                <div
                  onClick={() => setShippingMethod("standard")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    shippingMethod === "standard"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 grid place-items-center text-xl shrink-0">
                      🚚
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Standard Same-Day Lahore Delivery</div>
                      <div className="text-[11px] text-slate-500">Delivered within 3 to 5 hours by clinic courier rider.</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-xs text-emerald-800">
                      {subtotal >= 3500 ? "FREE" : "Rs. 200"}
                    </span>
                    {subtotal >= 3500 && (
                      <span className="block text-[9px] text-emerald-600 font-bold uppercase">Order &gt; Rs. 3,500</span>
                    )}
                  </div>
                </div>

                {/* Urgent Express Priority Courier */}
                <div
                  onClick={() => setShippingMethod("express")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    shippingMethod === "express"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 grid place-items-center text-xl shrink-0">
                      ⚡
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Urgent Express Courier (60–90 Mins)</div>
                      <div className="text-[11px] text-slate-500">Priority motorcycle dispatch for critical puppy/kitten food &amp; meds.</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-xs text-amber-800">Rs. 450</span>
                    <span className="block text-[9px] text-amber-600 font-bold uppercase">Emergency Rush</span>
                  </div>
                </div>

                {/* Self Pickup at Clinic */}
                <div
                  onClick={() => setShippingMethod("pickup")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    shippingMethod === "pickup"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 grid place-items-center text-xl shrink-0">
                      🏥
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Self-Pickup at Rehman Vet Clinic</div>
                      <div className="text-[11px] text-slate-500">Packaged and ready for pickup at our clinic counter in 30 mins.</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-xs text-blue-800">FREE</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prescription Instructions / Pet Notes for Dr. Saif (Optional)
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Please send kitten flavor food, or pet has sensitive digestion."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Address
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-900/20"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-1">Step 3: Select Payment Method</h3>
                <p className="text-xs text-slate-500">
                  Choose how you would like to settle your order of <strong className="text-slate-900">Rs. {grandTotal.toLocaleString()}</strong>.
                </p>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">💵</span>
                      <span className="font-black text-xs text-slate-900">Cash on Delivery (COD)</span>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Most Popular in Pakistan
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-8 leading-relaxed">
                    Pay cash to our clinic rider upon inspection and doorstep handover of your pet items.
                  </p>
                </div>

                {/* EasyPaisa / JazzCash Mobile Account */}
                <div
                  onClick={() => setPaymentMethod("jazzcash")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "jazzcash"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">📱</span>
                      <span className="font-black text-xs text-slate-900">EasyPaisa / JazzCash Direct Transfer</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">Instant Mobile Pay</span>
                  </div>
                  <div className="pl-8 mt-2 space-y-1.5 text-xs bg-white/80 p-3 rounded-xl border border-slate-200/60 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account Title:</span>
                      <span className="font-bold text-slate-900">Dr. Saif Ur Rehman</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">JazzCash / EasyPaisa:</span>
                      <span className="font-bold text-emerald-700 font-mono">0311 4899904</span>
                    </div>
                  </div>
                </div>

                {/* Direct Bank Transfer */}
                <div
                  onClick={() => setPaymentMethod("bank")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "bank"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🏦</span>
                      <span className="font-black text-xs text-slate-900">Online Bank Account Transfer (Meezan / HBL)</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">IBAN Transfer</span>
                  </div>
                  <div className="pl-8 mt-2 space-y-1.5 text-xs bg-white/80 p-3 rounded-xl border border-slate-200/60 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bank:</span>
                      <span className="font-bold text-slate-900">Meezan Bank Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account Title:</span>
                      <span className="font-bold text-slate-900">Rehman Veterinary Clinic</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">IBAN:</span>
                      <span className="font-bold text-emerald-700 text-[11px]">PK82MEZN0002840108392019</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Delivery
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep3}
                  className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-900/20"
                >
                  Review Order Summary →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER REVIEW & CONFIRM */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-1">Step 4: Review &amp; Place Your Order</h3>
                <p className="text-xs text-slate-500">
                  Please review your items and delivery destination before final confirmation.
                </p>
              </div>

              {/* Items Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Cart Items ({cartItems.length})
                </div>
                <div className="divide-y divide-slate-200/60 max-h-48 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white overflow-hidden shrink-0 border border-slate-200">
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1 max-w-xs">{item.productName}</div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {item.quantity} x Rs. {item.price.toLocaleString()} ({item.weightOrSize})
                          </div>
                        </div>
                      </div>
                      <div className="font-black text-slate-900">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Fees */}
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal:</span>
                    <span className="font-bold">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>
                      Delivery (
                      {shippingMethod === "express"
                        ? "Urgent Rush"
                        : shippingMethod === "pickup"
                        ? "Clinic Pickup"
                        : "Same-Day Standard"}
                      ):
                    </span>
                    <span className="font-bold text-emerald-800">
                      {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span className="text-emerald-800">Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Destination & Payment Verification Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="font-bold text-[10px] uppercase text-slate-400 mb-1">Delivering To:</div>
                  <div className="font-bold text-slate-900">{fullName}</div>
                  <div className="font-mono text-emerald-700 font-semibold">{phone}</div>
                  <div className="text-slate-600 mt-1 leading-snug">{streetAddress}, {selectedArea}, Lahore</div>
                  {landmark && <div className="text-[10px] text-slate-400 mt-0.5">Near: {landmark}</div>}
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="font-bold text-[10px] uppercase text-slate-400 mb-1">Payment &amp; Terms:</div>
                  <div className="font-bold text-slate-900">
                    {paymentMethod === "cod"
                      ? "Cash on Delivery (COD)"
                      : paymentMethod === "jazzcash"
                      ? "JazzCash / EasyPaisa"
                      : "Bank Transfer"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Inspected and certified genuine by Dr. Saif Ur Rehman, DVM. 100% money-back authenticity guarantee.
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Payment
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalOrderSubmit}
                  className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-2xl shadow-xl shadow-emerald-900/30 transition-all hover:scale-[1.01] flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order Now (Rs. {grandTotal.toLocaleString()})</span>
                      <span>✓</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: ORDER SUCCESS RECEIPT */}
          {currentStep === 5 && confirmedOrder && (
            <div className="text-center py-4 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-3xl mx-auto shadow-inner">
                ✓
              </div>

              <div>
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Order Successfully Dispatched to Pharmacy
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Thank You for Your Order!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Your order has been registered in Rehman Vet Clinic's delivery dispatch system.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-400 font-sans">Official Order ID:</span>
                  <span className="font-black text-emerald-800 text-sm">{confirmedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Customer:</span>
                  <span className="font-bold text-slate-800">{confirmedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Contact:</span>
                  <span className="font-semibold text-slate-800">{confirmedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Destination:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">{confirmedOrder.customerArea}, Lahore</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Payment:</span>
                  <span className="font-semibold text-slate-800">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-sans font-black">
                  <span>Grand Total:</span>
                  <span className="text-emerald-800">Rs. {confirmedOrder.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Live Tracking / WhatsApp Action */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <a
                  href={`https://wa.me/923114899904?text=${encodeURIComponent(
                    `Hello Dr. Saif,\n\nI just placed order *${confirmedOrder.id}* on your website for *Rs. ${confirmedOrder.totalPrice.toLocaleString()}*.\n\n*Name:* ${confirmedOrder.customerName}\n*Area:* ${confirmedOrder.customerArea}, Lahore\n\nPlease confirm preparation and courier dispatch time.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Track on WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition"
                >
                  Done &amp; Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
