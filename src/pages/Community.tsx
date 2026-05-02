import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { BookingModal } from "../components/BookingModal";

export function Community() {
  const { t } = useLanguage();
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const [activeDateIndex, setActiveDateIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const images = [
    "https://images.unsplash.com/photo-1516584283842-835697d810b4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533560904424-a0c6a8f10815?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518331302834-08eb72fb9b5a?auto=format&fit=crop&w=800&q=80"
  ];

  const events = [
    {
      id: 1,
      title: "Серф-кемп Шри-Ланка на майские",
      cardDate: "1-10 мая",
      groupSize: "12 человек",
      price: "129 000 ₽",
      cover: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=80",
      schedules: [
        {
          date: "1-10 мая",
          price: "129 000 ₽",
          seatsLeft: 4,
          durationDays: 10,
          description:
            "Самый насыщенный поток: больше практики в воде и плотные вечерние разборы. Идеально для уверенного старта в серфинге.",
          included: [
            "Трансфер аэропорт - лагерь - аэропорт",
            "6 дней серфа с тренером и 2 дня свободного катания",
            "Лекция по серфингу и чтению прогноза",
            "Прокат снаряжения на время программы",
            "Страховка на время уроков",
            "Фото и видео материалы с воды",
            "Костер на пляже и вечер серф-кино"
          ]
        },
        {
          date: "12-19 июня",
          price: "124 000 ₽",
          seatsLeft: 6,
          durationDays: 8,
          description:
            "Более спокойный темп: меньше участников на споте и больше персональных подсказок от тренера в каждой сессии.",
          included: [
            "Трансфер аэропорт - лагерь - аэропорт",
            "5 дней серфа с тренером и 2 дня свободного катания",
            "Лекция по серфингу и чтению прогноза",
            "Прокат снаряжения на время программы",
            "Страховка на время уроков",
            "Фото и видео материалы с воды",
            "Костер на пляже и вечер серф-кино"
          ]
        },
        {
          date: "21-30 июля",
          price: "132 000 ₽",
          seatsLeft: 3,
          durationDays: 10,
          description:
            "Пик сезона и сильное комьюнити: больше совместных активностей, выездов и практики при стабильном свелле.",
          included: [
            "Трансфер аэропорт - лагерь - аэропорт",
            "6 дней серфа с тренером и 2 дня свободного катания",
            "Лекция по серфингу и чтению прогноза",
            "Прокат снаряжения на время программы",
            "Страховка на время уроков",
            "Фото и видео материалы с воды",
            "Костер на пляже и вечер серф-кино"
          ]
        }
      ],
      beginner: true,
      gallery: [
        "https://images.unsplash.com/photo-1533560904424-a0c6a8f10815?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1518331302834-08eb72fb9b5a?auto=format&fit=crop&w=900&q=80"
      ]
    },
    {
      id: 2,
      title: "Бали: прогресс-кэмп в Чангу",
      cardDate: "12-19 июня",
      groupSize: "10 человек",
      price: "149 000 ₽",
      cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      schedules: [
        {
          date: "12-19 июня",
          price: "149 000 ₽",
          seatsLeft: 5,
          durationDays: 8,
          description:
            "Фокус на прогресс: работаем над маневрами и контролем скорости, ежедневно закрепляя навыки в воде.",
          included: [
            "Трансфер внутри программы по спотам",
            "5 дней серфа с тренером и 2 дня практики",
            "Разбор видео после каждой сессии",
            "Прокат снаряжения и лайкры",
            "Страховка на время занятий",
            "Пакет фото/видео с кэмпа",
            "Нетворкинг-вечер и серф-кино"
          ]
        },
        {
          date: "21-30 июля",
          price: "156 000 ₽",
          seatsLeft: 2,
          durationDays: 10,
          description:
            "Летний интенсив в высокий сезон: больше каталки, больше спотов и глубже работа над техникой.",
          included: [
            "Трансфер внутри программы по спотам",
            "6 дней серфа с тренером и 2 дня практики",
            "Разбор видео после каждой сессии",
            "Прокат снаряжения и лайкры",
            "Страховка на время занятий",
            "Пакет фото/видео с кэмпа",
            "Нетворкинг-вечер и серф-кино"
          ]
        },
        {
          date: "5-14 сентября",
          price: "143 000 ₽",
          seatsLeft: 7,
          durationDays: 9,
          description:
            "Комфортный поток межсезонья: меньше людей на лайнапе и больше индивидуального внимания в каждой сессии.",
          included: [
            "Трансфер внутри программы по спотам",
            "5 дней серфа с тренером и 2 дня практики",
            "Разбор видео после каждой сессии",
            "Прокат снаряжения и лайкры",
            "Страховка на время занятий",
            "Пакет фото/видео с кэмпа",
            "Нетворкинг-вечер и серф-кино"
          ]
        }
      ],
      beginner: true,
      gallery: [
        "https://images.unsplash.com/photo-1516584283842-835697d810b4?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1517495306984-f84210f9daa8?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=900&q=80"
      ]
    },
    {
      id: 3,
      title: "Балтика уикенд: Куршская коса",
      cardDate: "21-30 июля",
      groupSize: "8 человек",
      price: "79 000 ₽",
      cover: "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=1400&q=80",
      schedules: [
        {
          date: "21-30 июля",
          price: "79 000 ₽",
          seatsLeft: 3,
          durationDays: 7,
          description:
            "Классический северный формат с мягким входом в океан: баланс практики, теории и восстановления.",
          included: [
            "Трансфер по программе и до спотов",
            "4 дня серфа с тренером и 2 дня самостоятельной практики",
            "Воркшоп по технике и безопасности",
            "Прокат снаряжения",
            "Страховка на время серф-сессий",
            "Фото и видео материалы",
            "Вечер у костра и просмотр серф-фильма"
          ]
        },
        {
          date: "10-17 августа",
          price: "84 000 ₽",
          seatsLeft: 5,
          durationDays: 8,
          description:
            "Расширенный формат с дополнительным днем в воде и углубленным разбором техники по видео.",
          included: [
            "Трансфер по программе и до спотов",
            "5 дней серфа с тренером и 2 дня самостоятельной практики",
            "Воркшоп по технике и безопасности",
            "Прокат снаряжения",
            "Страховка на время серф-сессий",
            "Фото и видео материалы",
            "Вечер у костра и просмотр серф-фильма"
          ]
        },
        {
          date: "1-8 сентября",
          price: "76 000 ₽",
          seatsLeft: 6,
          durationDays: 7,
          description:
            "Бархатный сезон: спокойный ритм, меньше людей на спотах и комфортные условия для новичков.",
          included: [
            "Трансфер по программе и до спотов",
            "4 дня серфа с тренером и 2 дня самостоятельной практики",
            "Воркшоп по технике и безопасности",
            "Прокат снаряжения",
            "Страховка на время серф-сессий",
            "Фото и видео материалы",
            "Вечер у костра и просмотр серф-фильма"
          ]
        }
      ],
      beginner: true,
      gallery: [
        "https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1483168527879-c66136b56105?auto=format&fit=crop&w=900&q=80"
      ]
    },
    {
      id: 4,
      title: "Экстрим-кэмп Португалия: большие волны",
      cardDate: "3-12 октября",
      groupSize: "6 человек",
      price: "189 000 ₽",
      cover: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=80",
      schedules: [
        {
          date: "3-12 октября",
          price: "189 000 ₽",
          seatsLeft: 2,
          durationDays: 10,
          description:
            "Продвинутый интенсив для уверенных райдеров: работа на мощных спотах, тайминг в критических секциях и контроль скорости на больших волнах.",
          included: [
            "Трансфер по программе до спотов",
            "7 дней серфа с тренером и 1 день самостоятельной практики",
            "Разбор техники и тактики для больших волн",
            "Прокат специализированного снаряжения",
            "Страховка на время уроков",
            "Персональные видео-разборы",
            "Вечер тактического серф-кино"
          ]
        },
        {
          date: "16-25 ноября",
          price: "179 000 ₽",
          seatsLeft: 4,
          durationDays: 10,
          description:
            "Осенний поток с акцентом на технику take-off и безопасную работу в более сложных условиях океана.",
          included: [
            "Трансфер по программе до спотов",
            "6 дней серфа с тренером и 2 дня самостоятельной практики",
            "Разбор техники и тактики для больших волн",
            "Прокат специализированного снаряжения",
            "Страховка на время уроков",
            "Персональные видео-разборы",
            "Вечер тактического серф-кино"
          ]
        },
        {
          date: "8-17 декабря",
          price: "185 000 ₽",
          seatsLeft: 3,
          durationDays: 10,
          description:
            "Зимний экстрим-поток для прокачки уверенности на больших волнах и подготовки к самостоятельным трипам.",
          included: [
            "Трансфер по программе до спотов",
            "7 дней серфа с тренером и 1 день самостоятельной практики",
            "Разбор техники и тактики для больших волн",
            "Прокат специализированного снаряжения",
            "Страховка на время уроков",
            "Персональные видео-разборы",
            "Вечер тактического серф-кино"
          ]
        }
      ],
      beginner: false,
      gallery: [
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=900&q=80"
      ]
    }
  ];

  const activeEvent = events.find((event) => event.id === activeEventId) ?? null;
  const activeSchedule = activeEvent ? activeEvent.schedules[activeDateIndex] : null;
  const activeEventDate = activeSchedule ? activeSchedule.date : "";

  const openEventDetails = (eventId: number) => {
    setActiveEventId(eventId);
    setActiveDateIndex(0);
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Intro Section */}
      <section className="px-6 md:px-[40px] pt-12 md:pt-24 pb-16 max-w-4xl">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="text-[11px] uppercase tracking-[3px] mb-[20px] text-accent font-semibold">{t("comm.subtitle")}</div>
          <h1 className="text-[40px] md:text-[64px] leading-none mb-[30px] font-light whitespace-pre-line">
            {t("comm.title")}
          </h1>
          <p className="text-[16px] md:text-[18px] leading-[1.6] opacity-80 mb-6 max-w-2xl">
            {t("comm.desc1")}
          </p>
        </motion.div>
      </section>

      {/* Events Section */}
      <section className="px-6 md:px-[40px] mb-20">
        <div className="relative max-w-7xl mx-auto">
          <div ref={eventsScrollRef} className="flex overflow-hidden gap-4 md:gap-6 no-scrollbar pb-2">
          {events.map((event) => (
            <motion.div
              key={event.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="shrink-0 w-[300px] md:w-[360px] relative overflow-hidden rounded-[14px] border border-primary/10 min-h-[420px] group"
            >
              <img
                src={event.cover}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20"></div>
              <div className="relative z-10 h-full p-6 text-white flex flex-col">
                <div className="space-y-1.5">
                  <h3 className="text-[24px] font-light leading-tight max-w-[280px]">{event.title}</h3>
                  <p className="text-[13px] opacity-90">Даты: {event.cardDate}</p>
                  <p className="text-[13px] opacity-90">Группа: {event.groupSize}</p>
                  <p className="text-[20px] font-medium pt-1">{event.price}</p>
                </div>
                <Button
                  variant="outline"
                  className="mt-auto w-full bg-white/10 border-white/35 text-white hover:bg-white hover:text-primary"
                  onClick={() => openEventDetails(event.id)}
                >
                  Подробнее
                </Button>
              </div>
            </motion.div>
          ))}
          </div>
          <button
            onClick={() => {
              if (eventsScrollRef.current) {
                eventsScrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
              }
            }}
            className="absolute -left-2 md:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-primary transition-all duration-300 z-10 hover:scale-110"
            aria-label="Предыдущее событие"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={() => {
              if (eventsScrollRef.current) {
                const scrollWidth = eventsScrollRef.current.scrollWidth;
                const scrollLeft = eventsScrollRef.current.scrollLeft;
                const clientWidth = eventsScrollRef.current.clientWidth;
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                  eventsScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                  eventsScrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
                }
              }
            }}
            className="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-primary transition-all duration-300 z-10 hover:scale-110"
            aria-label="Следующее событие"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="px-6 md:px-[40px] mb-24">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4"
        >
          {images.map((img, i) => (
            <motion.div 
              key={i} 
              variants={fadeUp}
              className={`relative overflow-hidden group ${i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square md:aspect-[4/5]'}`}
            >
              <img 
                src={img} 
                alt="Серф комьюнити МЫС" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Social Links Section */}
      <section className="px-6 md:px-[40px]">
        <div className="bg-white p-8 md:p-16 border border-primary/10 flex flex-col md:flex-row gap-12 items-center justify-between">
          <div className="max-w-xl">
            <h2 className="text-[32px] font-light mb-4">{t("comm.chat.title")}</h2>
            <p className="text-[14px] opacity-70 mb-0">
              {t("comm.chat.desc")}
            </p>
          </div>
          <div className="flex flex-col w-full md:w-auto gap-3 shrink-0">
            <Button variant="outline" className="w-full justify-between h-12 px-6" onClick={() => window.open('https://t.me/telegram', '_blank')}>
              <span>{t("comm.chat.btn1")}</span>
              <span className="opacity-50 text-[10px]">TG</span>
            </Button>
            <Button variant="outline" className="w-full justify-between h-12 px-6" onClick={() => window.open('https://t.me/telegram', '_blank')}>
              <span>{t("comm.chat.btn2")}</span>
              <span className="opacity-50 text-[10px]">TG</span>
            </Button>
            <Button variant="default" className="w-full justify-between h-12 px-6 bg-accent hover:bg-accent/90 text-white" onClick={() => window.open('https://vk.com', '_blank')}>
              <span>{t("comm.chat.btn3")}</span>
              <span className="opacity-80 text-[10px]">VK</span>
            </Button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeEvent && (
          <div className="fixed inset-0 z-[110] p-6 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 bg-primary/45 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveEventId(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl bg-white rounded-[14px] p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveEventId(null)}
                className="absolute right-5 top-5 text-primary/50 hover:text-primary transition-colors"
                aria-label="Закрыть"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>

              <div className="pr-10">
                <h3 className="text-[28px] md:text-[36px] font-light leading-tight mb-5">{activeEvent.title}</h3>

                <div className="flex flex-wrap gap-2 mb-5">
                  {activeEvent.schedules.map((schedule, idx) => (
                    <button
                      key={schedule.date}
                      onClick={() => setActiveDateIndex(idx)}
                      className={`px-4 py-2 rounded-full border text-[13px] transition-colors ${
                        idx === activeDateIndex
                          ? "bg-accent border-accent text-white"
                          : "border-primary/20 text-primary/75 hover:border-primary/40"
                      }`}
                    >
                      {schedule.date}
                    </button>
                  ))}
                </div>

                <div className="text-[13px] text-primary/75 border-l-2 border-accent pl-3 mb-4">
                  {activeEvent.beginner ? "Формат подходит для новичков" : "Формат для продвинутого уровня"}
                </div>

                <p className="text-[14px] leading-[1.6] opacity-80 mb-4">{activeSchedule?.description}</p>
                <p className="text-[14px] font-medium mb-4">Длительность: {activeSchedule?.durationDays} дней</p>

                <h4 className="text-[14px] uppercase tracking-[1px] opacity-60 mb-2">Включено</h4>
                <ul className="space-y-2 mb-6">
                  {activeSchedule?.included.map((item) => (
                    <li key={item} className="text-[14px] leading-[1.5] opacity-85 flex items-start gap-2">
                      <span className="mt-[8px] h-[5px] w-[5px] rounded-full bg-accent shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  {activeEvent.gallery.map((img) => (
                    <img
                      key={img}
                      src={img}
                      alt="Фото с кэмпа"
                      className="w-full h-[120px] object-cover rounded-[8px]"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2 border-t border-primary/10">
                  <div>
                    <div className="text-[28px] font-medium text-accent">{activeSchedule?.price}</div>
                    <div className="text-[12px] opacity-60">{activeEventDate}: свободно {activeSchedule?.seatsLeft} мест</div>
                  </div>
                  <Button
                    className="h-12 px-8 bg-accent hover:bg-accent/90"
                    onClick={() => setIsBookingOpen(true)}
                  >
                    Записаться
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        rateName={activeEvent ? `${activeEvent.title} • ${activeEventDate}` : undefined}
      />
    </div>
  );
}
