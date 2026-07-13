import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

const ROLES = ["student", "trainer", "guest", "staff", "surveyor"];

const Register = () => {
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
    <div>
      <h1 className="text-3xl font-bold mb-6">{t("registerTitle")}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4">{t("registrantType")}</h2>
          <div className="flex flex-wrap gap-3">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className={`px-5 py-2.5 rounded-lg font-semibold capitalize transition ${
                  role === r ? "bg-emerald-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t(r)}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">{t(roleInfoKey)}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input name="ownerId" placeholder={curLabels.id} value={formData.ownerId} onChange={handleChange} className="input" required={role !== "guest"} />
            <input name="ownerName" placeholder={curLabels.name} value={formData.ownerName} onChange={handleChange} className="input" required />
            <input name="affiliation" placeholder={curLabels.affiliation} value={formData.affiliation} onChange={handleChange} className="input" required={role !== "guest" && role !== "surveyor"} />
            <input name="phoneNumber" placeholder={t("phoneNumber")} value={formData.phoneNumber} onChange={handleChange} className="input" required />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">{t("laptopInfo")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input name="brand" placeholder={t("brand")} value={formData.brand} onChange={handleChange} className="input" required />
            <input name="model" placeholder={t("model")} value={formData.model} onChange={handleChange} className="input" required />
            <input name="color" placeholder={t("color")} value={formData.color} onChange={handleChange} className="input" required />
            <input name="serialNumber" placeholder={t("serialNumber")} value={formData.serialNumber} onChange={handleChange} className="input" required />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">{t("requiredImages")}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label>{t("idPhoto")}</label>
              <input type="file" name="studentIdPhoto" accept="image/*" onChange={handleImageChange} required />
            </div>
            <div>
              <label>{t("laptopPhoto")}</label>
              <input type="file" name="laptopPhoto" accept="image/*" onChange={handleImageChange} required />
            </div>
            <div>
              <label>{t("serialStickerPhoto")}</label>
              <input type="file" name="serialStickerPhoto" accept="image/*" onChange={handleImageChange} required />
            </div>
          </div>
        </section>

        <button disabled={loading} className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:bg-gray-400">
          {loading ? t("registering") : t("registerButton")}
        </button>
      </form>
    </div>
  );
};

export default Register;
