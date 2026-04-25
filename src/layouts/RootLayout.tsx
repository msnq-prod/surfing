import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Logo } from "../components/Logo";
import { cn } from "../lib/utils";
import { useLanguage } from "../contexts/LanguageContext";

export function RootLayout() {
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const links = [
    { name: t("nav.school"), path: "/" },
    { name: t("nav.community"), path: "/community" },
    { name: t("nav.store"), path: "/store" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-sand selection:bg-accent selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-6 md:px-[40px] bg-sand border-b border-primary/10">
        <Logo />
        <div className="flex items-center gap-[30px] md:gap-[50px]">
          <nav className="hidden md:flex items-center gap-[30px]">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-[12px] uppercase tracking-[1px] transition-opacity",
                  location.pathname === link.path ? "opacity-100 border-b border-primary pb-0.5" : "opacity-60 hover:opacity-100"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="relative text-[11px] uppercase tracking-[1px] font-medium">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity h-6"
            >
              {lang}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("transition-transform duration-200", isLangOpen ? "rotate-180" : "")}>
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                <div className="absolute top-[120%] right-0 bg-sand border border-primary/10 shadow-sm p-1.5 min-w-[60px] flex flex-col gap-1 z-50 rounded-[2px] animate-in fade-in slide-in-from-top-1">
                  {["RU", "EN"].filter(l => l !== lang).map(l => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l as "RU" | "EN");
                        setIsLangOpen(false);
                      }}
                      className="text-left w-full opacity-60 hover:opacity-100 transition-opacity p-1.5 hover:bg-primary/5 rounded-[2px]"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-[60px]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-sand text-primary py-16 px-6 md:px-[40px] mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: Contact */}
          <div className="flex flex-col">
            <h4 className="text-[11px] font-semibold uppercase tracking-[1px] mb-[15px] opacity-50">{t("footer.contact")}</h4>
            <div className="flex flex-col gap-[10px] text-[14px]">
              <a href="tel:+79001234567" className="hover:opacity-60 transition-opacity whitespace-nowrap">+7 (900) 123-45-67</a>
              <a href={`mailto:${t("footer.email")}`} className="hover:opacity-60 transition-opacity">{t("footer.email")}</a>
              <p className="opacity-60 text-[12px] mt-2">{t("footer.locations.list")}</p>
              <a href="#" className="text-[12px] underline underline-offset-4 mt-2 hover:opacity-60 transition-opacity">
                {t("footer.support")}
              </a>
            </div>
          </div>

          {/* Center: Socials */}
          <div className="flex flex-col md:items-center">
            <h4 className="text-[11px] font-semibold uppercase tracking-[1px] mb-[15px] opacity-50">{t("footer.social")}</h4>
            <div className="flex gap-[15px]">
              <a href="#" target="_blank" rel="noopener noreferrer" className="border border-primary px-3 py-1 text-[10px] hover:bg-primary hover:text-sand transition-colors font-medium">
                WA
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="border border-primary px-3 py-1 text-[10px] hover:bg-primary hover:text-sand transition-colors font-medium">
                VK
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="border border-primary px-3 py-1 text-[10px] hover:bg-primary hover:text-sand transition-colors font-medium">
                TG
              </a>
            </div>
          </div>

          {/* Right: Empty */}
          <div className="hidden md:flex justify-end items-start opacity-20">
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-primary/10 text-[10px] opacity-40 flex flex-col md:flex-row justify-between uppercase tracking-wider gap-4">
          <p className="whitespace-pre-line">{t("footer.rights")}</p>
          <p>{t("footer.design")}</p>
        </div>
      </footer>
    </div>
  );
}
