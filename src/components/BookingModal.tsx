import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rateName?: string;
}

export function BookingModal({ isOpen, onClose, rateName }: BookingModalProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    console.log("Booking submitted:", { ...formData, rateName });
    setStep("success");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phone: value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9@._\-\+]/g, "");
    setFormData({ ...formData, email: value });
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation ends
    setTimeout(() => {
      setStep("form");
      setFormData({ name: "", phone: "", email: "" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white p-8 md:p-10 rounded-[4px] shadow-2xl overflow-hidden"
          >
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 hover:bg-primary/5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {step === "form" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <h3 className="text-[20px] font-medium tracking-tight mb-2">
                    {t("modal.booking.title")}
                  </h3>
                  {rateName && (
                    <p className="text-[12px] uppercase tracking-[1px] opacity-50 mb-8">
                      {rateName}
                    </p>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[1px] font-bold mb-1 opacity-60">
                        {t("modal.booking.name")}
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-transparent border-b border-primary/20 py-2 focus:border-accent outline-none transition-colors text-[15px]"
                        placeholder={t("modal.booking.name")}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[1px] font-bold mb-1 opacity-60">
                        {t("modal.booking.phone")}
                      </label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className="w-full bg-transparent border-b border-primary/20 py-2 focus:border-accent outline-none transition-colors text-[15px]"
                        placeholder="79000000000"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[1px] font-bold mb-1 opacity-60">
                        {t("modal.booking.email")}
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={handleEmailChange}
                        className="w-full bg-transparent border-b border-primary/20 py-2 focus:border-accent outline-none transition-colors text-[15px]"
                        placeholder="email@example.com"
                      />
                    </div>
                    <Button type="submit" className="w-full mt-4">
                      {t("modal.booking.submit")}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <X size={32} className="rotate-45" /> 
                  </div>
                  <h3 className="text-[20px] font-medium tracking-tight mb-4">
                    {t("modal.booking.success.title")}
                  </h3>
                  <p className="text-[14px] leading-relaxed opacity-70 mb-8">
                    {t("modal.booking.success.desc")}
                  </p>
                  <Button variant="outline" onClick={handleClose} className="w-full">
                    {t("modal.booking.close")}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
