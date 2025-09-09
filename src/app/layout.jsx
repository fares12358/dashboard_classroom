import { Cairo } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./Context/AppContext";
import { Toaster } from "react-hot-toast";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata = {
  title: "تطبيق الدخول",
  description: "واجهة تسجيل الدخول بالعربية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased w-screen h-[100dvh]`}>
        <AppProvider>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </AppProvider>
      </body>
    </html>
  );
}
