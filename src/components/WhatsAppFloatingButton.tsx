import React from "react";

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppFloatingButton({
  phoneNumber = "923114899904",
  defaultMessage = "Hello Dr. Rehman, I need an urgent veterinary consultation for my pet in Lahore.",
}: WhatsAppFloatingButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside aria-label="WhatsApp quick contact" className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip Pill */}
      <div className="hidden sm:flex items-center gap-2 mr-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold shadow-2xl border border-emerald-100 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span>Chat with Dr. Rehman (24/7)</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Dr. Rehman (+92 311 4899904)"
        className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white grid place-items-center shadow-2xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/80"
      >
        {/* Subtle glowing radar ping effect */}
        <span className="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-35 animate-ping -z-10" />
        
        {/* WhatsApp Icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.54 1.771.821 2.796.821 3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.767-5.768-5.767zm7.554 5.765c-.002 4.167-3.39 7.555-7.554 7.555-.989 0-1.951-.194-2.84-.567l-3.953 1.037 1.055-3.856c-.443-.95-.678-1.996-.678-3.069.002-4.167 3.39-7.555 7.555-7.555 4.165 0 7.553 3.388 7.555 7.555zm-10.155 3.125c.193.539.957 1.042 1.348 1.096.391.054.764.088 1.157-.037.394-.125 1.571-.645 1.794-.963.223-.318.223-.59.155-.715-.068-.125-.251-.2-.533-.341-.282-.141-1.666-.822-1.924-.916-.258-.094-.446-.141-.634.141-.188.282-.727.916-.891 1.104-.164.188-.328.211-.61.07-.282-.141-1.19-.439-2.267-1.4-.838-.748-1.403-1.672-1.568-1.954-.165-.282-.018-.435.123-.575.127-.126.282-.328.423-.492.141-.164.188-.282.282-.47.094-.188.047-.352-.023-.492-.07-.141-.634-1.527-.869-2.091-.228-.549-.461-.475-.634-.484-.164-.009-.352-.011-.54-.011s-.493.07-.751.352c-.258.282-.986.963-.986 2.348s1.009 2.723 1.15 2.911c.141.188 1.986 3.033 4.811 4.254z" />
        </svg>
      </a>
    </aside>
  );
}
