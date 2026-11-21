import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "QREXq — International Exam Preparation & AUSTY Analytics", template: "%s · QREXq" },
  description: "Original, expert-reviewed preparation for NCLEX-RN, USMLE, MCAT, IELTS, OET and more, plus AUSTY Health Care Enterprise Analytics.",
};
export const viewport: Viewport = { themeColor: "#2747d0" };

// Applies the saved theme/text-size before paint to avoid a flash.
const boot = `try{var m=document.querySelector('meta[name="color-scheme"]');var t=localStorage.getItem('qx-theme');if(m)m.content=t||'light dark';var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.dataset.theme='dark';var s=localStorage.getItem('qx-text');if(s)document.documentElement.style.setProperty('--qx-text-scale',s);}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-accent="royal" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
