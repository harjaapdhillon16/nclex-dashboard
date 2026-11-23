import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { Bullets, LegalDoc, LegalSection } from "@/components/legal-doc";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms & Conditions"
      intro={`These terms are the agreement between you and ${LEGAL.entity} for your use of ${LEGAL.product}. Please read them. By creating an account or using the platform you agree to them.`}
    >
      <LegalSection n={1} title="Who may use the platform">
        <p>
          You must be at least 13 years old. If you are under 18, you may use {LEGAL.product} only with the permission of a parent or guardian, who is responsible for your use. You
          must give accurate information when you register.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Your account">
        <Bullets
          items={[
            "Keep your password confidential and do not share your account. You are responsible for what happens under it.",
            "Tell us immediately if you think someone else has accessed your account.",
            "One person per account. We may suspend accounts that are shared or resold.",
          ]}
        />
      </LegalSection>

      <LegalSection n={3} title="What the platform is, and is not">
        <p>
          {LEGAL.product} is an independent educational platform for exam preparation. It offers original practice questions, lessons, cheat sheets, flashcards, case studies,
          images, practice tests and assessments.
        </p>
        <Bullets
          items={[
            <span key="t1">
              <strong>No affiliation.</strong> We are not affiliated with, endorsed by or sponsored by NCSBN, NCLEX, Pearson VUE, NBME, USMLE, IELTS partners, OET, ETS, AAMC, ADA,
              NABP, NCCPA, College Board, ACT, GMAC, AICPA or any other examination body. Their names are used only to say which exam our materials help you prepare for.
            </span>,
            <span key="t2">
              <strong>Original content.</strong> Our questions and materials are written for {LEGAL.product}. They are not real exam questions, and they do not reproduce any
              official examination.
            </span>,
            <span key="t3">
              <strong>Practice estimates only.</strong> Scores, bands, grades, readiness levels and pass predictions are estimates for practice. They are not official results,
              and we do not guarantee that you will pass any exam.
            </span>,
            <span key="t4">
              <strong>Not professional advice.</strong> Clinical, legal, financial and other material is for exam preparation only. It is not medical, legal or financial advice and
              must not replace your facility&apos;s policies, current official guidelines or professional judgement in practice.
            </span>,
          ]}
        />
        <p>We work to keep content accurate and current, but exam formats and clinical guidance change. Check the official exam body for the latest requirements.</p>
      </LegalSection>

      <LegalSection n={4} title="AI-generated content">
        <p>
          Some explanations, tutoring replies and feedback are produced by AI, and some study content is drafted with AI assistance and then reviewed. AI can make mistakes. Treat
          it as a study aid, verify important facts against official sources, and use the &quot;report&quot; option if something looks wrong.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Plans, prices and payments">
        <p>
          Paid plans (single course, bundles, all-access and institution plans) are being prepared and are not charging at the time of writing. If we introduce them, we will show
          the price, billing period, renewal terms and cancellation steps clearly before you pay, and these terms will be updated. Nothing you do on the platform today creates a
          payment obligation.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Acceptable use">
        <p>You agree not to:</p>
        <Bullets
          items={[
            "copy, scrape, redistribute, publish or resell our questions, explanations, cheat sheets, images or other materials, except for printing or saving personal copies for your own study;",
            "use bots or automated tools to extract content or to answer questions;",
            "try to break, probe or overload the platform, or access accounts or data that are not yours;",
            "upload anything unlawful, harmful or that infringes someone else's rights;",
            "enter real patient information or any other sensitive personal information into free-text fields;",
            "use the platform to cheat on a real examination or to misrepresent your results.",
          ]}
        />
      </LegalSection>

      <LegalSection n={7} title="Your content">
        <p>
          You keep ownership of the notes, answers and other content you create. You give us a limited licence to store and process it in order to run the service for you (for
          example, saving your notes and sending your writing to the AI feature you asked to use). If you report a question or send feedback, we may use it to improve the platform
          without owing you anything.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Our content and intellectual property">
        <p>
          The platform, its design, software, questions, lessons, figures and all other materials belong to {LEGAL.entity} or its licensors and are protected by intellectual
          property laws. We give you a personal, non-exclusive, non-transferable licence to use them for your own exam preparation while your account is active.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Availability and changes">
        <p>
          We aim to keep the platform available but cannot promise it will always be uninterrupted or error-free. We may change, add or remove features and content, and we may
          update courses to follow exam changes.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Suspension and ending your account">
        <p>
          You can stop using the platform and ask us to delete your account at any time. We may suspend or close an account that breaks these terms or puts the platform or other
          users at risk. Sections that by their nature should continue (such as intellectual property, disclaimers and liability) will survive.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Disclaimers">
        <p>
          The platform and its content are provided &quot;as is&quot; and &quot;as available&quot;. To the fullest extent permitted by law, we do not give any warranty about
          accuracy, completeness, fitness for a particular purpose or exam results.
        </p>
      </LegalSection>

      <LegalSection n={12} title="Limit of liability">
        <p>
          To the fullest extent permitted by law, we are not liable for indirect or consequential losses, or for loss of exam results, opportunities, income or data, arising from
          your use of the platform. Our total liability for any claim is limited to the amount you paid us in the 12 months before the claim (or, if you have paid nothing, a
          nominal sum). Nothing in these terms limits liability that cannot lawfully be limited, including for fraud or for death or personal injury caused by negligence, or your
          statutory consumer rights.
        </p>
      </LegalSection>

      <LegalSection n={13} title="Governing law">
        <p>
          These terms are governed by the laws of {LEGAL.jurisdiction}, and its courts have jurisdiction over any dispute, subject to any mandatory consumer rights you have in
          your country of residence.
        </p>
      </LegalSection>

      <LegalSection n={14} title="Changes to these terms">
        <p>
          We may update these terms. If a change is material we will tell you in the app or by email before it takes effect. Continuing to use the platform after that means you
          accept the updated terms.
        </p>
      </LegalSection>

      <LegalSection n={15} title="Contact us">
        <p>
          Questions about these terms: {LEGAL.email}. See also our{" "}
          <Link href="/privacy" className="font-semibold text-accent underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
