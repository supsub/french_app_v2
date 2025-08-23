// Text helpers kept tiny and reusable
export function normalize(input) {
return (input || "")
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.replace(/[’']/g, "'")
.replace(/[-–—]/g, " ")
.replace(/[?!.,;:()]/g, "")
.replace(/\s+/g, " ")
.trim();
}


export function prettify(ans = "") {
let out = ans;
out = out.replace(/\bfrancais\b/g, "français");
out = out.replace(/\ba\b/g, "à");
out = out.replace(/\bou\b/g, "où");
out = out.replace(/\bleau\b/g, "l'eau");
out = out.replace(/\bcafe\b/g, "café");
out = out.replace(/^je\b/, "Je");
out = out.replace(/\bj ai\b/g, "j'ai");
out = out.replace(/\bm appelle\b/g, "m'appelle");
out = out.replace(/\bn est\b/g, "n'est");
return out;
}