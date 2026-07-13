import { useLanguage } from "../context/LanguageContext";

const LanguageToggle = () => {
  const { lang, switchLang } = useLanguage();

  return (
    <button
      onClick={() => switchLang(lang === "en" ? "am" : "en")}
      className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
    >
      {lang === "en" ? "አማ" : "EN"}
    </button>
  );
};

export default LanguageToggle;
