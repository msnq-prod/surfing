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

function MapCenterer({ activeLocation }: { activeLocation: any }) {
  const map = useMap();
  useEffect(() => {
    if (activeLocation) {
      // Offset center to left so marker is somewhat centered in the left area, allowing space for right panel
      // At zoom 5, 1 degree longitude is ~10-20 pixels depending on latitude. We can just pan to the coords and then apply a small offset.
      map.flyTo(activeLocation.coords, 5, { duration: 1.5 });
    }
  }, [activeLocation, map]);
  return null;
}

export function Home() {
  const { t } = useLanguage();

  const locations = [
    { 
      id: "russia", 
      title: t("home.map.ru.title"), 
      coords: [54.958, 20.473] as [number, number],
      intro: t("home.map.ru.intro"),
      country: t("home.map.ru.country"),
      image: "https://images.unsplash.com/photo-1544923246-77307dd654ca?auto=format&fit=crop&w=800&q=80"
    },
    { 
      id: "srilanka", 
      title: t("home.map.sri.title"), 
      coords: [5.973, 80.428] as [number, number],
      intro: t("home.map.sri.intro"),
      country: t("home.map.sri.country"),
      image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80"
    },
    { 
      id: "indo", 
      title: t("home.map.indo.title"), 
      coords: [-8.650, 115.130] as [number, number],
      intro: t("home.map.indo.intro"),
      country: t("home.map.indo.country"),
      image: "https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const [activeRate, setActiveRate] = useState<"single" | "group" | "club">("single");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState<any>(locations[0]);
  const teamScrollRef = useRef<HTMLDivElement>(null);
  const ratesRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ratesRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

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

      {/* Full Screen Interactive Map Section */}
      <section id="rates" ref={ratesRef} className="w-full border-b border-primary/10 relative">
        <div className="absolute top-8 right-8 z-10 bg-white/95 backdrop-blur shadow-2xl rounded-[12px] border border-primary/10 w-[340px] max-w-[calc(100vw-4rem)] flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto">
          {activeLocation ? (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key={activeLocation.id} className="flex flex-col h-full">
              {/* Image banner */}
              <div className="w-full h-[140px] relative shrink-0">
                <img 
                  src={activeLocation.image} 
                  alt={activeLocation.title} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col grow">
                <span className="text-[10px] uppercase tracking-[2px] font-bold text-gray-500 mb-1">
                  {activeLocation.country}
                </span>

                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[22px] font-light text-primary leading-tight">{activeLocation.title}</h2>
                  <button 
                    onClick={() => {
                      const currentIndex = locations.findIndex(l => l.id === activeLocation.id);
                      const nextIndex = (currentIndex + 1) % locations.length;
                      setActiveLocation(locations[nextIndex]);
                    }}
                    className="p-2 hover:bg-primary/5 rounded-full text-primary shrink-0 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
                
                <span className="text-[10px] text-gray-400 mb-6 font-mono tracking-wider">
                  {Math.abs(activeLocation.coords[0]).toFixed(3)}° {activeLocation.coords[0] >= 0 ? 'N' : 'S'}, {Math.abs(activeLocation.coords[1]).toFixed(3)}° {activeLocation.coords[1] >= 0 ? 'E' : 'W'}
                </span>

                {/* Rate Selector */}
                <div className="flex flex-col border-t border-primary/10 pt-5 mt-auto">
                  <div className="flex justify-between items-center mb-3">
                    {/* Rate Selector Pills */}
                    <div className="flex bg-primary/5 p-1 rounded-md w-full justify-between">
                      {(["single", "group", "club"] as const).map(rate => (
                        <button
                          key={rate}
                          onClick={() => setActiveRate(rate)}
                          className={`flex-1 text-center py-1.5 text-[12px] uppercase tracking-wider rounded transition-all ${activeRate === rate ? 'bg-white shadow relative text-primary font-medium' : 'text-primary/50 hover:text-primary/70'}`}
                        >
                          {t(`home.rates.${rate}.title`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end justify-between mb-4">
                     <span className="text-[24px] tracking-tight">{t(`home.rates.${activeRate}.price`)}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    <li className="flex gap-2 text-[13px] opacity-80 leading-snug">
                      <span className="text-accent">•</span> {t(`home.rates.${activeRate}.desc`)}
                    </li>
                  </ul>

                  <Button 
                    className="w-full text-[13px] tracking-widest uppercase bg-primary text-white hover:bg-primary/90 h-12"
                    onClick={() => setIsBookingOpen(true)}
                  >
                    {t("home.rates.button")}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="default" className="flex flex-col justify-center h-full p-6 items-center text-center">
              <h2 className="text-[20px] font-light mb-2 text-primary">{t("home.map.title") || "Select a location"}</h2>
              <p className="text-[13px] opacity-70">
                {t("home.map.desc") || "Click on a marker to see details"}
              </p>
            </motion.div>
          )}
        </div>

        <div className="h-[75vh] min-h-[500px] w-full bg-primary/5 relative z-0">
          {typeof window !== 'undefined' && (
            <MapContainer 
              center={[35.0, 60.0]} 
              zoom={3} 
              minZoom={2}
              maxBounds={[[-85, -180], [85, 180]]}
              maxBoundsViscosity={1.0}
              scrollWheelZoom={false} 
              dragging={true}
              touchZoom={true}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                bounds={[[-85, -180], [85, 180]]}
                noWrap={true}
              />
              <ZoomControl position="bottomleft" />
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

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        rateName={t(`home.rates.${activeRate}.title`)}
      />
    </div>
  );
}
