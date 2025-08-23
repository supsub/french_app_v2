import React, { useMemo, useState, useEffect, useRef } from "react";

// ===============
// Translate-Only Language Game — French Beginner Level 1
// Single-file React component. Tailwind CSS for styling.
// ===============

// Utility: normalize strings for lenient answer checking
function normalize(input) {
  return (input || "")
    .toLowerCase()
    .normalize("NFD") // split accents
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[’']/g, "'")
    .replace(/[-–—]/g, " ") // hyphens to space, helps with "est-ce"
    .replace(/[?!.,;:()]/g, "") // strip punctuation
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}


// Persistence helpers (per-lesson)
const STORAGE_PREFIX = "linguaquest-progress-";
function loadProgress(lessonId) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + lessonId);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function saveProgress(lessonId, state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PREFIX + lessonId, JSON.stringify(state));
  } catch {}
}

const lessons = [
  {
    id: "fr-beg-1",
    title: "Francuski — Poziom 1 (początkujący)",
    level: "Początkujący",
    description:
      "Zacznij mówić od razu, tłumacząc całe zdania. Ta lekcja skupia się na fundamentach: zaimki, être/avoir, czasowniki -er, rodzajniki i rodzaj, podstawowa negacja, pytania i grzeczne prośby.",
    theory: () => (
      <div className="max-w-none">
        <h2 className="text-xl font-bold mb-3">Teoria — skrót przyjazny dla oka</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <section className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Zaimki osobowe</h3>
            <div className="grid grid-cols-3 gap-1 text-sm">
              <div><strong>je</strong></div><div>ja</div><div className="text-slate-500">(j' przed samogłos.)</div>
              <div><strong>tu</strong></div><div>ty</div><div/>
              <div><strong>il/elle/on</strong></div><div>on/ona/„się”</div><div/>
              <div><strong>nous</strong></div><div>my</div><div/>
              <div><strong>vous</strong></div><div>Pan/i, wy</div><div/>
              <div><strong>ils/elles</strong></div><div>oni/one</div><div/>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Être — być</h3>
            <div className="grid grid-cols-3 gap-1 text-sm">
              <div>je</div><div className="font-medium">suis</div><div>jestem</div>
              <div>tu</div><div className="font-medium">es</div><div>jesteś</div>
              <div>il/elle/on</div><div className="font-medium">est</div><div>jest</div>
              <div>nous</div><div className="font-medium">sommes</div><div>jesteśmy</div>
              <div>vous</div><div className="font-medium">êtes</div><div>jesteście</div>
              <div>ils/elles</div><div className="font-medium">sont</div><div>są</div>
            </div>
            <div className="text-sm mt-2"><span className="px-2 py-0.5 rounded-full bg-slate-100 border text-[11px]">Przykład</span> <em>Je suis Marie.</em> — Jestem Maria.</div>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Avoir — mieć</h3>
            <div className="grid grid-cols-3 gap-1 text-sm">
              <div>j'</div><div className="font-medium">ai</div><div>mam</div>
              <div>tu</div><div className="font-medium">as</div><div>masz</div>
              <div>il/elle/on</div><div className="font-medium">a</div><div>ma</div>
              <div>nous</div><div className="font-medium">avons</div><div>mamy</div>
              <div>vous</div><div className="font-medium">avez</div><div>macie</div>
              <div>ils/elles</div><div className="font-medium">ont</div><div>mają</div>
            </div>
            <div className="text-sm mt-2"><span className="px-2 py-0.5 rounded-full bg-slate-100 border text-[11px]">Przykład</span> <em>J'ai un chat.</em> — Mam kota.</div>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold mb-2">-er: parler — mówić</h3>
            <div className="grid grid-cols-3 gap-1 text-sm">
              <div>je</div><div className="font-medium">parle</div><div>mówię</div>
              <div>tu</div><div className="font-medium">parles</div><div>mówisz</div>
              <div>il/elle/on</div><div className="font-medium">parle</div><div>mówi</div>
              <div>nous</div><div className="font-medium">parlons</div><div>mówimy</div>
              <div>vous</div><div className="font-medium">parlez</div><div>mówicie</div>
              <div>ils/elles</div><div className="font-medium">parlent</div><div>mówią</div>
            </div>
            <div className="text-sm mt-2">Po <em>parler</em> bez rodzajnika: <em>parler français</em>.</div>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Rodzajniki i zgoda</h3>
            <ul className="text-sm list-disc ml-5 space-y-1">
              <li><em>un</em> (m.), <em>une</em> (f.) · <em>le/la</em> → <em>l'</em> przed samogłoską · mnoga: <em>des</em></li>
              <li>Przymiotnik zwykle po rzeczowniku i zgadza się: <em>la maison est petite</em>.</li>
            </ul>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Negacja</h3>
            <div className="text-sm"><em>ne</em> … <em>pas</em> wokół czasownika; <em>n'</em> przed samogłoską: <em>Ce n'est pas facile.</em></div>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Pytania</h3>
            <ul className="text-sm list-disc ml-5 space-y-1">
              <li>Intonacja: <em>Tu aimes le café ?</em></li>
              <li><em>Est‑ce que</em>: <em>Est‑ce que tu aimes le café ?</em></li>
              <li>Inwersja: <em>Aimes‑tu le café ?</em></li>
            </ul>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Uprzejme prośby</h3>
            <div className="text-sm"><em>Je voudrais de l'eau, s'il vous plaît.</em> — Poproszę trochę wody.</div>
          </section>
        </div>
      </div>
    ),
    
    tasks: [
      {
        id: 1,
        direction: "PL → FR",
        prompt: "Jestem Maria.",
        answers: ["je suis marie"],
        note:
          "Użyj czasownika <em>être</em>: <em>je suis</em>… Imion nie poprzedza się rodzajnikiem. Nie zamieniaj na <em>je m'appelle</em> (to znaczy «nazywam się»).",
      },
      {
        id: 2,
        direction: "PL → FR",
        prompt: "Mam kota.",
        answers: ["jai un chat", "j ai un chat"],
        note:
          "<em>Avoir</em> + rzecz: <em>j’ai</em>… Elizja: <em>je</em> + <em>ai</em> → <em>j’ai</em>. «chat» jest rodzaju męskiego → <em>un</em> chat.",
      },
      {
        id: 3,
        direction: "PL → FR",
        prompt: "Dom jest mały.",
        answers: ["la maison est petite"],
        note:
          "«Maison» jest rodzaju żeńskiego → <em>la</em>. Przymiotnik zgadza się w rodzaju: <em>petit</em> → <em>petite</em>. Z «être» przymiotnik zwykle stoi po rzeczowniku.",
      },
      {
        id: 4,
        direction: "PL → FR",
        prompt: "Mówimy trochę po francusku.",
        answers: ["nous parlons un peu francais", "on parle un peu francais"],
        note:
          "Po <em>parler</em> nie używamy rodzajnika: <em>parler français</em>, nie *parler le français*. «On» (potoczne «my») też jest poprawne.",
      },
      {
        id: 5,
        direction: "PL → FR",
        prompt: "Lubisz kawę?",
        answers: [
          "est ce que tu aimes le cafe",
          "aimes tu le cafe",
          "tu aimes le cafe",
          "aimez vous le cafe",
          "est ce que vous aimez le cafe",
        ],
        note:
          "Upodobania ogólne biorą <em>rodzajnik określony</em>: <em>le café</em>. Do wyboru 3 wzorce pytania: intonacja / <em>est‑ce que</em> / inwersja. «Vous» = forma grzecznościowa lub liczba mnoga.",
      },
      {
        id: 6,
        direction: "PL → FR",
        prompt: "To nie jest łatwe.",
        answers: ["ce nest pas facile", "ce n est pas facile"],
        note:
          "Negacja otacza czasownik: <em>ne</em>…<em>pas</em>. Przed samogłoską elizja: <em>n'</em>. Z «être» często używamy bezosobowego <em>ce</em>.",
      },
      {
        id: 7,
        direction: "PL → FR",
        prompt: "Gdzie jest dworzec?",
        answers: ["ou est la gare", "ou est la gare"],
        note:
          "<em>Où</em> + inwersja: <em>Où est… ?</em> «Gare» jest żeńska → <em>la gare</em>. Pamiętaj o akcencie w «où» w normalnym zapisie.",
      },
      {
        id: 8,
        direction: "PL → FR",
        prompt: "Poproszę trochę wody.",
        answers: [
          "je voudrais de leau sil vous plait",
          "je voudrais de leau sil te plait",
        ],
        note:
          "Uprzejma prośba: <em>Je voudrais…</em>. Przed samogłoską partitif → <em>de l'eau</em>. Formalnie <em>s'il vous plaît</em>; nieformalnie <em>s'il te plaît</em>.",
      },
      {
        id: 9,
        direction: "PL → FR",
        prompt: "Nazywam się Paweł.",
        answers: ["je mappelle paul", "je m appelle paul"],
        note:
          "Czasownik zwrotny <em>s'appeler</em>: <em>je m'appelle</em>… (je + me → <em>m'</em>). Podwójne «p». To najnaturalniejszy sposób przedstawiania się.",
      },
      {
        id: 10,
        direction: "PL → FR",
        prompt: "Jutro jedziemy do Paryża.",
        answers: ["nous allons a paris demain", "on va a paris demain"],
        note:
          "Czas teraźniejszy <em>aller</em> wyraża bliską przyszłość lub ruch. Nazwy miast z <em>à</em>: <em>à Paris</em>. «On» często = «nous». Określenia czasu (<em>demain</em>) zwykle na końcu.",
      },
    ],
  },
];

const vocabByLesson = {
  "fr-beg-1": [
    { fr: "je", pl: "ja", pos: "zaimek" },
    { fr: "suis (être)", pl: "jestem (być)", pos: "czas." },
    { fr: "avoir", pl: "mieć", pos: "czas." },
    { fr: "j'ai", pl: "mam", pos: "czas. (avoir)", hint: "elizja je + ai" },
    { fr: "un / une", pl: "rodzajnik nieokreślony m./ż.", pos: "det." },
    { fr: "le / la", pl: "rodzajnik określony", pos: "det." },
    { fr: "chat", pl: "kot", pos: "rzecz. (m)" },
    { fr: "maison", pl: "dom", pos: "rzecz. (f)" },
    { fr: "petit / petite", pl: "mały / mała", pos: "przym." },
    { fr: "parler", pl: "mówić", pos: "czas.-er" },
    { fr: "un peu", pl: "trochę", pos: "wyraż." },
    { fr: "français", pl: "francuski (język)", pos: "rzecz./przym." },
    { fr: "aimer", pl: "lubić", pos: "czas." },
    { fr: "café", pl: "kawa", pos: "rzecz." },
    { fr: "ce", pl: "to", pos: "zaimek" },
    { fr: "facile", pl: "łatwy", pos: "przym." },
    { fr: "où", pl: "gdzie", pos: "przysł." },
    { fr: "gare", pl: "dworzec", pos: "rzecz. (f)" },
    { fr: "je voudrais", pl: "chciałbym / chciałabym", pos: "zwrot" },
    { fr: "de l'eau", pl: "(trochę) wody", pos: "wyraż." },
    { fr: "s'il vous plaît", pl: "proszę (grzecz.)", pos: "zwrot" },
    { fr: "s'appeler", pl: "nazywać się", pos: "czas. zwr." },
    { fr: "je m'appelle", pl: "nazywam się", pos: "zwrot" },
    { fr: "aller", pl: "iść / jechać", pos: "czas." },
    { fr: "on", pl: "my (pot.)", pos: "zaimek" },
    { fr: "demain", pl: "jutro", pos: "przysł." },
    { fr: "à", pl: "do / w", pos: "przyim." },
    { fr: "Paris", pl: "Paryż", pos: "nazwa własna" },
  ],
};

export default function FrenchTranslateOnlyGame() {
  const [currentLessonId, setCurrentLessonId] = useState(lessons[0].id);
  const [mode, setMode] = useState("theory"); // "theory" | "practice"

  const lesson = useMemo(
    () => lessons.find((l) => l.id === currentLessonId),
    [currentLessonId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-slate-200">
        <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 py-3">
          <div className="shrink-0 w-10 h-10 rounded-2xl bg-slate-900 text-white grid place-items-center text-xl font-black">FR</div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold leading-tight">LinguaQuest — Tylko tłumaczenie</h1>
            <p className="text-sm text-slate-600">{lesson.title}</p>
          </div>
          <nav className="flex gap-2">
            <button
              onClick={() => setMode("theory")}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border ${
                mode === "theory"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white hover:bg-slate-50 border-slate-300"
              }`}
            >
              Teoria
            </button>
            <button
              onClick={() => setMode("practice")}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border ${
                mode === "practice"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white hover:bg-slate-50 border-slate-300"
              }`}
            >
              Ćwiczenia
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 px-4 py-6">
        {/* Sidebar: Lesson list (clickable) */}
        <aside className="lg:sticky lg:top-20 h-max">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700">Lekcje</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">{lessons.length}</span>
            </div>
            <ul className="space-y-1">
              {lessons.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => {
                      setCurrentLessonId(l.id);
                      setMode("theory");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-sm ${
                      l.id === currentLessonId
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="font-semibold">{l.title}</div>
                    <div className="text-xs opacity-80">{l.level} · 10 zdań</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <VocabularySidebar lesson={lesson} />
        </aside>

        {/* Main content */}
        <section>
          {mode === "theory" ? (
            <TeoriaPanel lesson={lesson} onStartĆwiczenia={() => setMode("practice")} />
          ) : (
            <ĆwiczeniaPanel lesson={lesson} />
          )}
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-4 pb-10 text-center text-xs text-slate-500">
        Zbudowane do nauki przez tłumaczenie. Wskazówka: Enter — sprawdź, Ctrl/⌘+Enter — następne.
      </footer>
    </div>
  );
}

function TeoriaPanel({ lesson, onStartĆwiczenia }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">{lesson.title}</h2>
          <p className="text-slate-600 mb-4">{lesson.description}</p>
        </div>
        <span className="shrink-0 text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Poziom 1</span>
      </div>

      {lesson.theory()}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onStartĆwiczenia}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium shadow hover:shadow-md"
        >
          Rozpocznij ćwiczenia →
        </button>
        <a
          href="#tasks-preview"
          className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-medium"
        >
          Podgląd zadań
        </a>
      </div>

      <div id="tasks-preview" className="mt-8 border-t pt-6">
        <h3 className="font-semibold mb-3">Co będziesz tłumaczyć</h3>
        <ol className="list-decimal ml-5 space-y-1 text-sm text-slate-700">
          {lesson.tasks.map((t) => (
            <li key={t.id}>
              <span className="mr-2 inline-block w-14 text-[11px] uppercase tracking-wide text-slate-500">{t.direction}</span>
              <span className="font-medium">{t.prompt}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function ĆwiczeniaPanel({ lesson }) {
  const total = lesson.tasks.length;
  const saved = loadProgress(lesson.id);
  const [index, setIndex] = useState(saved?.index ?? 0);
  const [entries, setEntries] = useState(saved?.entries ?? lesson.tasks.map(() => ""));
  const [results, setResults] = useState(saved?.results ?? lesson.tasks.map(() => null)); // null | true | false
  const [attempts, setAttempts] = useState(saved?.attempts ?? lesson.tasks.map(() => 0));
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  useEffect(() => {
    const s = loadProgress(lesson.id);
    if (s) {
      setIndex(Math.min(s.index ?? 0, total - 1));
      setEntries(Array.from({ length: total }, (_, i) => s.entries?.[i] ?? ""));
      setResults(Array.from({ length: total }, (_, i) => s.results?.[i] ?? null));
      setAttempts(Array.from({ length: total }, (_, i) => s.attempts?.[i] ?? 0));
    } else {
      setIndex(0);
      setEntries(lesson.tasks.map(() => ""));
      setResults(lesson.tasks.map(() => null));
      setAttempts(lesson.tasks.map(() => 0));
    }
  }, [lesson.id]);

  useEffect(() => {
    saveProgress(lesson.id, { index, entries, results, attempts });
  }, [lesson.id, index, entries, results, attempts]);

  const task = lesson.tasks[index];

  const correctCount = results.filter((r) => r === true).length;
  const percent = Math.round((correctCount / total) * 100);

  // Web Speech API — Pronunciation (French voice if available)
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speakFrench = (text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    const fr = voices.find((v) => v.lang?.toLowerCase().startsWith("fr"));
    if (fr) u.voice = fr;
    u.lang = fr?.lang || "fr-FR";
    u.text = text;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const handleCheck = () => {
    const user = entries[index];
    const normUser = normalize(user);
    const ok = task.answers.some((a) => normalize(a) === normUser);

    const nextResults = [...results];
    nextResults[index] = ok;
    setResults(nextResults);

    const nextAttempts = [...attempts];
    nextAttempts[index] = (nextAttempts[index] || 0) + 1;
    setAttempts(nextAttempts);

    if (ok) {
      // Auto-play pronunciation of the canonical answer (with accents reinserted)
      speakFrench(prettify(task.answers[0]));
    }
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(total - 1, i + 1));
  const goFirstUnanswered = () => {
    const first = results.findIndex((r) => r !== true);
    if (first !== -1) setIndex(first);
  };
  const resetLesson = () => {
    setEntries(lesson.tasks.map(() => ""));
    setResults(lesson.tasks.map(() => null));
    setAttempts(lesson.tasks.map(() => 0));
    setIndex(0);
    inputRef.current?.focus();
  };

  const revealAnswer = () => {
    const canonical = task.answers[0];
    const next = [...entries];
    next[index] = canonical
      .replace(/\b(ou)\b/gi, (m) => (m === m.toUpperCase() ? "OU" : "où"))
      .replace(/\bfrancais\b/g, "français")
      .replace(/\ba\b/g, "à")
      .replace(/\bleau\b/g, "l'eau");
    setEntries(next);
    setResults((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  };

  const progressBarStyle = {
    width: `${percent}%`,
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{task.direction}</span>
          <h3 className="font-semibold">Zdanie {index + 1} z {total}</h3>
        </div>
        <div className="text-sm text-slate-600">
          Wynik: <span className="font-semibold text-slate-900">{correctCount}/{total}</span> ({percent}%)
        </div>
      </div>

      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-slate-900 transition-all" style={progressBarStyle} />
      </div>

      {/* Prompt */}
      <div className="mb-4">
        <p className="text-sm text-slate-500">Przetłumacz na francuski:</p>
        <p className="text-lg sm:text-xl font-medium mt-1">{task.prompt}</p>
      </div>

      {/* Input + actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          ref={inputRef}
          type="text"
          value={entries[index]}
          onChange={(e) => {
            const next = [...entries];
            next[index] = e.target.value;
            setEntries(next);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              goNext();
            } else if (e.key === "Enter") {
              e.preventDefault();
              handleCheck();
            }
          }}
          className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
          placeholder="Wpisz tłumaczenie po francusku…"
        />
        <div className="flex gap-2">
          <button
            onClick={handleCheck}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium shadow hover:shadow-md"
          > Sprawdź </button>
          <button
            onClick={goPrev}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
            disabled={index === 0}
            title="Wstecz"
          >
            ← Wstecz
          </button>
          <button
            onClick={goNext}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
            disabled={index === total - 1}
            title="Dalej"
          >
            Dalej →
          </button>
        </div>
      </div>

      {/* Feedback */}
      {results[index] !== null && (
        <div
          className={`mt-3 text-sm px-3 py-2 rounded-xl inline-flex items-center gap-2 border ${
            results[index]
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {results[index] ? "✓ Dobrze!" : "✗ Nie całkiem. Spróbuj ponownie."}
        </div>
      )}

      {/* Pronunciation controls (shown when correct) */}
      {results[index] === true && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => speakFrench(prettify(task.answers[0]))}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-sm"
            title="Odtwórz wymowę"
          >
            🔊 Odtwórz ponownie
          </button>
          <button
            onClick={() => typeof window !== "undefined" && window.speechSynthesis?.cancel()}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-sm"
          > Zatrzymaj </button>
          <span className="text-xs text-slate-500">Używa francuskiego głosu przeglądarki (fr‑FR).</span>
        </div>
      )}

      {/* Tricky bit / justification */}
      <div className="mt-5 p-4 rounded-2xl border bg-slate-50">
        <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Wyjaśnienie trudności</div>
        <div className="text-sm text-slate-800" dangerouslySetInnerHTML={{ __html: task.note }} />
        {attempts[index] >= 3 && results[index] !== true && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <button onClick={revealAnswer} className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100">
              Pokaż odpowiedź wzorcową
            </button>
            <span className="text-xs text-slate-500">(po 3 próbach)</span>
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={goFirstUnanswered}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm"
          >
            Przejdź do pierwszego nieukończonego
          </button>
          <button
            onClick={resetLesson}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm"
          >
            Zresetuj lekcję
          </button>
        </div>
        <div className="text-sm text-slate-600">
          Akceptuje drobne różnice w interpunkcji/wielkości liter/akcentach (np. <em>Ou est</em> policzy się jako <em>Où est</em>).
        </div>
      </div>

      {/* Answer key (collapsible style) */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-900">Pokaż klucz odpowiedzi</summary>
        <ol className="list-decimal ml-5 mt-3 space-y-1 text-sm">
          {lesson.tasks.map((t) => (
            <li key={t.id}>
              <span className="text-slate-500 mr-2">{t.direction}</span>
              <span className="font-medium">
                {/* Show first canonical answer, prettified */}
                {prettify(t.answers[0])}
              </span>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}

function VocabularySidebar({ lesson }) {
  const vocab = (vocabByLesson[lesson.id] || []).map((v, i) => ({ id: i + "-" + v.fr, ...v }));
  const [search, setSearch] = React.useState("");
  const [voices, setVoices] = React.useState([]);
  const KEY = `linguaquest-vocab-${lesson.id}`;
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
    if (fr) u.voice = fr; u.lang = fr?.lang || "fr-FR"; u.text = text;
    try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } catch {}
  };
  const filtered = vocab
    .filter((v) => v.fr.toLowerCase().includes(search.toLowerCase()) || v.pl.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (Number(!!mastered[a.fr]) - Number(!!mastered[b.fr])) || a.fr.localeCompare(b.fr));
  return (
    <div className="mt-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-700">Słowniczek</h2>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">{filtered.length}</span>
      </div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Szukaj…"
        className="w-full mb-2 px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <ul className="space-y-2 max-h-[50vh] overflow-auto pr-1">
        {filtered.map((item) => (
          <li key={item.id} className="flex items-center gap-2 justify-between">
            <div>
              <div className="text-sm font-semibold leading-tight">{item.fr}</div>
              <div className="text-xs text-slate-600">{item.pl}</div>
              {item.pos && <span className="text-[10px] mt-0.5 inline-block px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">{item.pos}</span>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => speak(item.fr)} className="text-xs px-2 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50" title="Odtwórz wymowę">🔊</button>
              <label className="text-xs inline-flex items-center gap-1 cursor-pointer select-none">
                <input type="checkbox" checked={!!mastered[item.fr]} onChange={() => setMastered((m) => ({ ...m, [item.fr]: !m[item.fr] }))} />
                Znam
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function prettify(ans) {
  // Re-insert common accents for display in the key
  let out = ans;
  out = out.replace(/\bfrancais\b/g, "français");
  out = out.replace(/\ba\b/g, "à");
  out = out.replace(/\bou\b/g, "où");
  out = out.replace(/\bleau\b/g, "l'eau");
  out = out.replace(/\bcafe\b/g, "café");
  out = out.replace(/\bjes\b/g, "jes");
  // Capitalize initial "je" at start of sentence for nicer display
  out = out.replace(/^je\b/, "Je");
  // Repair common elisions visually
  out = out.replace(/\bj ai\b/g, "j'ai");
  out = out.replace(/\bm appelle\b/g, "m'appelle");
  out = out.replace(/\bn est\b/g, "n'est");
  // Coffee question variants: keep as-is (the key only shows first canonical)
  return out;
}
