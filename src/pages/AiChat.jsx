import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import api, { API_BASE_URL } from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

const AiChat = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (question) => {
    const text = (question || input).trim();
    if (!text) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", { message: text });
      const data = res.data;

      const aiMsg = {
        role: "assistant",
        content: data.answer,
        collection: data.collection,
        records: data.records,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      toast.error(t("aiError"));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("aiError"), error: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const examples = [t("aiEx1"), t("aiEx2"), t("aiEx3"), "Find chargers in stock", "How many stock items are there?", "Show item with ID STK001"];

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 flex-1 flex flex-col">
      <div className="mb-6 pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("aiChatTitle")}</h1>
        <p className="text-slate-500 mt-1">{t("aiChatDesc")}</p>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-16">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mb-4 text-slate-300">
                <path d="M12 2a10 10 0 0 1 10 10c0 3.5-1.8 6.6-4.5 8.5L12 22l-5.5-1.5A10 10 0 0 1 2 12 10 10 0 0 1 12 2z"/>
                <path d="M8 12h8"/>
                <path d="M12 8v8"/>
              </svg>
              <p className="text-lg font-medium text-slate-500 mb-3">{t("aiExamples")}</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(ex)}
                    className="text-sm bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-600 px-4 py-2 rounded-full border border-slate-200 hover:border-primary-200 transition-all"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i}>
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white rounded-br-md"
                      : msg.error
                      ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-md"
                      : "bg-slate-100 text-slate-800 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>

              {msg.records && msg.records.length > 0 && (
                <div className="mt-3 ml-2 overflow-x-auto">
                  {msg.collection === "stock" ? (
                    <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("stockItemId")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("stockItemName")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("stockCategory")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("stockQuantity")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("stockSupplier")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("stockDateReceived")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {msg.records.map((r, idx) => (
                          <tr key={r._id || idx} className="hover:bg-slate-50">
                            <td className="px-4 py-2 font-mono text-xs text-slate-500">{r.itemId || "-"}</td>
                            <td className="px-4 py-2 font-medium text-slate-800">{r.itemName}</td>
                            <td className="px-4 py-2">
                              <span className="bg-violet-100 text-violet-800 text-xs font-semibold px-2.5 py-1 rounded-full">{r.category}</span>
                            </td>
                            <td className="px-4 py-2 text-slate-600 font-semibold">{r.quantity}</td>
                            <td className="px-4 py-2 text-slate-600">{r.supplier}</td>
                            <td className="px-4 py-2 text-slate-500">{r.dateReceived ? new Date(r.dateReceived).toLocaleDateString() : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("ownerIdLabel")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("ownerNameLabel")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("brandLabel")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("modelLabel")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("serialLabel")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("idPhoto")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("serialStickerPhoto")}</th>
                          <th className="text-left px-4 py-2 font-semibold text-slate-600 text-xs">{t("type")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {msg.records.map((r, idx) => (
                          <tr key={r._id || idx} className="hover:bg-slate-50">
                            <td className="px-4 py-2 font-medium text-slate-800">{r.ownerId}</td>
                            <td className="px-4 py-2 text-slate-600">{r.ownerName}</td>
                            <td className="px-4 py-2 text-slate-600">{r.brand}</td>
                            <td className="px-4 py-2 text-slate-600">{r.model}</td>
                            <td className="px-4 py-2 font-mono text-xs text-slate-500">{r.serialNumber}</td>
                            <td className="px-4 py-2">
                              {r.images?.studentIdPhoto ? (
                                <button onClick={() => window.open(`${API_BASE_URL}${r.images.studentIdPhoto}`, "_blank")}>
                                  <img src={`${API_BASE_URL}${r.images.studentIdPhoto}`} alt="ID" className="w-10 h-10 object-cover rounded border border-slate-200 hover:opacity-80 transition-opacity cursor-pointer" />
                                </button>
                              ) : <span className="text-slate-400 text-xs">-</span>}
                            </td>
                            <td className="px-4 py-2">
                              {r.images?.serialStickerPhoto ? (
                                <button onClick={() => window.open(`${API_BASE_URL}${r.images.serialStickerPhoto}`, "_blank")}>
                                  <img src={`${API_BASE_URL}${r.images.serialStickerPhoto}`} alt="Serial sticker" className="w-10 h-10 object-cover rounded border border-slate-200 hover:opacity-80 transition-opacity cursor-pointer" />
                                </button>
                              ) : <span className="text-slate-400 text-xs">-</span>}
                            </td>
                            <td className="px-4 py-2">
                              <span className="capitalize bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-1 rounded-full">{r.role}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{msg.records.length} record(s) found</p>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-bl-md px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-sm ml-1">{t("aiThinking")}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEnd} />
        </div>

        <div className="border-t border-slate-200 p-4 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("aiPlaceholder")}
              disabled={loading}
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              {t("aiSend")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
