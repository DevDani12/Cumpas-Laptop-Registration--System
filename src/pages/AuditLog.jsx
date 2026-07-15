import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

const AuditLog = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [filters, setFilters] = useState({ status: "", method: "" });

  const fetchLogs = async (p = page) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", p);
      params.set("limit", "20");
      if (filters.status) params.set("status", filters.status);
      if (filters.method) params.set("method", filters.method);
      const response = await api.get(`/audit?${params}`);
      setLogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || t("failedLoadLogs"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchLogs(1);
  }, [filters]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchLogs(newPage);
  };

  const formatTime = (time) => {
    if (!time) return "-";
    const d = new Date(time);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return t("justNow");
    if (mins < 60) return `${mins} ${t("minAgo")}`;
    if (hours < 2) return `${hours} ${t("hourAgo")}`;
    if (hours < 24) return `${hours} ${t("hoursAgo")}`;
    if (days < 7) return `${days} ${t("daysAgo")}`;
    return d.toLocaleString();
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 flex-1">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("auditTitle")}</h1>
          <p className="text-slate-500 mt-1">{t("auditDesc")}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-3">
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="">{t("allStatuses")}</option>
            <option value="VERIFIED">{t("verified")}</option>
            <option value="NOT_REGISTERED">{t("notRegistered")}</option>
          </select>
          <select
            value={filters.method}
            onChange={(e) => setFilters((f) => ({ ...f, method: e.target.value }))}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="">{t("allMethods")}</option>
            <option value="QR">QR</option>
            <option value="MANUAL_SEARCH">{t("manualSearch")}</option>
            <option value="AI">AI</option>
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">{t("loading")}</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">{t("noLogs")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("time")}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("guardLabel")}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("status")}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("method")}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("ownerNameLabel")}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("serialNumber")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 text-xs">{formatTime(log.time)}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{log.guardName}</div>
                      {log.badgeNumber && (
                        <div className="text-xs text-slate-400">{log.badgeNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          log.status === "VERIFIED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {log.status === "VERIFIED" ? t("verified") : t("notRegistered")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-1 rounded">
                        {log.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {log.laptop ? (
                        <div>
                          <div className="font-medium text-slate-800">{log.laptop.ownerName}</div>
                          <div className="text-xs text-slate-400">{log.laptop.ownerId}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {log.laptop?.serialNumber || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <span className="text-sm text-slate-500">
              {t("showing")} {Math.min((page - 1) * 20 + 1, pagination.total)}-{Math.min(page * 20, pagination.total)} {t("of")} {pagination.total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors"
              >
                {t("prev")}
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.pages}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors"
              >
                {t("next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
