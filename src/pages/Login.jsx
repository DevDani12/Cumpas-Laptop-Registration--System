import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await api.post("/auth/login", formData);
            if (response.data.success) {
                login(response.data);
                toast.success("Login successful");
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
                    {t("campusSecurity")}
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    {t("guardLogin")}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-2 font-medium">{t("email")}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t("emailPlaceholder")}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">{t("password")}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="********"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400"
                    >
                        {loading ? t("loggingIn") : t("login")}
                    </button>
                </form>

                <div className="mt-6 text-sm text-gray-500 text-center">
                    {t("guardAccessOnly")}
                </div>
            </div>
        </div>
    );
};

export default Login;
