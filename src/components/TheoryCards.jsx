import React from "react";

export default function TheoryCards({ sections }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {(sections || []).map((s, idx) => (
        <section key={idx} className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="font-semibold mb-2">{s.title}</h3>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: s.html }}
          />
        </section>
      ))}
    </div>
  );
}