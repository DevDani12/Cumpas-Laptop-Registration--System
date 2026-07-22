import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import EthiopianDatePicker from "./EthiopianDatePicker";

const StockForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [registered, setRegistered] = useState(null);

  const [formData, setFormData] = useState({
    itemId: "",
    itemName: "",
    category: "",
    quantity: "",
    supplier: "",
    dateReceived: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const response = await api.post("/stock/register", formData);
      if (response.data.success) {
        setRegistered(response.data.data);
        toast.success(t("stockSuccessRegistered"));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("stockRegistrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <section className="border-2 border-green-400 rounded-xl p-8 bg-white shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="inline-block bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-full mb-4 tracking-wider">
            REGISTERED
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Registration Successful</h2>
          <div className="space-y-3 text-left">
            {[
              { label: t("stockItemId"), value: registered.itemId },
              { label: t("stockItemName"), value: registered.itemName },
              { label: t("stockCategory"), value: registered.category },
              { label: t("stockQuantity"), value: String(registered.quantity) },
              { label: t("stockSupplier"), value: registered.supplier },
              { label: t("stockDateReceived"), value: new Date(registered.dateReceived).toLocaleDateString() },
              ...(registered.description ? [{ label: t("stockDescription"), value: registered.description }] : []),
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
        </section>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/history")}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 shadow-md transition-all"
          >
            View All Stock
          </button>
          <button
            onClick={() => {
              setRegistered(null);
              setConfirming(false);
              setFormData({
                itemId: "",
                itemName: "",
                category: "",
                quantity: "",
                supplier: "",
                dateReceived: new Date().toISOString().split("T")[0],
                description: "",
              });
            }}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 shadow-md transition-all"
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <section className="border-2 border-primary-400 rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-center text-primary-800">Confirm Stock Item</h2>
          <div className="space-y-4">
            {[
              { label: t("stockItemId"), value: formData.itemId },
              { label: t("stockItemName"), value: formData.itemName },
              { label: t("stockCategory"), value: formData.category },
              { label: t("stockQuantity"), value: formData.quantity },
              { label: t("stockSupplier"), value: formData.supplier },
              { label: t("stockDateReceived"), value: new Date(formData.dateReceived).toLocaleDateString() },
              ...(formData.description ? [{ label: t("stockDescription"), value: formData.description }] : []),
            ].map(
              (field) =>
                field.value && (
                  <div key={field.label} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-500 w-32 shrink-0">{field.label}</span>
                    <span className="text-base font-medium text-gray-900">{field.value}</span>
                  </div>
                )
            )}
          </div>
        </section>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setConfirming(false)}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 shadow-md transition-all"
          >
            Edit
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-primary-600 text-white px-10 py-3 rounded-lg font-bold hover:bg-primary-700 disabled:bg-gray-400 shadow-md transition-all"
          >
            {loading ? t("stockRegistering") : "Confirm & Register"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setConfirming(true);
      }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <section className="border-2 border-primary-400 rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-primary-800">{t("stockTitle")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1.5">{t("stockItemId")}</label>
            <input name="itemId" placeholder={t("stockItemId")} value={formData.itemId} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1.5">{t("stockItemName")}</label>
            <input name="itemName" placeholder={t("stockItemName")} value={formData.itemName} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1.5">{t("stockCategory")}</label>
            <input name="category" placeholder={t("stockCategoryPlaceholder")} value={formData.category} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1.5">{t("stockQuantity")}</label>
            <input name="quantity" type="number" min="0" placeholder="0" value={formData.quantity} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1.5">{t("stockSupplier")}</label>
            <input name="supplier" placeholder={t("stockSupplier")} value={formData.supplier} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1.5">{t("stockDateReceived")}</label>
            <EthiopianDatePicker
              value={formData.dateReceived}
              onChange={(val) => setFormData({ ...formData, dateReceived: val })}
            />
          </div>
        </div>
      </section>

      <section className="border-2 border-primary-400 rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-primary-800">{t("stockDescription")}</h2>
        <textarea
          name="description"
          placeholder={t("stockDescriptionPlaceholder")}
          value={formData.description}
          onChange={handleChange}
          className="input"
          rows="3"
        />
      </section>

      <div className="text-center">
        <button className="bg-primary-600 text-white px-10 py-3 rounded-lg font-bold hover:bg-primary-700 shadow-md transition-all">
          Review Details
        </button>
      </div>
    </form>
  );
};

export default StockForm;
