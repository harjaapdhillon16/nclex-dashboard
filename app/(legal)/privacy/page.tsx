import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { Bullets, LegalDoc, LegalSection } from "@/components/legal-doc";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      intro={`This policy explains what personal information ${LEGAL.product} collects when you use our exam-preparation platform, why we collect it, who we share it with, and the choices you have.`}
    >
      <LegalSection n={1} title="Who we are">
        <p>
          {LEGAL.product} is operated by {LEGAL.entity} (&quot;we&quot;, &quot;us&quot;), {LEGAL.address}. We decide how and why your personal information is used, which makes us the
          &quot;controller&quot; of it. You can contact us at {LEGAL.email}.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Information we collect">
        <p>
          <strong>Information you give us</strong>
        </p>
        <Bullets
          items={[
            "Account details: your name, email address and a password (we store only a salted hash of it, never the password itself).",
            "Profile and study settings you choose to add: target exam date, current study level, daily question goal, preferred subjects and a profile photo.",
            "Content you create: personal notes on questions, bookmarks, answers to writing and speaking tasks, messages to the AI tutor, and reports you send us about a question.",
          ]}
        />
        <p>
          <strong>Information created as you study</strong>
        </p>
        <Bullets
          items={[
            "Your answers, scores, time spent per question, test history, flashcard progress, study streaks and the readiness and progress figures calculated from them.",
            "Which courses you open or enrol in.",
          ]}
        />
        <p>
          <strong>Technical information</strong>
        </p>
        <Bullets
          items={[
            "Your IP address and the time of important events (sign-in, password reset, account changes). We use this for security, to limit repeated sign-in attempts, and to keep an audit log.",
            "A sign-in cookie and a few settings stored in your browser (see section 5).",
          ]}
        />
        <p>We do not knowingly collect payment card details. Paid plans are not active at the time of writing (see section 6).</p>
      </LegalSection>

      <LegalSection n={3} title="How we use your information">
        <Bullets
          items={[
            "To create and secure your account, sign you in and let you reset your password.",
            "To provide the service: deliver questions and tests, save your progress, show your results and recommend what to study next.",
            "To send service messages such as email verification and password reset links, and, if you turn them on, study reminders.",
            "To improve the platform, for example by finding questions that are unclear or reported as wrong. We analyse this in aggregate where we can.",
            "To keep the platform safe: preventing abuse, investigating security issues and meeting legal obligations.",
          ]}
        />
        <p>
          Where the law requires a legal basis, we rely on performing our contract with you (providing the service), our legitimate interests (security, improving and protecting
          the service), your consent (for optional features such as reminders), and legal obligations.
        </p>
        <p>We do not sell your personal information, and we do not use it for third-party advertising.</p>
      </LegalSection>

      <LegalSection n={4} title="AI features">
        <p>
          Some features use an AI service to generate explanations, tutoring replies and feedback on writing and speaking practice. When you use one of these features, the text you
          submit (for example your question to the AI tutor, or your essay or speaking transcript) is sent to our AI provider, Anthropic, to produce the response. We send only
          what is needed for that request, not your name or email address.
        </p>
        <p>
          AI responses can be wrong. Do not enter sensitive personal information, and never enter real patient information, into any free-text field. Scores and feedback from AI
          are practice estimates only.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Cookies and browser storage">
        <Bullets
          items={[
            <span key="c1">
              <strong>Sign-in cookie</strong> (<code>qrexq_session</code>): essential. It keeps you signed in for up to 7 days and is not readable by scripts on the page.
            </span>,
            <span key="c2">
              <strong>Preference storage</strong>: your light/dark theme and text size are saved in your browser&apos;s local storage so the site looks the way you left it.
            </span>,
          ]}
        />
        <p>We do not use advertising or cross-site tracking cookies.</p>
      </LegalSection>

      <LegalSection n={6} title="Who we share information with">
        <p>We share information only with service providers who help us run the platform, under agreements that limit how they can use it:</p>
        <Bullets
          items={[
            "Database and hosting providers, which store your account and study data on our behalf.",
            "An AI provider (Anthropic), for the AI features described in section 4.",
            "An email provider, for verification and reset emails, once one is configured.",
            "A payment processor, if and when paid plans are introduced. We would update this policy first.",
          ]}
        />
        <p>
          We may also disclose information if required by law, to protect people&apos;s safety or our rights, or as part of a merger or sale of the business (in which case you
          would be told).
        </p>
      </LegalSection>

      <LegalSection n={7} title="How long we keep it">
        <p>
          We keep your account and study data while your account is open. If you ask us to delete your account, we delete or anonymise your personal information within a
          reasonable period, except where we must keep some records (for example security logs) for legal or fraud-prevention reasons. Aggregated statistics that no longer identify
          you may be kept.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Your rights and choices">
        <p>Depending on where you live, you may have the right to:</p>
        <Bullets
          items={[
            "see the personal information we hold about you and receive a copy;",
            "correct information that is wrong (you can edit most of it yourself in Profile);",
            "delete your account and data;",
            "object to or restrict certain uses, and withdraw consent you have given;",
            "complain to your local data-protection authority.",
          ]}
        />
        <p>To use any of these rights, email {LEGAL.email}. We may need to confirm it is really you before we act on a request.</p>
      </LegalSection>

      <LegalSection n={9} title="Security">
        <p>
          We protect your information with measures including hashed passwords, encrypted connections, access controls on administrator tools, sign-in attempt limits and audit
          logs. No online service can be completely secure, so please use a strong, unique password and tell us straight away if you think your account has been compromised.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Children">
        <p>
          {LEGAL.product} is intended for people preparing for professional and academic exams. It is not directed at children under 13, and we do not knowingly collect their
          information. If you are under 18, please use the platform with a parent or guardian&apos;s permission. If you believe a child has given us personal information, contact
          us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection n={11} title="International transfers">
        <p>
          Our providers may process information in countries other than your own. Where required, we use appropriate safeguards (such as standard contractual clauses) for those
          transfers.
        </p>
      </LegalSection>

      <LegalSection n={12} title="Changes to this policy">
        <p>
          We may update this policy from time to time. When we make a material change we will update the date at the top and, where appropriate, notify you in the app or by
          email.
        </p>
      </LegalSection>

      <LegalSection n={13} title="Contact us">
        <p>
          Questions about this policy or your information: {LEGAL.email}. See also our{" "}
          <Link href="/terms" className="font-semibold text-accent underline">
            Terms &amp; Conditions
          </Link>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
