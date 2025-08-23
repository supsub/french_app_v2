const lesson1 = {
  id: "fr-beg-1",
  title: "Francuski — Poziom 1 (początkujący)",
  level: "Początkujący",
  description:
    "Zacznij mówić od razu, tłumacząc całe zdania. Ta lekcja skupia się na fundamentach: zaimki, être/avoir, czasowniki -er, rodzajniki i rodzaj, podstawowa negacja, pytania i grzeczne prośby.",
  theorySections: [
    { title: "Zaimki osobowe", html: `
      <div class="grid grid-cols-3 gap-1 text-sm">
        <div><strong>je</strong></div><div>ja</div><div class="text-slate-500">(j’ przed samogł.)</div>
        <div><strong>tu</strong></div><div>ty</div><div></div>
        <div><strong>il/elle/on</strong></div><div>on/ona/„ono”</div><div></div>
        <div><strong>nous</strong></div><div>my</div><div></div>
        <div><strong>vous</strong></div><div>Pan/i, wy</div><div></div>
        <div><strong>ils/elles</strong></div><div>oni/one</div><div></div>
      </div>` },
    { title: "Être — być", html: `
      <div class="grid grid-cols-3 gap-1 text-sm">
        <div>je</div><div class="font-medium">suis</div><div>jestem</div>
        <div>tu</div><div class="font-medium">es</div><div>jesteś</div>
        <div>il/elle/on</div><div class="font-medium">est</div><div>jest</div>
        <div>nous</div><div class="font-medium">sommes</div><div>jesteśmy</div>
        <div>vous</div><div class="font-medium">êtes</div><div>jesteście</div>
        <div>ils/elles</div><div class="font-medium">sont</div><div>są</div>
      </div>
      <div class="text-sm mt-2"><span class="px-2 py-0.5 rounded-full bg-slate-100 border text-[11px]">Przykład</span> <em>Je suis Marie.</em> — Jestem Maria.</div>` },
    { title: "Avoir — mieć", html: `
      <div class="grid grid-cols-3 gap-1 text-sm">
        <div>j'</div><div class="font-medium">ai</div><div>mam</div>
        <div>tu</div><div class="font-medium">as</div><div>masz</div>
        <div>il/elle/on</div><div class="font-medium">a</div><div>ma</div>
        <div>nous</div><div class="font-medium">avons</div><div>mamy</div>
        <div>vous</div><div class="font-medium">avez</div><div>macie</div>
        <div>ils/elles</div><div class="font-medium">ont</div><div>mają</div>
      </div>
      <div class="text-sm mt-2"><span class="px-2 py-0.5 rounded-full bg-slate-100 border text-[11px]">Przykład</span> <em>J'ai un chat.</em> — Mam kota.</div>` },
    { title: "-er: parler — mówić", html: `
      <div class="grid grid-cols-3 gap-1 text-sm">
        <div>je</div><div class="font-medium">parle</div><div>mówię</div>
        <div>tu</div><div class="font-medium">parles</div><div>mówisz</div>
        <div>il/elle/on</div><div class="font-medium">parle</div><div>mówi</div>
        <div>nous</div><div class="font-medium">parlons</div><div>mówimy</div>
        <div>vous</div><div class="font-medium">parlez</div><div>mówicie</div>
        <div>ils/elles</div><div class="font-medium">parlent</div><div>mówią</div>
      </div>
      <div class="text-sm mt-2">Po <em>parler</em> bez rodzajnika: <em>parler français</em>.</div>` },
    { title: "Rodzajniki i zgoda", html: `
      <ul class="text-sm list-disc ml-5 space-y-1">
        <li><em>un</em> (m.), <em>une</em> (f.) · <em>le/la</em> → <em>l'</em> · mnoga: <em>des</em></li>
        <li>Przymiotnik zwykle po rzeczowniku i zgadza się: <em>la maison est petite</em>.</li>
      </ul>` },
    { title: "Negacja", html: `<div class="text-sm"><em>ne</em> … <em>pas</em>; <em>n'</em> przed samogłoską: <em>Ce n'est pas facile.</em></div>` },
    { title: "Pytania", html: `
      <ul class="text-sm list-disc ml-5 space-y-1">
        <li>Intonacja: <em>Tu aimes le café ?</em></li>
        <li><em>Est‑ce que</em>: <em>Est‑ce que tu aimes le café ?</em></li>
        <li>Inwersja: <em>Aimes‑tu le café ?</em></li>
      </ul>` },
    { title: "Uprzejme prośby", html: `<div class="text-sm"><em>Je voudrais de l'eau, s'il vous plaît.</em> — Poproszę trochę wody.</div>` },
  ],
  tasks: [
    { id: 1, direction: "PL → FR", prompt: "Jestem Maria.", answers: ["je suis marie"], note: "Użyj <em>être</em>: <em>je suis</em>… Imion nie poprzedza się rodzajnikiem. Nie zamieniaj na <em>je m'appelle</em>." },
    { id: 2, direction: "PL → FR", prompt: "Mam kota.", answers: ["jai un chat", "j ai un chat"], note: "<em>Avoir</em> + rzecz: <em>j’ai</em>… Elizja: <em>je</em> + <em>ai</em> → <em>j’ai</em>. «chat» m. → <em>un</em> chat." },
    { id: 3, direction: "PL → FR", prompt: "Dom jest mały.", answers: ["la maison est petite"], note: "«Maison» f. → <em>la</em>. Zgoda: <em>petit</em> → <em>petite</em>." },
    { id: 4, direction: "PL → FR", prompt: "Mówimy trochę po francusku.", answers: ["nous parlons un peu francais", "on parle un peu francais"], note: "Po <em>parler</em> bez rodzajnika: <em>parler français</em>. «On» = potoczne «nous»." },
    { id: 5, direction: "PL → FR", prompt: "Lubisz kawę?", answers: ["est ce que tu aimes le cafe", "aimes tu le cafe", "tu aimes le cafe", "aimez vous le cafe", "est ce que vous aimez le cafe"], note: "Upodobania: <em>le café</em>. 3 wzorce pytania: intonacja / <em>est‑ce que</em> / inwersja." },
    { id: 6, direction: "PL → FR", prompt: "To nie jest łatwe.", answers: ["ce nest pas facile", "ce n est pas facile"], note: "Negacja: <em>ne… pas</em>; elizja <em>n'</em>." },
    { id: 7, direction: "PL → FR", prompt: "Gdzie jest dworzec?", answers: ["ou est la gare"], note: "<em>Où</em> + inwersja: <em>Où est… ?</em> «gare» f. → <em>la</em>." },
    { id: 8, direction: "PL → FR", prompt: "Poproszę trochę wody.", answers: ["je voudrais de leau sil vous plait", "je voudrais de leau sil te plait"], note: "<em>Je voudrais…</em>. Partitif: <em>de l'eau</em>." },
    { id: 9, direction: "PL → FR", prompt: "Nazywam się Paweł.", answers: ["je mappelle paul", "je m appelle paul"], note: "<em>s'appeler</em>: <em>je m'appelle</em>." },
    { id: 10, direction: "PL → FR", prompt: "Jutro jedziemy do Paryża.", answers: ["nous allons a paris demain", "on va a paris demain"], note: "<em>aller</em> (bliska przyszłość), <em>à Paris</em>, okolicznik na końcu." },
  ],
  vocab: [
    { fr: "je", pl: "ja", pos: "zaimek", ipa: "ʒə" },
    { fr: "suis (être)", pl: "jestem (być)", pos: "czas.", ipa: "sɥi" },
    { fr: "avoir", pl: "mieć", pos: "czas.", ipa: "avwaʁ" },
    { fr: "j'ai", pl: "mam", pos: "czas. (avoir)", hint: "elizja je + ai", ipa: "ʒe" },
    { fr: "un / une", pl: "rodz. nieokreślony", pos: "det.", ipa: "œ̃ / yn" },
    { fr: "le / la", pl: "rodz. określony", pos: "det.", ipa: "lə / la" },
    { fr: "chat", pl: "kot", pos: "rzecz. (m)", ipa: "ʃa" },
    { fr: "maison", pl: "dom", pos: "rzecz. (f)", ipa: "mɛzɔ̃" },
    { fr: "petit / petite", pl: "mały / mała", pos: "przym.", ipa: "pəti / pətit" },
    { fr: "parler", pl: "mówić", pos: "czas.-er", ipa: "paʁle" },
    { fr: "un peu", pl: "trochę", pos: "wyraż.", ipa: "œ̃ pø" },
    { fr: "français", pl: "francuski (język)", pos: "rzecz./przym.", ipa: "fʁɑ̃sɛ" },
    { fr: "aimer", pl: "lubić", pos: "czas.", ipa: "eme" },
    { fr: "café", pl: "kawa", pos: "rzecz.", ipa: "kafe" },
    { fr: "ce", pl: "to", pos: "zaimek", ipa: "sə" },
    { fr: "facile", pl: "łatwy", pos: "przym.", ipa: "fasil" },
    { fr: "où", pl: "gdzie", pos: "przysł.", ipa: "u" },
    { fr: "gare", pl: "dworzec", pos: "rzecz. (f)", ipa: "ɡaʁ" },
    { fr: "je voudrais", pl: "chciałbym / chciałabym", pos: "zwrot", ipa: "ʒə vudʁɛ" },
    { fr: "de l'eau", pl: "(trochę) wody", pos: "wyraż.", ipa: "də lo" },
    { fr: "s'il vous plaît", pl: "proszę (grzecz.)", pos: "zwrot", ipa: "sil vu plɛ" },
    { fr: "s'appeler", pl: "nazywać się", pos: "czas. zwr.", ipa: "sap(ə)le" },
    { fr: "je m'appelle", pl: "nazywam się", pos: "zwrot", ipa: "ʒə mapɛl" },
    { fr: "aller", pl: "iść / jechać", pos: "czas.", ipa: "ale" },
    { fr: "on", pl: "my (pot.)", pos: "zaimek", ipa: "ɔ̃" },
    { fr: "demain", pl: "jutro", pos: "przysł.", ipa: "dəmɛ̃" },
    { fr: "à", pl: "do / w", pos: "przyim.", ipa: "a" },
    { fr: "Paris", pl: "Paryż", pos: "nazwa własna", ipa: "paʁi" },
  ],
};

export default lesson1;