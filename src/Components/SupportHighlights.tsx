const featureCards = [
  { title: "FREE SHIPPING", description: "Capped at $10 per order", icon: (<svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">    <path d="M4 7h16l-1.8 8.5a2 2 0 0 1-2 1.5H7.8a2 2 0 0 1-2-1.5L4 7z" />    <path d="M7 7a5 5 0 0 1 10 0" />    <path d="M9.2 20a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6z" fill="currentColor" stroke="none" />    <path d="M14.8 20a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6z" fill="currentColor" stroke="none" />  </svg>), },
  { title: "SECURE PAYMENTS", description: "Up to 6 months installments", icon: (<svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">    <rect x="2.5" y="5" width="19" height="14" rx="2.4" />    <path d="M2.5 9h19" />    <rect x="6" y="13" width="6" height="3" rx="0.8" />  </svg>), },
  { title: "15-DAYS RETURNS", description: "Shop with fully confidence", icon: (<svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">    <path d="M12 3l7 3v6c0 4.2-3 7.9-7 9-4-1.1-7-4.8-7-9V6z" />    <path d="M12 6v12" />  </svg>), },
  { title: "24X7 FULLY SUPPORT", description: "Get friendly support", icon: (<svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">    <path d="M4 12a8 8 0 0 1 16 0" />    <path d="M7 20a3 3 0 0 1-3-3v-3a2 2 0 0 1 2-2h1" />    <path d="M17 20a3 3 0 0 0 3-3v-3a2 2 0 0 0-2-2h-1" />    <rect x="2" y="12" width="4" height="6" rx="2" />    <rect x="18" y="12" width="4" height="6" rx="2" />  </svg>), },
] as const;

const SupportHighlights = () => {
  return (
    <section className=" bg-white py-7">
      <div className="mx-auto grid w-[92%] max-w-[1200px] gap-6 text-sm sm:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((item) => (
          <div key={item.title} className="flex items-center gap-4">
            <div className="text-[#e53935]">{item.icon}</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#111111]">{item.title}</p>
              <p className="mt-1 text-sm text-[#667085]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SupportHighlights;
