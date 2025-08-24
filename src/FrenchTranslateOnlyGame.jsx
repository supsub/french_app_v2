import React, { useMemo, useState, useEffect, useRef } from "react";
import lessons from "./lessons";
import TheoryCards from "./components/TheoryCards";
import VocabularySidebar from "./components/VocabularySidebar";
import { normalize, prettify } from "./utils/text";

// Przechowujemy progres per lekcja
const STORAGE_PREFIX = "linguaquest-progress-";
const loadProgress = (lessonId) => {
    try { return JSON.parse(localStorage.getItem(STORAGE_PREFIX + lessonId) || "null"); } catch { return null; }
};
const saveProgress = (lessonId, state) => {
    try { localStorage.setItem(STORAGE_PREFIX + lessonId, JSON.stringify(state)); } catch { }
};

export default function FrenchTranslateOnlyGame() {
    const [currentLessonId, setCurrentLessonId] = useState(lessons[0].id);
    const [mode, setMode] = useState("theory"); // "theory" | "practice"
    const lesson = useMemo(() => lessons.find((l) => l.id === currentLessonId), [currentLessonId]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
            <header className="sticky top-0 z-20 backdrop-blur bg-white/90 border-b border-slate-200">
                <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 py-3">
                    <div className="shrink-0 w-10 h-10 rounded-2xl bg-slate-900 text-white grid place-items-center text-xl font-black">FR</div>
                    <div className="flex-1">
                        <h1 className="text-xl sm:text-2xl font-bold leading-tight">LinguaQuest — Tylko tłumaczenie</h1>
                        <p className="text-sm text-slate-600">{lesson.title}</p>
                    </div>
                    <nav className="flex gap-2">
                        <button onClick={() => setMode("theory")} className={`px-3 py-1.5 rounded-xl text-sm font-medium border ${mode === "theory" ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50 border-slate-300"}`}>Teoria</button>
                        <button onClick={() => setMode("practice")} className={`px-3 py-1.5 rounded-xl text-sm font-medium border ${mode === "practice" ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50 border-slate-300"}`}>Ćwiczenia</button>
                    </nav>
                </div>
            </header>

            <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 px-4 py-6">
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
                                        onClick={() => { setCurrentLessonId(l.id); setMode("theory"); }}
                                        className={`w-full text-left px-3 py-2 rounded-xl border text-sm ${l.id === currentLessonId ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50 border-slate-200"}`}
                                    >
                                        <div className="font-semibold">{l.title}</div>
                                        <div className="text-xs opacity-80">{l.level} · {l.tasks?.length || 0} zdań</div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <VocabularySidebar lesson={lesson} />
                </aside>

                <section>
                    {mode === "theory" ? (
                        <TheoryPanel lesson={lesson} onStartPractice={() => setMode("practice")} />
                    ) : (
                        <PracticePanel lesson={lesson} />
                    )}
                </section>
            </main>

            <footer className="max-w-5xl mx-auto px-4 pb-10 text-center text-xs text-slate-500">
                Zbudowane do nauki przez tłumaczenie. Wskazówka: Enter — sprawdź, Ctrl/⌘+Enter — następne.
            </footer>
        </div>
    );
}

function TheoryPanel({ lesson, onStartPractice }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold mb-1">{lesson.title}</h2>
                    <p className="text-slate-600 mb-4">{lesson.description}</p>
                </div>
                <span className="shrink-0 text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{lesson.level}</span>
            </div>

            <TheoryCards sections={lesson.theorySections || []} />

            <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={onStartPractice} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium shadow hover:shadow-md">Rozpocznij ćwiczenia →</button>
            </div>
        </div>
    );
}

function PracticePanel({ lesson }) {
    const total = lesson.tasks.length;
    const saved = loadProgress(lesson.id);
    const [index, setIndex] = useState(saved?.index ?? 0);
    const [entries, setEntries] = useState(saved?.entries ?? lesson.tasks.map(() => ""));
    const [results, setResults] = useState(saved?.results ?? lesson.tasks.map(() => null));
    const [attempts, setAttempts] = useState(saved?.attempts ?? lesson.tasks.map(() => 0));

    const inputRef = useRef(null);
    useEffect(() => { inputRef.current?.focus(); }, [index]);
    useEffect(() => {
        const s = loadProgress(lesson.id);
        if (s) {
            setIndex(Math.min(s.index ?? 0, total - 1));
            setEntries(Array.from({ length: total }, (_, i) => s.entries?.[i] ?? ""));
            setResults(Array.from({ length: total }, (_, i) => s.results?.[i] ?? null));
            setAttempts(Array.from({ length: total }, (_, i) => s.attempts?.[i] ?? 0));
        } else {
            setIndex(0); setEntries(lesson.tasks.map(() => "")); setResults(lesson.tasks.map(() => null)); setAttempts(lesson.tasks.map(() => 0));
        }
    }, [lesson.id]);
    useEffect(() => { saveProgress(lesson.id, { index, entries, results, attempts }); }, [lesson.id, index, entries, results, attempts]);

    const task = lesson.tasks[index];
    const correctCount = results.filter((r) => r === true).length;
    const percent = Math.round((correctCount / total) * 100);

    // TTS
    const [voices, setVoices] = useState([]);
    const [showNote, setShowNote] = useState(false);
    useEffect(() => {
        if (!("speechSynthesis" in window)) return;
        const load = () => setVoices(window.speechSynthesis.getVoices());
        load();
        window.speechSynthesis.onvoiceschanged = load;
        return () => { if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null; };
    }, []);
    // Reset hint visibility when changing sentence or lesson
    useEffect(() => { setShowNote(false); }, [index, lesson.id]);

    const speakFrench = (text) => {
        if (!("speechSynthesis" in window)) return;
        const u = new SpeechSynthesisUtterance(text);
        const fr = voices.find((v) => v.lang?.toLowerCase().startsWith("fr"));
        if (fr) u.voice = fr; u.lang = fr?.lang || "fr-FR"; u.text = text;
        try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } catch { }
    };
    const getCanonical = (t) => {
        const cand =
            (t && (t.speak || t.canonical || (Array.isArray(t.fullAnswers) && t.fullAnswers[0]) || t.answers?.[0])) || "";
        return prettify(cand || "");
    };

    const handleCheck = () => {
        const user = entries[index];
        let matched = null;
        const ok = task.answers.some((a) => {
            const same = normalize(a) === normalize(user);
            if (same && !matched) matched = a;
            return same;
        });
        const nextResults = [...results];
        nextResults[index] = ok;
        setResults(nextResults);

        const nextAttempts = [...attempts];
        nextAttempts[index] = (nextAttempts[index] || 0) + 1;
        setAttempts(nextAttempts);

        if (ok) {
            let speakText = getCanonical(task);
            if (task.canonMap && matched) {
                const key = normalize(matched);
                speakText = task.canonMap[key] || task.canonMap[matched] || speakText;
            }
            speakFrench(prettify(speakText));
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{task.direction}</span>
                    <h3 className="font-semibold">Zdanie {index + 1} z {total}</h3>
                </div>
                <div className="text-sm text-slate-600">Wynik: <span className="font-semibold text-slate-900">{correctCount}/{total}</span> ({percent}%)</div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-slate-900 transition-all" style={{ width: `${percent}%` }} />
            </div>

            <div className="mb-4">
                <p className="text-sm text-slate-500">Przetłumacz na francuski:</p>
                <p className="text-lg sm:text-xl font-medium mt-1">{task.prompt}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                    ref={inputRef}
                    type="text"
                    value={entries[index]}
                    onChange={(e) => { const next = [...entries]; next[index] = e.target.value; setEntries(next); }}
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setIndex((i) => Math.min(total - 1, i + 1)); } else if (e.key === "Enter") { e.preventDefault(); handleCheck(); } }}
                    className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Wpisz tłumaczenie po francusku…"
                />
                <div className="flex gap-2">
                    <button onClick={handleCheck} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium shadow hover:shadow-md">Sprawdź</button>
                    <button onClick={() => setIndex((i) => Math.max(0, i - 1))} className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50" title="Wstecz">← Wstecz</button>
                    <button onClick={() => setIndex((i) => Math.min(total - 1, i + 1))} className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50" title="Dalej">Dalej →</button>
                </div>
            </div>

            {results[index] !== null && (
                <div className={`mt-3 text-sm px-3 py-2 rounded-xl inline-flex items-center gap-2 border ${results[index] ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"}`}>
                    {results[index] ? "✓ Dobrze!" : "✗ Nie całkiem. Spróbuj ponownie."}
                </div>
            )}

            {results[index] === true && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button onClick={() => {
                        const user = entries[index] || "";
                        let speakText = getCanonical(task);
                        if (task.canonMap) {
                            const key = normalize(user);
                            speakText = task.canonMap[key] || task.canonMap[user] || speakText;
                        }
                        speakFrench(prettify(speakText));
                    }} className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-sm" title="Odtwórz wymowę">🔊 Odtwórz ponownie</button>
                    <button onClick={() => window.speechSynthesis?.cancel()} className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-sm">Zatrzymaj</button>
                    <span className="text-xs text-slate-500">Używa francuskiego głosu przeglądarki (fr‑FR).</span>
                </div>
            )}

            <div className="mt-5 p-4 rounded-2xl border bg-slate-50">
                <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Wyjaśnienie trudności</div>
                    <button onClick={() => setShowNote((v) => !v)} className="text-xs px-2 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100">{showNote ? "Ukryj wyjaśnienie" : "Pokaż wyjaśnienie"}</button>
                </div>
                {showNote && (
                    <div className="mt-2 text-sm text-slate-800" dangerouslySetInnerHTML={{ __html: task.note }} />
                )}
                {attempts[index] >= 3 && results[index] !== true && (
                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                        <button onClick={() => { const canonical = getCanonical(task); const next = [...entries]; next[index] = canonical; setEntries(next); const copy = [...results]; copy[index] = true; setResults(copy); window.setTimeout(() => speakFrench(canonical), 0); }} className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100">Pokaż odpowiedź wzorcową</button>
                        <span className="text-xs text-slate-500">(po 3 próbach)</span>
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                    <button onClick={() => { const first = results.findIndex((r) => r !== true); if (first !== -1) setIndex(first); }} className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm">Przejdź do pierwszego nieukończonego</button>
                    <button onClick={() => { const freshEntries = lesson.tasks.map(() => ""); const freshResults = lesson.tasks.map(() => null); const freshAttempts = lesson.tasks.map(() => 0); setEntries(freshEntries); setResults(freshResults); setAttempts(freshAttempts); setIndex(0); saveProgress(lesson.id, { index: 0, entries: freshEntries, results: freshResults, attempts: freshAttempts }); }} className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm">Zresetuj lekcję</button>
                </div>
                <div className="text-sm text-slate-600">Akceptuje drobne różnice w interpunkcji/wielkości liter/akcentach.</div>
            </div>

            <details className="mt-6">
                <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-900">Pokaż klucz odpowiedzi</summary>
                <ol className="list-decimal ml-5 mt-3 space-y-1 text-sm">
                    {lesson.tasks.map((t) => (
                        <li key={t.id}><span className="text-slate-500 mr-2">{t.direction}</span><span className="font-medium">{getCanonical(t)}</span></li>
                    ))}
                </ol>
            </details>
        </div>
    );
}