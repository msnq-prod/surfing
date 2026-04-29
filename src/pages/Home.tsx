import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../components/ui/button";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
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

const activeSchoolMarker = L.divIcon({
  className: 'custom-marker',
  html: `<div class="relative w-8 h-8 flex items-center justify-center"><span class="absolute inline-flex h-8 w-8 rounded-full bg-accent/60 animate-ping"></span><span class="relative w-8 h-8 bg-accent rounded-full border-4 border-white shadow-lg"></span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

function MapFlyToLocation({ target, zoomLevel = 5 }: { target: [number, number] | null; zoomLevel?: number }) {
  const map = useMap();
  const lastTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (!target) return;
    const key = `${target[0]}:${target[1]}:${zoomLevel}`;
    if (lastTargetRef.current === key) return;
    lastTargetRef.current = key;
    map.stop();
    map.flyTo(target, zoomLevel, { duration: 0.7 });
  }, [map, target, zoomLevel]);

  return null;
}

export function Home() {
  const [activeRate, setActiveRate] = useState<"single" | "group" | "club">("single");
  const [activeSchoolId, setActiveSchoolId] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [flippedCoachId, setFlippedCoachId] = useState<number | null>(null);
  const teamScrollRef = useRef<HTMLDivElement>(null);
  const ratesRef = useRef<HTMLDivElement>(null);
  const rateCardRef = useRef<HTMLDivElement>(null);
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
      country: t("home.map.ru.country"),
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80"
    },
    { 
      id: "srilanka", 
      title: t("home.map.sri.title"), 
      coords: [5.973, 80.428] as [number, number],
      intro: t("home.map.sri.intro"),
      country: t("home.map.sri.country"),
      image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=900&q=80"
    },
    { 
      id: "indo", 
      title: t("home.map.indo.title"), 
      coords: [-8.650, 115.130] as [number, number],
      intro: t("home.map.indo.intro"),
      country: t("home.map.indo.country"),
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80"
    }
  ];

  const ratesOrder: Array<"single" | "group" | "club"> = ["single", "group", "club"];

  const schoolRateData: Record<string, Record<"single" | "group" | "club", { price: string; benefits: string[] }>> = {
    russia: {
      single: { price: "8 500 ₽", benefits: ["Персональный план под ваш уровень", "Видео-разбор ключевых ошибок", "Максимум времени с тренером один на один"] },
      group: { price: "5 200 ₽", benefits: ["Мини-группа до 4 человек", "Безопасный прогресс и контроль техники", "Поддержка и мотивация от команды"] },
      club: { price: "32 000 ₽", benefits: ["Абонемент на 8 тренировок", "Приоритетная запись на удобное время", "Экономия по сравнению с разовыми занятиями"] }
    },
    srilanka: {
      single: { price: "$95", benefits: ["Индивидуальная сессия по текущему свеллу", "Фокус на технике и позиции на волне", "Быстрый рост с персональным фидбеком"] },
      group: { price: "$60", benefits: ["Группа до 4 человек с ISA-инструктором", "Сбалансированная программа для всех уровней", "Отработка ключевых элементов в потоке"] },
      club: { price: "$420", benefits: ["Недельный пакет из 7 сессий", "Ежедневный брифинг по спотам", "Оптимальный темп для уверенного прогресса"] }
    },
    indo: {
      single: { price: "$110", benefits: ["Точечная работа над маневрами", "Разбор чтения волны на спотах Canggu", "Индивидуальная стратегия прогресса"] },
      group: { price: "$70", benefits: ["Совместные сессии для друзей и пар", "Разбор каждого заезда с инструктором", "Комфортный темп и поддержка в воде"] },
      club: { price: "$480", benefits: ["Клубный пакет с сопровождением", "Трансфер до спотов включен", "Стабильный результат за курс"] }
    }
  };

  const activeSchool = locations.find((loc) => loc.id === activeSchoolId) ?? null;
  const activeSchoolRate = activeSchool ? schoolRateData[activeSchool.id][activeRate] : null;
  const mapFocusTarget =
    activeSchoolId === "indo" && activeSchool
      ? ([activeSchool.coords[0] + 2.2, activeSchool.coords[1] - 6.5] as [number, number])
      : activeSchool?.coords ?? null;
  const mapFocusZoom = activeSchoolId === "indo" ? 4 : 5;
  const coaches = [
    {
      id: 0,
      name: "Антон",
      role: t("home.team.role.head"),
      img: "/anton-coach-v2.png",
      imgPosition: "object-[center_24%]",
      experience: "12 лет",
      school: "Куршская коса",
      country: "Россия",
      speciality: "Точная постановка базы и быстрый выход на уверенное катание."
    },
    {
      id: 1,
      name: "Марина",
      role: t("home.team.role.yoga"),
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      experience: "9 лет",
      school: "Бухта Велигама",
      country: "Шри-Ланка",
      speciality: "Мягкая техника, дыхание и контроль баланса в каждом проезде."
    },
    {
      id: 2,
      name: "Кристиан",
      role: t("home.team.role.longboard"),
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      experience: "11 лет",
      school: "Куршская коса",
      country: "Россия",
      speciality: "Стильный лонгборд, тайминг и чистые маневры на линии волны."
    },
    {
      id: 3,
      name: "Алекс",
      role: t("home.team.role.shortboard", "SHORTBOARD"),
      img: "https://images.unsplash.com/photo-1533000787361-9c1cd3cb15bf?auto=format&fit=crop&w=800&q=80",
      experience: "10 лет",
      school: "Эко-Бич, Чангу",
      country: "Индонезия",
      speciality: "Переход на шортборд, работа с секцией и агрессивные развороты."
    },
    {
      id: 4,
      name: "Лена",
      role: t("home.team.role.beginner", "BEGINNER COACH"),
      img: "https://images.unsplash.com/photo-1530669212001-f1eb9c0b11fd?auto=format&fit=crop&w=800&q=80",
      experience: "8 лет",
      school: "Бухта Велигама",
      country: "Шри-Ланка",
      speciality: "Комфортный старт для новичков и уверенность уже с первого занятия."
    }
  ];

  const scrollToRatesCentered = () => {
    const ratesElement = document.getElementById("rates");
    if (!ratesElement) return;

    const rect = ratesElement.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const targetTop = window.scrollY + rect.top - Math.max((viewportHeight - sectionHeight) / 2, 0);

    window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
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
              onClick={scrollToRatesCentered}
            >
              {t("home.hero.button")}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gradient-to-b from-sand via-white to-sand px-6 md:px-12 py-20 md:py-28 rounded-t-[28px] md:rounded-t-[40px]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-8 text-accent scale-[1.5]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1S7 6.5 8 6a6.1 6.1 0 0 1 8 0c1 .5 1.5 1 2.5 1s2-.5 2.5-1"/><path d="M2 12c.6.5 1.2 1 2.5 1S7 12.5 8 12a6.1 6.1 0 0 1 8 0c1 .5 1.5 1 2.5 1s2-.5 2.5-1"/><path d="M2 18c.6.5 1.2 1 2.5 1S7 18.5 8 18a6.1 6.1 0 0 1 8 0c1 .5 1.5 1 2.5 1s2-.5 2.5-1"/></svg>
              </div>
              <h3 className="tracking-wide font-medium text-[22px] md:text-[24px] mb-6">{t("home.features.item1.title")}</h3>
              <p className="text-[14px] leading-[1.6] opacity-80 max-w-sm mx-auto">{t("home.features.item1.desc")}</p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-8 text-accent scale-[1.5]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="tracking-wide font-medium text-[22px] md:text-[24px] mb-6">{t("home.features.item2.title")}</h3>
              <p className="text-[14px] leading-[1.6] opacity-80 max-w-sm mx-auto">{t("home.features.item2.desc")}</p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.3 }} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-8 text-accent scale-[1.5]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              </div>
              <h3 className="tracking-wide font-medium text-[22px] md:text-[24px] mb-6">{t("home.features.item3.title")}</h3>
              <p className="text-[14px] leading-[1.6] opacity-80 max-w-sm mx-auto">{t("home.features.item3.desc")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rates Section */}
      <section id="rates" ref={ratesRef} className="w-full py-20 md:py-24 px-6 md:px-12 border-y border-primary/10 relative overflow-hidden bg-[#07131d] text-white">
        {/* Active background layer */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            style={{ y: backgroundY }}
            className="absolute inset-0 w-full h-[120%] -top-[10%]"
          >
            <div className="w-full h-full brightness-[0.9] contrast-125 saturate-150">
              {typeof window !== 'undefined' && (
                <MapContainer 
                  center={[20.0, 65.0]}
                  zoom={3}
                  scrollWheelZoom={false}
                  dragging={true}
                  touchZoom={true}
                  zoomControl={false}
                  attributionControl={false}
                  worldCopyJump={true}
                  maxBounds={[[-85, -180], [85, 180]]}
                  maxBoundsViscosity={0.7}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                >
                  <MapFlyToLocation target={mapFocusTarget} zoomLevel={mapFocusZoom} />
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                  />
                  {locations.map((loc) => (
                    <Marker 
                      key={loc.id} 
                      position={loc.coords} 
                      icon={activeSchoolId === loc.id ? activeSchoolMarker : schoolMarker}
                      eventHandlers={{ click: () => setActiveSchoolId(loc.id) }}
                    />
                  ))}
                </MapContainer>
              )}
            </div>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.24),transparent_38%),linear-gradient(135deg,rgba(3,17,28,0.08),rgba(3,17,28,0.34)_58%,rgba(3,17,28,0.52))]"></div>
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(7,19,29,0.1)_0%,rgba(7,19,29,0.2)_18%,rgba(7,19,29,0.08)_58%,rgba(7,19,29,0.42)_100%)]"></div>
            <div className="absolute inset-x-0 top-0 h-[14%] pointer-events-none bg-gradient-to-b from-[#07131d] to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-[16%] pointer-events-none bg-gradient-to-t from-[#07131d] to-transparent"></div>
          </motion.div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22%3E%3Cg fill=%22none%22 fill-opacity=%220.16%22%3E%3Cpath d=%22M0 0h60v60H0z%22/%3E%3Cpath d=%22M0 60L60 0%22 stroke=%23ffffff stroke-width=%221%22/%3E%3C/g%3E%3C/svg%3E')] opacity-[0.12] mix-blend-overlay pointer-events-none"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 pointer-events-none">
          <div className="min-h-[320px] relative pointer-events-none">
            <motion.div
              ref={rateCardRef}
              key={`${activeSchoolId ?? "none"}-${activeRate}`}
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0 }}
              className={`pointer-events-auto w-full md:w-[400px] bg-white text-primary shadow-2xl border border-primary/10 overflow-hidden transition-all duration-500 ${
                activeSchool ? "rounded-[20px] min-h-[470px]" : "rounded-[12px] p-6 md:p-7"
              }`}
            >
              {activeSchool && activeSchoolRate ? (
                <div className="relative h-full flex flex-col">
                  <div className="h-[145px] overflow-hidden">
                    <img
                      src={activeSchool.image}
                      alt={activeSchool.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 md:p-7 relative flex-1 flex flex-col">
                    <div className="pr-12 mb-5 pb-4 border-b border-primary/10 relative">
                      <div className="text-[10px] uppercase tracking-[2px] font-semibold text-primary/50 mb-1">
                        {activeSchool.country}
                      </div>
                      <div className="text-[24px] font-light leading-tight mb-1">{activeSchool.title}</div>
                      <button
                        onClick={() => {
                          const currentSchoolIndex = locations.findIndex((loc) => loc.id === activeSchool.id);
                          const nextSchool = locations[(currentSchoolIndex + 1) % locations.length];
                          setActiveSchoolId(nextSchool.id);
                        }}
                        className="absolute right-0 top-[38px] -translate-y-1/2 text-primary/70 hover:text-primary transition-colors"
                        aria-label="Следующая школа"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                      <div className="text-[10px] uppercase tracking-[1.2px] text-primary/35">
                        {activeSchool.coords[0].toFixed(3)}° {activeSchool.coords[0] >= 0 ? "N" : "S"}, {activeSchool.coords[1].toFixed(3)}° {activeSchool.coords[1] >= 0 ? "E" : "W"}
                      </div>
                    </div>

                    <div className="pr-12">
                      <h3 className="text-[30px] font-light leading-tight mb-2">{t(`home.rates.${activeRate}.title`)}</h3>
                      <div className="text-[36px] font-semibold text-accent mb-4 leading-none">{activeSchoolRate.price}</div>
                      <ul className="space-y-2 mb-6">
                        {activeSchoolRate.benefits.map((benefit, index) => (
                          <li key={index} className="text-[14px] leading-relaxed text-primary/80 flex items-start gap-2">
                            <span className="mt-[8px] h-[4px] w-[4px] rounded-full bg-accent shrink-0"></span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full h-12 mt-auto transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] active:shadow-inner"
                      onClick={() => setIsBookingOpen(true)}
                    >
                      ЗАПИСАТЬСЯ
                    </Button>
                    <button
                      onClick={() => {
                        const currentIndex = ratesOrder.indexOf(activeRate);
                        const nextRate = ratesOrder[(currentIndex + 1) % ratesOrder.length];
                        setActiveRate(nextRate);
                      }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/70 hover:text-primary transition-colors"
                      aria-label="Следующий тариф"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-[24px] font-light leading-tight mb-2">{t("home.rates.title")}</h3>
                  <p className="text-[14px] leading-relaxed text-primary/70">
                    Нажмите на оранжевую метку школы на карте, чтобы увидеть тариф, цену и особенности.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
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
            {coaches.map((coach, i) => (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                key={coach.id} 
                className="shrink-0 w-[280px] md:w-[350px] flex flex-col relative aspect-[3/4]"
              >
                <motion.button
                  type="button"
                  onClick={() => setFlippedCoachId(flippedCoachId === coach.id ? null : coach.id)}
                  className="w-full h-full rounded-[12px] overflow-hidden bg-primary/10 relative cursor-pointer text-left"
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{ y: flippedCoachId === coach.id ? "-100%" : "0%" }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.img 
                      whileHover={{ scale: flippedCoachId === coach.id ? 1 : 1.05 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      src={coach.img} 
                      alt={coach.name} 
                      className={`w-full h-full object-cover ${coach.imgPosition ?? "object-center"}`}
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white z-10">
                      <div className="text-[20px] font-medium tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{coach.name}</div>
                      <div className="text-[11px] text-white/85 mt-1 uppercase tracking-[1.5px]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                        {coach.role}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 bg-white text-primary p-6 md:p-7 flex flex-col"
                    initial={{ y: "100%" }}
                    animate={{ y: flippedCoachId === coach.id ? "0%" : "100%" }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="text-[10px] uppercase tracking-[2px] font-semibold text-primary/50 mb-1">Тренер</div>
                    <div className="text-[24px] font-light leading-tight mb-1">{coach.name}</div>
                    <div className="text-[11px] uppercase tracking-[1.3px] text-primary/45 mb-4">{coach.role}</div>
                    <div className="border-b border-primary/10 mb-4"></div>
                    <div className="space-y-3 text-[14px] text-primary/85">
                      <div><span className="text-primary/50">Стаж:</span> {coach.experience}</div>
                      <div><span className="text-primary/50">Школа:</span> {coach.school}, {coach.country}</div>
                      <div><span className="text-primary/50">Особенность:</span> {coach.speciality}</div>
                    </div>
                    <div className="mt-auto pt-5 text-[10px] uppercase tracking-[1.8px] text-primary/40 text-center">
                      Нажмите карточку, чтобы закрыть
                    </div>
                  </motion.div>
                </motion.button>
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
