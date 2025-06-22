import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NovelHub",
  description: "Read translated Chinese and Korean web novels online!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-gray-800 text-white p-4">
          <nav className="max-w-5xl mx-auto flex gap-6">
            <Link href="/" className="hover:underline font-semibold">
              Home
            </Link>
            <Link href="/novels" className="hover:underline">
              Browse Novels
            </Link>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/login" className="hover:underline ml-auto">
              Login
            </Link>
          </nav>
        </header>
        <main className="min-h-screen bg-gray-50 text-gray-900">
          {children}
        </main>
        <footer className="bg-gray-100 text-center py-4 mt-10 text-sm text-gray-600">
          © {new Date().getFullYear()} NovelHub. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
