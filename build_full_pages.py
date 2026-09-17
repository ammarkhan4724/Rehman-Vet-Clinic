import os
import json
import shutil
from datetime import datetime

ROOT_DIR = "d:/Rehman Vet Clinic"
DIST_DIR = os.path.join(ROOT_DIR, "dist")

def render_author_box():
    return """
    <div class="my-12 p-6 rounded-3xl bg-emerald-50/70 border border-emerald-100 flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
        DR
      </div>
      <div>
        <div class="flex items-center gap-2 flex-wrap mb-1">
          <span class="font-extrabold text-base text-slate-900">Medically Reviewed by Dr. Saif Ur Rehman, DVM</span>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">PVMC Registered</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed mb-2">
          Clinical Director at Rehman Veterinary Clinic Lahore with 9+ years of dedicated clinical experience in emergency animal trauma, small animal surgery, and mobile veterinary medicine. Conducted over 2,400+ house-call consults across Lahore.
        </p>
        <div class="flex items-center gap-4 text-xs font-semibold text-emerald-700">
          <span>🩺 Small Animal Medicine</span>
          <span>⚡ Emergency Triage</span>
          <span>📍 Lahore, Pakistan</span>
        </div>
      </div>
    </div>
    """

def render_emergency_cta():
    return """
    <div class="my-12 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-8 md:p-10 shadow-xl border border-emerald-500/20 text-center relative overflow-hidden">
      <div class="relative z-10 max-w-2xl mx-auto">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-4">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          24/7 Immediate Veterinary Response
        </span>
        <h2 class="text-2xl md:text-3xl font-black tracking-tight mb-3">Pet Experiencing a Medical Emergency?</h2>
        <p class="text-xs md:text-sm text-slate-300 mb-6 leading-relaxed">
          Do not wait. From acute vomiting and bloat to accident trauma and respiratory distress, Dr. Saif is on standby for immediate emergency clinic triage, in-home house call dispatch, or 24/7 video consultation.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="tel:+923114899904" class="w-full sm:w-auto px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition shadow-lg flex items-center justify-center gap-2">
            <span>📞 Call Emergency Helpline: +92 311 4899904</span>
          </a>
          <a href="https://wa.me/923114899904?text=EMERGENCY:%20My%20pet%20needs%20urgent%20veterinary%20care%20in%20Lahore." target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2">
            <span>💬 WhatsApp Emergency Triage</span>
          </a>
        </div>
      </div>
    </div>
    """

def render_faq_accordion(faqs):
    faq_items = []
    for q, a in faqs:
        faq_items.append(f"""
        <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <h3 class="font-bold text-slate-900 text-sm md:text-base mb-2 flex items-start gap-2">
            <span class="text-emerald-600 shrink-0">Q:</span>
            <span>{q}</span>
          </h3>
          <p class="text-xs md:text-sm text-slate-600 leading-relaxed pl-6">{a}</p>
        </div>
        """)
    return f"""
    <section class="my-14">
      <div class="text-center mb-8">
        <span class="text-xs font-extrabold text-emerald-700 tracking-wider uppercase">Frequently Asked Questions</span>
        <h2 class="text-2xl font-black text-slate-900 mt-1">Frequently Asked Clinical & Cost Questions</h2>
      </div>
      <div class="space-y-4 max-w-4xl mx-auto">
        {''.join(faq_items)}
      </div>
    </section>
    """

def render_related_links(links):
    cards = []
    for title, url, desc in links:
        cards.append(f"""
        <a href="{url}" class="block p-5 rounded-2xl bg-white border border-slate-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition group">
          <h4 class="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition mb-1">{title}</h4>
          <p class="text-xs text-slate-500 line-clamp-2">{desc}</p>
          <span class="text-xs font-semibold text-emerald-600 mt-2 inline-flex items-center gap-1">Read Service Guide →</span>
        </a>
        """)
    return f"""
    <section class="my-12 border-t border-slate-200/70 pt-10">
      <h3 class="text-lg font-bold text-slate-900 mb-6">Explore Related Veterinary Care & City Hubs</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        {''.join(cards)}
      </div>
    </section>
    """

print("Helper renderers created successfully.")
