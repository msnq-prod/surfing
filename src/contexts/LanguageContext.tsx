import React, { createContext, useContext, useState } from 'react';

type Language = 'RU' | 'EN';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Layout
  "nav.school": { RU: "Школа", EN: "School" },
  "nav.community": { RU: "Комьюнити", EN: "Community" },
  "nav.store": { RU: "Магазин", EN: "Store" },
  "footer.contact": { RU: "Связь", EN: "Contact" },
  "footer.social": { RU: "Соцсети", EN: "Socials" },
  "footer.support": { RU: "Поддержка", EN: "Support" },
  "footer.locations.title": { RU: "Локации", EN: "Locations" },
  "footer.locations.list": { RU: "Зеленоградск, Шри-Ланка, Бали", EN: "Zelenogradsk, Sri Lanka, Bali" },
  "footer.email": { RU: "info@mysserf.com", EN: "info@mysserf.com" },
  "footer.rights": { RU: "© 2026 Школа «МЫС»\nЛицензия №12-445", EN: "© 2026 MYS School\nLicense №12-445" },
  "footer.design": { RU: "Дизайн и разработка", EN: "Design and Development" },

  // Home page
  "home.hero.intro": { RU: "Осознанный гедонизм", EN: "Conscious hedonism" },
  "home.hero.title": { RU: "Твоя\nАкадемия\nсерфинга", EN: "Your\nSurf\nAcademy" },
  "home.hero.desc": { RU: "Пространство для тех, кто ищет баланс между спортом и глубоким расслаблением. Мы учим чувствовать море, а не просто покорять его.", EN: "A space for those seeking balance between sport and deep relaxation. We teach to feel the sea, not just conquer it." },
  "home.hero.button": { RU: "Выбрать курс", EN: "Choose a course" },
  "home.hero.loc": { RU: "Локация: Мыс Фиолент", EN: "Location: Cape Fiolent" },
  "home.hero.time": { RU: "Сентябрьский рассвет, 6:14 AM", EN: "September dawn, 6:14 AM" },
  
  "home.features.subtitle": { RU: "Ценности", EN: "Values" },
  "home.features.item1.title": { RU: "Опыт", EN: "Experience" },
  "home.features.item1.desc": { RU: "Сертифицированные ISA наставники с опытом катания и преподавания более 10 лет.", EN: "ISA certified mentors with over 10 years of surfing and teaching experience." },
  "home.features.item2.title": { RU: "Фокус", EN: "Focus" },
  "home.features.item2.desc": { RU: "Мини-группы до 4 человек для индивидуального подхода и безопасного прогресса.", EN: "Small groups of up to 4 people for an individual approach and safe progress." },
  "home.features.item3.title": { RU: "Доверие сообщества", EN: "Community trust" },
  "home.features.item3.desc": { RU: "Более 1000 положительных отзывов и сотни постоянных клиентов, которые возвращаются к нам сезон за сезоном.", EN: "More than 1,000 positive reviews and hundreds of returning clients who come back season after season." },

  "home.team.title": { RU: "Наша Команда", EN: "Our Team" },
  "home.team.role.head": { RU: "Главный тренер", EN: "Head Coach" },
  "home.team.role.yoga": { RU: "Йога-серф", EN: "Yoga-surf" },
  "home.team.role.longboard": { RU: "Лонгборд", EN: "Longboard" },

  "home.classes.subtitle": { RU: "Наш мерч", EN: "Our merch" },
  "home.classes.title": { RU: "Эстетика серфинга в каждой детали", EN: "Surf aesthetics in every detail" },
  "home.classes.desc": { RU: "Мы создаем вещи, которые приятно носить как в океане, так и в городе. Качественные ткани, минималистичный дизайн и дух свободы в каждом шве. От технологичных лайкр до уютных худи для закатных посиделок.", EN: "We create things that are pleasant to wear both in the ocean and in the city. Quality fabrics, minimalist design, and the spirit of freedom in every stitch. From tech rashguards to cozy hoodies for sunset hangouts." },
  "home.classes.button": { RU: "Перейти в магазин", EN: "Go to store" },
  
  "home.rates.title": { RU: "Тарифы", EN: "Rates" },
  "home.rates.single.title": { RU: "Одиночный", EN: "Single" },
  "home.rates.group.title": { RU: "Групповой", EN: "Group" },
  "home.rates.club.title": { RU: "Клубный", EN: "Club" },
  "home.rates.single.desc": { RU: "Индивидуальное занятие с тренером. Полное внимание к вашей технике, разбор ошибок и быстрый прогресс.", EN: "Private lesson with a coach. Full attention to your technique, error analysis, and fast progress." },
  "home.rates.group.desc": { RU: "Занятие в мини-группе до 4 человек. Веселая атмосфера, новые знакомства и поддержка единомышленников.", EN: "Mini-group lesson up to 4 people. Fun atmosphere, new acquaintances, and support from like-minded people." },
  "home.rates.club.desc": { RU: "Безлимитный доступ к оборудованию, участие в закрытых мероприятиях и скидки на все выезды школы.", EN: "Unlimited equipment access, participation in private events, and discounts on all school trips." },
  "home.rates.single.price": { RU: "5 500 ₽", EN: "5 500 ₽" },
  "home.rates.group.price": { RU: "3 500 ₽", EN: "3 500 ₽" },
  "home.rates.club.price": { RU: "15 000 ₽ / мес", EN: "15 000 ₽ / mo" },
  "home.rates.button": { RU: "Записаться", EN: "Enroll" },

  "home.map.title": { RU: "Наши локации", EN: "Our locations" },
  "home.map.desc": { RU: "Чтобы получить необходимую информацию о школе, нажмите на любую из меток", EN: "Click on any marker to get information about the school" },
  
  "home.map.ru.country": { RU: "Россия", EN: "Russia" },
  "home.map.ru.city": { RU: "Калининградская обл.", EN: "Kaliningrad reg." },
  "home.map.ru.title": { RU: "Куршская коса", EN: "Curonian Spit" },
  "home.map.ru.intro": { RU: "Прохладная вода и суровая красота Балтики. Спот идеально подходит для любителей эстетичного лонгбординга на фоне пустынных песчаных дюн.", EN: "Cool water and the harsh beauty of the Baltic. The spot is perfect for aesthetic longboarding against the backdrop of deserted sand dunes." },

  "home.map.sri.country": { RU: "Шри-Ланка", EN: "Sri Lanka" },
  "home.map.sri.city": { RU: "Велигама", EN: "Weligama" },
  "home.map.sri.title": { RU: "Бухта Велигама", EN: "Weligama Bay" },
  "home.map.sri.intro": { RU: "Теплый океан и стабильный свелл круглый год. Одно из лучших мест в мире для безопасного знакомства с океаном и первых проездов на доске.", EN: "Warm ocean and consistent swell year-round. One of the best places in the world for a safe introduction to the ocean and first rides on the board." },

  "home.map.indo.country": { RU: "Индонезия", EN: "Indonesia" },
  "home.map.indo.city": { RU: "Бали", EN: "Bali" },
  "home.map.indo.title": { RU: "Эко-Бич, Чангу", EN: "Echo Beach, Canggu" },
  "home.map.indo.intro": { RU: "Мощная энергетика и культовое комьюнити. Спот для тех, кто готов переходить на шортборд и учиться продвинутым резким маневрам.", EN: "Powerful energy and an iconic community. A spot for those ready to transition to shortboard and learn advanced sharp maneuvers." },

  // Store page
  "store.title": { RU: "Лавка МЫС", EN: "MYS Shop" },
  "store.desc": { RU: "Вещи, созданные с любовью к океану. Сувениры, снаряжение и эстетичный мерч.", EN: "Things created with love for the ocean. Souvenirs, gear, and aesthetic merch." },
  
  "store.cat.apparel": { RU: "Одежда", EN: "Apparel" },
  "store.cat.acc": { RU: "Аксессуары", EN: "Accessories" },
  "store.cat.gear": { RU: "Снаряжение", EN: "Gear" },
  "store.cat.care": { RU: "Уход", EN: "Care" },
  "store.cat.services": { RU: "Услуги", EN: "Services" },

  "store.item1.name": { RU: "Худи МЫС Classic", EN: "Hoodie MYS Classic" },
  "store.item2.name": { RU: "Кепка Surf Club", EN: "Surf Club Cap" },
  "store.item3.name": { RU: "Полотенце-пончо", EN: "Poncho Towel" },
  "store.item4.name": { RU: "Цинковый крем", EN: "Zinc Cream" },
  "store.item5.name": { RU: "Шоппер МЫС", EN: "MYS Shopper" },
  "store.item6.name": { RU: "Подарочный сертификат", EN: "Gift Certificate" },
  "store.item6.price": { RU: "От 5 000 ₽", EN: "From 5 000 ₽" },
  
  "store.btn.cart": { RU: "В корзину", EN: "Add to cart" },
  "store.booking.subtitle": { RU: "Клуб МЫС", EN: "MYS Club" },
  "store.booking.title": { RU: "Особые условия", EN: "Special conditions" },
  "store.booking.desc": { RU: "Для членов клуба у нас действуют постоянные скидки на весь ассортимент лавки и приоритетное бронирование оборудования.", EN: "For club members, we have permanent discounts on the entire shop range and priority equipment booking." },
  "store.booking.btn": { RU: "Узнать о клубе", EN: "Learn about the club" },

  // Community page
  "comm.subtitle": { RU: "Семья МЫС", EN: "MYS Family" },
  "comm.title": { RU: "Больше, чем\nпросто школа.", EN: "More than\njust a school." },
  "comm.desc1": { RU: "Наше комьюнити — это место, где незнакомцы становятся друзьями после первого совместного лайн-апа. Мы вместе встречаем рассветы на спотах, устраиваем уютные вечеринки у костра после тяжелой каталки и делимся самым ценным — впечатлениями.", EN: "Our community is a place where strangers become friends after the first shared lineup. We greet dawn at the spots together, throw cozy bonfire parties after a hard surf session, and share the most valuable thing - experiences." },
  "comm.desc2": { RU: "Тусовки на волнах, совместные кинопоказы серф-роликов, йога на закате и бесконечные разговоры об океане под гитару. МЫС — это стиль жизни.", EN: "Parties on the waves, surf movie screenings, sunset yoga, and endless conversations about the ocean with a guitar. MYS is a lifestyle." },
  "comm.chat.title": { RU: "Присоединяйся к нашим чатам", EN: "Join our chats" },
  "comm.chat.desc": { RU: "В наших Telegram-чатах мы договариваемся о совместных выездах, делимся прогнозами волн, продаем и покупаем б/у доски и просто болтаем. Выбери свою локацию и вливайся!", EN: "In our Telegram chats we organize joint trips, share wave forecasts, buy/sell used boards, and just chat. Choose your location and join in!" },
  "comm.chat.btn1": { RU: "Чат: Бали", EN: "Chat: Bali" },
  "comm.chat.btn2": { RU: "Чат: Шри-Ланка", EN: "Chat: Sri Lanka" },
  "comm.chat.btn3": { RU: "Глобальный клуб", EN: "Global club" },

  // Booking Modal
  "modal.booking.title": { RU: "Заявка на обучение", EN: "Booking request" },
  "modal.booking.name": { RU: "Имя", EN: "Name" },
  "modal.booking.phone": { RU: "Телефон", EN: "Phone" },
  "modal.booking.email": { RU: "Почта", EN: "Email" },
  "modal.booking.submit": { RU: "Отправить заявку", EN: "Send request" },
  "modal.booking.success.title": { RU: "Заявка отправлена!", EN: "Request sent!" },
  "modal.booking.success.desc": { RU: "Мы свяжемся с вами для уточнения деталей. Благодарим, что выбрали нас!", EN: "We will contact you to clarify details. Thank you for choosing us!" },
  "modal.booking.close": { RU: "Закрыть", EN: "Close" }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'RU',
  setLang: () => {},
  t: () => ''
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('RU');

  const t = (key: string) => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translations[key][lang];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
