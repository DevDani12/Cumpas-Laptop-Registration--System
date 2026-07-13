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
        <header className="bg-emerald-700 text-white p-5 shadow-md tracking-tight flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("appTitle")}</h1>
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
