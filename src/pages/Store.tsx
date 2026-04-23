import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";

export function Store() {
  const { t } = useLanguage();
  
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const products = [
    {
      id: 1,
      name: t("store.item1.name"),
      price: "8 500 ₽",
      category: t("store.cat.apparel"),
      img: "https://images.unsplash.com/photo-1556821840-0a53f6630d0e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      name: t("store.item2.name"),
      price: "3 200 ₽",
      category: t("store.cat.acc"),
      img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      name: t("store.item3.name"),
      price: "6 000 ₽",
      category: t("store.cat.gear"),
      img: "https://images.unsplash.com/photo-1596760562657-1fbaf064fb9b?auto=format&fit=crop&w=800&q=80" 
    },
    {
      id: 4,
      name: t("store.item4.name"),
      price: "1 500 ₽",
      category: t("store.cat.care"),
      img: "https://images.unsplash.com/photo-1608248593842-8021c64fd0bb?auto=format&fit=crop&w=800&q=80" 
    },
    {
      id: 5,
      name: t("store.item5.name"),
      price: "2 500 ₽",
      category: t("store.cat.acc"),
      img: "https://images.unsplash.com/photo-1597561483017-da96e579ed3a?auto=format&fit=crop&w=800&q=80" 
    },
    {
      id: 6,
      name: t("store.item6.name"),
      price: t("store.item6.price"),
      category: t("store.cat.services"),
      img: "https://images.unsplash.com/photo-1544377193-33dce4f2c522?auto=format&fit=crop&w=800&q=80" 
    }
  ];

  return (
    <div className="flex flex-col w-full px-6 md:px-[40px] py-[40px] max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-[40px] pb-[40px] border-b border-primary/10">
        <h1 className="text-[48px] font-light leading-none mb-[20px]">
          {t("store.title")}
        </h1>
        <p className="text-[14px] leading-[1.6] opacity-80 max-w-xl">
          {t("store.desc")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 bg-sand md:grid-cols-3 gap-[2px] bg-primary/10 border-x border-b border-primary/10">
        {products.map((product, i) => (
          <motion.div 
            key={product.id}
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer flex flex-col p-6 bg-sand hover:bg-white transition-colors border-t border-primary/10"
          >
            <div className="aspect-square rounded-[4px] overflow-hidden mb-6 bg-primary/5 p-4 flex items-center justify-center">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex justify-between items-start mb-2 gap-4">
              <h3 className="text-[14px] font-semibold">{product.name}</h3>
              <span className="font-mono text-[12px] opacity-80 whitespace-nowrap">{product.price}</span>
            </div>
            <p className="text-[11px] opacity-50 uppercase tracking-[1px] mb-6">{product.category}</p>
            <Button variant="outline" size="sm" className="w-full mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
              {t("store.btn.cart")}
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="mt-32 p-12 border border-primary/10 rounded-[4px] flex flex-col items-center text-center bg-white"
      >
        <span className="text-accent text-[10px] uppercase tracking-[3px] font-semibold mb-[15px]">{t("store.booking.subtitle")}</span>
        <h2 className="text-[32px] font-light mb-[20px] leading-none">{t("store.booking.title")}</h2>
        <p className="text-[14px] leading-[1.6] opacity-80 max-w-sm mb-[30px]">
          {t("store.booking.desc")}
        </p>
        <Button variant="secondary">{t("store.booking.btn")}</Button>
      </motion.div>
    </div>
  );
}
