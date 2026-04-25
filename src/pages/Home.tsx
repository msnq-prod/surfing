import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "../components/ui/button";
import { MapContainer, TileLayer, Marker, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "../contexts/LanguageContext";
import { BookingModal } from "../components/BookingModal";

// Fix Leaflet icons (standard issue with webpack/vite)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Bright Marker for Schools
const schoolMarker = L.divIcon({
  className: 'custom-marker',
  html: `<div class="w-8 h-8 bg-accent rounded-full border-4 border-white shadow-lg flex items-center justify-center relative"></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const airportMarker = L.divIcon({
  className: 'custom-marker',
  html: `<div class="w-8 h-8 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center relative"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3-1v2l4 2 2 4h2l-1-3 3-3 4 6l1.2-.7c.4-.2.7-.6.6-1.1Z"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const hotelMarker = L.divIcon({
  className: 'custom-marker',
  html: `<div class="w-6 h-6 bg-white rounded-full border-[3px] border-white shadow-md flex items-center justify-center relative"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function MapCenterer({ activeLocation }: { activeLocation: any }) {
  const map = useMap();
  useEffect(() => {
    if (activeLocation) map.flyTo(activeLocation.coords, 6);
  }, [activeLocation, map]);
  return null;
}

export function Home() {
  const [activeLocation, setActiveLocation] = useState<any>(null);
  const [activeHotel, setActiveHotel] = useState<any>(null);
  const [activeRate, setActiveRate] = useState<"single" | "group" | "club">("single");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const teamScrollRef = useRef<HTMLDivElement>(null);
  const ratesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ratesRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const { t } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rateParam = params.get('rate');
    if (rateParam === 'club' || rateParam === 'group' || rateParam === 'single') {
      setActiveRate(rateParam as any);
    }
    
    // Handle hash anchor scrolling
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const locations = [
    { 
      id: "russia", 
      title: t("home.map.ru.title"), 
      coords: [54.958, 20.473] as [number, number],
      intro: t("home.map.ru.intro"),
      country: t("home.map.ru.country")
    },
    { 
      id: "srilanka", 
      title: t("home.map.sri.title"), 
      coords: [5.973, 80.428] as [number, number],
      intro: t("home.map.sri.intro"),
      country: t("home.map.sri.country")
    },
    { 
      id: "indo", 
      title: t("home.map.indo.title"), 
      coords: [-8.650, 115.130] as [number, number],
      intro: t("home.map.indo.intro"),
      country: t("home.map.indo.country")
    }
  ];

  const airports = [
    { id: "kgd", name: "Khrabrovo Airport", coords: [54.8900, 20.5926] as [number, number] },
    { id: "cmb", name: "Bandaranaike Intl Airport", coords: [7.1803, 79.8833] as [number, number] },
    { id: "dps", name: "Ngurah Rai Intl Airport", coords: [-8.7482, 115.1675] as [number, number] },
  ];

  const hotels = [
    { id: "ru_h1", name: "Zelenogradsk Spa Hotel", coords: [54.960, 20.470] as [number, number], schoolId: "russia" },
    { id: "ru_h2", name: "Princess Elisa", coords: [54.955, 20.480] as [number, number], schoolId: "russia" },
    { id: "sl_h1", name: "Weligama Bay Resort", coords: [5.970, 80.430] as [number, number], schoolId: "srilanka" },
    { id: "sl_h2", name: "W15 Weligama", coords: [5.975, 80.420] as [number, number], schoolId: "srilanka" },
    { id: "in_h1", name: "The Slow Canggu", coords: [-8.655, 115.135] as [number, number], schoolId: "indo" },
    { id: "in_h2", name: "COMO Uma Canggu", coords: [-8.645, 115.125] as [number, number], schoolId: "indo" },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr] md:min-h-[440px] border-b border-primary/10 overflow-hidden">
        <div className="relative h-[300px] md:h-full bg-primary/10 shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80" 
            alt="Океан" 
            className="w-full h-full object-cover object-[center_30%]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-[30px] left-[30px] text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            <div className="text-[12px] opacity-80 mb-1">{t("home.hero.loc")}</div>
            <div className="text-[14px] tracking-[1px]">{t("home.hero.time")}</div>
          </div>
        </div>
        
        <div className="p-10 flex flex-col justify-center bg-sand">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="text-[10px] uppercase tracking-[3px] mb-[15px] text-accent font-semibold">{t("home.hero.intro")}</div>
            <h1 className="text-[48px] leading-none mb-[20px] font-light whitespace-pre-line">
              {t("home.hero.title")}
            </h1>
            <p className="text-[14px] leading-[1.6] opacity-80 mb-8 max-w-sm">
              {t("home.hero.desc")}
            </p>
            <Button 
              variant="secondary" 
              className="w-fit"
              onClick={() => {
                document.getElementById('rates')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t("home.hero.button")}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gradient-to-b from-sand via-white to-sand px-6 md:px-12 py-32 md:py-56">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-8 text-accent scale-[1.5]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1S7 6.5 8 6a6.1 6.1 0 0 1 8 0c1 .5 1.5 1 2.5 1s2-.5 2.5-1"/><path d="M2 12c.6.5 1.2 1 2.5 1S7 12.5 8 12a6.1 6.1 0 0 1 8 0c1 .5 1.5 1 2.5 1s2-.5 2.5-1"/><path d="M2 18c.6.5 1.2 1 2.5 1S7 18.5 8 18a6.1 6.1 0 0 1 8 0c1 .5 1.5 1 2.5 1s2-.5 2.5-1"/></svg>
              </div>
              <h3 className="tracking-wide font-medium text-[22px] md:text-[24px] mb-6">{t("home.features.item1.title")}</h3>
              <p className="text-[16px] md:text-[18px] leading-[1.8] opacity-70 max-w-[320px] mx-auto">{t("home.features.item1.desc")}</p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-8 text-accent scale-[1.5]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="tracking-wide font-medium text-[22px] md:text-[24px] mb-6">{t("home.features.item2.title")}</h3>
              <p className="text-[16px] md:text-[18px] leading-[1.8] opacity-70 max-w-[320px] mx-auto">{t("home.features.item2.desc")}</p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.3 }} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-8 text-accent scale-[1.5]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              </div>
              <h3 className="tracking-wide font-medium text-[22px] md:text-[24px] mb-6">{t("home.features.item3.title")}</h3>
              <p className="text-[16px] md:text-[18px] leading-[1.8] opacity-70 max-w-[320px] mx-auto">{t("home.features.item3.desc")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rates Section */}
      <section id="rates" ref={ratesRef} className="w-full py-24 md:py-32 px-6 md:px-12 border-y border-primary/5 relative overflow-hidden bg-white">
        {/* Parallax Background Reveal */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            style={{ y: backgroundY }}
            className="absolute inset-x-0 -top-[30%] -bottom-[30%] w-full h-[160%]"
          >
            <img 
              src="https://images.unsplash.com/photo-1414609303925-50284ab91677?auto=format&fit=crop&w=1600&q=80"
              alt="Sunset Waves"
              className="w-full h-full object-cover blur-[8px] scale-110 brightness-50 contrast-125"
              referrerPolicy="no-referrer"
            />
            {/* Darkening and artistic overlays */}
            <div className="absolute inset-0 bg-black/50 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-100 pointer-events-none"></div>
            {/* Direct top/bottom fade for clean sections transitions */}
            <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-white to-transparent z-10"></div>
            <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-white to-transparent z-10"></div>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-[11px] uppercase tracking-[2px] font-bold mb-8 text-accent opacity-90 text-center drop-shadow-sm">{t("home.rates.title")}</div>
          
          <div className="flex justify-center gap-4 md:gap-12 mb-16 border-b border-white/20">
            {(["single", "group", "club"] as const).map((rate) => (
              <button
                key={rate}
                onClick={() => setActiveRate(rate)}
                className={`pb-4 text-[14px] md:text-[18px] uppercase tracking-widest transition-all relative ${
                  activeRate === rate ? "text-white opacity-100 font-medium" : "text-white/40 hover:text-white/60"
                }`}
              >
                {t(`home.rates.${rate}.title`)}
                {activeRate === rate && (
                  <motion.div layoutId="rate-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(var(--color-accent),0.5)]" />
                )}
              </button>
            ))}
          </div>

          <motion.div 
            key={activeRate}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
          >
            <div className="aspect-[3/4] md:aspect-[4/5] rounded-[4px] overflow-hidden bg-primary/10 relative group shadow-2xl">
              <img 
                src={
                  activeRate === "single" 
                    ? "https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?auto=format&fit=crop&w=1200&q=80" 
                    : activeRate === "group"
                    ? "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=1200&q=80"
                    : "https://images.unsplash.com/photo-1544923246-77307dd654ca?auto=format&fit=crop&w=1200&q=80"
                } 
                alt={t(`home.rates.${activeRate}.title`)} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white z-10">
                <div className="text-[32px] md:text-[40px] font-medium tracking-tight leading-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {t(`home.rates.${activeRate}.price`)}
                </div>
              </div>
            </div>

            <div className="flex flex-col py-4 text-white">
              <h2 className="text-[36px] md:text-[48px] font-light mb-8 leading-tight tracking-tight">{t(`home.rates.${activeRate}.title`)}</h2>
              <p className="text-[16px] md:text-[19px] leading-relaxed opacity-80 mb-12 max-w-md">
                {t(`home.rates.${activeRate}.desc`)}
              </p>
              <Button 
                className="w-fit h-16 px-12 text-[14px] tracking-widest uppercase bg-accent hover:bg-accent/90 transition-all shadow-xl hover:shadow-accent/40 border-none"
                onClick={() => setIsBookingOpen(true)}
              >
                {t("home.rates.button")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team - Full Width Section */}
      <section className="w-full p-6 md:p-12 relative overflow-hidden">
        <div className="text-[11px] uppercase tracking-[1px] font-semibold mb-[30px] opacity-50 text-center md:text-left">{t("home.team.title")}</div>
        <div className="relative group/slider max-w-7xl mx-auto">
          <div 
            ref={teamScrollRef}
            className="flex overflow-hidden gap-2 md:gap-4 no-scrollbar pb-4"
          >
            {[
              { name: "Антон", role: t("home.team.role.head"), img: "https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&w=800&q=80" },
              { name: "Марина", role: t("home.team.role.yoga"), img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" },
              { name: "Кристиан", role: t("home.team.role.longboard"), img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
              { name: "Алекс", role: t("home.team.role.shortboard", "SHORTBOARD"), img: "https://images.unsplash.com/photo-1533000787361-9c1cd3cb15bf?auto=format&fit=crop&w=800&q=80" },
              { name: "Лена", role: t("home.team.role.beginner", "BEGINNER COACH"), img: "https://images.unsplash.com/photo-1530669212001-f1eb9c0b11fd?auto=format&fit=crop&w=800&q=80" }
            ].map((coach, i) => (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                key={i} 
                className="shrink-0 w-[280px] md:w-[350px] flex flex-col relative aspect-[3/4]"
              >
                <div className="w-full h-full rounded-[4px] overflow-hidden bg-primary/10 relative group">
                  <motion.img 
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    src={coach.img} 
                    alt={coach.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                  <div className="absolute bottom-6 left-6 text-white z-10">
                    <div className="text-[20px] font-medium tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{coach.name}</div>
                    <div className="text-[11px] text-white/80 mt-1 uppercase tracking-[1.5px]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{coach.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
            
            <button 
              onClick={() => {
                if (teamScrollRef.current) {
                  teamScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
                }
              }}
              className="absolute -left-2 md:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-primary transition-all duration-300 z-10 hover:scale-110"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            <button 
              onClick={() => {
                if (teamScrollRef.current) {
                  const scrollWidth = teamScrollRef.current.scrollWidth;
                  const scrollLeft = teamScrollRef.current.scrollLeft;
                  const clientWidth = teamScrollRef.current.clientWidth;
                  
                  if (scrollLeft + clientWidth >= scrollWidth - 10) {
                     teamScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  } else {
                     teamScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
                  }
                }
              }}
              className="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-primary transition-all duration-300 z-10 hover:scale-110"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
        </div>
      </section>

      {/* Merch Section - Banner */}
      <section className="w-full border-b border-primary/10 p-6 md:p-12 bg-white flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div className="max-w-xl">
           <div className="text-[11px] uppercase tracking-[1px] font-semibold mb-[15px] opacity-50">{t("home.classes.subtitle")}</div>
           <h2 className="text-[32px] md:text-[40px] font-light leading-tight mb-4">{t("home.classes.title")}</h2>
           <p className="text-[14px] leading-relaxed opacity-80 mb-6">
             {t("home.classes.desc")}
           </p>
        </div>
        <Link to="/store">
          <Button variant="outline" className="shrink-0 h-12 px-8">{t("home.classes.button")}</Button>
        </Link>
      </section>

      {/* Full Screen Interactive Map Section */}
      <section className="w-full border-b border-primary/10 relative">
        <div className="absolute top-8 left-8 z-10 bg-white/95 backdrop-blur p-6 shadow-xl rounded-[4px] border border-primary/10 w-[320px] max-w-[calc(100vw-4rem)] min-h-[160px] transition-all duration-300 pointer-events-auto">
              {activeLocation ? (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key={activeLocation.id}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-[2px] font-bold">
                        {activeLocation.country}
                      </span>
                      <span className="text-[9px] uppercase tracking-[1px] font-medium text-gray-400 whitespace-nowrap">
                        {activeLocation.coords[0].toFixed(3)}° {activeLocation.coords[0] >= 0 ? 'N' : 'S'}, {activeLocation.coords[1].toFixed(3)}° {activeLocation.coords[1] >= 0 ? 'E' : 'W'}
                      </span>
                    </div>
                    <div className="flex gap-1 shrink-0 pt-0.5">
                      <button 
                        onClick={() => {
                          const currentIndex = locations.findIndex(l => l.id === activeLocation.id);
                          const prevIndex = (currentIndex - 1 + locations.length) % locations.length;
                          setActiveLocation(locations[prevIndex]);
                        }}
                        className="p-1 hover:bg-primary/10 rounded-full"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      </button>
                      <button 
                        onClick={() => {
                          const currentIndex = locations.findIndex(l => l.id === activeLocation.id);
                          const nextIndex = (currentIndex + 1) % locations.length;
                          setActiveLocation(locations[nextIndex]);
                        }}
                        className="p-1 hover:bg-primary/10 rounded-full"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    </div>
                  </div>
                  <h2 className="text-[24px] font-light mb-1 leading-tight">{activeLocation.title}</h2>
                  <div className="mb-4"></div>
                  <p className="text-[13px] opacity-80 leading-relaxed text-balance">
                    {activeLocation.intro}
                  </p>
                </motion.div>
              ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="default" className="flex flex-col justify-center h-full">
              <h2 className="text-[24px] font-light mb-2">{t("home.map.title")}</h2>
              <p className="text-[13px] opacity-70 text-balance">
                {t("home.map.desc")}
              </p>
            </motion.div>
          )}
        </div>
        <div className="h-[45vh] min-h-[350px] md:min-h-[400px] w-full bg-primary/5 relative z-0">
          {typeof window !== 'undefined' && (
            <MapContainer 
              center={[35.0, 60.0]} 
              zoom={3} 
              scrollWheelZoom={false} 
              dragging={true}
              touchZoom={true}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              />
              <ZoomControl position="bottomright" />
              <MapCenterer activeLocation={activeLocation} />
              {locations.map((loc) => (
                <Marker 
                  key={loc.id} 
                  position={loc.coords} 
                  icon={schoolMarker}
                  eventHandlers={{ click: () => setActiveLocation(loc) }}
                />
              ))}
            </MapContainer>
          )}
        </div>
      </section>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        rateName={t(`home.rates.${activeRate}.title`)}
      />
    </div>
  );
}
