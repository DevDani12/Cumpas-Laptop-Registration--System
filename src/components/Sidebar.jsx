import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const linkClass = (path) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200";
    const activeClass = "bg-primary-600 text-white shadow-md shadow-primary-900/30";
    const inactiveClass = "text-slate-400 hover:bg-slate-800 hover:text-white";
    return `${baseClass} ${location.pathname === path ? activeClass : inactiveClass}`;
  };

  return (
    <aside className="w-64 h-screen bg-slate-950 text-white p-6 flex flex-col justify-between border-r border-slate-800/60">
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden shadow-md shadow-primary-500/20">
            <img src="/images/images.jpg" alt="NSPC" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight leading-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Nefas Silk Polytechnic College
            </h1>
            <p className="text-[10px] text-slate-500">ንፋስ ስልክ ፖሊቴክኒክ ኮሌጅ</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1.5">
          <Link to="/" className={linkClass("/")}><span>{t("dashboard")}</span></Link>
          <Link to="/register" className={linkClass("/register")}><span>{t("registerLaptop")}</span></Link>
          <Link to="/verify" className={linkClass("/verify")}><span>{t("verifyLaptop")}</span></Link>
          <Link to="/history" className={linkClass("/history")}><span>{t("history")}</span></Link>
        </nav>
      </div>
      <div className="pt-4 border-t border-slate-800/80">
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-all duration-200">
          <span>{t("logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
