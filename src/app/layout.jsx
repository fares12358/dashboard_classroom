import { Cairo } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./Context/AppContext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata = {
  title: "لوحة التحكم",
  description: "لوحة تحكم إدارة الكلاسات",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable}`}
        style={{ fontFamily: "var(--font-cairo, Cairo, sans-serif)" }}
      >
        <AppProvider>
          {/* Global toast notifications */}
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                background: "var(--bg-card)",
                color: "var(--text-main)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-cairo)",
                fontSize: "0.88rem",
              },
              success: { iconTheme: { primary: "var(--green)", secondary: "var(--bg-card)" } },
              error:   { iconTheme: { primary: "var(--red)",   secondary: "var(--bg-card)" } },
            }}
          />

          {/* Google Identity Services for YouTube OAuth */}
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="beforeInteractive"
          />

          {children}
        </AppProvider>
      </body>
    </html>
  );
}
