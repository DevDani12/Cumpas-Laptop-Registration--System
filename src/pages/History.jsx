import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

const LaptopHistory = () => {
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

  if (loading) {
    return <div className="p-8 text-center text-slate-500">{t("loadingHistory")}</div>;
  }

  if (records.length === 0) {
    return <div className="p-8 text-center text-slate-500">{t("noRecords")}</div>;
  }

  return (
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
            <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("qrCode")}</th>
            <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("registeredAt")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((record, index) => (
            <tr key={record._id || index} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <span className="capitalize bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-1 rounded-full">{record.role}</span>
              </td>
              <td className="px-6 py-4 font-medium text-slate-800">{record.ownerId}</td>
              <td className="px-6 py-4 text-slate-600">{record.ownerName}</td>
              <td className="px-6 py-4 text-slate-600">{record.brand}</td>
              <td className="px-6 py-4 text-slate-600">{record.model}</td>
              <td className="px-6 py-4 font-mono text-xs text-slate-500">{record.serialNumber}</td>
              <td className="px-6 py-4">
                {record.qrCodeUrl ? (
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = record.qrCodeUrl;
                      link.download = `QR-${record.serialNumber}.png`;
                      link.click();
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {t("downloadQR")}
                  </button>
                ) : (
                  <span className="text-slate-400 text-xs">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-slate-500">
                {record.createdAt ? new Date(record.createdAt).toLocaleString() : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StockHistory = () => {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        setLoading(true);
        const response = await api.get("/stock");
        setRecords(response.data.data || []);
      } catch (error) {
        toast.error(t("failedLoadHistory"));
      } finally {
        setLoading(false);
      }
    };
    fetchStockItems();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">{t("loadingHistory")}</div>;
  }

  if (records.length === 0) {
    return <div className="p-8 text-center text-slate-500">{t("noStockItems")}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("stockItemId")}</th>
            <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("stockItemName")}</th>
            <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("stockCategory")}</th>
            <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("stockQuantity")}</th>
            <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("stockSupplier")}</th>
            <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("stockDateReceived")}</th>
            <th className="text-left px-6 py-4 font-semibold text-slate-600">{t("registeredAt")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((record, index) => (
            <tr key={record._id || index} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-mono text-xs text-slate-500">{record.itemId || "-"}</td>
              <td className="px-6 py-4 font-medium text-slate-800">{record.itemName}</td>
              <td className="px-6 py-4">
                <span className="bg-violet-100 text-violet-800 text-xs font-semibold px-2.5 py-1 rounded-full">{record.category}</span>
              </td>
              <td className="px-6 py-4 text-slate-600 font-semibold">{record.quantity}</td>
              <td className="px-6 py-4 text-slate-600">{record.supplier}</td>
              <td className="px-6 py-4 text-slate-500">
                {record.dateReceived ? new Date(record.dateReceived).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4 text-slate-500">
                {record.createdAt ? new Date(record.createdAt).toLocaleString() : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const History = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("laptops");

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 flex-1">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {activeTab === "laptops" ? t("historyTitle") : t("stockList")}
          </h1>
          <p className="text-slate-500 mt-1">
            {activeTab === "laptops" ? t("historyDesc") : t("stockListDesc")}
          </p>
        </div>
        {activeTab === "laptops" && (
          <button
            onClick={async () => {
              try {
                const response = await api.get("/laptops/export/csv", { responseType: "text" });
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `laptops-export-${Date.now()}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              } catch (err) {
                const msg = err.response?.data?.message || err.message || t("failedLoadHistory");
                toast.error(msg);
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            {t("downloadCSV")}
          </button>
        )}
        {activeTab === "stock" && (
          <button
            onClick={async () => {
              try {
                const response = await api.get("/stock/export/csv", { responseType: "text" });
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `stock-export-${Date.now()}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              } catch (err) {
                const msg = err.response?.data?.message || err.message || t("failedLoadHistory");
                toast.error(msg);
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            {t("downloadCSV")}
          </button>
        )}
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("laptops")}
          className={`px-6 py-2.5 rounded-md font-semibold transition ${
            activeTab === "laptops" ? "bg-white text-primary-700 shadow-sm" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {t("registerLaptopTab")}
        </button>
        <button
          onClick={() => setActiveTab("stock")}
          className={`px-6 py-2.5 rounded-md font-semibold transition ${
            activeTab === "stock" ? "bg-white text-primary-700 shadow-sm" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {t("registerStockTab")}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        {activeTab === "laptops" ? <LaptopHistory /> : <StockHistory />}
      </div>
    </div>
  );
};

export default History;
