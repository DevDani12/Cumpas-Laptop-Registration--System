import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api/axios";

const STATUS = {
  VERIFIED: "verified",
  NOT_FOUND: "not_found",
  LOADING: "loading",
};

const ROLE_LABELS = {
  student: "Student",
  trainer: "Trainer",
  guest: "Guest",
  staff: "Staff",
  surveyor: "Surveyor",
};

const computeStatus = (laptop) => {
  if (!laptop) return STATUS.NOT_FOUND;
  const created = new Date(laptop.createdAt);
  const now = new Date();
  const yearsSince = (now - created) / (1000 * 60 * 60 * 24 * 365);
  return yearsSince < 1 ? STATUS.VERIFIED : STATUS.NOT_FOUND;
};

const formatId = (ownerId) => {
  const year = new Date().getFullYear();
  const num = ownerId.replace(/\D/g, "").slice(-4) || "0000";
  return `#REG-${year}-${num}`;
};

const formatTime = (date) =>
  date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

const MemberId = ({ id }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 group">
      <span className="text-xs font-mono tracking-wide">{id}</span>
      <svg className={`w-3.5 h-3.5 transition-colors ${copied ? "text-green-400" : "text-slate-500 group-hover:text-slate-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {copied ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        )}
      </svg>
    </button>
  );
};

const CheckPulse = () => (
  <div className="animate-check-pulse w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  </div>
);

const VerifyQR = () => {
  const { id } = useParams();
  const [laptop, setLaptop] = useState(null);
  const [status, setStatus] = useState(STATUS.LOADING);
  const [error, setError] = useState(null);
  const [scanTime] = useState(() => new Date());
  const [liveTime, setLiveTime] = useState(new Date());
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLaptop = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/public/laptop/${id}`);
        if (res.data.success && res.data.data) {
          setLaptop(res.data.data);
          setStatus(computeStatus(res.data.data));
        } else {
          setStatus(STATUS.NOT_FOUND);
        }
      } catch {
        setStatus(STATUS.NOT_FOUND);
        setError("Could not find this registration record.");
      } finally {
        setTimeout(() => setShowContent(true), 100);
      }
    };
    fetchLaptop();
  }, [id]);

  const isVerified = status === STATUS.VERIFIED;

  const expiryDate = useMemo(() => {
    if (!laptop) return null;
    const d = new Date(laptop.createdAt);
    d.setFullYear(d.getFullYear() + 1);
    return d;
  }, [laptop]);

  const profileImage = laptop?.images?.studentIdPhoto || null;

  if (status === STATUS.LOADING) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Verifying registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className={`w-full max-w-sm transition-all duration-500 ease-out ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

        {/* Status Banner */}
        <div className={`rounded-2xl p-6 mb-4 text-center shadow-lg transition-all duration-500 ${
          isVerified
            ? "bg-gradient-to-br from-emerald-500 to-emerald-700"
            : "bg-gradient-to-br from-red-500 to-red-700"
        }`}>
          {isVerified ? <CheckPulse /> : (
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
          )}

          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {isVerified ? "VERIFIED MEMBER" : "UNVERIFIED / EXPIRED"}
          </h1>
          {isVerified ? (
            <p className="text-emerald-100 text-sm mt-1 font-medium">Authentic & Active Account</p>
          ) : (
            <p className="text-red-100 text-sm mt-1">
              {error || "This registration could not be verified or has expired."}
            </p>
          )}
        </div>

        {/* Anti-Spoofing Bar */}
        <div className="flex items-center justify-between bg-slate-900 rounded-xl px-4 py-3 mb-4 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isVerified ? "bg-emerald-400" : "bg-red-400"}`} style={{ boxShadow: isVerified ? "0 0 10px rgba(52,211,153,0.6)" : "0 0 10px rgba(248,113,113,0.6)" }} />
            <span className="text-white text-xs font-semibold">LIVE</span>
            <span className="text-slate-400 text-xs">Scanned at {formatTime(scanTime)}</span>
          </div>
          <span className="text-slate-500 text-[10px] font-mono">{formatTime(liveTime)}</span>
        </div>

        {/* Profile Card */}
        <div className={`bg-slate-900 rounded-2xl p-5 mb-4 border-2 transition-all duration-500 ${
          isVerified ? "border-emerald-500/50" : "border-red-500/50"
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0 transition-colors duration-500 ${
              isVerified ? "border-emerald-400" : "border-red-400"
            }`}>
              {profileImage ? (
                <img src={profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-white text-lg font-bold truncate">{laptop?.ownerName || "Unknown"}</h2>
              <MemberId id={formatId(laptop?.ownerId || "0000")} />
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-800/60 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
              </svg>
              <span className="text-slate-300 text-sm font-medium capitalize">{ROLE_LABELS[laptop?.role] || laptop?.role || "—"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isVerified ? "bg-emerald-400" : "bg-red-400"}`} />
              <span className={`text-xs font-semibold ${isVerified ? "text-emerald-400" : "text-red-400"}`}>
                {isVerified ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
          <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider text-slate-400">Verification Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Registration Date</span>
              <span className="text-white text-sm font-medium">
                {laptop?.createdAt ? new Date(laptop.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
              </span>
            </div>
            <div className="border-t border-slate-800" />
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Expiry Date</span>
              <span className={`text-sm font-medium ${expiryDate && expiryDate < new Date() ? "text-red-400" : "text-white"}`}>
                {expiryDate ? expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
              </span>
            </div>
            <div className="border-t border-slate-800" />
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Membership Status</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isVerified
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
              }`}>
                {isVerified ? "Active" : "Inactive"}
              </span>
            </div>
            {laptop?.affiliation && (
              <>
                <div className="border-t border-slate-800" />
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Department</span>
                  <span className="text-white text-sm font-medium">{laptop.affiliation}</span>
                </div>
              </>
            )}
            {laptop?.brand && (
              <>
                <div className="border-t border-slate-800" />
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Device</span>
                  <span className="text-white text-sm font-medium">{laptop.brand} {laptop.model}</span>
                </div>
              </>
            )}
            {laptop?.serialNumber && (
              <>
                <div className="border-t border-slate-800" />
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Serial No.</span>
                  <span className="text-white font-mono text-xs">{laptop.serialNumber}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-[10px] mt-6">
          Nefas Silk Polytechnic College &middot; Campus Security
        </p>
      </div>
    </div>
  );
};

export default VerifyQR;
