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

const Verify = () => {
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{t("verifyTitle")}</h1>

      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { setSearchType("serialNumber"); setValue(""); }}
            className={`px-4 py-2 rounded-lg ${searchType === "serialNumber" ? "bg-primary-600 text-white" : "bg-gray-200"}`}
          >
            {t("serialNumberLabel")}
          </button>
          <button
            onClick={() => { setSearchType("studentId"); setValue(""); }}
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
            className="flex-1 border rounded-lg px-4 py-3 outline-none"
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

export default Verify;
