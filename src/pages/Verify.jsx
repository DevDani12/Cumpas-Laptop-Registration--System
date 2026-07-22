import { useState } from "react";
import { toast } from "react-hot-toast";
import api, { API_BASE_URL } from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
};

const ImgWithFallback = ({ src, alt, className }) => {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100 text-slate-400 text-xs`}>
        {alt} not available
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

const LaptopVerify = () => {
  const { t } = useLanguage();
  const [searchType, setSearchType] = useState("serialNumber");
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyLaptop = async () => {
    if (!value.trim()) {
      toast.error(t("enterSearchValue"));
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const response = await api.get("/laptops/verify", { params: { [searchType]: value } });
      setResult(response.data);
      toast.success(t("verificationCompleted"));
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || t("laptopNotRegistered")
      });
      toast.error(t("laptopNotRegistered"));
    } finally {
      setLoading(false);
    }
  };

  const labels = result?.laptop?.role
    ? {
        student: { name: t("studentName"), id: t("studentId"), affiliation: t("department") },
        trainer: { name: t("trainerName"), id: t("trainerId"), affiliation: t("department") },
        guest: { name: t("guestName"), id: t("organization"), affiliation: t("organization") },
        staff: { name: t("staffName"), id: t("staffId"), affiliation: t("department") },
        surveyor: { name: t("surveyorName"), id: t("surveyorId"), affiliation: t("organization") },
      }[result.laptop.role]
    : null;

  return (
    <div>
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { setSearchType("serialNumber"); setValue(""); setResult(null); }}
            className={`px-4 py-2 rounded-lg ${searchType === "serialNumber" ? "bg-primary-600 text-white" : "bg-gray-200"}`}
          >
            {t("serialNumberLabel")}
          </button>
          <button
            onClick={() => { setSearchType("studentId"); setValue(""); setResult(null); }}
            className={`px-4 py-2 rounded-lg ${searchType === "studentId" ? "bg-primary-600 text-white" : "bg-gray-200"}`}
          >
            {t("idName")}
          </button>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={searchType === "serialNumber" ? t("enterSerial") : t("enterOwnerId")}
            className="flex-1 border-2 border-primary-300 rounded-lg px-4 py-3 outline-none focus:border-primary-600"
          />
          <button onClick={verifyLaptop} disabled={loading} className="bg-primary-600 text-white px-6 rounded-lg disabled:bg-gray-400">
            {loading ? t("checking") : t("verify")}
          </button>
        </div>
      </div>

      {result && (
        <div className={`rounded-xl p-6 text-white ${result.success ? "bg-primary-600" : "bg-red-600"}`}>
          <h2 className="text-3xl font-bold mb-3">
            {result.success ? `✅ ${t("verified")}` : `❌ ${t("notRegistered")}`}
          </h2>
          <p className="mb-4">{result.message}</p>

          {result.success && result.laptop && (
            <div className="bg-white text-black rounded-xl p-5">
              <h3 className="text-xl font-bold mb-3 capitalize">{result.laptop.role} {t("info")}</h3>
              <p><b>{labels?.name}:</b> {result.laptop.ownerName}</p>
              <p><b>{labels?.id}:</b> {result.laptop.ownerId}</p>
              {result.laptop.affiliation && <p><b>{labels?.affiliation}:</b> {result.laptop.affiliation}</p>}
              <hr className="my-4" />
              <h3 className="text-xl font-bold mb-3">{t("laptopInfoLabel")}</h3>
              <p><b>{t("brandLabel")}:</b> {result.laptop.brand}</p>
              <p><b>{t("modelLabel")}:</b> {result.laptop.model}</p>
              <p><b>{t("serialLabel")}:</b> {result.laptop.serialNumber}</p>
              <hr className="my-4" />
              <h3 className="text-xl font-bold mb-3">QR Code</h3>
              {result.laptop.qrCodeUrl ? (
                <div className="flex items-center gap-4">
                  <img src={result.laptop.qrCodeUrl} alt="QR Code" className="w-24 h-24 border rounded" />
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = result.laptop.qrCodeUrl;
                      link.download = `QR-${result.laptop.serialNumber}.png`;
                      link.click();
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    {t("downloadQR")}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400">QR code not available</p>
              )}
              <hr className="my-4" />
              <h3 className="text-xl font-bold mb-3">Photos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">{t("idPhoto")}</p>
                  <ImgWithFallback
                    src={getImageUrl(result.laptop.images?.studentIdPhoto)}
                    alt="ID"
                    className="w-full h-40 object-cover rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">{t("laptopPhoto")}</p>
                  <ImgWithFallback
                    src={getImageUrl(result.laptop.images?.laptopPhoto)}
                    alt="Laptop"
                    className="w-full h-40 object-cover rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">{t("serialStickerPhoto")}</p>
                  <ImgWithFallback
                    src={getImageUrl(result.laptop.images?.serialStickerPhoto)}
                    alt="Serial Sticker"
                    className="w-full h-40 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StockVerify = () => {
  const { t } = useLanguage();
  const [searchType, setSearchType] = useState("itemId");
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyStock = async () => {
    if (!value.trim()) {
      toast.error(t("enterSearchValue"));
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const params = searchType === "itemId" ? { itemId: value } : { itemName: value };
      const response = await api.get("/stock/verify", { params });
      setResult(response.data);
      toast.success("Verification completed");
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || "Stock item not found"
      });
      toast.error("Stock item not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { setSearchType("itemId"); setValue(""); setResult(null); }}
            className={`px-4 py-2 rounded-lg ${searchType === "itemId" ? "bg-primary-600 text-white" : "bg-gray-200"}`}
          >
            {t("stockItemId")}
          </button>
          <button
            onClick={() => { setSearchType("itemName"); setValue(""); setResult(null); }}
            className={`px-4 py-2 rounded-lg ${searchType === "itemName" ? "bg-primary-600 text-white" : "bg-gray-200"}`}
          >
            {t("stockItemName")}
          </button>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={searchType === "itemId" ? "Enter item ID" : "Enter item name"}
            className="flex-1 border-2 border-primary-300 rounded-lg px-4 py-3 outline-none focus:border-primary-600"
          />
          <button onClick={verifyStock} disabled={loading} className="bg-primary-600 text-white px-6 rounded-lg disabled:bg-gray-400">
            {loading ? t("checking") : t("verify")}
          </button>
        </div>
      </div>

      {result && (
        <div className={`rounded-xl p-6 text-white ${result.success ? "bg-primary-600" : "bg-red-600"}`}>
          <h2 className="text-3xl font-bold mb-3">
            {result.success ? `✅ ${t("verified")}` : `❌ ${t("notRegistered")}`}
          </h2>
          <p className="mb-4">{result.message}</p>

          {result.success && result.data && (
            <div className="bg-white text-black rounded-xl p-5 space-y-3">
              {[
                { label: t("stockItemId"), value: result.data.itemId },
                { label: t("stockItemName"), value: result.data.itemName },
                { label: t("stockCategory"), value: result.data.category },
                { label: t("stockQuantity"), value: String(result.data.quantity) },
                { label: t("stockSupplier"), value: result.data.supplier },
                { label: t("stockDateReceived"), value: new Date(result.data.dateReceived).toLocaleDateString() },
                ...(result.data.description ? [{ label: t("stockDescription"), value: result.data.description }] : []),
              ].map(
                (field) =>
                  field.value && (
                    <div key={field.label} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm font-semibold text-green-700 w-32 shrink-0">{field.label}</span>
                      <span className="text-base font-medium text-gray-900">{field.value}</span>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Verify = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("laptop");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {activeTab === "laptop" ? t("verifyTitle") : `Verify ${t("stockList")}`}
      </h1>

      <div className="flex justify-center mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border-2 border-primary-300">
          <button
            onClick={() => setActiveTab("laptop")}
            className={`px-6 py-2.5 rounded-md font-semibold transition ${
              activeTab === "laptop" ? "bg-primary-600 text-white shadow-md" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("registerLaptopTab")}
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={`px-6 py-2.5 rounded-md font-semibold transition ${
              activeTab === "stock" ? "bg-primary-600 text-white shadow-md" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("registerStockTab")}
          </button>
        </div>
      </div>

      {activeTab === "laptop" ? <LaptopVerify /> : <StockVerify />}
    </div>
  );
};

export default Verify;
