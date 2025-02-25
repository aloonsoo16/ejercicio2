import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";

export const metadata = {
  title: "Ejercicio 2 Prueba - Alonso",
  description: "Ejercicio 2 de la prueba técnica Alonso Mangas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="antialiased">
        <main className="min-h-screen  lg:py-8 flex justify-center items-center mx-auto">
          {children}
        </main>

        <Toaster
          toastOptions={{
            className: "rounded-full",
          }}
          className={GeistSans.className}
        />
      </body>
    </html>
  );
}