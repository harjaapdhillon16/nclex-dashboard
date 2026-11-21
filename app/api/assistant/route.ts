import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { aiEnabled, studyAssistant } from "@/lib/ai";
import { rateLimit } from "@/lib/security";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`ai_assistant:${user.id}`, 30, 300);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please wait a minute before sending another message." }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      examName: string;
      messages: { role: "user" | "assistant"; content: string }[];
    };
    const lastMsg = body.messages?.[body.messages.length - 1]?.content ?? "";
    if (!aiEnabled()) {
      // Helpful offline clinical & academic study tutor fallback when ANTHROPIC_API_KEY is not set
      const reply = buildOfflineTutorReply(body.examName || "NCLEX-RN", lastMsg);
      return NextResponse.json({ reply, engine: "offline-tutor" });
    }
    const reply = await studyAssistant(body.examName || "NCLEX-RN", body.messages ?? []);
    return NextResponse.json({ reply, engine: "claude-opus-5-5" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

function buildOfflineTutorReply(examName: string, prompt: string): string {
  const q = prompt.toLowerCase();
  if (q.includes("priorit") || q.includes("first") || q.includes("abc")) {
    return `**${examName} Prioritization Framework:**\n\n1. **Airway, Breathing, Circulation (ABCs):** Unstable airway/stridor, acute hypoxia, or active hemorrhage/shock always take top priority.\n2. **Acute vs. Chronic & Unstable vs. Stable:** A client with a *new, unexpected* finding (e.g., restlessness + petechiae post-femur fracture) takes precedence over a client with expected chronic findings (e.g., COPD with baseline SpO₂ 90%).\n3. **Safety & Maslow's Hierarchy:** Address physiological threats before psychosocial needs unless there is immediate suicide/self-harm risk.`;
  }
  if (q.includes("delegat") || q.includes("uap") || q.includes("lpn") || q.includes("pn")) {
    return `**${examName} Delegation & Scope of Practice Rules:**\n\n- **RN Only (Never Delegate "EAT"):** Initial **E**valuation, initial **A**ssessment, and patient **T**eaching, plus unstable patients, IV push medications, and blood product initiation.\n- **LPN / PN:** Care for *stable* clients with predictable outcomes, reinforce RN teaching, administer routine oral/IM/subcutaneous medications, perform sterile wound dressing changes.\n- **UAP:** Routine, standardized tasks on stable clients — vital signs, intake & output, ambulation, bathing, and non-sterile specimen collection.`;
  }
  if (q.includes("acid") || q.includes("abg") || q.includes("rome")) {
    return `**ABG Interpretation Using ROME (Respiratory Opposite, Metabolic Equal):**\n\n- **Normal ranges:** pH 7.35–7.45 · PaCO₂ 35–45 mmHg · HCO₃⁻ 22–26 mEq/L\n- **Respiratory Acidosis:** ↓ pH (<7.35) and ↑ PaCO₂ (>45) — hypoventilation, COPD, opioid overdose.\n- **Respiratory Alkalosis:** ↑ pH (>7.45) and ↓ PaCO₂ (<35) — hyperventilation, anxiety, early PE.\n- **Metabolic Acidosis:** ↓ pH (<7.35) and ↓ HCO₃⁻ (<22) — DKA, lactic acidosis, renal failure, severe diarrhea.\n- **Metabolic Alkalosis:** ↑ pH (>7.45) and ↑ HCO₃⁻ (>26) — prolonged vomiting, NG suction, loop diuretics.`;
  }
  return `**${examName} Study Tutor Guide:**\n\nTo master **${prompt.slice(0, 80)}**:\n- **Recognize & Analyze Cues:** Identify abnormal vital signs, trending lab values, and high-risk medications first.\n- **Prioritize Hypotheses:** Ask "Which complication can cause irreversible harm in the next 15–30 minutes?"\n- **Take Action & Evaluate:** Verify provider orders against contraindications, implement safety precautions, and monitor the specific parameter that proves the intervention worked.\n\n*(Tip: Add \`ANTHROPIC_API_KEY\` in \`.env.local\` to enable live Claude Opus generative tutoring.)*`;
}
