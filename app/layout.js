import Header from "@/components/header";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";


export const metadata = {
  title: "Money-mate AI",
  description: " Your smart companion for mastering finances!",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster richColors/>
        </body>
      </html>
    </ClerkProvider>

  );
}
