"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Send, Sparkles } from "lucide-react";

const STARTERS = [
  "How do I prioritize between 4 patients on the NCLEX-RN?",
  "What tasks can an RN delegate to an LPN/PN vs a UAP?",
  "Explain ABG interpretation using the ROME method with examples.",
  "Summarize high-alert insulin types (onset, peak, duration) and DKA protocol.",
];

export default function ExamAssistantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const examLabel = slug.toUpperCase().replace(/-/g, " ");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: `Hello! I'm your QREXq Study Tutor for **${examLabel}**. Ask me about prioritization, delegation, pharmacology, dosage calculations, NGN case-study strategies, or any topic on your exam blueprint.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendPrompt(text: string) {
    const clean = text.trim();
    if (!clean || loading) return;
    const nextHistory = [...messages, { role: "user" as const, content: clean }];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examName: examLabel, messages: nextHistory }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setMessages([
        ...nextHistory,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "Unable to generate response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div>
        <Link
          href={`/exam/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {examLabel} Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Bot className="h-6 w-6 text-accent" />
              {examLabel} AI Study Tutor
            </h1>
            <p className="text-xs sm:text-sm muted">
              Interactive clinical judgment, mnemonics, pharmacology explanations, and test-taking strategy assistant.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Starter Prompts */}
      <div className="flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => void sendPrompt(s)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <Sparkles className="h-3 w-3 text-accent" />
            {s}
          </button>
        ))}
      </div>

      {/* Chat Log */}
      <div className="panel panel-pad space-y-4 min-h-[380px] flex flex-col justify-between">
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                m.role === "user"
                  ? "ml-auto max-w-xl bg-accent text-white"
                  : "mr-auto max-w-2xl border border-border bg-muted/40"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && <div className="text-xs muted animate-pulse">Study Tutor is preparing an explanation…</div>}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendPrompt(input);
          }}
          className="flex items-center gap-2 pt-3 border-t border-border"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask a ${examLabel} study question…`}
            className="field text-xs sm:text-sm"
          />
          <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary">
            <Send className="h-4 w-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
