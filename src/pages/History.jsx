import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

const History = () => {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get("/laptops");
        setRecords(response.data.data || []);
      } catch (error) {
        toast.error(t("failedLoadHistory"));
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 flex-1">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("historyTitle")}</h1>
          <p className="text-slate-500 mt-1">{t("historyDesc")}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">{t("loadingHistory")}</div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-slate-500">{t("noRecords")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("type")}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("ownerIdLabel")}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("ownerNameLabel")}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("brandLabel")}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("modelLabel")}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("serialNumber")}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("registeredAt")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record, index) => (
                  <tr key={record._id || index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="capitalize bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full">{record.role}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{record.ownerId}</td>
                    <td className="px-6 py-4 text-slate-600">{record.ownerName}</td>
                    <td className="px-6 py-4 text-slate-600">{record.brand}</td>
                    <td className="px-6 py-4 text-slate-600">{record.model}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{record.serialNumber}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {record.createdAt ? new Date(record.createdAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
