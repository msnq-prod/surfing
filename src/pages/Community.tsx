import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";

export function Community() {
  const { t } = useLanguage();
  
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
          <p className="text-[14px] leading-[1.6] opacity-60 max-w-xl">
            {t("comm.desc2")}
          </p>
        </motion.div>
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
    </div>
  );
}
