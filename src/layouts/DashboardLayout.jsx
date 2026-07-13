import React from "react";
import Sidebar from "../components/Sidebar";
import LanguageToggle from "../components/LanguageToggle";
import { useLanguage } from "../context/LanguageContext";

const DashboardLayout = ({ children }) => {
  const { t } = useLanguage();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <header className="bg-primary-700 text-white p-5 shadow-md tracking-tight flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
              <img src="/images/images.jpg" alt="NSPC" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Nefas Silk Polytechnic College</h1>
              <p className="text-xs text-primary-200">{t("appTitle")}</p>
            </div>
          </div>
          <LanguageToggle />
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
