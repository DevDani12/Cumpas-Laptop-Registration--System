import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        if (res.data.success) setData(res.data.data);
      } catch (error) {
        toast.error(t("failedLoadDashboard"));
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = data
    ? [
        { title: t("totalLaptops"), count: data.totalLaptops, change: `+${data.todayRegistrations} ${t("today")}`, color: "border-primary-500", icon: "/images/laptop.png" },
        { title: t("verifiedToday"), count: data.todayVerifications, change: t("activeChecking"), color: "border-primary-500", icon: "/images/check.png" },
        { title: t("totalStockItems"), count: data.totalStockItems, change: `+${data.todayStockItems} ${t("today")}`, color: "border-violet-500", icon: "/images/check.png" },
        { title: t("pendingFlags"), count: data.pendingRegistrations, change: t("requiresAttention"), color: "border-amber-500", icon: "/images/expired.png" },
      ]
    : [];

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("justNow");
    if (mins < 60) return `${mins} ${t("minAgo")}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ${hrs === 1 ? t("hourAgo") : t("hoursAgo")}`;
    return `${Math.floor(hrs / 24)} ${t("daysAgo")}`;
  };

  if (loading) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen text-slate-800 flex-1 flex items-center justify-center">
        <p className="text-slate-500">{t("loadingDashboard")}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 flex-1">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("dashboardTitle")}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
            {t("welcomeBack")} <span className="font-semibold text-slate-700">{t("securityGuard")}</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200/60">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${stat.color} border border-slate-200/80 flex justify-between items-start transition-all duration-200 hover:shadow-md`}>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{stat.count}</h3>
              <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
            </div>
            <div className="text-2xl bg-slate-50 p-2.5 rounded-lg w-12 h-12 flex items-center justify-center">
              {stat.icon.startsWith("/") ? (
                <img src={stat.icon} alt="" className="w-7 h-7 object-contain" />
              ) : (
                stat.icon
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">{t("recentActivity")}</h2>
          </div>
          {data?.activities?.length === 0 ? (
            <p className="text-slate-400 text-sm py-4 text-center">{t("noRecentActivity")}</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {data?.activities?.map((activity) => (
                <div key={activity.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800 text-sm">{activity.event}</span>
                    <span className="text-xs text-slate-400 mt-0.5">{t("by")} {activity.guard} ({activity.method})</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-400">{timeAgo(activity.time)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                      activity.status === "Success" ? "bg-primary-50 text-primary-700" : "bg-red-50 text-red-700"
                    }`}>{activity.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">{t("quickActions")}</h2>
            <div className="space-y-3">
              <button onClick={() => navigate("/verify")} className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium py-3 px-4 rounded-lg text-sm transition transition-colors duration-150 flex items-center justify-center gap-2">
                🔎 {t("scanVerify")}
              </button>
              <button onClick={() => navigate("/register")} className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-lg text-sm border border-slate-200 transition transition-colors duration-150 flex items-center justify-center gap-2">
                ➕ {t("newRegistration")}
              </button>
            </div>
          </div>
          <div className="mt-6 p-4 bg-amber-50/60 rounded-lg border border-amber-200/60 text-amber-900 text-xs">
            <p className="font-bold mb-1">{t("securityNotice")}</p>
            {t("securityNoticeText")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
