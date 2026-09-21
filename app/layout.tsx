import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pitch Diary — Track Your Grassroots Football Journey",
  description:
    "Log your matches, stats and best moments. Pitch Diary is the home for your grassroots football career.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light-classic"
      suppressHydrationWarning
      className={`${manrope.variable} h-full antialiased`}
    >
      <head>
        <script
          // Runs before paint to avoid a flash of the wrong style on load. The
          // type toggle avoids React's dev-mode "script tags never execute on
          // the client" warning — this only ever needs to run on the initial
          // server-rendered HTML, which is unaffected by the client type.
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme');if(!m){m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var styleKey=m==='dark'?'themeStyleDark':'themeStyleLight';var s=localStorage.getItem(styleKey)||(m==='dark'?'forest':'classic');document.documentElement.setAttribute('data-theme',m+'-'+s);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream-200 text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
