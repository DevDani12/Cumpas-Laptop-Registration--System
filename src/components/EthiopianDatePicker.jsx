import { useState, useEffect } from "react";
import EthiopianDate from "ethiopian-date";
import { useLanguage } from "../context/LanguageContext";

const ETHIOPIAN_MONTHS_EN = [
  "Meskerem", "Tikimt", "Hidar", "Tahisas", "Tir", "Yekatit",
  "Megabit", "Miazia", "Genbot", "Sene", "Hamle", "Nehase", "Pagume"
];

const ETHIOPIAN_MONTHS_AM = [
  "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት",
  "መጋቢት", "ሚያዚያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጷጉሜን"
];

const daysInEthiopianMonth = (year, month) => {
  if (month < 13) return 30;
  return year % 4 === 3 ? 6 : 5;
};

const EthiopianDatePicker = ({ value, onChange, className }) => {
  const { lang } = useLanguage();
  const isAm = lang === "am";
  const monthNames = isAm ? ETHIOPIAN_MONTHS_AM : ETHIOPIAN_MONTHS_EN;

  const today = new Date();
  const todayEth = EthiopianDate.toEthiopian(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const currentEthYear = todayEth[0];

  const parseDate = (isoStr) => {
    if (!isoStr) {
      const now = new Date();
      return EthiopianDate.toEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
    const d = new Date(isoStr);
    return EthiopianDate.toEthiopian(d.getFullYear(), d.getMonth() + 1, d.getDate());
  };

  const [ethYear, ethMonth, ethDay] = parseDate(value);
  const [year, setYear] = useState(ethYear);
  const [month, setMonth] = useState(ethMonth);
  const [day, setDay] = useState(ethDay);

  useEffect(() => {
    const [y, m, d] = parseDate(value);
    setYear(y);
    setMonth(m);
    setDay(d);
  }, [value]);

  const years = Array.from({ length: 11 }, (_, i) => currentEthYear - 5 + i);

  const days = Array.from({ length: daysInEthiopianMonth(year, month) }, (_, i) => i + 1);

  const emitChange = (y, m, d) => {
    const greg = EthiopianDate.toGregorian(y, m, d);
    const iso = `${greg[0]}-${String(greg[1]).padStart(2, "0")}-${String(greg[2]).padStart(2, "0")}`;
    onChange(iso);
  };

  const handleYearChange = (e) => {
    const y = Number(e.target.value);
    setYear(y);
    const maxDay = daysInEthiopianMonth(y, month);
    const d = Math.min(day, maxDay);
    setDay(d);
    emitChange(y, month, d);
  };

  const handleMonthChange = (e) => {
    const m = Number(e.target.value);
    setMonth(m);
    const maxDay = daysInEthiopianMonth(year, m);
    const d = Math.min(day, maxDay);
    setDay(d);
    emitChange(year, m, d);
  };

  const handleDayChange = (e) => {
    const d = Number(e.target.value);
    setDay(d);
    emitChange(year, month, d);
  };

  return (
    <div className={`flex gap-2 ${className || ""}`}>
      <select value={year} onChange={handleYearChange} className="input w-24">
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <select value={month} onChange={handleMonthChange} className="input flex-1">
        {monthNames.map((name, i) => (
          <option key={i + 1} value={i + 1}>{name}</option>
        ))}
      </select>
      <select value={day} onChange={handleDayChange} className="input w-20">
        {days.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
};

export default EthiopianDatePicker;
