import Header from "@/components/header";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";


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
          <footer>
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Money-mate AI - Your smart companion for mastering finances!</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>

  );
}
