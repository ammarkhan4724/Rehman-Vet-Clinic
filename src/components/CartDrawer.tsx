import React, { useMemo } from "react";
import type { CartLineItem } from "../utils/orders";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartLineItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  const FREE_SHIPPING_THRESHOLD = 3500;

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  }, [cartItems]);

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.quantity, 0);
  }, [cartItems]);

  const remainingForFreeDelivery = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slide-left">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🛒</span>
            <h2 className="font-black text-sm tracking-tight">Your Clinic Cart</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950">
              {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white grid place-items-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 p-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-1.5">
            <span>
              {remainingForFreeDelivery === 0 ? (
                <span>🎉 <strong>Unlocked!</strong> You qualify for <strong>FREE Lahore Delivery</strong>!</span>
              ) : (
                <span>Add <strong>Rs. {remainingForFreeDelivery.toLocaleString()}</strong> more for <strong>FREE Delivery</strong>!</span>
              )}
            </span>
            <span className="text-[10px] text-emerald-700 font-black">{freeDeliveryPercent}%</span>
          </div>
          <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${freeDeliveryPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-300 grid place-items-center text-3xl">
                🛒
              </div>
              <h3 className="font-black text-slate-800 text-base">Your Cart is Empty</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Explore our veterinarian-curated cat food, KMR milk replacers, bentonite litter, and medications.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl shadow-sm"
              >
                Browse Shop Items
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.productId} className="py-3.5 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.productName}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.weightOrSize}</span>
                    
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-slate-200 text-slate-600 font-bold transition"
                        >
                          -
                        </button>
                        <span className="px-2 font-black text-slate-900 text-[11px]">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-slate-200 text-slate-600 font-bold transition"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-xs text-slate-900">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.productId)}
                    className="text-slate-300 hover:text-red-500 p-1 text-sm transition"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Bottom Checkout Action */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Delivery:</span>
                <span className="font-bold text-emerald-700">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? "FREE (Lahore)" : "Rs. 200"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-emerald-800">
                  Rs. {(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 200)).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-900/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </button>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
              <span>🔒 100% Secure Checkout</span>
              <span>•</span>
              <span>Cash on Delivery in Lahore</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
