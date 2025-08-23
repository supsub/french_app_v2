import React from "react";

export default function VocabularySidebar({ lesson }) {
  const vocab = (lesson?.vocab || []).map((v, i) => ({ id: i + "-" + v.fr, ...v }));
  const [search, setSearch] = React.useState("");
  const [voices, setVoices] = React.useState([]);
  const KEY = `linguaquest-vocab-${lesson?.id}`;
  const [mastered, setMastered] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
  });

  React.useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(mastered)); } catch {}
  }, [mastered, KEY]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    const fr = voices.find((v) => v.lang?.toLowerCase().startsWith("fr"));
    if (fr) u.voice = fr;
    u.lang = fr?.lang || "fr-FR";
    u.text = text;
    try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } catch {}
  };

  const filtered = vocab
    .filter((v) =>
      v.fr.toLowerCase().includes(search.toLowerCase()) ||
      v.pl.toLowerCase().includes(search.toLowerCase()) ||
      (v.ipa || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (Number(!!mastered[a.fr]) - Number(!!mastered[b.fr])) || a.fr.localeCompare(b.fr));

  const renderIPA = (ipa) => {
    if (!ipa) return null;
    const text = ipa.trim();
    const wrapped = text.startsWith("/") ? text : `/${text}/`;
    return <div className="text-xs text-slate-500 font-mono">{wrapped}</div>;
  };

  return (
    <div className="mt-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-700">Słowniczek</h2>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">{filtered.length}</span>
      </div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Szukaj… (FR/PL/IPA)"
        className="w-full mb-2 px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <ul className="space-y-2 max-h-[50vh] overflow-auto pr-1">
        {filtered.map((item) => (
          <li key={item.id} className="flex items-center gap-2 justify-between">
            <div>
              <div className="text-sm font-semibold leading-tight">{item.fr}</div>
              <div className="text-xs text-slate-600">{item.pl}</div>
              {renderIPA(item.ipa)}
              {item.pos && (
                <span className="text-[10px] mt-0.5 inline-block px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                  {item.pos}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => speak(item.fr)}
                className="text-xs px-2 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
                title="Odtwórz wymowę"
              >
                🔊
              </button>
              <label className="text-xs inline-flex items-center gap-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!mastered[item.fr]}
                  onChange={() => setMastered((m) => ({ ...m, [item.fr]: !m[item.fr] }))}
                />
                Znam
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}