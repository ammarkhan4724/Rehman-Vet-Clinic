import os
import re

def update_admin():
    admin_path = r"D:\Rehman Vet Clinic\src\components\AdminCMS.tsx"
    with open(admin_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update PIN
    content = content.replace('const DEFAULT_PIN = "2026";', 'const DEFAULT_PIN = "Admin@RVC!2026";')
    content = content.replace('"Enter PIN (Default: 2026)"', '"Enter Secure Password"')
    content = content.replace('<span className="text-emerald-400 font-semibold">PIN: 2026</span>', '')
    content = content.replace('Enter Master Security PIN', 'Enter Master Password')

    # 2. Add Accounts to activeTab
    content = content.replace('useState<"products" | "orders" | "security">("products")', 'useState<"products" | "orders" | "security" | "accounts">("products")')

    # 3. Add Accounts Tab Button
    security_button = r'''<button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
                activeTab === "security"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              <span>🛡️ Security &amp; Traffic</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>'''
            
    accounts_button = r'''
            <button
              onClick={() => setActiveTab("accounts")}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
                activeTab === "accounts"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              <span>💰 Accounts &amp; Revenue</span>
            </button>'''
    content = content.replace(security_button, security_button + accounts_button)

    # 4. Make tabs mobile friendly
    content = content.replace('<div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">', '<div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-4">')
    content = content.replace('<div className="flex items-center gap-2">', '<div className="flex flex-wrap items-center gap-2">', 1)

    # 5. Add Accounts UI
    accounts_ui = r'''
        {/* TAB 4: ACCOUNTS & REVENUE */}
        {activeTab === "accounts" && (
          <div className="animate-slide-in">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Financial Ledger &amp; Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white border border-emerald-200 rounded-2xl shadow-sm">
                <div className="text-sm font-bold text-slate-500 mb-1">Total Lifetime Sales</div>
                <div className="text-3xl font-black text-slate-900">Rs. {metrics.ordersValue.toLocaleString()}</div>
                <div className="text-xs text-emerald-600 font-semibold mt-2">↑ Tracked from {metrics.totalOrders} orders</div>
              </div>
              <div className="p-6 bg-white border border-blue-200 rounded-2xl shadow-sm">
                <div className="text-sm font-bold text-slate-500 mb-1">Inventory Value (In-Stock)</div>
                <div className="text-3xl font-black text-slate-900">Rs. {metrics.totalValue.toLocaleString()}</div>
                <div className="text-xs text-blue-600 font-semibold mt-2">Value of {metrics.inStock} distinct products</div>
              </div>
              <div className="p-6 bg-white border border-amber-200 rounded-2xl shadow-sm">
                <div className="text-sm font-bold text-slate-500 mb-1">Delivered Orders</div>
                <div className="text-3xl font-black text-slate-900">{metrics.deliveredOrders}</div>
                <div className="text-xs text-amber-600 font-semibold mt-2">Fully completed transactions</div>
              </div>
            </div>
            
            <div className="bg-slate-900 text-white p-6 rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full" />
              <h3 className="text-lg font-bold mb-2">Automated Revenue Tracking</h3>
              <p className="text-sm text-slate-400 max-w-xl">
                The CMS securely logs all Cash on Delivery (COD) and bank transfer transactions. 
                All data is stored directly in the Hostinger database via SQL endpoints ensuring 
                encrypted financial transparency.
              </p>
            </div>
          </div>
        )}
'''
    # We will inject this before </main>
    content = content.replace('</main>', accounts_ui + '\n      </main>')
    
    # 6. Make Admin form fields mobile-friendly (fix grid cols)
    content = content.replace('className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"', 'className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"')
    content = content.replace('className="grid grid-cols-2 gap-4 mb-4"', 'className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"')
    content = content.replace('className="grid grid-cols-2 gap-6"', 'className="grid grid-cols-1 md:grid-cols-2 gap-6"')
    content = content.replace('className="grid grid-cols-3 gap-6"', 'className="grid grid-cols-1 md:grid-cols-3 gap-6"')

    with open(admin_path, "w", encoding="utf-8") as f:
        f.write(content)

def update_app():
    app_path = r"D:\Rehman Vet Clinic\src\App.tsx"
    with open(app_path, "r", encoding="utf-8") as f:
        content = f.read()

    map_iframe = r'''
                <div className="mt-5 rounded-2xl overflow-hidden border border-emerald-100 shadow-sm">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13606.313886576757!2d74.33129532551406!3d31.523363065463777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919052a2486c3b1%3A0xeb1352f830013652!2sRehman%20Veterinary%20Clinic!5e0!3m2!1sen!2s!4v1714578165154!5m2!1sen!2s" 
                    width="100%" 
                    height="200" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
'''
    # Find insertion point
    target = r'<p>💰 <strong>Pricing:</strong> Standard clinic visit price is Rs. 2,000. This covers the visit charges only; medication charges are separate and not free.</p>'
    if target in content:
        content = content.replace(target, target + '\n              </div>' + map_iframe)
        # We need to remove the closing div from after the target because I just injected it, 
        # wait, let me use a safer replace.
        content = content.replace(target + '\n              </div>' + map_iframe, target + '\n' + map_iframe)
        
    with open(app_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update_admin()
    update_app()
