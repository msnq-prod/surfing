import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { ShoppingBag, Plus, Minus } from "lucide-react";

export function Store() {
  const { t } = useLanguage();
  const [cart, setCart] = useState<Record<number, number>>({});
  
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

  const cartCount = Object.keys(cart).reduce((sum, id) => sum + (cart[Number(id)] || 0), 0);
  
  const totalPrice = Object.keys(cart).reduce((sum, id) => {
    const product = products.find(p => p.id === Number(id));
    if (product) {
      const priceString = typeof product.price === 'string' ? product.price : String(product.price);
      const priceValue = parseInt(priceString.replace(/\D/g, '')) || 0;
      return sum + (priceValue * (cart[Number(id)] || 0));
    }
    return sum;
  }, 0);

  const addToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const newCount = (prev[id] || 0) - 1;
      if (newCount <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: newCount };
    });
  };
  
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

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
            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
              {cart[product.id] ? (
                <div className="flex items-center justify-between w-full h-[36px] border border-primary/10 rounded-[4px] bg-white overflow-hidden">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFromCart(product.id); }}
                    className="w-10 h-full flex items-center justify-center hover:bg-primary/5 transition-colors border-r border-primary/10"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-mono text-[13px] font-medium">{cart[product.id]}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
                    className="w-10 h-full flex items-center justify-center hover:bg-primary/5 transition-colors border-l border-primary/10"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
                >
                  {t("store.btn.cart")}
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <motion.button
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="bg-accent text-white rounded-full shadow-2xl flex items-center h-16 relative overflow-hidden transition-all duration-300 ease-out pl-6 pr-5"
            >
              <div className="flex items-center">
                <motion.span
                  variants={{
                    rest: { width: 0, opacity: 0, marginRight: 0 },
                    hover: { width: "auto", opacity: 1, marginRight: 12 }
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="font-mono text-[15px] font-bold whitespace-nowrap overflow-hidden"
                >
                  {totalPrice.toLocaleString()} ₽
                </motion.span>
                <div className="relative">
                  <ShoppingBag size={24} />
                  <span className="absolute -top-3 -right-3 bg-white text-accent w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center border border-accent">
                    {cartCount}
                  </span>
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="mt-32 p-12 border border-primary/10 rounded-[4px] flex flex-col items-center text-center bg-white"
      >
        <span className="text-accent text-[10px] uppercase tracking-[3px] font-semibold mb-[15px]">{t("store.booking.subtitle")}</span>
        <h2 className="text-[32px] font-light mb-[20px] leading-none">{t("store.booking.title")}</h2>
        <p className="text-[14px] leading-[1.6] opacity-80 max-w-sm mb-[30px]">
          {t("store.booking.desc")}
        </p>
        <Link to="/?rate=club#rates">
          <Button variant="secondary">{t("store.booking.btn")}</Button>
        </Link>
      </motion.div>
    </div>
  );
}
