import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import StockForm from "../components/StockForm";

const ROLES = ["student", "trainer", "guest", "staff", "surveyor"];

const LaptopForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");

  const roleLabels = {
    student: { id: t("studentId"), name: t("studentName"), affiliation: t("department") },
    trainer: { id: t("trainerId"), name: t("trainerName"), affiliation: t("department") },
    guest: { id: t("organization"), name: t("guestName"), affiliation: t("organizationOptional") },
    staff: { id: t("staffId"), name: t("staffName"), affiliation: t("department") },
    surveyor: { id: t("surveyorId"), name: t("surveyorName"), affiliation: t("organizationOptional") },
  };

  const [formData, setFormData] = useState({
    ownerId: "",
    ownerName: "",
    affiliation: "",
    phoneNumber: "",
    brand: "",
    model: "",
    color: "",
    serialNumber: ""
  });

  const [images, setImages] = useState({
    studentIdPhoto: null,
    laptopPhoto: null,
    serialStickerPhoto: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages({ ...images, [e.target.name]: e.target.files[0] });
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    setFormData({ ...formData, ownerId: "", ownerName: "", affiliation: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      data.append("role", role);
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("studentIdPhoto", images.studentIdPhoto);
      data.append("laptopPhoto", images.laptopPhoto);
      data.append("serialStickerPhoto", images.serialStickerPhoto);

      const response = await api.post("/laptops/register", data);
      if (response.data.success) {
        toast.success(t("successRegistered"));
        navigate("/history");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const curLabels = roleLabels[role];
  const roleInfoKey = `${role}Info`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      <section className="border-2 border-primary-400 rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-primary-800">{t("registrantType")}</h2>
        <div className="flex flex-wrap gap-3">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => switchRole(r)}
              className={`px-5 py-2.5 rounded-lg font-semibold capitalize transition ${
                role === r ? "bg-primary-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t(r)}
            </button>
          ))}
        </div>
      </section>

      <section className="border-2 border-primary-400 rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-primary-800">{t(roleInfoKey)}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input name="ownerId" placeholder={curLabels.id} value={formData.ownerId} onChange={handleChange} className="input" required={role !== "guest"} />
          <input name="ownerName" placeholder={curLabels.name} value={formData.ownerName} onChange={handleChange} className="input" required />
          <input name="affiliation" placeholder={curLabels.affiliation} value={formData.affiliation} onChange={handleChange} className="input" required={role !== "guest" && role !== "surveyor"} />
          <input name="phoneNumber" placeholder={t("phoneNumber")} value={formData.phoneNumber} onChange={handleChange} className="input" required />
        </div>
      </section>

      <section className="border-2 border-primary-400 rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-primary-800">{t("laptopInfo")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input name="brand" placeholder={t("brand")} value={formData.brand} onChange={handleChange} className="input" required />
          <input name="model" placeholder={t("model")} value={formData.model} onChange={handleChange} className="input" required />
          <input name="color" placeholder={t("color")} value={formData.color} onChange={handleChange} className="input" required />
          <input name="serialNumber" placeholder={t("serialNumber")} value={formData.serialNumber} onChange={handleChange} className="input" required />
        </div>
      </section>

      <section className="border-2 border-primary-400 rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-center text-primary-800">{t("requiredImages")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "studentIdPhoto", label: t("idPhoto"), icon: "/images/ID.jpg" },
            { name: "laptopPhoto", label: t("laptopPhoto"), icon: "/images/laptop.png" },
            { name: "serialStickerPhoto", label: t("serialStickerPhoto"), icon: "/images/Serial.jpg" },
          ].map(({ name, label, icon }) => (
            <label
              key={name}
              className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary-300 rounded-xl p-6 cursor-pointer hover:border-primary-600 hover:bg-primary-50 transition-all duration-200 min-h-[180px]"
            >
              <img src={icon} alt={label} className="w-12 h-12 object-contain" />
              <span className="text-sm font-semibold text-primary-800">{label}</span>
              <span className="text-xs text-gray-400">Click to upload</span>
              <input
                type="file"
                name={name}
                accept="image/*"
                onChange={handleImageChange}
                required
                className="hidden"
              />
            </label>
          ))}
        </div>
      </section>

      <div className="text-center">
        <button disabled={loading} className="bg-primary-600 text-white px-10 py-3 rounded-lg font-bold hover:bg-primary-700 disabled:bg-gray-400 shadow-md transition-all">
          {loading ? t("registering") : t("registerButton")}
        </button>
      </div>
    </form>
  );
};

const Register = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("laptop");

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {activeTab === "laptop" ? t("registerTitle") : t("stockTitle")}
      </h1>

      <div className="flex justify-center mb-8">
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

      {activeTab === "laptop" ? <LaptopForm /> : <StockForm />}
    </div>
  );
};

export default Register;
