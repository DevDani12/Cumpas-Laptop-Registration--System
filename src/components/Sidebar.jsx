import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const linkClass = (path) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap";
    const activeClass = "bg-primary-600 text-white shadow-md shadow-primary-900/30";
    const inactiveClass = "text-slate-400 hover:bg-slate-800 hover:text-white";
    return `${baseClass} ${location.pathname === path ? activeClass : inactiveClass}`;
  };

  const navItems = [
    { path: "/", label: t("dashboard"),
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg> },
    { path: "/register", label: t("registerLaptop"),
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> },
    { path: "/verify", label: t("verifyLaptop"),
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { path: "/history", label: t("history"),
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { path: "/audit", label: t("auditLog"),
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  ];

  return (
    <aside className={`relative ${collapsed ? "w-20" : "w-64"} h-screen bg-slate-950 text-white p-4 flex flex-col justify-between border-r border-slate-800/60 transition-all duration-300`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full flex items-center justify-center text-white text-xs shadow-md transition-colors z-10"
      >
        {collapsed ? "›" : "‹"}
      </button>

      <div>
        <div className={`flex items-center gap-3 mb-8 px-2 ${collapsed ? "justify-center px-0" : ""}`}>
          <div className="h-10 w-10 min-w-[2.5rem] rounded-lg bg-white/10 flex items-center justify-center overflow-hidden shadow-md shadow-primary-500/20">
            <img src="/images/images.jpg" alt="NSPC" className="w-full h-full object-contain" />
          </div>
          <div className={`${collapsed ? "hidden" : "block"} overflow-hidden`}>
            <h1 className="text-sm font-bold tracking-tight leading-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Nefas Silk Polytechnic College
            </h1>
            <p className="text-[10px] text-slate-500">ንፋስ ስልክ ፖሊቴክኒክ ኮሌጅ</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${linkClass(item.path)} ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className={`${collapsed ? "hidden" : "block"}`}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className={`pt-4 border-t border-slate-800/80 ${collapsed ? "flex justify-center" : ""}`}>
        <button
          onClick={logout}
          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-all duration-200 ${collapsed ? "justify-center px-2 w-auto" : "w-full"}`}
          title={collapsed ? t("logout") : undefined}
        >
          <span className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </span>
          <span className={`${collapsed ? "hidden" : "block"}`}>{t("logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
